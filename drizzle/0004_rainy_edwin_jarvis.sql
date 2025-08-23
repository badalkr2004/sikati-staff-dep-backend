CREATE TYPE "public"."quote_duration" AS ENUM('1day', '2-3days', '1week', '2weeks', '1month', 'ongoing');--> statement-breakpoint
ALTER TABLE "emergency" ALTER COLUMN "duration" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."duration";--> statement-breakpoint
CREATE TYPE "public"."duration" AS ENUM('few-hours', 'half-day', 'full-day', 'multiple-days', 'ongoing');--> statement-breakpoint
ALTER TABLE "emergency" ALTER COLUMN "duration" SET DATA TYPE "public"."duration" USING "duration"::"public"."duration";--> statement-breakpoint
ALTER TABLE "quote_requests" ALTER COLUMN "duration" SET DATA TYPE "public"."quote_duration" USING "duration"::text::"public"."quote_duration";