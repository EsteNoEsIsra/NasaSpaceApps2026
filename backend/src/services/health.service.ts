import { desc, eq } from 'drizzle-orm';
import { db } from '../db/client';
import {
  astronautProfiles,
  missions,
  dailyCheckins,
  biometricReadings,
  cabinTelemetry,
  healthAlerts,
} from '../db/schema';
import {
  calculateVascularBoneBalance,
  type MissionEnvironment,
} from '../engine/thrombosisCalculator';
import { runDifferentialDiagnosis } from '../engine/differentialDiagnosis';
import { seedDatabase } from '../db/seed';

export interface CheckinPayload {
  pillTaken: boolean;
  hydrationMl: number;
  exerciseMinutes: number;
  symptoms: string[];
  sleepHours?: number;
  moodScore?: number;
  vaginalPh?: number;
  swabResult?: 'normal' | 'candida_risk' | 'bv_risk' | 'uti_risk';
  isPrivate?: boolean;
  notes?: string;
  heartRate?: number;
  hrv?: number;
  bodyTemp?: number;
  legEdemaScore?: number;
  ocularPressureNote?: 'normal' | 'elevated' | 'high';
}

export interface ProfileUpdatePayload {
  contraceptiveType?: 'combined' | 'progestin-only' | 'none';
  baselineHRV?: number;
  baselineTemp?: number;
  baselineHeartRate?: number;
  targetHydrationMl?: number;
  missionEnvironment?: MissionEnvironment;
}

export type SimulationScenario =
  | 'nominal'
  | 'co2_spike_dehydration'
  | 'sans_precursor'
  | 'microbiome_immuno';

export class HealthService {
  async getDashboard(userId: string) {
    await seedDatabase();

    const profile = await db.query.astronautProfiles.findFirst({
      where: eq(astronautProfiles.userId, userId),
    });

    const mission = profile?.missionId
      ? await db.query.missions.findFirst({
          where: eq(missions.id, profile.missionId),
        })
      : null;

    const recentCheckins = await db
      .select()
      .from(dailyCheckins)
      .where(eq(dailyCheckins.userId, userId))
      .orderBy(desc(dailyCheckins.createdAt))
      .limit(21);

    const recentBiometrics = await db
      .select()
      .from(biometricReadings)
      .where(eq(biometricReadings.userId, userId))
      .orderBy(desc(biometricReadings.createdAt))
      .limit(21);

    const recentTelemetry = await db
      .select()
      .from(cabinTelemetry)
      .orderBy(desc(cabinTelemetry.createdAt))
      .limit(21);

    const alerts = await db
      .select()
      .from(healthAlerts)
      .where(eq(healthAlerts.userId, userId))
      .orderBy(desc(healthAlerts.createdAt))
      .limit(15);

    const latestCheckin = recentCheckins[0] ?? null;
    const latestBiometric = recentBiometrics[0] ?? null;
    const latestTelemetry = recentTelemetry[0] ?? null;
    const missionDay = latestCheckin?.missionDay ?? 42;

    const contraceptiveType = (profile?.contraceptiveType ?? 'combined') as
      | 'combined'
      | 'progestin-only'
      | 'none';
    const missionEnvironment = (profile?.missionEnvironment ?? 'transit-0g') as MissionEnvironment;

    const vascularBoneBalance = calculateVascularBoneBalance({
      contraceptiveType,
      hydrationLevel: (latestCheckin?.hydrationLevel as 'low' | 'normal' | 'high') ?? 'normal',
      hydrationMl: latestCheckin?.hydrationMl ?? 2500,
      exerciseMinutes: latestCheckin?.exerciseMinutes ?? 60,
      legEdemaScore: latestBiometric?.legEdemaScore ?? 0,
      daysInMission: missionDay,
      hrv: latestBiometric?.hrv ?? 68,
      baselineHRV: profile?.baselineHRV ?? 68,
      missionEnvironment,
    });

    const history = [...recentBiometrics]
      .reverse()
      .map((bio, idx) => {
        const reversedCheckins = [...recentCheckins].reverse();
        const chk = reversedCheckins[idx];
        return {
          missionDay: chk?.missionDay ?? 22 + idx,
          date: bio.createdAt,
          hrv: bio.hrv ?? 68,
          bodyTemp: Number(bio.bodyTemp ?? 36.6),
          heartRate: bio.heartRate ?? 64,
          sleepHours: Number(chk?.sleepHours ?? 7.2),
          hydrationMl: chk?.hydrationMl ?? 2500,
          exerciseMinutes: chk?.exerciseMinutes ?? 60,
        };
      });

    return {
      profile: profile
        ? {
            ...profile,
            baselineTemp: Number(profile.baselineTemp ?? 36.6),
          }
        : null,
      mission,
      latestTelemetry: latestTelemetry
        ? {
            ...latestTelemetry,
            co2Level: Number(latestTelemetry.co2Level),
            o2Level: Number(latestTelemetry.o2Level),
            pressure: Number(latestTelemetry.pressure),
            temperature: Number(latestTelemetry.temperature),
            radiationLevel: Number(latestTelemetry.radiationLevel),
          }
        : null,
      latestBiometric: latestBiometric
        ? {
            ...latestBiometric,
            bodyTemp: Number(latestBiometric.bodyTemp ?? 36.6),
          }
        : null,
      latestCheckin: latestCheckin
        ? {
            ...latestCheckin,
            sleepHours: latestCheckin.sleepHours ? Number(latestCheckin.sleepHours) : null,
            vaginalPh: latestCheckin.vaginalPh ? Number(latestCheckin.vaginalPh) : null,
          }
        : null,
      vascularBoneBalance,
      alerts,
      history,
    };
  }

