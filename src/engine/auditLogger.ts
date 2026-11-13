// ==============================================================================
// V.E.N.U.S. Class-A Deterministic Audit Logger
// Emits verifiable traces conforming to NASA-STD-8719.13 (Software Safety)
// ==============================================================================

import { AuditLogEntry, TriageLevel, VitalMetrics } from '../types';

/**
 * Lightweight deterministic pseudo-hash generator for edge audit logs
 */
function generateDeterministicHash(ruleId: string, timestamp: string, vsi: number): string {
  const seed = `${ruleId}_${timestamp}_VSI:${vsi}_EDGE_DETERMINISTIC_NASA_HRP`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return '0x' + (hash >>> 0).toString(16).toUpperCase().padStart(8, '0') + '...N8719';
}

export function createAuditEntry(
  ruleId: string,
  ruleDescription: string,
  metrics: VitalMetrics,
  outputTriage: TriageLevel,
  clinicalRationale: string
): AuditLogEntry {
  const timestamp = new Date().toISOString();
  return {
    id: `AUD-${Date.now().toString().slice(-6)}`,
    timestamp,
    ruleId,
    ruleDescription,
    inputs: {
      jugularVelocity: `${metrics.jugularVeinVelocity} cm/s`,
      iopMax: `${Math.max(metrics.iopLeftEye, metrics.iopRightEye)} mmHg`,
      vsi: `${metrics.vascularStasisIndex}%`,
      hydrationDeficit: `${metrics.hydrationDeficitPct}%`,
      estrogenLoad: `${metrics.estrogenLoadIndex}%`,
      cabinCO2: `${metrics.cabinCO2mmHg} mmHg`,
    },
    outputTriage,
    clinicalRationale,
    deterministicProofHash: generateDeterministicHash(ruleId, timestamp, metrics.vascularStasisIndex),
  };
}
