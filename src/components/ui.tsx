import type { Feasibility } from "@/lib/types";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#176b5b]">
        {eyebrow}
      </p>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-neutral-950 md:text-4xl">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-neutral-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-800">
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-[#176b5b] focus:ring-2 focus:ring-[#176b5b]/15";

export const textareaClass =
  "min-h-24 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-[#176b5b] focus:ring-2 focus:ring-[#176b5b]/15";

export function FeasibilityBadge({ value }: { value: Feasibility }) {
  const styles: Record<Feasibility, string> = {
    realistic: "border-emerald-200 bg-emerald-50 text-emerald-800",
    stretched: "border-blue-200 bg-blue-50 text-blue-800",
    risky: "border-amber-200 bg-amber-50 text-amber-900",
    conflicting: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold capitalize ${styles[value]}`}
    >
      {value}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "teal",
}: {
  value: number;
  tone?: "teal" | "amber" | "red" | "blue";
}) {
  const width = `${Math.min(100, Math.max(0, Math.round(value * 100)))}%`;
  const toneClass = {
    teal: "bg-[#176b5b]",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
  }[tone];

  return (
    <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
      <div className={`h-full rounded-full ${toneClass}`} style={{ width }} />
    </div>
  );
}

export function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-white/70 p-6">
      <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
    </div>
  );
}
