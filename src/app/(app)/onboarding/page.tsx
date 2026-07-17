import { Save } from "lucide-react";
import { saveOnboardingAction } from "@/app/actions";
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

export default async function OnboardingPage() {
  const userId = await getCurrentUserId();
  const { profile } = await getSnapshot(userId);

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Onboarding" title="Tell RoadmapOS what your real week looks like." />

      <PageGuide
        title="Finish this once, then update only when life changes."
        text="RoadmapOS intentionally leaves part of your money and time unplanned. These inputs decide how large that safety margin should be."
        steps={[
          "Enter monthly money numbers in INR.",
          "Enter free time per day in minutes, not hours.",
          "Write the responsibilities and blockers that usually break your routine.",
          "Save profile, then add your goals.",
        ]}
      />

      <Panel>
        <form action={saveOnboardingAction} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Age" hint="Years completed. Example: 23.">
              <input
                className={inputClass}
                name="age"
                type="number"
                min="16"
                defaultValue={profile?.age ?? 23}
                required
              />
            </Field>
            <Field label="Monthly income (INR)" hint="Your usual take-home amount per month.">
              <input
                className={inputClass}
                name="monthlyIncome"
                type="number"
                min="0"
                defaultValue={profile?.monthlyIncome ?? 125000}
                required
              />
            </Field>
            <Field label="Current savings (INR)" hint="Cash, bank balance, mutual funds, or liquid savings you can plan with.">
              <input
                className={inputClass}
                name="currentSavings"
                type="number"
                min="0"
                defaultValue={profile?.currentSavings ?? 1000000}
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Fixed monthly expenses (INR)" hint="Rent, EMI, bills, family support, food, transport, and subscriptions.">
              <input
                className={inputClass}
                name="fixedExpenses"
                type="number"
                min="0"
                defaultValue={profile?.fixedExpenses ?? 45000}
                required
              />
            </Field>
            <Field label="Free time per day in minutes" hint="Example: 150 means about 2.5 focused hours outside work and sleep.">
              <input
                className={inputClass}
                name="dailyAvailableMinutes"
                type="number"
                min="15"
                max="720"
                defaultValue={profile?.dailyAvailableMinutes ?? 150}
                required
              />
            </Field>
            <Field label="Preferred intensity" hint="Balanced is safest for long-term consistency.">
              <select
                className={inputClass}
                name="intensity"
                defaultValue={profile?.intensity ?? "balanced"}
              >
                <option value="chill">Chill - largest safety margin</option>
                <option value="balanced">Balanced - recommended</option>
                <option value="aggressive">Aggressive - smallest safety margin</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Energy level" hint="Use plain language: fresh morning, tired after work, strong weekends, etc.">
              <input
                className={inputClass}
                name="energyLevel"
                placeholder="Balanced after work"
                defaultValue={profile?.energyLevel ?? "Balanced after work"}
                required
              />
            </Field>
            <Field label="Family responsibilities" hint="Mention support, errands, care duties, commute, or fixed family time.">
              <textarea
                className={textareaClass}
                name="familyResponsibilities"
                placeholder="Example: family support, weekend errands, fixed evening calls"
                defaultValue={profile?.familyResponsibilities ?? ""}
              />
            </Field>
          </div>

          <Field label="Biggest blockers" hint="What usually stops execution: fatigue, phone, late work, relapse, travel, uncertainty.">
            <textarea
              className={textareaClass}
              name="blockers"
              placeholder="Example: phone at night, inconsistent sleep, work calls after 8 PM"
              defaultValue={profile?.blockers ?? ""}
            />
          </Field>

          <SubmitButton>
            <Save className="size-4" aria-hidden />
            Save profile
          </SubmitButton>
        </form>
      </Panel>
    </div>
  );
}
