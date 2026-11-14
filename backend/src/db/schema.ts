import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';

// Users
export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     varchar('email', { length: 255 }).notNull().unique(),
  password:  varchar('password', { length: 255 }).notNull(),
  name:      varchar('name', { length: 100 }).notNull(),
  role:      varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Missions
export const missions = pgTable('missions', {
  id:                      uuid('id').primaryKey().defaultRandom(),
  name:                    varchar('name', { length: 100 }).notNull(),
  startDate:               timestamp('start_date').notNull(),
  targetBody:              varchar('target_body', { length: 50 }).notNull().default('ISS'),
  communicationLatencyMin: integer('communication_latency_min').notNull().default(0),
  createdAt:               timestamp('created_at').notNull().defaultNow(),
});

// Astronaut Profiles (Female physiology as primary baseline)
export const astronautProfiles = pgTable('astronaut_profiles', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  userId:             uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  missionId:          uuid('mission_id').references(() => missions.id, { onDelete: 'set null' }),
  contraceptiveType:  varchar('contraceptive_type', { length: 50 }).notNull().default('combined'),
  baselineHRV:        integer('baseline_hrv').default(68),
  baselineTemp:       numeric('baseline_temp', { precision: 4, scale: 1 }).default('36.6'),
  baselineHeartRate:  integer('baseline_heart_rate').default(64),
  targetHydrationMl:  integer('target_hydration_ml').notNull().default(2500),
  missionEnvironment: varchar('mission_environment', { length: 30 }).notNull().default('transit-0g'),
  createdAt:          timestamp('created_at').notNull().defaultNow(),
  updatedAt:          timestamp('updated_at').notNull().defaultNow(),
});

// Daily Check-ins & Periodic Microbiome/pH Logs
export const dailyCheckins = pgTable('daily_checkins', {
  id:              uuid('id').primaryKey().defaultRandom(),
  userId:          uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  missionDay:      integer('mission_day').notNull(),
  pillTaken:       boolean('pill_taken').notNull(),
  hydrationLevel:  varchar('hydration_level', { length: 20 }).notNull(),
  hydrationMl:     integer('hydration_ml').default(2200),
  exerciseMinutes: integer('exercise_minutes').default(60),
  symptoms:        jsonb('symptoms').notNull().$type<string[]>(),
  sleepHours:      numeric('sleep_hours', { precision: 3, scale: 1 }),
  moodScore:       integer('mood_score'),
  vaginalPh:       numeric('vaginal_ph', { precision: 3, scale: 1 }),
  swabResult:      varchar('swab_result', { length: 30 }),
  isPrivate:       boolean('is_private').notNull().default(true),
  notes:           text('notes'),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
});

// Biometric Readings (Wearables & Onboard Devices)
export const biometricReadings = pgTable('biometric_readings', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  userId:             uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  timestamp:          timestamp('timestamp').notNull().defaultNow(),
  heartRate:          integer('heart_rate'),
  hrv:                integer('hrv'),
  bodyTemp:           numeric('body_temp', { precision: 4, scale: 1 }),
  oxygenSaturation:   integer('oxygen_saturation'),
  legEdemaScore:      integer('leg_edema_score'),
  ocularPressureNote: varchar('ocular_pressure_note', { length: 20 }),
  source:             varchar('source', { length: 20 }).notNull().default('wearable'),
  createdAt:          timestamp('created_at').notNull().defaultNow(),
});

// Cabin Telemetry
export const cabinTelemetry = pgTable('cabin_telemetry', {
  id:             uuid('id').primaryKey().defaultRandom(),
  timestamp:      timestamp('timestamp').notNull().defaultNow(),
  co2Level:       numeric('co2_level', { precision: 5, scale: 2 }).notNull(),
  o2Level:        numeric('o2_level', { precision: 5, scale: 2 }).notNull(),
  pressure:       numeric('pressure', { precision: 7, scale: 2 }).notNull(),
  humidity:       integer('humidity').notNull(),
  temperature:    numeric('temperature', { precision: 4, scale: 1 }).notNull(),
  radiationLevel: numeric('radiation_level', { precision: 6, scale: 3 }).notNull(),
  source:         varchar('source', { length: 20 }).notNull().default('simulated'),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
});

// Health Alerts
export const healthAlerts = pgTable('health_alerts', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  userId:             uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  severity:           varchar('severity', { length: 20 }).notNull(),
  category:           varchar('category', { length: 50 }).notNull(),
  title:              varchar('title', { length: 255 }).notNull(),
  description:        text('description').notNull(),
  possibleCauses:     jsonb('possible_causes').notNull().$type<string[]>(),
  recommendedActions: jsonb('recommended_actions').notNull().$type<string[]>(),
  primaryCause:       varchar('primary_cause', { length: 50 }).notNull(),
  confidence:         integer('confidence').notNull(),
  isAcknowledged:     boolean('is_acknowledged').notNull().default(false),
  acknowledgedAt:     timestamp('acknowledged_at'),
  relatedCheckinId:   uuid('related_checkin_id').references(() => dailyCheckins.id, { onDelete: 'set null' }),
  createdAt:          timestamp('created_at').notNull().defaultNow(),
});

// Type exports
export type User                = typeof users.$inferSelect;
export type NewUser             = typeof users.$inferInsert;
export type Mission             = typeof missions.$inferSelect;
export type NewMission          = typeof missions.$inferInsert;
export type AstronautProfile    = typeof astronautProfiles.$inferSelect;
export type NewAstronautProfile = typeof astronautProfiles.$inferInsert;
export type DailyCheckin        = typeof dailyCheckins.$inferSelect;
export type NewDailyCheckin     = typeof dailyCheckins.$inferInsert;
export type BiometricReading    = typeof biometricReadings.$inferSelect;
export type NewBiometricReading = typeof biometricReadings.$inferInsert;
export type CabinTelemetry      = typeof cabinTelemetry.$inferSelect;
export type NewCabinTelemetry   = typeof cabinTelemetry.$inferInsert;
export type HealthAlert         = typeof healthAlerts.$inferSelect;
export type NewHealthAlert      = typeof healthAlerts.$inferInsert;