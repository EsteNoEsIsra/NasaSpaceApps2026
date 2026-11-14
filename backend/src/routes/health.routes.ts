import { Router } from 'express';
import { z } from 'zod';
import { HealthController } from '../controllers/health.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

export const healthRouter = Router();
const ctrl = new HealthController();

const profileSchema = z.object({
  contraceptiveType: z.enum(['combined', 'progestin-only', 'none']).optional(),
  baselineHRV: z.number().int().min(15).max(200).optional(),
  baselineTemp: z.number().min(35).max(39).optional(),
  baselineHeartRate: z.number().int().min(35).max(150).optional(),
  targetHydrationMl: z.number().int().min(1000).max(5000).optional(),
  missionEnvironment: z
    .enum(['transit-0g', 'orbital-station', 'lunar-base', 'eva-prep'])
    .optional(),
});

const checkinSchema = z.object({
  pillTaken: z.boolean(),
  hydrationMl: z.number().int().min(0).max(6000),
  exerciseMinutes: z.number().int().min(0).max(300),
  symptoms: z.array(z.string()).default([]),
  sleepHours: z.number().min(0).max(16).optional(),
  moodScore: z.number().int().min(1).max(5).optional(),
  vaginalPh: z.number().min(3.0).max(8.0).optional(),
  swabResult: z.enum(['normal', 'candida_risk', 'bv_risk', 'uti_risk']).optional(),
  isPrivate: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  heartRate: z.number().int().min(30).max(220).optional(),
  hrv: z.number().int().min(10).max(220).optional(),
  bodyTemp: z.number().min(34).max(42).optional(),
  legEdemaScore: z.number().int().min(0).max(3).optional(),
  ocularPressureNote: z.enum(['normal', 'elevated', 'high']).optional(),
});

const simulateSchema = z.object({
  scenario: z.enum(['nominal', 'co2_spike_dehydration', 'sans_precursor', 'microbiome_immuno']),
});

healthRouter.use(requireAuth);

healthRouter.get('/dashboard', ctrl.getDashboard);
healthRouter.patch('/profile', validate(profileSchema), ctrl.updateProfile);
healthRouter.post('/checkin', validate(checkinSchema), ctrl.submitCheckin);
healthRouter.post('/simulate', validate(simulateSchema), ctrl.simulateScenario);
healthRouter.post('/alerts/:id/acknowledge', ctrl.acknowledgeAlert);
healthRouter.get('/ground-packet', ctrl.getGroundPacket);