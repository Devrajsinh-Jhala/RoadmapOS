import { GoogleGenAI } from "@google/genai";
import { analyzeConstraints } from "@/lib/constraints";
import { roadmapOutputSchema } from "@/lib/schemas";
import type {
  ConstraintReport,
  Goal,
  GoalDomain,
  ResearchCitation,
  ResearchRun,
  RoadmapOutput,
  UserProfile,
  WeeklyReview,
} from "@/lib/types";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const DEFAULT_RESEARCH_MODEL =
  process.env.GEMINI_RESEARCH_MODEL ?? "gemini-3.5-flash";

function getAiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

function topGoals(goals: Goal[]) {
  return [...goals].sort((a, b) => a.priority - b.priority).slice(0, 5);
}

function actionForDomain(domain: GoalDomain, title: string) {
  switch (domain) {
    case "career":
      return `Ship 45 minutes of focused career practice for ${title}`;
    case "skills":
      return `Study one lesson and write notes for ${title}`;
    case "health":
      return `Complete the planned workout or recovery walk for ${title}`;
    case "wealth":
      return `Log spending and protect today's savings proof for ${title}`;
    case "side-income":
      return `Make one build, pitch, or validation attempt for ${title}`;
    case "relationships":
      return `Take one deliberate family or relationship action for ${title}`;
    case "discipline":
      return `Keep the non-negotiable discipline boundary for ${title}`;
    case "spirituality":
      return `Complete the quiet practice block for ${title}`;
    case "lifestyle":
      return `Check if ${title} still fits the money sequence`;
  }
}

function monthLabel(offset: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function quarterTargetDate(offset: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);
  return date.toISOString().slice(0, 10);
}

export function createFallbackRoadmap(
  profile: UserProfile,
  goals: Goal[],
  report: ConstraintReport = analyzeConstraints(profile, goals),
  research: ResearchRun[] = [],
): RoadmapOutput {
  const prioritized = topGoals(goals);
  const dailyNonNegotiables = prioritized.slice(0, 5).map((goal) => ({
    title: actionForDomain(goal.domain, goal.title),
    domain: goal.domain,
    minutes: Math.max(15, Math.min(60, Math.round((goal.weeklyHours * 60) / 7) || 20)),
    goalTitle: goal.title,
  }));

  if (!dailyNonNegotiables.some((task) => task.domain === "discipline")) {
    dailyNonNegotiables.push({
      title: "Phone out of bed and one honest reflection line",
      domain: "discipline",
      minutes: 10,
      goalTitle: "Daily discipline",
    });
  }

  const researchNotes = research
    .filter((run) => run.appliedAt)
    .map((run) => `Applied research: ${run.summary.slice(0, 140)}`);

  return {
    vision2Year:
      report.feasibility === "conflicting"
        ? "A calmer, sequenced life plan where money and time stop fighting each other."
        : "A focused two-year climb across career, savings, health, and discipline without burning out.",
    yearRoadmap: [
      "Stabilize routine, savings baseline, and weekly review rhythm.",
      "Push the highest-priority career or income goal before lifestyle upgrades.",
      "Convert health and discipline into daily proof instead of motivation.",
      ...researchNotes.slice(0, 2),
    ],
    quarterlyMilestones: [0, 3, 6, 9].map((offset, index) => {
      const goal = prioritized[index % Math.max(1, prioritized.length)];
      return {
        quarter: `Q${index + 1}`,
        title: goal
          ? `${goal.title}: hit the next measurable gate`
          : "Lock the core routine and money baseline",
        targetDate: quarterTargetDate(offset + 3),
        goalTitle: goal?.title,
      };
    }),
    monthlyTargets: [0, 1, 2].map((offset) => ({
      month: monthLabel(offset),
      target:
        report.monthlySurplus > 0
          ? `Protect ${Math.round(Math.min(report.monthlySurplus, report.totalRequiredMonthly)).toLocaleString("en-IN")} INR toward priority goals`
          : "Reduce expenses before adding paid commitments",
      metric: `${Math.round(report.moneyUtilization * 100)}% money load, ${Math.round(report.timeUtilization * 100)}% time load`,
    })),
    weeklyPlan: [
      {
        week: "Week 1",
        focus: "Make the plan executable",
        actions: dailyNonNegotiables.slice(0, 4).map((task) => task.title),
      },
      {
        week: "Week 2",
        focus: "Remove the biggest conflict",
        actions:
          report.conflicts.length > 0
            ? report.conflicts.slice(0, 3)
            : ["Raise intensity only if sleep and work stay stable."],
      },
    ],
    dailyNonNegotiables,
    conflicts: report.conflicts,
    recoveryPlan: [
      "Do not restart the whole plan. Recover the next visible action.",
      "Move missed work into one 45-minute catch-up block, then return to the normal rhythm.",
      "If two weeks slip, reduce the lowest-priority goal before touching the core goal.",
    ],
  };
}

