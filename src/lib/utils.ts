export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1).replace(".", ",") : "—";
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(1, page), Math.max(1, totalPages));
}

export function debounce<T extends (...args: never[]) => void>(callback: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
}
