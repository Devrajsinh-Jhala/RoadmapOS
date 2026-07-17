import { describe, expect, it } from "vitest";
import {
  applyRoadmapGuardrails,
  createFallbackResearchSummary,
  createFallbackRoadmap,
  parseJsonFromText,
} from "@/lib/ai/roadmap";
import { analyzeConstraints } from "@/lib/constraints";
import type { Goal, RoadmapOutput, UserProfile } from "@/lib/types";

describe("AI utilities", () => {
  it("extracts JSON from fenced model text", () => {
    const parsed = parseJsonFromText('```json\n{"ok":true}\n```');
    expect(parsed).toEqual({ ok: true });
  });

  it("creates deterministic roadmap output when Gemini is unavailable", () => {
    const profile: UserProfile = {
      id: "profile",
      userId: "user",
      age: 23,
      monthlyIncome: 125000,
      fixedExpenses: 45000,
      currentSavings: 1000000,
      familyResponsibilities: "Family",
      dailyAvailableMinutes: 150,
      energyLevel: "Medium",
      blockers: "Phone",
      intensity: "balanced",
      currency: "INR",
      timezone: "Asia/Kolkata",
      onboarded: true,
    };
    const goals: Goal[] = [
      {
        id: "career",
        userId: "user",
        title: "DSA growth",
        domain: "career",
        description: "",
        deadline: "2027-01-31",
        targetAmount: 0,
        weeklyHours: 7,
        priority: 1,
        status: "active",
        why: "",
        progress: 0,
        progressNote: "",
        lastCheckInAt: null,
      },
    ];

    const roadmap = createFallbackRoadmap(profile, goals, analyzeConstraints(profile, goals));
    expect(roadmap.dailyNonNegotiables.length).toBeGreaterThan(0);
    expect(roadmap.yearRoadmap.join(" ")).toContain("routine");
  });

  it("creates a non-crashing research fallback for quota errors", () => {
    const summary = createFallbackResearchSummary(
      "Find practical DSA and LLD preparation steps.",
      undefined,
      new Error("429 You exceeded your current quota"),
    );

    expect(summary).toContain("quota");
    expect(summary).toContain("Question: Find practical DSA");
    expect(summary).toContain("retry research later");
  });

  it("caps generated daily work and inserts a capacity reset", () => {
    const profile: UserProfile = {
      id: "profile",
      userId: "user",
      age: 26,
      monthlyIncome: 90000,
      fixedExpenses: 50000,
      currentSavings: 100000,
      familyResponsibilities: "Family support",
      dailyAvailableMinutes: 120,
      energyLevel: "Medium",
      blockers: "Long workdays",
      intensity: "balanced",
      currency: "INR",
      timezone: "Asia/Kolkata",
      onboarded: true,
    };
    const goals: Goal[] = [
      {
        id: "career",
        userId: "user",
        title: "Career switch",
        domain: "career",
        description: "",
        deadline: "2027-07-01",
        targetAmount: 0,
        weeklyHours: 14,
        priority: 1,
        status: "active",
        why: "",
        progress: 0,
        progressNote: "",
        lastCheckInAt: null,
      },
      {
        id: "fitness",
        userId: "user",
        title: "Fitness routine",
        domain: "health",
        description: "",
        deadline: "2027-07-01",
        targetAmount: 0,
        weeklyHours: 7,
        priority: 2,
        status: "active",
        why: "",
        progress: 0,
        progressNote: "",
        lastCheckInAt: null,
      },
    ];
    const report = analyzeConstraints(
      profile,
      goals,
      new Date("2026-07-17T00:00:00+05:30"),
    );
    const generated: RoadmapOutput = {
      vision2Year: "A stable plan",
      yearRoadmap: ["Build steadily"],
      quarterlyMilestones: [],
      monthlyTargets: [],
      weeklyPlan: [{ week: "Week 1", focus: "Do everything", actions: ["Push"] }],
      dailyNonNegotiables: [
        { title: "Career", domain: "career", minutes: 60, goalTitle: "Career switch" },
        { title: "Fitness", domain: "health", minutes: 60, goalTitle: "Fitness routine" },
        { title: "More", domain: "discipline", minutes: 60 },
      ],
      conflicts: [],
      recoveryPlan: ["Restart small"],
    };

    const guarded = applyRoadmapGuardrails(generated, report);
    const totalMinutes = guarded.dailyNonNegotiables.reduce(
      (total, task) => total + task.minutes,
      0,
    );

    expect(report.feasibility).toBe("conflicting");
    expect(totalMinutes).toBeLessThanOrEqual(Math.floor(report.safeDailyMinutes));
    expect(guarded.weeklyPlan[0].week).toBe("Capacity reset");
    expect(guarded.conflicts).toEqual(expect.arrayContaining(report.conflicts));
  });
});
