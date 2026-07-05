import { Archive, CalendarDays, Plus, RefreshCw, Target } from "lucide-react";
import {
  archiveGoalAction,
  createGoalAction,
  generateRoadmapAction,
} from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import {
  EmptyState,
  FeasibilityBadge,
  Field,
  inputClass,
  PageHeader,
  Panel,
  textareaClass,
} from "@/components/ui";
import { formatDate, formatInr } from "@/lib/format";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";
import { goalDomains } from "@/lib/types";

export default async function GoalsPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);
  const assessments = snapshot.constraints?.goalAssessments ?? [];

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Goals" title="Choose the sequence before the speed.">
        <form action={generateRoadmapAction}>
          <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            <RefreshCw className="size-4" aria-hidden />
            Generate roadmap
          </button>
        </form>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <h2 className="text-lg font-semibold text-neutral-950">Add goal</h2>
          <form action={createGoalAction} className="mt-4 grid gap-4">
            <Field label="Goal title">
              <input
                className={inputClass}
                name="title"
                required
                placeholder="Build a stronger career path"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Domain">
                <select className={inputClass} name="domain" defaultValue="career">
                  {goalDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain.replace("-", " ")}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Deadline">
                <input className={inputClass} name="deadline" type="date" required />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Cost or corpus">
                <input
                  className={inputClass}
                  name="targetAmount"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </Field>
              <Field label="Weekly hours">
                <input
                  className={inputClass}
                  name="weeklyHours"
                  type="number"
                  min="0"
                  max="80"
                  defaultValue="3"
                />
              </Field>
              <Field label="Priority">
                <select className={inputClass} name="priority" defaultValue="3">
                  <option value="1">1 - core</option>
                  <option value="2">2 - high</option>
                  <option value="3">3 - normal</option>
                  <option value="4">4 - later</option>
                  <option value="5">5 - reward</option>
                </select>
              </Field>
            </div>
            <Field label="Why it matters">
              <textarea className={textareaClass} name="why" />
            </Field>
            <Field label="Notes">
              <textarea className={textareaClass} name="description" />
            </Field>
            <SubmitButton>
              <Plus className="size-4" aria-hidden />
              Add goal
            </SubmitButton>
          </form>
        </Panel>

        <div className="grid gap-4">
          {snapshot.goals.length === 0 ? (
            <EmptyState
              title="No active goals yet"
              text="Add one goal to generate your first constraint-aware roadmap."
            />
          ) : null}

          {snapshot.goals.map((goal) => {
            const assessment = assessments.find((item) => item.goalId === goal.id);
            return (
              <Panel key={goal.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Target className="size-4 text-[#176b5b]" aria-hidden />
                      <h2 className="text-lg font-semibold text-neutral-950">
                        {goal.title}
                      </h2>
                    </div>
                    <p className="mt-1 text-sm capitalize text-neutral-500">
                      {goal.domain.replace("-", " ")} / priority {goal.priority}
                    </p>
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

                <div className="mt-4 grid gap-3 text-sm text-neutral-700 md:grid-cols-3">
                  <p className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-neutral-500" aria-hidden />
                    {formatDate(goal.deadline)}
                  </p>
                  <p>{goal.targetAmount ? formatInr(goal.targetAmount) : "No direct cost"}</p>
                  <p>{goal.weeklyHours} hrs/week</p>
                </div>

                {assessment?.notes.length ? (
                  <div className="mt-4 grid gap-2">
                    {assessment.notes.map((note) => (
                      <p
                        key={note}
                        className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"
                      >
                        {note}
                      </p>
                    ))}
                  </div>
                ) : null}
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
