CREATE TABLE "ai_run_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"prompt_hash" text NOT NULL,
	"input" jsonb NOT NULL,
	"output" jsonb,
	"status" text NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_task" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"roadmap_id" text,
	"goal_id" text,
	"title" text NOT NULL,
	"domain" text NOT NULL,
	"due_date" date NOT NULL,
	"is_non_negotiable" boolean DEFAULT true NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal_dependency" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"depends_on_goal_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"domain" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"deadline" date NOT NULL,
	"target_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"weekly_hours" numeric(5, 2) DEFAULT '0' NOT NULL,
	"priority" integer DEFAULT 3 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"why" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestone" (
	"id" text PRIMARY KEY NOT NULL,
	"roadmap_id" text NOT NULL,
	"goal_id" text,
	"title" text NOT NULL,
	"target_date" date NOT NULL,
	"period" text NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"measure" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"age" integer NOT NULL,
	"monthly_income" numeric(12, 2) NOT NULL,
	"fixed_expenses" numeric(12, 2) NOT NULL,
	"current_savings" numeric(12, 2) NOT NULL,
	"family_responsibilities" text DEFAULT '' NOT NULL,
	"daily_available_minutes" integer NOT NULL,
	"energy_level" text NOT NULL,
	"blockers" text DEFAULT '' NOT NULL,
	"intensity" text DEFAULT 'balanced' NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"onboarded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "research_run" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"goal_id" text,
	"query" text NOT NULL,
	"summary" text NOT NULL,
	"grounded" boolean DEFAULT false NOT NULL,
	"citations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"raw" jsonb,
	"applied_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmap_version" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"trigger" text NOT NULL,
	"summary" text NOT NULL,
	"structured" jsonb NOT NULL,
	"constraint_report" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weekly_review" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"week_start" date NOT NULL,
	"completed" text NOT NULL,
	"slipped" text DEFAULT '' NOT NULL,
	"reasons" text DEFAULT '' NOT NULL,
	"saved_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"workouts_done" integer DEFAULT 0 NOT NULL,
	"study_hours" numeric(5, 2) DEFAULT '0' NOT NULL,
	"discipline_score" integer DEFAULT 5 NOT NULL,
	"energy_next_week" text NOT NULL,
	"ai_recovery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_run_log" ADD CONSTRAINT "ai_run_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_task" ADD CONSTRAINT "daily_task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_task" ADD CONSTRAINT "daily_task_roadmap_id_roadmap_version_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmap_version"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_task" ADD CONSTRAINT "daily_task_goal_id_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goal"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_dependency" ADD CONSTRAINT "goal_dependency_goal_id_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_dependency" ADD CONSTRAINT "goal_dependency_depends_on_goal_id_goal_id_fk" FOREIGN KEY ("depends_on_goal_id") REFERENCES "public"."goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestone" ADD CONSTRAINT "milestone_roadmap_id_roadmap_version_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmap_version"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestone" ADD CONSTRAINT "milestone_goal_id_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goal"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_run" ADD CONSTRAINT "research_run_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_run" ADD CONSTRAINT "research_run_goal_id_goal_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goal"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_version" ADD CONSTRAINT "roadmap_version_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_review" ADD CONSTRAINT "weekly_review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;