  async updateProfile(userId: string, payload: ProfileUpdatePayload) {
    await seedDatabase();

    const existing = await db.query.astronautProfiles.findFirst({
      where: eq(astronautProfiles.userId, userId),
    });

    if (existing) {
      await db
        .update(astronautProfiles)
        .set({
          ...(payload.contraceptiveType && { contraceptiveType: payload.contraceptiveType }),
          ...(payload.baselineHRV !== undefined && { baselineHRV: payload.baselineHRV }),
          ...(payload.baselineTemp !== undefined && {
            baselineTemp: payload.baselineTemp.toFixed(1),
          }),
          ...(payload.baselineHeartRate !== undefined && {
            baselineHeartRate: payload.baselineHeartRate,
          }),
          ...(payload.targetHydrationMl !== undefined && {
            targetHydrationMl: payload.targetHydrationMl,
          }),
          ...(payload.missionEnvironment && { missionEnvironment: payload.missionEnvironment }),
          updatedAt: new Date(),
        })
        .where(eq(astronautProfiles.id, existing.id));
    }

    return this.getDashboard(userId);
  }

  async submitCheckin(userId: string, payload: CheckinPayload) {
    const current = await this.getDashboard(userId);
    const nextDay = (current.latestCheckin?.missionDay ?? 42) + 1;
    const targetMl = current.profile?.targetHydrationMl ?? 2500;

    const hydrationLevel: 'low' | 'normal' | 'high' =
      payload.hydrationMl < targetMl * 0.72
        ? 'low'
        : payload.hydrationMl >= targetMl
          ? 'high'
          : 'normal';

    const [insertedCheckin] = await db
      .insert(dailyCheckins)
      .values({
        userId,
        missionDay: nextDay,
        pillTaken: payload.pillTaken,
        hydrationLevel,
        hydrationMl: payload.hydrationMl,
        exerciseMinutes: payload.exerciseMinutes,
        symptoms: payload.symptoms,
        sleepHours: payload.sleepHours !== undefined ? payload.sleepHours.toFixed(1) : '7.2',
        moodScore: payload.moodScore ?? 4,
        vaginalPh: payload.vaginalPh !== undefined ? payload.vaginalPh.toFixed(1) : null,
        swabResult: payload.swabResult ?? null,
        isPrivate: payload.isPrivate ?? true,
        notes: payload.notes ?? null,
      })
      .returning();

    const prevBio = current.latestBiometric;
    const hrv = payload.hrv ?? prevBio?.hrv ?? 68;
    const bodyTemp = payload.bodyTemp ?? prevBio?.bodyTemp ?? 36.6;
    const heartRate = payload.heartRate ?? prevBio?.heartRate ?? 64;
    const legEdemaScore = payload.legEdemaScore ?? prevBio?.legEdemaScore ?? 0;
    const ocularPressureNote = payload.ocularPressureNote ?? prevBio?.ocularPressureNote ?? 'normal';

    await db.insert(biometricReadings).values({
      userId,
      heartRate,
      hrv,
      bodyTemp: bodyTemp.toFixed(1),
      oxygenSaturation: prevBio?.oxygenSaturation ?? 98,
      legEdemaScore,
      ocularPressureNote,
      source: 'checkin-sync',
    });

    const contraceptiveType = (current.profile?.contraceptiveType ?? 'combined') as
      | 'combined'
      | 'progestin-only'
      | 'none';
    const missionEnvironment = (current.profile?.missionEnvironment ??
      'transit-0g') as MissionEnvironment;

    const diagnosis = runDifferentialDiagnosis({
      symptoms: payload.symptoms,
      co2Level: current.latestTelemetry?.co2Level ?? 0.41,
      o2Level: current.latestTelemetry?.o2Level ?? 21.1,
      pillTaken: payload.pillTaken,
      contraceptiveType,
      hydrationLevel,
      hydrationMl: payload.hydrationMl,
      hrv,
      baselineHRV: current.profile?.baselineHRV ?? 68,
      legEdemaScore,
      ocularPressureNote,
      vaginalPh: payload.vaginalPh,
      swabResult: payload.swabResult,
      daysInMission: nextDay,
      missionEnvironment,
    });

    await db
      .update(healthAlerts)
      .set({ isAcknowledged: true, acknowledgedAt: new Date() })
      .where(eq(healthAlerts.userId, userId));

    for (const alert of diagnosis.alerts) {
      await db.insert(healthAlerts).values({
        userId,
        severity: alert.severity,
        category: alert.category,
        title: alert.title,
        description: alert.description,
        possibleCauses: alert.possibleCauses,
        recommendedActions: alert.recommendedActions,
        primaryCause: alert.primaryCause,
        confidence: alert.confidence,
        relatedCheckinId: insertedCheckin.id,
      });
    }

    return this.getDashboard(userId);
  }

