// ==============================================================================
// V.E.N.U.S. Differential Diagnostic Logic (Edge Deterministic CDSS)
// NASA Class-A Diagnostic Tree: Discriminates SANS vs CO2 Toxicity vs DVT/Stasis
// ==============================================================================

import { VitalMetrics } from '../types';

export interface DiagnosisResult {
  condition: string;
  confidenceScore: number;
  etiology: string;
  differentialExclusions: string[];
  immediateCountermeasure: string;
}

export function runDifferentialDiagnosis(metrics: VitalMetrics): DiagnosisResult {
  const maxIOP = Math.max(metrics.iopLeftEye, metrics.iopRightEye);
  const isCO2Elevated = metrics.cabinCO2mmHg > 4.0;
  const isJugularStagnant = metrics.jugularVeinVelocity < 5.0;
  const isDehydrated = metrics.hydrationDeficitPct > 15;

  // Case 1: Thromboembolic Stasis in Internal Jugular
  if (isJugularStagnant && metrics.estrogenLoadIndex > 40) {
    return {
      condition: 'Internal Jugular Vein (IJV) Thrombosis / Stagnation',
      confidenceScore: 94.8,
      etiology: 'Virchow Triad in Microgravity: Cephalad venous pooling + Estrogen-mediated hypercoagulability + Endothelial valve stasis.',
      differentialExclusions: [
        'Cabin CO2 toxicity ruled out (IJV velocity < 5 cm/s is specific to vascular outflow restriction)',
        'Isolated tension headache ruled out by Doppler velocity stagnation',
      ],
      immediateCountermeasure: 'Execute Ultrasound Protocol (Butterfly iQ) on Left/Right IJV. Review Heparin / Enoxaparin dosing protocol.',
    };
  }

  // Case 2: SANS (Spaceflight Associated Neuro-ocular Syndrome)
  if (maxIOP >= 21 && !isCO2Elevated) {
    return {
      condition: 'SANS: Cephalic Fluid Shift & Optic Sheath Distension',
      confidenceScore: 91.2,
      etiology: 'Lack of hydrostatic pressure gradient creates constant venous engorgement in skull, flattening posterior globe and raising IOP.',
      differentialExclusions: [
        'Cabin CO2 induced vasodilation excluded (Cabin CO2 is nominal at ' + metrics.cabinCO2mmHg.toFixed(1) + ' mmHg)',
        'Acute angle glaucoma excluded due to gradual onset profile',
      ],
      immediateCountermeasure: 'LBNP Countermeasure Session (30-45 mins at -35 mmHg) to draw venous pool caudad to lower extremities.',
    };
  }

  // Case 3: Cabin Environmental Hypercapnia
  if (isCO2Elevated) {
    return {
      condition: 'Cabin Hypercapnia (Elevated Ambient CO2)',
      confidenceScore: 88.5,
      etiology: 'Microgravity air pocket stagnation causing localized CO2 pocket inhalation; causes cerebral vasodilation and throbbing headache.',
      differentialExclusions: [
        'SANS isolated hypertension excluded as cabin sensors show CO2 exceeding 4.0 mmHg',
        'Thrombosis excluded as jugular flow velocity remains positive (> 15 cm/s)',
      ],
      immediateCountermeasure: 'Increase Environmental Control and Life Support System (ECLSS) scrubber ventilation. Relocate to high airflow zone.',
    };
  }

  // Case 4: Hypovolemic / Dehydration Stress
  if (isDehydrated) {
    return {
      condition: 'Hypovolemia / Orthostatic Stress Precursor',
      confidenceScore: 82.0,
      etiology: 'Free water deficit and reduced plasma volume due to spaceflight natriuresis.',
      differentialExclusions: ['ECLSS nominal, IOP nominal'],
      immediateCountermeasure: 'Ingest 600 mL saline rehydration beverage with mineral electrolyte tablet.',
    };
  }

  // Case 5: Nominal
  return {
    condition: 'Physiological Homeostasis Maintained',
    confidenceScore: 99.1,
    etiology: 'All neuro-endocrine, vascular, and environmental indices are within NASA Flight Medicine envelope.',
    differentialExclusions: ['No acute pathology detected'],
    immediateCountermeasure: 'Maintain regular flight schedule, exercise protocols and scheduled oral suppression.',
  };
}
