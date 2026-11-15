// frontend/src/components/ActionDrawers.tsx

import { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, ArrowUpRight, Stethoscope, Check, ShieldCheck, Activity, HeartPulse, Radio, Lock, Send } from 'lucide-react';
import type { ActiveDrawer, AstronautProfile, DailyCheckin, HealthAlert, VascularBoneBalance } from '@/types/hera';

interface ActionDrawersProps {
  activeDrawer: ActiveDrawer;
  onClose: () => void;
  profile: AstronautProfile | null;
  checkin: DailyCheckin | null;
  alerts: HealthAlert[];
  balance: VascularBoneBalance;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onSubmitCheckin: (payload: Record<string, unknown>) => Promise<void>;
  onUpdateProfile: (payload: Record<string, unknown>) => Promise<void>;
}

export function ActionDrawers({
  activeDrawer,
  onClose,
  balance,
  checkin,
}: ActionDrawersProps) {
  const [transmitted, setTransmitted] = useState(false);

  if (!activeDrawer) return null;

  const handleTransmit = () => {
    setTransmitted(true);
    setTimeout(() => {
      setTransmitted(false);
      onClose();
    }, 1500);
  };

  const boneScore = balance.boneProtection.score;
  const thrombosisScore = balance.thrombosis.score;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[36px] border border-[#E8E2DD] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Limpio y Armónico */}
        <div className="px-8 py-6 border-b border-[#F2ECE8] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EFECE9] text-[var(--ink)] flex items-center justify-center border border-[#E6DFDA]">
              <Stethoscope className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold tracking-tight text-[var(--ink)]">
                  {activeDrawer === 'triage' && 'Differential Clinical Decision Matrix'}
                  {activeDrawer === 'vascular-bone' && 'Vascular & Bone Protection Analysis'}
                  {activeDrawer === 'intimate' && 'Intimate Health & Microbiome Telemetry'}
                  {activeDrawer === 'ground-packet' && 'Flight Surgeon Telemetry Packet'}
                </h3>
                <span className="text-[10px] font-mono-tech uppercase px-2.5 py-0.5 rounded-full bg-[var(--accent)]/12 text-[var(--accent)] font-bold">
                  {activeDrawer === 'triage' && 'Autonomous Triage'}
                  {activeDrawer === 'vascular-bone' && 'Orbital Telemetry'}
                  {activeDrawer === 'intimate' && 'Microbiome Status'}
                  {activeDrawer === 'ground-packet' && 'Downlink Secure'}
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                {activeDrawer === 'triage' && 'Separating cephalad fluid shifts (SANS) and cabin CO₂ micro-pockets from female endocrine baselines.'}
                {activeDrawer === 'vascular-bone' && 'Comprehensive evaluation of bone mineral density (BMD), resistive exercise compliance, and vascular thrombosis risk.'}
                {activeDrawer === 'intimate' && 'Real-time monitoring of urogenital microclimate, mucosal barrier integrity, and pH stability in closed habitats.'}
                {activeDrawer === 'ground-packet' && 'Encrypted summary packet prepared for secure downlink transmission to Mission Control medical officers.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-[#EAE3DF] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-white">
          
          {activeDrawer === 'triage' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[var(--ink)] font-bold">
                    Anti-Bias Algorithmic Verification
                  </h4>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    Evaluated exclusively against Cmdr. Elena Vance’s calibrated neuro-endocrine baseline and OCP regimen, avoiding historical male-centric diagnostic skew.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)] tracking-wide">Primary Hypothesis</span>
                      <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-[#DF5A49]/12 text-[#DF5A49] font-bold shrink-0">
                        84% MATCH
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[var(--ink)] mt-2.5">Neuro-Ocular Fluid Shift (SANS)</h5>
                    <p className="text-xs text-[var(--ink-muted)] mt-1.5 leading-relaxed">
                      Early cephalad pressure differential detected against personal baseline curve.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3.5 border-t border-[#E8E2DD]">
                    <div className="flex justify-between text-[10px] font-mono-tech">
                      <span className="text-[#DF5A49] font-semibold">Elevated Risk</span>
                      <span>84%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E8E2DD] rounded-full overflow-hidden">
                      <div className="h-full bg-[#DF5A49] rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)] tracking-wide">Differential</span>
                      <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-[#2A9D8F]/12 text-[#2A9D8F] font-bold shrink-0">
                        12% MATCH
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[var(--ink)] mt-2.5">Cabin CO₂ Retention</h5>
                    <p className="text-xs text-[var(--ink-muted)] mt-1.5 leading-relaxed">
                      ECLSS atmospheric sensors show nominal circulation in active habitat zones.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3.5 border-t border-[#E8E2DD]">
                    <div className="flex justify-between text-[10px] font-mono-tech">
                      <span className="text-[#2A9D8F] font-semibold">Nominal Flow</span>
                      <span>12%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E8E2DD] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2A9D8F] rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)] tracking-wide">Differential</span>
                      <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-[#6B4C7A]/12 text-[#6B4C7A] font-bold shrink-0">
                        4% MATCH
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[var(--ink)] mt-2.5">Endocrine / OCP Buffer</h5>
                    <p className="text-xs text-[var(--ink-muted)] mt-1.5 leading-relaxed">
                      Combined oral contraceptive regimen active. Electrolyte stability optimal.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3.5 border-t border-[#E8E2DD]">
                    <div className="flex justify-between text-[10px] font-mono-tech">
                      <span className="text-[#6B4C7A] font-semibold">Stable Balance</span>
                      <span>4%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E8E2DD] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6B4C7A] rounded-full" style={{ width: '4%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#DF5A49]/10 flex items-center justify-center text-[#DF5A49] shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--ink)]">Recommended Flight Surgeon Action</h5>
                    <p className="text-xs text-[var(--ink-muted)]">Schedule non-invasive ocular coherence tomography (OCT) scan during upcoming 0g transit window.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTransmit}
                  disabled={transmitted}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    transmitted 
                      ? 'bg-[var(--ok)] text-white' 
                      : 'bg-[var(--accent)] text-white hover:opacity-90'
                  }`}
                >
                  {transmitted ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Packet Transmitted</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Packet</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeDrawer === 'vascular-bone' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)]">BMD Preservation</span>
                      <span className="flex items-center gap-1 text-[10px] font-mono-tech uppercase text-[#2A9D8F] bg-[#2A9D8F]/10 px-2.5 py-1 rounded-full font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Optimal
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--ink)] mt-2">Bone Protection Index</h4>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      Evaluated against microgravity mineral loss curves. Mitigated by daily ARED protocols and estrogen stabilization.
                    </p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-[#E8E2DD]">
                    <div className="flex items-baseline justify-between text-xs font-mono-tech">
                      <span className="text-[var(--ink-muted)]">Score Index</span>
                      <span className="text-lg font-bold text-[var(--ink)]">{boneScore} / 100</span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E2DD] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2A9D8F] rounded-full" style={{ width: `${boneScore}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)] tracking-wider">Vascular Monitor</span>
                      <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-[#2A9D8F]/12 text-[#2A9D8F] font-bold">
                        LOW RISK
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--ink)] mt-2">Thrombosis Risk Index</h4>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      Tracking lower limb vascular return and hemoconcentration markers during transit.
                    </p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-[#E8E2DD]">
                    <div className="flex items-baseline justify-between text-xs font-mono-tech">
                      <span className="text-[var(--ink-muted)]">Risk Score</span>
                      <span className="text-lg font-bold text-[var(--ink)]">{thrombosisScore} / 100</span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E2DD] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${thrombosisScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#E6DFDA] flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--ink)]">Active Countermeasure Protocol</h5>
                    <p className="text-xs text-[var(--ink-muted)]">
                      {checkin?.exerciseMinutes ?? 60}m ARED resistance training completed today. Combined Oral Contraceptive (OCP) buffer sustaining systemic vascular tone.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono-tech font-semibold text-[#2A9D8F] bg-[#2A9D8F]/10 px-3 py-1.5 rounded-xl shrink-0">
                  Protocol Compliant
                </span>
              </div>
            </div>
          )}

          {activeDrawer === 'intimate' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)]">Microclimate Balance</span>
                      <span className="flex items-center gap-1 text-[10px] font-mono-tech uppercase text-[#2A9D8F] bg-[#2A9D8F]/10 px-2.5 py-1 rounded-full font-semibold">
                        <Check className="w-3.5 h-3.5" /> Normal Range
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--ink)] mt-2">Urogenital pH Stability</h4>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      Lactobacillus dominance index optimal. Closed-habitat humidity and thermal stress within safety thresholds.
                    </p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-[#E8E2DD]">
                    <div className="flex items-baseline justify-between text-xs font-mono-tech">
                      <span className="text-[var(--ink-muted)]">Current Index</span>
                      <span className="text-lg font-bold text-[var(--ink)]">pH 4.2 (Optimal)</span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E2DD] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2A9D8F] rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)] tracking-wider">Barrier Integrity</span>
                      <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-[#2A9D8F]/12 text-[#2A9D8F] font-bold">
                        HYDRATED
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--ink)] mt-2">Mucosal Hydration Status</h4>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      Tracking systemic fluid distribution and local microclimate moisture under reduced gravity conditions.
                    </p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-[#E8E2DD]">
                    <div className="flex items-baseline justify-between text-xs font-mono-tech">
                      <span className="text-[var(--ink-muted)]">Hydration Score</span>
                      <span className="text-lg font-bold text-[var(--ink)]">94 / 100</span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E2DD] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#E6DFDA] flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#6B4C7A]/10 flex items-center justify-center text-[#6B4C7A] shrink-0">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--ink)]">Habitat Microbiome Defense</h5>
                    <p className="text-xs text-[var(--ink-muted)]">
                      No structural anomalies detected. Continuous daily probiotic telemetry reporting nominal mucosal resilience.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono-tech font-semibold text-[#6B4C7A] bg-[#6B4C7A]/10 px-3 py-1.5 rounded-xl shrink-0">
                  Microbiome Secure
                </span>
              </div>
            </div>
          )}

          {activeDrawer === 'ground-packet' && (
            <div className="space-y-6">
              {/* Estado de Encriptación y Enlace */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)]">Security Protocol</span>
                      <span className="flex items-center gap-1 text-[10px] font-mono-tech uppercase text-[#2A9D8F] bg-[#2A9D8F]/10 px-2.5 py-1 rounded-full font-semibold">
                        <Lock className="w-3.5 h-3.5" /> AES-256 Encrypted
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--ink)] mt-2">Payload Integrity</h4>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      Includes 24-hour synchronized telemetry, anti-bias verification logs, and daily biometric check-in summaries.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#E8E2DD] flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-[var(--ink-muted)]">Package Size</span>
                    <span className="font-bold text-[var(--ink)]">4.2 MB Compressed</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2DD] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-tech uppercase text-[var(--ink-muted)] tracking-wider">Deep Space Network</span>
                      <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-full bg-[#2A9D8F]/12 text-[#2A9D8F] font-bold">
                        DSN LINK ACTIVE
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--ink)] mt-2">Downlink Status</h4>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      Ready for scheduled burst transmission to Mission Control medical officers in Houston / Cologne.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#E8E2DD] flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-[var(--ink-muted)]">Latency / Ping</span>
                    <span className="font-bold text-[var(--ink)]">1,280 ms (Orbital Relay)</span>
                  </div>
                </div>
              </div>

              {/* Botón de Transmisión Inmediata */}
              <div className="p-5 rounded-3xl bg-white border border-[#E6DFDA] flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--ink)]">Execute Immediate Ground Downlink</h5>
                    <p className="text-xs text-[var(--ink-muted)]">
                      Transmit medical summary packet securely to assigned flight surgeon on duty.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTransmit}
                  disabled={transmitted}
                  className={`px-6 py-3 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs ${
                    transmitted 
                      ? 'bg-[var(--ok)] text-white' 
                      : 'bg-[var(--accent)] text-white hover:opacity-90'
                  }`}
                >
                  {transmitted ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Packet Transmitted Successfully</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Secure Packet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Dinámico según la ventana activa */}
        <div className="px-8 py-5 bg-[#FAF8F5] border-t border-[#F2ECE8] flex items-center justify-between">
          <span className="text-[10px] font-mono-tech text-[var(--ink-muted)] uppercase tracking-wider">
            {activeDrawer === 'triage' && 'NASA HRP Compliant · Autonomous Triage Module v2.4'}
            {activeDrawer === 'vascular-bone' && 'NASA HRP Compliant · Bone & Vascular Module v2.4'}
            {activeDrawer === 'intimate' && 'NASA HRP Compliant · Intimate Health & Microbiome Module v2.4'}
            {activeDrawer === 'ground-packet' && 'NASA HRP Compliant · Secure Telemetry Downlink v2.4'}
          </span>
          <span className="text-xs text-[var(--ink-muted)] font-medium">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E6DFDA] text-[10px] font-mono">ESC</kbd> or click <span className="text-[var(--accent)]">×</span> to exit
          </span>
        </div>

      </div>
    </div>
  );
}