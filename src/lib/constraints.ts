import type {
  ConstraintReport,
  Feasibility,
  Goal,
  GoalAssessment,
  UserProfile,
} from "@/lib/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function monthsUntil(deadline: string, now = new Date()) {
  const target = new Date(`${deadline}T00:00:00+05:30`);
  const days = Math.max(1, Math.ceil((target.getTime() - now.getTime()) / MS_PER_DAY));
  return Math.max(1, Math.ceil(days / 30));
}

function rankFeasibility(
  moneyUtilization: number,
  timeUtilization: number,
  conflicts: string[],
): Feasibility {
  if (conflicts.length > 0 || moneyUtilization > 1 || timeUtilization > 1) {
    return "conflicting";
  }

  if (moneyUtilization > 0.85 || timeUtilization > 0.9) {
    return "risky";
  }

  if (moneyUtilization > 0.6 || timeUtilization > 0.7) {
    return "stretched";
  }

  return "realistic";
}

function amountStillNeeded(goal: Goal, profile: UserProfile) {
  if (goal.targetAmount <= 0) {
    return 0;
  }

  if (goal.domain === "wealth") {
    return Math.max(0, goal.targetAmount - profile.currentSavings);
  }

  return goal.targetAmount;
}

export function analyzeConstraints(
  profile: UserProfile,
  goals: Goal[],
  now = new Date(),
): ConstraintReport {
  const monthlySurplus = profile.monthlyIncome - profile.fixedExpenses;
  const assessments: GoalAssessment[] = goals.map((goal) => {
    const requiredMonthly = amountStillNeeded(goal, profile) / monthsUntil(goal.deadline, now);
    const notes: string[] = [];

    if (requiredMonthly > monthlySurplus && requiredMonthly > 0) {
      notes.push("This goal alone needs more monthly cash than your current surplus.");
    }

    if (goal.weeklyHours * 60 > profile.dailyAvailableMinutes * 7) {
      notes.push("The weekly time requirement is higher than your declared free time.");
    }

    if (goal.domain === "lifestyle" && goal.targetAmount > monthlySurplus * 2) {
      notes.push("This purchase should be sequenced after core wealth goals.");
    }

    return {
      goalId: goal.id,
      title: goal.title,
      requiredMonthly,
      requiredWeeklyHours: goal.weeklyHours,
      feasibility: rankFeasibility(
        monthlySurplus > 0 ? requiredMonthly / monthlySurplus : 2,
        profile.dailyAvailableMinutes > 0
          ? (goal.weeklyHours * 60) / (profile.dailyAvailableMinutes * 7)
          : 2,
        notes.filter((note) => note.includes("higher") || note.includes("more monthly")),
      ),
      notes,
    };
  });

  const totalRequiredMonthly = assessments.reduce(
    (total, goal) => total + goal.requiredMonthly,
    0,
  );
  const committedDailyMinutes =
    goals.reduce((total, goal) => total + goal.weeklyHours * 60, 0) / 7;
  const moneyUtilization =
    monthlySurplus > 0 ? totalRequiredMonthly / monthlySurplus : Number.POSITIVE_INFINITY;
  const timeUtilization =
    profile.dailyAvailableMinutes > 0
      ? committedDailyMinutes / profile.dailyAvailableMinutes
      : Number.POSITIVE_INFINITY;

  const conflicts: string[] = [];
  const recommendations: string[] = [];

  if (monthlySurplus <= 0) {
    conflicts.push("Fixed expenses are equal to or higher than income.");
    recommendations.push("Create a survival budget before adding new paid goals.");
  }

  if (moneyUtilization > 1) {
    conflicts.push("The goals require more monthly money than your current surplus.");
    recommendations.push("Delay lifestyle purchases or add income before locking the timeline.");
  } else if (moneyUtilization > 0.85) {
    recommendations.push("Keep a buffer month because the money plan is tight.");
  }

  if (timeUtilization > 1) {
    conflicts.push("The weekly commitments need more hours than your declared free time.");
    recommendations.push("Reduce weekly study/training hours or extend a deadline.");
  } else if (timeUtilization > 0.75) {
    recommendations.push("Protect sleep and use a lighter plan during family-heavy weeks.");
  }

  const houseGoal = goals.find(
    (goal) =>
      goal.domain === "wealth" &&
      /house|home|flat|property/i.test(`${goal.title} ${goal.description}`),
  );
  const lifestyleGoals = goals.filter((goal) => goal.domain === "lifestyle" && goal.targetAmount);
  if (houseGoal && lifestyleGoals.length > 0 && monthlySurplus > 0) {
    for (const lifestyleGoal of lifestyleGoals) {
      const delay = Math.ceil(lifestyleGoal.targetAmount / monthlySurplus);
      conflicts.push(
        `${lifestyleGoal.title} can delay ${houseGoal.title} by about ${delay} month${delay === 1 ? "" : "s"}.`,
      );
    }
  }

  return {
    feasibility: rankFeasibility(moneyUtilization, timeUtilization, conflicts),
    monthlyIncome: profile.monthlyIncome,
    fixedExpenses: profile.fixedExpenses,
    monthlySurplus,
    currentSavings: profile.currentSavings,
    totalRequiredMonthly,
    moneyUtilization,
    dailyAvailableMinutes: profile.dailyAvailableMinutes,
    committedDailyMinutes,
    timeUtilization,
    conflicts,
    recommendations,
    goalAssessments: assessments,
  };
}
