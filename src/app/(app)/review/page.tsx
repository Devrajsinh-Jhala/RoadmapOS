import { ClipboardCheck, Save } from "lucide-react";
import { submitWeeklyReviewAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass, PageHeader, Panel, textareaClass } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";

export default async function ReviewPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);
  const latest = snapshot.weeklyReviews[0];

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Weekly Review" title="Adjust the plan without drama." />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Panel>
          <form action={submitWeeklyReviewAction} className="grid gap-4">
            <Field label="What completed?">
              <textarea className={textareaClass} name="completed" required />
            </Field>
            <Field label="What slipped?">
              <textarea className={textareaClass} name="slipped" />
            </Field>
            <Field label="Why did it slip?">
              <textarea className={textareaClass} name="reasons" />
            </Field>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Saved this week">
                <input
                  className={inputClass}
                  name="savedAmount"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </Field>
              <Field label="Workouts">
                <input
                  className={inputClass}
                  name="workoutsDone"
                  type="number"
                  min="0"
                  max="14"
                  defaultValue="3"
                />
              </Field>
              <Field label="Study hours">
                <input
                  className={inputClass}
                  name="studyHours"
                  type="number"
                  min="0"
                  max="120"
                  defaultValue="5"
                />
              </Field>
              <Field label="Discipline score">
                <input
                  className={inputClass}
                  name="disciplineScore"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="6"
                />
              </Field>
            </div>
            <Field label="Next-week energy">
              <input
                className={inputClass}
                name="energyNextWeek"
                defaultValue="Medium"
                required
              />
            </Field>
            <SubmitButton>
              <Save className="size-4" aria-hidden />
              Save review
            </SubmitButton>
          </form>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-5 text-[#176b5b]" aria-hidden />
            <h2 className="text-lg font-semibold text-neutral-950">Latest recovery</h2>
          </div>
          {latest ? (
            <div className="mt-4">
              <p className="text-sm text-neutral-500">
                Week of {formatDate(latest.weekStart)}
              </p>
              <div className="mt-4 grid gap-3">
                {latest.aiRecovery.map((item) => (
                  <p
                    key={item}
                    className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              Submit one review to create the first recovery plan.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}
