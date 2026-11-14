export type MissionEnvironment = 'transit-0g' | 'orbital-station' | 'lunar-base' | 'eva-prep';

export interface ThrombosisInput {
  contraceptiveType: 'combined' | 'progestin-only' | 'none';
  hydrationLevel: 'low' | 'normal' | 'high';
  hydrationMl?: number;
  exerciseMinutes?: number;
  legEdemaScore: number;
  daysInMission: number;
  hrv?: number;
  baselineHRV?: number;
  missionEnvironment?: MissionEnvironment;
}

export interface ThrombosisResult {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
  recommendation: string;
}

export interface BoneProtectionResult {
  score: number;
  level: 'optimal' | 'moderate' | 'at-risk';
  factors: string[];
  recommendation: string;
}

export interface VascularBoneBalanceResult {
  thrombosis: ThrombosisResult;
  boneProtection: BoneProtectionResult;
  netBalanceSummary: string;
}

export function calculateThrombosisRisk(input: ThrombosisInput): ThrombosisResult {
  const {
    contraceptiveType,
    hydrationLevel,
    hydrationMl,
    legEdemaScore,
    daysInMission,
    hrv,
    baselineHRV,
    missionEnvironment = 'transit-0g',
  } = input;

  let score = 0;
  const factors: string[] = [];

  if (contraceptiveType === 'combined') {
    score += 35;
    factors.push('Combined OCP regimen (+35): exogenous estrogen elevates clotting factors and requires venous monitoring in 0g.');
  } else if (contraceptiveType === 'progestin-only') {
    score += 10;
    factors.push('Progestin-only regimen (+10): lower prothrombotic profile compared to estrogen-containing pills.');
  }

  const effectiveHydration =
    hydrationMl !== undefined
      ? hydrationMl < 1800
        ? 'low'
        : hydrationMl >= 2500
          ? 'high'
          : 'normal'
      : hydrationLevel;

  if (effectiveHydration === 'low') {
    score += 20;
    factors.push('Suboptimal hydration (+20): hemoconcentration increases blood viscosity in microgravity.');
  } else if (effectiveHydration === 'high') {
    score -= 8;
    factors.push('Optimal hydration (-8): preserves plasma volume and offsets estrogen-driven venous stasis.');
  }

  if (missionEnvironment === 'eva-prep') {
    score += 10;
    factors.push('Pre/Post-EVA protocol (+10): suit-induced dehydration and pressure shifts increase vascular load.');
  } else if (missionEnvironment === 'lunar-base') {
    score -= 5;
    factors.push('Lunar partial gravity (-5): 1/6g provides mild hydrostatic support for venous return.');
  }

  if (legEdemaScore === 1) {
    score += 15;
    factors.push('Grade 1 lower-limb edema (+15): early sign of sluggish venous return.');
  } else if (legEdemaScore === 2) {
    score += 25;
    factors.push('Grade 2 lower-limb edema (+25): significant peripheral venous stasis.');
  } else if (legEdemaScore >= 3) {
    score += 35;
    factors.push('Grade 3 lower-limb edema (+35): critical risk of venous thromboembolism (VTE).');
  }

  if (daysInMission > 180) {
    score += 15;
    factors.push(`Mission Day ${daysInMission} > 180 (+15): prolonged microgravity vascular remodeling.`);
  } else if (daysInMission > 90) {
    score += 10;
    factors.push(`Mission Day ${daysInMission} > 90 (+10): sustained alteration of venous tone.`);
  } else if (daysInMission > 30) {
    score += 5;
    factors.push(`Mission Day ${daysInMission} > 30 (+5): active cephalad fluid shift phase.`);
  }

  if (hrv !== undefined && baselineHRV !== undefined && hrv < baselineHRV * 0.75) {
    score += 10;
    factors.push(`HRV (${hrv} ms) < 75% of calibrated baseline (${baselineHRV} ms) (+10): autonomic and circulatory strain.`);
  }

  const clampedScore = Math.max(0, Math.min(100, score));
  let level: ThrombosisResult['level'];
  let recommendation: string;

  if (clampedScore >= 75) {
    level = 'critical';
    recommendation =
      'CRITICAL: Perform guided jugular & femoral Doppler ultrasound immediately. Initiate electrolyte rehydration protocol and transmit priority telemetry packet to Flight Surgeon.';
  } else if (clampedScore >= 50) {
    level = 'high';
    recommendation =
      'ELEVATED RISK: Increase fluid intake to 2.8 L/day with electrolytes, perform 10-min calf-pump exercises every 2 hours, and schedule onboard Doppler check.';
  } else if (clampedScore >= 25) {
    level = 'moderate';
    recommendation =
      'WATCH: Maintain hydration >= 2.5 L/day to counterbalance estrogenic load in 0g and complete daily venous return mobility.';
  } else {
    level = 'low';
    recommendation =
      'NOMINAL: Current hydration and physical activity effectively counterbalance your hormonal profile in microgravity.';
  }

  return { score: clampedScore, level, factors, recommendation };
}

