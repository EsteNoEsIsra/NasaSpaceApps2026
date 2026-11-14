import { useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Droplets,
  Lock,
  Unlock,
  Pill,
  PlusCircle,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { FemaleAnatomy3D } from '@/components/FemaleAnatomy3D';
import { HormonalBalanceDial } from '@/components/HormonalBalanceDial';
import { BentoTelemetryGrid } from '@/components/BentoTelemetryGrid';
import { ActionDrawers, type ActiveDrawer } from '@/components/ActionDrawers';
import type {
  BodySystemId,
  HeraDashboardData,
  MissionEnvironment,
  Severity,
  SimulationScenario,
} from '@/types/hera';

const ENVIRONMENTS: { id: MissionEnvironment; label: string }[] = [
  { id: 'transit-0g', label: '0g Transit' },
  { id: 'orbital-station', label: 'Orbital Habitat' },
  { id: 'lunar-base', label: 'Lunar Base' },
  { id: 'eva-prep', label: 'Pre/Post-EVA' },
];

const DEMO_SCENARIOS: { id: SimulationScenario; label: string }[] = [
  { id: 'nominal', label: 'Nominal Baseline' },
  { id: 'co2_spike_dehydration', label: 'Sim: CO₂ Spike + Dehydration' },
  { id: 'sans_precursor', label: 'Sim: SANS Neuro-Ocular' },
  { id: 'microbiome_immuno', label: 'Sim: Microbiome & pH Shift' },
];

export default function Home() {
  const { user } = useAuth();
  const [data, setData] = useState<HeraDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<BodySystemId>('cardiovascular');
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('nominal');

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get<{ data: HeraDashboardData }>('/api/health/dashboard');
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleEnvironmentChange = async (env: MissionEnvironment) => {
    const res = await api.patch<{ data: HeraDashboardData }>('/api/health/profile', {
      missionEnvironment: env,
    });
    setData(res.data);
  };

  const handleScenarioChange = async (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    const res = await api.post<{ data: HeraDashboardData }>('/api/health/simulate', {
      scenario,
    });
    setData(res.data);
  };

  const handleSubmitCheckin = async (payload: Record<string, unknown>) => {
    const res = await api.post<{ data: HeraDashboardData }>('/api/health/checkin', payload);
    setData(res.data);
  };

  const handleUpdateProfile = async (payload: Record<string, unknown>) => {
    const res = await api.patch<{ data: HeraDashboardData }>('/api/health/profile', payload);
    setData(res.data);
  };

  const handleQuickWater = async () => {
    if (!data?.latestCheckin) return;
    await handleSubmitCheckin({
      pillTaken: data.latestCheckin.pillTaken,
      hydrationMl: data.latestCheckin.hydrationMl + 250,
      exerciseMinutes: data.latestCheckin.exerciseMinutes,
      symptoms: data.latestCheckin.symptoms,
    });
  };

  const handleTogglePill = async () => {
    if (!data?.latestCheckin) return;
    await handleSubmitCheckin({
      pillTaken: !data.latestCheckin.pillTaken,
      hydrationMl: data.latestCheckin.hydrationMl,
      exerciseMinutes: data.latestCheckin.exerciseMinutes,
      symptoms: data.latestCheckin.symptoms,
    });
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#DF5A49] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono-tech uppercase tracking-wider text-[#7A6F73]">
            Calibrating HERA Endocrine Baseline...
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
      if (data.vascularBoneBalance.thrombosis.score >= 75) return 'critical';
      if (data.vascularBoneBalance.thrombosis.score >= 45) return 'warning';
      const hit = active.find((a) => a.category === 'thrombosis');
      return hit?.severity ?? 'info';
    }
    if (sys === 'skeletal') {
      if (data.vascularBoneBalance.boneProtection.level === 'at-risk') return 'warning';
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

  const missionDay = data.latestCheckin?.missionDay ?? 42;
  const currentEnv = data.profile?.missionEnvironment ?? 'transit-0g';

  return (
    <div className="min-h-screen bg-[#F5F3F0] p-3 md:p-5">
      <div className="max-w-[1440px] mx-auto bg-white/75 backdrop-blur-md rounded-[32px] border border-[#E6DFDA] shadow-sm p-4 md:p-6">
        {/* TOP NAVIGATION & MISSION CONTEXT BAR */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DF5A49] flex items-center justify-center text-white shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="9" r="5" />
                <path d="M12 14v7M9 18h6" strokeLinecap="round" />
                <path d="M4 11c2.5-3.5 13.5-3.5 16 0" strokeOpacity="0.65" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#1A1517]">HERA</span>
                <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded-full bg-[#6B4C7A]/12 text-[#6B4C7A] font-semibold">
                  Day {missionDay} · {data.mission?.targetBody ?? 'Lunar Transit'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A6F73]">
                Hormonal Evaluation and Regulation in Astronauts · Built for Women Beyond Earth
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5 bg-[#F5F3F0] p-1 rounded-full border border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setActiveDrawer(null)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#DF5A49] text-white shadow-xs cursor-pointer"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('triage')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#5A5054] hover:text-[#1A1517] cursor-pointer"
            >
              Differential Triage
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('vascular-bone')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#5A5054] hover:text-[#1A1517] cursor-pointer"
            >
              Vascular &amp; Bone
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('intimate')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#5A5054] hover:text-[#1A1517] cursor-pointer"
            >
              Intimate Care
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('ground-packet')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#5A5054] hover:text-[#1A1517] cursor-pointer"
            >
              Flight Surgeon
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#F5F3F0] px-3 py-1.5 rounded-full border border-[#E8E2DD]">
              <Sparkles className="w-3.5 h-3.5 text-[#DF5A49]" />
              <select
                value={activeScenario}
                onChange={(e) => handleScenarioChange(e.target.value as SimulationScenario)}
                aria-label="Demo Scenario Simulator"
                className="bg-transparent text-xs font-medium text-[#1A1517] focus:outline-none cursor-pointer"
              >
                {DEMO_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setPrivacyMode(!privacyMode)}
              title={privacyMode ? 'Intimate logs locked' : 'Intimate logs visible'}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                privacyMode
                  ? 'bg-[#6B4C7A] text-white border-[#6B4C7A]'
                  : 'bg-white text-[#5A5054] border-[#E6DFDA]'
              }`}
            >
              {privacyMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawer('calibration')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white border border-[#E6DFDA] hover:border-[#DF5A49] transition-colors cursor-pointer"
              title="Calibrate Her Endocrine Baseline"
            >
              <span className="w-7 h-7 rounded-full bg-[#181113] text-white text-[11px] font-semibold flex items-center justify-center">
                EV
              </span>
              <span className="text-xs font-semibold text-[#1A1517] hidden sm:inline">
                {user.name}
              </span>
            </button>
          </div>
        </header>

        {/* MAIN 12-COLUMN EDITORIAL WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT STAGE (5 Cols): 3D Female Silhouette + Vertical Dock + Radial Balance Dial */}
          <section className="lg:col-span-5 anatomy-stage-bg rounded-[28px] border border-[#EDE3DF] p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-1 bg-white/80 backdrop-blur-xs p-1 rounded-full border border-[#E8DFDB] z-20">
              {ENVIRONMENTS.map((env) => (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => handleEnvironmentChange(env.id)}
                  className={`flex-1 py-1 px-2 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    currentEnv === env.id
                      ? 'bg-[#181113] text-white'
                      : 'text-[#6B5F63] hover:text-[#1A1517]'
                  }`}
                >
                  {env.label}
                </button>
              ))}
            </div>

            <div className="absolute left-3.5 top-32 z-30 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-[#E6DFDA] shadow-xs">
              <button
                type="button"
                onClick={() => setActiveDrawer('checkin')}
                title="Quick Daily Check-In & Symptoms"
                className="w-8 h-8 rounded-full bg-[#DF5A49] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleTogglePill}
                title="Toggle Daily Oral Contraceptive Dose"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  data.latestCheckin?.pillTaken
                    ? 'bg-[#6B4C7A]/15 text-[#6B4C7A]'
                    : 'text-[#7A6F73] hover:bg-[#F5F3F0]'
                }`}
              >
                <Pill className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleQuickWater}
                title="Log +250 ml Hydration"
                className="w-8 h-8 rounded-full text-[#2A9D8F] hover:bg-[#2A9D8F]/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Droplets className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveDrawer('calibration')}
                title="Calibrate Hormonal Baseline"
                className="w-8 h-8 rounded-full text-[#5A5054] hover:bg-[#F5F3F0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveDrawer('ground-packet')}
                title="Downlink Packet to Flight Surgeon"
                className="w-8 h-8 rounded-full text-[#5A5054] hover:bg-[#F5F3F0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Radio className="w-4 h-4" />
              </button>
            </div>

            <FemaleAnatomy3D
              selectedSystem={selectedSystem}
              onSelectSystem={setSelectedSystem}
              systemSeverities={systemSeverities}
              co2Level={data.latestTelemetry?.co2Level ?? 0.41}
              bodyTemp={data.latestBiometric?.bodyTemp ?? 36.6}
              baselineTemp={data.profile?.baselineTemp ?? 36.6}
              privacyMode={privacyMode}
            />

            <HormonalBalanceDial
              balance={data.vascularBoneBalance}
              hydrationMl={data.latestCheckin?.hydrationMl ?? 2500}
              targetHydrationMl={data.profile?.targetHydrationMl ?? 2500}
              onOpenDetail={() => setActiveDrawer('vascular-bone')}
            />
          </section>

          {/* RIGHT WORKSPACE (7 Cols): Editorial Bento Telemetry Grid */}
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

            <footer className="mt-4 px-4 py-2.5 rounded-2xl bg-[#F8F5F3] border border-[#EAE3DF] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B5F63]">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#2A9D8F]" />
                <span>
                  Earth Round-Trip Latency:{' '}
                  <strong className="font-mono-tech text-[#1A1517]">
                    {(data.mission?.communicationLatencyMin ?? 4) * 2} min
                  </strong>{' '}
                  · Autonomous Onboard Clinical Triage Active
                </span>
              </div>
              <span className="font-mono-tech text-[10px] uppercase text-[#6B4C7A]">
                Female Physiology Baseline · NASA HRP Aligned
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
    </div>
  );
}