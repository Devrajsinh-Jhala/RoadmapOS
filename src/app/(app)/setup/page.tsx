import { PageHeader } from "@/components/ui";
import { SetupWizard } from "@/components/setup-wizard";
import { getCurrentUserId } from "@/lib/current-user";
import { getSnapshot } from "@/lib/repository";

export default async function SetupPage() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow={snapshot.profile ? "Update setup" : "Welcome to RoadmapOS"}
        title={
          snapshot.profile
            ? "Keep the plan aligned with your real life."
            : "Build a realistic baseline before adding goals."
        }
      />
      <SetupWizard profile={snapshot.profile} />
    </div>
  );
}
