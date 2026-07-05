export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${value}T00:00:00+05:30`));
}

export function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

export function weekStartIso(date = new Date()) {
  const zoned = new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date),
  );
  const day = zoned.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  zoned.setDate(zoned.getDate() + diff);
  return zoned.toISOString().slice(0, 10);
}

export function toPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value * 100)}%`;
}
