export type MissionEnvironment = 'transit-0g' | 'orbital-station' | 'lunar-base' | 'eva-prep';
export type ContraceptiveType = 'combined' | 'progestin-only' | 'none';
export type Severity = 'info' | 'warning' | 'critical';
export type Category = 'hormonal' | 'environmental' | 'sans' | 'thrombosis' | 'infection';
export type BodySystemId = 'neuro-ocular' | 'cardiovascular' | 'skeletal' | 'urogenital';

export interface AstronautProfile {
  id: string;
  userId: string;
  missionId: string | null;
  contraceptiveType: ContraceptiveType;
  baselineHRV: number;
  baselineTemp: number;
  baselineHeartRate: number;
  targetHydrationMl: number;
  missionEnvironment: MissionEnvironment;
}

export interface MissionInfo {
  id: string;
  name: string;
  startDate: string;
  targetBody: string;
  communicationLatencyMin: number;
}

export interface CabinTelemetry {
  id: string;
  timestamp: string;
  co2Level: number;
  o2Level: number;
  pressure: number;
  humidity: number;
  temperature: number;
  radiationLevel: number;
  source: string;
}

export interface BiometricReading {
  id: string;
  timestamp: string;
  heartRate: number;
  hrv: number;
  bodyTemp: number;
  oxygenSaturation: number;
  legEdemaScore: number;
  ocularPressureNote: 'normal' | 'elevated' | 'high';
  source: string;
}

export interface DailyCheckin {
  id: string;
  missionDay: number;
  pillTaken: boolean;
  hydrationLevel: 'low' | 'normal' | 'high';
  hydrationMl: number;
  exerciseMinutes: number;
  symptoms: string[];
  sleepHours: number | null;
  moodScore: number | null;
  vaginalPh: number | null;
  swabResult: 'normal' | 'candida_risk' | 'bv_risk' | 'uti_risk' | null;
  isPrivate: boolean;
  notes: string | null;
}

export interface RiskComponent {
  score: number;
  level: string;
  factors: string[];
  recommendation: string;
}

export interface VascularBoneBalance {
  thrombosis: RiskComponent & { level: 'low' | 'moderate' | 'high' | 'critical' };
  boneProtection: RiskComponent & { level: 'optimal' | 'moderate' | 'at-risk' };
  netBalanceSummary: string;
}

export interface HealthAlert {
  id: string;
  severity: Severity;
  category: Category;
  title: string;
  description: string;
  possibleCauses: string[];
  recommendedActions: string[];
  primaryCause: string;
  confidence: number;
  isAcknowledged: boolean;
  createdAt: string;
}

export interface HistoryPoint {
  missionDay: number;
  date: string;
  hrv: number;
  bodyTemp: number;
  heartRate: number;
  sleepHours: number;
  hydrationMl: number;
  exerciseMinutes: number;
}

export interface HeraDashboardData {
  profile: AstronautProfile | null;
  mission: MissionInfo | null;
  latestTelemetry: CabinTelemetry | null;
  latestBiometric: BiometricReading | null;
  latestCheckin: DailyCheckin | null;
  vascularBoneBalance: VascularBoneBalance;
  alerts: HealthAlert[];
  history: HistoryPoint[];
}

export type SimulationScenario =
  | 'nominal'
  | 'co2_spike_dehydration'
  | 'sans_precursor'
  | 'microbiome_immuno';