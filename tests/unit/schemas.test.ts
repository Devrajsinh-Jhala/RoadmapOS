import { describe, expect, it } from "vitest";
import {
  goalSchema,
  goalProgressSchema,
  onboardingSchema,
  researchRequestSchema,
  weeklyReviewSchema,
} from "@/lib/schemas";

describe("schemas", () => {
  it("coerces onboarding numbers from form data", () => {
    const parsed = onboardingSchema.parse({
      age: "23",
      monthlyIncome: "125000",
      fixedExpenses: "45000",
      currentSavings: "1000000",
      familyResponsibilities: "Family",
      dailyAvailableMinutes: "150",
      energyLevel: "Medium",
      blockers: "Phone",
      intensity: "balanced",
    });

    expect(parsed.monthlyIncome).toBe(125000);
  });

  it("validates goal domains and deadline shape", () => {
    const parsed = goalSchema.parse({
      title: "Improve career path",
      domain: "career",
      deadline: "2027-01-31",
      targetAmount: "0",
      weeklyHours: "7",
      priority: "1",
      why: "Income",
      description: "Focused practice and portfolio work",
    });

    expect(parsed.domain).toBe("career");
    expect(parsed.weeklyHours).toBe(7);
  });

  it("bounds goal progress check-ins", () => {
    expect(
      goalProgressSchema.parse({ progress: "65", progressNote: "Milestone shipped" }),
    ).toEqual({ progress: 65, progressNote: "Milestone shipped" });
    expect(() => goalProgressSchema.parse({ progress: "101" })).toThrow();
  });

  it("normalizes empty research goal selection", () => {
    const parsed = researchRequestSchema.parse({
      goalId: "",
      query: "Compare practical learning options for this goal.",
    });

    expect(parsed.goalId).toBeUndefined();
  });

  it("rejects weak research prompts", () => {
    expect(() => researchRequestSchema.parse({ query: "AI" })).toThrow();
  });

  it("keeps weekly review metrics bounded", () => {
    expect(() =>
      weeklyReviewSchema.parse({
        completed: "Studied",
        slipped: "",
        reasons: "",
        savedAmount: "1000",
        workoutsDone: "20",
        studyHours: "3",
        disciplineScore: "6",
        energyNextWeek: "Medium",
      }),
    ).toThrow();
  });
});