  async simulateScenario(userId: string, scenario: SimulationScenario) {
    await seedDatabase();

    if (scenario === 'nominal') {
      await db.insert(cabinTelemetry).values({
        co2Level: '0.41',
        o2Level: '21.10',
        pressure: '101.30',
        humidity: 44,
        temperature: '22.4',
        radiationLevel: '0.420',
        source: 'sim-nominal',
      });

      return this.submitCheckin(userId, {
        pillTaken: true,
        hydrationMl: 2600,
        exerciseMinutes: 65,
        symptoms: [],
        sleepHours: 7.5,
        moodScore: 5,
        hrv: 70,
        bodyTemp: 36.6,
        heartRate: 62,
        legEdemaScore: 0,
        ocularPressureNote: 'normal',
        notes: 'Nominal mission baseline restored.',
      });
    }

    if (scenario === 'co2_spike_dehydration') {
      await db.insert(cabinTelemetry).values({
        co2Level: '0.78',
        o2Level: '20.80',
        pressure: '101.10',
        humidity: 49,
        temperature: '23.8',
        radiationLevel: '0.430',
        source: 'sim-co2-crisis',
      });

      return this.submitCheckin(userId, {
        pillTaken: true,
        hydrationMl: 1350,
        exerciseMinutes: 30,
        symptoms: ['headache', 'nausea', 'leg_swelling'],
        sleepHours: 5.8,
        moodScore: 3,
        hrv: 46,
        bodyTemp: 36.9,
        heartRate: 78,
        legEdemaScore: 2,
        ocularPressureNote: 'normal',
        notes: 'Headache and lower-limb heaviness after extended lab module shift.',
      });
    }

    if (scenario === 'sans_precursor') {
      await db.insert(cabinTelemetry).values({
        co2Level: '0.44',
        o2Level: '21.05',
        pressure: '101.30',
        humidity: 45,
        temperature: '22.3',
        radiationLevel: '0.440',
        source: 'sim-sans',
      });

      return this.submitCheckin(userId, {
        pillTaken: true,
        hydrationMl: 2300,
        exerciseMinutes: 60,
        symptoms: ['headache', 'vision_blur'],
        sleepHours: 6.4,
        moodScore: 3,
        hrv: 56,
        bodyTemp: 36.7,
        heartRate: 68,
        legEdemaScore: 0,
        ocularPressureNote: 'elevated',
        notes: 'Mild near-vision focus difficulty during console telemetry check.',
      });
    }

    await db.insert(cabinTelemetry).values({
      co2Level: '0.42',
      o2Level: '21.10',
      pressure: '101.30',
      humidity: 46,
      temperature: '22.5',
      radiationLevel: '0.480',
      source: 'sim-microbiome',
    });

    return this.submitCheckin(userId, {
      pillTaken: true,
      hydrationMl: 1700,
      exerciseMinutes: 50,
      symptoms: ['burning_urination', 'vaginal_itching'],
      sleepHours: 6.1,
      moodScore: 3,
      vaginalPh: 5.1,
      swabResult: 'candida_risk',
      isPrivate: true,
      hrv: 49,
      bodyTemp: 37.1,
      heartRate: 74,
      legEdemaScore: 0,
      ocularPressureNote: 'normal',
      notes: 'Private intimate log: mild discomfort logged after weekly swab check.',
    });
  }

