import { ArrowRight, ClipboardCheck, Compass, Save } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { generateRoadmapAction, submitWeeklyReviewAction } from "@/app/actions";
import { FirstRunPath } from "@/components/first-run-path";
import { SubmitButton } from "@/components/submit-button";
import {
  Field,
  inputClass,
  PageGuide,
  PageHeader,
  Panel,
  textareaClass,
} from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";

export default async function ReviewPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);
  const latest = snapshot.weeklyReviews[0];

  if (!snapshot.profile) {
    redirect("/setup");
  }

  if (snapshot.goals.length === 0 && snapshot.constraints) {
    return (
      <div className="grid gap-6">
        <PageHeader eyebrow="Review" title="Weekly reviews begin after Goals." />
        <FirstRunPath report={snapshot.constraints} />
      </div>
    );
  }

  if (!snapshot.latestRoadmap) {
    return (
      <div className="grid gap-6">
        <PageHeader eyebrow="Review" title="Generate the first roadmap before reviewing it." />
        <Panel>
          <Compass className="size-6 text-[#176b5b]" aria-hidden />
          <h2 className="mt-4 text-xl font-semibold text-neutral-950">
            Your goals are ready for sequencing.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
            Generate the roadmap once. After you execute it for a week, Review will adapt the next plan from what actually happened.
          </p>
          <form action={generateRoadmapAction} className="mt-5">
            <SubmitButton>
              <Compass className="size-4" aria-hidden />
              Generate my roadmap
            </SubmitButton>
          </form>
        </Panel>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Weekly Review" title="Update the plan once a week." />

      <PageGuide
        defaultOpen={!latest}
        title="Use this every Sunday or after a bad week."
        text="The review is not a report card. It tells the planner what actually happened so next week becomes realistic."
        steps={[
          "Write what got done, even if it was small.",
          "Write what slipped and the real reason.",
          "Add simple metrics for money, workouts, study, and discipline.",
          "Save review to rebuild the roadmap and next-week recovery plan.",
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Panel>
          <form action={submitWeeklyReviewAction} className="grid gap-4">
            <Field label="What completed?" hint="List wins from the week. Short bullet-style text is fine.">
              <textarea
                className={textareaClass}
                name="completed"
                placeholder="Example: 3 workouts, 4 study blocks, tracked expenses."
                required
              />
            </Field>
            <Field label="What slipped?" hint="Name the tasks or goals that did not happen.">
              <textarea
                className={textareaClass}
                name="slipped"
                placeholder="Example: skipped interview prep and sleep routine."
              />
            </Field>
            <Field label="Why did it slip?" hint="Be practical: workload, energy, travel, phone, unclear next step, etc.">
              <textarea
                className={textareaClass}
                name="reasons"
                placeholder="Example: late work calls and no fixed study slot."
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Money saved this week (INR)">
                <input
                  className={inputClass}
                  name="savedAmount"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </Field>
              <Field label="Workouts completed">
                <input
                  className={inputClass}
                  name="workoutsDone"
                  type="number"
                  min="0"
                  max="14"
                  defaultValue="3"
                />
              </Field>
              <Field label="Study or skill hours">
                <input
                  className={inputClass}
                  name="studyHours"
                  type="number"
                  min="0"
                  max="120"
                  defaultValue="5"
                />
              </Field>
              <Field label="Discipline score (1-10)">
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
            <Field label="Next-week energy" hint="Example: low, medium, high, travel-heavy, family-heavy.">
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
                  <p key={item} className="border-l-2 border-blue-500 pl-3 text-sm leading-6 text-blue-950">
                    {item}
                  </p>
                ))}
              </div>
              <Link
                href="/roadmap"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#176b5b]"
              >
                Open refreshed roadmap
                <ArrowRight className="size-4" aria-hidden />
              </Link>
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
