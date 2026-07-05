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
  };
}

describe("analyzeConstraints", () => {
  it("marks a balanced plan as realistic or stretched without conflicts", () => {
    const report = analyzeConstraints(profile, [
      goal({ title: "DSA", weeklyHours: 5 }),
      goal({ title: "Gym", domain: "health", weeklyHours: 4 }),
    ]);

    expect(report.conflicts).toHaveLength(0);
    expect(["realistic", "stretched"]).toContain(report.feasibility);
  });

  it("detects when money goals exceed monthly surplus", () => {
    const report = analyzeConstraints(profile, [
      goal({
        title: "Luxury car",
        domain: "lifestyle",
        targetAmount: 1800000,
        deadline: "2026-10-01",
      }),
    ]);

    expect(report.feasibility).toBe("conflicting");
    expect(report.conflicts.join(" ")).toContain("monthly money");
  });

  it("detects house delays from lifestyle purchases", () => {
    const report = analyzeConstraints(profile, [
      goal({
        id: "house",
        title: "House down payment",
        domain: "wealth",
        targetAmount: 2500000,
        deadline: "2028-07-01",
      }),
      goal({
        id: "watch",
        title: "Apple Watch",
        domain: "lifestyle",
        targetAmount: 45000,
        deadline: "2026-09-01",
      }),
    ]);

    expect(report.conflicts.some((item) => item.includes("Apple Watch"))).toBe(true);
  });

  it("detects weekly time overload", () => {
    const report = analyzeConstraints(profile, [
      goal({ title: "DSA", weeklyHours: 20 }),
      goal({ title: "AI", domain: "skills", weeklyHours: 15 }),
      goal({ title: "Gym", domain: "health", weeklyHours: 10 }),
    ]);

    expect(report.feasibility).toBe("conflicting");
    expect(report.conflicts.join(" ")).toContain("weekly commitments");
  });
});
