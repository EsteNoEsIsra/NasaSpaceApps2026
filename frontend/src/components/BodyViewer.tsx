import React from 'react';

export interface Callout {
  id: string;
  layer: 'circulation' | 'hormones' | 'bones';
  title: string;
  subtitle: string;
  value: string;
  unit?: string;
  status: 'nominal' | 'warning' | 'alert';
  // Positions in percentage (%) relative to the container (0-100)
  anchor: { x: number; y: number }; // Target point on the anatomy
  label: { x: number; y: number };  // Position of the callout card
  side: 'left' | 'right';
}

interface BodyViewerProps {
  activeLayer: 'circulation' | 'hormones' | 'bones';
  onSelectCallout?: (callout: Callout) => void;
  bodyImageSrc?: string;
}

export const CALLOUTS_DATA: Callout[] = [
  // Layer: Circulation (Heart)
  {
    id: 'sans',
    layer: 'circulation',
    title: 'SANS Eye Pressure',
    subtitle: 'Ocular structure check',
    value: '14',
    unit: 'mmHg',
    status: 'nominal',
    anchor: { x: 49, y: 16 }, // Eyes
    label: { x: 78, y: 14 },
    side: 'right',
  },
  {
    id: 'hr',
    layer: 'circulation',
    title: 'Heart Rate (HRV)',
    subtitle: 'Cardiac rhythm baseline',
    value: '66',
    unit: 'ms',
    status: 'nominal',
    anchor: { x: 52, y: 28 }, // Chest / Heart
    label: { x: 78, y: 30 },
    side: 'right',
  },
  {
    id: 'vte',
    layer: 'circulation',
    title: 'Blood Clot Risk (VTE)',
    subtitle: 'Femoral flow & calf circumference',
    value: 'Low Risk',
    status: 'nominal',
    anchor: { x: 44, y: 68 }, // Femoral vein / leg
    label: { x: 8, y: 66 },
    side: 'left',
  },

  // Layer: Hormones
  {
    id: 'bbt',
    layer: 'hormones',
    title: 'Basal Temperature (BBT)',
    subtitle: 'Ovulation & cycle track',
    value: '36.8',
    unit: '°C (+0.2)',
    status: 'nominal',
    anchor: { x: 50, y: 22 }, // Core temperature reference
    label: { x: 78, y: 22 },
    side: 'right',
  },
  {
    id: 'repro',
    layer: 'hormones',
    title: 'Reproductive Health',
    subtitle: 'Continuous Combined OCP',
    value: 'Nominal',
    status: 'nominal',
    anchor: { x: 50, y: 48 }, // Pelvis
    label: { x: 8, y: 48 },
    side: 'left',
  },

  // Layer: Bones
  {
    id: 'bmd',
    layer: 'bones',
    title: 'Bone Density (BMD · ARED)',
    subtitle: 'Spine & Hip resistance load',
    value: '98%',
    unit: 'target load',
    status: 'nominal',
    anchor: { x: 48, y: 45 }, // Spine / Hip
    label: { x: 78, y: 45 },
    side: 'right',
  },
];

/**
 * Generates an elbow leader path (short horizontal segment from the label, then diagonal to the anatomical anchor)
 */
function generateLeaderPath(anchor: { x: number; y: number }, label: { x: number; y: number }, side: 'left' | 'right') {
  const kneeOffset = side === 'right' ? label.x - 6 : label.x + 6;
  return `M ${label.x} ${label.y} L ${kneeOffset} ${label.y} L ${anchor.x} ${anchor.y}`;
}

export function BodyViewer({ activeLayer, onSelectCallout, bodyImageSrc }: BodyViewerProps) {
  const visibleCallouts = CALLOUTS_DATA.filter(c => c.layer === activeLayer);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[3/4] select-none flex items-center justify-center">
      {/* 1. Background body image layer (free of obstacles) */}
      {bodyImageSrc ? (
        <img 
          src={bodyImageSrc} 
          alt="Astronaut anatomy" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90"
        />
      ) : (
        /* Fallback silhouette placeholder while loading textures/3D models */
        <div className="absolute inset-0 flex items-center justify-center border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/30">
          <svg className="h-4/5 w-auto text-slate-800" viewBox="0 0 100 200" fill="currentColor">
            <circle cx="50" cy="20" r="12" />
            <path d="M 35 36 C 35 36, 50 34, 65 36 L 62 90 L 55 90 L 55 170 L 45 170 L 45 90 L 38 90 Z" />
          </svg>
        </div>
      )}

      {/* 2. Unified SVG coordinate layer (0-100) for leader lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {visibleCallouts.map((callout) => (
          <path
            key={`path-${callout.id}`}
            d={generateLeaderPath(callout.anchor, callout.label, callout.side)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className={`transition-all duration-300 ${
              callout.status === 'alert' 
                ? 'text-red-500' 
                : callout.status === 'warning' 
                ? 'text-amber-400' 
                : 'text-cyan-400/60'
            }`}
          />
        ))}
      </svg>

      {/* 3. Anatomical anchor points (Dots) */}
      {visibleCallouts.map((callout) => (
        <div
          key={`dot-${callout.id}`}
          style={{ left: `${callout.anchor.x}%`, top: `${callout.anchor.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <span className="relative flex h-3.5 w-3.5">
            {callout.status !== 'nominal' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            )}
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-slate-950" />
          </span>
        </div>
      ))}

      {/* 4. Interactive callout cards */}
      {visibleCallouts.map((callout) => (
        <button
          key={`label-${callout.id}`}
          type="button"
          onClick={() => onSelectCallout?.(callout)}
          style={{ 
            left: `${callout.label.x}%`, 
            top: `${callout.label.y}%`,
            transform: callout.side === 'right' ? 'translate(0, -50%)' : 'translate(-100%, -50%)'
          }}
          className="absolute z-20 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/90 transition-all text-left group shadow-lg shadow-black/40 backdrop-blur-md max-w-[180px]"
          aria-label={`${callout.title}: ${callout.value} ${callout.unit || ''}. Press for details.`}
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 group-hover:text-cyan-400 transition-colors">
            {callout.title}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-semibold text-slate-100 font-mono">{callout.value}</span>
            {callout.unit && <span className="text-[11px] text-slate-400 font-mono">{callout.unit}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}