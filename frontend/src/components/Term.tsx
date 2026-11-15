import React, { useState } from 'react';
import { ACRONYM_GLOSSARY } from '@/data/metricContents';

interface TermProps {
  acronym: string;
  children?: React.ReactNode;
}

export function Term({ acronym, children }: TermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const definition = ACRONYM_GLOSSARY[acronym] || 'Spaceflight Medical Metric';

  return (
    <span className="relative inline-block">
      <abbr
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help underline decoration-dotted decoration-[var(--accent)] underline-offset-4 font-mono-tech text-[var(--accent)] font-semibold"
        title={definition}
      >
        {children || acronym}
      </abbr>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-[var(--ink)] text-white text-xs rounded-xl shadow-xl z-50 pointer-events-none text-center animate-in fade-in-0 zoom-in-95">
          <div className="font-semibold">{acronym}</div>
          <div className="text-[11px] text-[#D0C9C5] mt-0.5">{definition}</div>
        </div>
      )}
    </span>
  );
}