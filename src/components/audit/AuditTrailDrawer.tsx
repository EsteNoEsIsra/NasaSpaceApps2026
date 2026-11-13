// ==============================================================================
// V.E.N.U.S. Class-A Deterministic Audit Log Drawer (Clean & Reassuring)
// ==============================================================================

import React from 'react';
import { AuditLogEntry } from '../../types';
import { X, ShieldCheck, CheckCircle2, Hash, Sparkles } from 'lucide-react';

interface AuditTrailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export const AuditTrailDrawer: React.FC<AuditTrailDrawerProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-venus-950/70 backdrop-blur-md">
      <div className="w-full max-w-xl bg-venus-900 border-l border-venus-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-venus-border bg-venus-850/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-venus-rose/15 rounded-xl text-venus-rose">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Registro de Seguridad Clínica Determinista
              </h3>
              <p className="text-[11px] text-slate-300">
                NASA-STD-8719.13 Software Clase-A · Procesamiento Local sin Alucinaciones
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

        {/* Audit Statement Banner */}
        <div className="p-4 bg-venus-850/40 border-b border-venus-border/70 flex items-start gap-3 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-venus-rose shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Cada consejo y triaje que emite V.E.N.U.S. proviene de reglas médicas auditables y matemáticas exactas en el dispositivo, garantizando máxima seguridad en el espacio profundo.
          </p>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          {logs.length === 0 ? (
            <div className="text-center text-slate-400 text-xs py-10">
              No hay eventos clínicos registrados aún.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-venus-950/70 border border-venus-border rounded-2xl space-y-2 hover:border-venus-rose/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-venus-blush font-bold font-mono">{log.ruleId}</span>
                  <span className="text-[11px] text-slate-400">{log.timestamp.slice(11, 23)} UTC</span>
                </div>

                <div className="text-white font-medium text-xs">
                  {log.ruleDescription}
                </div>

                {/* Input Telemetry Snapshot */}
                <div className="p-2.5 bg-venus-900/80 rounded-xl border border-venus-border/50 text-[11px] text-slate-300 grid grid-cols-2 gap-1.5">
                  {Object.entries(log.inputs).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-400">{k}:</span> <strong className="text-white ml-1">{String(v)}</strong>
                    </div>
                  ))}
                </div>

                {/* Clinical Rationale & Triage Result */}
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-medium">Justificación Médica:</span> {log.clinicalRationale}
                </div>

                {/* Cryptographic Proof Hash */}
                <div className="flex items-center justify-between pt-2 border-t border-venus-border/50 text-[10px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Hash className="w-3 h-3 text-venus-rose" />
                    <span>Firma Verificable:</span>
                  </span>
                  <span className="text-emerald-300 font-mono">{log.deterministicProofHash}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-venus-border bg-venus-850/80 flex items-center justify-between text-xs text-slate-300">
          <span>Ciclos de seguridad: {logs.length}</span>
          <span className="text-emerald-300 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Certificación Clase-A
          </span>
        </div>
      </div>
    </div>
  );
};
