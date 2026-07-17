import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import {
  aiRunLogs,
  dailyTasks,
  goals as goalsTable,
  milestones,
  profiles,
  researchRuns,
  roadmapVersions,
  users,
  weeklyReviews,
} from "@/db/schema";
import { analyzeConstraints } from "@/lib/constraints";
import { DEMO_USER_ID } from "@/lib/current-user";
import { getDemoSnapshot, getDemoState } from "@/lib/demo-store";
import { todayIso, weekStartIso } from "@/lib/format";
import type {
  AppSnapshot,
  DailyTask,
  Goal,
  GoalDomain,
  ResearchCitation,
  ResearchRun,
  RoadmapOutput,
  RoadmapVersion,
  UserProfile,
  WeeklyReview,
} from "@/lib/types";

function shouldUseDb(userId: string) {
  return Boolean(db && userId !== DEMO_USER_ID);
}

function numberValue(value: string | number | null | undefined) {
  return Number(value ?? 0);
}

function profileFromRow(row: typeof profiles.$inferSelect): UserProfile {
  return {
    id: row.id,
    userId: row.userId,
    age: row.age,
    monthlyIncome: numberValue(row.monthlyIncome),
    fixedExpenses: numberValue(row.fixedExpenses),
    currentSavings: numberValue(row.currentSavings),
    familyResponsibilities: row.familyResponsibilities,
    dailyAvailableMinutes: row.dailyAvailableMinutes,
    energyLevel: row.energyLevel,
    blockers: row.blockers,
    intensity:
      row.intensity === "chill" || row.intensity === "aggressive"
        ? row.intensity
        : "balanced",
    currency: "INR",
    timezone: "Asia/Kolkata",
    onboarded: row.onboarded,
  };
}

function goalFromRow(row: typeof goalsTable.$inferSelect): Goal {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    domain: row.domain as GoalDomain,
    description: row.description,
    deadline: row.deadline,
    targetAmount: numberValue(row.targetAmount),
    weeklyHours: numberValue(row.weeklyHours),
    priority: row.priority,
    status:
      row.status === "paused" || row.status === "done" ? row.status : "active",
    why: row.why,
  };
}

function roadmapFromRow(row: typeof roadmapVersions.$inferSelect): RoadmapVersion {
  return {
    id: row.id,
    userId: row.userId,
    trigger: row.trigger,
    summary: row.summary,
    structured: row.structured,
    constraintReport: row.constraintReport,
    createdAt: row.createdAt.toISOString(),
  };
}

function taskFromRow(row: typeof dailyTasks.$inferSelect): DailyTask {
  return {
    id: row.id,
    userId: row.userId,
    roadmapId: row.roadmapId ?? undefined,
    goalId: row.goalId ?? undefined,
    title: row.title,
    domain: row.domain as GoalDomain,
    dueDate: row.dueDate,
    isNonNegotiable: row.isNonNegotiable,
    completedAt: row.completedAt?.toISOString() ?? null,
  };
}

function reviewFromRow(row: typeof weeklyReviews.$inferSelect): WeeklyReview {
  return {
    id: row.id,
    userId: row.userId,
    weekStart: row.weekStart,
    completed: row.completed,
    slipped: row.slipped,
    reasons: row.reasons,
    savedAmount: numberValue(row.savedAmount),
    workoutsDone: row.workoutsDone,
    studyHours: numberValue(row.studyHours),
    disciplineScore: row.disciplineScore,
    energyNextWeek: row.energyNextWeek,
    aiRecovery: row.aiRecovery,
    createdAt: row.createdAt.toISOString(),
  };
}

