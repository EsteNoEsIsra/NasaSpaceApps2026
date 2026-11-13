// ==============================================================================
// V.E.N.U.S. Main Application Shell (Empathetic & Female-Centric Space Health)
// NASA Space Apps Challenge 2026
// ==============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { BodyLayer, VitalMetrics, TriageLevel, AuditLogEntry } from './types';
import { INITIAL_ASTRONAUT } from './data/mockAstronaut';
import {
  SCENARIO_NOMINAL,
  SCENARIO_CRITICAL_EMERGENCY,
} from './data/scenarios';
import { calculateVascularStasisIndex, evaluateTriageStatus } from './engine/stasisCalculator';
import { runDifferentialDiagnosis } from './engine/differentialDiagnosis';
import { createAuditEntry } from './engine/auditLogger';
import { speakTacticalMessage, SpeechCommandIntent } from './engine/speechEngine';

// Components
import { MissionHUD } from './components/dashboard/MissionHUD';
import { InteractiveAvatar } from './components/avatar/InteractiveAvatar';
import { LayerSelector } from './components/avatar/LayerSelector';
import { VitalsMonitor } from './components/dashboard/VitalsMonitor';
import { TelemetryChart } from './components/dashboard/TelemetryChart';
import { VoiceControlBar } from './components/voice/VoiceControlBar';
import { CountermeasuresModal } from './components/protocols/CountermeasuresModal';
import { AuditTrailDrawer } from './components/audit/AuditTrailDrawer';

