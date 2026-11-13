// ==============================================================================
// V.E.N.U.S. Multi-layer Vector Anatomical Avatar
// Interactive SVG displaying Vascular, Ocular, and Endocrine sub-systems
// ==============================================================================

import React, { useState } from 'react';
import { BodyLayer, VitalMetrics, TriageLevel } from '../../types';
import { Activity, Eye, ShieldAlert, Heart, Zap } from 'lucide-react';

interface InteractiveAvatarProps {
  metrics: VitalMetrics;
  triage: TriageLevel;
  activeLayer: BodyLayer;
  onOpenCountermeasure: (category: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION') => void;
}

export type OrganId = 'JUGULAR' | 'OCULAR' | 'HEART' | 'ENDOCRINE' | 'FEMORAL';

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  metrics,
  triage,
  activeLayer,
  onOpenCountermeasure,
}) => {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganId | null>('JUGULAR');

  // Dynamic colors depending on triage and values
  const isJugularCritical = metrics.jugularVeinVelocity <= 2.0;
  const isJugularCaution = metrics.jugularVeinVelocity < 10.0;
  const jugularColor = isJugularCritical ? '#ff3366' : isJugularCaution ? '#fbbf24' : '#00f2fe';

  const isOcularCritical = Math.max(metrics.iopLeftEye, metrics.iopRightEye) >= 22;
  const ocularColor = isOcularCritical ? '#ff3366' : '#38bdf8';

  const showVascular = activeLayer === 'ALL' || activeLayer === 'VASCULAR';
  const showOcular = activeLayer === 'ALL' || activeLayer === 'OCULAR';
  const showEndocrine = activeLayer === 'ALL' || activeLayer === 'ENDOCRINE';

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-space-900/80 border border-space-800 rounded-xl overflow-hidden backdrop-blur shadow-2xl h-[530px]">
      {/* Background Cyber Grid / Radar Rings */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-space-800/30 via-space-950/80 to-space-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#15203b0a_1px,transparent_1px),linear-gradient(to_bottom,#15203b0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Top Scanner Header */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 z-10 border-b border-space-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping-slow" />
          <span className="text-cyan-300 font-semibold uppercase tracking-wider">BIO-TELEMETRY WIREFRAME</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">LAYER:</span>
          <span className="text-white font-bold bg-space-800 px-2 py-0.5 rounded border border-space-700">
            {activeLayer}
          </span>
        </div>
      </div>

      {/* SVG ANATOMICAL WIREFRAME */}
      <div className="relative w-full h-[380px] max-w-[280px] mt-6 flex items-center justify-center">
        <svg
          viewBox="0 0 300 500"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(0,242,254,0.15)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyOutline" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2e54" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0a0e1a" stopOpacity="0.3" />
            </linearGradient>

            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="dangerGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Base Silhouette / Wireframe */}
          <g opacity="0.35" stroke="#38bdf8" strokeWidth="1.2" fill="url(#bodyOutline)">
            {/* Cranium */}
            <circle cx="150" cy="55" r="32" strokeDasharray="4 2" />
            {/* Neck */}
            <path d="M 140 85 L 140 105 L 160 105 L 160 85" fill="none" />
            {/* Torso & Shoulders */}
            <path d="M 100 120 C 120 105 180 105 200 120 L 195 240 C 185 260 115 260 105 240 Z" />
            {/* Arms */}
            <path d="M 100 120 L 70 210 L 55 290" strokeDasharray="3 3" fill="none" />
            <path d="M 200 120 L 230 210 L 245 290" strokeDasharray="3 3" fill="none" />
            {/* Pelvis & Legs */}
            <path d="M 115 255 L 105 370 L 98 470" strokeDasharray="4 2" fill="none" />
            <path d="M 185 255 L 195 370 L 202 470" strokeDasharray="4 2" fill="none" />
          </g>

          {/* 2. VASCULAR LAYER (Internal Jugular, Heart, Vena Cava, Femoral) */}
          {showVascular && (
            <g id="vascular-layer" className="transition-all duration-500">
              {/* Internal Jugular Veins (Neck left & right) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('JUGULAR')}
              >
                {/* Right Jugular */}
                <path
                  d="M 143 65 Q 142 85 145 115"
                  stroke={jugularColor}
                  strokeWidth={isJugularCritical ? "5" : "3.5"}
                  fill="none"
                  strokeLinecap="round"
                  filter={isJugularCritical ? "url(#dangerGlow)" : "url(#cyanGlow)"}
                  className={isJugularCritical ? "animate-pulse-fast" : ""}
                />
                {/* Left Jugular */}
                <path
                  d="M 157 65 Q 158 85 155 115"
                  stroke={jugularColor}
                  strokeWidth={isJugularCritical ? "5" : "3.5"}
                  fill="none"
                  strokeLinecap="round"
                  filter={isJugularCritical ? "url(#dangerGlow)" : "url(#cyanGlow)"}
                  className={isJugularCritical ? "animate-pulse-fast" : ""}
                />

                {/* Stasis Alert Ring if flow sluggish */}
                {isJugularCritical && (
                  <circle cx="150" cy="90" r="14" stroke="#ff3366" strokeWidth="2" fill="none" className="animate-ping-slow" />
                )}

                {/* Hotspot anchor */}
                <circle cx="150" cy="90" r="5" fill={jugularColor} className="hover:scale-125 transition-transform" />
              </g>

              {/* Heart & Central Vena Cava */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('HEART')}
              >
                <path d="M 150 115 L 150 160" stroke="#00f2fe" strokeWidth="3" fill="none" opacity="0.8" />
                <circle cx="150" cy="160" r="12" fill="#ff3366" opacity="0.8" className="animate-pulse" />
                <circle cx="150" cy="160" r="16" stroke="#ff3366" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
              </g>

              {/* Femoral & Iliac Veins (DVT risk in microgravity) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('FEMORAL')}
              >
                <path d="M 150 240 L 125 340 L 115 420" stroke="#00f2fe" strokeWidth="2.5" fill="none" opacity="0.6" />
                <path d="M 150 240 L 175 340 L 185 420" stroke="#00f2fe" strokeWidth="2.5" fill="none" opacity="0.6" />
                <circle cx="125" cy="340" r="4" fill="#38bdf8" />
                <circle cx="175" cy="340" r="4" fill="#38bdf8" />
              </g>
            </g>
          )}

          {/* 3. OCULAR LAYER (SANS / Optic Nerve Sheath) */}
          {showOcular && (
            <g
              id="ocular-layer"
              className="cursor-pointer group transition-all duration-500"
              onClick={() => setSelectedOrgan('OCULAR')}
            >
              {/* Left & Right eyes */}
              <circle cx="140" cy="50" r="5.5" stroke={ocularColor} strokeWidth="2" fill="#0f172a" />
              <circle cx="160" cy="50" r="5.5" stroke={ocularColor} strokeWidth="2" fill="#0f172a" />
              <circle cx="140" cy="50" r="2.5" fill={ocularColor} />
              <circle cx="160" cy="50" r="2.5" fill={ocularColor} />

              {/* Optic chiasm convergence */}
              <path d="M 140 54 L 150 63 L 160 54" stroke={ocularColor} strokeWidth="1.5" fill="none" />

              {/* SANS Edema Indicator if IOP high */}
              {isOcularCritical && (
                <circle cx="150" cy="52" r="18" stroke="#ff3366" strokeWidth="1.5" fill="none" className="animate-ping-slow" />
              )}
            </g>
          )}

          {/* 4. ENDOCRINE LAYER (Pituitary & Ovaries / Hormonal Depot) */}
          {showEndocrine && (
            <g
              id="endocrine-layer"
              className="cursor-pointer group transition-all duration-500"
              onClick={() => setSelectedOrgan('ENDOCRINE')}
            >
              {/* Pituitary Master Gland in Brain */}
              <circle cx="150" cy="42" r="4" fill="#c084fc" filter="url(#cyanGlow)" />
              <circle cx="150" cy="42" r="8" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 2" fill="none" />

              {/* Ovarian hormonal cycle receptor sites in Pelvis */}
              <circle cx="135" cy="245" r="6" fill="#a855f7" opacity="0.9" />
              <circle cx="165" cy="245" r="6" fill="#a855f7" opacity="0.9" />
              <path d="M 135 245 Q 150 252 165 245" stroke="#c084fc" strokeWidth="1.5" fill="none" />

              {/* Pill status badge on abdomen */}
              <rect
                x="142"
                y="215"
                width="16"
                height="8"
                rx="4"
                fill={metrics.dailyPillTaken ? '#00f5a0' : '#ff3366'}
                stroke="#ffffff"
                strokeWidth="1"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Selected Organ Diagnostic Drawer at Bottom */}
      <div className="w-full mt-auto pt-3 border-t border-space-800 z-10">
        {selectedOrgan === 'JUGULAR' && (
          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>INTERNAL JUGULAR VEIN (IJV)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Velocity: <span className={`font-bold ${isJugularCritical ? 'text-hud-red' : 'text-hud-cyan'}`}>{metrics.jugularVeinVelocity} cm/s</span>
                {isJugularCritical ? ' (STASIS / RETROGRADE RISK)' : ' (Laminar Flow)'}
              </p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('ULTRASOUND')}
              className="px-2.5 py-1 text-[11px] font-mono bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 rounded transition-all"
            >
              SCAN IJV
            </button>
          </div>
        )}

        {selectedOrgan === 'OCULAR' && (
          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>SANS / RETINAL SHEATH</span>
              </div>
              <p className="text-[11px] text-slate-400">
                IOP L/R: <span className={`font-bold ${isOcularCritical ? 'text-hud-red' : 'text-hud-green'}`}>{metrics.iopLeftEye} / {metrics.iopRightEye} mmHg</span>
              </p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('LBNP')}
              className="px-2.5 py-1 text-[11px] font-mono bg-amber-950/80 hover:bg-amber-900 border border-amber-500 text-amber-300 rounded transition-all"
            >
              START LBNP
            </button>
          </div>
        )}

        {selectedOrgan === 'ENDOCRINE' && (
          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>ENDOCRINE & SUPPRESSION CYCLE</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Active Load: <span className="font-bold text-purple-300">{metrics.estrogenLoadIndex}%</span> | Pill:{' '}
                <span className={metrics.dailyPillTaken ? 'text-hud-green font-bold' : 'text-hud-red font-bold'}>
                  {metrics.dailyPillTaken ? 'LOGGED' : 'PENDING'}
                </span>
              </p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('PHARMA')}
              className="px-2.5 py-1 text-[11px] font-mono bg-purple-950/80 hover:bg-purple-900 border border-purple-500 text-purple-300 rounded transition-all"
            >
              REGIMEN
            </button>
          </div>
        )}

        {selectedOrgan === 'HEART' && (
          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Heart className="w-4 h-4 text-hud-red" />
                <span>CARDIAC PUMP & PERFUSION</span>
              </div>
              <p className="text-[11px] text-slate-400">
                HR: <span className="text-white font-bold">{metrics.heartRate} bpm</span> | BP: {metrics.bloodPressureSys}/{metrics.bloodPressureDia} mmHg
              </p>
            </div>
            <span className="text-[10px] text-slate-500">NOMINAL PUMP</span>
          </div>
        )}

        {selectedOrgan === 'FEMORAL' && (
          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>FEMORAL VENOUS BED (DVT CHECK)</span>
              </div>
              <p className="text-[11px] text-slate-400">Lower extremity microgravity pooling index: Nominal</p>
            </div>
            <button
              onClick={() => onOpenCountermeasure('HYDRATION')}
              className="px-2.5 py-1 text-[11px] font-mono bg-space-800 hover:bg-space-700 border border-space-600 text-slate-200 rounded transition-all"
            >
              HYDRATION
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
