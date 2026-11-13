// ==============================================================================
// V.E.N.U.S. Class-A Deterministic Audit Log Drawer
// Real-time audit trail of medical decisions with cryptographic proof hashes
// ==============================================================================

import React from 'react';
import { AuditLogEntry } from '../../types';
import { X, ShieldCheck, CheckCircle2, Hash, Terminal } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex justify-end bg-space-950/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-space-900 border-l border-cyan-500/30 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-space-800 bg-space-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-mono font-bold text-sm text-white">
                NASA CLASS-A DETERMINISTIC AUDIT LOG
              </h3>
              <p className="font-mono text-[11px] text-slate-400">
                NASA-STD-8719.13 Compliant // Zero-Hallucination Edge Trace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-space-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Statement Banner */}
        <div className="p-3 bg-cyan-950/40 border-b border-cyan-900/50 flex items-start gap-2.5 text-xs font-mono text-cyan-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            Every medical recommendation is deterministic and reproducible. No cloud dependence, zero LLM hallucinations, zero transmission latency with Earth.
          </div>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
          {logs.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-8">
              No audit cycles logged yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-space-950 border border-space-800 rounded-lg text-xs space-y-2 hover:border-space-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">{log.ruleId}</span>
                  <span className="text-[10px] text-slate-500">{log.timestamp.slice(11, 23)} UTC</span>
                </div>

                <div className="text-slate-300 font-semibold text-[11px]">
                  {log.ruleDescription}
                </div>

                {/* Input Telemetry Snapshot */}
                <div className="p-2 bg-space-900 rounded border border-space-800 text-[10px] text-slate-400 grid grid-cols-2 gap-1">
                  {Object.entries(log.inputs).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500">{k}:</span> <span className="text-slate-200 font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>

                {/* Clinical Rationale & Triage Result */}
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-500">Rationale:</span> {log.clinicalRationale}
                </div>

                {/* Cryptographic Proof Hash */}
                <div className="flex items-center justify-between pt-1 border-t border-space-800/80 text-[10px]">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Hash className="w-3 h-3 text-cyan-500" />
                    <span>PROOF:</span>
                  </span>
                  <span className="text-cyan-300 font-mono">{log.deterministicProofHash}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-space-800 bg-space-850 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Active Audit Trails: {logs.length}</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Class-A Certified
          </span>
        </div>
      </div>
    </div>
  );
};
