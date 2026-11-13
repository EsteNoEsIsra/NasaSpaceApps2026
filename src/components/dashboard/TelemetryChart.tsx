// ==============================================================================
// V.E.N.U.S. Multi-Day Telemetry Trend Visualizer
// Interactive SVG chart displaying 14-day mission telemetry
// ==============================================================================

import React, { useState } from 'react';
import { HISTORICAL_14_DAYS, HistoricalTelemetryDay } from '../../data/scenarios';
import { TrendingUp, Calendar } from 'lucide-react';

export const TelemetryChart: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<HistoricalTelemetryDay | null>(null);

  const data = HISTORICAL_14_DAYS;
  const width = 640;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Scale calculations
  const minDay = data[0].day;
  const maxDay = data[data.length - 1].day;

  const getX = (day: number) => padding.left + ((day - minDay) / (maxDay - minDay)) * plotWidth;
  const getYVsi = (vsi: number) => padding.top + plotHeight - (vsi / 100) * plotHeight;
  const getYVelocity = (v: number) => padding.top + plotHeight - (v / 30) * plotHeight;

  // Polyline points
  const pointsVsi = data.map((d) => `${getX(d.day)},${getYVsi(d.vsi)}`).join(' ');
  const pointsVelocity = data.map((d) => `${getX(d.day)},${getYVelocity(d.jugularVelocity)}`).join(' ');

  return (
    <div className="p-4 bg-space-900/80 border border-space-800 rounded-xl backdrop-blur shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
            14-DAY RETROSPECTIVE TREND // MARS TRANSIT
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-hud-red inline-block" />
            <span className="text-slate-300">VSI %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-hud-cyan inline-block" />
            <span className="text-slate-300">Jugular Velocity (cm/s)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 drop-shadow">
          {/* Horizontal Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = getYVsi(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e2e54"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text x={padding.left - 8} y={y + 4} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Critical Threshold Danger Zone for VSI > 70% */}
          <rect
            x={padding.left}
            y={getYVsi(100)}
            width={plotWidth}
            height={getYVsi(70) - getYVsi(100)}
            fill="#ff3366"
            fillOpacity="0.08"
          />

          {/* Area fill under VSI */}
          <polygon
            points={`${getX(minDay)},${padding.top + plotHeight} ${pointsVsi} ${getX(maxDay)},${padding.top + plotHeight}`}
            fill="url(#vsiGradient)"
            opacity="0.3"
          />

          <defs>
            <linearGradient id="vsiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff3366" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff3366" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Velocity Line (Cyan) */}
          <polyline
            points={pointsVelocity}
            fill="none"
            stroke="#00f2fe"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* VSI Line (Red / Gradient) */}
          <polyline
            points={pointsVsi}
            fill="none"
            stroke="#ff3366"
            strokeWidth="2.5"
            strokeLinecap="round"
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
                  fill={d.vsi >= 70 ? '#ff3366' : '#fbbf24'}
                  stroke="#ffffff"
                  strokeWidth="1"
                  className="transition-all"
                />
                {/* Day label on X-axis */}
                <text
                  x={x}
                  y={height - 8}
                  fill={isHovered ? '#00f2fe' : '#64748b'}
                  fontSize="9"
                  fontFamily="monospace"
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
          <div className="absolute top-2 right-4 bg-space-950/95 border border-cyan-400 p-2.5 rounded-lg text-xs font-mono shadow-xl backdrop-blur z-20">
            <div className="text-cyan-300 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>MISSION DAY {hoveredDay.day}</span>
            </div>
            <div className="mt-1 space-y-0.5 text-slate-300 text-[11px]">
              <div>VSI Score: <strong className="text-hud-red">{hoveredDay.vsi}%</strong></div>
              <div>Jugular Flow: <strong className="text-hud-cyan">{hoveredDay.jugularVelocity} cm/s</strong></div>
              <div>IOP Average: <strong className="text-amber-300">{hoveredDay.iopAvg} mmHg</strong></div>
              <div>Hydration Deficit: <strong>-{hoveredDay.hydrationDeficit}%</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
