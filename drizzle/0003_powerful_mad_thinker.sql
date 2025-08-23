CREATE TYPE "public"."budget_range" AS ENUM('under5k', '5k-10k', '10k-25k', '25k-50k', 'over50k', 'discuss');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('government', 'corporate', 'private', 'construction', 'security', 'hospitality', 'other');--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_name" varchar(255) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"event_type" "event_type" NOT NULL,
	"start_date" date NOT NULL,
	"duration" "duration",
	"staff_needed" integer NOT NULL,
	"location" text NOT NULL,
	"services" text[] NOT NULL,
	"special_requirements" text,
	"budget_range" "budget_range",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emergency" ALTER COLUMN "duration" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "quote_requests" ALTER COLUMN "duration" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."duration";--> statement-breakpoint
CREATE TYPE "public"."duration" AS ENUM('1day', '2-3days', '1week', '2weeks', '1month', 'ongoing');--> statement-breakpoint
ALTER TABLE "emergency" ALTER COLUMN "duration" SET DATA TYPE "public"."duration" USING "duration"::"public"."duration";--> statement-breakpoint
ALTER TABLE "quote_requests" ALTER COLUMN "duration" SET DATA TYPE "public"."duration" USING "duration"::"public"."duration";