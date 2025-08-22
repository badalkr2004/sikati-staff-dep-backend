CREATE TYPE "public"."contact" AS ENUM('call', 'text', 'email');--> statement-breakpoint
CREATE TYPE "public"."duration" AS ENUM('few-hours', 'half-day', 'full-day', 'multiple-days', 'ongoing');--> statement-breakpoint
CREATE TYPE "public"."urgency" AS ENUM('immediate', 'same-day', 'next-day', 'weekend');--> statement-breakpoint
CREATE TYPE "public"."work_type" AS ENUM('event-support', 'security', 'labor', 'admin', 'technical', 'cleaning', 'other');--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"urgency" "urgency" NOT NULL,
	"staff_needed" integer NOT NULL,
	"location" text NOT NULL,
	"start_date_time" timestamp with time zone NOT NULL,
	"duration" "duration" NOT NULL,
	"work_type" "work_type" NOT NULL,
	"emergency_description" text NOT NULL,
	"special_requirements" text,
	"contact" "contact" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
