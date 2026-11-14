export type Severity = 'info' | 'warning' | 'critical'
export type Category = 'hormonal' | 'environmental' | 'sans' | 'thrombosis' | 'infection'
export type HydrationLevel = 'low' | 'normal' | 'high'
export type ContraceptiveType = 'combined' | 'progestin-only' | 'none'

export interface HealthAlert {
  id: string
  severity: Severity
  category: Category
  title: string
  description: string
  possibleCauses: string[]
  recommendedActions: string[]
  primaryCause: string
  confidence: number
  isAcknowledged: boolean
  createdAt: string
}

export interface DailyCheckin {
  id: string
  missionDay: number
  pillTaken: boolean
  hydrationLevel: HydrationLevel
  symptoms: string[]
  sleepHours?: number
  moodScore?: number
  createdAt: string
}

export interface BiometricReading {
  id: string
  heartRate?: number
  hrv?: number
  bodyTemp?: number
  oxygenSaturation?: number
  legEdemaScore?: number
  ocularPressureNote?: string
  createdAt: string
}

export interface CabinTelemetry {
  co2Level: number
  o2Level: number
  pressure: number
  humidity: number
  temperature: number
  radiationLevel: number
  source: string
  timestamp: string
}

export interface MissionStatus {
  missionName: string
  targetBody: string
  communicationLatencyMin: number
  missionDay: number
}
