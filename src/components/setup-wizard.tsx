"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  HeartHandshake,
  Save,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useRef, useState } from "react";
import { saveOnboardingAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass, textareaClass } from "@/components/ui";
import { formatInr } from "@/lib/format";
import type { Intensity, UserProfile } from "@/lib/types";

const steps = [
  {
    title: "Money baseline",
    description: "Income, expenses, and savings",
    Icon: WalletCards,
    fields: ["age", "monthlyIncome", "fixedExpenses", "currentSavings"],
  },
  {
    title: "Usable capacity",
    description: "Time, energy, and pace",
    Icon: Clock3,
    fields: ["dailyAvailableMinutes", "energyLevel", "intensity"],
  },
  {
    title: "Real-life constraints",
    description: "Responsibilities and blockers",
    Icon: HeartHandshake,
    fields: ["familyResponsibilities", "blockers"],
  },
  {
    title: "Review limits",
    description: "Confirm the planning guardrails",
    Icon: ShieldCheck,
    fields: [],
  },
] as const;

const intensityOptions: Array<{
  value: Intensity;
  label: string;
  detail: string;
}> = [
  {
    value: "chill",
    label: "Sustainable",
    detail: "65% of capacity",
  },
  {
    value: "balanced",
    label: "Balanced",
    detail: "75% of capacity",
  },
  {
    value: "aggressive",
    label: "Intensive",
    detail: "Up to 90% of money capacity",
  },
];

const policies = {
  chill: { moneyShare: 0.65, timeShare: 0.65, emergencyMonths: 9 },
  balanced: { moneyShare: 0.75, timeShare: 0.75, emergencyMonths: 6 },
  aggressive: { moneyShare: 0.9, timeShare: 0.85, emergencyMonths: 3 },
} as const;

type SetupValues = {
  age: string;
  monthlyIncome: string;
  fixedExpenses: string;
  currentSavings: string;
  dailyAvailableMinutes: string;
  energyLevel: string;
  intensity: Intensity;
  familyResponsibilities: string;
  blockers: string;
};

