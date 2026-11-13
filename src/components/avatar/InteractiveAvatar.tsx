// ==============================================================================
// V.E.N.U.S. Human-Centric & Sculpted Anatomical Avatar
// Elegant feminine anatomical silhouette with organic luminous flow lines
// ==============================================================================

import React, { useState } from 'react';
import { BodyLayer, VitalMetrics } from '../../types';
import { Heart, Sparkles, Eye, Flower2, Droplets, ChevronRight } from 'lucide-react';

interface InteractiveAvatarProps {
  metrics: VitalMetrics;
  activeLayer: BodyLayer;
  onOpenCountermeasure: (category: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION') => void;
}

export type OrganId = 'ENDOCRINE' | 'JUGULAR' | 'OCULAR' | 'HEART' | 'HYDRATION';

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  metrics,
  activeLayer,
  onOpenCountermeasure,
}) => {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganId>('ENDOCRINE');

  const isJugularSlow = metrics.jugularVeinVelocity < 8.0;
  const isJugularCritical = metrics.jugularVeinVelocity <= 2.0;
  const jugularColor = isJugularCritical ? '#fb7185' : isJugularSlow ? '#fbbf24' : '#2dd4bf';

  const isOcularHigh = Math.max(metrics.iopLeftEye, metrics.iopRightEye) >= 21;
  const ocularColor = isOcularHigh ? '#fb7185' : '#e879f9';

  const showVascular = activeLayer === 'ALL' || activeLayer === 'VASCULAR';
  const showOcular = activeLayer === 'ALL' || activeLayer === 'OCULAR';
  const showEndocrine = activeLayer === 'ALL' || activeLayer === 'ENDOCRINE';

  return (
    <div className="relative flex flex-col items-center justify-between p-5 bg-venus-900/60 border border-venus-border rounded-3xl overflow-hidden backdrop-blur-xl shadow-soft-glass min-h-[520px]">
      {/* Background Soft Aura Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-venus-rose/10 via-venus-orchid/15 to-transparent rounded-full blur-3xl pointer-events-none animate-breathe" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-venus-teal/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Card Info */}
      <div className="w-full flex items-center justify-between text-xs text-slate-300 z-10 border-b border-venus-border/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-venus-rose animate-pulse-gentle" />
          <span className="font-medium text-venus-blush tracking-wide">Espejo Biológico Personal</span>
        </div>
        <span className="text-[11px] text-slate-400 bg-venus-850/80 px-2.5 py-1 rounded-full border border-venus-border/50">
          Toca cualquier punto para explorar
        </span>
      </div>

      {/* Elegant Sculpted Feminine Silhouette SVG */}
      <div className="relative w-full h-[360px] max-w-[260px] my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 280 480"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(232,121,249,0.2)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft body gradient */}
            <linearGradient id="venusBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#251c47" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#1a1433" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#120e24" stopOpacity="0.8" />
            </linearGradient>

            {/* Radiant glow filters */}
            <filter id="softGlowRose" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="softGlowTeal" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Sculpted, Harmonious Female Contours */}
          <g stroke="rgba(244, 114, 182, 0.4)" strokeWidth="1.5" fill="url(#venusBody)">
            {/* Head & Neck with graceful curves */}
            <path d="M 140 35 C 160 35 170 50 170 70 C 170 85 158 98 148 102 L 148 120 L 132 120 L 132 102 C 122 98 110 85 110 70 C 110 50 120 35 140 35 Z" />

            {/* Torso with feminine waist and hips */}
            <path d="M 132 120 C 115 125 95 138 90 155 C 85 175 92 205 110 230 C 105 245 102 260 102 275 C 102 310 120 325 140 325 C 160 325 178 310 178 275 C 178 260 175 245 170 230 C 188 205 195 175 190 155 C 185 138 165 125 148 120 Z" />

            {/* Graceful Arms */}
            <path d="M 90 155 C 80 185 75 220 70 260" strokeDasharray="3 3" fill="none" opacity="0.6" />
            <path d="M 190 155 C 200 185 205 220 210 260" strokeDasharray="3 3" fill="none" opacity="0.6" />

            {/* Legs with gentle alignment */}
            <path d="M 120 325 C 115 365 110 410 108 460" strokeDasharray="4 2" fill="none" opacity="0.7" />
            <path d="M 160 325 C 165 365 170 410 172 460" strokeDasharray="4 2" fill="none" opacity="0.7" />
          </g>

          {/* 2. VASCULAR LAYER - Ribbon flow paths */}
          {showVascular && (
            <g id="vascular-ribbons" className="transition-all duration-700">
              {/* Internal Jugular Veins - gentle cervical arcs */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('JUGULAR')}
              >
                {/* Left & Right Yugular flows */}
                <path
                  d="M 135 68 Q 134 90 136 120"
                  stroke={jugularColor}
                  strokeWidth={isJugularCritical ? "5" : "3.5"}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#softGlowTeal)"
                />
                <path
                  d="M 145 68 Q 146 90 144 120"
                  stroke={jugularColor}
                  strokeWidth={isJugularCritical ? "5" : "3.5"}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#softGlowTeal)"
                />

                {/* Hotspot aura */}
                <circle cx="140" cy="94" r="10" fill={jugularColor} opacity="0.25" className="animate-pulse-gentle" />
                <circle cx="140" cy="94" r="4.5" fill={jugularColor} />
              </g>

              {/* Heart Center - Warm Pulsation */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedOrgan('HEART')}
              >
                <circle cx="140" cy="172" r="14" fill="#fb7185" opacity="0.2" className="animate-breathe" />
                <circle cx="140" cy="172" r="8" fill="#fb7185" filter="url(#softGlowRose)" />
                <path
                  d="M 140 120 L 140 170 Q 140 210 140 250"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  fill="none"
                  opacity="0.6"
                />
              </g>
            </g>
          )}

          {/* 3. OCULAR LAYER - Gentle SANS indicator */}
          {showOcular && (
            <g
              id="ocular-lotus"
              className="cursor-pointer group transition-all duration-700"
              onClick={() => setSelectedOrgan('OCULAR')}
            >
              <ellipse cx="132" cy="65" rx="5" ry="3.5" fill={ocularColor} opacity="0.9" />
              <ellipse cx="148" cy="65" rx="5" ry="3.5" fill={ocularColor} opacity="0.9" />
              <circle cx="140" cy="65" r="9" stroke={ocularColor} strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6" />
            </g>
          )}

          {/* 4. ENDOCRINE LAYER - Hormonal Center & Pituitary */}
          {showEndocrine && (
            <g
              id="endocrine-harmony"
              className="cursor-pointer group transition-all duration-700"
              onClick={() => setSelectedOrgan('ENDOCRINE')}
            >
              {/* Pituitary Master Gland in Brain */}
              <circle cx="140" cy="52" r="5" fill="#f472b6" filter="url(#softGlowRose)" className="animate-pulse-gentle" />

              {/* Ovarian & Hormonal Cycle Center */}
              <g transform="translate(140, 275)">
                <circle cx="0" cy="0" r="16" fill="#f472b6" opacity="0.18" className="animate-breathe" />
                <circle cx="-16" cy="0" r="6" fill="#c084fc" filter="url(#softGlowRose)" />
                <circle cx="16" cy="0" r="6" fill="#c084fc" filter="url(#softGlowRose)" />
                <path d="M -16 0 Q 0 8 16 0" stroke="#f472b6" strokeWidth="1.5" fill="none" />

                {/* Daily Pill Token */}
                <rect
                  x="-9"
                  y="-18"
                  width="18"
                  height="9"
                  rx="4.5"
                  fill={metrics.dailyPillTaken ? '#34d399' : '#f472b6'}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Contextual Insight Box (Empathetic & Clear) */}
      <div className="w-full mt-2 pt-3 border-t border-venus-border/70 z-10 bg-venus-950/40 rounded-2xl p-3">
        {selectedOrgan === 'ENDOCRINE' && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-venus-rose/15 rounded-xl text-venus-rose mt-0.5">
                <Flower2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Ciclo & Eje Hormonal</span>
                <p className="text-[11px] text-slate-300">
                  {metrics.dailyPillTaken
                    ? 'Dosis diaria tomada · Carga de estrógeno equilibrada al ' + metrics.estrogenLoadIndex + '%'
                    : 'Recordatorio pendiente: Toca registrar para mantener tu ciclo estable.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenCountermeasure('PHARMA')}
              className="px-3 py-1.5 text-xs font-medium bg-venus-rose/20 hover:bg-venus-rose/30 border border-venus-rose/50 text-venus-blush rounded-xl transition-all shrink-0 flex items-center gap-1"
            >
              <span>Ver Rutina</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {selectedOrgan === 'JUGULAR' && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-venus-teal/15 rounded-xl text-venus-teal mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Circulación Yugular Interna</span>
                <p className="text-[11px] text-slate-300">
                  Flujo: <strong className={isJugularSlow ? 'text-venus-coral font-bold' : 'text-emerald-300 font-bold'}>{metrics.jugularVeinVelocity} cm/s</strong>
                  {isJugularSlow ? ' · Se recomienda sesión de alivio venoso' : ' · Retorno venoso adecuado hacia el corazón'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenCountermeasure('ULTRASOUND')}
              className="px-3 py-1.5 text-xs font-medium bg-venus-teal/20 hover:bg-venus-teal/30 border border-venus-teal/50 text-emerald-200 rounded-xl transition-all shrink-0 flex items-center gap-1"
            >
              <span>Ecografía Suave</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {selectedOrgan === 'OCULAR' && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-venus-amber/15 rounded-xl text-venus-amber mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Salud Ocular & Visión (SANS)</span>
                <p className="text-[11px] text-slate-300">
                  Presión: <strong className="text-amber-200">{metrics.iopLeftEye} / {metrics.iopRightEye} mmHg</strong> · Protegiendo la retina de la microgravedad
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenCountermeasure('LBNP')}
              className="px-3 py-1.5 text-xs font-medium bg-venus-amber/20 hover:bg-venus-amber/30 border border-venus-amber/50 text-amber-200 rounded-xl transition-all shrink-0 flex items-center gap-1"
            >
              <span>Aliviar Ojos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {selectedOrgan === 'HEART' && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-venus-coral/15 rounded-xl text-venus-coral mt-0.5">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Ritmo Cardíaco & Serenidad</span>
                <p className="text-[11px] text-slate-300">
                  {metrics.heartRate} lpm · Presión arterial serena {metrics.bloodPressureSys}/{metrics.bloodPressureDia} mmHg
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-300 font-medium">Ritmo Estable</span>
          </div>
        )}
      </div>
    </div>
  );
};
