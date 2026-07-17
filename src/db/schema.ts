import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type {
  ConstraintReport,
  ResearchCitation,
  RoadmapOutput,
} from "@/lib/types";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const profiles = pgTable("profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  age: integer("age").notNull(),
  monthlyIncome: numeric("monthly_income", { precision: 12, scale: 2 }).notNull(),
  fixedExpenses: numeric("fixed_expenses", { precision: 12, scale: 2 }).notNull(),
  currentSavings: numeric("current_savings", { precision: 12, scale: 2 }).notNull(),
  familyResponsibilities: text("family_responsibilities").notNull().default(""),
  dailyAvailableMinutes: integer("daily_available_minutes").notNull(),
  energyLevel: text("energy_level").notNull(),
  blockers: text("blockers").notNull().default(""),
  intensity: text("intensity").notNull().default("balanced"),
  currency: text("currency").notNull().default("INR"),
  timezone: text("timezone").notNull().default("Asia/Kolkata"),
  onboarded: boolean("onboarded").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const goals = pgTable("goal", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  domain: text("domain").notNull(),
  description: text("description").notNull().default(""),
  deadline: date("deadline", { mode: "string" }).notNull(),
  targetAmount: numeric("target_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  weeklyHours: numeric("weekly_hours", { precision: 5, scale: 2 }).notNull().default("0"),
  priority: integer("priority").notNull().default(3),
  status: text("status").notNull().default("active"),
  why: text("why").notNull().default(""),
  progress: integer("progress").notNull().default(0),
  progressNote: text("progress_note").notNull().default(""),
  lastCheckInAt: timestamp("last_check_in_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const goalDependencies = pgTable("goal_dependency", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  goalId: text("goal_id")
    .notNull()
    .references(() => goals.id, { onDelete: "cascade" }),
  dependsOnGoalId: text("depends_on_goal_id")
    .notNull()
    .references(() => goals.id, { onDelete: "cascade" }),
});

export const roadmapVersions = pgTable("roadmap_version", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trigger: text("trigger").notNull(),
  summary: text("summary").notNull(),
  structured: jsonb("structured").$type<RoadmapOutput>().notNull(),
  constraintReport: jsonb("constraint_report").$type<ConstraintReport>().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const milestones = pgTable("milestone", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roadmapId: text("roadmap_id")
    .notNull()
    .references(() => roadmapVersions.id, { onDelete: "cascade" }),
  goalId: text("goal_id").references(() => goals.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  targetDate: date("target_date", { mode: "string" }).notNull(),
  period: text("period").notNull(),
  status: text("status").notNull().default("planned"),
  measure: text("measure").notNull().default(""),
});

export const dailyTasks = pgTable("daily_task", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roadmapId: text("roadmap_id").references(() => roadmapVersions.id, {
    onDelete: "set null",
  }),
  goalId: text("goal_id").references(() => goals.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  domain: text("domain").notNull(),
  dueDate: date("due_date", { mode: "string" }).notNull(),
  isNonNegotiable: boolean("is_non_negotiable").notNull().default(true),
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const weeklyReviews = pgTable("weekly_review", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  weekStart: date("week_start", { mode: "string" }).notNull(),
  completed: text("completed").notNull(),
  slipped: text("slipped").notNull().default(""),
  reasons: text("reasons").notNull().default(""),
  savedAmount: numeric("saved_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  workoutsDone: integer("workouts_done").notNull().default(0),
  studyHours: numeric("study_hours", { precision: 5, scale: 2 }).notNull().default("0"),
  disciplineScore: integer("discipline_score").notNull().default(5),
  energyNextWeek: text("energy_next_week").notNull(),
  aiRecovery: jsonb("ai_recovery").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const researchRuns = pgTable("research_run", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  goalId: text("goal_id").references(() => goals.id, { onDelete: "set null" }),
  query: text("query").notNull(),
  summary: text("summary").notNull(),
  grounded: boolean("grounded").notNull().default(false),
  citations: jsonb("citations").$type<ResearchCitation[]>().notNull().default([]),
  raw: jsonb("raw").$type<Record<string, unknown>>(),
  appliedAt: timestamp("applied_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const aiRunLogs = pgTable("ai_run_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  promptHash: text("prompt_hash").notNull(),
  input: jsonb("input").$type<Record<string, unknown>>().notNull(),
  output: jsonb("output").$type<Record<string, unknown>>(),
  status: text("status").notNull(),
  error: text("error"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  goals: many(goals),
  roadmaps: many(roadmapVersions),
  tasks: many(dailyTasks),
}));

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
  tasks: many(dailyTasks),
}));
