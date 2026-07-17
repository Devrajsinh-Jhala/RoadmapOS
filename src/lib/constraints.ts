import type {
  ConstraintIssue,
  ConstraintReport,
  Feasibility,
  Goal,
  GoalAssessment,
  UserProfile,
} from "@/lib/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const INTENSITY_POLICY = {
  chill: { moneyShare: 0.65, timeShare: 0.65, emergencyMonths: 9 },
  balanced: { moneyShare: 0.75, timeShare: 0.75, emergencyMonths: 6 },
  aggressive: { moneyShare: 0.9, timeShare: 0.85, emergencyMonths: 3 },
} as const;

function monthsUntil(deadline: string, now = new Date()) {
  const target = new Date(`${deadline}T00:00:00+05:30`);
  const rawDays = Math.ceil((target.getTime() - now.getTime()) / MS_PER_DAY);
  return {
    expired: rawDays < 0,
    days: rawDays,
    months: Math.max(1, Math.ceil(Math.max(1, rawDays) / 30)),
  };
}

function rankFeasibility(
  moneyUtilization: number,
  timeUtilization: number,
  hasCriticalIssue = false,
  hasWarning = false,
): Feasibility {
  if (hasCriticalIssue || moneyUtilization > 1 || timeUtilization > 1) {
    return "conflicting";
  }

  if (hasWarning || moneyUtilization > 0.85 || timeUtilization > 0.9) {
    return "risky";
  }

  if (moneyUtilization > 0.6 || timeUtilization > 0.7) {
    return "stretched";
  }

  return "realistic";
}

function utilization(used: number, capacity: number) {
  if (used <= 0) {
    return 0;
  }

  if (capacity <= 0) {
    return 2;
  }

  return used / capacity;
}

