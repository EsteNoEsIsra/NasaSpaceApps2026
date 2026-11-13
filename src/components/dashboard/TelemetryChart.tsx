// ==============================================================================
// V.E.N.U.S. Multi-Day Telemetry Trend Visualizer (Soft & Luminous Design)
// ==============================================================================

import React, { useState } from 'react';
import { HISTORICAL_14_DAYS, HistoricalTelemetryDay } from '../../data/scenarios';
import { TrendingUp, Calendar, Heart } from 'lucide-react';

export const TelemetryChart: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<HistoricalTelemetryDay | null>(null);

  const data = HISTORICAL_14_DAYS;
  const width = 640;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const minDay = data[0].day;
  const maxDay = data[data.length - 1].day;

  const getX = (day: number) => padding.left + ((day - minDay) / (maxDay - minDay)) * plotWidth;
  const getYVsi = (vsi: number) => padding.top + plotHeight - (vsi / 100) * plotHeight;
  const getYVelocity = (v: number) => padding.top + plotHeight - (v / 30) * plotHeight;

  const pointsVsi = data.map((d) => `${getX(d.day)},${getYVsi(d.vsi)}`).join(' ');
  const pointsVelocity = data.map((d) => `${getX(d.day)},${getYVelocity(d.jugularVelocity)}`).join(' ');

  return (
    <div className="p-5 bg-venus-900/60 border border-venus-border rounded-3xl backdrop-blur-xl shadow-soft-glass">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-venus-rose/15 text-venus-rose">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Evolución de Bienestar de los Últimos 14 Días
            </span>
            <span className="text-[11px] text-slate-400">
              Trayecto interplanetario hacia Marte · Cmdr. Vance
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-venus-rose inline-block" />
            <span className="text-slate-300">Retención/Estasis (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-venus-teal inline-block" />
            <span className="text-slate-300">Flujo Yugular (cm/s)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 drop-shadow">
          <defs>
            <linearGradient id="roseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Soft Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = getYVsi(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(244, 114, 182, 0.1)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text x={padding.left - 8} y={y + 3.5} fill="#94a3b8" fontSize="9" fontFamily="sans-serif" textAnchor="end">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <polygon
            points={`${getX(minDay)},${padding.top + plotHeight} ${pointsVsi} ${getX(maxDay)},${padding.top + plotHeight}`}
            fill="url(#roseGradient)"
          />

          {/* Velocity Line (Teal) */}
          <polyline
            points={pointsVelocity}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* VSI Line (Rose) */}
          <polyline
            points={pointsVsi}
            fill="none"
            stroke="#f472b6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((d) => {
            const x = getX(d.day);
            const yV = getYVsi(d.vsi);
            const isHovered = hoveredDay?.day === d.day;
            return (
              <g
                key={d.day}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <circle
                  cx={x}
                  cy={yV}
                  r={isHovered ? 6 : 3.5}
                  fill={d.vsi >= 70 ? '#fb7185' : '#f472b6'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all"
                />
                <text
                  x={x}
                  y={height - 8}
                  fill={isHovered ? '#f472b6' : '#94a3b8'}
                  fontSize="9"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  D{d.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover inspection pill */}
        {hoveredDay && (
          <div className="absolute top-2 right-4 bg-venus-900/95 border border-venus-rose/50 p-3 rounded-2xl text-xs shadow-glow-rose backdrop-blur-md z-20">
            <div className="text-venus-blush font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-venus-rose" />
              <span>Día de Misión {hoveredDay.day}</span>
            </div>
            <div className="mt-1.5 space-y-1 text-slate-200 text-[11px]">
              <div>Retención Vascular: <strong className="text-venus-coral">{hoveredDay.vsi}%</strong></div>
              <div>Flujo Yugular: <strong className="text-venus-teal">{hoveredDay.jugularVelocity} cm/s</strong></div>
              <div>Presión Ocular (SANS): <strong className="text-amber-200">{hoveredDay.iopAvg} mmHg</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
