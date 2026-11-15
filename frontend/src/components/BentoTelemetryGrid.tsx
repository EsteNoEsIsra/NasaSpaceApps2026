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
  alerts,
  history,
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
  
  // Hydration tracking
  const hydrationMl = checkin?.hydrationMl ?? 1000;
  const targetHydration = profile?.targetHydrationMl ?? 2500;
  const hydrationPct = Math.min(100, Math.round((hydrationMl / targetHydration) * 100));
  const remainingMl = targetHydration - hydrationMl;
  const isSurplus = remainingMl < 0;

  // OCP Regimen status
  const isPillTaken = checkin?.pillTaken ?? true;

  const primaryAlert = alerts.find((a) => !a.isAcknowledged) ?? alerts[0];
  const last14 = history.slice(-14);

  // 21-day matrix cells (Matriz térmica 100% blindada e inalterable)
  const heatmapCells = [
    'stable', 'stable', 'warm', 'stable', 'stable', 'elevated', 'elevated',
    'elevated', 'warm', 'stable', 'cool', 'stable', 'stable', 'stable',
    'warm', 'elevated', 'elevated', 'stable', 'stable', 'cool', 'stable'
  ];

  const boneScore = balance.boneProtection.score;
  const arcDots = Array.from({ length: 24 }, (_, idx) => {
    const row = idx < 12 ? 0 : 1;
    const col = idx % 12;
    const angle = -165 + col * (150 / 11);
    const radius = row === 0 ? 54 : 42;
    const rad = (angle * Math.PI) / 180;
    const x = 68 + Math.cos(rad) * radius;
    const y = 66 + Math.sin(rad) * radius;
    const active = ((col + 1) / 12) * 100 <= boneScore;
    return { x, y, active, key: idx };
  });

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
              {last14.length > 1 && (() => {
                const pts = last14.map((d, i) => {
                  const x = (i / (last14.length - 1)) * 280;
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

      {/* CARD 2: Basal Body Temperature Heatmap (100% Blindada e Inalterable) */}
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
                title={`Day ${idx + 1} vs. ${baselineTemp.toFixed(1)}°C baseline`}
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

        <div className="relative mt-4 h-28 flex items-end justify-between gap-2 pt-4 pb-1 px-1">
          <div
            style={{ bottom: `${Math.min(90, Math.max(15, (baselineHRV / 100) * 100))}%` }}
            className="absolute left-0 right-0 border-t border-dashed border-[#6B4C7A]/50 pointer-events-none z-10 flex justify-end"
          >
            <span className="text-[9px] font-mono-tech text-[#6B4C7A] bg-white px-1.5 -mt-2.5">
              Baseline {baselineHRV}ms
            </span>
          </div>

          {last14.map((pt, idx) => {
            const pct = Math.min(100, Math.max(22, (pt.hrv / 95) * 100));
            const isSuppressed = pt.hrv < baselineHRV - 0.78;
            return (
              <div
                key={pt.missionDay + '-' + idx}
                className="flex-1 h-full flex flex-col items-center justify-end gap-1.5"
              >
                <div className="w-full max-w-[14px] h-full bg-[#F5F1EE] rounded-full flex items-end p-0.5">
                  <div
                    style={{ height: `${pct}%` }}
                    className={`w-full rounded-full transition-all duration-500 ${
                      isSuppressed ? 'bg-[#DF5A49]' : 'bg-[#DF5A49]/75'
                    }`}
                    title={`Day ${pt.missionDay}: ${pt.hrv} ms`}
                  />
                </div>
                <span className="text-[9px] font-mono-tech text-[#8E8286]">
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
              {primaryAlert ? `${primaryAlert.confidence}%` : '98%'}
            </span>
            <span className="text-xs text-[#2EC4B6] font-medium">
              {primaryAlert ? primaryAlert.category.toUpperCase() : 'NOMINAL'}
            </span>
          </div>

          <p className="text-xs text-[#E3D8DC] font-medium mt-1.5 line-clamp-2 leading-snug">
            {primaryAlert
              ? primaryAlert.title
              : 'Cabin atmosphere & endocrine markers aligned.'}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-1 h-7">
            {[45, 70, 35, 90, 60, 85, 40, 95, 55, 75, 50, 80, 38, 68].map((v, i) => (
              <span
                key={i}
                style={{ height: `${v}%` }}
                className={`w-1 rounded-full ${
                  (telemetry?.co2Level ?? 0.41) > 0.5 && i % 3 === 0
                    ? 'bg-[#DF5A49]'
                    : 'bg-[#7A686D]'
                }`}
              />
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#B5A8AC] font-mono-tech">
            <span>O₂ {telemetry?.o2Level.toFixed(1) ?? '21.1'}%</span>
            <span>CO₂ {(telemetry?.co2Level ?? 0.41).toFixed(2)}%</span>
            <span className="text-white">Triage →</span>
          </div>
        </div>
      </div>

      {/* CARD 5: Bone Density Protection Arc */}
      <div
        onClick={onOpenVascularBone}
        className="md:col-span-4 bg-white rounded-3xl p-5 border border-[#E8E2DD] shadow-xs flex flex-col justify-between items-center text-center cursor-pointer group hover:border-[#DF5A49]/50 transition-all"
      >
        <div className="w-full flex items-center justify-between text-xs text-[#7A6F73]">
          <span className="font-medium">Bone Shield</span>
          <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
        </div>

        <div className="relative w-[136px] h-[78px] mt-1">
          <svg viewBox="0 0 136 78" className="w-full h-full">
            {arcDots.map((dot) => (
              <circle
                key={dot.key}
                cx={dot.x}
                cy={dot.y}
                r="3.2"
                fill={dot.active ? '#DF5A49' : '#EAE3DF'}
              />
            ))}
          </svg>
        </div>

        <div>
          <div className="text-3xl font-light text-[#1A1517] tabular-nums">
            {boneScore}
            <span className="text-sm text-[#7A6F73]">/100</span>
          </div>
          <div className="text-[11px] text-[#7A6F73] mt-0.5">
            {checkin?.exerciseMinutes ?? 60}m ARED · Estrogen Buffer
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
            className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
              isPillTaken
                ? 'bg-[#6B4C7A]/10 text-[#6B4C7A] border border-[#6B4C7A]/30 font-semibold'
                : 'bg-[#F9F7F5] hover:bg-[#F2ECE8] text-[#1A1517] border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Pill className={`w-3.5 h-3.5 shrink-0 ${isPillTaken ? 'text-[#6B4C7A]' : 'text-[#8E8286]'}`} /> 
              <span>OCP Regimen</span>
            </span>
            <span className={`font-mono-tech text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
              isPillTaken ? 'bg-[#6B4C7A] text-white' : 'bg-white border border-[#E8E2DD] text-[#7A6F73]'
            }`}>
              {isPillTaken ? <><Check className="w-3 h-3" /> TAKEN</> : 'PENDING'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}