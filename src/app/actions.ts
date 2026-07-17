"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  generateRoadmap,
  generateWeeklyRecovery,
  runGroundedResearch,
} from "@/lib/ai/roadmap";
import { analyzeConstraints } from "@/lib/constraints";
import { getCurrentUserId } from "@/lib/current-user";
import {
  archiveGoal,
  applyResearchRun,
  createGoal,
  createResearchRun,
  createRoadmapRecord,
  createWeeklyReview,
  getSnapshot,
  logAiRun,
  saveProfile,
  toggleTask,
  updateGoal,
  updateGoalProgress,
} from "@/lib/repository";
import {
  goalSchema,
  goalProgressSchema,
  onboardingSchema,
  researchRequestSchema,
  weeklyReviewSchema,
} from "@/lib/schemas";

function formObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function hashInput(value: unknown) {
  const text = JSON.stringify(value);
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function saveOnboardingAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const parsed = onboardingSchema.parse(formObject(formData));
  await saveProfile(userId, parsed);
  revalidatePath("/dashboard");
  revalidatePath("/setup");
  revalidatePath("/goals");
  redirect("/goals");
}

export async function createGoalAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const parsed = goalSchema.parse(formObject(formData));
  await createGoal(userId, parsed);
  revalidatePath("/goals");
  redirect("/goals");
}

export async function updateGoalAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const goalId = String(formData.get("goalId") ?? "");
  const parsed = goalSchema.parse(formObject(formData));
  await updateGoal(userId, goalId, parsed);
  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/roadmap");
}

export async function updateGoalProgressAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const goalId = String(formData.get("goalId") ?? "");
  const parsed = goalProgressSchema.parse(formObject(formData));
  await updateGoalProgress(userId, goalId, parsed);
  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/roadmap");
}

export async function archiveGoalAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const goalId = String(formData.get("goalId") ?? "");
  await archiveGoal(userId, goalId);
  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/roadmap");
}

export async function generateRoadmapAction() {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);

  if (!snapshot.profile) {
    redirect("/setup");
  }

  if (snapshot.goals.length === 0) {
    redirect("/goals");
  }

  const generated = await generateRoadmap(
    snapshot.profile,
    snapshot.goals,
    snapshot.researchRuns.filter((run) => run.appliedAt),
  );
  const constraints = analyzeConstraints(snapshot.profile, snapshot.goals);
  const roadmapSnapshot = {
    ...snapshot,
    constraints,
  };

  await createRoadmapRecord(
    userId,
    "manual-generation",
    generated.roadmap.vision2Year,
    generated.roadmap,
    roadmapSnapshot,
  );
  await logAiRun(userId, {
    kind: "roadmap",
    provider: generated.provider,
    model: generated.model,
    promptHash: hashInput({ profile: snapshot.profile, goals: snapshot.goals }),
    request: { goals: snapshot.goals.length },
    output: generated.roadmap as unknown as Record<string, unknown>,
    status: "success",
  });

  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
  redirect("/roadmap");
}

export async function toggleTaskAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const taskId = String(formData.get("taskId") ?? "");
  await toggleTask(userId, taskId);
  revalidatePath("/dashboard");
}

export async function submitWeeklyReviewAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);

  if (!snapshot.profile) {
    redirect("/setup");
  }

  const parsed = weeklyReviewSchema.parse(formObject(formData));
  const recovery = await generateWeeklyRecovery(snapshot.profile, snapshot.goals, {
    ...parsed,
    weekStart: "",
    aiRecovery: [],
  });
  const review = await createWeeklyReview(userId, {
    ...parsed,
    aiRecovery: recovery,
  });

  if (snapshot.goals.length > 0) {
    const generated = await generateRoadmap(
      snapshot.profile,
      snapshot.goals,
      snapshot.researchRuns.filter((run) => run.appliedAt),
      recovery,
    );
    await createRoadmapRecord(
      userId,
      "weekly-review",
      generated.roadmap.vision2Year,
      generated.roadmap,
      snapshot,
    );
    await logAiRun(userId, {
      kind: "weekly-replan",
      provider: generated.provider,
      model: generated.model,
      promptHash: hashInput({ review, goals: snapshot.goals }),
      request: { reviewId: review.id, goals: snapshot.goals.length },
      output: generated.roadmap as unknown as Record<string, unknown>,
      status: "success",
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/review");
  revalidatePath("/roadmap");
  redirect("/review");
}

export async function runResearchAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const snapshot = await getSnapshot(userId);

  if (!snapshot.profile) {
    redirect("/setup");
  }

  const parsed = researchRequestSchema.parse(formObject(formData));
  const result = await runGroundedResearch(
    snapshot.profile,
    snapshot.goals,
    parsed.query,
    parsed.goalId,
  );
  const run = await createResearchRun(userId, {
    goalId: parsed.goalId,
    query: parsed.query,
    ...result,
  });
  await logAiRun(userId, {
    kind: "research",
    provider: result.grounded ? "gemini-grounded" : "fallback",
    model: result.grounded
      ? (process.env.GEMINI_RESEARCH_MODEL ?? "gemini-3.5-flash")
      : "deterministic",
    promptHash: hashInput(parsed),
    request: { query: parsed.query, goalId: parsed.goalId ?? null },
    output: { summary: run.summary, citations: run.citations },
    status: "success",
  });

  revalidatePath("/research");
  redirect("/research");
}

export async function applyResearchAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const researchId = String(formData.get("researchId") ?? "");
  await applyResearchRun(userId, researchId);

  const snapshot = await getSnapshot(userId);
  if (snapshot.profile && snapshot.goals.length > 0) {
    const generated = await generateRoadmap(
      snapshot.profile,
      snapshot.goals,
      snapshot.researchRuns.map((run) =>
        run.id === researchId ? { ...run, appliedAt: new Date().toISOString() } : run,
      ),
    );
    await createRoadmapRecord(
      userId,
      "research-applied",
      generated.roadmap.vision2Year,
      generated.roadmap,
      {
        ...snapshot,
        constraints: analyzeConstraints(snapshot.profile, snapshot.goals),
      },
    );
  }

  if (snapshot.goals.length === 0) {
    revalidatePath("/research");
    redirect("/goals");
  }

  revalidatePath("/research");
  revalidatePath("/roadmap");
  redirect("/roadmap");
}
