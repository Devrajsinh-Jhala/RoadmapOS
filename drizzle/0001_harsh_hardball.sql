ALTER TABLE "goal" ADD COLUMN "progress" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "progress_note" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "last_check_in_at" timestamp;