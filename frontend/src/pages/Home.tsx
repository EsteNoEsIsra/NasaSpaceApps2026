// frontend/src/pages/Home.tsx

import { useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { FemaleAnatomy3D } from '@/components/FemaleAnatomy3D';
import { BentoTelemetryGrid } from '@/components/BentoTelemetryGrid';
import { ActionDrawers, type ActiveDrawer } from '@/components/ActionDrawers';
import { UserProfileModal } from '@/components/UserProfileModal';
import type {
  BodySystemId,
  HeraDashboardData,
  MissionEnvironment,
  Severity,
  SimulationScenario,
} from '@/types/hera';

const ENVIRONMENTS: { id: MissionEnvironment; label: string; latencyText: string }[] = [
  { id: 'transit-0g', label: 'Transit 0g', latencyText: '40 min (Mars Transit)' },
  { id: 'orbital-station', label: 'Orbital Station', latencyText: '1.2 s (Low Earth Orbit)' },
  { id: 'lunar-base', label: 'Lunar Base', latencyText: '2.6 s (Lunar Gateway)' },
  { id: 'eva-prep', label: 'Pre/Post-EVA', latencyText: '0.5 s (Local)' },
];

const DEMO_SCENARIOS: { id: SimulationScenario; label: string }[] = [
  { id: 'nominal', label: 'Nominal Baseline' },
  { id: 'co2_spike_dehydration', label: 'Sim: CO₂ Spike + Dehydration' },
  { id: 'sans_precursor', label: 'Sim: Neuro-Ocular SANS' },
  { id: 'microbiome_immuno', label: 'Sim: Microbiome & pH' },
];

export default function Home() {
  const { user } = useAuth();
  
  const [data, setData] = useState<HeraDashboardData>({
    mission: { targetBody: 'Lunar Gateway', communicationLatencyMin: 2 },
    profile: { baselineTemp: 36.6, baselineHRV: 68, targetHydrationMl: 2500, missionEnvironment: 'lunar-base', contraceptiveType: 'combined' },
    latestTelemetry: { co2Level: 0.41, o2Level: 21.1 },
    latestBiometric: { bodyTemp: 36.6, hrv: 68 },
    // Forzado estrictamente al Día 42 de la misión
    latestCheckin: { missionDay: 42, hydrationMl: 1000, exerciseMinutes: 60, sleepHours: 7.2, pillTaken: true, symptoms: [] },
    vascularBoneBalance: { thrombosis: { score: 20 }, boneProtection: { score: 85, level: 'nominal' } },
    alerts: [],
    history: Array.from({ length: 21 }, (_, i) => ({ missionDay: 42 + i - 20, bodyTemp: 36.6, hrv: 68, sleepHours: 7.5 }))
  });

  const [loading, setLoading] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<BodySystemId | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('nominal');

  // States for User Profile Modal & Calibration
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [baselineTemp, setBaselineTemp] = useState(36.6);
  const [baselineHrv, setBaselineHrv] = useState(68);
  const [contraceptiveType, setContraceptiveType] = useState('combined');

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get<{ data: HeraDashboardData }>('/api/health/dashboard');
      if (res?.data) {
        setData(res.data);
        if (res.data.profile?.baselineTemp) setBaselineTemp(res.data.profile.baselineTemp);
        if (res.data.profile?.baselineHRV) setBaselineHrv(res.data.profile.baselineHRV);
        if (res.data.profile?.contraceptiveType) setContraceptiveType(res.data.profile.contraceptiveType);
      }
    } catch (err) {
      console.warn('Backend offline, using local HERA seed data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Mission environment change logic
  const handleEnvironmentChange = async (env: MissionEnvironment) => {
    const isTransit = env === 'transit-0g';
    const isLunar = env === 'lunar-base';
    const isEva = env === 'eva-prep';
    
    const targetHydration = isTransit ? 2800 : isEva ? 3000 : 2500;

    setData((prev) => {
      const newThrombosisScore = isTransit ? 75 : isEva ? 50 : isLunar ? 30 : 18;
      const newBoneScore = isLunar ? 62 : isTransit ? 58 : 85;

      return {
        ...prev,
        profile: prev.profile ? { 
          ...prev.profile, 
          missionEnvironment: env,
          targetHydrationMl: targetHydration 
        } : null,
        vascularBoneBalance: {
          thrombosis: { score: newThrombosisScore },
          boneProtection: { 
            score: newBoneScore, 
            level: newBoneScore < 70 ? 'warning' : 'nominal' 
          }
        },
        latestTelemetry: {
          ...prev.latestTelemetry,
          co2Level: isTransit ? 0.62 : isEva ? 0.52 : 0.41
        }
      };
    });

    try {
      const res = await api.patch<{ data: HeraDashboardData }>('/api/health/profile', {
        missionEnvironment: env,
      });
      if (res?.data) {
        setData((prev) => ({
          ...res.data,
          profile: res.data.profile ? {
            ...res.data.profile,
            targetHydrationMl: targetHydration,
            missionEnvironment: env
          } : prev.profile
        }));
      }
    } catch {
      console.warn('Backend offline: Space environment simulated locally.');
    }
  };

  // Robust simulation & global reset logic
  const handleScenarioChange = async (scenario: SimulationScenario) => {
    setActiveScenario(scenario);

    if (scenario === 'nominal') {
      setData((prev) => ({
        ...prev,
        latestTelemetry: { co2Level: 0.41, o2Level: 21.1 },
        latestBiometric: { bodyTemp: baselineTemp, hrv: baselineHrv },
        latestCheckin: { missionDay: 42, hydrationMl: 1000, exerciseMinutes: 60, sleepHours: 7.2, pillTaken: true, symptoms: [] },
        vascularBoneBalance: { thrombosis: { score: 20 }, boneProtection: { score: 85, level: 'nominal' } },
        alerts: []
      }));
      return;
    }

    try {
      const res = await api.post<{ data: HeraDashboardData }>('/api/health/simulate', {
        scenario,
      });
      if (res?.data) setData(res.data);
    } catch {
      if (scenario === 'co2_spike_dehydration') {
        setData((prev) => ({
          ...prev,
          latestTelemetry: { co2Level: 0.65, o2Level: 20.2 },
          latestCheckin: prev.latestCheckin ? { ...prev.latestCheckin, missionDay: 42, hydrationMl: 1800, pillTaken: false } : null,
          vascularBoneBalance: { thrombosis: { score: 65 }, boneProtection: { score: 70, level: 'warning' } }
        }));
      } else if (scenario === 'sans_precursor') {
        setData((prev) => ({
          ...prev,
          latestTelemetry: { co2Level: 0.55, o2Level: 20.8 },
          latestBiometric: { bodyTemp: 36.8, hrv: 55 },
          latestCheckin: prev.latestCheckin ? { ...prev.latestCheckin, missionDay: 42, hydrationMl: 1500 } : null
        }));
      } else if (scenario === 'microbiome_immuno') {
        setData((prev) => ({
          ...prev,
          latestBiometric: { bodyTemp: 37.1, hrv: 60 },
          latestCheckin: prev.latestCheckin ? { ...prev.latestCheckin, missionDay: 42, hydrationMl: 1200, pillTaken: true } : null
        }));
      }
    }
  };

  const handleSubmitCheckin = async (payload: Record<string, unknown>) => {
    setData((prev) => ({
      ...prev,
      latestCheckin: prev.latestCheckin ? {
        ...prev.latestCheckin,
        hydrationMl: (payload.hydrationMl as number) ?? prev.latestCheckin.hydrationMl,
        pillTaken: (payload.pillTaken as boolean) ?? prev.latestCheckin.pillTaken
      } : null
    }));
    try {
      const res = await api.post<{ data: HeraDashboardData }>('/api/health/checkin', payload);
      if (res?.data) setData(res.data);
    } catch {}
  };

  const handleUpdateProfile = async (payload: Record<string, unknown>) => {
    try {
      const res = await api.patch<{ data: HeraDashboardData }>('/api/health/profile', payload);
      if (res?.data) setData(res.data);
    } catch {}
  };

  const handleQuickWater = async () => {
    if (!data?.latestCheckin) return;
    const currentHydration = data.latestCheckin.hydrationMl ?? 0;
    const newHydration = currentHydration + 250;

    const updatedCheckinPayload = {
      missionDay: 42,
      pillTaken: data.latestCheckin.pillTaken,
      hydrationMl: newHydration,
      exerciseMinutes: data.latestCheckin.exerciseMinutes,
      sleepHours: data.latestCheckin.sleepHours,
      symptoms: data.latestCheckin.symptoms,
    };

    await handleSubmitCheckin(updatedCheckinPayload);
  };

  const handleTogglePill = async () => {
    if (!data?.latestCheckin) return;
    const newPillState = !data.latestCheckin.pillTaken;

    const updatedCheckinPayload = {
      missionDay: 42,
      pillTaken: newPillState,
      hydrationMl: data.latestCheckin.hydrationMl,
      exerciseMinutes: data.latestCheckin.exerciseMinutes,
      sleepHours: data.latestCheckin.sleepHours,
      symptoms: data.latestCheckin.symptoms,
    };

    await handleSubmitCheckin(updatedCheckinPayload);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono-tech uppercase tracking-wider text-[var(--ink-muted)]">
            Calibrating HERA endocrine baseline...
          </p>
        </div>
      </div>
    );
  }

  const getSystemSeverity = (sys: BodySystemId): Severity => {
    const active = data.alerts.filter((a) => !a.isAcknowledged);
    if (sys === 'neuro-ocular') {
      const hit = active.find((a) => a.category === 'environmental' || a.category === 'sans');
      return hit?.severity ?? 'info';
    }
    if (sys === 'cardiovascular') {
      if (data.vascularBoneBalance.thrombosis.score >= 70) return 'critical';
      if (data.vascularBoneBalance.thrombosis.score >= 45) return 'warning';
      const hit = active.find((a) => a.category === 'thrombosis');
      return hit?.severity ?? 'info';
    }
    if (sys === 'skeletal') {
      if (data.vascularBoneBalance.boneProtection.level === 'at-risk' || data.vascularBoneBalance.boneProtection.level === 'warning') return 'warning';
      return 'info';
    }
    const hit = active.find((a) => a.category === 'infection');
    return hit?.severity ?? 'info';
  };

  const systemSeverities: Record<BodySystemId, Severity> = {
    'neuro-ocular': getSystemSeverity('neuro-ocular'),
    cardiovascular: getSystemSeverity('cardiovascular'),
    skeletal: getSystemSeverity('skeletal'),
    urogenital: getSystemSeverity('urogenital'),
  };

  const missionDay = 42;
  const currentEnv = data.profile?.missionEnvironment ?? 'lunar-base';
  const activeEnvConfig = ENVIRONMENTS.find((e) => e.id === currentEnv) || ENVIRONMENTS[2];

  return (
    <div className="min-h-screen bg-[#F5F3F0] p-3 md:p-5">
      <div className="max-w-[1440px] mx-auto bg-white/75 backdrop-blur-md rounded-[32px] border border-[#E6DFDA] shadow-sm p-4 md:p-6">
        
        {/* TOP NAVIGATION & MISSION CONTEXT BAR */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="9" r="5" />
                <path d="M12 14v7M9 18h6" strokeLinecap="round" />
                <path d="M4 11c2.5-3.5 13.5-3.5 16 0" strokeOpacity="0.65" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[var(--ink)]">HERA</span>
                <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded-full bg-[var(--accent)]/12 text-[var(--accent)] font-semibold">
                  Day {missionDay} · {data.mission?.targetBody ?? 'Lunar Gateway'}
                </span>
              </div>
              <p className="text-[14px] text-[var(--ink-muted)]">
                Hormonal Evaluation and Regulation in Astronauts · Designed for Women in Space
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5 bg-[#F5F3F0] p-1 rounded-full border border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setActiveDrawer(null)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent)] text-white shadow-xs cursor-pointer"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('triage')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Differential Triage
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('vascular-bone')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Vascular &amp; Bones
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('intimate')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Intimate Health
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('ground-packet')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              Flight Surgeon
            </button>
          </nav>

          <div className="flex items-center gap-2">
            
            {/* Simulation Scenario Selector with Micro-Label */}
            <div className="flex flex-col">
              <span className="text-[9px] font-mono-tech uppercase tracking-wider text-[var(--ink-muted)] mb-1 px-1">
                Simulation Scenario
              </span>
              <div className="flex items-center gap-1.5 bg-[#F5F3F0] px-3 py-1.5 rounded-full border border-[#E8E2DD]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                <select
                  value={activeScenario}
                  onChange={(e) => handleScenarioChange(e.target.value as SimulationScenario)}
                  aria-label="Scenario Simulator"
                  className="bg-transparent text-xs font-medium text-[var(--ink)] focus:outline-none cursor-pointer"
                >
                  {DEMO_SCENARIOS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Privacy Lock / Unlock Toggle */}
            <button
              type="button"
              onClick={() => setPrivacyMode(!privacyMode)}
              title={privacyMode ? 'Intimate logs locked' : 'Intimate logs visible'}
              className={`p-2 rounded-full border transition-colors cursor-pointer self-end mb-0.5 ${
                privacyMode
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-white text-[var(--ink-muted)] border-[#E6DFDA]'
              }`}
            >
              {privacyMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            {/* Profile Button */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white border border-[#E6DFDA] hover:border-[var(--accent)] transition-colors cursor-pointer self-end mb-0.5"
              title="Configure mission profile and baseline"
            >
              <span className="w-7 h-7 rounded-full bg-[#5b3e8f] text-white text-[11px] font-semibold flex items-center justify-center">
                EV
              </span>
              <span className="text-xs font-semibold text-[var(--ink)] hidden sm:inline">
                {user?.name ?? 'Cmdr. Elena Vance'}
              </span>
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE GRID (12 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT PANEL: 3D Anatomy Model + Layer Column */}
          <section className="lg:col-span-5 rounded-[28px] border border-[#EDE3DF] p-4 flex flex-col relative overflow-hidden bg-white">
            
            {/* Mission Environment Header & Selector with Context Label */}
            <div className="mb-3 z-20">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[var(--ink-muted)]">
                  Mission Environment
                </span>
                <span className="text-[10px] font-mono-tech text-[var(--accent)] font-semibold">
                  {activeEnvConfig.latencyText.split(' ')[0]} Latency
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-1 bg-[#F5F3F0] p-1 rounded-full border border-[#E8DFDB]">
                {ENVIRONMENTS.map((env) => (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => handleEnvironmentChange(env.id)}
                    className={`flex-1 py-1 px-2 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                      currentEnv === env.id
                        ? 'bg-[var(--ink)] text-white shadow-2xs'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {env.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Central 3D Anatomy Component */}
            <FemaleAnatomy3D
              selectedSystem={selectedSystem}
              onSelectSystem={setSelectedSystem}
              systemSeverities={systemSeverities}
              co2Level={data.latestTelemetry?.co2Level ?? 0.41}
              bodyTemp={data.latestBiometric?.bodyTemp ?? 36.6}
              baselineTemp={baselineTemp}
              privacyMode={privacyMode}
            />
          </section>

          {/* RIGHT PANEL: Bento Editorial Telemetry Grid */}
          <section className="lg:col-span-7 flex flex-col justify-between">
            <BentoTelemetryGrid
              profile={data.profile}
              telemetry={data.latestTelemetry}
              biometric={data.latestBiometric}
              checkin={data.latestCheckin}
              balance={data.vascularBoneBalance}
              alerts={data.alerts}
              history={data.history}
              privacyMode={privacyMode}
              onQuickWater={handleQuickWater}
              onTogglePill={handleTogglePill}
              onOpenTriage={() => setActiveDrawer('triage')}
              onOpenVascularBone={() => setActiveDrawer('vascular-bone')}
              onOpenIntimate={() => setActiveDrawer('intimate')}
            />

            {/* Dynamic Latency Footer */}
            <footer className="mt-4 px-4 py-2.5 rounded-2xl bg-[#F8F5F3] border border-[#EAE3DF] flex flex-wrap items-center justify-between gap-2 text-[14px] text-[var(--ink-muted)]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--ok)]" />
                <span>
                  Earth Round-Trip Latency:{' '}
                  <strong className="font-mono-tech text-[var(--ink)]">
                    {activeEnvConfig.latencyText}
                  </strong>{' '}
                  · Autonomous Clinical Triage Active
                </span>
              </div>
              <span className="font-mono-tech text-[10px] uppercase text-[var(--accent)]">
                Female Physiological Baseline · Aligned with NASA HRP
              </span>
            </footer>
          </section>
        </div>
      </div>

      <ActionDrawers
        activeDrawer={activeDrawer}
        onClose={() => setActiveDrawer(null)}
        profile={data.profile}
        checkin={data.latestCheckin}
        alerts={data.alerts}
        balance={data.vascularBoneBalance}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        onSubmitCheckin={handleSubmitCheckin}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        baselineTemp={baselineTemp}
        onUpdateBaselineTemp={(temp) => {
          setBaselineTemp(temp);
          handleUpdateProfile({ baselineTemp: temp });
        }}
        baselineHrv={baselineHrv}
        onUpdateBaselineHrv={(hrv) => {
          setBaselineHrv(hrv);
          handleUpdateProfile({ baselineHRV: hrv });
        }}
        missionPhase={activeEnvConfig.label}
        privacyMode={privacyMode}
        onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)}
        contrinceptiveType={contraceptiveType}
        onUpdateContraceptiveType={(type) => {
          setContraceptiveType(type);
          handleUpdateProfile({ contraceptiveType: type });
        }}
      />
    </div>
  );
}