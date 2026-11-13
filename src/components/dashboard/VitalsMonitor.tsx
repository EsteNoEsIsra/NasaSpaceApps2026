// ==============================================================================
// V.E.N.U.S. Telemetry Monitor (Precision Swiss Biomedical Cards)
// ==============================================================================

import React from 'react';
import { VitalMetrics, TriageLevel } from '../../types';
import { Activity, Eye, Droplet, Heart, Zap, ArrowUpRight, Check } from 'lucide-react';

interface VitalsMonitorProps {
  metrics: VitalMetrics;
  triage: TriageLevel;
  onLogPill: () => void;
  onOpenCountermeasure: (category: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION') => void;
}

export const VitalsMonitor: React.FC<VitalsMonitorProps> = ({
  metrics,
  onLogPill,
  onOpenCountermeasure,
}) => {
  const vsi = metrics.vascularStasisIndex;
  const isVsiHigh = vsi >= 70;
  const isVsiMedium = vsi >= 40 && vsi < 70;
  const isIopHigh = Math.max(metrics.iopLeftEye, metrics.iopRightEye) >= 21;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* 1. VASCULAR STASIS INDEX (PRIMARY HERO METRIC) */}
      <div className={`p-4 rounded-xl border transition-all ${
        isVsiHigh
          ? 'bg-clinical-coral/5 border-clinical-coral/40'
          : isVsiMedium
          ? 'bg-clinical-honey/5 border-clinical-honey/30'
          : 'bg-canvas-card border-border-hairline shadow-fine'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${isVsiHigh ? 'text-clinical-coral' : 'text-clinical-sage'}`} />
            <span className="font-medium text-ink">VASCULAR STASIS INDEX</span>
          </div>
          <span className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded text-ink-muted border border-border-hairline">
            VSI
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`text-3xl font-mono font-bold tracking-tight ${
            isVsiHigh ? 'text-clinical-coral' : isVsiMedium ? 'text-clinical-honey' : 'text-ink'
          }`}>
            {vsi}%
          </span>
          <span className="text-xs font-mono text-ink-muted">
            {isVsiHigh ? 'CRITICAL HAZARD' : isVsiMedium ? 'SLUGGISH' : 'LAMINAR'}
          </span>
        </div>

        {/* Minimalist Micro Bar */}
        <div className="w-full bg-canvas h-1.5 rounded-full mt-3 overflow-hidden border border-border-hairline">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isVsiHigh ? 'bg-clinical-coral' : isVsiMedium ? 'bg-clinical-honey' : 'bg-clinical-sage'
            }`}
            style={{ width: `${Math.min(100, Math.max(4, vsi))}%` }}
          />
        </div>

        <p className="text-[11px] font-mono text-ink-muted mt-2.5">
          Deterministic cross-index: Jugular velocity ({metrics.jugularVeinVelocity} cm/s) + Estrogen burden ({metrics.estrogenLoadIndex}%).
        </p>
      </div>

      {/* 2. ORAL SUPPRESSION & CYCLE TIMING */}
      <div className="p-4 rounded-xl border bg-canvas-card border-border-hairline shadow-fine flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
            <span className="font-medium text-ink">ORAL SUPPRESSION CYCLE</span>
            <span className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded text-ink-muted border border-border-hairline">
              24H REGIMEN
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-xs font-mono">
              Daily Dose Adherence:
              <div className="mt-1 flex items-center gap-1.5">
                {metrics.dailyPillTaken ? (
                  <span className="text-clinical-sage font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>LOGGED · HORMONAL STEADY-STATE</span>
                  </span>
                ) : (
                  <span className="text-clinical-honey font-medium">SCHEDULED DUE · ACTION REQUIRED</span>
                )}
              </div>
            </div>
            <p className="text-[11px] font-mono text-ink-muted mt-1.5">
              Active progestin load: <strong className="text-ink">{metrics.estrogenLoadIndex}%</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={onLogPill}
          disabled={metrics.dailyPillTaken}
          className={`mt-3 w-full py-2 px-3 text-xs font-mono font-medium rounded transition-all border ${
            metrics.dailyPillTaken
              ? 'bg-white/[0.03] text-ink-subtle border-border-hairline cursor-default'
              : 'bg-white/[0.08] hover:bg-white/[0.14] text-ink border-border-subtle shadow-fine'
          }`}
        >
          {metrics.dailyPillTaken ? 'DOSE RECORDED ✓' : 'RECORD DAILY DOSE [P]'}
        </button>
      </div>

      {/* 3. INTERNAL JUGULAR DOPPLER VELOCITY */}
      <div className="p-4 rounded-xl border bg-canvas-card border-border-hairline shadow-fine flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-clinical-sage" />
              <span className="font-medium text-ink">IJV DOPPLER VELOCITY</span>
            </div>
            <button
              onClick={() => onOpenCountermeasure('ULTRASOUND')}
              className="text-[10px] text-ink-muted hover:text-ink flex items-center gap-0.5"
            >
              SCAN <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-mono font-bold tracking-tight ${
              metrics.jugularVeinVelocity <= 2.0 ? 'text-clinical-coral' : metrics.jugularVeinVelocity < 8.0 ? 'text-clinical-honey' : 'text-ink'
            }`}>
              {metrics.jugularVeinVelocity}
            </span>
            <span className="text-xs font-mono text-ink-muted">cm/s</span>
            <span className="text-xs font-mono text-ink-muted ml-auto">
              {metrics.jugularVeinVelocity <= 2.0 ? 'RETROGRADE/STASIS' : metrics.jugularVeinVelocity < 8.0 ? 'SLUGGISH' : 'FORWARD LAMINAR'}
            </span>
          </div>

          <p className="text-[11px] font-mono text-ink-muted mt-2">
            Venous return from cerebral circulation to central vena cava.
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-border-hairline flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <span>Threshold: &gt;15 cm/s</span>
          <span className="text-clinical-sage">Spectral Doppler Active</span>
        </div>
      </div>

      {/* 4. INTRAOCULAR PRESSURE (SANS) */}
      <div className="p-4 rounded-xl border bg-canvas-card border-border-hairline shadow-fine flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-clinical-honey" />
              <span className="font-medium text-ink">INTRAOCULAR PRESSURE</span>
            </div>
            <button
              onClick={() => onOpenCountermeasure('LBNP')}
              className="text-[10px] text-ink-muted hover:text-ink flex items-center gap-0.5"
            >
              LBNP <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-mono font-bold tracking-tight ${isIopHigh ? 'text-clinical-coral' : 'text-ink'}`}>
              {Math.max(metrics.iopLeftEye, metrics.iopRightEye).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-ink-muted">mmHg</span>
            <span className="text-xs font-mono text-ink-muted ml-auto">
              L: {metrics.iopLeftEye} · R: {metrics.iopRightEye}
            </span>
          </div>

          <p className="text-[11px] font-mono text-ink-muted mt-2">
            SANS optic nerve sheath diameter & posterior globe flattening risk.
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-border-hairline flex items-center justify-between text-[11px] font-mono">
          <span className="text-ink-muted">Limit: &lt; 20 mmHg</span>
          <span className={isIopHigh ? 'text-clinical-coral font-medium' : 'text-clinical-sage font-medium'}>
            {isIopHigh ? 'PAPILLEDEMA RISK' : 'NORMAL GRADIENT'}
          </span>
        </div>
      </div>

      {/* 5. HYDRATION DEFICIT & PLASMA VOLUME */}
      <div className="p-4 rounded-xl border bg-canvas-card border-border-hairline shadow-fine flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
            <div className="flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-ink-muted" />
              <span className="font-medium text-ink">PLASMA HYDRATION DEFICIT</span>
            </div>
            <button
              onClick={() => onOpenCountermeasure('HYDRATION')}
              className="text-[10px] text-ink-muted hover:text-ink flex items-center gap-0.5"
            >
              SALINE <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-mono font-bold tracking-tight ${metrics.hydrationDeficitPct > 15 ? 'text-clinical-honey' : 'text-ink'}`}>
              -{metrics.hydrationDeficitPct}%
            </span>
            <span className="text-xs font-mono text-ink-muted">DEFICIT</span>
            <span className="text-xs font-mono text-ink-muted ml-auto">
              {metrics.hydrationDeficitPct > 15 ? 'ELEVATED VISCOSITY' : 'EUVOLEMIC'}
            </span>
          </div>

          <p className="text-[11px] font-mono text-ink-muted mt-2">
            Electrolyte balance prevents microgravity hemoconcentration & thrombosis.
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-border-hairline flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <span>Tolerance: &lt; 10% deficit</span>
          <span className="text-ink">Mineral Salts: Balanced</span>
        </div>
      </div>

      {/* 6. CARDIAC PUMP & PERFUSION */}
      <div className="p-4 rounded-xl border bg-canvas-card border-border-hairline shadow-fine flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-clinical-titanium" />
              <span className="font-medium text-ink">CARDIAC OUTPUT</span>
            </div>
            <span className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded text-ink-muted border border-border-hairline">
              TELEMETRY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-[10px] font-mono text-ink-subtle">HEART RATE</span>
              <div className="text-2xl font-mono font-bold text-ink">{metrics.heartRate} <span className="text-xs font-normal text-ink-muted">bpm</span></div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-ink-subtle">BLOOD PRESSURE</span>
              <div className="text-2xl font-mono font-bold text-ink">{metrics.bloodPressureSys}/{metrics.bloodPressureDia}</div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-border-hairline flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <span>SpO₂: <strong className="text-clinical-sage">{metrics.spO2}%</strong></span>
          <span>Core Temp: <strong className="text-ink">{metrics.tempCelsius}°C</strong></span>
        </div>
      </div>
    </div>
  );
};
