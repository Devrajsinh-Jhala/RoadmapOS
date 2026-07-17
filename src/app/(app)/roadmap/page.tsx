import {
  Calendar,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Route,
} from "lucide-react";
import { generateRoadmapAction } from "@/app/actions";
import { ConstraintIssues, PlanHealth } from "@/components/plan-health";
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
  const constraints = snapshot.constraints;

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Roadmap" title="A roadmap that respects your real life.">
        <form action={generateRoadmapAction}>
          <SubmitButton>
            <RefreshCw className="size-4" aria-hidden />
            Regenerate roadmap
          </SubmitButton>
        </form>
      </PageHeader>

      <PageGuide
        title="Read this page from top to bottom."
        text="The deterministic checks come before the generated roadmap. Resolve critical warnings before treating any deadline as reliable."
        steps={[
          "Check Plan health to see protected money, time, and savings limits.",
          "Resolve critical decisions, then confirm the goal sequence.",
          "Use yearly, quarterly, and monthly targets for direction.",
          "Use the weekly and daily layers for execution.",
        ]}
      />

      {constraints ? <PlanHealth report={constraints} /> : null}

      {constraints ? (
        <div className="grid items-start gap-8 xl:grid-cols-[1fr_0.9fr]">
          <section>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Decision gate</p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-950">
              {constraints.feasibility === "conflicting"
                ? "Resolve these before trusting the dates"
                : "Trade-offs to keep visible"}
            </h2>
            <div className="mt-4">
              <ConstraintIssues report={constraints} limit={3} />
            </div>
          </section>

          <Panel>
            <div className="flex items-center gap-2">
              <Route className="size-5 text-[#176b5b]" aria-hidden />
              <h2 className="text-lg font-semibold text-neutral-950">Goal sequence</h2>
            </div>
            <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
              {constraints.goalAssessments.length > 0 ? (
                constraints.goalAssessments.map((assessment) => (
                  <div key={assessment.goalId} className="flex gap-3 py-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                      {assessment.sequenceRank}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-neutral-950">
                          {assessment.title}
                        </p>
                        <FeasibilityBadge value={assessment.feasibility} />
                      </div>
                      <p className="mt-1 text-xs leading-5 text-neutral-600">
                        {assessment.recommendedAction}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-neutral-600">Add goals to create a sequence.</p>
              )}
            </div>
          </Panel>
        </div>
      ) : null}

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
                <p className="text-xs font-semibold uppercase text-neutral-500">
                  Two-year vision
                </p>
                <h2 className="mt-2 max-w-3xl text-2xl font-semibold leading-snug text-neutral-950">
                  {roadmap.structured.vision2Year}
                </h2>
              </div>
              {constraints ? <FeasibilityBadge value={constraints.feasibility} /> : null}
            </div>
          </Panel>

          <Panel>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">One-year direction</p>
            <h2 className="mt-1 text-lg font-semibold text-neutral-950">Year roadmap</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {roadmap.structured.yearRoadmap.map((item, index) => (
                <div key={item} className="flex gap-3 border-t border-neutral-200 pt-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#176b5b] text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-neutral-700">{item}</p>
                </div>
              ))}
            </div>
          </Panel>

          <section>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Three-month gates</p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-950">Quarterly milestones</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {roadmap.structured.quarterlyMilestones.map((milestone) => (
                <div
                  key={`${milestone.quarter}-${milestone.title}`}
                  className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase text-neutral-500">
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
          </section>

          <section>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Monthly proof</p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-950">Next monthly targets</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {roadmap.structured.monthlyTargets.map((month) => (
                <div key={`${month.month}-${month.target}`} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-neutral-500">{month.month}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-neutral-950">{month.target}</p>
                  <p className="mt-2 text-xs leading-5 text-neutral-500">{month.metric}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel>
              <h2 className="text-lg font-semibold text-neutral-950">Weekly plan</h2>
              <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
                {roadmap.structured.weeklyPlan.map((week) => (
                  <div key={week.week} className="py-4">
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
              <div className="flex items-center gap-2">
                <Clock3 className="size-5 text-blue-700" aria-hidden />
                <h2 className="text-lg font-semibold text-neutral-950">Daily minimums</h2>
              </div>
              <div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
                {roadmap.structured.dailyNonNegotiables.map((item) => (
                  <div key={`${item.title}-${item.domain}`} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold leading-6 text-neutral-950">{item.title}</p>
                      <p className="mt-1 text-xs capitalize text-neutral-500">{item.domain.replace("-", " ")}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-neutral-600">{item.minutes} min</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel>
            <h2 className="text-lg font-semibold text-neutral-950">Recovery rules</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {roadmap.structured.recoveryPlan.map((item) => (
                <div key={item} className="flex gap-2 border-t border-blue-200 pt-3 text-sm leading-6 text-blue-950">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-blue-700" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
