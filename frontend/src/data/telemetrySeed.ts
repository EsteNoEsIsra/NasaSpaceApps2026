// frontend/src/data/telemetrySeed.ts

export interface MissionScenario {
  id: string;
  name: string;
  latencySeconds: number;
  latencyLabel: string;
  eclssCo2Percent: number; // Valor nominal seguro de cabina: 0.41%
  eclssO2Percent: number;
}

export const SCENARIOS: Record<string, MissionScenario> = {
  gateway: {
    id: 'gateway',
    name: 'Lunar Gateway',
    latencySeconds: 2.6,
    latencyLabel: '2.6s (Round trip)',
    eclssCo2Percent: 0.41,
    eclssO2Percent: 21.1,
  },
  mars: {
    id: 'mars',
    name: 'Mars Transit',
    latencySeconds: 1200, // ~20 min one-way / 40 min round trip
    latencyLabel: '40 min (Round trip)',
    eclssCo2Percent: 0.38,
    eclssO2Percent: 21.3,
  },
};

export const INITIAL_TELEMETRY = {
  activeScenarioId: 'gateway',
  water: {
    consumedMl: 2275,
    targetMl: 2500,
    incrementMl: 250, // Unificado a +250 ml en toda la app
  },
  hrv: {
    current: 66,
    baseline: 65,
    unit: 'ms',
  },
  basalTemp: {
    baseline: 36.6,
    matrixDays: 21, // Exactamente 21 celdas como pide el rótulo
    historyValues: [36.6, 36.7, 36.6, 36.5, 36.8, 36.9, 36.6, 36.5, 36.6, 36.7, 36.8, 36.6, 36.5, 36.6, 36.7, 36.9, 36.8, 36.6, 36.5, 36.6, 36.7]
  }
};