  async acknowledgeAlert(userId: string, alertId: string) {
    await db
      .update(healthAlerts)
      .set({ isAcknowledged: true, acknowledgedAt: new Date() })
      .where(eq(healthAlerts.id, alertId));

    return this.getDashboard(userId);
  }

  async generateFlightSurgeonPacket(userId: string, includeIntimateDetails = false) {
    const dashboard = await this.getDashboard(userId);
    const activeAlerts = dashboard.alerts.filter((a) => !a.isAcknowledged);

    return {
      packetId: `ARTEMIS-MED-${Date.now().toString(36).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      latencyMinutes: dashboard.mission?.communicationLatencyMin ?? 4,
      compressionRatio: '14.2:1 (Low-Bandwidth Deep Space Telemetry)',
      privacyFilterApplied: !includeIntimateDetails,
      astronautBaseline: {
        contraceptiveRegimen: dashboard.profile?.contraceptiveType,
        missionEnvironment: dashboard.profile?.missionEnvironment,
        calibratedHRV: dashboard.profile?.baselineHRV,
        calibratedTempC: dashboard.profile?.baselineTemp,
      },
      cabinContext: dashboard.latestTelemetry,
      biometricSnapshot: dashboard.latestBiometric,
      vascularBoneAssessment: dashboard.vascularBoneBalance,
      activeTriageAlerts: activeAlerts,
      intimateHealthSummary: includeIntimateDetails
        ? {
            vaginalPh: dashboard.latestCheckin?.vaginalPh,
            swabResult: dashboard.latestCheckin?.swabResult,
            privateNotes: dashboard.latestCheckin?.notes,
          }
        : {
            status: 'REDACTED_BY_ASTRONAUT_PRIVACY_LOCK',
            clinicalFlagOnly: activeAlerts.some((a) => a.category === 'infection')
              ? 'Urogenital protocol active onboard'
              : 'Nominal',
          },
    };
  }
}