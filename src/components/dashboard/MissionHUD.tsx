// ==============================================================================
// V.E.N.U.S. Architectural Mission Header
// Designed with editorial restraint and aerospace engineering precision
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { AstronautProfile, TriageLevel, VitalMetrics } from '../../types';
import { Radio, ShieldCheck, Clock, Wind, Radiation } from 'lucide-react';

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
    return `T+${astronaut.missionDay}D ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTriageIndicator = () => {
    switch (triage) {
      case 'CRITICAL_THROMBUS':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-clinical-coral/10 border border-clinical-coral/30 text-clinical-coral text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-clinical-coral animate-ping" />
            <span className="font-medium tracking-wide">STATUS: IJV STASIS / INTERVENTION REQUIRED</span>
          </div>
        );
      case 'WARNING_SANS':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-clinical-honey/10 border border-clinical-honey/30 text-clinical-honey text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-clinical-honey" />
            <span className="font-medium tracking-wide">STATUS: SANS CEPHALIC CONGESTION</span>
          </div>
        );
      case 'CAUTION_STASIS':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-clinical-honey/10 border border-clinical-honey/20 text-clinical-honey/90 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-clinical-honey/70" />
            <span className="font-medium tracking-wide">STATUS: MILD VENOUS SLUGGISHNESS</span>
          </div>
        );
      case 'NOMINAL':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-clinical-sage/10 border border-clinical-sage/30 text-clinical-sage text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-clinical-sage" />
            <span className="font-medium tracking-wide">STATUS: FLIGHT HOMEOSTASIS NOMINAL</span>
          </div>
        );
    }
  };

  return (
    <header className="w-full bg-canvas-subtle/95 border-b border-border-hairline sticky top-0 z-30 px-5 py-3 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="font-sans font-bold text-base tracking-wider text-ink">
                V.E.N.U.S.
              </span>
              <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-white/[0.05] text-ink-muted border border-border-hairline">
                NASA CLASS-A
              </span>
            </div>
            <span className="text-[11px] text-ink-muted tracking-tight font-normal">
              Autonomous Neuro-Endocrine & Vascular Telemetry · <span className="text-ink font-medium">{astronaut.name}</span>
            </span>
          </div>
        </div>

        {/* Flight telemetry row */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
          {/* Earth Latency Warning (Edge Justification) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas-card border border-border-hairline text-xs font-mono text-ink-muted">
            <Radio className="w-3.5 h-3.5 text-clinical-honey" />
            <span>EARTH LATENCY:</span>
            <span className="text-ink font-medium">14m 22s</span>
          </div>

          {/* Cabin Atmosphere */}
          <div className="hidden lg:flex items-center gap-3 px-2.5 py-1 rounded bg-canvas-card border border-border-hairline text-xs font-mono text-ink-muted">
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-ink-subtle" />
              <span>CO₂:</span>
              <span className="text-ink font-medium">{metrics.cabinCO2mmHg.toFixed(1)} mmHg</span>
            </div>
            <div className="flex items-center gap-1">
              <Radiation className="w-3.5 h-3.5 text-ink-subtle" />
              <span>RAD:</span>
              <span className="text-ink font-medium">{metrics.radiationCumulativeMSv.toFixed(1)} mSv</span>
            </div>
          </div>

          {/* Mission MET */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas-card border border-border-hairline text-xs font-mono text-ink-muted">
            <Clock className="w-3.5 h-3.5 text-clinical-titanium" />
            <span className="text-ink font-medium">{formatMET(metSeconds)}</span>
          </div>

          {/* Triage indicator */}
          {getTriageIndicator()}

          {/* Audit Trail Drawer Trigger */}
          <button
            onClick={onOpenAuditDrawer}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-white/[0.04] hover:bg-white/[0.08] text-ink-muted hover:text-ink border border-border-hairline transition-colors"
            title="Inspect NASA Class-A Verifiable Audit Trace"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-clinical-sage" />
            <span>AUDIT TRACE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