function initialValues(profile: UserProfile | null): SetupValues {
  return {
    age: profile ? String(profile.age) : "",
    monthlyIncome: profile ? String(profile.monthlyIncome) : "",
    fixedExpenses: profile ? String(profile.fixedExpenses) : "",
    currentSavings: profile ? String(profile.currentSavings) : "",
    dailyAvailableMinutes: profile ? String(profile.dailyAvailableMinutes) : "",
    energyLevel: profile?.energyLevel ?? "",
    intensity: profile?.intensity ?? "balanced",
    familyResponsibilities: profile?.familyResponsibilities ?? "",
    blockers: profile?.blockers ?? "",
  };
}

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function SetupWizard({ profile }: { profile: UserProfile | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(profile ? steps.length - 1 : 0);
  const [values, setValues] = useState<SetupValues>(() => initialValues(profile));

  const income = numberValue(values.monthlyIncome);
  const expenses = numberValue(values.fixedExpenses);
  const savings = numberValue(values.currentSavings);
  const dailyMinutes = numberValue(values.dailyAvailableMinutes);
  const surplus = income - expenses;
  const policy = policies[values.intensity];
  const safeMonthlyCapacity = Math.max(0, surplus) * policy.moneyShare;
  const monthlyBuffer = Math.max(0, surplus - safeMonthlyCapacity);
  const emergencyMonths = values.familyResponsibilities.trim()
    ? Math.max(6, policy.emergencyMonths)
    : policy.emergencyMonths;
  const emergencyTarget = expenses * emergencyMonths;
  const protectedSavings = Math.min(savings, emergencyTarget);
  const safeDailyMinutes = dailyMinutes * policy.timeShare;

  function update<K extends keyof SetupValues>(key: K, value: SetupValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validateCurrentStep() {
    const form = formRef.current;
    if (!form) {
      return false;
    }

    for (const name of steps[step].fields) {
      const control = form.elements.namedItem(name);
      if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
        if (!control.reportValidity()) {
          return false;
        }
      }
    }

    return true;
  }

  function continueSetup() {
    if (validateCurrentStep()) {
      const nextStep = Math.min(steps.length - 1, step + 1);
      setStep(nextStep);
      setMaxStep((current) => Math.max(current, nextStep));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <form
      ref={formRef}
      action={saveOnboardingAction}
      className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
    >
      <div className="border-b border-neutral-200 px-5 py-4 lg:px-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">
              Step {step + 1} of {steps.length}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              About {Math.max(1, 4 - maxStep)} minute{4 - maxStep === 1 ? "" : "s"} remaining
            </p>
          </div>
          <p className="text-sm font-semibold text-neutral-900">{Math.round(progress)}%</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-[#176b5b] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-neutral-200 bg-neutral-50 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <ol className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-1">
            {steps.map(({ title, description, Icon }, index) => {
              const active = index === step;
              const complete = index < maxStep && !active;
              return (
                <li key={title}>
                  <button
                    type="button"
                    aria-label={`${index + 1}. ${title}`}
                    onClick={() => index <= maxStep && setStep(index)}
                    disabled={index > maxStep}
                    className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition lg:p-3 ${
                      active
                        ? "bg-white text-neutral-950 shadow-sm ring-1 ring-neutral-200"
                        : complete
                          ? "text-[#176b5b] hover:bg-white"
                          : "text-neutral-400"
                    }`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                        active
                          ? "bg-[#176b5b] text-white"
                          : complete
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {complete ? (
                        <Check className="size-4" aria-hidden />
                      ) : (
                        <Icon className="size-4" aria-hidden />
                      )}
                    </span>
                    <span className="hidden min-w-0 lg:block">
                      <span className="block text-sm font-semibold">{title}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-neutral-500">
                        {description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 hidden border-t border-neutral-200 pt-5 lg:block">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#176b5b]" aria-hidden />
              <p className="text-xs leading-5 text-neutral-600">
                These values set planning limits. RoadmapOS will not move money or make purchases.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 p-5 lg:p-8">
          <section className={step === 0 ? "block" : "hidden"}>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Your baseline</p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
              Start with the money that is actually available.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Approximate numbers are enough. You can update them whenever income or responsibilities change.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Age" hint="Your completed age in years.">
                <input
                  className={inputClass}
                  name="age"
                  type="number"
                  min="16"
                  max="80"
                  inputMode="numeric"
                  required
                  placeholder="26"
                  value={values.age}
                  onChange={(event) => update("age", event.target.value)}
                />
              </Field>
              <Field label="Monthly take-home income (INR)" hint="Use your normal month, after tax.">
                <input
                  className={inputClass}
                  name="monthlyIncome"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  required
                  placeholder="85000"
                  value={values.monthlyIncome}
                  onChange={(event) => update("monthlyIncome", event.target.value)}
                />
              </Field>
              <Field label="Fixed monthly expenses (INR)" hint="Include rent, EMI, family support, bills, food, and transport.">
                <input
                  className={inputClass}
                  name="fixedExpenses"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  required
                  placeholder="36000"
                  value={values.fixedExpenses}
                  onChange={(event) => update("fixedExpenses", event.target.value)}
                />
              </Field>
              <Field label="Current liquid savings (INR)" hint="Cash, bank balance, and investments you could reasonably use.">
                <input
                  className={inputClass}
                  name="currentSavings"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  required
                  placeholder="450000"
                  value={values.currentSavings}
                  onChange={(event) => update("currentSavings", event.target.value)}
                />
              </Field>
            </div>

            <div
              className={`mt-7 border-l-4 px-4 py-3 ${
                surplus < 0
                  ? "border-red-500 bg-red-50 text-red-950"
                  : "border-[#176b5b] bg-emerald-50 text-emerald-950"
              }`}
            >
              <p className="text-xs font-semibold uppercase">Current monthly surplus</p>
              <p className="mt-1 text-xl font-semibold">{formatInr(surplus)}</p>
              <p className="mt-1 text-xs leading-5">
                {surplus < 0
                  ? "Expenses currently exceed income. The planner will treat paid goals as blocked."
                  : "The next step protects part of this surplus instead of assigning all of it to goals."}
              </p>
            </div>
          </section>

          <section className={step === 1 ? "block" : "hidden"}>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Your usable capacity</p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
              Plan for the energy you have, not the energy you wish you had.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Free time means focused time outside work, sleep, commute, meals, and fixed responsibilities.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Free time per day (minutes)" hint="Example: 120 means two focused hours are genuinely available.">
                <input
                  className={inputClass}
                  name="dailyAvailableMinutes"
                  type="number"
                  min="15"
                  max="720"
                  inputMode="numeric"
                  required
                  placeholder="120"
                  value={values.dailyAvailableMinutes}
                  onChange={(event) => update("dailyAvailableMinutes", event.target.value)}
                />
              </Field>
              <Field label="When is your energy most usable?" hint="Use a short, honest description.">
                <input
                  className={inputClass}
                  name="energyLevel"
                  required
                  placeholder="Best before work; low after 8 PM"
                  value={values.energyLevel}
                  onChange={(event) => update("energyLevel", event.target.value)}
                />
              </Field>
            </div>

            <fieldset className="mt-7">
              <legend className="text-sm font-semibold text-neutral-800">Planning pace</legend>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Balanced works best for most people. This changes how much capacity remains protected.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup">
                {intensityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      values.intensity === option.value
                        ? "border-[#176b5b] bg-emerald-50 ring-1 ring-[#176b5b]"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="intensity"
                      value={option.value}
                      checked={values.intensity === option.value}
                      onChange={() => update("intensity", option.value)}
                    />
                    <span className="block text-sm font-semibold text-neutral-950">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-neutral-500">
                      {option.detail}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-7 grid gap-4 border-y border-neutral-200 py-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-neutral-500">Safe daily planning time</p>
                <p className="mt-1 text-xl font-semibold text-neutral-950">
                  {Math.round(safeDailyMinutes)} minutes
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Time kept outside the plan</p>
                <p className="mt-1 text-xl font-semibold text-neutral-950">
                  {Math.max(0, Math.round(dailyMinutes - safeDailyMinutes))} minutes
                </p>
              </div>
            </div>
          </section>

          <section className={step === 2 ? "block" : "hidden"}>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Your real life</p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
              Tell the planner what usually disrupts a perfect week.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              This context helps recovery plans reduce scope instead of blaming you when life gets busy.
            </p>

            <div className="mt-7 grid gap-6">
              <Field
                label="Family and fixed responsibilities"
                hint="Examples: family support, caregiving, commute, evening calls, weekend errands. Leave blank if none."
              >
                <textarea
                  className={`${textareaClass} min-h-32`}
                  name="familyResponsibilities"
                  placeholder="I support family expenses and keep Sunday afternoons for family time."
                  value={values.familyResponsibilities}
                  onChange={(event) => update("familyResponsibilities", event.target.value)}
                />
              </Field>
              <Field
                label="Biggest execution blockers"
                hint="Examples: late work, phone distraction, poor sleep, travel, low energy, or an unclear next step."
              >
                <textarea
                  className={`${textareaClass} min-h-32`}
                  name="blockers"
                  placeholder="Late work calls and phone use after 10 PM usually break the routine."
                  value={values.blockers}
                  onChange={(event) => update("blockers", event.target.value)}
                />
              </Field>
            </div>

            <div className="mt-7 flex gap-3 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-amber-950">
              <HeartHandshake className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="text-sm leading-6">
                Family responsibilities keep at least six months of fixed expenses protected as an emergency target.
              </p>
            </div>
          </section>

          <section className={step === 3 ? "block" : "hidden"}>
            <p className="text-xs font-semibold uppercase text-[#176b5b]">Your planning limits</p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
              This is the capacity your goals must respect.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Goals that exceed these limits will be flagged and given a safer sequence or deadline.
            </p>

            <dl className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">
              <div className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <div>
                  <dt className="text-sm font-semibold text-neutral-950">Safe monthly goal capacity</dt>
                  <dd className="mt-1 text-xs leading-5 text-neutral-500">
                    Money available for active goals after the monthly buffer.
                  </dd>
                </div>
                <p className="text-xl font-semibold text-neutral-950">{formatInr(safeMonthlyCapacity)}</p>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <div>
                  <dt className="text-sm font-semibold text-neutral-950">Monthly buffer kept free</dt>
                  <dd className="mt-1 text-xs leading-5 text-neutral-500">
                    Unassigned capacity for real-life variation.
                  </dd>
                </div>
                <p className="text-xl font-semibold text-neutral-950">{formatInr(monthlyBuffer)}</p>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <div>
                  <dt className="text-sm font-semibold text-neutral-950">Emergency savings protected</dt>
                  <dd className="mt-1 text-xs leading-5 text-neutral-500">
                    {emergencyMonths} months of expenses targeted; only savings beyond this can fund wealth goals.
                  </dd>
                </div>
                <p className="text-xl font-semibold text-neutral-950">{formatInr(protectedSavings)}</p>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <div>
                  <dt className="text-sm font-semibold text-neutral-950">Safe daily planning time</dt>
                  <dd className="mt-1 text-xs leading-5 text-neutral-500">
                    The maximum RoadmapOS will assign across goals.
                  </dd>
                </div>
                <p className="text-xl font-semibold text-neutral-950">
                  {Math.round(safeDailyMinutes)} minutes
                </p>
              </div>
            </dl>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-950">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="text-sm font-semibold">Your baseline is ready.</p>
                <p className="mt-1 text-sm leading-6">
                  Next, add two to four goals. The planner will test all of them together before generating a roadmap.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:invisible"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={continueSetup}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#176b5b] px-5 text-sm font-semibold text-white hover:bg-[#115246]"
              >
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <SubmitButton>
                <Save className="size-4" aria-hidden />
                Save setup and continue to Goals
              </SubmitButton>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
