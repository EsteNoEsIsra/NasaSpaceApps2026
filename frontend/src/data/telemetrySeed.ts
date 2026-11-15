// frontend/src/data/telemetrySeed.ts

export const SCENARIOS: Record<string, MissionScenario> = {
  gateway: {
    id: 'gateway',
    name: 'Nominal Baseline (Lunar Gateway)',
    latencySeconds: 2.6,
    latencyLabel: '2.6s (Round trip)',
    eclssCo2Percent: 0.41,
    eclssO2Percent: 21.1,
    severities: {
      'neuro-ocular': 'info',
      'cardiovascular': 'info',
      'skeletal': 'info',
      'urogenital': 'info',
    },
  },
  co2_spike_dehydration: {
    id: 'co2_spike_dehydration',
    name: 'Sim: CO₂ Spike + Dehydration',
    latencySeconds: 2.6,
    latencyLabel: '2.6s (Round trip)',
    eclssCo2Percent: 1.15,
    eclssO2Percent: 19.5,
    severities: {
      'neuro-ocular': 'critical', // ¡ROJO CRÍTICO!
      'cardiovascular': 'warning',  // Amarillo (advertencia media)
      'skeletal': 'info',
      'urogenital': 'info',
    },
  },
  sans_precursor: {
    id: 'sans_precursor',
    name: 'Sim: Neuro-Ocular SANS',
    latencySeconds: 1200,
    latencyLabel: '40 min (Round trip)',
    eclssCo2Percent: 0.45,
    eclssO2Percent: 21.0,
    severities: {
      'neuro-ocular': 'critical', // ¡ROJO CRÍTICO!
      'cardiovascular': 'info',
      'skeletal': 'warning',        // Amarillo
      'urogenital': 'info',
    },
  },
  microbiome_immuno: {
    id: 'microbiome_immuno',
    name: 'Sim: Microbiome & pH',
    latencySeconds: 1200,
    latencyLabel: '40 min (Round trip)',
    eclssCo2Percent: 0.41,
    eclssO2Percent: 21.1,
    severities: {
      'neuro-ocular': 'info',
      'cardiovascular': 'info',
      'skeletal': 'info',
      'urogenital': 'warning',      // Amarillo
    },
  },
};