export function calculateVascularBoneBalance(input: ThrombosisInput): VascularBoneBalanceResult {
  const thrombosis = calculateThrombosisRisk(input);
  const {
    contraceptiveType,
    exerciseMinutes = 60,
    daysInMission,
    missionEnvironment = 'transit-0g',
  } = input;

  let boneScore = 50;
  const boneFactors: string[] = [];

  if (contraceptiveType === 'combined') {
    boneScore += 25;
    boneFactors.push('Active exogenous estrogen (+25): attenuates microgravity-induced osteoclastic bone resorption.');
  } else if (contraceptiveType === 'progestin-only') {
    boneScore += 5;
    boneFactors.push('Estrogen-free regimen (+5): lower osteoprotective buffer; relies heavily on mechanical loading.');
  } else {
    boneScore -= 10;
    boneFactors.push('No hormonal osteoprotection (-10): higher vulnerability to trabecular bone loss in 0g.');
  }

  if (exerciseMinutes >= 60) {
    boneScore += 25;
    boneFactors.push(`Resistive training (${exerciseMinutes} min/day) (+25): optimal ARED mechanical stimulus.`);
  } else if (exerciseMinutes >= 30) {
    boneScore += 10;
    boneFactors.push(`Moderate resistive load (${exerciseMinutes} min/day) (+10): reach 60 min/day for full skeletal protection.`);
  } else {
    boneScore -= 15;
    boneFactors.push(`Low mechanical loading (${exerciseMinutes} min/day) (-15): accelerated bone mineral density loss risk.`);
  }

  if (missionEnvironment === 'lunar-base') {
    boneScore += 10;
    boneFactors.push('Lunar surface gravity (+10): partial axial weight-bearing support.');
  } else if (daysInMission > 90) {
    boneScore -= 10;
    boneFactors.push(`Extended mission day ${daysInMission} (-10): cumulative 1.0-1.5%/month bone loss pressure without countermeasures.`);
  }

  const clampedBone = Math.max(0, Math.min(100, boneScore));
  let boneLevel: BoneProtectionResult['level'];
  let boneRec: string;

  if (clampedBone >= 70) {
    boneLevel = 'optimal';
    boneRec = 'Optimal skeletal protection: synergy between your hormonal profile and resistive loading preserves bone density.';
  } else if (clampedBone >= 45) {
    boneLevel = 'moderate';
    boneRec = 'Moderate protection: complete 60 min/day on Advanced Resistive Exercise Device (ARED) plus Vitamin D3 & Calcium.';
  } else {
    boneLevel = 'at-risk';
    boneRec = 'Demineralization alert: prioritize lower-body & spinal resistive loading protocol and verify Vitamin D intake.';
  }

  const netBalanceSummary =
    contraceptiveType === 'combined'
      ? `Combined regimen provides strong bone protection (${clampedBone}/100); sustain optimal hydration to keep vascular VTE risk ${thrombosis.level.toUpperCase()} (${thrombosis.score}/100).`
      : `Estrogen-free regimen keeps thrombotic risk low (${thrombosis.score}/100); reinforce daily resistive exercise to sustain bone protection (${clampedBone}/100).`;

  return {
    thrombosis,
    boneProtection: {
      score: clampedBone,
      level: boneLevel,
      factors: boneFactors,
      recommendation: boneRec,
    },
    netBalanceSummary,
  };
}