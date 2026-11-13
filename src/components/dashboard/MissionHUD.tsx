// ==============================================================================
// V.E.N.U.S. Mission Tactical HUD Header
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { AstronautProfile, TriageLevel, VitalMetrics } from '../../types';
import { Radio, AlertTriangle, ShieldCheck, Clock, Compass, Activity, Wind } from 'lucide-react';

interface MissionHUDProps {
  astronaut: AstronautProfile;
  triage: TriageLevel;
  metrics: VitalMetrics;
  onOpenAuditDrawer: () => void;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({
  astronaut,
  triage,
  metrics,
  onOpenAuditDrawer,
}) => {
  const [metSeconds, setMetSeconds] = useState(14 * 3600 + 48 * 60 + 12);

  // Tick MET clock
  useEffect(() => {
    const timer = setInterval(() => {
      setMetSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMET = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600) % 24;
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `DAY ${astronaut.missionDay} — ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTriageBadge = () => {
    switch (triage) {
      case 'CRITICAL_THROMBUS':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/80 border border-hud-red text-hud-red rounded-lg animate-pulse">
            <AlertTriangle className="w-4 h-4 text-hud-red" />
            <span className="font-mono font-bold text-xs tracking-wider">LEVEL 3: CRITICAL STASIS / THROMBUS HAZARD</span>
          </div>
        );
      case 'WARNING_SANS':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/80 border border-hud-amber text-hud-amber rounded-lg">
            <AlertTriangle className="w-4 h-4 text-hud-amber" />
            <span className="font-mono font-bold text-xs tracking-wider">LEVEL 2: SANS ELEVATION DETECTED</span>
          </div>
        );
      case 'CAUTION_STASIS':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-950/70 border border-yellow-500 text-yellow-300 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="font-mono font-bold text-xs tracking-wider">LEVEL 1: MODERATE VENOUS STASIS</span>
          </div>
        );
      case 'NOMINAL':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-hud-green text-hud-green rounded-lg">
            <ShieldCheck className="w-4 h-4 text-hud-green" />
            <span className="font-mono font-bold text-xs tracking-wider">LEVEL 0: NOMINAL FLIGHT HOMEOSTASIS</span>
          </div>
        );
    }
  };

  return (
    <header className="w-full bg-space-900/95 border-b border-space-800 backdrop-blur sticky top-0 z-30 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Mission Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-cyan-300">
            <Activity className="w-6 h-6 text-space-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-white">
                V.E.N.U.S.
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-800 text-cyan-300 border border-space-700">
                NASA CLASS-A
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Visual Engine for Neuro-endocrine & Universal Systems
            </p>
          </div>
        </div>

        {/* Telemetry Status Pill & Mission Clock */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Earth Latency Warning (Justifies Edge Computing) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-space-850 border border-space-700 rounded-lg text-[11px] font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>EARTH LATENCY:</span>
            <span className="text-amber-300 font-bold">14m 22s (EDGE AUTONOMOUS)</span>
          </div>

          {/* Cabin Atmosphere */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1 bg-space-850 border border-space-700 rounded-lg text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-1" title="Cabin CO2 level in mmHg">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>CO₂:</span>
              <span className={`font-bold ${metrics.cabinCO2mmHg > 3.5 ? 'text-hud-red' : 'text-slate-100'}`}>
                {metrics.cabinCO2mmHg.toFixed(1)} mmHg
              </span>
            </div>
            <div className="flex items-center gap-1" title="Cumulative Radiation">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>RAD:</span>
              <span className="text-slate-100 font-bold">{metrics.radiationCumulativeMSv.toFixed(1)} mSv</span>
            </div>
          </div>

          {/* MET Clock */}
          <div className="flex items-center gap-2 px-3 py-1 bg-space-850 border border-space-700 rounded-lg text-xs font-mono text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-cyan-300">{formatMET(metSeconds)}</span>
          </div>

          {/* Dynamic Triage Pill */}
          {getTriageBadge()}

          {/* Class-A Audit Drawer Trigger */}
          <button
            onClick={onOpenAuditDrawer}
            className="px-2.5 py-1.5 text-xs font-mono bg-space-800 hover:bg-space-700 border border-space-600 hover:border-cyan-400 text-slate-200 rounded-lg transition-all"
            title="Open Class-A Verifiable Execution Trace"
          >
            AUDIT TRACE
          </button>
        </div>
      </div>
    </header>
  );
};
