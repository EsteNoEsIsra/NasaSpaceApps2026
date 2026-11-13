// ==============================================================================
// V.E.N.U.S. Vitals & Neuro-Endocrine Telemetry Monitor
// ==============================================================================

import React from 'react';
import { VitalMetrics, TriageLevel } from '../../types';
import { Activity, Eye, Droplet, Pill, Heart, Zap, ArrowUpRight } from 'lucide-react';

interface VitalsMonitorProps {
  metrics: VitalMetrics;
  triage: TriageLevel;
  onLogPill: () => void;
  onOpenCountermeasure: (category: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION') => void;
}

export const VitalsMonitor: React.FC<VitalsMonitorProps> = ({
  metrics,
  triage,
  onLogPill,
  onOpenCountermeasure,
}) => {
  const vsi = metrics.vascularStasisIndex;
  const isVsiHigh = vsi >= 70;
  const isVsiMedium = vsi >= 40 && vsi < 70;

  const isJugularSlow = metrics.jugularVeinVelocity < 8.0;
  const isIopHigh = Math.max(metrics.iopLeftEye, metrics.iopRightEye) >= 21.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* 1. VASCULAR STASIS INDEX (PRIMARY HERO CARD) */}
      <div className={`p-4 rounded-xl border transition-all ${
        isVsiHigh
          ? 'bg-red-950/40 border-hud-red shadow-[0_0_20px_rgba(255,51,102,0.25)]'
          : isVsiMedium
          ? 'bg-amber-950/30 border-hud-amber'
          : 'bg-space-900/80 border-space-800'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-4 h-4 ${isVsiHigh ? 'text-hud-red animate-pulse' : 'text-hud-cyan'}`} />
            <span className="font-semibold tracking-wider">VASCULAR STASIS INDEX</span>
          </div>
          <span className="text-[10px] bg-space-800 px-1.5 py-0.5 rounded text-cyan-300">VSI</span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-3xl font-mono font-black ${
            isVsiHigh ? 'text-hud-red' : isVsiMedium ? 'text-hud-amber' : 'text-hud-cyan'
          }`}>
            {vsi}%
          </span>
          <span className="text-xs font-mono text-slate-400">
            {isVsiHigh ? 'CRITICAL RISK' : isVsiMedium ? 'ELEVATED' : 'NOMINAL'}
          </span>
        </div>

        {/* Progress meter */}
        <div className="w-full bg-space-950 h-2 rounded-full mt-3 overflow-hidden border border-space-800">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              isVsiHigh ? 'bg-hud-red shadow-[0_0_10px_#ff3366]' : isVsiMedium ? 'bg-hud-amber' : 'bg-hud-cyan'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, vsi))}%` }}
          />
        </div>

        <p className="text-[11px] font-mono text-slate-400 mt-2.5">
          Cross-indexed: Estrogen Load ({metrics.estrogenLoadIndex}%) + Jugular Flow ({metrics.jugularVeinVelocity} cm/s) + Hydration.
        </p>
      </div>

      {/* 2. JUGULAR VEIN VELOCITY (DOPPLER) */}
      <div className={`p-4 rounded-xl border transition-all ${
        isJugularSlow ? 'bg-amber-950/30 border-hud-amber' : 'bg-space-900/80 border-space-800'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold tracking-wider">IJV DOPPLER VELOCITY</span>
          </div>
          <button
            onClick={() => onOpenCountermeasure('ULTRASOUND')}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
          >
            SCAN <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-3xl font-mono font-black ${
            metrics.jugularVeinVelocity <= 2.0 ? 'text-hud-red' : isJugularSlow ? 'text-hud-amber' : 'text-slate-100'
          }`}>
            {metrics.jugularVeinVelocity}
          </span>
          <span className="text-xs font-mono text-slate-400">cm/s</span>
          <span className="text-[11px] font-mono ml-auto text-slate-400">
            {metrics.jugularVeinVelocity <= 2.0 ? 'RETROGRADE/STASIS' : isJugularSlow ? 'SLUGGISH' : 'LAMINAR'}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-space-800 pt-2">
          <span>Target: &gt;15 cm/s</span>
          <span className="text-cyan-400 font-semibold">B-Mode + Spectral</span>
        </div>
      </div>

      {/* 3. INTRAOCULAR PRESSURE (SANS) */}
      <div className={`p-4 rounded-xl border transition-all ${
        isIopHigh ? 'bg-red-950/30 border-hud-red' : 'bg-space-900/80 border-space-800'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="font-semibold tracking-wider">INTRAOCULAR PRESSURE (SANS)</span>
          </div>
          <button
            onClick={() => onOpenCountermeasure('LBNP')}
            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
          >
            LBNP <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-3xl font-mono font-black ${isIopHigh ? 'text-hud-red' : 'text-slate-100'}`}>
            {Math.max(metrics.iopLeftEye, metrics.iopRightEye).toFixed(1)}
          </span>
          <span className="text-xs font-mono text-slate-400">mmHg</span>
          <span className="text-[11px] font-mono ml-auto text-slate-400">
            L: {metrics.iopLeftEye} | R: {metrics.iopRightEye}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-space-800 pt-2">
          <span>Nominal threshold: &lt; 20 mmHg</span>
          <span className={isIopHigh ? 'text-hud-red font-bold' : 'text-hud-green'}>
            {isIopHigh ? 'PAPILLEDEMA RISK' : 'NORMAL'}
          </span>
        </div>
      </div>

      {/* 4. ENDOCRINE CYCLE & ORAL SUPPRESSION */}
      <div className="p-4 rounded-xl border bg-space-900/80 border-space-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <div className="flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-purple-400" />
            <span className="font-semibold tracking-wider">ORAL CYCLE SUPPRESSION</span>
          </div>
          <span className="text-[10px] text-purple-300 bg-space-800 px-1.5 py-0.5 rounded">REGIMEN</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xs font-mono text-slate-400">Daily Pill Status:</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-base font-mono font-bold ${metrics.dailyPillTaken ? 'text-hud-green' : 'text-hud-amber'}`}>
                {metrics.dailyPillTaken ? 'LOGGED (NOMINAL)' : 'PENDING DOSE'}
              </span>
            </div>
          </div>
          <button
            onClick={onLogPill}
            disabled={metrics.dailyPillTaken}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all border ${
              metrics.dailyPillTaken
                ? 'bg-space-800 text-slate-500 border-space-700 cursor-not-allowed'
                : 'bg-purple-900/70 hover:bg-purple-800 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
            }`}
          >
            {metrics.dailyPillTaken ? 'TAKEN' : 'LOG [P]'}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-space-800 pt-2">
          <span>Estrogenic Load: <strong className="text-purple-300">{metrics.estrogenLoadIndex}%</strong></span>
          <span>Progestin: Steady</span>
        </div>
      </div>

      {/* 5. HYDRATION & PLASMA VOLUME */}
      <div className="p-4 rounded-xl border bg-space-900/80 border-space-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <div className="flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold tracking-wider">HYDRATION & HEMOCONCENTRATION</span>
          </div>
          <button
            onClick={() => onOpenCountermeasure('HYDRATION')}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
          >
            FLUIDS <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-3xl font-mono font-black ${
            metrics.hydrationDeficitPct > 15 ? 'text-hud-amber' : 'text-slate-100'
          }`}>
            -{metrics.hydrationDeficitPct}%
          </span>
          <span className="text-xs font-mono text-slate-400">DEFICIT</span>
          <span className="text-[11px] font-mono ml-auto text-slate-400">
            {metrics.hydrationDeficitPct > 15 ? 'HYPOVOLEMIA RISK' : 'OPTIMAL'}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-space-800 pt-2">
          <span>Target: &lt; 8% deficit</span>
          <span className="text-cyan-400">Electrolyte Balance: 98%</span>
        </div>
      </div>

      {/* 6. CARDIAC & CABIN PERFUSION */}
      <div className="p-4 rounded-xl border bg-space-900/80 border-space-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-hud-red" />
            <span className="font-semibold tracking-wider">CARDIAC & OXYGENATION</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">CONTINUOUS</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <span className="text-[10px] font-mono text-slate-500">HEART RATE</span>
            <div className="text-2xl font-mono font-black text-slate-100">{metrics.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span></div>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500">BLOOD PRESSURE</span>
            <div className="text-2xl font-mono font-black text-slate-100">{metrics.bloodPressureSys}/{metrics.bloodPressureDia}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-space-800 pt-2">
          <span>SpO₂: <strong className="text-hud-green">{metrics.spO2}%</strong></span>
          <span>Temp: <strong className="text-slate-200">{metrics.tempCelsius}°C</strong></span>
        </div>
      </div>
    </div>
  );
};
