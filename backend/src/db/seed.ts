import { eq } from 'drizzle-orm';
import { db } from './client';
import {
  users,
  missions,
  astronautProfiles,
  dailyCheckins,
  biometricReadings,
  cabinTelemetry,
  healthAlerts,
} from './schema';
import { DEMO_USER_ID } from '../middleware/auth.middleware';

export const DEMO_MISSION_ID = '00000000-0000-0000-0000-000000000010';

export async function seedDatabase(): Promise<void> {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, DEMO_USER_ID),
  });

  if (!existingUser) {
    await db.insert(users).values({
      id: DEMO_USER_ID,
      name: 'Cmdr. Elena Vance',
      email: 'elena.vance@artemis-crew.nasa.gov',
      password: 'demo_no_login_required',
      role: 'astronaut',
    });
  }

  const existingMission = await db.query.missions.findFirst({
    where: eq(missions.id, DEMO_MISSION_ID),
  });

  if (!existingMission) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 42);
    await db.insert(missions).values({
      id: DEMO_MISSION_ID,
      name: 'Artemis IV · Lunar Transit',
      startDate,
      targetBody: 'Lunar Gateway',
      communicationLatencyMin: 4,
    });
  }

  const existingProfile = await db.query.astronautProfiles.findFirst({
    where: eq(astronautProfiles.userId, DEMO_USER_ID),
  });

  if (existingProfile) {
    return;
  }

  await db.insert(astronautProfiles).values({
    userId: DEMO_USER_ID,
    missionId: DEMO_MISSION_ID,
    contraceptiveType: 'combined',
    baselineHRV: 68,
    baselineTemp: '36.6',
    baselineHeartRate: 64,
    targetHydrationMl: 2500,
    missionEnvironment: 'transit-0g',
  });

  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - i);
    const missionDay = 42 - i;

    const hrv = Math.round(66 + Math.sin(i * 0.6) * 5);
    const bodyTemp = (36.6 + Math.cos(i * 0.4) * 0.1).toFixed(1);
    const heartRate = Math.round(63 + Math.sin(i * 0.5) * 3);
    const hydrationMl = i % 4 === 0 ? 2300 : 2600;
    const exerciseMinutes = i % 7 === 0 ? 45 : 65;

    await db.insert(dailyCheckins).values({
      userId: DEMO_USER_ID,
      missionDay,
      pillTaken: true,
      hydrationLevel: hydrationMl >= 2500 ? 'high' : 'normal',
      hydrationMl,
      exerciseMinutes,
      symptoms: [],
      sleepHours: (7.2 + Math.sin(i) * 0.4).toFixed(1),
      moodScore: 4,
      vaginalPh: i % 7 === 0 ? '4.2' : null,
      swabResult: i % 7 === 0 ? 'normal' : null,
      isPrivate: true,
      notes: i === 0 ? 'Nominal shift, hydration target completed post-ARED session.' : null,
      createdAt: dayDate,
    });

    await db.insert(biometricReadings).values({
      userId: DEMO_USER_ID,
      timestamp: dayDate,
      heartRate,
      hrv,
      bodyTemp,
      oxygenSaturation: 98,
      legEdemaScore: 0,
      ocularPressureNote: 'normal',
      source: 'wearable',
      createdAt: dayDate,
    });

    await db.insert(cabinTelemetry).values({
      timestamp: dayDate,
      co2Level: '0.41',
      o2Level: '21.10',
      pressure: '101.30',
      humidity: 44,
      temperature: '22.4',
      radiationLevel: '0.420',
      source: 'eclss-telemetry',
      createdAt: dayDate,
    });
  }

  await db.insert(healthAlerts).values({
    userId: DEMO_USER_ID,
    severity: 'info',
    category: 'hormonal',
    title: 'Her Hormonal Baseline Calibrated · Continuous Combined Regimen',
    description:
      'Basal body temperature (36.6°C), HRV (68 ms), and vascular/skeletal thresholds are calibrated to female endocrine physiology in microgravity.',
    possibleCauses: ['Continuous menstrual suppression active in flight'],
    recommendedActions: [
      'Maintain fluid intake >= 2.5 L/day to counterbalance exogenous estrogen in 0g',
      'Complete 60 min/day resistive loading on ARED',
    ],
    primaryCause: 'baseline_calibrated',
    confidence: 100,
    isAcknowledged: false,
  });
}