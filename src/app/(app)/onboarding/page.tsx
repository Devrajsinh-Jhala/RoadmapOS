import { Save } from "lucide-react";
import { saveOnboardingAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass, PageHeader, Panel, textareaClass } from "@/components/ui";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";

export default async function OnboardingPage() {
  const userId = await getCurrentUserId();
  const { profile } = await getSnapshot(userId);

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Onboarding" title="Set the constraints before the dream." />

      <Panel>
        <form action={saveOnboardingAction} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Age">
              <input
                className={inputClass}
                name="age"
                type="number"
                min="16"
                defaultValue={profile?.age ?? 23}
                required
              />
            </Field>
            <Field label="Monthly income">
              <input
                className={inputClass}
                name="monthlyIncome"
                type="number"
                min="0"
                defaultValue={profile?.monthlyIncome ?? 125000}
                required
              />
            </Field>
            <Field label="Current savings">
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
            <Field label="Fixed monthly expenses">
              <input
                className={inputClass}
                name="fixedExpenses"
                type="number"
                min="0"
                defaultValue={profile?.fixedExpenses ?? 45000}
                required
              />
            </Field>
            <Field label="Free time per day">
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
            <Field label="Preferred intensity">
              <select
                className={inputClass}
                name="intensity"
                defaultValue={profile?.intensity ?? "balanced"}
              >
                <option value="chill">Chill</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Energy level">
              <input
                className={inputClass}
                name="energyLevel"
                defaultValue={profile?.energyLevel ?? "Balanced after work"}
                required
              />
            </Field>
            <Field label="Family responsibilities">
              <textarea
                className={textareaClass}
                name="familyResponsibilities"
                defaultValue={profile?.familyResponsibilities ?? ""}
              />
            </Field>
          </div>

          <Field label="Biggest blockers">
            <textarea
              className={textareaClass}
              name="blockers"
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
