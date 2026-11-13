// ==============================================================================
// V.E.N.U.S. Multi-Day Telemetry Trend Visualizer (Swiss Data Design)
// ==============================================================================

import React, { useState } from 'react';
import { HISTORICAL_14_DAYS, HistoricalTelemetryDay } from '../../data/scenarios';
import { TrendingUp, Calendar } from 'lucide-react';

export const TelemetryChart: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<HistoricalTelemetryDay | null>(null);

  const data = HISTORICAL_14_DAYS;
  const width = 640;
  const height = 170;
  const padding = { top: 18, right: 24, bottom: 28, left: 36 };

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
    <div className="p-4 bg-canvas-card border border-border-hairline rounded-xl shadow-fine">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-clinical-titanium" />
          <span className="text-xs font-mono font-medium text-ink tracking-wide">
            14-DAY RETROSPECTIVE TREND // MARS TRANSIT
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-clinical-coral inline-block" />
            <span className="text-ink-muted">VSI %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-clinical-sage inline-block" />
            <span className="text-ink-muted">IJV Velocity (cm/s)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          {/* Subtle Horizontal Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = getYVsi(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1"
                />
                <text x={padding.left - 6} y={y + 3.5} fill="#525a6c" fontSize="9" fontFamily="monospace" textAnchor="end">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Critical Threshold Zone */}
          <line
            x1={padding.left}
            y1={getYVsi(70)}
            x2={width - padding.right}
            y2={getYVsi(70)}
            stroke="rgba(210, 93, 82, 0.35)"
            strokeDasharray="2 2"
            strokeWidth="1"
          />

          {/* Velocity Line (Sage) */}
          <polyline
            points={pointsVelocity}
            fill="none"
            stroke="#38b293"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* VSI Line (Coral) */}
          <polyline
            points={pointsVsi}
            fill="none"
            stroke="#d25d52"
            strokeWidth="2"
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
                  r={isHovered ? 5 : 2.5}
                  fill={d.vsi >= 70 ? '#d25d52' : '#dfdbd4'}
                  stroke="#12151e"
                  strokeWidth="1.5"
                  className="transition-all"
                />
                <text
                  x={x}
                  y={height - 6}
                  fill={isHovered ? '#f3f4f6' : '#525a6c'}
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
          <div className="absolute top-2 right-4 bg-canvas-elevated border border-border-subtle p-2.5 rounded text-xs font-mono shadow-elevated z-20">
            <div className="text-ink font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-clinical-titanium" />
              <span>Day {hoveredDay.day}</span>
            </div>
            <div className="mt-1 space-y-0.5 text-ink-muted text-[11px]">
              <div>VSI Score: <strong className="text-clinical-coral">{hoveredDay.vsi}%</strong></div>
              <div>Jugular Flow: <strong className="text-clinical-sage">{hoveredDay.jugularVelocity} cm/s</strong></div>
              <div>IOP Average: <strong className="text-ink">{hoveredDay.iopAvg} mmHg</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
