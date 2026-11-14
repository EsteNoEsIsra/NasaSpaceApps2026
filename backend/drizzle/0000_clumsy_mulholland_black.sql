CREATE TABLE "astronaut_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mission_id" uuid,
	"contraceptive_type" varchar(50) DEFAULT 'combined' NOT NULL,
	"baseline_hrv" integer DEFAULT 68,
	"baseline_temp" numeric(4, 1) DEFAULT '36.6',
	"baseline_heart_rate" integer DEFAULT 64,
	"target_hydration_ml" integer DEFAULT 2500 NOT NULL,
	"mission_environment" varchar(30) DEFAULT 'transit-0g' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "biometric_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"heart_rate" integer,
	"hrv" integer,
	"body_temp" numeric(4, 1),
	"oxygen_saturation" integer,
	"leg_edema_score" integer,
	"ocular_pressure_note" varchar(20),
	"source" varchar(20) DEFAULT 'wearable' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cabin_telemetry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"co2_level" numeric(5, 2) NOT NULL,
	"o2_level" numeric(5, 2) NOT NULL,
	"pressure" numeric(7, 2) NOT NULL,
	"humidity" integer NOT NULL,
	"temperature" numeric(4, 1) NOT NULL,
	"radiation_level" numeric(6, 3) NOT NULL,
	"source" varchar(20) DEFAULT 'simulated' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mission_day" integer NOT NULL,
	"pill_taken" boolean NOT NULL,
	"hydration_level" varchar(20) NOT NULL,
	"hydration_ml" integer DEFAULT 2200,
	"exercise_minutes" integer DEFAULT 60,
	"symptoms" jsonb NOT NULL,
	"sleep_hours" numeric(3, 1),
	"mood_score" integer,
	"vaginal_ph" numeric(3, 1),
	"swab_result" varchar(30),
	"is_private" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"severity" varchar(20) NOT NULL,
	"category" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"possible_causes" jsonb NOT NULL,
	"recommended_actions" jsonb NOT NULL,
	"primary_cause" varchar(50) NOT NULL,
	"confidence" integer NOT NULL,
	"is_acknowledged" boolean DEFAULT false NOT NULL,
	"acknowledged_at" timestamp,
	"related_checkin_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"start_date" timestamp NOT NULL,
	"target_body" varchar(50) DEFAULT 'ISS' NOT NULL,
	"communication_latency_min" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "astronaut_profiles" ADD CONSTRAINT "astronaut_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "astronaut_profiles" ADD CONSTRAINT "astronaut_profiles_mission_id_missions_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biometric_readings" ADD CONSTRAINT "biometric_readings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_checkins" ADD CONSTRAINT "daily_checkins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_alerts" ADD CONSTRAINT "health_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_alerts" ADD CONSTRAINT "health_alerts_related_checkin_id_daily_checkins_id_fk" FOREIGN KEY ("related_checkin_id") REFERENCES "public"."daily_checkins"("id") ON DELETE set null ON UPDATE no action;