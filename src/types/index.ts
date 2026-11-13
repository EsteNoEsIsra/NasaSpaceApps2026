// ==============================================================================
// V.E.N.U.S. Data Types & Interfaces
// NASA Space Apps Challenge 2026
// ==============================================================================

export type TriageLevel = 'NOMINAL' | 'CAUTION_STASIS' | 'WARNING_SANS' | 'CRITICAL_THROMBUS';

export type BodyLayer = 'ALL' | 'VASCULAR' | 'OCULAR' | 'ENDOCRINE';

export interface VitalMetrics {
  heartRate: number;              // bpm (normal 60-85)
  bloodPressureSys: number;       // mmHg (normal 110-125)
  bloodPressureDia: number;       // mmHg (normal 70-80)
  spO2: number;                   // % (normal 97-100)
  tempCelsius: number;            // °C (normal 36.5 - 37.2)
  iopLeftEye: number;             // Intraocular Pressure mmHg (normal 12-18, >21 danger)
  iopRightEye: number;            // Intraocular Pressure mmHg
  jugularVeinVelocity: number;    // cm/s (normal forward flow 15-35 cm/s; <5 cm/s = stasis; <0 = retrograde)
  hydrationDeficitPct: number;    // % deficit (0% = optimal, >15% high risk)
  estrogenLoadIndex: number;      // 0-100 scale (progestin/estradiol active load)
  dailyPillTaken: boolean;        // Hormonal cycle suppression adherence
  radiationCumulativeMSv: number; // mSv accumulated in transit
  cabinCO2mmHg: number;           // Cabin CO2 in mmHg (normal < 3.0 mmHg)
  cabinO2Pct: number;             // Cabin O2 % (nominal 20.9%)
  vascularStasisIndex: number;    // VSI 0-100% computed deterministically
}

export interface AstronautProfile {
  id: string;
  name: string;
  callsign: string;
  role: string;
  mission: string;
  transitDestination: string;
  missionDay: number;
  age: number;
  bloodType: string;
  hormonalRegimen: string;
  nextScheduledDose: string;
  hoursSleptLastNight: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  ruleId: string;
  ruleDescription: string;
  inputs: Record<string, number | string | boolean>;
  outputTriage: TriageLevel;
  clinicalRationale: string;
  deterministicProofHash: string; // Simulated SHA-256 for Class-A audit
}

export interface CountermeasureStep {
  stepNumber: number;
  title: string;
  detail: string;
  actionRequired?: string;
}

export interface CountermeasureProtocol {
  id: string;
  title: string;
  category: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION';
  urgency: 'ROUTINE' | 'ELEVATED' | 'IMMEDIATE';
  targetSystem: string;
  rationale: string;
  steps: CountermeasureStep[];
}