function researchFromRow(row: typeof researchRuns.$inferSelect): ResearchRun {
  return {
    id: row.id,
    userId: row.userId,
    goalId: row.goalId ?? undefined,
    query: row.query,
    summary: row.summary,
    grounded: row.grounded,
    citations: row.citations,
    appliedAt: row.appliedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createOrFindUser(input: { name: string; email: string }) {
  if (!shouldUseDb(input.email) || !db) {
    return {
      id: DEMO_USER_ID,
      name: input.name,
      email: input.email,
    };
  }

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing) {
    if (existing.name !== input.name) {
      await db
        .update(users)
        .set({ name: input.name, updatedAt: new Date() })
        .where(eq(users.id, existing.id));
    }

    return {
      id: existing.id,
      name: input.name,
      email: existing.email ?? input.email,
    };
  }

  const [created] = await db
    .insert(users)
    .values({
      id: nanoid(),
      name: input.name,
      email: input.email,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  return {
    id: created.id,
    name: created.name ?? input.name,
    email: created.email ?? input.email,
  };
}

export async function getSnapshot(userId: string): Promise<AppSnapshot> {
  if (!shouldUseDb(userId) || !db) {
    return getDemoSnapshot();
  }

  const [profileRow, goalRows, roadmapRows, taskRows, reviewRows, researchRows] =
    await Promise.all([
      db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1),
      db
        .select()
        .from(goalsTable)
        .where(and(eq(goalsTable.userId, userId), eq(goalsTable.status, "active")))
        .orderBy(goalsTable.priority),
      db
        .select()
        .from(roadmapVersions)
        .where(eq(roadmapVersions.userId, userId))
        .orderBy(desc(roadmapVersions.createdAt))
        .limit(1),
      db
        .select()
        .from(dailyTasks)
        .where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.dueDate, todayIso()))),
      db
        .select()
        .from(weeklyReviews)
        .where(eq(weeklyReviews.userId, userId))
        .orderBy(desc(weeklyReviews.createdAt))
        .limit(8),
      db
        .select()
        .from(researchRuns)
        .where(eq(researchRuns.userId, userId))
        .orderBy(desc(researchRuns.createdAt))
        .limit(12),
    ]);

  const profile = profileRow[0] ? profileFromRow(profileRow[0]) : null;
  const goals = goalRows.map(goalFromRow);

  return {
    profile,
    goals,
    latestRoadmap: roadmapRows[0] ? roadmapFromRow(roadmapRows[0]) : null,
    todayTasks: taskRows.map(taskFromRow),
    weeklyReviews: reviewRows.map(reviewFromRow),
    researchRuns: researchRows.map(researchFromRow),
    constraints: profile ? analyzeConstraints(profile, goals) : null,
  };
}

export async function saveProfile(
  userId: string,
  input: Omit<UserProfile, "id" | "userId" | "currency" | "timezone" | "onboarded">,
) {
  if (!shouldUseDb(userId) || !db) {
    const state = getDemoState();
    state.profile = {
      ...state.profile,
      ...input,
      onboarded: true,
    };
    return state.profile;
  }

  await db
    .insert(profiles)
    .values({
      id: nanoid(),
      userId,
      age: input.age,
      monthlyIncome: String(input.monthlyIncome),
      fixedExpenses: String(input.fixedExpenses),
      currentSavings: String(input.currentSavings),
      familyResponsibilities: input.familyResponsibilities,
      dailyAvailableMinutes: input.dailyAvailableMinutes,
      energyLevel: input.energyLevel,
      blockers: input.blockers,
      intensity: input.intensity,
      onboarded: true,
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        age: input.age,
        monthlyIncome: String(input.monthlyIncome),
        fixedExpenses: String(input.fixedExpenses),
        currentSavings: String(input.currentSavings),
        familyResponsibilities: input.familyResponsibilities,
        dailyAvailableMinutes: input.dailyAvailableMinutes,
        energyLevel: input.energyLevel,
        blockers: input.blockers,
        intensity: input.intensity,
        onboarded: true,
        updatedAt: new Date(),
      },
    });
}

