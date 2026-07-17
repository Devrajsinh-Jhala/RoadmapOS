import {
  AlertTriangle,
  Clock3,
  IndianRupee,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { FeasibilityBadge, ProgressBar } from "@/components/ui";
import { formatInr, toPercent } from "@/lib/format";
import type { ConstraintReport } from "@/lib/types";

export function PlanHealth({ report }: { report: ConstraintReport }) {
  const isBlocked = report.feasibility === "conflicting";
  const alertClass = isBlocked
    ? "border-red-200 bg-red-50 text-red-950"
    : report.feasibility === "risky"
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : "border-emerald-200 bg-emerald-50 text-emerald-950";
  const AlertIcon = isBlocked ? AlertTriangle : ShieldCheck;

  return (
    <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className={`flex flex-col gap-4 border-b p-5 md:flex-row md:items-start md:justify-between ${alertClass}`}>
        <div className="flex min-w-0 gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/80 ring-1 ring-black/5">
            <AlertIcon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Plan health</p>
            <p className="mt-1 max-w-3xl text-sm leading-6">{report.primaryWarning}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-semibold text-neutral-950">
              {report.readinessScore}
            </p>
            <p className="text-xs text-neutral-600">readiness score</p>
          </div>
          <FeasibilityBadge value={report.feasibility} />
        </div>
      </div>

      <div className="grid divide-y divide-neutral-200 md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="p-5">
          <div className="flex items-center gap-2 text-neutral-500">
            <IndianRupee className="size-4" aria-hidden />
            <p className="text-xs font-semibold uppercase">Safe money limit</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-neutral-950">
            {formatInr(report.totalRequiredMonthly)} of {formatInr(report.safeMonthlyCapacity)}
          </p>
          <div className="mt-3">
            <ProgressBar
              value={report.moneyUtilization}
              tone={report.moneyUtilization > 1 ? "red" : report.moneyUtilization > 0.85 ? "amber" : "teal"}
            />
          </div>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            {toPercent(report.moneyUtilization)} committed; {formatInr(report.monthlyBuffer)} monthly buffer kept.
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock3 className="size-4" aria-hidden />
            <p className="text-xs font-semibold uppercase">Safe time limit</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-neutral-950">
            {Math.round(report.committedDailyMinutes)} of {Math.round(report.safeDailyMinutes)} min/day
          </p>
          <div className="mt-3">
            <ProgressBar
              value={report.timeUtilization}
              tone={report.timeUtilization > 1 ? "red" : report.timeUtilization > 0.75 ? "amber" : "blue"}
            />
          </div>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            {Math.round(report.remainingDailyMinutes)} safe minutes remain after current goals.
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-neutral-500">
            <WalletCards className="size-4" aria-hidden />
            <p className="text-xs font-semibold uppercase">Savings protection</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-neutral-950">
            {formatInr(report.protectedSavings)} protected
          </p>
          <p className="mt-3 text-xs leading-5 text-neutral-500">
            Emergency target: {formatInr(report.emergencyFundTarget)}. Available beyond that reserve: {formatInr(report.allocatableSavings)}.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ConstraintIssues({
  report,
  limit = 4,
}: {
  report: ConstraintReport;
  limit?: number;
}) {
  if (report.issues.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-emerald-950">No active conflicts</p>
            <p className="mt-1 text-sm leading-6 text-emerald-900">
              The current goals fit the protected money and time limits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {report.issues.slice(0, limit).map((issue) => {
        const critical = issue.severity === "critical";
        return (
          <div
            key={issue.id}
            className={`rounded-lg border p-4 ${
              critical
                ? "border-red-200 bg-red-50 text-red-950"
                : "border-amber-200 bg-amber-50 text-amber-950"
            }`}
          >
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{issue.title}</p>
                  <span className="rounded-full border border-current/20 bg-white/60 px-2 py-0.5 text-xs font-semibold capitalize">
                    {issue.severity}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6">{issue.detail}</p>
                <p className="mt-2 text-sm font-semibold leading-6">Do this: {issue.remedy}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
