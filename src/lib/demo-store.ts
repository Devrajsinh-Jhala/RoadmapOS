import { nanoid } from "nanoid";
import { createFallbackRoadmap } from "@/lib/ai/roadmap";
import { analyzeConstraints } from "@/lib/constraints";
import { DEMO_USER_ID } from "@/lib/current-user";
import { todayIso, weekStartIso } from "@/lib/format";
import type {
  AppSnapshot,
  DailyTask,
  Goal,
  ResearchRun,
  RoadmapVersion,
  UserProfile,
  WeeklyReview,
} from "@/lib/types";

type DemoState = {
  profile: UserProfile;
  goals: Goal[];
  roadmaps: RoadmapVersion[];
  tasks: DailyTask[];
  weeklyReviews: WeeklyReview[];
  researchRuns: ResearchRun[];
};

function createInitialState(): DemoState {
  const profile: UserProfile = {
    id: "demo-profile",
    userId: DEMO_USER_ID,
    age: 23,
    monthlyIncome: 125000,
    fixedExpenses: 45000,
    currentSavings: 1000000,
    familyResponsibilities: "Support family planning and avoid reckless purchases.",
    dailyAvailableMinutes: 150,
    energyLevel: "Balanced but inconsistent after work",
    blockers: "Phone in bed, comparison pressure, and scattered priorities.",
    intensity: "balanced",
    currency: "INR",
    timezone: "Asia/Kolkata",
    onboarded: true,
  };

  const goals: Goal[] = [
    {
      id: "goal-house",
      userId: DEMO_USER_ID,
      title: "House down payment",
      domain: "wealth",
      description: "Build a property corpus without killing career growth.",
      deadline: "2028-07-01",
      targetAmount: 2500000,
      weeklyHours: 1,
      priority: 1,
      status: "active",
      why: "Family security and long-term stability.",
    },
    {
      id: "goal-career",
      userId: DEMO_USER_ID,
      title: "DSA and LLD growth",
      domain: "career",
      description: "Switch-ready interview prep with consistent practice.",
      deadline: "2027-01-31",
      targetAmount: 0,
      weeklyHours: 7,
      priority: 1,
      status: "active",
      why: "Better role, confidence, and income options.",
    },
    {
      id: "goal-ai",
      userId: DEMO_USER_ID,
      title: "AI learning stack",
      domain: "skills",
      description: "Learn applied AI enough to build useful products.",
      deadline: "2026-12-31",
      targetAmount: 15000,
      weeklyHours: 5,
      priority: 2,
      status: "active",
      why: "Turn technical curiosity into leverage.",
    },
    {
      id: "goal-gym",
      userId: DEMO_USER_ID,
      title: "Build physique",
      domain: "health",
      description: "Strength training and food discipline.",
      deadline: "2027-03-31",
      targetAmount: 0,
      weeklyHours: 5,
      priority: 2,
      status: "active",
      why: "Energy, confidence, and self-respect.",
    },
    {
      id: "goal-watch",
      userId: DEMO_USER_ID,
      title: "Apple Watch",
      domain: "lifestyle",
      description: "Buy only if it does not break the house sequence.",
      deadline: "2026-09-30",
      targetAmount: 45000,
      weeklyHours: 0,
      priority: 5,
      status: "active",
      why: "Fitness reward, not a priority goal.",
    },
  ];

  const report = analyzeConstraints(profile, goals);
  const structured = createFallbackRoadmap(profile, goals, report);
  const roadmap: RoadmapVersion = {
    id: "demo-roadmap",
    userId: DEMO_USER_ID,
    trigger: "demo-seed",
    summary: "Balanced plan: career growth and house corpus stay ahead of lifestyle rewards.",
    structured,
    constraintReport: report,
    createdAt: new Date().toISOString(),
  };

  return {
    profile,
    goals,
    roadmaps: [roadmap],
    tasks: structured.dailyNonNegotiables.map((task) => ({
      id: nanoid(),
      userId: DEMO_USER_ID,
      roadmapId: roadmap.id,
      goalId: goals.find((goal) => goal.title === task.goalTitle)?.id,
      title: task.title,
      domain: task.domain,
      dueDate: todayIso(),
      isNonNegotiable: true,
      completedAt: null,
    })),
    weeklyReviews: [
      {
        id: "demo-review",
        userId: DEMO_USER_ID,
        weekStart: weekStartIso(),
        completed: "Kept workouts and one DSA block alive.",
        slipped: "Phone boundary and AI notes slipped twice.",
        reasons: "Late-night scrolling after work.",
        savedAmount: 42000,
        workoutsDone: 4,
        studyHours: 6,
        disciplineScore: 6,
        energyNextWeek: "Medium",
        aiRecovery: [
          "Keep DSA before entertainment.",
          "Move AI learning to weekend mornings.",
          "Use one catch-up block, not a full restart.",
        ],
        createdAt: new Date().toISOString(),
      },
    ],
    researchRuns: [],
  };
}

const globalStore = globalThis as typeof globalThis & {
  __roadmapOsDemo?: DemoState;
};

export function getDemoState() {
  globalStore.__roadmapOsDemo ??= createInitialState();
  return globalStore.__roadmapOsDemo;
}

export function getDemoSnapshot(): AppSnapshot {
  const state = getDemoState();
  const latestRoadmap = state.roadmaps[0] ?? null;
  return {
    profile: state.profile,
    goals: state.goals,
    latestRoadmap,
    todayTasks: state.tasks.filter((task) => task.dueDate === todayIso()),
    weeklyReviews: state.weeklyReviews,
    researchRuns: state.researchRuns,
    constraints: state.profile ? analyzeConstraints(state.profile, state.goals) : null,
  };
}
