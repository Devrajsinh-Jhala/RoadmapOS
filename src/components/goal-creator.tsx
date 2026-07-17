"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  Dumbbell,
  House,
  Lightbulb,
  Plus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { createGoalAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass, textareaClass } from "@/components/ui";
import { formatInr } from "@/lib/format";
import { goalDomains, type GoalDomain } from "@/lib/types";

const templates = [
  {
    key: "career",
    label: "Career move",
    title: "Move into a stronger role",
    domain: "career" as GoalDomain,
    months: 6,
    weeklyHours: "5",
    priority: "1",
    why: "Create better work and income options.",
    Icon: BriefcaseBusiness,
  },
  {
    key: "wealth",
    label: "Wealth corpus",
    title: "Build a home or investment corpus",
    domain: "wealth" as GoalDomain,
    months: 24,
    weeklyHours: "1",
    priority: "1",
    why: "Build long-term financial security.",
    Icon: House,
  },
  {
    key: "health",
    label: "Fitness",
    title: "Build a sustainable fitness routine",
    domain: "health" as GoalDomain,
    months: 6,
    weeklyHours: "4",
    priority: "2",
    why: "Improve health, energy, and consistency.",
    Icon: Dumbbell,
  },
  {
    key: "skills",
    label: "Learn a skill",
    title: "Become job-ready in a new skill",
    domain: "skills" as GoalDomain,
    months: 6,
    weeklyHours: "5",
    priority: "2",
    why: "Create useful proof of work and new opportunities.",
    Icon: BookOpen,
  },
  {
    key: "side-income",
    label: "Side income",
    title: "Validate a side-income offer",
    domain: "side-income" as GoalDomain,
    months: 4,
    weeklyHours: "4",
    priority: "2",
    why: "Test a realistic second income path.",
    Icon: Lightbulb,
  },
] as const;

type GoalDraft = {
  title: string;
  domain: GoalDomain;
  deadline: string;
  targetAmount: string;
  weeklyHours: string;
  priority: string;
  why: string;
  description: string;
};