function addMonthsIso(now: Date, months: number) {
  const date = new Date(now);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function formatMinutes(value: number) {
  return `${Math.round(value)} min/day`;
}

export function analyzeConstraints(
  profile: UserProfile,
  goals: Goal[],
  now = new Date(),
): ConstraintReport {
  const activeGoals = goals
    .filter((goal) => goal.status === "active")
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );
  const policy = INTENSITY_POLICY[profile.intensity];
  const monthlySurplus = profile.monthlyIncome - profile.fixedExpenses;
  const safeMonthlyCapacity = Math.max(0, monthlySurplus) * policy.moneyShare;
  const monthlyBuffer = Math.max(0, monthlySurplus - safeMonthlyCapacity);
  const responsibilityFloor = profile.familyResponsibilities.trim() ? 6 : 0;
  const emergencyMonths = Math.max(policy.emergencyMonths, responsibilityFloor);
  const emergencyFundTarget = profile.fixedExpenses * emergencyMonths;
  const protectedSavings = Math.min(profile.currentSavings, emergencyFundTarget);
  const allocatableSavings = Math.max(0, profile.currentSavings - protectedSavings);
  const safeDailyMinutes = profile.dailyAvailableMinutes * policy.timeShare;
  let unallocatedSavings = allocatableSavings;

  const assessments: GoalAssessment[] = activeGoals.map((goal, index) => {
    const deadline = monthsUntil(goal.deadline, now);
    const savingsAllocated =
      goal.domain === "wealth"
        ? Math.min(unallocatedSavings, Math.max(0, goal.targetAmount))
        : 0;
    unallocatedSavings -= savingsAllocated;
    const amountRemaining = Math.max(0, goal.targetAmount - savingsAllocated);
    const requiredMonthly = amountRemaining / deadline.months;
    const moneyUtilization = utilization(requiredMonthly, safeMonthlyCapacity);
    const timeUtilization = utilization(
      (goal.weeklyHours * 60) / 7,
      safeDailyMinutes,
    );
    const notes: string[] = [];
    let recommendedAction = "Proceed at the planned pace.";
    let suggestedDeadline: string | undefined;

    if (deadline.expired) {
      notes.push("The deadline has passed. Set a new date before relying on this plan.");
      recommendedAction = "Extend the deadline before generating the next roadmap.";
    }

    if (requiredMonthly > safeMonthlyCapacity && requiredMonthly > 0) {
      notes.push("This goal alone needs more than your safe monthly planning capacity.");
      recommendedAction = "Reduce the amount, add income, or extend the deadline.";
      if (safeMonthlyCapacity > 0) {
        suggestedDeadline = addMonthsIso(
          now,
          Math.ceil(amountRemaining / safeMonthlyCapacity),
        );
      }
    }

    if (timeUtilization > 1) {
      notes.push("This goal alone needs more than your safe daily planning time.");
      recommendedAction = "Reduce weekly hours or move another goal to maintenance.";
    }

    if (deadline.days <= 60 && (amountRemaining > 0 || goal.weeklyHours > 0)) {
      notes.push("The deadline is close, so one missed week can materially change the plan.");
      if (recommendedAction === "Proceed at the planned pace.") {
        recommendedAction = "Protect this goal weekly until the deadline passes.";
      }
    }

    if (goal.domain === "lifestyle" && goal.targetAmount > safeMonthlyCapacity * 2) {
      notes.push("Treat this purchase as a reward after higher-priority money goals.");
      recommendedAction = "Sequence this after the core wealth goal or fund it separately.";
    }

    return {
      goalId: goal.id,
      title: goal.title,
      sequenceRank: index + 1,
      monthsRemaining: deadline.months,
      amountRemaining,
      savingsAllocated,
      requiredMonthly,
      requiredWeeklyHours: goal.weeklyHours,
      moneyUtilization,
      timeUtilization,
      feasibility: rankFeasibility(
        moneyUtilization,
        timeUtilization,
        deadline.expired,
        notes.length > 0,
      ),
      recommendedAction,
      suggestedDeadline,
      notes,
    };
  });

  const totalRequiredMonthly = assessments.reduce(
    (total, goal) => total + goal.requiredMonthly,
    0,
  );
  const committedDailyMinutes =
    activeGoals.reduce((total, goal) => total + goal.weeklyHours * 60, 0) / 7;
  const moneyUtilization = utilization(totalRequiredMonthly, safeMonthlyCapacity);
  const timeUtilization = utilization(committedDailyMinutes, safeDailyMinutes);
  const remainingMonthlyCapacity = Math.max(
    0,
    safeMonthlyCapacity - totalRequiredMonthly,
  );
  const remainingDailyMinutes = Math.max(0, safeDailyMinutes - committedDailyMinutes);

  const issues: ConstraintIssue[] = [];
  const recommendations: string[] = [];

  if (profile.monthlyIncome - profile.fixedExpenses <= 0) {
    issues.push({
      id: "no-monthly-surplus",
      severity: "critical",
      title: "No monthly surplus",
      detail: "Fixed expenses are equal to or higher than income.",
      remedy: "Create a survival budget before committing money to new goals.",
      goalIds: activeGoals.filter((goal) => goal.targetAmount > 0).map((goal) => goal.id),
    });
  }

  if (moneyUtilization > 1) {
    issues.push({
      id: "money-overload",
      severity: "critical",
      title: "Money plan is over capacity",
      detail: `Goals need ${Math.round(totalRequiredMonthly).toLocaleString("en-IN")} INR/month, above the safe limit of ${Math.round(safeMonthlyCapacity).toLocaleString("en-IN")} INR/month.`,
      remedy: "Delay the lowest-priority purchase, reduce its amount, or extend a deadline.",
      goalIds: assessments
        .filter((assessment) => assessment.requiredMonthly > 0)
        .map((assessment) => assessment.goalId),
    });
  } else if (moneyUtilization > 0.85) {
    issues.push({
      id: "money-buffer-tight",
      severity: "warning",
      title: "Money buffer is thin",
      detail: "Paid goals use more than 85% of your safe monthly planning capacity.",
      remedy: "Keep one lower-priority purchase flexible until the next weekly review.",
      goalIds: assessments
        .filter((assessment) => assessment.requiredMonthly > 0)
        .map((assessment) => assessment.goalId),
    });
  }

  if (timeUtilization > 1) {
    issues.push({
      id: "time-overload",
      severity: "critical",
      title: "Weekly plan is over capacity",
      detail: `Goals need ${formatMinutes(committedDailyMinutes)}, above the safe limit of ${formatMinutes(safeDailyMinutes)}.`,
      remedy: "Move the lowest-priority goal to maintenance or reduce its weekly hours.",
      goalIds: activeGoals.filter((goal) => goal.weeklyHours > 0).map((goal) => goal.id),
    });
  } else if (timeUtilization > 0.75) {
    issues.push({
      id: "time-buffer-tight",
      severity: "warning",
      title: "Recovery time is thin",
      detail: "Goals use more than 75% of your safe daily planning time.",
      remedy: "Protect sleep and keep one goal in maintenance during heavy weeks.",
      goalIds: activeGoals.filter((goal) => goal.weeklyHours > 0).map((goal) => goal.id),
    });
  }

  for (const assessment of assessments) {
    if (assessment.notes.some((note) => note.includes("deadline has passed"))) {
      issues.push({
        id: `expired-${assessment.goalId}`,
        severity: "critical",
        title: "Goal deadline has passed",
        detail: `${assessment.title} has an expired deadline.`,
        remedy: "Choose a new realistic deadline before regenerating the roadmap.",
        goalIds: [assessment.goalId],
      });
    }
  }

  const coreGoals = activeGoals.filter((goal) => goal.priority === 1);
  if (coreGoals.length > 2) {
    issues.push({
      id: "too-many-core-goals",
      severity: "warning",
      title: "Too many core priorities",
      detail: `${coreGoals.length} goals are marked priority 1, so the plan cannot make a clear trade-off.`,
      remedy: "Keep at most two priority 1 goals and move the rest to priority 2 or 3.",
      goalIds: coreGoals.map((goal) => goal.id),
    });
  }

  const houseGoal = activeGoals.find(
    (goal) =>
      goal.domain === "wealth" &&
      /house|home|flat|property/i.test(`${goal.title} ${goal.description}`),
  );
  const lifestyleGoals = activeGoals.filter(
    (goal) => goal.domain === "lifestyle" && goal.targetAmount,
  );
  if (houseGoal && lifestyleGoals.length > 0 && safeMonthlyCapacity > 0) {
    for (const lifestyleGoal of lifestyleGoals) {
      const delay = Math.ceil(lifestyleGoal.targetAmount / safeMonthlyCapacity);
      const lifestyleAssessment = assessments.find(
        (assessment) => assessment.goalId === lifestyleGoal.id,
      );
      if (
        lifestyleAssessment &&
        lifestyleAssessment.feasibility !== "conflicting"
      ) {
        lifestyleAssessment.feasibility = "risky";
        lifestyleAssessment.recommendedAction = `Sequence this after the next ${houseGoal.title} milestone.`;
        lifestyleAssessment.notes.push(
          `This purchase changes the timing of ${houseGoal.title}.`,
        );
      }
      issues.push({
        id: `sequence-${lifestyleGoal.id}-${houseGoal.id}`,
        severity: "warning",
        title: "Purchase changes the sequence",
        detail: `${lifestyleGoal.title} can delay ${houseGoal.title} by about ${delay} month${delay === 1 ? "" : "s"}.`,
        remedy: `Fund ${lifestyleGoal.title} separately or move it after the next ${houseGoal.title} milestone.`,
        goalIds: [lifestyleGoal.id, houseGoal.id],
      });
    }
  }

  const criticalCount = issues.filter((issue) => issue.severity === "critical").length;
  const warningCount = issues.length - criticalCount;
  const readinessScore =
    activeGoals.length === 0
      ? 0
      : Math.max(0, Math.min(100, 100 - criticalCount * 24 - warningCount * 8));
  const conflicts = issues.map((issue) => issue.detail);
  const nextActions = [...new Set(issues.map((issue) => issue.remedy))].slice(0, 3);

  if (nextActions.length === 0) {
    nextActions.push(
      activeGoals.length > 0
        ? "Generate the roadmap, then protect the top two goals in your weekly calendar."
        : "Add two to four goals so RoadmapOS can test the plan.",
    );
  }

  recommendations.push(...nextActions);

  if (profile.currentSavings < emergencyFundTarget) {
    recommendations.push(
      `Build the protected emergency reserve toward ${Math.round(emergencyFundTarget).toLocaleString("en-IN")} INR before using savings for rewards.`,
    );
  }

  const feasibility = rankFeasibility(
    moneyUtilization,
    timeUtilization,
    criticalCount > 0,
    warningCount > 0,
  );

  return {
    feasibility,
    monthlyIncome: profile.monthlyIncome,
    fixedExpenses: profile.fixedExpenses,
    monthlySurplus,
    safeMonthlyCapacity,
    remainingMonthlyCapacity,
    monthlyBuffer,
    currentSavings: profile.currentSavings,
    emergencyFundTarget,
    protectedSavings,
    allocatableSavings,
    totalRequiredMonthly,
    moneyUtilization,
    dailyAvailableMinutes: profile.dailyAvailableMinutes,
    safeDailyMinutes,
    remainingDailyMinutes,
    committedDailyMinutes,
    timeUtilization,
    readinessScore,
    primaryWarning:
      issues[0]?.detail ??
      (activeGoals.length > 0
        ? "Your goals fit the protected money and time limits in this plan."
        : "Add two to four goals to test whether your plan is realistic."),
    issues,
    conflicts,
    recommendations,
    nextActions,
    goalAssessments: assessments,
  };
}
