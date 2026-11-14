import type { MissionEnvironment } from './thrombosisCalculator';

export interface DiagnosticInput {
  symptoms: string[];
  co2Level: number;
  o2Level: number;
  pillTaken: boolean;
  contraceptiveType: 'combined' | 'progestin-only' | 'none';
  hydrationLevel: 'low' | 'normal' | 'high';
  hydrationMl?: number;
  hrv?: number;
  baselineHRV?: number;
  oxygenSaturation?: number;
  legEdemaScore?: number;
  ocularPressureNote?: string;
  vaginalPh?: number;
  swabResult?: string;
  daysInMission: number;
  missionEnvironment?: MissionEnvironment;
}

export interface DiagnosticResult {
  alerts: AlertCandidate[];
}

export interface AlertCandidate {
  severity: 'info' | 'warning' | 'critical';
  category: 'hormonal' | 'environmental' | 'sans' | 'thrombosis' | 'infection';
  title: string;
  description: string;
  possibleCauses: string[];
  recommendedActions: string[];
  primaryCause: string;
  confidence: number;
}

function has(symptoms: string[], ...targets: string[]): boolean {
  return targets.every((t) => symptoms.includes(t));
}

function hasAny(symptoms: string[], ...targets: string[]): boolean {
  return targets.some((t) => symptoms.includes(t));
}

