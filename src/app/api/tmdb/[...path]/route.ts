import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.themoviedb.org/3";
const ALLOWED_PATH =
  /^(?:trending\/(?:movie|tv)\/(?:day|week)|(?:movie|tv)\/(?:popular|now_playing|top_rated)|tv\/popular|search\/multi|discover\/(?:movie|tv)|genre\/(?:movie|tv)\/list|(?:movie|tv)\/\d+(?:\/(?:credits|videos|recommendations|similar))?)$/;
const ALLOWED_PARAMS = new Set([
  "language",
  "page",
  "query",
  "include_adult",
  "sort_by",
  "with_genres",
  "primary_release_year",
  "first_air_date_year",
  "vote_average.gte",
  "vote_average.lte",
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = path.join("/");
  if (!ALLOWED_PATH.test(endpoint)) {
    return NextResponse.json({ error: "Endpoint não permitido." }, { status: 404 });
  }

  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Configure TMDB_READ_ACCESS_TOKEN no servidor para consultar títulos." },
      { status: 503 },
    );
  }

  const search = new URLSearchParams();
  request.nextUrl.searchParams.forEach((value, key) => {
    if (ALLOWED_PARAMS.has(key)) search.set(key, value);
  });
  if (!search.has("language")) search.set("language", "pt-BR");

  const page = Number(search.get("page") ?? 1);
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return NextResponse.json({ error: "Página inválida." }, { status: 400 });
  }
  if (endpoint === "search/multi" && !search.get("query")?.trim()) {
    return NextResponse.json({ error: "Informe um termo para pesquisar." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE}/${endpoint}?${search.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const status = response.status === 429 ? 429 : response.status;
      return NextResponse.json(
        {
          error:
            status === 429
              ? "Muitas consultas em pouco tempo. Aguarde um instante e tente novamente."
              : `Erro ao consultar a TMDB (${status}).`,
        },
        { status },
      );
    }

    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível conectar à TMDB. Verifique sua conexão e tente novamente." },
      { status: 502 },
    );
  }
}
