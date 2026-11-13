// ==============================================================================
// V.E.N.U.S. Layer Selector (High-Precision Minimalist Segmented Control)
// ==============================================================================

import React from 'react';
import { BodyLayer } from '../../types';
import { Layers, Activity, Eye, Compass } from 'lucide-react';

interface LayerSelectorProps {
  activeLayer: BodyLayer;
  onSelectLayer: (layer: BodyLayer) => void;
}

export const LayerSelector: React.FC<LayerSelectorProps> = ({ activeLayer, onSelectLayer }) => {
  const layers: { id: BodyLayer; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'ENDOCRINE', label: 'Endocrine Cycle', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'VASCULAR', label: 'Venous & IJV', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'OCULAR', label: 'Optic Sheath (SANS)', icon: <Eye className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center justify-between gap-1 p-1 bg-canvas-card border border-border-hairline rounded-lg">
      <div className="flex items-center gap-1 w-full">
        {layers.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-all rounded ${
                isActive
                  ? 'bg-canvas-elevated text-ink font-medium border border-border-subtle shadow-fine'
                  : 'text-ink-muted hover:text-ink hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {layer.icon}
              <span className="truncate">{layer.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