function addMonths(today: string, months: number) {
  const date = new Date(`${today}T00:00:00+05:30`);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function monthsBetween(today: string, deadline: string) {
  if (!deadline) {
    return 1;
  }

  const start = new Date(`${today}T00:00:00+05:30`).getTime();
  const end = new Date(`${deadline}T00:00:00+05:30`).getTime();
  return Math.max(1, Math.ceil((end - start) / (30 * 24 * 60 * 60 * 1000)));
}

export function GoalCreator({
  today,
  hasGoals,
}: {
  today: string;
  hasGoals: boolean;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [draft, setDraft] = useState<GoalDraft>({
    title: "",
    domain: "career",
    deadline: addMonths(today, 6),
    targetAmount: "0",
    weeklyHours: "3",
    priority: "3",
    why: "",
    description: "",
  });

  const targetAmount = Number(draft.targetAmount) || 0;
  const weeklyHours = Number(draft.weeklyHours) || 0;
  const monthlyDemand = targetAmount / monthsBetween(today, draft.deadline);
  const dailyDemand = (weeklyHours * 60) / 7;

  function update<K extends keyof GoalDraft>(key: K, value: GoalDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function applyTemplate(template: (typeof templates)[number]) {
    setSelectedTemplate(template.key);
    setDraft({
      title: template.title,
      domain: template.domain,
      deadline: addMonths(today, template.months),
      targetAmount: "0",
      weeklyHours: template.weeklyHours,
      priority: template.priority,
      why: template.why,
      description: "",
    });
  }

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <details open={!hasGoals}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
          <span>
            <span className="block text-lg font-semibold text-neutral-950">Add a goal</span>
            <span className="mt-1 block text-sm leading-6 text-neutral-600">
              Start from a template or describe your own outcome.
            </span>
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#176b5b] text-white">
            <Plus className="size-5" aria-hidden />
          </span>
        </summary>

        <form action={createGoalAction} className="mt-5 grid gap-6 border-t border-neutral-200 pt-5">
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
              <Sparkles className="size-4 text-[#176b5b]" aria-hidden />
              Quick start templates
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
              {templates.map((template) => {
                const Icon = template.Icon;
                const active = selectedTemplate === template.key;
                return (
                  <button
                    key={template.key}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className={`flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-[#176b5b] bg-emerald-50 ring-1 ring-[#176b5b]"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className="size-4 text-[#176b5b]" aria-hidden />
                    <span className="mt-3 text-xs font-semibold text-neutral-900">
                      {template.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
            <Field label="What outcome do you want?" hint="Write a result, not a vague category. Example: Move into a backend role.">
              <input
                className={inputClass}
                name="title"
                required
                placeholder="Move into a stronger role"
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
              />
            </Field>
            <Field label="Life area">
              <select
                className={inputClass}
                name="domain"
                value={draft.domain}
                onChange={(event) => update("domain", event.target.value as GoalDomain)}
              >
                {goalDomains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain.replace("-", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Meaningful deadline" hint="Choose when the outcome should be measurably true.">
              <input
                className={inputClass}
                name="deadline"
                type="date"
                min={today}
                required
                value={draft.deadline}
                onChange={(event) => update("deadline", event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Target amount (INR)" hint="Use 0 when the goal does not need a corpus or purchase budget.">
              <input
                className={inputClass}
                name="targetAmount"
                type="number"
                min="0"
                inputMode="numeric"
                value={draft.targetAmount}
                onChange={(event) => update("targetAmount", event.target.value)}
              />
            </Field>
            <Field label="Focused hours per week" hint="Count deliberate work, not passive thinking time.">
              <input
                className={inputClass}
                name="weeklyHours"
                type="number"
                min="0"
                max="80"
                step="0.5"
                value={draft.weeklyHours}
                onChange={(event) => update("weeklyHours", event.target.value)}
              />
            </Field>
            <Field label="Priority" hint="Only one or two goals should be core at the same time.">
              <select
                className={inputClass}
                name="priority"
                value={draft.priority}
                onChange={(event) => update("priority", event.target.value)}
              >
                <option value="1">1 - core</option>
                <option value="2">2 - high</option>
                <option value="3">3 - normal</option>
                <option value="4">4 - later</option>
                <option value="5">5 - reward</option>
              </select>
            </Field>
          </div>

          <div className="grid divide-y divide-neutral-200 border-y border-neutral-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="py-4 sm:pr-5">
              <p className="text-xs font-medium text-neutral-500">Estimated money demand</p>
              <p className="mt-1 text-lg font-semibold text-neutral-950">
                {targetAmount > 0 ? `${formatInr(monthlyDemand)}/month` : "No direct corpus"}
              </p>
            </div>
            <div className="py-4 sm:pl-5">
              <p className="text-xs font-medium text-neutral-500">Estimated daily demand</p>
              <p className="mt-1 text-lg font-semibold text-neutral-950">
                {Math.round(dailyDemand)} minutes/day
              </p>
            </div>
          </div>

          <details className="group rounded-lg border border-neutral-200 bg-neutral-50">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-sm font-semibold text-neutral-800">
              Add motivation, dependencies, or notes
              <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="grid gap-4 border-t border-neutral-200 p-4 sm:grid-cols-2">
              <Field label="Why it matters">
                <textarea
                  className={textareaClass}
                  name="why"
                  placeholder="What changes when this becomes true?"
                  value={draft.why}
                  onChange={(event) => update("why", event.target.value)}
                />
              </Field>
              <Field label="Dependencies or success criteria">
                <textarea
                  className={textareaClass}
                  name="description"
                  placeholder="Courses, milestones, people, or purchases this depends on."
                  value={draft.description}
                  onChange={(event) => update("description", event.target.value)}
                />
              </Field>
            </div>
          </details>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-5 text-neutral-500">
              Saving recalculates the whole plan. RoadmapOS will flag this goal if it competes with existing money, time, or priority limits.
            </p>
            <SubmitButton className="shrink-0">
              <Plus className="size-4" aria-hidden />
              Add goal and check fit
            </SubmitButton>
          </div>
        </form>
      </details>
    </section>
  );
}
