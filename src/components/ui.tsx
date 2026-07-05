import {
  cloneElement,
  isValidElement,
  useId,
  type ReactNode,
} from "react";
import type { Feasibility } from "@/lib/types";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
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
  children: ReactNode;
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
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  const hintId = `${generatedId}-hint`;
  let labelFor = generatedId;
  let control = children;

  if (isValidElement<{ id?: string; "aria-describedby"?: string }>(children)) {
    const existingId = children.props.id ?? generatedId;
    const describedBy = hint
      ? [children.props["aria-describedby"], hintId].filter(Boolean).join(" ")
      : children.props["aria-describedby"];

    labelFor = existingId;
    control = cloneElement(children, {
      id: existingId,
      ...(hint ? { "aria-describedby": describedBy } : {}),
    });
  }

  return (
    <div className="grid min-w-0 gap-2 text-sm font-medium text-neutral-800">
      <label htmlFor={labelFor}>{label}</label>
      {control}
      {hint ? (
        <span id={hintId} className="text-xs font-normal leading-5 text-neutral-500">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export const inputClass =
  "h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-3 text-base text-neutral-950 outline-none transition focus:border-[#176b5b] focus:ring-2 focus:ring-[#176b5b]/15 sm:text-sm";

export const textareaClass =
  "min-h-24 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-950 outline-none transition focus:border-[#176b5b] focus:ring-2 focus:ring-[#176b5b]/15 sm:text-sm";

export function PageGuide({
  title,
  text,
  steps,
}: {
  title: string;
  text: string;
  steps: string[];
}) {
  return (
    <aside className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
        Simple path
      </p>
      <h2 className="mt-2 text-lg font-semibold text-neutral-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{text}</p>
      <ol className="mt-4 grid gap-2">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-6 text-neutral-700">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-[#176b5b] ring-1 ring-emerald-200">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

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