// Icons
import { HeartHandshake, ChevronRight, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [astronaut] = useState(INITIAL_ASTRONAUT);
  const [metrics, setMetrics] = useState<VitalMetrics>(SCENARIO_NOMINAL);
  const [activeLayer, setActiveLayer] = useState<BodyLayer>('ALL');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const [countermeasureModal, setCountermeasureModal] = useState<{
    isOpen: boolean;
    category: 'LBNP' | 'ULTRASOUND' | 'PHARMA' | 'HYDRATION';
  }>({
    isOpen: false,
    category: 'ULTRASOUND',
  });

  const vsi = calculateVascularStasisIndex(metrics, astronaut.missionDay);
  const triageResult = evaluateTriageStatus({ ...metrics, vascularStasisIndex: vsi }, vsi);
  const diagnosis = runDifferentialDiagnosis(metrics);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  const recordAudit = useCallback((ruleId: string, desc: string, rationale: string, level: TriageLevel) => {
    const entry = createAuditEntry(ruleId, desc, { ...metrics, vascularStasisIndex: vsi }, level, rationale);
    setAuditLogs((prev) => [entry, ...prev.slice(0, 40)]);
  }, [metrics, vsi]);

  useEffect(() => {
    recordAudit(
      'RULE-HRP-INIT',
      'Verificación inicial de bienvenida',
      'Parámetros fisiológicos iniciales verificados para Cmdr. Vance en trayecto a Marte.',
      'NOMINAL'
    );
  }, []);

  // Action: Log daily cycle pill
  const handleLogPill = useCallback(() => {
    if (metrics.dailyPillTaken) return;
    setMetrics((prev) => ({
      ...prev,
      dailyPillTaken: true,
      estrogenLoadIndex: Math.min(100, prev.estrogenLoadIndex + 4),
    }));
    const msg = 'Dosis diaria registrada con éxito. Tu ciclo hormonal continúa en perfecto equilibrio.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification('Dosis diaria registrada 🌸 Ciclo en equilibrio');
    recordAudit(
      'RULE-ENDO-04',
      'Ingesta de supresión hormonal registrada',
      'Adherencia al régimen de ciclo confirmada. Vascularización protegida.',
      'NOMINAL'
    );
  }, [metrics.dailyPillTaken, recordAudit]);

  // Action: Inject emergency incident
  const handleSimulateEmergency = useCallback(() => {
    setMetrics(SCENARIO_CRITICAL_EMERGENCY);
    const msg = 'Elena, he detectado estasis venosa en tu cuello y leve aumento de presión ocular. Cuidemos tu circulación juntas.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification('Atención: Retención venosa yugular detectada.');
    recordAudit(
      'RULE-CRIT-IJV-09',
      'Velocidad de flujo retrógrado/estancado (< 2 cm/s)',
      'Congestión venosa cefálica combinada con carga hormonal. Protocolo de alivio sugerido.',
      'CRITICAL_THROMBUS'
    );
  }, [recordAudit]);

  // Action: Reset nominal
  const handleResetNominal = useCallback(() => {
    setMetrics(SCENARIO_NOMINAL);
    const msg = 'V.E.N.U.S. restablecido. Todos tus indicadores han vuelto a su estado armónico.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification('Estado nominal restablecido ✨');
    recordAudit(
      'RULE-RESET-01',
      'Restablecimiento manual por astronauta',
      'Retorno a valores basales de bienestar.',
      'NOMINAL'
    );
  }, [recordAudit]);

  // Action: Cycle layers
  const cycleLayer = useCallback(() => {
    const list: BodyLayer[] = ['ALL', 'ENDOCRINE', 'VASCULAR', 'OCULAR'];
    const idx = list.indexOf(activeLayer);
    const next = list[(idx + 1) % list.length];
    setActiveLayer(next);
    triggerNotification(`Capa visual: ${next}`);
  }, [activeLayer]);

  // Voice Command Dispatcher
  const handleVoiceIntent = useCallback((intent: SpeechCommandIntent) => {
    switch (intent) {
      case 'LOG_PILL':
        handleLogPill();
        break;
      case 'DAILY_REPORT': {
        const text = `Hola Elena. Tu índice de fluidez vascular está al ${vsi} por ciento. Presión ocular en ${Math.max(metrics.iopLeftEye, metrics.iopRightEye)} milímetros de mercurio. Tu cuerpo se adapta bien.`;
        setLastSpokenText(text);
        speakTacticalMessage(text);
        triggerNotification('Resumen de bienestar emitido.');
        break;
      }
      case 'LAYER_VASCULAR':
        setActiveLayer('VASCULAR');
        speakTacticalMessage('Mostrando circulación venosa.');
        break;
      case 'LAYER_OCULAR':
        setActiveLayer('OCULAR');
        speakTacticalMessage('Mostrando salud ocular.');
        break;
      case 'LAYER_ENDOCRINE':
        setActiveLayer('ENDOCRINE');
        speakTacticalMessage('Mostrando eje hormonal.');
        break;
      case 'LAYER_ALL':
        setActiveLayer('ALL');
        speakTacticalMessage('Mostrando vista completa.');
        break;
      case 'START_ULTRASOUND':
        setCountermeasureModal({ isOpen: true, category: 'ULTRASOUND' });
        speakTacticalMessage('Abriendo guía de ecografía yugular.');
        break;
      case 'START_LBNP':
        setCountermeasureModal({ isOpen: true, category: 'LBNP' });
        speakTacticalMessage('Abriendo sesión de descompresión LBNP.');
        break;
      case 'SIMULATE_EMERGENCY':
        handleSimulateEmergency();
        break;
      case 'RESET_NOMINAL':
        handleResetNominal();
        break;
      case 'UNKNOWN':
      default:
        speakTacticalMessage('No te he entendido con claridad, Elena. Puedes usar las opciones de la pantalla.');
        break;
    }
  }, [handleLogPill, handleSimulateEmergency, handleResetNominal, vsi, metrics]);

  // Physical Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handleLogPill();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        cycleLayer();
      } else if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        handleSimulateEmergency();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetNominal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLogPill, cycleLayer, handleSimulateEmergency, handleResetNominal]);

  return (
    <div className="min-h-screen bg-venus-950 text-slate-100 flex flex-col font-sans selection:bg-venus-rose selection:text-venus-950">
      {/* 1. Header HUD */}
      <MissionHUD
        astronaut={astronaut}
        triage={triageResult.status}
        metrics={metrics}
        onOpenAuditDrawer={() => setIsAuditOpen(true)}
      />

      {/* Floating Warm Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-40 bg-venus-900 border border-venus-rose/60 text-white px-4 py-3 rounded-2xl shadow-glow-rose flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-venus-rose animate-pulse-gentle" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">
        {/* Differential Diagnosis Clinical Banner (Empathetic & Clear) */}
        <div className={`p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl transition-all duration-300 ${
          triageResult.status === 'CRITICAL_THROMBUS'
            ? 'bg-venus-coral/15 border-venus-coral shadow-glow-coral'
            : triageResult.status === 'WARNING_SANS'
            ? 'bg-venus-amber/15 border-venus-amber/60'
            : 'bg-venus-900/60 border-venus-border shadow-soft-glass'
        }`}>
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-2xl border shrink-0 mt-0.5 ${
              triageResult.status === 'CRITICAL_THROMBUS'
                ? 'bg-venus-coral/25 border-venus-coral text-venus-coral'
                : 'bg-venus-rose/15 border-venus-rose/30 text-venus-rose'
            }`}>
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                  Diagnóstico Fisiológico Inteligente (CDSS)
                </span>
                <span className="text-[10px] bg-venus-850 text-venus-blush px-2 py-0.5 rounded-full border border-venus-border">
                  Confianza: {diagnosis.confidenceScore}%
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-white mt-1">
                {diagnosis.condition}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {diagnosis.etiology}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCountermeasureModal({ isOpen: true, category: 'ULTRASOUND' })}
            className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-venus-rose via-venus-orchid to-venus-purple hover:opacity-95 text-white font-semibold text-xs rounded-2xl shadow-glow-rose flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <span>Ver Protocolo de Cuidado</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Anatomical Avatar & Layer Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3.5">
            <LayerSelector activeLayer={activeLayer} onSelectLayer={setActiveLayer} />
            <InteractiveAvatar
              metrics={{ ...metrics, vascularStasisIndex: vsi }}
              activeLayer={activeLayer}
              onOpenCountermeasure={(cat) => setCountermeasureModal({ isOpen: true, category: cat })}
            />
          </div>

          {/* Right Column: Vitals Monitor Cards & 14-Day Chart (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <VitalsMonitor
              metrics={{ ...metrics, vascularStasisIndex: vsi }}
              triage={triageResult.status}
              onLogPill={handleLogPill}
              onOpenCountermeasure={(cat) => setCountermeasureModal({ isOpen: true, category: cat })}
            />
            <TelemetryChart />
          </div>
        </div>

        {/* Bottom Bar: Voice Control & Tactical Hotkeys */}
        <VoiceControlBar
          onCommandReceived={handleVoiceIntent}
          lastSpokenText={lastSpokenText}
        />
      </main>

      {/* Guided Care Modal */}
      {countermeasureModal.isOpen && (
        <CountermeasuresModal
          initialCategory={countermeasureModal.category}
          onClose={() => setCountermeasureModal({ isOpen: false, category: 'ULTRASOUND' })}
          onApplyTreatmentSuccess={(msg) => {
            triggerNotification(msg);
            recordAudit(
              'RULE-COUNTERMEASURE-SUCCESS',
              'Astronauta aplicó el cuidado sugerido',
              msg,
              'NOMINAL'
            );
          }}
        />
      )}

      {/* Class-A Verifiable Audit Drawer */}
      <AuditTrailDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
};

export default App;
