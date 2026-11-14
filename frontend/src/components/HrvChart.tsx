import React from 'react';

interface HrvDataPoint {
  day: number;
  value: number; // ms
  isToday?: boolean;
}

interface HrvChartProps {
  data: HrvDataPoint[];
  baseline?: number; // default 68ms
}

export const HrvChart: React.FC<HrvChartProps> = ({ data, baseline = 68 }) => {
  const minVal = 55;
  const maxVal = 75;
  const heightPx = 120;

  const getPercentage = (val: number) => {
    return Math.max(0, Math.min(100, ((val - minVal) / (maxVal - minVal)) * 100));
  };

  const baselinePercent = getPercentage(baseline);

  return (
    <div className="bg-white rounded-[24px] p-7 border border-[#1F1A1B]/10 relative">
      {/* Header de instrumento */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-[#5F5551] block">
            03 / HRV TELEMETRY · SRC ECG-04
          </span>
          <h3 className="font-semibold text-[0.9375rem] tracking-[-0.01em] text-[#1F1A1B]">
            Heart Rate Variability vs. Individual Baseline
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#2A9D8F]" />
          <span className="font-mono text-xs text-[#5F5551]">Baseline: {baseline} ms</span>
        </div>
      </div>

      {/* Contenedor del gráfico con eje acotado */}
      <div className="relative flex items-end justify-between gap-2 pt-4 pb-2" style={{ height: `${heightPx}px` }}>
        {/* Línea de Baseline horizontal */}
        <div 
          className="absolute left-0 right-0 border-t border-dashed border-[#5F5551]/40 z-10 flex items-center justify-end pr-2"
          style={{ bottom: `${baselinePercent}%` }}
        >
          <span className="bg-white px-1 font-mono text-[10px] text-[#5F5551] -translate-y-2.5">
            Baseline ({baseline}ms)
          </span>
        </div>

        {/* Barras divergentes */}
        {data.map((point) => {
          const valPercent = getPercentage(point.value);
          const isHigher = point.value >= baseline;
          
          const bottomPos = Math.min(valPercent, baselinePercent);
          const barHeight = Math.abs(valPercent - baselinePercent);

          return (
            <div key={point.day} className="flex-1 flex flex-col items-center h-full justify-end relative z-0 group">
              <div 
                className={`w-full max-w-[20px] rounded-t transition-all ${
                  point.isToday 
                    ? 'bg-[#DF5A49]' 
                    : isHigher ? 'bg-[#2A9D8F]/70' : 'bg-[#5F5551]/20'
                }`}
                style={{
                  bottom: `${bottomPos}%`,
                  height: `${Math.max(barHeight, 4)}%`,
                }}
              />
              <span className={`font-mono text-[10px] mt-2 ${point.isToday ? 'font-bold text-[#B8402F]' : 'text-[#5F5551]'}`}>
                D{point.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};