import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock3,
  IndianRupee,
  Plus,
  RefreshCw,
  Timer,
} from "lucide-react";
import Link from "next/link";
import {
  generateRoadmapAction,
  toggleTaskAction,
} from "@/app/actions";
import {
  FeasibilityBadge,
  PageGuide,
  PageHeader,
  Panel,
  ProgressBar,
} from "@/components/ui";
import { formatInr, toPercent } from "@/lib/format";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);

  if (!snapshot.profile) {
    return (
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Start"
          title="Build your first life roadmap from real constraints."
        />
        <Panel>
          <p className="text-sm leading-6 text-neutral-600">
            Add income, savings, time, and blockers once. RoadmapOS will turn
            them into goals, daily essentials, and weekly recovery.
          </p>
          <Link
            href="/onboarding"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#176b5b] px-4 text-sm font-semibold text-white"
          >
            <Plus className="size-4" aria-hidden />
            Start onboarding
          </Link>
        </Panel>
      </div>
    );
  }

  const constraints = snapshot.constraints;
  const completed = snapshot.todayTasks.filter((task) => task.completedAt).length;
  const total = snapshot.todayTasks.length || 1;
  const needsSetupHelp = snapshot.goals.length === 0 || !snapshot.latestRoadmap;

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Today" title="Do only today's essentials.">
        <form action={generateRoadmapAction}>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            <RefreshCw className="size-4" aria-hidden />
            Regenerate
          </button>
        </form>
      </PageHeader>

      {needsSetupHelp ? (
        <PageGuide
          title="Your first setup path"
          text="If this page feels empty, nothing is broken. RoadmapOS needs your goals and one generated roadmap before it can create daily essentials."
          steps={[
            "Open Goals and add your main career, money, health, or lifestyle goals.",
            "Click Generate roadmap after adding the important goals.",
            "Come back here to complete only today's essentials.",
            "Use Weekly Review every Sunday to adjust the plan.",
          ]}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-4">
        <Panel>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-500">Feasibility</p>
            {constraints ? <FeasibilityBadge value={constraints.feasibility} /> : null}
          </div>
          <p className="mt-4 text-2xl font-semibold text-neutral-950">
            {completed}/{total}
          </p>
          <p className="mt-1 text-sm text-neutral-500">daily essentials done</p>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2 text-neutral-500">
            <IndianRupee className="size-4" aria-hidden />
            <p className="text-sm font-medium">Monthly surplus</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-neutral-950">
            {formatInr(constraints?.monthlySurplus ?? 0)}
          </p>
          <div className="mt-3">
            <ProgressBar
              value={constraints?.moneyUtilization ?? 0}
              tone={(constraints?.moneyUtilization ?? 0) > 1 ? "red" : "teal"}
            />
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {toPercent(constraints?.moneyUtilization ?? 0)} committed
          </p>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2 text-neutral-500">
            <Timer className="size-4" aria-hidden />
            <p className="text-sm font-medium">Daily time load</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-neutral-950">
            {Math.round(constraints?.committedDailyMinutes ?? 0)} min
          </p>
          <div className="mt-3">
            <ProgressBar
              value={constraints?.timeUtilization ?? 0}
              tone={(constraints?.timeUtilization ?? 0) > 1 ? "red" : "blue"}
            />
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {snapshot.profile.dailyAvailableMinutes} min available
          </p>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock3 className="size-4" aria-hidden />
            <p className="text-sm font-medium">Next review</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-neutral-950">
            Sunday
          </p>
          <Link
            href="/review"
            className="mt-3 inline-flex text-sm font-semibold text-[#176b5b]"
          >
            Open weekly review
          </Link>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-950">
              Daily non-negotiables
            </h2>
            <span className="text-sm text-neutral-500">{completed} complete</span>
          </div>
          <div className="mt-4 grid gap-3">
            {snapshot.todayTasks.length > 0 ? (
              snapshot.todayTasks.map((task) => (
                <form
                  key={task.id}
                  action={toggleTaskAction}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-[#fbfaf6] p-3"
                >
                  <input type="hidden" name="taskId" value={task.id} />
                  <button
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-700"
                    aria-label={`Toggle ${task.title}`}
                  >
                    {task.completedAt ? (
                      <CheckCircle2 className="size-5 text-emerald-700" aria-hidden />
                    ) : (
                      <Circle className="size-5" aria-hidden />
                    )}
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      {task.title}
                    </p>
                    <p className="mt-1 text-xs capitalize text-neutral-500">
                      {task.domain.replace("-", " ")}
                    </p>
                  </div>
                </form>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">
                Generate a roadmap to create today&apos;s essentials.
              </p>
            )}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" aria-hidden />
            <h2 className="text-lg font-semibold text-neutral-950">
              Conflict detector
            </h2>
          </div>
          <div className="mt-4 grid gap-3">
            {constraints?.conflicts.length ? (
              constraints.conflicts.slice(0, 5).map((conflict) => (
                <p
                  key={conflict}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"
                >
                  {conflict}
                </p>
              ))
            ) : (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                Current goals fit your declared money and time capacity.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
