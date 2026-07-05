import { describe, expect, it } from "vitest";
import { createFallbackRoadmap, parseJsonFromText } from "@/lib/ai/roadmap";
import { analyzeConstraints } from "@/lib/constraints";
import type { Goal, UserProfile } from "@/lib/types";

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
      },
    ];

    const roadmap = createFallbackRoadmap(profile, goals, analyzeConstraints(profile, goals));
    expect(roadmap.dailyNonNegotiables.length).toBeGreaterThan(0);
    expect(roadmap.yearRoadmap.join(" ")).toContain("routine");
  });
});
