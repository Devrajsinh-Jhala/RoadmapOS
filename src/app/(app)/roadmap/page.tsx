import { AlertTriangle, Calendar, CheckCircle2, RefreshCw } from "lucide-react";
import { generateRoadmapAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import {
  EmptyState,
  FeasibilityBadge,
  PageGuide,
  PageHeader,
  Panel,
} from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";

export default async function RoadmapPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);
  const roadmap = snapshot.latestRoadmap;

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Roadmap" title="See the sequence from big goal to this week.">
        <form action={generateRoadmapAction}>
          <SubmitButton>
            <RefreshCw className="size-4" aria-hidden />
            Regenerate roadmap
          </SubmitButton>
        </form>
      </PageHeader>

      <PageGuide
        title="Read this page from top to bottom."
        text="This is the planning page, not the daily work page. Use it when you want to understand the bigger sequence."
        steps={[
          "Check the two-year vision and feasibility badge first.",
          "Read conflicts before you trust the plan.",
          "Use quarterly milestones to see the medium-term path.",
          "Use the weekly plan for the next month, then execute from Today.",
        ]}
      />

      {!roadmap ? (
        <EmptyState
          title="No roadmap yet"
          text="Complete onboarding, add goals, then click Regenerate roadmap to create the first execution plan."
        />
      ) : (
        <>
          <Panel>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                  Two-year vision
                </p>
                <h2 className="mt-2 max-w-3xl text-2xl font-semibold leading-snug text-neutral-950">
                  {roadmap.structured.vision2Year}
                </h2>
              </div>
              <FeasibilityBadge value={roadmap.constraintReport.feasibility} />
            </div>
          </Panel>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <Panel>
              <h2 className="text-lg font-semibold text-neutral-950">Year roadmap</h2>
              <div className="mt-4 grid gap-3">
                {roadmap.structured.yearRoadmap.map((item, index) => (
                  <div key={item} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#176b5b] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-neutral-700">{item}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-600" aria-hidden />
                <h2 className="text-lg font-semibold text-neutral-950">Conflicts</h2>
              </div>
              <div className="mt-4 grid gap-2">
                {roadmap.structured.conflicts.length ? (
                  roadmap.structured.conflicts.map((conflict) => (
                    <p
                      key={conflict}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"
                    >
                      {conflict}
                    </p>
                  ))
                ) : (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                    No major conflicts in the latest plan.
                  </p>
                )}
              </div>
            </Panel>
          </div>

          <Panel>
            <h2 className="text-lg font-semibold text-neutral-950">
              Quarterly milestones
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {roadmap.structured.quarterlyMilestones.map((milestone) => (
                <div
                  key={`${milestone.quarter}-${milestone.title}`}
                  className="rounded-lg border border-neutral-200 bg-[#fbfaf6] p-4"
                >
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                    <Calendar className="size-3.5" aria-hidden />
                    {milestone.quarter} / {formatDate(milestone.targetDate)}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold text-neutral-950">
                    {milestone.title}
                  </h3>
                  {milestone.goalTitle ? (
                    <p className="mt-1 text-sm text-neutral-500">
                      {milestone.goalTitle}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel>
              <h2 className="text-lg font-semibold text-neutral-950">Weekly plan</h2>
              <div className="mt-4 grid gap-4">
                {roadmap.structured.weeklyPlan.map((week) => (
                  <div key={week.week} className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="text-sm font-semibold text-neutral-950">
                      {week.week}: {week.focus}
                    </h3>
                    <ul className="mt-3 grid gap-2">
                      {week.actions.map((action) => (
                        <li
                          key={action}
                          className="flex gap-2 text-sm leading-6 text-neutral-700"
                        >
                          <CheckCircle2
                            className="mt-1 size-4 shrink-0 text-emerald-700"
                            aria-hidden
                          />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <h2 className="text-lg font-semibold text-neutral-950">Recovery plan</h2>
              <div className="mt-4 grid gap-3">
                {roadmap.structured.recoveryPlan.map((item) => (
                  <p
                    key={item}
                    className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
