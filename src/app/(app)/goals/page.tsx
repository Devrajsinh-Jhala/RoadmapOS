import {
  Archive,
  CalendarDays,
  Pencil,
  RefreshCw,
  Save,
  Target,
} from "lucide-react";
import { redirect } from "next/navigation";
import {
  archiveGoalAction,
  generateRoadmapAction,
  updateGoalAction,
  updateGoalProgressAction,
} from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { PlanHealth } from "@/components/plan-health";
import { CapacityReady } from "@/components/first-run-path";
import { GoalCreator } from "@/components/goal-creator";
import {
  EmptyState,
  FeasibilityBadge,
  Field,
  inputClass,
  PageGuide,
  PageHeader,
  Panel,
  ProgressBar,
  textareaClass,
} from "@/components/ui";
import { formatDate, formatInr, todayIso } from "@/lib/format";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";
import { goalDomains } from "@/lib/types";

export default async function GoalsPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);

  if (!snapshot.profile) {
    redirect("/setup");
  }

  const assessments = snapshot.constraints?.goalAssessments ?? [];
  const orderedGoals = [...snapshot.goals].sort((a, b) => {
    const aRank = assessments.find((item) => item.goalId === a.id)?.sequenceRank ?? 99;
    const bRank = assessments.find((item) => item.goalId === b.id)?.sequenceRank ?? 99;
    return aRank - bRank;
  });

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Goals" title="Build a plan with honest trade-offs.">
        {snapshot.goals.length > 0 ? (
          <form action={generateRoadmapAction}>
            <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
              <RefreshCw className="size-4" aria-hidden />
              Generate roadmap
            </button>
          </form>
        ) : null}
      </PageHeader>

      <PageGuide
        defaultOpen={snapshot.goals.length === 0}
        title="Start with 2 to 4 goals, not your entire life."
        text="RoadmapOS protects a money buffer and recovery time before it tests your goals. A warning is a decision to make, not a failure."
        steps={[
          "Add one clear goal, such as career growth, house fund, fitness, or side income.",
          "Use target amount for money goals and weekly hours for effort goals.",
          "Use priority 1 for at most two non-negotiables; use 5 for rewards.",
          "Read Plan health, resolve critical conflicts, then generate the roadmap.",
        ]}
      />

      {snapshot.constraints ? (
        snapshot.goals.length > 0 ? (
          <PlanHealth report={snapshot.constraints} />
        ) : (
          <CapacityReady report={snapshot.constraints} />
        )
      ) : null}

      <GoalCreator today={todayIso()} hasGoals={orderedGoals.length > 0} />

      {orderedGoals.length > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Sequence</p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-950">What gets protected first</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Priority comes first; an earlier deadline breaks a tie.
            </p>
          </div>
          <p className="text-sm text-neutral-500">{orderedGoals.length} active goals</p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {snapshot.goals.length === 0 ? (
          <EmptyState
            title="No active goals yet"
            text="Add your first goal above. After you add two or three goals, generate the roadmap to see conflicts and daily actions."
          />
        ) : null}

        {orderedGoals.map((goal) => {
          const assessment = assessments.find((item) => item.goalId === goal.id);
          return (
            <Panel key={goal.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-neutral-900 text-sm font-semibold text-white">
                    {assessment?.sequenceRank ?? goal.priority}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Target className="size-4 shrink-0 text-[#176b5b]" aria-hidden />
                      <h2 className="text-lg font-semibold text-neutral-950">
                        {goal.title}
                      </h2>
                    </div>
                    <p className="mt-1 text-sm capitalize text-neutral-500">
                      {goal.domain.replace("-", " ")} / priority {goal.priority}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {assessment ? (
                    <FeasibilityBadge value={assessment.feasibility} />
                  ) : null}
                  <form action={archiveGoalAction}>
                    <input type="hidden" name="goalId" value={goal.id} />
                    <button
                      className="grid size-8 place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
                      aria-label={`Archive ${goal.title}`}
                      title="Archive goal"
                    >
                      <Archive className="size-4" aria-hidden />
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-neutral-200 py-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs font-medium text-neutral-500">Deadline</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                    <CalendarDays className="size-3.5 text-neutral-500" aria-hidden />
                    {formatDate(goal.deadline)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Monthly need</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {assessment?.requiredMonthly
                      ? formatInr(assessment.requiredMonthly)
                      : "No direct cost"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Weekly time</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {goal.weeklyHours} hours
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Time remaining</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {assessment?.monthsRemaining ?? "-"} months
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">Outcome progress</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-950">
                      {goal.progress === 100 ? "Outcome reached" : `${goal.progress}% complete`}
                    </p>
                  </div>
                  {goal.lastCheckInAt ? (
                    <p className="text-xs text-neutral-500">
                      Checked {formatDate(goal.lastCheckInAt.slice(0, 10))}
                    </p>
                  ) : null}
                </div>
                <div className="mt-3">
                  <ProgressBar value={goal.progress / 100} tone={goal.progress === 100 ? "teal" : "blue"} />
                </div>
                {goal.progressNote ? (
                  <p className="mt-2 text-xs leading-5 text-neutral-600">{goal.progressNote}</p>
                ) : null}

                <details className="group mt-3">
                  <summary className="w-fit cursor-pointer list-none text-sm font-semibold text-[#176b5b]">
                    Update progress
                  </summary>
                  <form action={updateGoalProgressAction} className="mt-4 grid gap-4 border-l-2 border-emerald-200 pl-4 sm:grid-cols-[160px_1fr_auto] sm:items-end">
                    <input type="hidden" name="goalId" value={goal.id} />
                    <Field label="Completion (%)" hint="Estimate against the outcome, not effort spent.">
                      <input
                        className={inputClass}
                        name="progress"
                        type="number"
                        min="0"
                        max="100"
                        required
                        defaultValue={goal.progress}
                      />
                    </Field>
                    <Field label="Latest proof or blocker" hint="One concrete sentence keeps the next review honest.">
                      <input
                        className={inputClass}
                        name="progressNote"
                        maxLength={500}
                        defaultValue={goal.progressNote}
                        placeholder="Completed the first milestone; waiting on feedback."
                      />
                    </Field>
                    <SubmitButton>
                      <Save className="size-4" aria-hidden />
                      Check in
                    </SubmitButton>
                  </form>
                </details>
              </div>

              {assessment ? (
                <div className="mt-4 rounded-lg bg-neutral-100 p-3">
                  <p className="text-xs font-semibold uppercase text-neutral-500">Recommended decision</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-neutral-900">
                    {assessment.recommendedAction}
                  </p>
                  {assessment.suggestedDeadline ? (
                    <p className="mt-1 text-xs text-neutral-600">
                      A safer money-only deadline starts around {formatDate(assessment.suggestedDeadline)}.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {assessment?.notes.length ? (
                <div className="mt-4 grid gap-3 border-l-2 border-amber-400 pl-3">
                  {assessment.notes.map((note) => (
                    <p
                      key={note}
                      className="text-sm leading-6 text-amber-950"
                    >
                      {note}
                    </p>
                  ))}
                </div>
              ) : null}

              <details className="group mt-5 border-t border-neutral-200 pt-4">
                <summary className="flex w-fit cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[#176b5b]">
                  <Pencil className="size-4" aria-hidden />
                  Edit goal
                </summary>
                <form action={updateGoalAction} className="mt-5 grid gap-4">
                  <input type="hidden" name="goalId" value={goal.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Goal title">
                      <input className={inputClass} name="title" required defaultValue={goal.title} />
                    </Field>
                    <Field label="Domain">
                      <select className={inputClass} name="domain" defaultValue={goal.domain}>
                        {goalDomains.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain.replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Field label="Deadline">
                      <input className={inputClass} name="deadline" type="date" required defaultValue={goal.deadline} />
                    </Field>
                    <Field label="Target amount (INR)">
                      <input className={inputClass} name="targetAmount" type="number" min="0" defaultValue={goal.targetAmount} />
                    </Field>
                    <Field label="Weekly hours">
                      <input className={inputClass} name="weeklyHours" type="number" min="0" max="80" defaultValue={goal.weeklyHours} />
                    </Field>
                    <Field label="Priority">
                      <select className={inputClass} name="priority" defaultValue={goal.priority}>
                        <option value="1">1 - core</option>
                        <option value="2">2 - high</option>
                        <option value="3">3 - normal</option>
                        <option value="4">4 - later</option>
                        <option value="5">5 - reward</option>
                      </select>
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Why it matters">
                      <textarea className={textareaClass} name="why" defaultValue={goal.why} />
                    </Field>
                    <Field label="Notes">
                      <textarea className={textareaClass} name="description" defaultValue={goal.description} />
                    </Field>
                  </div>
                  <SubmitButton className="w-full sm:w-fit">
                    <Save className="size-4" aria-hidden />
                    Save changes
                  </SubmitButton>
                </form>
              </details>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
