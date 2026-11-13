// ==============================================================================
// V.E.N.U.S. Human-Centric Mission HUD Header
// Empathetic, sensitive, and elegant aerospace healthcare
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { AstronautProfile, TriageLevel, VitalMetrics } from '../../types';
import { Heart, Sparkles, Clock, Wifi, Shield, Wind, Compass } from 'lucide-react';

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
    return `Día ${astronaut.missionDay} · ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTriagePill = () => {
    switch (triage) {
      case 'CRITICAL_THROMBUS':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-venus-coral/15 border border-venus-coral/50 text-venus-coral shadow-glow-coral animate-pulse">
            <span className="w-2 h-2 rounded-full bg-venus-coral" />
            <span className="text-xs font-semibold tracking-wide">Atención Requerida: Cuidado Vascular Inmediato</span>
          </div>
        );
      case 'WARNING_SANS':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-venus-amber/15 border border-venus-amber/40 text-venus-amber">
            <span className="w-2 h-2 rounded-full bg-venus-amber" />
            <span className="text-xs font-semibold tracking-wide">Observación: Aliviar Presión Ocular (SANS)</span>
          </div>
        );
      case 'CAUTION_STASIS':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-venus-amber/10 border border-venus-amber/30 text-amber-200">
            <span className="w-2 h-2 rounded-full bg-venus-amber/80" />
            <span className="text-xs font-semibold tracking-wide">Cuidado Suave: Estasis Leve & Hidratación</span>
          </div>
        );
      case 'NOMINAL':
      default:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-venus-mint/15 border border-venus-mint/40 text-emerald-300 shadow-glow-mint">
            <span className="w-2 h-2 rounded-full bg-venus-mint" />
            <span className="text-xs font-semibold tracking-wide">En Armonía: Homeostasis Óptima</span>
          </div>
        );
    }
  };

  return (
    <header className="w-full bg-venus-900/80 border-b border-venus-border backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 py-3.5 shadow-soft-glass">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Personal Greeting */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          {/* Logo V.E.N.U.S. Warm Icon */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-venus-rose via-venus-orchid to-venus-purple p-0.5 shadow-glow-rose flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-venus-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-venus-blush animate-pulse-gentle" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-sans font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-venus-blush via-venus-rose to-venus-orchid">
                V.E.N.U.S.
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-venus-rose/10 text-venus-blush border border-venus-rose/20">
                Salud Femenina Espacial
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              Hola, <strong className="text-white font-medium">{astronaut.name}</strong> · Misión Artemis VII (Marte)
            </p>
          </div>
        </div>

        {/* Central & Right telemetry widgets */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* Dynamic State Pill */}
          {getTriagePill()}

          {/* Mission MET clock with calm icon */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-venus-850/70 border border-venus-border text-xs text-slate-200">
            <Clock className="w-3.5 h-3.5 text-venus-rose" />
            <span className="font-mono text-slate-200">{formatMET(metSeconds)}</span>
          </div>

          {/* Earth Latency - Empathetic Edge computing statement */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-venus-850/70 border border-venus-border text-xs text-slate-300" title="A 14 minutos luz de la Tierra, V.E.N.U.S. procesa tus datos localmente en tiempo real">
            <Wifi className="w-3.5 h-3.5 text-venus-teal" />
            <span>Tierra: <span className="text-venus-teal font-medium">14m 22s</span> · Cuidado local</span>
          </div>

          {/* Class-A Verification Pill */}
          <button
            onClick={onOpenAuditDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-venus-800/60 hover:bg-venus-700/80 text-venus-blush border border-venus-border transition-all hover:shadow-glow-rose"
          >
            <Shield className="w-3.5 h-3.5 text-venus-rose" />
            <span className="font-medium">Certificado NASA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
