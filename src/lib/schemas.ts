import { z } from "zod";
import { goalDomains } from "@/lib/types";

export const intensitySchema = z.enum(["chill", "balanced", "aggressive"]);

export const simpleSignInSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().trim().toLowerCase(),
});

export const onboardingSchema = z.object({
  age: z.coerce.number().int().min(16).max(80),
  monthlyIncome: z.coerce.number().min(0),
  fixedExpenses: z.coerce.number().min(0),
  currentSavings: z.coerce.number().min(0),
  familyResponsibilities: z.string().trim().max(800).default(""),
  dailyAvailableMinutes: z.coerce.number().int().min(15).max(720),
  energyLevel: z.string().trim().min(2).max(80),
  blockers: z.string().trim().max(800).default(""),
  intensity: intensitySchema,
});

export const goalSchema = z.object({
  title: z.string().trim().min(2).max(120),
  domain: z.enum(goalDomains),
  description: z.string().trim().max(1000).default(""),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetAmount: z.coerce.number().min(0).default(0),
  weeklyHours: z.coerce.number().min(0).max(80).default(0),
  priority: z.coerce.number().int().min(1).max(5).default(3),
  why: z.string().trim().max(500).default(""),
});

export const goalProgressSchema = z.object({
  progress: z.coerce.number().int().min(0).max(100),
  progressNote: z.string().trim().max(500).default(""),
});

export const weeklyReviewSchema = z.object({
  completed: z.string().trim().min(2).max(1200),
  slipped: z.string().trim().max(1200).default(""),
  reasons: z.string().trim().max(1200).default(""),
  savedAmount: z.coerce.number().min(0).default(0),
  workoutsDone: z.coerce.number().int().min(0).max(14).default(0),
  studyHours: z.coerce.number().min(0).max(120).default(0),
  disciplineScore: z.coerce.number().int().min(1).max(10).default(5),
  energyNextWeek: z.string().trim().min(2).max(80),
});

const optionalFormIdSchema = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }

    return value;
  },
  z.string().trim().min(1).optional(),
);

export const researchRequestSchema = z.object({
  goalId: optionalFormIdSchema,
  query: z.string().trim().min(8).max(500),
});

export const roadmapOutputSchema = z.object({
  vision2Year: z.string(),
  yearRoadmap: z.array(z.string()).min(1),
  quarterlyMilestones: z.array(
    z.object({
      quarter: z.string(),
      title: z.string(),
      targetDate: z.string(),
      goalTitle: z.string().optional(),
    }),
  ),
  monthlyTargets: z.array(
    z.object({
      month: z.string(),
      target: z.string(),
      metric: z.string(),
    }),
  ),
  weeklyPlan: z.array(
    z.object({
      week: z.string(),
      focus: z.string(),
      actions: z.array(z.string()),
    }),
  ),
  dailyNonNegotiables: z.array(
    z.object({
      title: z.string(),
      domain: z.enum(goalDomains),
      minutes: z.number(),
      goalTitle: z.string().optional(),
    }),
  ),
  conflicts: z.array(z.string()),
  recoveryPlan: z.array(z.string()),
});
