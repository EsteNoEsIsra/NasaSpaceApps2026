// ==============================================================================
// V.E.N.U.S. Clinical Countermeasures & Care Protocols Modal
// High-taste aerospace medical workstation design
// ==============================================================================

import React, { useState } from 'react';
import { X, Play, Activity, Droplets, Compass, Shield, Check } from 'lucide-react';

interface CountermeasuresModalProps {
  initialCategory: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION';
  onClose: () => void;
  onApplyTreatmentSuccess: (msg: string) => void;
}

export const CountermeasuresModal: React.FC<CountermeasuresModalProps> = ({
  initialCategory,
  onClose,
  onApplyTreatmentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION'>(initialCategory);
  const [lbnpRunning, setLbnpRunning] = useState(false);
  const [compressionTested, setCompressionTested] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-canvas-card border border-border-hairline rounded-xl shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-hairline bg-canvas-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/[0.04] border border-border-hairline rounded text-ink">
              <Shield className="w-4 h-4 text-clinical-titanium" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold text-ink tracking-wide">
                AUTONOMOUS CLINICAL COUNTERMEASURES // NASA PROTOCOL
              </h2>
              <p className="text-xs font-mono text-ink-muted">
                Class-A Guided Intervention Protocol · Artemis & Mars Missions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:text-ink rounded hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-hairline bg-canvas px-5 gap-1 pt-2">
          <button
            onClick={() => setActiveTab('ULTRASOUND')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono border-b-2 font-medium transition-all ${
              activeTab === 'ULTRASOUND'
                ? 'border-clinical-sage text-ink bg-white/[0.04]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-clinical-sage" />
            <span>1. IJV Ultrasound</span>
          </button>

          <button
            onClick={() => setActiveTab('LBNP')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono border-b-2 font-medium transition-all ${
              activeTab === 'LBNP'
                ? 'border-clinical-honey text-ink bg-white/[0.04]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-clinical-honey" />
            <span>2. LBNP Chamber</span>
          </button>

          <button
            onClick={() => setActiveTab('PHARMA')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono border-b-2 font-medium transition-all ${
              activeTab === 'PHARMA'
                ? 'border-clinical-titanium text-ink bg-white/[0.04]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-clinical-titanium" />
            <span>3. Pharmacotherapy</span>
          </button>

          <button
            onClick={() => setActiveTab('HYDRATION')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono border-b-2 font-medium transition-all ${
              activeTab === 'HYDRATION'
                ? 'border-clinical-sage text-ink bg-white/[0.04]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-ink-muted" />
            <span>4. Fluid Bolus</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs text-ink-muted">
          {/* TAB 1: ULTRASOUND */}
          {activeTab === 'ULTRASOUND' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-canvas border border-border-hairline rounded-lg">
                <span className="text-ink font-bold block mb-1">
                  OBJECTIVE: ASSESS INTERNAL JUGULAR PATENCY & RULE OUT INTRALUMINAL THROMBUS
                </span>
                <p className="text-ink-muted text-[11px] leading-relaxed">
                  Apply vascular ultrasound transducer (Butterfly iQ) to right cervical triangle. Perform transverse compression ultrasound and spectral Doppler flow analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual ultrasound monitor simulation */}
                <div className="p-4 bg-canvas border border-border-hairline rounded-lg flex flex-col items-center justify-center h-52 relative">
                  <div className="text-[10px] text-ink-subtle absolute top-2 left-2">B-MODE TRANSVERSE // LIVE SIMULATION</div>

                  <div className="relative w-32 h-32 rounded-full border border-border-subtle flex items-center justify-center bg-canvas-card">
                    <div className={`w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center ${
                      compressionTested ? 'scale-y-20 bg-clinical-sage/20 border border-clinical-sage' : 'bg-canvas border border-border-hairline'
                    }`}>
                      <span className="text-[10px] text-ink font-mono text-center px-1">
                        {compressionTested ? 'FULL COAPTATION (PATENT)' : 'IJV LUMEN'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-ink-muted mt-3 text-center">
                    {compressionTested ? 'Vein walls coapt completely under compression: Clot ruled out.' : 'Click "TEST PROBE COMPRESSION" to apply transducer pressure.'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-canvas border border-border-hairline rounded">
                    <span className="text-ink font-medium block">Step 1: Cervical Placement</span>
                    <p className="text-ink-muted text-[11px] mt-0.5">
                      Position linear probe anterolateral to carotid pulsation at mid-neck level.
                    </p>
                  </div>

                  <div className="p-3 bg-canvas border border-border-hairline rounded">
                    <span className="text-ink font-medium block">Step 2: Transverse Compression</span>
                    <p className="text-ink-muted text-[11px] mt-0.5">
                      Normal venous lumen collapses fully under light probe pressure. Non-compressible lumen indicates thrombus.
                    </p>
                    <button
                      onClick={() => setCompressionTested(true)}
                      className="mt-2 px-3 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-ink border border-border-subtle rounded text-xs transition-colors"
                    >
                      {compressionTested ? 'COMPRESSION VERIFIED ✓' : 'TEST PROBE COMPRESSION'}
                    </button>
                  </div>

                  <div className="p-3 bg-canvas border border-border-hairline rounded">
                    <span className="text-ink font-medium block">Step 3: Spectral Flow Verification</span>
                    <p className="text-ink-muted text-[11px] mt-0.5">
                      Confirm forward flow velocity (&gt;15 cm/s). Sluggish or retrograde flow warrants LBNP countermeasure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LBNP */}
          {activeTab === 'LBNP' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-canvas border border-border-hairline rounded-lg">
                <span className="text-ink font-bold block mb-1">
                  OBJECTIVE: LOWER BODY NEGATIVE PRESSURE (LBNP) CEPHALIC DECOMPRESSION
                </span>
                <p className="text-ink-muted text-[11px] leading-relaxed">
                  Applies negative pressure (-35 mmHg) to lower extremities, drawing ~800 mL pooled blood from jugular and retrobulbar space to legs to mitigate SANS.
                </p>
              </div>

              <div className="p-6 bg-canvas border border-border-hairline rounded-lg flex flex-col items-center justify-center space-y-3">
                <div className="text-4xl font-mono font-bold text-ink tracking-tight">
                  -35.0 mmHg
                </div>
                <div className="text-xs font-mono text-ink-muted">
                  VACUUM SETPOINT · 40 MINUTE TARGET CYCLE
                </div>

                <button
                  onClick={() => {
                    setLbnpRunning(!lbnpRunning);
                    if (!lbnpRunning) {
                      onApplyTreatmentSuccess('LBNP session engaged: Jugular decompression in progress.');
                    }
                  }}
                  className={`px-5 py-2 rounded text-xs font-mono font-medium transition-all border ${
                    lbnpRunning
                      ? 'bg-clinical-coral/20 text-clinical-coral border-clinical-coral'
                      : 'bg-white/[0.08] hover:bg-white/[0.14] text-ink border-border-subtle shadow-fine'
                  }`}
                >
                  {lbnpRunning ? 'PAUSE LBNP SESSION' : 'ENGAGE LBNP VACUUM CHAMBER'}
                </button>

                {lbnpRunning && (
                  <div className="text-xs text-clinical-sage font-mono animate-pulse">
                    Vacuum active: Fluid translocation in progress. Intraocular pressure normalizing.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PHARMA */}
          {activeTab === 'PHARMA' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-canvas border border-border-hairline rounded-lg">
                <span className="text-ink font-bold block mb-1">
                  PHARMACOLOGICAL MANAGEMENT & SUPPRESSION REGIMEN
                </span>
                <p className="text-ink-muted text-[11px]">
                  Emergency anticoagulation and hormonal cycle modulation protocols for deep space flight medicine.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 bg-canvas border border-border-hairline rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-ink">Subcutaneous Enoxaparin (Flight Kit)</span>
                    <p className="text-[11px] text-ink-muted mt-0.5">Dose: 1.5 mg/kg once daily. Prescribed only upon confirmed IJV non-compressibility.</p>
                  </div>
                  <button
                    onClick={() => onApplyTreatmentSuccess('Enoxaparin injection recorded in medical telemetry.')}
                    className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-border-subtle text-ink rounded text-xs transition-colors"
                  >
                    LOG INJECTION
                  </button>
                </div>

                <div className="p-3.5 bg-canvas border border-border-hairline rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-ink">Continuous Oral Progestin</span>
                    <p className="text-[11px] text-ink-muted mt-0.5">Maintain 24h steady state. Avoid estrogen spikes to minimize pro-thrombotic burden.</p>
                  </div>
                  <button
                    onClick={() => onApplyTreatmentSuccess('Hormonal dose verified.')}
                    className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-border-hairline text-ink rounded text-xs transition-colors"
                  >
                    CONFIRM DOSE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HYDRATION */}
          {activeTab === 'HYDRATION' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-canvas border border-border-hairline rounded-lg">
                <span className="text-ink font-bold block mb-1">
                  PLASMA VOLUME RESTORATION & ELECTROLYTE SALTS
                </span>
                <p className="text-ink-muted text-[11px]">
                  Spaceflight natriuresis causes plasma volume loss. Restoring volume lowers hematocrit and blood viscosity.
                </p>
              </div>

              <div className="p-4 bg-canvas border border-border-hairline rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-ink font-medium">Recommended Saline Bolus:</span>
                  <span className="text-clinical-sage font-bold font-mono">600 mL Electrolyte Solution</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Electrolyte Formula:</span>
                  <span className="text-ink">1x NASA Standard Mineral Packet (Na+ 1.2g, K+ 350mg)</span>
                </div>

                <button
                  onClick={() => onApplyTreatmentSuccess('Hydration bolus logged. Plasma viscosity normalized.')}
                  className="w-full mt-2 py-2 bg-white/[0.08] hover:bg-white/[0.14] border border-border-subtle text-ink font-mono font-medium rounded text-xs transition-all shadow-fine"
                >
                  RECORD 600 mL REHYDRATION INTAKE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-border-hairline bg-canvas-subtle flex items-center justify-between text-xs font-mono text-ink-muted">
          <span>NASA Human Research Program (HRP-47053 Class-A)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-ink rounded border border-border-hairline transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
