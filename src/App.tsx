// ==============================================================================
// V.E.N.U.S. Main Application Shell
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
import { Stethoscope, ChevronRight, Bell } from 'lucide-react';

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

  // Calculate dynamic VSI and Triage
  const vsi = calculateVascularStasisIndex(metrics, astronaut.missionDay);
  const triageResult = evaluateTriageStatus({ ...metrics, vascularStasisIndex: vsi }, vsi);
  const diagnosis = runDifferentialDiagnosis(metrics);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Add an audit log entry on significant state transitions
  const recordAudit = useCallback((ruleId: string, desc: string, rationale: string, level: TriageLevel) => {
    const entry = createAuditEntry(ruleId, desc, { ...metrics, vascularStasisIndex: vsi }, level, rationale);
    setAuditLogs((prev) => [entry, ...prev.slice(0, 40)]);
  }, [metrics, vsi]);

  // Initial audit entry on load
  useEffect(() => {
    recordAudit(
      'RULE-HRP-INIT',
      'Initial Baseline Telemetry Check',
      'Baseline physiological envelope verified for deep space transit.',
      'NOMINAL'
    );
  }, []);

  // Action: Log daily cycle pill
  const handleLogPill = useCallback(() => {
    if (metrics.dailyPillTaken) return;
    setMetrics((prev) => ({
      ...prev,
      dailyPillTaken: true,
      estrogenLoadIndex: Math.min(100, prev.estrogenLoadIndex + 5),
    }));
    const msg = 'Dosis de supresión hormonal diaria registrada. Telemetría endocrina nominal.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification(msg);
    recordAudit(
      'RULE-ENDO-04',
      'Oral Contraceptive Dose Ingestion Logged',
      'Adherence to suppression cycle confirmed. Vascular stasis risk steady.',
      'NOMINAL'
    );
  }, [metrics.dailyPillTaken, recordAudit]);

  // Action: Inject emergency incident
  const handleSimulateEmergency = useCallback(() => {
    setMetrics(SCENARIO_CRITICAL_EMERGENCY);
    const msg = 'ALERTA V.E.N.U.S.: Estasis crítica en vena yugular interna y elevación de SANS. Iniciar protocolo de ultrasonido.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification('INCIDENTE INYECTADO: Estasis yugular severa detectada.');
    recordAudit(
      'RULE-CRIT-IJV-09',
      'Critical Retrograde/Stasis Velocity Detected (< 2 cm/s)',
      'Severe stasis risk combined with hormonal load and fluid shift. Immediate Class-A countermeasure required.',
      'CRITICAL_THROMBUS'
    );
  }, [recordAudit]);

  // Action: Reset nominal
  const handleResetNominal = useCallback(() => {
    setMetrics(SCENARIO_NOMINAL);
    const msg = 'Sistema V.E.N.U.S. restablecido a condiciones nominales de vuelo.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification(msg);
    recordAudit(
      'RULE-RESET-01',
      'Operator Manual Reset to Nominal State',
      'Telemetry returned to normal baseline values.',
      'NOMINAL'
    );
  }, [recordAudit]);

  // Action: Cycle layers
  const cycleLayer = useCallback(() => {
    const list: BodyLayer[] = ['ALL', 'VASCULAR', 'OCULAR', 'ENDOCRINE'];
    const idx = list.indexOf(activeLayer);
    const next = list[(idx + 1) % list.length];
    setActiveLayer(next);
    triggerNotification(`Capa activa cambiada a: ${next}`);
  }, [activeLayer]);

  // Voice Command Dispatcher
  const handleVoiceIntent = useCallback((intent: SpeechCommandIntent) => {
    switch (intent) {
      case 'LOG_PILL':
        handleLogPill();
        break;
      case 'DAILY_REPORT': {
        const text = `Reporte para la comandante Vance: Estado ${triageResult.status}. Índice de estasis vascular al ${vsi} por ciento. Presión intraocular en ${Math.max(metrics.iopLeftEye, metrics.iopRightEye)} milímetros de mercurio.`;
        setLastSpokenText(text);
        speakTacticalMessage(text);
        triggerNotification('Reporte vocal emitido.');
        break;
      }
      case 'LAYER_VASCULAR':
        setActiveLayer('VASCULAR');
        speakTacticalMessage('Mostrando capa vascular.');
        break;
      case 'LAYER_OCULAR':
        setActiveLayer('OCULAR');
        speakTacticalMessage('Mostrando capa ocular y nervio óptico.');
        break;
      case 'LAYER_ENDOCRINE':
        setActiveLayer('ENDOCRINE');
        speakTacticalMessage('Mostrando eje endocrino.');
        break;
      case 'LAYER_ALL':
        setActiveLayer('ALL');
        speakTacticalMessage('Mostrando modelo completo.');
        break;
      case 'START_ULTRASOUND':
        setCountermeasureModal({ isOpen: true, category: 'ULTRASOUND' });
        speakTacticalMessage('Desplegando guía de ultrasonido cervical.');
        break;
      case 'START_LBNP':
        setCountermeasureModal({ isOpen: true, category: 'LBNP' });
        speakTacticalMessage('Iniciando protocolo de cámara de vacío LBNP.');
        break;
      case 'SIMULATE_EMERGENCY':
        handleSimulateEmergency();
        break;
      case 'RESET_NOMINAL':
        handleResetNominal();
        break;
      case 'UNKNOWN':
      default:
        speakTacticalMessage('Comando no reconocido en la gramática táctica de V.E.N.U.S.');
        break;
    }
  }, [handleLogPill, handleSimulateEmergency, handleResetNominal, triageResult.status, vsi, metrics]);

  // Physical Hotkeys Listener (Space, P, V, Shift+D, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
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
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-space-950">
      {/* 1. Header HUD */}
      <MissionHUD
        astronaut={astronaut}
        triage={triageResult.status}
        metrics={metrics}
        onOpenAuditDrawer={() => setIsAuditOpen(true)}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-40 bg-space-900 border border-cyan-400 text-white px-4 py-2.5 rounded-lg shadow-[0_0_20px_rgba(0,242,254,0.3)] flex items-center gap-2.5 font-mono text-xs animate-in fade-in slide-in-from-top-2">
          <Bell className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-4">
        {/* Differential Diagnosis Clinical Banner */}
        <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 backdrop-blur ${
          triageResult.status === 'CRITICAL_THROMBUS'
            ? 'bg-red-950/60 border-hud-red shadow-[0_0_20px_rgba(255,51,102,0.3)]'
            : triageResult.status === 'WARNING_SANS'
            ? 'bg-amber-950/50 border-hud-amber'
            : 'bg-space-900/70 border-space-800'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg border mt-0.5 ${
              triageResult.status === 'CRITICAL_THROMBUS'
                ? 'bg-red-900/60 border-red-500 text-red-200'
                : 'bg-space-800 border-space-700 text-cyan-300'
            }`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
                  EDGE DIFFERENTIAL DIAGNOSIS (CDSS)
                </span>
                <span className="text-[10px] font-mono bg-space-800 text-slate-300 px-1.5 py-0.2 rounded border border-space-700">
                  CONFIDENCE: {diagnosis.confidenceScore}%
                </span>
              </div>
              <h2 className="text-sm md:text-base font-mono font-bold text-white mt-0.5">
                {diagnosis.condition}
              </h2>
              <p className="text-xs font-mono text-slate-300 mt-1 max-w-3xl">
                {diagnosis.etiology}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCountermeasureModal({ isOpen: true, category: 'ULTRASOUND' })}
            className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-mono font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-1.5 shrink-0 transition-all"
          >
            <span>ACTION PROTOCOL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Two-Column Layout: Avatar Wireframe & Vitals HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Anatomical Avatar & Layer Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <LayerSelector activeLayer={activeLayer} onSelectLayer={setActiveLayer} />
            <InteractiveAvatar
              metrics={{ ...metrics, vascularStasisIndex: vsi }}
              triage={triageResult.status}
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

      {/* Countermeasures Modal */}
      {countermeasureModal.isOpen && (
        <CountermeasuresModal
          initialCategory={countermeasureModal.category}
          onClose={() => setCountermeasureModal({ isOpen: false, category: 'ULTRASOUND' })}
          onApplyTreatmentSuccess={(msg) => {
            triggerNotification(msg);
            recordAudit(
              'RULE-COUNTERMEASURE-SUCCESS',
              'Astronaut Applied Prescribed Countermeasure',
              msg,
              'NOMINAL'
            );
          }}
        />
      )}

      {/* NASA Class-A Audit Drawer */}
      <AuditTrailDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
};

export default App;