export async function createGoal(
  userId: string,
  input: Omit<Goal, "id" | "userId" | "status">,
) {
  const id = nanoid();
  const goal: Goal = {
    ...input,
    id,
    userId,
    status: "active",
  };

  if (!shouldUseDb(userId) || !db) {
    getDemoState().goals.unshift(goal);
    return goal;
  }

  await db.insert(goalsTable).values({
    id,
    userId,
    title: input.title,
    domain: input.domain,
    description: input.description,
    deadline: input.deadline,
    targetAmount: String(input.targetAmount),
    weeklyHours: String(input.weeklyHours),
    priority: input.priority,
    why: input.why,
  });

  return goal;
}

export async function updateGoal(
  userId: string,
  goalId: string,
  input: Omit<Goal, "id" | "userId" | "status">,
) {
  if (!goalId) {
    return;
  }

  if (!shouldUseDb(userId) || !db) {
    const goal = getDemoState().goals.find((item) => item.id === goalId);
    if (goal) {
      Object.assign(goal, input);
    }
    return;
  }

  await db
    .update(goalsTable)
    .set({
      title: input.title,
      domain: input.domain,
      description: input.description,
      deadline: input.deadline,
      targetAmount: String(input.targetAmount),
      weeklyHours: String(input.weeklyHours),
      priority: input.priority,
      why: input.why,
      updatedAt: new Date(),
    })
    .where(and(eq(goalsTable.userId, userId), eq(goalsTable.id, goalId)));
}

export async function archiveGoal(userId: string, goalId: string) {
  if (!goalId) {
    return;
  }

  if (!shouldUseDb(userId) || !db) {
    const goal = getDemoState().goals.find((item) => item.id === goalId);
    if (goal) {
      goal.status = "paused";
    }
    getDemoState().tasks = getDemoState().tasks.filter(
      (task) => task.goalId !== goalId,
    );
    return;
  }

  await Promise.all([
    db
      .update(goalsTable)
      .set({ status: "paused", updatedAt: new Date() })
      .where(and(eq(goalsTable.userId, userId), eq(goalsTable.id, goalId))),
    db
      .delete(dailyTasks)
      .where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.goalId, goalId))),
  ]);
}

export async function createRoadmapRecord(
  userId: string,
  trigger: string,
  summary: string,
  structured: RoadmapOutput,
  snapshot: Pick<AppSnapshot, "profile" | "goals" | "constraints">,
) {
  if (!snapshot.profile || !snapshot.constraints) {
    throw new Error("Profile is required before generating a roadmap.");
  }

  const roadmap: RoadmapVersion = {
    id: nanoid(),
    userId,
    trigger,
    summary,
    structured,
    constraintReport: snapshot.constraints,
    createdAt: new Date().toISOString(),
  };

  const tasks: DailyTask[] = structured.dailyNonNegotiables.map((task) => ({
    id: nanoid(),
    userId,
    roadmapId: roadmap.id,
    goalId: snapshot.goals.find((goal) => goal.title === task.goalTitle)?.id,
    title: task.title,
    domain: task.domain,
    dueDate: todayIso(),
    isNonNegotiable: true,
    completedAt: null,
  }));

  if (!shouldUseDb(userId) || !db) {
    const state = getDemoState();
    state.roadmaps.unshift(roadmap);
    state.tasks = [...tasks, ...state.tasks.filter((task) => task.dueDate !== todayIso())];
    return roadmap;
  }

  await db.insert(roadmapVersions).values({
    id: roadmap.id,
    userId,
    trigger,
    summary,
    structured,
    constraintReport: snapshot.constraints,
  });

  const milestoneValues = structured.quarterlyMilestones.map((milestone) => ({
    id: nanoid(),
    roadmapId: roadmap.id,
    goalId:
      snapshot.goals.find((goal) => goal.title === milestone.goalTitle)?.id ?? null,
    title: milestone.title,
    targetDate: milestone.targetDate,
    period: milestone.quarter,
    measure: milestone.goalTitle ?? "",
  }));

  if (milestoneValues.length > 0) {
    await db.insert(milestones).values(milestoneValues);
  }

  if (tasks.length > 0) {
    await db.insert(dailyTasks).values(
      tasks.map((task) => ({
        id: task.id,
        userId,
        roadmapId: roadmap.id,
        goalId: task.goalId ?? null,
        title: task.title,
        domain: task.domain,
        dueDate: task.dueDate,
        isNonNegotiable: true,
      })),
    );
  }

  return roadmap;
}

