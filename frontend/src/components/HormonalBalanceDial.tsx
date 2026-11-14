import type { VascularBoneBalance } from '@/types/hera';

interface HormonalBalanceDialProps {
  balance: VascularBoneBalance;
  hydrationMl: number;
  targetHydrationMl: number;
  onOpenDetail: () => void;
}

export function HormonalBalanceDial({
  balance,
  hydrationMl,
  targetHydrationMl,
  onOpenDetail,
}: HormonalBalanceDialProps) {
  const vteScore = balance.thrombosis.score;
  const boneScore = balance.boneProtection.score;
  const deficitMl = Math.max(0, targetHydrationMl - hydrationMl);

  const needleAngle = -75 + (vteScore / 100) * 150;

  const ticks = Array.from({ length: 41 }, (_, i) => {
    const angle = -80 + i * 4;
    const isMajor = i % 5 === 0;
    return { angle, isMajor, index: i };
  });

  const statusColor =
    vteScore >= 50 ? '#DF5A49' : vteScore >= 25 ? '#E29D38' : '#2A9D8F';

  return (
    <button
      type="button"
      onClick={onOpenDetail}
      className="w-full pt-1 pb-3 px-4 flex flex-col items-center group cursor-pointer focus:outline-none"
      title="Click to inspect full Vascular vs. Bone Balance"
    >
      <div className="relative w-[310px] h-[162px] flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 320 175" className="w-full h-full overflow-visible">
          <g transform="translate(160, 162)">
            {ticks.map(({ angle, isMajor, index }) => {
              const rad = ((angle - 90) * Math.PI) / 180;
              const rOuter = 136;
              const rInner = isMajor ? 121 : 127;
              const x1 = Math.cos(rad) * rInner;
              const y1 = Math.sin(rad) * rInner;
              const x2 = Math.cos(rad) * rOuter;
              const y2 = Math.sin(rad) * rOuter;

              const activeTick = (index / 40) * 100 <= vteScore;
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={activeTick ? statusColor : '#C9BEB9'}
                  strokeWidth={isMajor ? 2 : 1.1}
                  strokeLinecap="round"
                />
              );
            })}

            <text x="-102" y="-38" fill="#2A9D8F" fontSize="10" fontFamily="JetBrains Mono">
              LOW VTE
            </text>
            <text x="-66" y="-88" fill="#7A6F73" fontSize="10" fontFamily="JetBrains Mono">
              25
            </text>
            <text x="-6" y="-104" fill="#7A6F73" fontSize="10" fontFamily="JetBrains Mono">
              50
            </text>
            <text x="54" y="-88" fill="#7A6F73" fontSize="10" fontFamily="JetBrains Mono">
              75
            </text>
            <text x="64" y="-38" fill="#DF5A49" fontSize="10" fontFamily="JetBrains Mono">
              HIGH
            </text>

            <g transform={`rotate(${needleAngle})`}>
              <circle cx="0" cy="-112" r="4" fill={statusColor} />
              <line
                x1="0"
                y1="-72"
                x2="0"
                y2="-108"
                stroke={statusColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            <path
              d="M -76 0 A 76 76 0 0 1 76 0 Z"
              fill="url(#heraDomeGrad)"
              className="transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </g>

          <defs>
            <radialGradient id="heraDomeGrad" cx="50%" cy="20%" r="85%">
              <stop offset="0%" stopColor="#3B2428" />
              <stop offset="65%" stopColor="#1B1114" />
              <stop offset="100%" stopColor="#110A0C" />
            </radialGradient>
          </defs>
        </svg>

        <div className="absolute bottom-2.5 flex flex-col items-center text-center pointer-events-none">
          <div className="flex items-baseline gap-1 text-white font-light tracking-tight tabular-nums">
            <span className="text-xl font-semibold text-[#F9F7F5]">{vteScore}</span>
            <span className="text-xs text-[#A3969A]">/</span>
            <span className="text-xl font-semibold text-[#2EC4B6]">{boneScore}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#C7B9BE] mt-0.5">
            VTE Risk / Bone Shield
          </span>
        </div>
      </div>

      <div className="mt-1 text-center">
        {deficitMl > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#B84335] bg-[#DF5A49]/10 px-3 py-1 rounded-full">
            +{deficitMl} ml water needed today to offset estrogen load in 0g
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1F7A6F] bg-[#2A9D8F]/12 px-3 py-1 rounded-full">
            Hydration target met · Estrogen vascular load compensated
          </span>
        )}
      </div>
    </button>
  );
}