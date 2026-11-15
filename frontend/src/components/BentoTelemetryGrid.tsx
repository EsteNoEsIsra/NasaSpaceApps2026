// frontend/src/components/BentoTelemetryGrid.tsx

import {
  Droplets,
  Pill,
  Moon,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Check,
} from 'lucide-react';
import type {
  AstronautProfile,
  BiometricReading,
  CabinTelemetry,
  DailyCheckin,
  HealthAlert,
  HistoryPoint,
  VascularBoneBalance,
  SimulationScenario,
} from '@/types/hera';

interface BentoTelemetryGridProps {
  profile: AstronautProfile | null;
  telemetry: CabinTelemetry | null;
  biometric: BiometricReading | null;
  checkin: DailyCheckin | null;
  balance: VascularBoneBalance;
  alerts: HealthAlert[];
  history: HistoryPoint[];
  privacyMode: boolean;
  activeScenario: SimulationScenario;
  onQuickWater: () => void;
  onTogglePill: () => void;
  onOpenTriage: () => void;
  onOpenVascularBone: () => void;
  onOpenIntimate: () => void;
}

export function BentoTelemetryGrid({
  profile,
  telemetry,
  biometric,
  checkin,
  balance,
  activeScenario,
  onQuickWater,
  onTogglePill,
  onOpenTriage,
  onOpenVascularBone,
}: BentoTelemetryGridProps) {
  const sleepHours = checkin?.sleepHours ?? 7.2;
  const sleepWhole = Math.floor(sleepHours);
  const sleepMins = Math.round((sleepHours - sleepWhole) * 60);
  const sleepQuality = Math.min(98, Math.round((sleepHours / 8) * 92));

  const baselineTemp = profile?.baselineTemp ?? 36.6;
  const baselineHRV = profile?.baselineHRV ?? 68;
  const currentHRV = biometric?.hrv ?? 68;
  
  const hydrationMl = checkin?.hydrationMl ?? 1000;
  const targetHydration = profile?.targetHydrationMl ?? 2500;
  const hydrationPct = Math.min(100, Math.round((hydrationMl / targetHydration) * 100));
  const remainingMl = targetHydration - hydrationMl;
  const isSurplus = remainingMl < 0;

  const isPillTaken = checkin?.pillTaken ?? true;

  const getScenarioTriage = () => {
    switch (activeScenario) {
      case 'co2_spike_dehydration':
        return {
          conf: 91,
          title: 'CO₂ Narcosis & Hemoconcentration (Dehydration Critical)',
          cat: 'CO₂ + DEHYDRATION',
          v1: { label: 'CO₂ Ret', pct: 75, color: 'bg-[#DF5A49]' },
          v2: { label: 'SANS', pct: 15, color: 'bg-[#2EC4B6]' },
          v3: { label: 'OCP', pct: 10, color: 'bg-[#B56576]' },
        };
      case 'sans_precursor':
        return {
          conf: 84,
          title: 'SANS Precursor Detected (Neuro-Ocular Fluid Shift)',
          cat: 'SANS PRECURSOR',
          v1: { label: 'SANS', pct: 84, color: 'bg-[#DF5A49]' },
          v2: { label: 'CO₂ Ret', pct: 12, color: 'bg-[#2EC4B6]' },
          v3: { label: 'OCP Bal', pct: 4, color: 'bg-[#B56576]' },
        };
      case 'microbiome_immuno':
        return {
          conf: 88,
          title: 'Urogenital Microbiome / pH Imbalance Warning',
          cat: 'INFECTION / pH',
          v1: { label: 'Infection', pct: 88, color: 'bg-[#DF5A49]' },
          v2: { label: 'OCP Bal', pct: 8, color: 'bg-[#B56576]' },
          v3: { label: 'SANS', pct: 4, color: 'bg-[#2EC4B6]' },
        };
      default:
        return {
          conf: 98,
          title: 'Cabin atmosphere & endocrine markers aligned.',
          cat: 'NOMINAL',
          v1: { label: 'Nominal', pct: 90, color: 'bg-[#2EC4B6]' },
          v2: { label: 'OCP', pct: 7, color: 'bg-[#6B4C7A]' },
          v3: { label: 'Baseline', pct: 3, color: 'bg-[#7A6F73]' },
        };
    }
  };

  const currentTriage = getScenarioTriage();

  const fixedHistory = Array.from({ length: 14 }, (_, i) => ({
    missionDay: 29 + i,
    bodyTemp: baselineTemp,
    hrv: baselineHRV + (i % 3 === 0 ? -3 : 2),
    sleepHours: 7.5
  }));

  const heatmapCells = [
    'stable', 'stable', 'warm', 'stable', 'stable', 'elevated', 'elevated',
    'elevated', 'warm', 'stable', 'cool', 'stable', 'stable', 'stable',
    'warm', 'elevated', 'elevated', 'stable', 'stable', 'cool', 'stable'
  ];

  const boneScore = balance.boneProtection.score;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* CARD 1: Circadian Sleep & Recovery */}
      <div className="md:col-span-6 bg-white rounded-3xl p-5 border border-[#E8E2DD] shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-medium text-[#7A6F73] flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-[#7A6F73]" /> Orbital Sleep &amp; Recovery
            </span>
            <span className="text-[10px] font-mono-tech uppercase bg-[#2A9D8F]/10 text-[#2A9D8F] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3" /> Stable Trend
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-4xl font-light tracking-tight text-[#1A1517] tabular-nums">
                {sleepWhole}h {sleepMins.toString().padStart(2, '0')}m
              </div>
              <div className="text-xs text-[#7A6F73] mt-1">
                Last Cycle · <span className="text-[#2A9D8F] font-medium">{sleepQuality}% Circadian Sync</span>
              </div>
            </div>
            <div className="text-right pb-1">
              <span className="text-[10px] font-mono-tech text-[#A09598] block uppercase">Target: 8h 00m</span>
              <span className="text-[11px] font-mono-tech text-[#1A1517] font-semibold">Micro-gravity Adjusted</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-[#F2ECE8] -mx-5 -mb-5 px-5 bg-[#FAFAF8]/50">
          <div className="flex flex-col gap-2 mb-3">
            <span className="text-[10px] text-[#7A6F73] font-mono-tech font-medium tracking-wide">
              Sleep Duration Trend (14-Cycle Span)
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#1A1517]">
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8E2DD] shadow-2xs">
                Minimum: <strong className="font-semibold text-[#2A9D8F]">6.0h</strong>
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-[#E8E2DD] shadow-2xs">
                Maximum: <strong className="font-semibold text-[#DF5A49]">8.5h</strong>
              </span>
            </div>
          </div>

          <div className="h-14 w-full relative overflow-visible">
            <svg viewBox="0 0 280 44" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="sleepAreaClean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DF5A49" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#DF5A49" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {fixedHistory.length > 1 && (() => {
                const pts = fixedHistory.map((d, i) => {
                  const x = (i / (fixedHistory.length - 1)) * 280;
                  const norm = Math.max(0, Math.min(1, (d.sleepHours - 4.5) / 4.5));
                  const y = Math.max(6, Math.min(36, 38 - norm * 26));
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                });
                const linePath = `M ${pts.join(' L ')}`;
                const areaPath = `${linePath} L 280,44 L 0,44 Z`;
                return (
                  <>
                    <path d={areaPath} fill="url(#sleepAreaClean)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#DF5A49"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* CARD 2: Basal Body Temperature Heatmap */}
      <div className="md:col-span-6 obsidian-card rounded-3xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-medium text-white">Basal Body Temperature</div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-[#B5A8AC]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#DF5A49]" /> Elevated
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#6E4449]" /> Her Baseline
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-[#2B2023]" /> Cool
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono-tech uppercase text-[#9E8F94]">
            21D Matrix
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {heatmapCells.map((state, idx) => {
            const cellClass =
              state === 'elevated'
                ? 'bg-[#DF5A49] shadow-[0_0_8px_rgba(223,90,73,0.6)]'
                : state === 'warm'
                  ? 'bg-[#9E4742]'
                  : state === 'cool'
                    ? 'bg-[#2A2023]'
                    : 'bg-[#4D3439]';
            return (
              <div
                key={idx}
                className={`h-3.5 rounded-[4px] transition-colors ${cellClass}`}
                title={`Day ${idx + 22} vs. ${baselineTemp.toFixed(1)}°C baseline`}
              />
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#B5A8AC]">
          <span>Calibrated Basal: {baselineTemp.toFixed(1)}°C</span>
          <span className="font-mono-tech text-[#2EC4B6]">
            {profile?.contraceptiveType === 'combined' ? 'COMBINED OCP' : 'PROGESTIN-ONLY'}
          </span>
        </div>
      </div>

      {/* CARD 3: Heart Rate Variability (HRV) */}
      <div className="md:col-span-12 bg-white rounded-3xl p-5 border border-[#E8E2DD] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#1A1517]">
                Autonomic HRV &amp; Endocrine Adaptation
              </span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#6B4C7A]/10 text-[#6B4C7A] font-medium">
                HER CALIBRATED BASELINE: {baselineHRV} ms
              </span>
            </div>
            <p className="text-xs text-[#7A6F73] mt-0.5">
              Evaluated against her personal neuro-endocrine curve — never generic male norms
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-[#1A1517] tabular-nums">
              {currentHRV}
            </span>
            <span className="text-xs text-[#7A6F73] font-mono-tech">ms</span>
          </div>
        </div>

        <div className="relative mt-5 h-32 flex items-end justify-between gap-3 pt-4 pb-1 px-2">
          <div
            style={{ bottom: `${Math.min(85, Math.max(20, (baselineHRV / 100) * 100))}%` }}
            className="absolute left-0 right-0 border-t border-dashed border-[#6B4C7A]/40 pointer-events-none z-10 flex justify-end pr-2"
          >
            <span className="text-[9px] font-mono-tech text-[#6B4C7A] bg-[#FAF8F5] px-2 py-0.5 rounded-md -mt-3 shadow-2xs border border-[#6B4C7A]/20">
              Baseline {baselineHRV}ms
            </span>
          </div>

          {fixedHistory.map((pt, idx) => {
            const pct = Math.min(100, Math.max(25, (pt.hrv / 95) * 100));
            const isSuppressed = pt.hrv < baselineHRV - 0.78;
            
            return (
              <div
                key={'hrv-' + idx}
                className="flex-1 h-full flex flex-col items-center justify-end gap-2 group cursor-pointer"
                title={`Day ${pt.missionDay}: ${pt.hrv} ms`}
              >
                <div className="w-full max-w-[20px] h-full bg-[#F5F1EE] rounded-full flex items-end p-0.5 transition-all group-hover:bg-[#EAE3DF]">
                  <div
                    style={{ height: `${pct}%` }}
                    className={`w-full rounded-full transition-all duration-500 shadow-2xs ${
                      isSuppressed 
                        ? 'bg-[#DF5A49]' 
                        : 'bg-[#DF5A49]/80 group-hover:bg-[#DF5A49]'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-mono-tech text-[#7A6F73] group-hover:text-[#1A1517] transition-colors">
                  D{pt.missionDay}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CARD 4: Anti-Bias Differential Diagnosis & Cabin ECLSS */}
      <div
        onClick={onOpenTriage}
        className="md:col-span-4 obsidian-card rounded-3xl p-5 shadow-sm flex flex-col justify-between cursor-pointer group hover:ring-2 hover:ring-[#DF5A49]/50 transition-all"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#B5A8AC]">
              Anti-Bias Differential
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#B5A8AC] group-hover:text-white transition-colors" />
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-light text-white tabular-nums">
              {currentTriage.conf}%
            </span>
            <span className="text-xs text-[#2EC4B6] font-medium">
              {currentTriage.cat}
            </span>
          </div>

          <p className="text-xs text-[#E3D8DC] font-medium mt-1.5 line-clamp-2 leading-snug">
            {currentTriage.title}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#B5A8AC]">
            <span className="text-[#DF5A49] font-medium">{currentTriage.v1.label}: {currentTriage.v1.pct}%</span>
            <span className="text-[#2EC4B6]">{currentTriage.v2.label}: {currentTriage.v2.pct}%</span>
            <span className="text-[#B56576]">{currentTriage.v3.label}: {currentTriage.v3.pct}%</span>
          </div>
          
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div style={{ width: `${currentTriage.v1.pct}%` }} className={`h-full ${currentTriage.v1.color} rounded-l-full transition-all duration-500`} />
            <div style={{ width: `${currentTriage.v2.pct}%` }} className={`h-full ${currentTriage.v2.color} transition-all duration-500`} />
            <div style={{ width: `${currentTriage.v3.pct}%` }} className={`h-full ${currentTriage.v3.color} rounded-r-full transition-all duration-500`} />
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#B5A8AC] font-mono-tech">
            <span>O₂ {telemetry?.o2Level.toFixed(1) ?? '21.1'}%</span>
            <span>CO₂ {(telemetry?.co2Level ?? 0.41).toFixed(2)}%</span>
            <span className="text-white">Triage →</span>
          </div>
        </div>
      </div>

      {/* CARD 5: Bone Shield & BMD Matrix (Rediseño con Línea Divisoria y Estructura Limpia) */}
      <div
        onClick={onOpenVascularBone}
        className="md:col-span-4 bg-white rounded-3xl p-5 border border-[#E8E2DD] shadow-xs flex flex-col justify-between cursor-pointer group hover:border-[#2A9D8F]/50 transition-all relative overflow-hidden"
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#1A1517] block tracking-tight">Bone Shield</span>
            <span className="text-[10px] font-mono-tech uppercase text-[#7A6F73] tracking-wider">BMD MATRIX</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono-tech uppercase text-[#2A9D8F] bg-[#2A9D8F]/10 px-2.5 py-1 rounded-full font-semibold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" /> PROTECTED
          </span>
        </div>

        {/* Bloque Central: Métrica y Barra */}
        <div className="my-4 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-light tracking-tight text-[#1A1517] tabular-nums">
                {boneScore}
              </span>
              <span className="text-xs font-mono-tech text-[#7A6F73]">
                / 100 Index
              </span>
            </div>
            <span className="text-[10px] font-mono-tech text-[#2A9D8F] font-semibold uppercase tracking-wide">
              Optimal Density
            </span>
          </div>

          <div className="w-full h-2 bg-[#F2ECE8] rounded-full overflow-hidden">
            <div
              style={{ width: `${boneScore}%` }}
              className="h-full bg-[#2A9D8F] rounded-full transition-all duration-700 ease-out"
            />
          </div>
        </div>

        {/* Pie de Tarjeta con Línea Divisoria Interna */}
        <div className="pt-3 border-t border-[#F2ECE8] space-y-2.5 text-[11px] font-mono-tech">
          {/* Bloque ARED */}
          <div className="flex items-center justify-between text-[#1A1517]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
              <span className="text-[#7A6F73]">ARED Exercise:</span>
            </span>
            <span className="font-semibold text-[#1A1517]">{checkin?.exerciseMinutes ?? 60}m (100%)</span>
          </div>

          {/* Línea divisoria sutil entre ARED y Estrogen Buffer */}
          <div className="w-full h-[1px] bg-[#F5F1EE]" />

          {/* Bloque Estrogen Buffer */}
          <div className="flex items-center justify-between text-[10px] text-[#7A6F73]">
            <span>Estrogen Buffer:</span>
            <span className="text-[#6B4C7A] font-semibold uppercase">Active Regimen</span>
          </div>
        </div>
      </div>

      {/* CARD 6: Daily Regimen & Quick Hydration */}
      <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-[#E8E2DD] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#7A6F73]">Daily Regimen</span>
            <Activity className="w-4 h-4 text-[#DF5A49]" />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-light tracking-tight text-[#1A1517] tabular-nums">
                {hydrationMl} <span className="text-sm font-normal text-[#7A6F73]">/ {targetHydration} ml</span>
              </span>
              <span className="text-xs font-mono-tech font-semibold text-[#2A9D8F]">
                {Math.round((hydrationMl / targetHydration) * 100)}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#F2ECE8] rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${hydrationPct}%` }}
                className="h-full bg-[#2A9D8F] rounded-full transition-all duration-300"
              />
            </div>

            <div className="text-[10px] text-[#7A6F73] mt-1.5 font-mono-tech flex justify-between">
              {isSurplus ? (
                <span className="text-[#2A9D8F] font-semibold">Target exceeded (+{Math.abs(remainingMl)} ml surplus)</span>
              ) : (
                <span>Remaining: <strong className="text-[#1A1517]">{remainingMl} ml</strong></span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-4 pt-3 border-t border-[#F2ECE8]">
          <button
            type="button"
            onClick={onQuickWater}
            className="w-full py-2 px-3 bg-[#F9F7F5] hover:bg-[#F2ECE8] rounded-xl text-xs font-medium text-[#1A1517] flex items-center justify-between transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-[#2A9D8F] shrink-0 group-hover:scale-110 transition-transform" /> 
              <span>Water (+250ml)</span>
            </span>
            <span className="font-mono-tech text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#E8E2DD] text-[#7A6F73] shrink-0">
              Log
            </span>
          </button>

          <button
            type="button"
            onClick={onTogglePill}
            className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
              isPillTaken
                ? 'bg-[#6B4C7A]/10 text-[#6B4C7A] border border-[#6B4C7A]/30 font-semibold'
                : 'bg-[#F9F7F5] hover:bg-[#F2ECE8] text-[#1A1517] border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Pill className={`w-4 h-4 shrink-0 ${isPillTaken ? 'text-[#6B4C7A]' : 'text-[#8E8286]'}`} /> 
              <span>OCP Regimen</span>
            </span>
            <span className={`font-mono-tech text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ${
              isPillTaken ? 'bg-[#6B4C7A] text-white shadow-xs' : 'bg-white border border-[#E8E2DD] text-[#7A6F73]'
            }`}>
              {isPillTaken ? <><Check className="w-3 h-3 stroke-[2.5]" /> TAKEN</> : 'PENDING'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}