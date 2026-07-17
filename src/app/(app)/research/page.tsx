import { ExternalLink, FlaskConical, Search, Wand2 } from "lucide-react";
import { redirect } from "next/navigation";
import { applyResearchAction, runResearchAction } from "@/app/actions";
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
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";

export default async function ResearchPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);

  if (!snapshot.profile) {
    redirect("/setup");
  }

  if (snapshot.goals.length === 0 && snapshot.constraints) {
    return (
      <div className="grid gap-6">
        <PageHeader eyebrow="Research" title="Research becomes useful after Goals." />
        <FirstRunPath report={snapshot.constraints} />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Research" title="Use live research only when the plan needs current facts." />

      <PageGuide
        defaultOpen={snapshot.researchRuns.length === 0}
        title="Research is optional, not a daily habit."
        text="Use this page for things that change over time: courses, salary ranges, product prices, locations, markets, or side-income ideas."
        steps={[
          "Choose a goal if the research should improve one specific goal.",
          "Ask one practical question with your constraints.",
          "Read the answer and citations.",
          "Click Apply only if you want it included in the next roadmap.",
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <div className="flex items-center gap-2">
            <Search className="size-5 text-[#176b5b]" aria-hidden />
            <h2 className="text-lg font-semibold text-neutral-950">Ask planner</h2>
          </div>
          <form action={runResearchAction} className="mt-4 grid gap-4">
            <Field label="Attach to goal" hint="Choose General roadmap if the question affects your whole plan.">
              <select className={inputClass} name="goalId" defaultValue="">
                <option value="">General roadmap</option>
                {snapshot.goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Question" hint="Ask for a comparison, estimate, current options, or practical path.">
              <textarea
                className={textareaClass}
                name="query"
                placeholder="Example: Compare practical AI courses for a full-stack developer with 5 study hours per week."
                required
              />
            </Field>
            <SubmitButton>
              <FlaskConical className="size-4" aria-hidden />
              Run research
            </SubmitButton>
          </form>
        </Panel>

        <div className="grid gap-4">
          {snapshot.researchRuns.length ? (
            snapshot.researchRuns.map((run) => (
              <Panel key={run.id}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">
                      {run.grounded ? "Grounded research" : "Planning note"}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-neutral-950">
                      {run.query}
                    </h2>
                  </div>
                  {run.appliedAt ? (
                    <span className="inline-flex h-7 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-800">
                      Applied
                    </span>
                  ) : (
                    <form action={applyResearchAction}>
                      <input type="hidden" name="researchId" value={run.id} />
                      <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-800 hover:bg-neutral-50">
                        <Wand2 className="size-3.5" aria-hidden />
                        Apply
                      </button>
                    </form>
                  )}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                  {run.summary}
                </p>
                {run.citations.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {run.citations.map((citation) => (
                      <a
                        key={citation.url}
                        href={citation.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 max-w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white px-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                      >
                        <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{citation.title}</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </Panel>
            ))
          ) : (
            <Panel>
              <p className="text-sm leading-6 text-neutral-600">
                Research runs will appear here after you ask about courses,
                salaries, locations, prices, or side-income paths.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
