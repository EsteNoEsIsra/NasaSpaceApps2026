// ==============================================================================
// V.E.N.U.S. Main Application Shell
// Swiss-Aerospace Design: High signal-to-noise ratio, zero AI clichés
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
import { Stethoscope, ArrowUpRight, Bell } from 'lucide-react';

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
    setTimeout(() => setNotification(null), 4000);
  };

  const recordAudit = useCallback((ruleId: string, desc: string, rationale: string, level: TriageLevel) => {
    const entry = createAuditEntry(ruleId, desc, { ...metrics, vascularStasisIndex: vsi }, level, rationale);
    setAuditLogs((prev) => [entry, ...prev.slice(0, 40)]);
  }, [metrics, vsi]);

  useEffect(() => {
    recordAudit(
      'RULE-HRP-INIT',
      'Initial Physiological Baseline',
      'Baseline parameters confirmed for Cmdr. Vance en route to Mars.',
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
    const msg = 'Dosis diaria de supresión hormonal registrada. Nivel plasmático estable.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification('Dosis de ciclo registrada · Estado hormonal nominal');
    recordAudit(
      'RULE-ENDO-04',
      'Oral Contraceptive Ingestion Confirmed',
      'Cycle suppression adherence maintained. Vascular risk constant.',
      'NOMINAL'
    );
  }, [metrics.dailyPillTaken, recordAudit]);

  // Action: Inject emergency incident
  const handleSimulateEmergency = useCallback(() => {
    setMetrics(SCENARIO_CRITICAL_EMERGENCY);
    const msg = 'Alerta V.E.N.U.S.: Estasis crítica en vena yugular interna y elevación de SANS. Desplegar ultrasonido.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification('Incidente inyectado: Estasis yugular severa (<2 cm/s)');
    recordAudit(
      'RULE-CRIT-IJV-09',
      'IJV Flow Stagnation / Retrograde Velocity',
      'Severe stasis combined with hormonal load. Class-A countermeasure required.',
      'CRITICAL_THROMBUS'
    );
  }, [recordAudit]);

  // Action: Reset nominal
  const handleResetNominal = useCallback(() => {
    setMetrics(SCENARIO_NOMINAL);
    const msg = 'V.E.N.U.S. restablecido a condiciones nominales de vuelo.';
    setLastSpokenText(msg);
    speakTacticalMessage(msg);
    triggerNotification('Condiciones nominales restablecidas');
    recordAudit(
      'RULE-RESET-01',
      'Manual Reset to Nominal State',
      'Telemetry returned to normal baseline values.',
      'NOMINAL'
    );
  }, [recordAudit]);

  // Action: Cycle layers
  const cycleLayer = useCallback(() => {
    const list: BodyLayer[] = ['ALL', 'ENDOCRINE', 'VASCULAR', 'OCULAR'];
    const idx = list.indexOf(activeLayer);
    const next = list[(idx + 1) % list.length];
    setActiveLayer(next);
    triggerNotification(`Capa visual activa: ${next}`);
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
        speakTacticalMessage('Comando no reconocido en el léxico táctico.');
        break;
    }
  }, [handleLogPill, handleSimulateEmergency, handleResetNominal, triageResult.status, vsi, metrics]);

  // Physical Hotkeys (Space, P, V, Shift+D, R)
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
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-white/[0.15]">
      {/* 1. Header HUD */}
      <MissionHUD
        astronaut={astronaut}
        triage={triageResult.status}
        metrics={metrics}
        onOpenAuditDrawer={() => setIsAuditOpen(true)}
      />

      {/* Minimal Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-5 z-40 bg-canvas-card border border-border-subtle text-ink px-3.5 py-2 rounded shadow-elevated flex items-center gap-2 text-xs font-mono animate-in fade-in">
          <Bell className="w-3.5 h-3.5 text-clinical-titanium" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-4">
        {/* Differential Diagnosis Clinical Banner */}
        <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-fine transition-all ${
          triageResult.status === 'CRITICAL_THROMBUS'
            ? 'bg-clinical-coral/10 border-clinical-coral/40'
            : triageResult.status === 'WARNING_SANS'
            ? 'bg-clinical-honey/10 border-clinical-honey/30'
            : 'bg-canvas-card border-border-hairline'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded border shrink-0 mt-0.5 ${
              triageResult.status === 'CRITICAL_THROMBUS'
                ? 'bg-clinical-coral/20 border-clinical-coral/40 text-clinical-coral'
                : 'bg-white/[0.04] border-border-hairline text-ink'
            }`}>
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
                <span className="text-ink-muted uppercase tracking-wider">
                  EDGE DIFFERENTIAL DIAGNOSIS (CDSS)
                </span>
                <span className="text-ink-subtle">·</span>
                <span className="text-ink">CONFIDENCE: {diagnosis.confidenceScore}%</span>
              </div>
              <h2 className="text-sm font-sans font-bold text-ink mt-0.5">
                {diagnosis.condition}
              </h2>
              <p className="text-xs text-ink-muted mt-0.5 max-w-3xl leading-relaxed">
                {diagnosis.etiology}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCountermeasureModal({ isOpen: true, category: 'ULTRASOUND' })}
            className="w-full md:w-auto px-4 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-ink font-mono font-medium text-xs rounded border border-border-subtle shadow-fine flex items-center justify-center gap-1.5 shrink-0 transition-all"
          >
            <span>ACTION PROTOCOL</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted" />
          </button>
        </div>

        {/* Primary Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Anatomical Avatar & Layer Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
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
              'Astronaut executed prescribed clinical countermeasure',
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
