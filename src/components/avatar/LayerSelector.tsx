// ==============================================================================
// V.E.N.U.S. Layer Selector Toggle
// ==============================================================================

import React from 'react';
import { BodyLayer } from '../../types';
import { Layers, Activity, Eye, ShieldAlert } from 'lucide-react';

interface LayerSelectorProps {
  activeLayer: BodyLayer;
  onSelectLayer: (layer: BodyLayer) => void;
}

export const LayerSelector: React.FC<LayerSelectorProps> = ({ activeLayer, onSelectLayer }) => {
  const layers: { id: BodyLayer; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'ALL', label: 'FULL SYSTEM', icon: <Layers className="w-3.5 h-3.5" />, color: 'border-slate-600 text-slate-300' },
    { id: 'VASCULAR', label: 'VASCULAR (IJV/DVT)', icon: <Activity className="w-3.5 h-3.5" />, color: 'border-cyan-500 text-cyan-400' },
    { id: 'OCULAR', label: 'OCULAR (SANS)', icon: <Eye className="w-3.5 h-3.5" />, color: 'border-amber-500 text-amber-400' },
    { id: 'ENDOCRINE', label: 'ENDOCRINE (CYCLE)', icon: <ShieldAlert className="w-3.5 h-3.5" />, color: 'border-purple-500 text-purple-400' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-space-900/90 border border-space-800 rounded-lg backdrop-blur">
      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2">LAYERS:</span>
      {layers.map((layer) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-all ${
              isActive
                ? 'bg-space-800 border ' + layer.color + ' shadow-[0_0_12px_rgba(0,240,255,0.25)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-space-850 border border-transparent'
            }`}
          >
            {layer.icon}
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
};
