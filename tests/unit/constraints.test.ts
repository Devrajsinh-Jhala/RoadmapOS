import { describe, expect, it } from "vitest";
import { analyzeConstraints } from "@/lib/constraints";
import type { Goal, UserProfile } from "@/lib/types";

const profile: UserProfile = {
  id: "profile",
  userId: "user",
  age: 23,
  monthlyIncome: 125000,
  fixedExpenses: 45000,
  currentSavings: 1000000,
  familyResponsibilities: "Family support",
  dailyAvailableMinutes: 150,
  energyLevel: "Medium",
  blockers: "Phone at night",
  intensity: "balanced",
  currency: "INR",
  timezone: "Asia/Kolkata",
  onboarded: true,
};

const now = new Date("2026-07-17T00:00:00+05:30");

function goal(input: Partial<Goal>): Goal {
  return {
    id: input.id ?? "goal",
    userId: "user",
    title: input.title ?? "Goal",
    domain: input.domain ?? "career",
    description: input.description ?? "",
    deadline: input.deadline ?? "2027-07-01",
    targetAmount: input.targetAmount ?? 0,
    weeklyHours: input.weeklyHours ?? 3,
    priority: input.priority ?? 2,
    status: "active",
    why: input.why ?? "",
    progress: input.progress ?? 0,
    progressNote: input.progressNote ?? "",
    lastCheckInAt: input.lastCheckInAt ?? null,
  };
}

describe("analyzeConstraints", () => {
  it("marks a balanced plan as realistic or stretched without conflicts", () => {
    const report = analyzeConstraints(profile, [
      goal({ title: "DSA", weeklyHours: 5 }),
      goal({ title: "Gym", domain: "health", weeklyHours: 4 }),
    ], now);

    expect(report.conflicts).toHaveLength(0);
    expect(["realistic", "stretched"]).toContain(report.feasibility);
    expect(report.safeMonthlyCapacity).toBe(60000);
    expect(report.monthlyBuffer).toBe(20000);
    expect(report.safeDailyMinutes).toBe(112.5);
  });

  it("detects when money goals exceed monthly surplus", () => {
    const report = analyzeConstraints(profile, [
      goal({
        title: "Luxury car",
        domain: "lifestyle",
        targetAmount: 1800000,
        deadline: "2026-10-01",
      }),
    ], now);

    expect(report.feasibility).toBe("conflicting");
    expect(report.issues.some((issue) => issue.id === "money-overload")).toBe(true);
    expect(report.primaryWarning).toContain("safe limit");
  });

  it("detects house delays from lifestyle purchases", () => {
    const report = analyzeConstraints(profile, [
      goal({
        id: "house",
        title: "House down payment",
        domain: "wealth",
        targetAmount: 2500000,
        deadline: "2030-07-01",
      }),
      goal({
        id: "watch",
        title: "Apple Watch",
        domain: "lifestyle",
        targetAmount: 45000,
        deadline: "2026-09-01",
      }),
    ], now);

    expect(report.issues.some((issue) => issue.id.startsWith("sequence-watch"))).toBe(true);
    expect(report.feasibility).toBe("risky");
    expect(
      report.goalAssessments.find((assessment) => assessment.goalId === "watch")
        ?.feasibility,
    ).toBe("risky");
  });

  it("detects weekly time overload", () => {
    const report = analyzeConstraints(profile, [
      goal({ title: "DSA", weeklyHours: 20 }),
      goal({ title: "AI", domain: "skills", weeklyHours: 15 }),
      goal({ title: "Gym", domain: "health", weeklyHours: 10 }),
    ], now);

    expect(report.feasibility).toBe("conflicting");
    expect(report.issues.some((issue) => issue.id === "time-overload")).toBe(true);
    expect(report.committedDailyMinutes).toBeGreaterThan(report.safeDailyMinutes);
  });

  it("protects an emergency reserve and allocates remaining savings only once", () => {
    const report = analyzeConstraints(profile, [
      goal({
        id: "home",
        title: "Home deposit",
        domain: "wealth",
        targetAmount: 800000,
        priority: 1,
      }),
      goal({
        id: "investments",
        title: "Investment corpus",
        domain: "wealth",
        targetAmount: 800000,
        priority: 2,
      }),
    ], now);

    expect(report.emergencyFundTarget).toBe(270000);
    expect(report.protectedSavings).toBe(270000);
    expect(report.allocatableSavings).toBe(730000);
    expect(
      report.goalAssessments.reduce(
        (total, assessment) => total + assessment.savingsAllocated,
        0,
      ),
    ).toBe(730000);
    expect(report.goalAssessments[0].savingsAllocated).toBe(730000);
    expect(report.goalAssessments[1].savingsAllocated).toBe(0);
  });

  it("flags expired deadlines as critical", () => {
    const report = analyzeConstraints(profile, [
      goal({ title: "Old deadline", deadline: "2026-01-01" }),
    ], now);

    expect(report.feasibility).toBe("conflicting");
    expect(report.issues.some((issue) => issue.id.startsWith("expired-"))).toBe(true);
    expect(report.goalAssessments[0].recommendedAction).toContain("Extend");
  });

  it("warns when more than two goals are marked core", () => {
    const report = analyzeConstraints(profile, [
      goal({ id: "one", title: "One", priority: 1 }),
      goal({ id: "two", title: "Two", priority: 1 }),
      goal({ id: "three", title: "Three", priority: 1 }),
    ], now);

    expect(report.issues.some((issue) => issue.id === "too-many-core-goals")).toBe(true);
    expect(report.nextActions.join(" ")).toContain("at most two priority 1 goals");
  });
});