export function parseJsonFromText(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const source = fenced ?? text;
  const firstBrace = source.indexOf("{");
  const lastBrace = source.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    return null;
  }

  try {
    return JSON.parse(source.slice(firstBrace, lastBrace + 1)) as unknown;
  } catch {
    return null;
  }
}

export async function generateRoadmap(
  profile: UserProfile,
  goals: Goal[],
  research: ResearchRun[] = [],
) {
  const report = analyzeConstraints(profile, goals);
  const fallback = createFallbackRoadmap(profile, goals, report, research);
  const client = getAiClient();

  if (!client) {
    return {
      roadmap: fallback,
      report,
      provider: "fallback",
      model: "deterministic",
    };
  }

  const prompt = [
    "Create a practical RoadmapOS plan for an Indian tech professional.",
    "Return only JSON matching this shape: vision2Year, yearRoadmap[], quarterlyMilestones[{quarter,title,targetDate,goalTitle}], monthlyTargets[{month,target,metric}], weeklyPlan[{week,focus,actions[]}], dailyNonNegotiables[{title,domain,minutes,goalTitle}], conflicts[], recoveryPlan[].",
    "Tone: direct, human, non-shaming, constraint-aware.",
    JSON.stringify({ profile, goals, constraintReport: report, appliedResearch: research }),
  ].join("\n\n");

  try {
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });
    const parsed = parseJsonFromText(response.text ?? "");
    const validated = roadmapOutputSchema.safeParse(parsed);

    if (!validated.success) {
      return {
        roadmap: fallback,
        report,
        provider: "fallback",
        model: "deterministic",
      };
    }

    return {
      roadmap: validated.data,
      report,
      provider: "gemini",
      model: DEFAULT_MODEL,
    };
  } catch {
    return {
      roadmap: fallback,
      report,
      provider: "fallback",
      model: "deterministic",
    };
  }
}

export async function generateWeeklyRecovery(
  profile: UserProfile,
  goals: Goal[],
  review: Omit<WeeklyReview, "id" | "userId" | "createdAt">,
) {
  const report = analyzeConstraints(profile, goals);
  const base = [
    "Keep the next week smaller than your ego wants.",
    review.disciplineScore <= 5
      ? "Rebuild discipline with one daily proof before adding intensity."
      : "Keep discipline stable and add one focused catch-up block.",
    report.feasibility === "conflicting"
      ? "Cut or delay one lower-priority commitment for seven days."
      : "Protect the top two goals and let the rest stay maintenance-only.",
  ];

  const client = getAiClient();
  if (!client) {
    return base;
  }

  try {
    const response = await client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Write 3 short, non-shaming recovery actions for next week. Context: ${JSON.stringify({ profile, goals, review, report })}`,
    });
    return (response.text ?? "")
      .split("\n")
      .map((line) => line.replace(/^[-*\d. ]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
  } catch {
    return base;
  }
}

function collectCitations(value: unknown, citations = new Map<string, ResearchCitation>()) {
  if (!value || typeof value !== "object") {
    return citations;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectCitations(item, citations);
    }
    return citations;
  }

  const record = value as Record<string, unknown>;
  const rawUrl = record.url ?? record.uri;
  if (typeof rawUrl === "string" && /^https?:\/\//.test(rawUrl)) {
    const title =
      typeof record.title === "string"
        ? record.title
        : typeof record.name === "string"
          ? record.name
          : rawUrl;
    citations.set(rawUrl, { title, url: rawUrl });
  }

  for (const item of Object.values(record)) {
    collectCitations(item, citations);
  }

  return citations;
}

export async function runGroundedResearch(
  profile: UserProfile,
  goals: Goal[],
  query: string,
  goalId?: string,
) {
  const client = getAiClient();
  const goal = goals.find((item) => item.id === goalId);

  if (!client) {
    return {
      summary:
        "Demo research summary: add GEMINI_API_KEY to receive live Google-grounded sources. For now, treat this as a saved planning note and apply it only if it clarifies the goal sequence.",
      grounded: false,
      citations: [],
      raw: {},
    };
  }

  const input = [
    "Research for RoadmapOS. Give a concise, source-backed answer for an Indian tech professional.",
    `User context: ${JSON.stringify({ profile, goals })}`,
    goal ? `Goal to improve: ${JSON.stringify(goal)}` : "No single goal selected.",
    `Question: ${query}`,
  ].join("\n\n");

  const interaction = await client.interactions.create({
    model: DEFAULT_RESEARCH_MODEL,
    input,
    tools: [{ type: "google_search" }],
  });
  const raw = JSON.parse(JSON.stringify(interaction)) as Record<string, unknown>;
  const citations = [...collectCitations(raw).values()].slice(0, 8);

  return {
    summary: interaction.output_text ?? "Grounded research completed, but no text was returned.",
    grounded: citations.length > 0,
    citations,
    raw,
  };
}
