// frontend/src/components/BodyViewer.tsx

import React from 'react';
import type { SimulationScenario } from '@/types/hera';

export interface Callout {
  id: string;
  layer: 'circulation' | 'hormones' | 'bones';
  title: string;
  subtitle: string;
  value: string;
  unit?: string;
  status: 'nominal' | 'warning' | 'alert';
  anchor: { x: number; y: number };
  label: { x: number; y: number };
  side: 'left' | 'right';
}

interface BodyViewerProps {
  activeLayer: 'circulation' | 'hormones' | 'bones';
  activeScenario?: SimulationScenario | string;
  onSelectCallout?: (callout: Callout) => void;
  bodyImageSrc?: string;
}

function generateLeaderPath(anchor: { x: number; y: number }, label: { x: number; y: number }, side: 'left' | 'right') {
  const kneeOffset = side === 'right' ? label.x - 6 : label.x + 6;
  return `M ${label.x} ${label.y} L ${kneeOffset} ${label.y} L ${anchor.x} ${anchor.y}`;
}

export function BodyViewer({ activeLayer, activeScenario = 'gateway', onSelectCallout, bodyImageSrc }: BodyViewerProps) {
  
  // DATOS DINÁMICOS DEPENDIENTES DEL ESCENARIO ACTIVO
  const getCalloutsData = (): Callout[] => {
    // Verificamos si estamos en un escenario de alerta de CO2 o SANS
    const isAlertScenario = 
      String(activeScenario).includes('co2') || 
      String(activeScenario).includes('sans') ||
      String(activeScenario).includes('dehydration');

    // Verificamos si estamos en microbioma
    const isWarningScenario = String(activeScenario).includes('microbiome');

    return [
      {
        id: 'sans',
        layer: 'circulation',
        title: 'SANS / CO₂',
        subtitle: 'Ocular structure check',
        value: isAlertScenario ? '22 mmHg' : '14 mmHg',
        status: isAlertScenario ? 'alert' : 'nominal',
        anchor: { x: 50, y: 16 },
        label: { x: 78, y: 14 },
        side: 'right',
      },
      {
        id: 'hr',
        layer: 'circulation',
        title: 'Heart Rate (HRV)',
        subtitle: 'Cardiac rhythm baseline',
        value: '66 ms',
        status: 'nominal',
        anchor: { x: 52, y: 28 },
        label: { x: 78, y: 30 },
        side: 'right',
      },
      {
        id: 'vte',
        layer: 'circulation',
        title: 'VTE / HR Risk',
        subtitle: 'Femoral flow & calf circumference',
        value: isAlertScenario ? 'Moderate' : 'Low Risk',
        status: isAlertScenario ? 'warning' : 'nominal',
        anchor: { x: 44, y: 68 },
        label: { x: 8, y: 66 },
        side: 'left',
      },
      {
        id: 'bbt',
        layer: 'hormones',
        title: 'Basal Temperature',
        subtitle: 'Ovulation & cycle track',
        value: '36.8 °C',
        status: 'nominal',
        anchor: { x: 50, y: 22 },
        label: { x: 78, y: 22 },
        side: 'right',
      },
      {
        id: 'repro',
        layer: 'hormones',
        title: 'Reproductive Health',
        subtitle: 'Continuous Combined OCP',
        value: isWarningScenario ? 'pH Imbalance' : 'Nominal',
        status: isWarningScenario ? 'warning' : 'nominal',
        anchor: { x: 50, y: 48 },
        label: { x: 8, y: 48 },
        side: 'left',
      },
      {
        id: 'bmd',
        layer: 'bones',
        title: 'BMD / ARED',
        subtitle: 'Spine & Hip resistance load',
        value: '98% Load',
        status: 'nominal',
        anchor: { x: 48, y: 45 },
        label: { x: 78, y: 45 },
        side: 'right',
      },
    ];
  };

  const visibleCallouts = getCalloutsData().filter(c => c.layer === activeLayer);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[3/4] select-none flex items-center justify-center">
      {/* 1. Imagen o silueta anatómica */}
      {bodyImageSrc ? (
        <img 
          src={bodyImageSrc} 
          alt="Astronaut anatomy" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center border border-dashed border-[#E8E2DD] rounded-3xl bg-[#FAF8F5]/40">
          <svg className="h-4/5 w-auto text-[#E0D7D0]" viewBox="0 0 100 200" fill="currentColor">
            <circle cx="50" cy="20" r="12" />
            <path d="M 35 36 C 35 36, 50 34, 65 36 L 62 90 L 55 90 L 55 170 L 45 170 L 45 90 L 38 90 Z" />
          </svg>
        </div>
      )}

      {/* 2. Líneas conectoras SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {visibleCallouts.map((callout) => {
          // Color de línea estricto según estado
          const strokeColor = 
            callout.status === 'alert' ? '#DF5A49' : 
            callout.status === 'warning' ? '#E9C46A' : '#2EC4B6';

          return (
            <path
              key={`path-${callout.id}`}
              d={generateLeaderPath(callout.anchor, callout.label, callout.side)}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* 3. Puntos de anclaje (Dots) */}
      {visibleCallouts.map((callout) => {
        const dotColor = 
          callout.status === 'alert' ? 'bg-[#DF5A49]' : 
          callout.status === 'warning' ? 'bg-[#E9C46A]' : 'bg-[#2EC4B6]';

        return (
          <div
            key={`dot-${callout.id}`}
            style={{ left: `${callout.anchor.x}%`, top: `${callout.anchor.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <span className="relative flex h-4 w-4">
              {callout.status !== 'nominal' && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`} />
              )}
              <span className={`relative inline-flex rounded-full h-4 w-4 ${dotColor} border-2 border-white shadow-sm`} />
            </span>
          </div>
        );
      })}

      {/* 4. Tarjetas flotantes interactivas */}
      {visibleCallouts.map((callout) => {
        // Estilos de tarjeta forzados por estado (Rojo alerta, Ámbar warning, Blanco/Negro nominal)
        const cardStyle = 
          callout.status === 'alert' 
            ? 'bg-[#DF5A49] text-white border-[#DF5A49] shadow-[0_0_16px_rgba(223,90,73,0.5)]' 
            : callout.status === 'warning'
            ? 'bg-[#E9C46A] text-[#1A1517] border-[#E9C46A] shadow-[0_0_12px_rgba(233,196,106,0.4)]'
            : 'bg-white/95 text-[#1A1517] border-[#E8E2DD] shadow-md';

        return (
          <button
            key={`label-${callout.id}`}
            type="button"
            onClick={() => onSelectCallout?.(callout)}
            style={{ 
              left: `${callout.label.x}%`, 
              top: `${callout.label.y}%`,
              transform: callout.side === 'right' ? 'translate(0, -50%)' : 'translate(-100%, -50%)'
            }}
            className={`absolute z-20 px-3.5 py-2 rounded-2xl border transition-all text-left backdrop-blur-md max-w-[200px] cursor-pointer ${cardStyle}`}
            aria-label={`${callout.title}: ${callout.value}. Press for details.`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-mono-tech tracking-wider font-bold">
                {callout.title}
              </span>
              {callout.status === 'alert' && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs font-semibold font-mono-tech">{callout.value}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}