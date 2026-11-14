import React from 'react';

interface DayStatus {
  day: number;
  temperatureDelta: number; // e.g. -0.2 to +0.4
  status: 'elevated' | 'baseline' | 'cool';
  isToday?: boolean;
}

interface BbtMatrixProps {
  days: DayStatus[]; // Exactamente 21 elementos
}

export const BbtMatrix: React.FC<BbtMatrixProps> = ({ days }) => {
  return (
    <div className="bg-white rounded-[24px] p-7 border border-[#1F1A1B]/10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-[#5F5551] block">
            04 / THERMAL DYNAMICS · 21D CYCLE
          </span>
          <h3 className="font-semibold text-[0.9375rem] tracking-[-0.01em] text-[#1F1A1B]">
            Basal Body Temperature Matrix
          </h3>
        </div>
        {/* Leyenda de estados */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-[#5F5551]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#DF5A49]" /> Elevated</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#5F5551]/30" /> Baseline</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded border border-[#5F5551]" /> Cool</span>
        </div>
      </div>

      {/* Grid estricto de 7 columnas (3 semanas exactas = 21 días) */}
      <div className="grid grid-cols-7 gap-2">
        {days.slice(0, 21).map((d) => {
          let bgStyle = 'bg-[#5F5551]/10 text-[#1F1A1B]';
          if (d.status === 'elevated') bgStyle = 'bg-[#DF5A49] text-white font-medium';
          if (d.status === 'cool') bgStyle = 'bg-transparent border border-[#5F5551]/40 text-[#5F5551]';

          return (
            <div 
              key={d.day}
              className={`aspect-square rounded-[6px] p-1.5 flex flex-col justify-between transition-all relative ${bgStyle} ${
                d.isToday ? 'outline-[1.5px] outline-offset-2 outline-[#1F1A1B]' : ''
              }`}
            >
              <span className="font-mono text-[10px] opacity-75">D{d.day}</span>
              <span className="font-mono text-[11px] text-right">
                {d.temperatureDelta > 0 ? `+${d.temperatureDelta}` : d.temperatureDelta}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};