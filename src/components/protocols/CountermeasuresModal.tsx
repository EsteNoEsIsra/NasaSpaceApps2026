// ==============================================================================
// V.E.N.U.S. Countermeasures & Treatment Protocols Modal
// Actionable Clinical Guidance: LBNP, Ultrasound Probe, Pharma, Hydration
// ==============================================================================

import React, { useState } from 'react';
import { X, Play, Activity, Droplet, Pill, ShieldAlert } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-space-900 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,242,254,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-space-800 bg-space-850">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 border border-cyan-500/50 rounded-lg text-cyan-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-white tracking-wide">
                AUTONOMOUS MEDICAL COUNTERMEASURES // NASA PROTOCOL
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Class-A Guided Intervention System for Artemis & Mars Crews
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-space-800 bg-space-950/60 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('ULTRASOUND')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 font-semibold transition-all ${
              activeTab === 'ULTRASOUND'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. IJV ULTRASOUND SCAN</span>
          </button>

          <button
            onClick={() => setActiveTab('LBNP')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 font-semibold transition-all ${
              activeTab === 'LBNP'
                ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>2. LBNP CHAMBER (-35 mmHg)</span>
          </button>

          <button
            onClick={() => setActiveTab('PHARMA')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 font-semibold transition-all ${
              activeTab === 'PHARMA'
                ? 'border-purple-400 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>3. PHARMA & ENOXAPARIN</span>
          </button>

          <button
            onClick={() => setActiveTab('HYDRATION')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 font-semibold transition-all ${
              activeTab === 'HYDRATION'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>4. ELECTROLYTES</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-slate-300">
          {/* TAB 1: ULTRASOUND PROTOCOL */}
          {activeTab === 'ULTRASOUND' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-space-850 border border-cyan-500/30 rounded-xl">
                <span className="text-cyan-300 font-bold block mb-1">
                  OBJECTIVE: ASSESS INTERNAL JUGULAR VEIN (IJV) PATENCY & RULE OUT THROMBUS
                </span>
                <p className="text-slate-400 text-[11px]">
                  Use handheld ultrasound (Butterfly iQ / GE Vivid) in vascular preset. Perform transverse compression ultrasound and spectral Doppler flow analysis.
                </p>
              </div>

              {/* Ultrasound Simulation Viewer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-space-950 border border-space-800 rounded-xl relative overflow-hidden flex flex-col items-center justify-center h-52">
                  <div className="text-[10px] text-slate-500 absolute top-2 left-2">ULTRASOUND B-MODE // SIMULATED</div>
                  
                  {/* Simulated Vein Cross Section */}
                  <div className="relative w-36 h-36 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-cyan-950/40">
                    <div className={`w-28 h-28 rounded-full transition-all duration-500 flex items-center justify-center ${
                      compressionTested ? 'scale-y-25 bg-cyan-500/50' : 'bg-slate-900'
                    }`}>
                      <span className="text-[10px] text-cyan-200 font-bold">
                        {compressionTested ? 'COLLAPSED (NO CLOT)' : 'IJV LUMEN'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2">
                    {compressionTested ? 'Full wall coaptation verified: Clot ruled out in this segment.' : 'Click "TEST COMPRESSION" to apply probe pressure.'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-space-850 border border-space-800 rounded-lg">
                    <span className="text-white font-bold block">Step 1: Probe Positioning</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Place high-frequency linear transducer at mid-neck level, anterolateral to the carotid artery pulsation.
                    </p>
                  </div>

                  <div className="p-3 bg-space-850 border border-space-800 rounded-lg">
                    <span className="text-white font-bold block">Step 2: Transverse Compression</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Apply gentle downward pressure. A normal vein collapses completely. Inability to compress indicates intraluminal thrombus.
                    </p>
                    <button
                      onClick={() => setCompressionTested(true)}
                      className="mt-2 px-3 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-300 border border-cyan-500 rounded text-xs transition-colors"
                    >
                      {compressionTested ? 'Compression Verified ✓' : 'TEST PROBE COMPRESSION'}
                    </button>
                  </div>

                  <div className="p-3 bg-space-850 border border-space-800 rounded-lg">
                    <span className="text-white font-bold block">Step 3: Spectral Doppler Flow</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Verify forward flow direction (&gt;15 cm/s). Retrograde flow indicates severe thoracic congestion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LBNP PROTOCOL */}
          {activeTab === 'LBNP' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-space-850 border border-amber-500/30 rounded-xl">
                <span className="text-amber-300 font-bold block mb-1">
                  OBJECTIVE: LOWER BODY NEGATIVE PRESSURE (LBNP) CEPHALIC DECONGESTION
                </span>
                <p className="text-slate-400 text-[11px]">
                  Simulates terrestrial gravity by applying negative atmospheric pressure (-35 mmHg) to the lower limbs, pulling 800-1000 mL of fluid from head and eyes back to legs.
                </p>
              </div>

              <div className="p-5 bg-space-950 border border-space-800 rounded-xl flex flex-col items-center justify-center space-y-3">
                <div className="text-4xl font-mono font-black text-amber-300 tracking-wider">
                  -35.0 mmHg
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  TARGET VACUUM SETPOINT // 40 MINUTE CYCLE
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setLbnpRunning(!lbnpRunning);
                      if (!lbnpRunning) {
                        onApplyTreatmentSuccess('LBNP Session started: Decompressing jugular venous bed.');
                      }
                    }}
                    className={`px-5 py-2 rounded-lg font-bold transition-all border ${
                      lbnpRunning
                        ? 'bg-red-950 text-red-300 border-red-500'
                        : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    }`}
                  >
                    {lbnpRunning ? 'PAUSE SESSION' : 'ENGAGE LBNP VACUUM CHAMBER'}
                  </button>
                </div>

                {lbnpRunning && (
                  <div className="text-[11px] text-emerald-400 animate-pulse font-semibold">
                    Vacuum active: Fluid translocation in progress. Optic nerve sheath pressure decreasing.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PHARMA PROTOCOL */}
          {activeTab === 'PHARMA' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-space-850 border border-purple-500/30 rounded-xl">
                <span className="text-purple-300 font-bold block mb-1">
                  PHARMACOKINETIC PROTOCOL: ANTICOAGULATION & SUPPRESSION ADHERENCE
                </span>
                <p className="text-slate-400 text-[11px]">
                  If ultrasound confirms stagnant flow or thrombus formation, administer medical kit countermeasures immediately.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-space-950 border border-space-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-100">Enoxaparin (Low Molecular Weight Heparin)</span>
                    <p className="text-[11px] text-slate-400">Dose: 1.5 mg/kg SubQ once daily. For acute IJV thrombosis.</p>
                  </div>
                  <button
                    onClick={() => onApplyTreatmentSuccess('Enoxaparin injection verified in flight medical log.')}
                    className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 border border-purple-500 text-purple-200 rounded text-xs transition-colors"
                  >
                    LOG INJECTION
                  </button>
                </div>

                <div className="p-3 bg-space-950 border border-space-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-100">Oral Progestin Cycle Suppression</span>
                    <p className="text-[11px] text-slate-400">Regular oral administration. If thrombosis is diagnosed, switch to progestin-only IUD or transdermal alternative.</p>
                  </div>
                  <button
                    onClick={() => onApplyTreatmentSuccess('Hormonal dose verified.')}
                    className="px-3 py-1.5 bg-space-800 hover:bg-space-700 border border-space-600 text-slate-200 rounded text-xs transition-colors"
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
              <div className="p-3.5 bg-space-850 border border-emerald-500/30 rounded-xl">
                <span className="text-emerald-300 font-bold block mb-1">
                  HYPOVOLEMIA & PLASMA VOLUME RECONSTITUTION
                </span>
                <p className="text-slate-400 text-[11px]">
                  Astronauts lose ~15-20% plasma volume in the first days of microgravity. Reconstitution prevents hemoconcentration and reduced venous shear rate.
                </p>
              </div>

              <div className="p-4 bg-space-950 border border-space-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Recommended Fluid Bolus:</span>
                  <span className="text-emerald-400 font-mono text-sm font-bold">600 mL Saline Solution</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Electrolyte Sachet:</span>
                  <span className="text-slate-400">1x NASA Standard Mineral Electrolyte Blend (Na+ 1.2g, K+ 350mg)</span>
                </div>

                <button
                  onClick={() => onApplyTreatmentSuccess('Hydration bolus logged. Plasma viscosity normalizing.')}
                  className="w-full mt-2 py-2 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500 text-emerald-200 rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,245,160,0.2)]"
                >
                  LOG 600 mL ELECTROLYTE INTAKE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-space-800 bg-space-850 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Guideline: NASA Human Research Program (HRP-47053)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-space-800 hover:bg-space-700 text-slate-200 rounded border border-space-700 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
