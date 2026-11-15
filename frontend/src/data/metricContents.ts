export interface MetricContent {
  id: string;
  title: string;
  acronym: string;
  acronymDefinition: string;
  whatIsIt: string;
  whyItMatters: string;
  actionSteps: {
    text: string;
    actionLabel?: string;
    actionType?: 'water' | 'pill' | 'triage' | 'breath';
  }[];
}

export const ACRONYM_GLOSSARY: Record<string, string> = {
  VTE: 'Venous Thromboembolism (Blood Clot Risk)',
  SANS: 'Spaceflight-Associated Neuro-Ocular Syndrome',
  BMD: 'Bone Mineral Density',
  ARED: 'Advanced Resistive Exercise Device',
  ECLSS: 'Environmental Control and Life Support System',
  OCP: 'Oral Contraceptive Pill',
};

export const METRIC_LEARN_MORE_CONTENT: Record<string, MetricContent> = {
  thrombosis: {
    id: 'thrombosis',
    title: 'Blood Clot Risk (VTE)',
    acronym: 'VTE',
    acronymDefinition: ACRONYM_GLOSSARY.VTE,
    whatIsIt: 'The likelihood of developing abnormal blood clots in your deep veins due to slowed circulation.',
    whyItMatters: 'In weightlessness (0g), bodily fluids shift upward toward your head, causing blood flow in your legs to slow down. Combined with mission medications like OCPs, this increases the risk of clot formation.',
    actionSteps: [
      { text: 'Perform 10 minutes of lower-body dynamic stretching or in-place calf pumps.' },
      { text: 'Log an extra 250 ml of water to maintain optimal blood viscosity.', actionLabel: 'Log Water (+250ml)', actionType: 'water' },
    ],
  },
  sans_co2: {
    id: 'sans_co2',
    title: 'Neuro-Ocular & Cabin Pressure (SANS)',
    acronym: 'SANS',
    acronymDefinition: ACRONYM_GLOSSARY.SANS,
    whatIsIt: 'Changes in vision and fluid pressure around the optic nerves caused by microgravity headward fluid shift combined with localized cabin carbon dioxide pockets.',
    whyItMatters: 'Without gravity pulling fluids downward, constant cranial pressure can subtly alter your visual acuity and cause mission headaches.',
    actionSteps: [
      { text: 'Perform a 20-second Amsler visual grid check.' },
      { text: 'Check cabin ECLSS airflow and ventilation status.', actionLabel: 'Open Triage', actionType: 'triage' },
    ],
  },
  bone_shield: {
    id: 'bone_shield',
    title: 'Bone Mineral Protection (BMD)',
    acronym: 'BMD',
    acronymDefinition: ACRONYM_GLOSSARY.BMD,
    whatIsIt: 'The measurement of calcium and structural density remaining in your skeletal system.',
    whyInMatters: 'Without gravity load, bones naturally reabsorb minerals faster, leading to potential demineralization over long missions.',
    actionSteps: [
      { text: 'Complete your scheduled 60-minute resistive loading session on the ARED.' },
      { text: 'Verify daily intake of Vitamin D3 and Calcium supplements.' },
    ],
  },
  microbiome_ph: {
    id: 'microbiome_ph',
    title: 'Urogenital Flora & pH Balance',
    acronym: 'OCP',
    acronymDefinition: ACRONYM_GLOSSARY.OCP,
    whatIsIt: 'The natural chemical and bacterial balance protecting your urogenital tract.',
    whyItMatters: 'Continuous OCP use combined with closed-habitat spaceflight immune modulation can alter natural acidity levels.',
    actionSteps: [
      { text: 'Log your weekly colorimetric pH strip result into the encrypted private vault.' },
      { text: 'Confirm your continuous daily hormonal regimen adherence.', actionLabel: 'Toggle Regimen Pill', actionType: 'pill' },
    ],
  },
};