// ==============================================================================
// V.E.N.U.S. Clinical Telemetry Scenarios & Historical Log
// ==============================================================================

import { VitalMetrics } from '../types';

export const SCENARIO_NOMINAL: VitalMetrics = {
  heartRate: 68,
  bloodPressureSys: 118,
  bloodPressureDia: 76,
  spO2: 99,
  tempCelsius: 36.8,
  iopLeftEye: 14.2,
  iopRightEye: 14.6,
  jugularVeinVelocity: 22.4, // cm/s forward laminar flow
  hydrationDeficitPct: 4,
  estrogenLoadIndex: 42,
  dailyPillTaken: true,
  radiationCumulativeMSv: 114.2,
  cabinCO2mmHg: 2.1,
  cabinO2Pct: 20.9,
  vascularStasisIndex: 18,
};

export const SCENARIO_CAUTION_STASIS: VitalMetrics = {
  heartRate: 76,
  bloodPressureSys: 124,
  bloodPressureDia: 82,
  spO2: 98,
  tempCelsius: 37.0,
  iopLeftEye: 18.8,
  iopRightEye: 19.4,
  jugularVeinVelocity: 8.9, // sluggish flow, approaching stagnation
  hydrationDeficitPct: 18,  // noticeable hypovolemia
  estrogenLoadIndex: 65,
  dailyPillTaken: true,
  radiationCumulativeMSv: 114.3,
  cabinCO2mmHg: 2.3,
  cabinO2Pct: 20.8,
  vascularStasisIndex: 52,
};

export const SCENARIO_CRITICAL_EMERGENCY: VitalMetrics = {
  heartRate: 92,
  bloodPressureSys: 136,
  bloodPressureDia: 88,
  spO2: 97,
  tempCelsius: 37.3,
  iopLeftEye: 24.5, // SANS edema warning
  iopRightEye: 25.1,
  jugularVeinVelocity: 1.4, // Near-zero stagnation / Retrograde swirl detected!
  hydrationDeficitPct: 24,
  estrogenLoadIndex: 78,
  dailyPillTaken: false, // Disrupted timing
  radiationCumulativeMSv: 114.8,
  cabinCO2mmHg: 2.6, // CO2 is NOT the culprit -> True Vascular Pathology!
  cabinO2Pct: 20.7,
  vascularStasisIndex: 88,
};

export interface HistoricalTelemetryDay {
  day: number;
  vsi: number;
  jugularVelocity: number;
  iopAvg: number;
  hydrationDeficit: number;
  pillAdherence: boolean;
}

export const HISTORICAL_14_DAYS: HistoricalTelemetryDay[] = [
  { day: 129, vsi: 16, jugularVelocity: 24.2, iopAvg: 13.8, hydrationDeficit: 3, pillAdherence: true },
  { day: 130, vsi: 18, jugularVelocity: 23.5, iopAvg: 14.1, hydrationDeficit: 4, pillAdherence: true },
  { day: 131, vsi: 19, jugularVelocity: 22.8, iopAvg: 14.0, hydrationDeficit: 5, pillAdherence: true },
  { day: 132, vsi: 21, jugularVelocity: 21.4, iopAvg: 14.5, hydrationDeficit: 6, pillAdherence: true },
  { day: 133, vsi: 20, jugularVelocity: 22.0, iopAvg: 14.2, hydrationDeficit: 4, pillAdherence: true },
  { day: 134, vsi: 25, jugularVelocity: 19.5, iopAvg: 15.2, hydrationDeficit: 8, pillAdherence: true },
  { day: 135, vsi: 28, jugularVelocity: 18.0, iopAvg: 15.8, hydrationDeficit: 10, pillAdherence: true },
  { day: 136, vsi: 34, jugularVelocity: 15.2, iopAvg: 16.5, hydrationDeficit: 12, pillAdherence: true },
  { day: 137, vsi: 38, jugularVelocity: 14.0, iopAvg: 17.1, hydrationDeficit: 14, pillAdherence: true },
  { day: 138, vsi: 44, jugularVelocity: 11.5, iopAvg: 18.0, hydrationDeficit: 16, pillAdherence: true },
  { day: 139, vsi: 52, jugularVelocity: 8.9,  iopAvg: 19.1, hydrationDeficit: 18, pillAdherence: true },
  { day: 140, vsi: 61, jugularVelocity: 6.2,  iopAvg: 21.0, hydrationDeficit: 20, pillAdherence: true },
  { day: 141, vsi: 74, jugularVelocity: 3.5,  iopAvg: 23.2, hydrationDeficit: 22, pillAdherence: false },
  { day: 142, vsi: 88, jugularVelocity: 1.4,  iopAvg: 24.8, hydrationDeficit: 24, pillAdherence: false },
];
