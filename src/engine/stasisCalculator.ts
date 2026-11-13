// ==============================================================================
// V.E.N.U.S. Deterministic Stasis & Neuro-Vascular Engine
// Implements Class-A deterministic rules based on NASA HRP spaceflight clinical data
// ==============================================================================

import { VitalMetrics, TriageLevel } from '../types';

/**
 * Calculates Vascular Stasis Index (VSI) in a 0 - 100 scale:
 * 
 * VSI = f(estrogenLoad, hydrationDeficit, microgravityDuration, jugularVelocity)
 * 
 * Clinical basis:
 * Microgravity causes cephalad fluid shift. Hormonal suppression increases venous
 * pro-thrombotic tendency. Dehydration increases blood viscosity. 
 * If internal jugular flow drops below 8 cm/s or becomes retrograde (< 0),
 * risk of thrombosis and intracranial hypertension spikes.
 */
export function calculateVascularStasisIndex(metrics: VitalMetrics, missionDay: number): number {
  // Base velocity penalty: 25 cm/s is nominal forward flow in 1G
  const velocity = metrics.jugularVeinVelocity;
  let velocityFactor = 0;
  
  if (velocity <= 0) {
    // Retrograde or stagnant flow! Highest thrombosis indicator (NEJM 2020)
    velocityFactor = 45;
  } else if (velocity < 8) {
    velocityFactor = 35 + (8 - velocity) * 1.25;
  } else if (velocity < 15) {
    velocityFactor = 20 + (15 - velocity) * 1.5;
  } else {
    velocityFactor = Math.max(0, 15 - velocity * 0.4);
  }

  // Estrogen/Progestin oral load factor (oral contraceptives increase hypercoagulability)
  const estrogenFactor = (metrics.estrogenLoadIndex / 100) * 22;

  // Hydration deficit factor (hypovolemia / hemoconcentration)
  const hydrationFactor = (metrics.hydrationDeficitPct / 100) * 24;

  // Spaceflight duration factor (cumulative endothelial and venous valve remodeling)
  const durationFactor = Math.min(10, (missionDay / 300) * 10);

  const rawScore = velocityFactor + estrogenFactor + hydrationFactor + durationFactor;
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}

/**
 * Deterministic Differential Triage Evaluator
 */
export function evaluateTriageStatus(metrics: VitalMetrics, vsi: number): {
  status: TriageLevel;
  primaryAlert: string;
  recommendedAction: string;
} {
  const maxIOP = Math.max(metrics.iopLeftEye, metrics.iopRightEye);

  // Critical Thrombus check: Stagnant/retrograde flow + high VSI
  if (metrics.jugularVeinVelocity <= 2.0 || vsi >= 75) {
    return {
      status: 'CRITICAL_THROMBUS',
      primaryAlert: 'CRITICAL: Severe Internal Jugular Vein (IJV) Stasis / Thromboembolism Hazard',
      recommendedAction: 'Deploy Butterfly iQ ultrasound probe to cervical triangle. Prepare SubQ Enoxaparin.',
    };
  }

  // Warning SANS: Elevated Intraocular Pressure + Papilledema risk
  if (maxIOP >= 22 || (maxIOP >= 20 && metrics.cabinCO2mmHg < 3.5)) {
    return {
      status: 'WARNING_SANS',
      primaryAlert: 'WARNING: Spaceflight Associated Neuro-ocular Syndrome (SANS) Escalation',
      recommendedAction: 'Initiate 40 min Lower Body Negative Pressure (LBNP) session at -35 mmHg.',
    };
  }

  // Caution Stasis: Elevated VSI or Mild dehydration + altered jugular flow
  if (vsi >= 45 || metrics.hydrationDeficitPct >= 12 || metrics.jugularVeinVelocity < 12) {
    return {
      status: 'CAUTION_STASIS',
      primaryAlert: 'CAUTION: Moderate Venous Stasis & Fluid Shift',
      recommendedAction: 'Administer 500 mL electrolyte rehydration. Verify hormonal timing.',
    };
  }

  return {
    status: 'NOMINAL',
    primaryAlert: 'NOMINAL: Neuro-Endocrine & Vascular Telemetry within Safe Thresholds',
    recommendedAction: 'Continue scheduled ARED resistive training and daily oral cycle regimen.',
  };
}
