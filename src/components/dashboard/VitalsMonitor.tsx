// ==============================================================================
// V.E.N.U.S. Empathetic Health Cards (Female-Friendly Healthcare)
// Clear, natural language, reassuring micro-interactions
// ==============================================================================

import React from 'react';
import { VitalMetrics, TriageLevel } from '../../types';
import { Heart, Sparkles, Droplets, Flower2, Eye, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {/* 1. HERO CARD: EQUILIBRIO VASCULAR (VSI) */}
      <div className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
        isVsiHigh
          ? 'bg-venus-coral/15 border-venus-coral/60 shadow-glow-coral'
          : isVsiMedium
          ? 'bg-venus-amber/10 border-venus-amber/40'
          : 'bg-venus-900/60 border-venus-border shadow-soft-glass'
      }`}>
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xl ${isVsiHigh ? 'bg-venus-coral/20 text-venus-coral' : 'bg-venus-rose/15 text-venus-rose'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-white">Fluidez Vascular (VSI)</span>
          </div>
          <span className="text-[11px] text-slate-400 bg-venus-850 px-2 py-0.5 rounded-full">
            Índice NASA
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-3">
          <span className={`text-3xl font-extrabold tracking-tight ${
            isVsiHigh ? 'text-venus-coral' : isVsiMedium ? 'text-venus-amber' : 'text-venus-blush'
          }`}>
            {vsi}%
          </span>
          <span className="text-xs text-slate-300 font-medium">
            {isVsiHigh ? 'Cuidado requerido' : isVsiMedium ? 'Estasis leve' : 'Flujo sereno y armónico'}
          </span>
        </div>

        {/* Soft rounded bar */}
        <div className="w-full bg-venus-950/80 h-2.5 rounded-full mt-3.5 overflow-hidden p-0.5 border border-venus-border/40">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isVsiHigh
                ? 'bg-gradient-to-r from-venus-amber to-venus-coral'
                : isVsiMedium
                ? 'bg-venus-amber'
                : 'bg-gradient-to-r from-venus-rose via-venus-orchid to-venus-teal'
            }`}
            style={{ width: `${Math.min(100, Math.max(8, vsi))}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-300 mt-3 leading-relaxed">
          {isVsiHigh
            ? 'La microgravedad está reteniendo fluidos en el cuello. Cuidemos tu circulación con un escaneo guiado.'
            : 'Tu combinación de supresión hormonal y retorno venoso se encuentra en equilibrio.'}
        </p>
      </div>

      {/* 2. RITUAL DE SUPRESIÓN HORMONAL (DAILY PILL) */}
      <div className="p-5 rounded-3xl border bg-venus-900/60 border-venus-border shadow-soft-glass flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-venus-rose/15 text-venus-rose">
                <Flower2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">Ritual Hormonal</span>
            </div>
            <span className="text-[10px] text-venus-blush bg-venus-rose/10 px-2 py-0.5 rounded-full">
              Diario
            </span>
          </div>

          <div className="mt-3">
            <div className="text-sm font-medium text-slate-200">
              {metrics.dailyPillTaken ? (
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dosis de hoy completada 🌸</span>
                </div>
              ) : (
                <span className="text-venus-coral font-medium">Recordatorio: Toma tu dosis programada</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Carga de supresión: <strong className="text-venus-blush">{metrics.estrogenLoadIndex}%</strong> (protege tu bienestar y evita ciclos en ingravidez).
            </p>
          </div>
        </div>

        <button
          onClick={onLogPill}
          disabled={metrics.dailyPillTaken}
          className={`mt-4 w-full py-2.5 px-4 text-xs font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
            metrics.dailyPillTaken
              ? 'bg-venus-850 text-slate-500 border border-venus-border/40 cursor-default'
              : 'bg-gradient-to-r from-venus-rose to-venus-orchid text-white hover:opacity-95 shadow-glow-rose'
          }`}
        >
          <span>{metrics.dailyPillTaken ? 'Dosis Registrada ✓' : 'Completar Ritual Diario (Tecla P)'}</span>
        </button>
      </div>

      {/* 3. CIRCULACIÓN YUGULAR (DOPPLER) */}
      <div className="p-5 rounded-3xl border bg-venus-900/60 border-venus-border shadow-soft-glass flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-venus-teal/15 text-venus-teal">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">Flujo Yugular (Cuello)</span>
            </div>
            <button
              onClick={() => onOpenCountermeasure('ULTRASOUND')}
              className="text-[11px] text-venus-teal hover:underline flex items-center gap-0.5"
            >
              Ecografía <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className={`text-3xl font-extrabold ${
              metrics.jugularVeinVelocity <= 2.0 ? 'text-venus-coral' : metrics.jugularVeinVelocity < 8.0 ? 'text-venus-amber' : 'text-white'
            }`}>
              {metrics.jugularVeinVelocity}
            </span>
            <span className="text-xs text-slate-400">cm/s</span>
            <span className="text-xs text-slate-300 ml-auto font-medium">
              {metrics.jugularVeinVelocity <= 2.0 ? 'Retención severa' : metrics.jugularVeinVelocity < 8.0 ? 'Lenta' : 'Laminar'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Velocidad con la que la sangre desciende de la cabeza hacia el corazón.
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-venus-border/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Meta: &gt;15 cm/s</span>
          <span className="text-venus-teal font-medium">Sonda de Bolsillo Lista</span>
        </div>
      </div>

      {/* 4. SALUD OCULAR & VISIÓN (SANS) */}
      <div className="p-5 rounded-3xl border bg-venus-900/60 border-venus-border shadow-soft-glass flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-venus-amber/15 text-venus-amber">
                <Eye className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">Salud Ocular (SANS)</span>
            </div>
            <button
              onClick={() => onOpenCountermeasure('LBNP')}
              className="text-[11px] text-venus-amber hover:underline flex items-center gap-0.5"
            >
              Alivio <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className={`text-3xl font-extrabold ${isIopHigh ? 'text-venus-coral' : 'text-white'}`}>
              {Math.max(metrics.iopLeftEye, metrics.iopRightEye).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">mmHg</span>
            <span className="text-xs text-slate-300 ml-auto font-medium">
              Ojo Izq: {metrics.iopLeftEye} · Der: {metrics.iopRightEye}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Monitoreo preventivo del nervio óptico ante la presión intracraneal en ingravidez.
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-venus-border/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Umbral seguro: &lt; 20 mmHg</span>
          <span className={isIopHigh ? 'text-venus-coral font-medium' : 'text-emerald-300 font-medium'}>
            {isIopHigh ? 'Alivio sugerido' : 'Visión protegida'}
          </span>
        </div>
      </div>

      {/* 5. HIDRATACIÓN & AGUA CELULAR */}
      <div className="p-5 rounded-3xl border bg-venus-900/60 border-venus-border shadow-soft-glass flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-venus-teal/15 text-venus-teal">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">Hidratación & Plasma</span>
            </div>
            <button
              onClick={() => onOpenCountermeasure('HYDRATION')}
              className="text-[11px] text-venus-teal hover:underline flex items-center gap-0.5"
            >
              Electrolitos <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className={`text-3xl font-extrabold ${metrics.hydrationDeficitPct > 15 ? 'text-venus-amber' : 'text-white'}`}>
              -{metrics.hydrationDeficitPct}%
            </span>
            <span className="text-xs text-slate-400">Déficit</span>
            <span className="text-xs text-slate-300 ml-auto font-medium">
              {metrics.hydrationDeficitPct > 15 ? 'Bolo sugerido' : 'Hidratada'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            El agua con sales evita que la sangre se espese y previene trombos en el espacio.
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-venus-border/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Meta: &lt; 8% déficit</span>
          <span className="text-emerald-300 font-medium">Sales activas</span>
        </div>
      </div>

      {/* 6. CORAZÓN & VITALIDAD */}
      <div className="p-5 rounded-3xl border bg-venus-900/60 border-venus-border shadow-soft-glass flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-venus-coral/15 text-venus-coral">
                <Heart className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">Pulso & Serenidad</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-venus-850 px-2 py-0.5 rounded-full">
              Continuo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <span className="text-[11px] text-slate-400">PULSO</span>
              <div className="text-2xl font-extrabold text-white">{metrics.heartRate} <span className="text-xs font-normal text-slate-400">lpm</span></div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">PRESIÓN</span>
              <div className="text-2xl font-extrabold text-white">{metrics.bloodPressureSys}/{metrics.bloodPressureDia}</div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-venus-border/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Oxígeno: <strong className="text-emerald-300">{metrics.spO2}%</strong></span>
          <span>Temperatura: <strong className="text-slate-200">{metrics.tempCelsius}°C</strong></span>
        </div>
      </div>
    </div>
  );
};
