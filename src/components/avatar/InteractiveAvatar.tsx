// ==============================================================================
// V.E.N.U.S. Precision Anatomical Vector Blueprint
// High-taste aerospace medical illustration with Dieter Rams & Swiss design restraint
// ==============================================================================

import React, { useState } from 'react';
import { BodyLayer, VitalMetrics } from '../../types';
import { Activity, Eye, Compass, Heart, ArrowUpRight } from 'lucide-react';

interface InteractiveAvatarProps {
  metrics: VitalMetrics;
  activeLayer: BodyLayer;
  onOpenCountermeasure: (category: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION') => void;
}

export type OrganId = 'ENDOCRINE' | 'JUGULAR' | 'OCULAR' | 'HEART' | 'FEMORAL';

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  metrics,
  activeLayer,
  onOpenCountermeasure,
}) => {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganId>('ENDOCRINE');

  const isJugularSlow = metrics.jugularVeinVelocity < 8.0;
  const isJugularCritical = metrics.jugularVeinVelocity <= 2.0;
  const jugularStroke = isJugularCritical ? '#d25d52' : isJugularSlow ? '#d99b43' : '#38b293';

  const isOcularHigh = Math.max(metrics.iopLeftEye, metrics.iopRightEye) >= 21;
  const ocularStroke = isOcularHigh ? '#d25d52' : '#dfdbd4';

  const showVascular = activeLayer === 'ALL' || activeLayer === 'VASCULAR';
  const showOcular = activeLayer === 'ALL' || activeLayer === 'OCULAR';
  const showEndocrine = activeLayer === 'ALL' || activeLayer === 'ENDOCRINE';

  return (
    <div className="relative flex flex-col items-center justify-between p-5 bg-canvas-card border border-border-hairline rounded-xl shadow-fine min-h-[530px]">
      {/* Precision Blueprint Coordinate Header */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-ink-muted border-b border-border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-clinical-sage" />
          <span className="tracking-wider text-ink uppercase">Bio-Topography Blueprint</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span>GRID: 0.5 mm</span>
          <span className="text-border-subtle">|</span>
          <span>SCALE: 1:10</span>
        </div>
      </div>

      {/* Anatomical Blueprint SVG */}
      <div className="relative w-full h-[360px] max-w-[270px] my-2 flex items-center justify-center">
        {/* Subtle coordinate crosshairs */}
        <div className="absolute top-2 left-2 text-[9px] font-mono text-ink-subtle select-none">+00.00</div>
        <div className="absolute top-2 right-2 text-[9px] font-mono text-ink-subtle select-none">+28.40</div>
        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-ink-subtle select-none">-48.00</div>
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-ink-subtle select-none">-00.00</div>

        <svg
          viewBox="0 0 280 480"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 1. Precision Wireframe Contours (Minimal Titanium Stroke) */}
          <g stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" fill="none">
            {/* Cranium */}
            <circle cx="140" cy="55" r="30" strokeDasharray="3 3" />
            <line x1="140" y1="20" x2="140" y2="90" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2 2" />

            {/* Neck & Cervical Triangle */}
            <path d="M 133 85 L 133 115 L 147 115 L 147 85" />

            {/* Torso & Shoulder Geometry */}
            <path d="M 133 115 C 110 120 90 135 88 160 L 96 235 C 102 260 114 275 114 315 L 105 450" />
            <path d="M 147 115 C 170 120 190 135 192 160 L 184 235 C 178 260 166 275 166 315 L 175 450" />

            {/* Midline Reference */}
            <line x1="140" y1="115" x2="140" y2="340" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4 4" />
          </g>

          {/* 2. VASCULAR SYSTEM (Internal Jugular, Heart, Femoral) */}
          {showVascular && (
            <g id="vascular-system" className="transition-all duration-300">
              {/* Internal Jugular Veins (Neck Left & Right) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('JUGULAR')}
              >
                {/* Right Jugular */}
                <path
                  d="M 135 70 Q 134 95 136 120"
                  stroke={jugularStroke}
                  strokeWidth={isJugularCritical ? "3.5" : "2"}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Left Jugular */}
                <path
                  d="M 145 70 Q 146 95 144 120"
                  stroke={jugularStroke}
                  strokeWidth={isJugularCritical ? "3.5" : "2"}
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Hotspot Target Callout */}
                <circle cx="140" cy="95" r="10" stroke={jugularStroke} strokeWidth="1" strokeDasharray="2 2" fill="none" />
                <circle cx="140" cy="95" r="3" fill={jugularStroke} />
              </g>

              {/* Heart & Central Venous Axis */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('HEART')}
              >
                <circle cx="140" cy="165" r="10" stroke="#dfdbd4" strokeWidth="1.2" fill="rgba(223, 219, 212, 0.1)" />
                <circle cx="140" cy="165" r="3" fill="#dfdbd4" />
                <line x1="140" y1="120" x2="140" y2="155" stroke="#38b293" strokeWidth="1.5" />
              </g>

              {/* Femoral Bed (Lower Extremity Venous Return) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('FEMORAL')}
              >
                <path d="M 130 320 L 118 420" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 150 320 L 162 420" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="118" cy="370" r="3" fill="rgba(255, 255, 255, 0.4)" />
                <circle cx="162" cy="370" r="3" fill="rgba(255, 255, 255, 0.4)" />
              </g>
            </g>
          )}

          {/* 3. OCULAR SYSTEM (Optic Nerve Sheath & SANS) */}
          {showOcular && (
            <g
              id="ocular-system"
              className="cursor-pointer group transition-all duration-300"
              onClick={() => setSelectedOrgan('OCULAR')}
            >
              <circle cx="132" cy="52" r="4.5" stroke={ocularStroke} strokeWidth="1.5" fill="none" />
              <circle cx="148" cy="52" r="4.5" stroke={ocularStroke} strokeWidth="1.5" fill="none" />
              <line x1="132" y1="56" x2="140" y2="65" stroke={ocularStroke} strokeWidth="1" />
              <line x1="148" y1="56" x2="140" y2="65" stroke={ocularStroke} strokeWidth="1" />
              {isOcularHigh && (
                <circle cx="140" cy="54" r="14" stroke="#d25d52" strokeWidth="1" strokeDasharray="2 2" fill="none" />
              )}
            </g>
          )}

          {/* 4. ENDOCRINE SYSTEM (Pituitary Axis & Ovarian Depot) */}
          {showEndocrine && (
            <g
              id="endocrine-system"
              className="cursor-pointer group transition-all duration-300"
              onClick={() => setSelectedOrgan('ENDOCRINE')}
            >
              {/* Pituitary Master Gland in Cranium */}
              <circle cx="140" cy="42" r="3" fill="#dfdbd4" />
              <circle cx="140" cy="42" r="7" stroke="#dfdbd4" strokeWidth="1" strokeDasharray="2 2" fill="none" />

              {/* Pelvic Hormonal Receptor Sites */}
              <g transform="translate(140, 260)">
                <circle cx="-16" cy="0" r="4" stroke="#dfdbd4" strokeWidth="1.2" fill="rgba(223, 219, 212, 0.15)" />
                <circle cx="16" cy="0" r="4" stroke="#dfdbd4" strokeWidth="1.2" fill="rgba(223, 219, 212, 0.15)" />
                <path d="M -12 0 L 12 0" stroke="#dfdbd4" strokeWidth="1" strokeDasharray="2 2" />

                {/* Suppression Pill Depot Token */}
                <rect
                  x="-8"
                  y="-16"
                  width="16"
                  height="8"
                  rx="2"
                  fill={metrics.dailyPillTaken ? '#38b293' : '#d25d52'}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Selected Organ Detail Callout (Minimalist High-Signal Bar) */}
      <div className="w-full mt-2 pt-3 border-t border-border-hairline bg-canvas-elevated/70 rounded-lg p-3 text-xs font-mono">
        {selectedOrgan === 'ENDOCRINE' && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-ink font-medium">
                <Compass className="w-3.5 h-3.5 text-clinical-titanium" />
                <span>ENDOCRINE AXIS & ORAL SUPPRESSION</span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Load: <strong className="text-ink">{metrics.estrogenLoadIndex}%</strong> · Cycle Suppression:{' '}
                <strong className={metrics.dailyPillTaken ? 'text-clinical-sage' : 'text-clinical-coral'}>
                  {metrics.dailyPillTaken ? 'ADHERENT' : 'PENDING DOSE'}
                </strong>
              </p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('PHARMA')}
              className="px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-ink border border-border-subtle rounded transition-all flex items-center gap-1 text-[11px]"
            >
              <span>REGIMEN</span>
              <ArrowUpRight className="w-3 h-3 text-ink-muted" />
            </button>
          </div>
        )}

        {selectedOrgan === 'JUGULAR' && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-ink font-medium">
                <Activity className="w-3.5 h-3.5 text-clinical-sage" />
                <span>INTERNAL JUGULAR VEIN (IJV)</span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Velocity: <strong className={isJugularSlow ? 'text-clinical-coral' : 'text-clinical-sage'}>{metrics.jugularVeinVelocity} cm/s</strong>
                {isJugularSlow ? ' (STASIS HAZARD)' : ' (LAMINAR DRAINAGE)'}
              </p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('ULTRASOUND')}
              className="px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-ink border border-border-subtle rounded transition-all flex items-center gap-1 text-[11px]"
            >
              <span>ULTRASOUND</span>
              <ArrowUpRight className="w-3 h-3 text-ink-muted" />
            </button>
          </div>
        )}

        {selectedOrgan === 'OCULAR' && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-ink font-medium">
                <Eye className="w-3.5 h-3.5 text-clinical-honey" />
                <span>OPTIC SHEATH & INTRAOCULAR PRESSURE</span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                IOP L/R: <strong className={isOcularHigh ? 'text-clinical-coral' : 'text-ink'}>{metrics.iopLeftEye} / {metrics.iopRightEye} mmHg</strong> (Threshold: &lt;20)
              </p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('LBNP')}
              className="px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-ink border border-border-subtle rounded transition-all flex items-center gap-1 text-[11px]"
            >
              <span>LBNP DECOMPRESS</span>
              <ArrowUpRight className="w-3 h-3 text-ink-muted" />
            </button>
          </div>
        )}

        {selectedOrgan === 'HEART' && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-ink font-medium">
                <Heart className="w-3.5 h-3.5 text-clinical-titanium" />
                <span>CARDIAC PUMP & CABIN PERFUSION</span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Heart Rate: <strong className="text-ink">{metrics.heartRate} bpm</strong> · Blood Pressure: {metrics.bloodPressureSys}/{metrics.bloodPressureDia} mmHg
              </p>
            </div>
            <span className="text-[10px] text-clinical-sage font-medium">NOMINAL PERFUSION</span>
          </div>
        )}

        {selectedOrgan === 'FEMORAL' && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-ink font-medium">
                <Activity className="w-3.5 h-3.5 text-ink-muted" />
                <span>LOWER EXTREMITY BED (DVT PRECAUTION)</span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Fluid translocation baseline normal. No unilateral edema detected.
              </p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('HYDRATION')}
              className="px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-ink border border-border-subtle rounded transition-all text-[11px]"
            >
              HYDRATION
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
