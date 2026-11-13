// ==============================================================================
// V.E.N.U.S. Countermeasures & Care Protocols Modal (Gentle & Guided Healthcare)
// ==============================================================================

import React, { useState } from 'react';
import { X, Play, Activity, Droplets, Flower2, Sparkles, Check, Heart, Shield } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-venus-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-venus-900 border border-venus-border rounded-3xl shadow-soft-glass overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-venus-border bg-venus-850/80">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-venus-rose/15 border border-venus-rose/30 rounded-2xl text-venus-rose shadow-glow-rose">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Guía de Bienestar y Alivio Fisiológico
              </h2>
              <p className="text-xs text-slate-300">
                Protocolos autónomos diseñados con calma para la tripulación de Artemis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-venus-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-venus-border bg-venus-950/60 px-6 gap-2 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ULTRASOUND')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-2xl transition-all border-b-2 ${
              activeTab === 'ULTRASOUND'
                ? 'border-venus-teal text-emerald-200 bg-venus-teal/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-venus-teal" />
            <span>1. Ecografía Yugular</span>
          </button>

          <button
            onClick={() => setActiveTab('LBNP')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-2xl transition-all border-b-2 ${
              activeTab === 'LBNP'
                ? 'border-venus-amber text-amber-200 bg-venus-amber/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4 text-venus-amber" />
            <span>2. Descompresión LBNP</span>
          </button>

          <button
            onClick={() => setActiveTab('PHARMA')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-2xl transition-all border-b-2 ${
              activeTab === 'PHARMA'
                ? 'border-venus-rose text-venus-blush bg-venus-rose/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flower2 className="w-4 h-4 text-venus-rose" />
            <span>3. Farmacología & Ciclo</span>
          </button>

          <button
            onClick={() => setActiveTab('HYDRATION')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-2xl transition-all border-b-2 ${
              activeTab === 'HYDRATION'
                ? 'border-venus-teal text-teal-200 bg-venus-teal/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4 text-venus-teal" />
            <span>4. Hidratación Salina</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* TAB 1: ULTRASOUND */}
          {activeTab === 'ULTRASOUND' && (
            <div className="space-y-4">
              <div className="p-4 bg-venus-850/70 border border-venus-teal/30 rounded-2xl">
                <span className="text-emerald-200 font-bold block mb-1">
                  Propósito: Verificar el flujo libre y descartar retención en la vena yugular
                </span>
                <p className="text-slate-300 text-[12px] leading-relaxed">
                  Toma tu sonda de ultrasonido portátil Butterfly iQ. Con suaves movimientos sobre el lateral del cuello, comprobaremos que la sangre fluya con normalidad hacia el pecho.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual probe feedback */}
                <div className="p-4 bg-venus-950/80 border border-venus-border rounded-2xl flex flex-col items-center justify-center h-56 relative">
                  <div className="text-[11px] text-slate-400 absolute top-3 left-4">VISTA ECOGRÁFICA GUIADA</div>

                  <div className="relative w-36 h-36 rounded-full border-2 border-venus-teal/60 flex items-center justify-center bg-venus-teal/10 shadow-glow-mint">
                    <div className={`w-28 h-28 rounded-full transition-all duration-500 flex items-center justify-center ${
                      compressionTested ? 'scale-y-20 bg-venus-teal/50' : 'bg-venus-900'
                    }`}>
                      <span className="text-[11px] text-emerald-100 font-semibold text-center px-2">
                        {compressionTested ? 'Vena colapsa libremente (Sin coágulo ✓)' : 'Lumen de Vena Yugular'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-3 text-center">
                    {compressionTested ? 'Excelente: la vena responde con elasticidad.' : 'Haz clic en el botón para simular una suave compresión con la sonda.'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 bg-venus-850 border border-venus-border rounded-xl">
                    <span className="text-white font-semibold block">Paso 1: Colocación</span>
                    <p className="text-slate-300 text-[11px] mt-1">
                      Aplica una gota de gel y apoya la sonda en el triángulo lateral del cuello, suavemente junto al pulso carotídeo.
                    </p>
                  </div>

                  <div className="p-3.5 bg-venus-850 border border-venus-border rounded-xl">
                    <span className="text-white font-semibold block">Paso 2: Compresión Suave</span>
                    <p className="text-slate-300 text-[11px] mt-1">
                      Una vena sana en el espacio se comprime con facilidad bajo la presión de la sonda.
                    </p>
                    <button
                      onClick={() => setCompressionTested(true)}
                      className="mt-2 px-3.5 py-1.5 bg-venus-teal/20 hover:bg-venus-teal/30 text-emerald-200 border border-venus-teal/50 rounded-xl text-xs font-medium transition-colors"
                    >
                      {compressionTested ? 'Compresión Verificada ✓' : 'Probar Compresión con Sonda'}
                    </button>
                  </div>

                  <div className="p-3.5 bg-venus-850 border border-venus-border rounded-xl">
                    <span className="text-white font-semibold block">Paso 3: Flujo Positivo</span>
                    <p className="text-slate-300 text-[11px] mt-1">
                      V.E.N.U.S. analiza el espectro sonoro Doppler confirmando un flujo hacia el corazón superior a 15 cm/s.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LBNP */}
          {activeTab === 'LBNP' && (
            <div className="space-y-4">
              <div className="p-4 bg-venus-850/70 border border-venus-amber/30 rounded-2xl">
                <span className="text-amber-200 font-bold block mb-1">
                  Propósito: Aliviar la congestión de la cabeza y los ojos (SANS)
                </span>
                <p className="text-slate-300 text-[12px] leading-relaxed">
                  El dispositivo de Presión Negativa de Cuerpo Inferior (LBNP) recrea la gravedad en tus piernas, atrayendo suavemente hasta 1 litro de fluidos retenidos en la cabeza hacia las extremidades inferiores.
                </p>
              </div>

              <div className="p-6 bg-venus-950/80 border border-venus-border rounded-2xl flex flex-col items-center justify-center space-y-3">
                <div className="text-4xl font-extrabold text-amber-200 tracking-tight">
                  -35.0 mmHg
                </div>
                <div className="text-xs text-slate-300">
                  Presión suave de confort · Sesión de 40 minutos
                </div>

                <button
                  onClick={() => {
                    setLbnpRunning(!lbnpRunning);
                    if (!lbnpRunning) {
                      onApplyTreatmentSuccess('Sesión LBNP iniciada con serenidad. Aliviando presión ocular.');
                    }
                  }}
                  className={`px-6 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300 border ${
                    lbnpRunning
                      ? 'bg-venus-coral/20 text-venus-coral border-venus-coral'
                      : 'bg-gradient-to-r from-venus-amber to-amber-500 text-venus-950 shadow-glow-coral'
                  }`}
                >
                  {lbnpRunning ? 'Pausar Sesión LBNP' : 'Iniciar Sesión Relajante LBNP'}
                </button>

                {lbnpRunning && (
                  <div className="text-xs text-emerald-300 font-medium animate-pulse">
                    Sesión activa: Respira con calma. La presión intracraneal y ocular está descendiendo a niveles de reposo.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PHARMA */}
          {activeTab === 'PHARMA' && (
            <div className="space-y-3">
              <div className="p-4 bg-venus-850/70 border border-venus-rose/30 rounded-2xl">
                <span className="text-venus-blush font-bold block mb-1">
                  Cuidado Farmacocinético y Supresión Menstrual
                </span>
                <p className="text-slate-300 text-[12px]">
                  En caso de detectar estasis severa o sospecha de coágulo, el botiquín de abordo cuenta con anticoagulantes protectores y alternativas hormonales.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-4 bg-venus-950/80 border border-venus-border rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">Enoxaparina Subcutánea (Botiquín de Emergencia)</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">Dosis: 1.5 mg/kg. Aplicar con tranquilidad en el tejido subcutáneo abdominal si se confirma estasis crítica.</p>
                  </div>
                  <button
                    onClick={() => onApplyTreatmentSuccess('Dosis de Enoxaparina anotada en el diario médico.')}
                    className="px-3.5 py-2 bg-venus-rose/20 hover:bg-venus-rose/30 border border-venus-rose/50 text-venus-blush rounded-xl text-xs font-medium transition-colors"
                  >
                    Registrar
                  </button>
                </div>

                <div className="p-4 bg-venus-950/80 border border-venus-border rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">Progestágeno Oral Continuo</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">Mantener horario fijo para evitar fluctuaciones hormonales en el tejido vascular.</p>
                  </div>
                  <button
                    onClick={() => onApplyTreatmentSuccess('Pauta de progestágeno confirmada.')}
                    className="px-3.5 py-2 bg-venus-850 hover:bg-venus-800 border border-venus-border text-slate-200 rounded-xl text-xs font-medium transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HYDRATION */}
          {activeTab === 'HYDRATION' && (
            <div className="space-y-3">
              <div className="p-4 bg-venus-850/70 border border-venus-teal/30 rounded-2xl">
                <span className="text-teal-200 font-bold block mb-1">
                  Reconstitución de Volumen Plasmático con Sales
                </span>
                <p className="text-slate-300 text-[12px]">
                  En microgravedad el cuerpo excreta agua rápidamente. Reponer sales mantiene la sangre fluida y evita que los estrógenos espesen el torrente venoso.
                </p>
              </div>

              <div className="p-5 bg-venus-950/80 border border-venus-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Bolo Salino Recomendado:</span>
                  <span className="text-emerald-300 font-bold text-sm">600 mL Agua con Electrolitos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Sobres minerales:</span>
                  <span className="text-slate-400">1 sobre estándar NASA (Sodio 1.2g + Potasio 350mg)</span>
                </div>

                <button
                  onClick={() => onApplyTreatmentSuccess('Bolo de hidratación completado. Tu sangre recupera fluidez óptima.')}
                  className="w-full mt-3 py-2.5 bg-gradient-to-r from-venus-teal to-emerald-500 text-venus-950 font-bold text-xs rounded-2xl shadow-glow-mint transition-all hover:opacity-95"
                >
                  Confirmar Ingesta de 600 mL de Solución Hidratante
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-venus-border bg-venus-850/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-venus-rose" /> Protocolos Clínicos NASA Human Research Program
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-venus-800 hover:bg-venus-700 text-white rounded-xl border border-venus-border transition-colors font-medium"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
