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
  PageGuide,
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
      <PageHeader eyebrow="Goals" title="Add goals one by one. RoadmapOS will sequence them.">
        <form action={generateRoadmapAction}>
          <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            <RefreshCw className="size-4" aria-hidden />
            Generate roadmap
          </button>
        </form>
      </PageHeader>

      <PageGuide
        title="Start with 2 to 4 goals, not your entire life."
        text="Each goal needs a deadline and either money, time, or both. The conflict detector becomes useful after you add multiple goals."
        steps={[
          "Add one clear goal, such as career growth, house fund, fitness, or side income.",
          "Use target amount for money goals and weekly hours for effort goals.",
          "Set priority 1 for non-negotiables and 5 for lifestyle rewards.",
          "Generate the roadmap after your main goals are listed.",
        ]}
      />

      <Panel>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">Add one goal</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">
              Keep it specific enough that the app can calculate cost, time, and deadline pressure.
            </p>
          </div>
        </div>

        <form action={createGoalAction} className="mt-5 grid gap-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Field label="Goal title" hint="Use normal words. Example: Switch to a better engineering role.">
              <input
                className={inputClass}
                name="title"
                required
                placeholder="Build a stronger career path"
              />
            </Field>

            <Field label="Domain" hint="Choose the life area this goal belongs to.">
              <select className={inputClass} name="domain" defaultValue="career">
                {goalDomains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain.replace("-", " ")}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Deadline" hint="The date you want this meaningfully done.">
              <input className={inputClass} name="deadline" type="date" required />
            </Field>
            <Field label="Target amount (INR, optional)" hint="Use 0 if this goal is mostly about time or habit.">
              <input
                className={inputClass}
                name="targetAmount"
                type="number"
                min="0"
                defaultValue="0"
              />
            </Field>
            <Field label="Weekly time needed (hours)" hint="Estimate focused hours per week. Example: 4.">
              <input
                className={inputClass}
                name="weeklyHours"
                type="number"
                min="0"
                max="80"
                defaultValue="3"
              />
            </Field>
            <Field label="Priority" hint="1 is core. 5 is a reward or nice-to-have.">
              <select className={inputClass} name="priority" defaultValue="3">
                <option value="1">1 - core</option>
                <option value="2">2 - high</option>
                <option value="3">3 - normal</option>
                <option value="4">4 - later</option>
                <option value="5">5 - reward</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Why it matters" hint="One sentence is enough. This helps the roadmap keep the goal meaningful.">
              <textarea
                className={textareaClass}
                name="why"
                placeholder="Example: Increase income and create more career options."
              />
            </Field>
            <Field label="Notes" hint="Add context, constraints, dependencies, or success criteria. Optional.">
              <textarea
                className={textareaClass}
                name="description"
                placeholder="Example: Needs DSA practice, two portfolio projects, and interview prep."
              />
            </Field>
          </div>

          <SubmitButton className="w-full sm:w-fit">
            <Plus className="size-4" aria-hidden />
            Add goal
          </SubmitButton>
        </form>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {snapshot.goals.length === 0 ? (
          <EmptyState
            title="No active goals yet"
            text="Add your first goal above. After you add two or three goals, generate the roadmap to see conflicts and daily actions."
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

              <div className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-3">
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
  );
}
