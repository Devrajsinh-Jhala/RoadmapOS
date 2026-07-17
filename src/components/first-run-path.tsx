import {
  ArrowRight,
  Check,
  Clock3,
  Compass,
  LockKeyhole,
  Target,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { formatInr } from "@/lib/format";
import type { ConstraintReport } from "@/lib/types";

export function FirstRunPath({ report }: { report: ConstraintReport }) {
  const steps = [
    {
      label: "Setup",
      detail: "Money and time limits saved",
      status: "complete",
      Icon: UserRound,
    },
    {
      label: "Goals",
      detail: "Add 2 to 4 goals now",
      status: "current",
      Icon: Target,
    },
    {
      label: "Roadmap",
      detail: "Unlocks after goals",
      status: "locked",
      Icon: Compass,
    },
    {
      label: "Today",
      detail: "Daily minimums appear here",
      status: "locked",
      Icon: LockKeyhole,
    },
  ] as const;

  return (
    <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="bg-neutral-950 p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase text-emerald-300">Setup complete</p>
        <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-2xl text-2xl font-semibold">
              Now give RoadmapOS something meaningful to sequence.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
              Add career, money, health, or life goals. The conflict engine becomes useful when it can compare them together.
            </p>
          </div>
          <Link
            href="/goals"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-neutral-950"
          >
            Add my goals
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      <ol className="grid divide-y divide-neutral-200 md:grid-cols-4 md:divide-x md:divide-y-0">
        {steps.map(({ label, detail, status, Icon }, index) => (
          <li key={label} className="p-4">
            <div className="flex items-start gap-3">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                  status === "complete"
                    ? "bg-emerald-100 text-emerald-800"
                    : status === "current"
                      ? "bg-[#176b5b] text-white"
                      : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {status === "complete" ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <Icon className="size-4" aria-hidden />
                )}
              </span>
              <div>
                <p className="text-xs font-medium text-neutral-500">Step {index + 1}</p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-950">{label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid border-t border-neutral-200 bg-neutral-50 sm:grid-cols-3 sm:divide-x sm:divide-neutral-200">
        <div className="p-4">
          <div className="flex items-center gap-2 text-neutral-500">
            <WalletCards className="size-4" aria-hidden />
            <p className="text-xs font-semibold uppercase">Safe goal capacity</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-neutral-950">
            {formatInr(report.safeMonthlyCapacity)}/month
          </p>
        </div>
        <div className="border-t border-neutral-200 p-4 sm:border-t-0">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock3 className="size-4" aria-hidden />
            <p className="text-xs font-semibold uppercase">Safe goal time</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-neutral-950">
            {Math.round(report.safeDailyMinutes)} minutes/day
          </p>
        </div>
        <div className="border-t border-neutral-200 p-4 sm:border-t-0">
          <p className="text-xs font-semibold uppercase text-neutral-500">Emergency target</p>
          <p className="mt-2 text-lg font-semibold text-neutral-950">
            {formatInr(report.emergencyFundTarget)}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CapacityReady({ report }: { report: ConstraintReport }) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Check className="size-4 text-emerald-800" aria-hidden />
            <p className="text-sm font-semibold text-emerald-950">Setup is ready</p>
          </div>
          <p className="mt-1 text-sm leading-6 text-emerald-900">
            Goals can use up to {formatInr(report.safeMonthlyCapacity)} per month and {Math.round(report.safeDailyMinutes)} minutes per day.
          </p>
        </div>
        <Link href="/setup" className="shrink-0 text-sm font-semibold text-[#176b5b]">
          Edit setup
        </Link>
      </div>
    </section>
  );
}
