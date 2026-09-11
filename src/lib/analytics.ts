type YandexMetrika = (
  counterId: number,
  method: string,
  ...args: unknown[]
) => void;

export function metrikaCounterId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  return raw && /^\d+$/.test(raw) ? Number(raw) : null;
}

export function reachGoal(goal: string, params?: Record<string, string>): void {
  if (typeof window === "undefined") return;

  const counterId = metrikaCounterId();
  if (counterId === null) return;

  const ym = (window as unknown as { ym?: YandexMetrika }).ym;
  if (typeof ym !== "function") return;

  try {
    if (params) {
      ym(counterId, "reachGoal", goal, params);
    } else {
      ym(counterId, "reachGoal", goal);
    }
  } catch {
    return;
  }
}
