// ==============================================================================
// V.E.N.U.S. Layer Selector Toggle (Feminine & Friendly Design)
// ==============================================================================

import React from 'react';
import { BodyLayer } from '../../types';
import { Sparkles, Droplets, Eye, Flower2 } from 'lucide-react';

interface LayerSelectorProps {
  activeLayer: BodyLayer;
  onSelectLayer: (layer: BodyLayer) => void;
}

export const LayerSelector: React.FC<LayerSelectorProps> = ({ activeLayer, onSelectLayer }) => {
  const layers: { id: BodyLayer; label: string; icon: React.ReactNode; activeColor: string }[] = [
    {
      id: 'ALL',
      label: 'Cuerpo Completo',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      activeColor: 'bg-venus-800 text-white border-venus-rose/50 shadow-glow-rose',
    },
    {
      id: 'ENDOCRINE',
      label: 'Ciclo & Hormonas',
      icon: <Flower2 className="w-3.5 h-3.5 text-venus-rose" />,
      activeColor: 'bg-venus-rose/20 text-venus-blush border-venus-rose shadow-glow-rose',
    },
    {
      id: 'VASCULAR',
      label: 'Circulación & Yugular',
      icon: <Droplets className="w-3.5 h-3.5 text-venus-teal" />,
      activeColor: 'bg-venus-teal/20 text-emerald-200 border-venus-teal shadow-glow-mint',
    },
    {
      id: 'OCULAR',
      label: 'Salud Ocular (SANS)',
      icon: <Eye className="w-3.5 h-3.5 text-venus-amber" />,
      activeColor: 'bg-venus-amber/20 text-amber-200 border-venus-amber/70',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 bg-venus-900/70 border border-venus-border rounded-2xl backdrop-blur-md">
      <span className="text-xs font-medium text-slate-400 pl-2 pr-1 hidden sm:inline">
        Capas Biológicas:
      </span>
      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
        {layers.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 border ${
                isActive
                  ? `${layer.activeColor} font-semibold scale-102`
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-venus-850'
              }`}
            >
              {layer.icon}
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
