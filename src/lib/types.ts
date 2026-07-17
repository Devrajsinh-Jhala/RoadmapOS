export const goalDomains = [
  "career",
  "wealth",
  "health",
  "skills",
  "side-income",
  "relationships",
  "discipline",
  "spirituality",
  "lifestyle",
] as const;

export type GoalDomain = (typeof goalDomains)[number];

export type Intensity = "chill" | "balanced" | "aggressive";

export type Feasibility = "realistic" | "stretched" | "risky" | "conflicting";

export type ConstraintIssue = {
  id: string;
  severity: "warning" | "critical";
  title: string;
  detail: string;
  remedy: string;
  goalIds: string[];
};

export type UserProfile = {
  id: string;
  userId: string;
  age: number;
  monthlyIncome: number;
  fixedExpenses: number;
  currentSavings: number;
  familyResponsibilities: string;
  dailyAvailableMinutes: number;
  energyLevel: string;
  blockers: string;
  intensity: Intensity;
  currency: "INR";
  timezone: "Asia/Kolkata";
  onboarded: boolean;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  domain: GoalDomain;
  description: string;
  deadline: string;
  targetAmount: number;
  weeklyHours: number;
  priority: number;
  status: "active" | "paused" | "done";
  why: string;
  progress: number;
  progressNote: string;
  lastCheckInAt?: string | null;
};

export type GoalAssessment = {
  goalId: string;
  title: string;
  feasibility: Feasibility;
  sequenceRank: number;
  monthsRemaining: number;
  amountRemaining: number;
  savingsAllocated: number;
  requiredMonthly: number;
  requiredWeeklyHours: number;
  moneyUtilization: number;
  timeUtilization: number;
  recommendedAction: string;
  suggestedDeadline?: string;
  notes: string[];
};

export type ConstraintReport = {
  feasibility: Feasibility;
  monthlyIncome: number;
  fixedExpenses: number;
  monthlySurplus: number;
  safeMonthlyCapacity: number;
  remainingMonthlyCapacity: number;
  monthlyBuffer: number;
  currentSavings: number;
  emergencyFundTarget: number;
  protectedSavings: number;
  allocatableSavings: number;
  totalRequiredMonthly: number;
  moneyUtilization: number;
  dailyAvailableMinutes: number;
  safeDailyMinutes: number;
  remainingDailyMinutes: number;
  committedDailyMinutes: number;
  timeUtilization: number;
  readinessScore: number;
  primaryWarning: string;
  issues: ConstraintIssue[];
  conflicts: string[];
  recommendations: string[];
  nextActions: string[];
  goalAssessments: GoalAssessment[];
};

export type RoadmapOutput = {
  vision2Year: string;
  yearRoadmap: string[];
  quarterlyMilestones: Array<{
    quarter: string;
    title: string;
    targetDate: string;
    goalTitle?: string;
  }>;
  monthlyTargets: Array<{
    month: string;
    target: string;
    metric: string;
  }>;
  weeklyPlan: Array<{
    week: string;
    focus: string;
    actions: string[];
  }>;
  dailyNonNegotiables: Array<{
    title: string;
    domain: GoalDomain;
    minutes: number;
    goalTitle?: string;
  }>;
  conflicts: string[];
  recoveryPlan: string[];
};

export type RoadmapVersion = {
  id: string;
  userId: string;
  trigger: string;
  summary: string;
  structured: RoadmapOutput;
  constraintReport: ConstraintReport;
  createdAt: string;
};

export type DailyTask = {
  id: string;
  userId: string;
  roadmapId?: string;
  goalId?: string;
  title: string;
  domain: GoalDomain;
  dueDate: string;
  isNonNegotiable: boolean;
  completedAt?: string | null;
};

export type WeeklyReview = {
  id: string;
  userId: string;
  weekStart: string;
  completed: string;
  slipped: string;
  reasons: string;
  savedAmount: number;
  workoutsDone: number;
  studyHours: number;
  disciplineScore: number;
  energyNextWeek: string;
  aiRecovery: string[];
  createdAt: string;
};

export type ResearchCitation = {
  title: string;
  url: string;
};

export type ResearchRun = {
  id: string;
  userId: string;
  goalId?: string;
  query: string;
  summary: string;
  grounded: boolean;
  citations: ResearchCitation[];
  appliedAt?: string | null;
  createdAt: string;
};

export type AppSnapshot = {
  profile: UserProfile | null;
  goals: Goal[];
  latestRoadmap: RoadmapVersion | null;
  todayTasks: DailyTask[];
  weeklyReviews: WeeklyReview[];
  researchRuns: ResearchRun[];
  constraints: ConstraintReport | null;
};
