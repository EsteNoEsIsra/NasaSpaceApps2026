import { useState } from 'react';
import { X, Sparkles, Activity, Sliders, Lock, ShieldCheck, Pill, Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  baselineTemp: number;
  onUpdateBaselineTemp: (temp: number) => void;
  baselineHrv: number;
  onUpdateBaselineHrv: (hrv: number) => void;
  missionPhase: string;
  privacyMode: boolean;
  onTogglePrivacyMode: () => void;
  contrinceptiveType?: string;
  onUpdateContraceptiveType?: (type: string) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  baselineTemp,
  onUpdateBaselineTemp,
  baselineHrv,
  onUpdateBaselineHrv,
  missionPhase,
  privacyMode,
  onTogglePrivacyMode,
  contrinceptiveType = 'combined',
  onUpdateContraceptiveType,
}: UserProfileModalProps) {
  const [tempInput, setTempInput] = useState(baselineTemp.toString().replace(',', '.'));
  const [hrvInput, setHrvInput] = useState(baselineHrv.toString());
  const [regimen, setRegimen] = useState(contrinceptiveType);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTemp = parseFloat(tempInput);
    const parsedHrv = parseInt(hrvInput, 10);
    if (!isNaN(parsedTemp)) onUpdateBaselineTemp(parsedTemp);
    if (!isNaN(parsedHrv)) onUpdateBaselineHrv(parsedHrv);
    if (onUpdateContraceptiveType) onUpdateContraceptiveType(regimen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm select-none animate-in fade-in duration-200">
      {/* Ventana ampliada a max-w-4xl para un diseño espacioso y profesional */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[36px] p-8 md:p-10 max-w-4xl w-full border border-[#E6DFDA] shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8DFDB]">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-purple-100/80 text-[#5b3e8f] shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Endocrine & Mission Profile</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Cmdr. Elena Vance · HERA Flight Telemetry & Calibration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Grid de 2 columnas de gran formato */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Columna Izquierda: Protocolos y Bóveda */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-100/80 space-y-5 flex-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[#5b3e8f] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Mission Environment
                  </span>
                  <span className="text-[11px] font-mono bg-[#5b3e8f] text-white px-3.5 py-1 rounded-full uppercase tracking-wider font-semibold shadow-xs">
                    {missionPhase}
                  </span>
                </div>

                {/* Selector de Régimen Farmacológico */}
                <div className="space-y-2.5">
                  <label className="text-xs font-mono text-slate-700 block font-semibold flex items-center gap-2">
                    <Pill className="w-4 h-4 text-[#5b3e8f]" /> Hormonal Regimen / Contraception
                  </label>
                  <select
                    value={regimen}
                    onChange={(e) => setRegimen(e.target.value)}
                    className="w-full bg-white px-4 py-3.5 rounded-2xl border border-purple-200/80 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5b3e8f] cursor-pointer shadow-xs transition-all"
                  >
                    <option value="combined">Combined Oral Contraceptive (OCP - Continuous)</option>
                    <option value="progestin">Progestin-Only Pill (POP / Mini-pill)</option>
                    <option value="ring">Vaginal Ring (Etonogestrel / Ethinyl Estradiol)</option>
                    <option value="patch">Transdermal Contraceptive Patch</option>
                    <option value="none">Natural Cycle / No Hormonal Support</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-white/90 p-3.5 rounded-2xl border border-purple-100 text-xs text-slate-600 leading-snug shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Estrogen osteoprotection & VTE risk factors auto-adjusted.</span>
                </div>
              </div>

              {/* Bóveda de Privacidad Urogenital */}
              <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-2xl ${privacyMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Encrypted Vault</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {privacyMode ? 'Privacy Lock active (Masked)' : 'Telemetry visible'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onTogglePrivacyMode}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                    privacyMode 
                      ? 'bg-amber-700 text-white hover:bg-amber-800' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {privacyMode ? 'Unlock' : 'Lock'}
                </button>
              </div>
            </div>

            {/* Columna Derecha: Calibración Fisiológica */}
            <div className="space-y-5 p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-700 uppercase tracking-wider flex items-center gap-2 font-semibold">
                    <Sliders className="w-4 h-4" /> Physiological Baselines
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">0g parameters</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calibrate your personal orbital baseline to ensure accurate clinical differential analysis.
                </p>

                {/* Basal Temp */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
                  <label className="text-xs font-mono text-slate-700 block font-semibold">Basal Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempInput}
                    onChange={(e) => setTempInput(e.target.value)}
                    className="w-full bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5b3e8f]"
                  />
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Tracks metabolic shifts and thermal cycles in microgravity.
                  </p>
                </div>

                {/* HRV */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs">
                  <label className="text-xs font-mono text-slate-700 block font-semibold">Autonomic HRV (ms)</label>
                  <input
                    type="number"
                    value={hrvInput}
                    onChange={(e) => setHrvInput(e.target.value)}
                    className="w-full bg-slate-50/80 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5b3e8f]"
                  />
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Heart rate variability. Reflects nervous system stress tolerance.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Botones inferiores */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200/80">
            <button
              type="button"
              onClick={onClose}
              className="px-7 py-3.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-black/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-xs font-semibold bg-[#5b3e8f] text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Calibration & Protocols</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}