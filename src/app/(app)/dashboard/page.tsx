import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  generateRoadmapAction,
  toggleTaskAction,
} from "@/app/actions";
import {
  PageGuide,
  PageHeader,
  Panel,
  ProgressBar,
} from "@/components/ui";
import { ConstraintIssues, PlanHealth } from "@/components/plan-health";
import { FirstRunPath } from "@/components/first-run-path";
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
            href="/setup"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#176b5b] px-4 text-sm font-semibold text-white"
          >
            <Plus className="size-4" aria-hidden />
            Start setup
          </Link>
        </Panel>
      </div>
    );
  }

  const constraints = snapshot.constraints;

  if (snapshot.goals.length === 0 && constraints) {
    return (
      <div className="grid gap-6">
        <PageHeader eyebrow="Welcome" title="Your planning baseline is ready." />
        <FirstRunPath report={constraints} />
      </div>
    );
  }

  const completed = snapshot.todayTasks.filter((task) => task.completedAt).length;
  const total = snapshot.todayTasks.length || 1;
  const needsSetupHelp = snapshot.goals.length === 0 || !snapshot.latestRoadmap;

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Today" title="Your life plan, reduced to today.">
        <form action={generateRoadmapAction}>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            <RefreshCw className="size-4" aria-hidden />
            {snapshot.latestRoadmap ? "Rebuild plan" : "Generate first roadmap"}
          </button>
        </form>
      </PageHeader>

      {needsSetupHelp ? (
        <PageGuide
          defaultOpen
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

      {constraints ? <PlanHealth report={constraints} /> : null}

      <div className="grid items-start gap-8 xl:grid-cols-[1fr_0.85fr]">
        <Panel>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#176b5b]">Execute</p>
              <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                Today&apos;s proof
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {completed} of {snapshot.todayTasks.length} essentials complete
              </p>
            </div>
            <span className="text-3xl font-semibold text-neutral-950">
              {Math.round((completed / total) * 100)}%
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar value={completed / total} />
          </div>
          <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
            {snapshot.todayTasks.length > 0 ? (
              snapshot.todayTasks.map((task) => (
                <form
                  key={task.id}
                  action={toggleTaskAction}
                  className="flex items-center gap-3 py-3"
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
              <p className="py-5 text-sm text-neutral-600">
                Generate a roadmap to create today&apos;s essentials.
              </p>
            )}
          </div>
          <Link
            href="/review"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#176b5b]"
          >
            Review progress on Sunday
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Panel>

        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#176b5b]">Decide</p>
              <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                Before you add intensity
              </h2>
            </div>
            <Link href="/goals" className="text-sm font-semibold text-[#176b5b]">
              Edit goals
            </Link>
          </div>
          <div className="mt-4">
            {constraints ? <ConstraintIssues report={constraints} /> : null}
          </div>
          {constraints ? (
            <div className="mt-5 border-t border-neutral-200 pt-5">
              <p className="text-sm font-semibold text-neutral-950">Next decisions</p>
              <ol className="mt-3 grid gap-3">
                {constraints.nextActions.map((action, index) => (
                  <li key={action} className="flex gap-3 text-sm leading-6 text-neutral-700">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