export function runDifferentialDiagnosis(input: DiagnosticInput): DiagnosticResult {
  const alerts: AlertCandidate[] = [];
  const {
    symptoms,
    co2Level,
    o2Level,
    pillTaken,
    contraceptiveType,
    hydrationLevel,
    hydrationMl,
    hrv,
    baselineHRV,
    legEdemaScore,
    ocularPressureNote,
    vaginalPh,
    swabResult,
    daysInMission,
    missionEnvironment = 'transit-0g',
  } = input;

  const isDehydrated =
    hydrationLevel === 'low' || (hydrationMl !== undefined && hydrationMl < 1800);

  if (co2Level > 1.0) {
    alerts.push({
      severity: 'critical',
      category: 'environmental',
      title: 'Critical Cabin CO2: Ventilate or Relocate Module',
      description: `Cabin CO2 reached ${co2Level.toFixed(2)}% (above safe ceiling). Neurological symptoms are driven by acute hypercapnia, not oral contraceptives.`,
      possibleCauses: [
        'Primary CO2 scrubber saturation',
        'Localized stagnant air pocket in microgravity',
        'Elevated crew metabolic output',
      ],
      recommendedActions: [
        'Engage backup CO2 scrubber loop immediately',
        'Maximize inter-module ventilation airflow',
        'Relocate to ventilated adjacent module',
        'Alert Mission Control ECLSS desk',
      ],
      primaryCause: 'co2_elevation_critical',
      confidence: 95,
    });
  } else if (co2Level > 0.5) {
    const environmentalSymptomMatch = hasAny(symptoms, 'headache', 'nausea');
    alerts.push({
      severity: 'warning',
      category: 'environmental',
      title: 'Anti-Bias Differential: Cabin CO2 Buildup vs. Estrogen Effect',
      description: `Cabin CO2 is elevated at ${co2Level.toFixed(2)}%. Despite active oral contraceptive use, headache/nausea is primarily driven by localized CO2 retention rather than pill side effects.`,
      possibleCauses: [
        '68% — Localized cabin CO2 accumulation (low 0g convection)',
        '22% — Exogenous estrogen absorption adjustment',
        '10% — Early Spaceflight-Associated Neuro-ocular Syndrome (SANS)',
      ],
      recommendedActions: [
        'Verify local cabin airflow diffuser and CO2 scrubber status',
        'Ingest 400 ml water with balanced electrolytes',
        'Re-evaluate neurological symptoms in 30 min before attributing to OCP',
      ],
      primaryCause: 'co2_elevation_warning',
      confidence: environmentalSymptomMatch ? 86 : 72,
    });
  }

  if (o2Level < 19.5) {
    alerts.push({
      severity: 'critical',
      category: 'environmental',
      title: 'Hypoxia Alert: Cabin O2 Below Safe Threshold',
      description: `Cabin oxygen dropped to ${o2Level.toFixed(2)}% (< 19.5%). Immediate hypoxia risk.`,
      possibleCauses: ['O2 generation fault', 'Module pressure drop'],
      recommendedActions: [
        'Activate supplemental O2 reserve',
        'Don emergency oxygen mask',
        'Initiate cabin pressure equalization protocol',
      ],
      primaryCause: 'hypoxia',
      confidence: 96,
    });
  }

  if (
    has(symptoms, 'headache', 'vision_blur') &&
    (ocularPressureNote === 'elevated' || ocularPressureNote === 'high') &&
    daysInMission > 30
  ) {
    alerts.push({
      severity: 'warning',
      category: 'sans',
      title: 'SANS Precursor Detected (Neuro-Ocular Fluid Shift)',
      description:
        'Headache + blurred vision + elevated intraocular pressure beyond Mission Day 30 indicates cephalad fluid shift (SANS), ruling out simple hormonal migraine.',
      possibleCauses: [
        '74% — Microgravity cephalad fluid redistribution (SANS)',
        '18% — Elevated intracranial pressure / optic disc edema',
        '8% — Hormonal vascular reactivity',
      ],
      recommendedActions: [
        'Perform onboard OCT / ocular ultrasound within 24 hours',
        'Apply lower-body thigh cuffs per fluid-shift protocol',
        'Compile compressed telemetry packet for Flight Surgeon',
      ],
      primaryCause: 'sans_precursor',
      confidence: 84,
    });
  } else if (has(symptoms, 'headache', 'vision_blur') && daysInMission > 60) {
    alerts.push({
      severity: 'info',
      category: 'sans',
      title: 'Neuro-Ocular Watch (SANS) Beyond Mission Day 60',
      description:
        'Visual blur paired with headache past Day 60 warrants ruling out SANS rather than assuming hormonal side effects.',
      possibleCauses: ['Microgravity fluid shift', 'Operational visual strain'],
      recommendedActions: [
        'Complete Amsler grid visual acuity check',
        'Log intraocular pressure reading',
      ],
      primaryCause: 'sans_possible',
      confidence: 68,
    });
  }

  if (
    hasAny(symptoms, 'headache', 'nausea') &&
    pillTaken &&
    co2Level <= 0.5 &&
    o2Level >= 19.5 &&
    ocularPressureNote !== 'elevated' &&
    ocularPressureNote !== 'high'
  ) {
    alerts.push({
      severity: 'info',
      category: 'hormonal',
      title: 'Likely Hormonal Adjustment (Cabin & Ocular Telemetry Nominal)',
      description:
        'With cabin CO2, O2, and ocular pressure verified nominal, current symptoms align with endocrine adaptation in microgravity.',
      possibleCauses: [
        '74% — Exogenous estrogen/progestin plasma peak',
        '26% — Delayed gastric emptying in microgravity',
      ],
      recommendedActions: [
        'Take daily pill alongside solid nutrition',
        'Ingest 500 ml water over the next 2 hours',
        'Re-assess symptom trend at next check-in',
      ],
      primaryCause: 'ocp_side_effect',
      confidence: 74,
    });
  }

  if (
    has(symptoms, 'leg_swelling', 'leg_pain') &&
    contraceptiveType === 'combined' &&
    (isDehydrated || (legEdemaScore !== undefined && legEdemaScore > 1) || missionEnvironment === 'eva-prep')
  ) {
    alerts.push({
      severity: 'critical',
      category: 'thrombosis',
      title: 'High VTE Risk: Combined OCP + Venous Stasis + Dehydration',
      description:
        'Combined estrogen regimen paired with lower-limb pain/swelling and hemoconcentration elevates deep vein thrombosis risk.',
      possibleCauses: [
        'Microgravity venous stasis',
        'Estrogen-mediated hypercoagulability',
        'Dehydration hemoconcentration',
      ],
      recommendedActions: [
        'Perform guided jugular & femoral Doppler ultrasound now',
        'Initiate aggressive electrolyte hydration protocol',
        'Defer EVA activity pending Flight Surgeon review',
        'Transmit priority medical packet to Ground',
      ],
      primaryCause: 'dvt_risk_critical',
      confidence: 91,
    });
  } else if (has(symptoms, 'leg_swelling') && contraceptiveType === 'combined') {
    alerts.push({
      severity: 'warning',
      category: 'thrombosis',
      title: 'Vascular Watch: Lower-Limb Edema on Combined Regimen',
      description:
        'Reported swelling under estrogen-containing regimen requires proactive venous return monitoring.',
      possibleCauses: ['0g fluid redistribution', 'Estrogenic fluid retention'],
      recommendedActions: [
        'Measure calf circumference every 12 hours',
        'Perform ankle flexion/extension pump exercises every 2 hours',
        'Maintain hydration >= 2.5 L/day',
      ],
      primaryCause: 'dvt_risk_warning',
      confidence: 72,
    });
  }

  const immunoSuppressed =
    (hrv !== undefined && baselineHRV !== undefined && hrv < baselineHRV * 0.78) ||
    daysInMission > 30;
  const elevatedPh = vaginalPh !== undefined && vaginalPh > 4.5;
  const abnormalSwab = swabResult === 'candida_risk' || swabResult === 'bv_risk' || swabResult === 'uti_risk';

  if (
    hasAny(symptoms, 'burning_urination', 'frequent_urination', 'vaginal_itching') ||
    elevatedPh ||
    abnormalSwab
  ) {
    const isUti = hasAny(symptoms, 'burning_urination', 'frequent_urination') || swabResult === 'uti_risk';
    alerts.push({
      severity: isUti || abnormalSwab ? 'warning' : 'info',
      category: 'infection',
      title: isUti
        ? 'Urogenital Alert: Elevated UTI Risk in Closed Habitat'
        : 'Microbiome Alert: Urogenital Flora & pH Shift Detected',
      description: `Cross-analysis of ${elevatedPh ? `elevated pH (${vaginalPh})` : 'intimate symptoms'} with ${immunoSuppressed ? 'spaceflight immune modulation' : 'continuous hormonal regimen'}.`,
      possibleCauses: [
        'Microbiome shift from continuous OCP + spaceflight immune modulation',
        'Altered bladder voiding dynamics & urine concentration in 0g',
        'Opportunistic flora imbalance in closed spacecraft environment',
      ],
      recommendedActions: [
        'Start targeted Lactobacillus probiotic supplementation',
        'Increase daily hydration by +600 ml for urinary dilution',
        isUti
          ? 'Run urine dipstick test and review onboard prophylactic protocol'
          : 'Repeat pH strip & swab check in 48 hours',
      ],
      primaryCause: isUti ? 'uti_suspected' : 'microbiome_imbalance',
      confidence: abnormalSwab ? 88 : 77,
    });
  }

  if (hrv !== undefined && baselineHRV !== undefined && hrv < baselineHRV * 0.72) {
    alerts.push({
      severity: 'info',
      category: 'hormonal',
      title: 'HRV Below Her Calibrated Endocrine Baseline',
      description: `Current HRV (${hrv} ms) is >28% below her calibrated reference (${baselineHRV} ms), indicating autonomic fatigue or circadian disruption.`,
      possibleCauses: [
        'Orbital light-cycle sleep debt',
        'Operational workload or mild dehydration',
        'Neuro-endocrine adaptation',
      ],
      recommendedActions: [
        'Engage warm-spectrum cabin lighting 90 min prior to sleep shift',
        'Verify hydration target and next-shift physical load',
      ],
      primaryCause: 'hrv_suppression',
      confidence: 65,
    });
  }

  return { alerts };
}