export async function toggleTask(userId: string, taskId: string) {
  if (!shouldUseDb(userId) || !db) {
    const task = getDemoState().tasks.find((item) => item.id === taskId);
    if (task) {
      task.completedAt = task.completedAt ? null : new Date().toISOString();
    }
    return;
  }

  const [task] = await db
    .select()
    .from(dailyTasks)
    .where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.id, taskId)))
    .limit(1);

  if (!task) {
    return;
  }

  await db
    .update(dailyTasks)
    .set({ completedAt: task.completedAt ? null : new Date() })
    .where(and(eq(dailyTasks.userId, userId), eq(dailyTasks.id, taskId)));
}

export async function createWeeklyReview(
  userId: string,
  input: Omit<WeeklyReview, "id" | "userId" | "weekStart" | "createdAt">,
) {
  const review: WeeklyReview = {
    ...input,
    id: nanoid(),
    userId,
    weekStart: weekStartIso(),
    createdAt: new Date().toISOString(),
  };

  if (!shouldUseDb(userId) || !db) {
    getDemoState().weeklyReviews.unshift(review);
    return review;
  }

  await db.insert(weeklyReviews).values({
    id: review.id,
    userId,
    weekStart: review.weekStart,
    completed: review.completed,
    slipped: review.slipped,
    reasons: review.reasons,
    savedAmount: String(review.savedAmount),
    workoutsDone: review.workoutsDone,
    studyHours: String(review.studyHours),
    disciplineScore: review.disciplineScore,
    energyNextWeek: review.energyNextWeek,
    aiRecovery: review.aiRecovery,
  });

  return review;
}

export async function createResearchRun(
  userId: string,
  input: {
    goalId?: string;
    query: string;
    summary: string;
    grounded: boolean;
    citations: ResearchCitation[];
    raw: Record<string, unknown>;
  },
) {
  const run: ResearchRun = {
    id: nanoid(),
    userId,
    goalId: input.goalId,
    query: input.query,
    summary: input.summary,
    grounded: input.grounded,
    citations: input.citations,
    appliedAt: null,
    createdAt: new Date().toISOString(),
  };

  if (!shouldUseDb(userId) || !db) {
    getDemoState().researchRuns.unshift(run);
    return run;
  }

  await db.insert(researchRuns).values({
    id: run.id,
    userId,
    goalId: input.goalId ?? null,
    query: input.query,
    summary: input.summary,
    grounded: input.grounded,
    citations: input.citations,
    raw: input.raw,
  });

  return run;
}

export async function applyResearchRun(userId: string, researchId: string) {
  if (!shouldUseDb(userId) || !db) {
    const run = getDemoState().researchRuns.find((item) => item.id === researchId);
    if (run) {
      run.appliedAt = new Date().toISOString();
    }
    return;
  }

  await db
    .update(researchRuns)
    .set({ appliedAt: new Date() })
    .where(and(eq(researchRuns.userId, userId), eq(researchRuns.id, researchId)));
}

export async function logAiRun(
  userId: string,
  input: {
    kind: string;
    provider: string;
    model: string;
    promptHash: string;
    request: Record<string, unknown>;
    output?: Record<string, unknown>;
    status: string;
    error?: string;
  },
) {
  if (!shouldUseDb(userId) || !db) {
    return;
  }

  await db.insert(aiRunLogs).values({
    id: nanoid(),
    userId,
    kind: input.kind,
    provider: input.provider,
    model: input.model,
    promptHash: input.promptHash,
    input: input.request,
    output: input.output,
    status: input.status,
    error: input.error,
  });
}
