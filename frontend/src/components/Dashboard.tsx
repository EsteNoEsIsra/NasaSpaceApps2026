import React from 'react';
import { HormonalBalanceDial } from './HormonalBalanceDial';
import { HrvChart } from './HrvChart';
import { BbtMatrix } from './BbtMatrix';

export const Dashboard: React.FC = () => {
  // Datos de HRV ajustados al eje acotado (55ms - 75ms)
  const hrvData = [
    { day: 35, value: 64 },
    { day: 36, value: 65 },
    { day: 37, value: 68 },
    { day: 38, value: 67 },
    { day: 39, value: 69 },
    { day: 40, value: 65 },
    { day: 41, value: 67 },
    { day: 42, value: 66, isToday: true },
  ];

  // Matriz térmica de 21 días exactos (3 semanas de ciclo)
  const bbtDays = Array.from({ length: 21 }, (_, i) => {
    const dayNum = i + 1;
    let status: 'elevated' | 'baseline' | 'cool' = 'baseline';
    let delta = 0.0;
    
    if (dayNum === 19 || dayNum === 20) {
      status = 'elevated';
      delta = 0.3;
    } else if (dayNum % 4 === 0) {
      status = 'cool';
      delta = -0.2;
    }

    return {
      day: dayNum,
      temperatureDelta: delta,
      status,
      isToday: dayNum === 21,
    };
  });

  return (
    <div className="min-h-screen bg-[#FAF6F1] text-[#1F1A1B] p-6 lg:p-8 font-sans">
      {/* Mission Control Header con MET */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-8 border-b border-[#1F1A1B]/10 gap-4">
        <div>
          <div className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-[#5F5551]">
            HERA · MISSION CONTROL · ARTEMIS IV
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1F1A1B]">
            Commander Elena Vance · Overview
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-[#1F1A1B]/10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2A9D8F] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider">MET 042:07:12:33</span>
          </div>
          <span className="text-[#5F5551]">|</span>
          <span className="font-mono text-xs text-[#5F5551]">Gateway Orbit</span>
        </div>
      </header>

      {/* Main Bento Grid (12 Columns) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Maniquí 3D y Gauge Separado */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#1A1315] text-white rounded-[24px] p-6 relative overflow-hidden border border-white/10 shadow-sm flex flex-col justify-between min-h-[420px]">
            {/* Esquinas de registro tipo instrumento */}
            <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/30" />
            <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/30" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-[#B9AEAA]">
                  01 / BIOMETRIC MANNEQUIN · SL-01
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-white mt-1">
                  In-Flight Physiological Mapping
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#2A9D8F]/20 text-[#2A9D8F] font-mono text-[10px] tracking-wider uppercase">
                Nominal
              </span>
            </div>

            {/* Contenedor del Maniquí / Avatar 3D */}
            <div className="my-auto flex flex-col items-center justify-center py-8">
              <div className="w-32 h-64 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/20 flex items-center justify-center relative shadow-inner">
                <span className="font-mono text-xs text-[#B9AEAA] tracking-widest text-center">
                  THREE.JS<br />AVATAR ACTIVE
                </span>
                {/* Nodos de telemetría */}
                <div className="absolute top-12 left-2 w-2 h-2 rounded-full bg-[#DF5A49] animate-ping" />
                <div className="absolute top-12 left-2 w-2 h-2 rounded-full bg-[#DF5A49]" />
                <div className="absolute top-28 right-4 w-2 h-2 rounded-full bg-[#2A9D8F]" />
              </div>
              <p className="font-mono text-[11px] text-[#B9AEAA] mt-4">
                Active Telemetry: VTE Risk & Pelvic Circulation
              </p>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs font-mono text-[#B9AEAA]">
              <span>PRIVACY: LOCAL ENCRYPTED</span>
              <span>SRC: HERA-CORE-v4</span>
            </div>
          </div>

          {/* Módulo de Indicadores Limpio (VTE Risk & Bone Shield) */}
          <HormonalBalanceDial vteRisk={40} boneShield={85} />
        </section>

        {/* Columna Derecha: Bento Grid de Tarjetas */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta de Sueño / Orbital Sleep */}
          <div className="bg-white rounded-[24px] p-7 border border-[#1F1A1B]/10 flex flex-col justify-between shadow-sm">
            <div>
              <span className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-[#5F5551]">
                02 / SLEEP & RECOVERY · SRC WHS-02
              </span>
              <h3 className="font-semibold text-[0.9375rem] tracking-[-0.01em] text-[#1F1A1B] mt-1">
                Orbital Sleep Architecture
              </h3>
            </div>
            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-normal tracking-tight">7</span>
                <span className="font-mono text-xs uppercase text-[#5F5551]">h</span>
                <span className="text-4xl font-normal tracking-tight ml-2">12</span>
                <span className="font-mono text-xs uppercase text-[#5F5551]">m</span>
              </div>
              <p className="font-mono text-xs text-[#5F5551] mt-2">
                REM: 1h 45m · Deep: 2h 10m · Efficiency: 92%
              </p>
            </div>
            <div className="w-full bg-[#FAF6F1] h-12 rounded-xl flex items-center px-4 justify-between font-mono text-xs text-[#5F5551]">
              <span>Circadian Sync</span>
              <span className="text-[#2A9D8F] font-semibold">83%</span>
            </div>
          </div>

          {/* Matriz BBT (21 Días) */}
          <div className="md:col-span-1 shadow-sm">
            <BbtMatrix days={bbtDays} />
          </div>

          {/* Gráfico HRV con Eje Acotado (Ancho completo de la columna derecha) */}
          <div className="md:col-span-2 shadow-sm">
            <HrvChart data={hrvData} baseline={68} />
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;