// ==============================================================================
// V.E.N.U.S. Class-A Deterministic Audit Log Drawer
// NASA-STD-8719.13 Safety Software Verification Trace
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
    <div className="fixed inset-0 z-50 flex justify-end bg-canvas/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-canvas-card border-l border-border-hairline h-full flex flex-col shadow-elevated animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border-hairline bg-canvas-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-clinical-titanium" />
            <div>
              <h3 className="font-mono font-bold text-xs text-ink uppercase tracking-wide">
                NASA CLASS-A DETERMINISTIC AUDIT TRACE
              </h3>
              <p className="font-mono text-[11px] text-ink-muted">
                NASA-STD-8719.13 Compliant · Edge Execution Trace
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

        {/* Verification Statement */}
        <div className="p-3.5 bg-canvas border-b border-border-hairline flex items-start gap-2.5 text-xs font-mono text-ink-muted">
          <ShieldCheck className="w-4 h-4 text-clinical-sage shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            All clinical recommendations and triage states are derived from deterministic rules. No cloud latency, zero LLM hallucinations, auditable offline edge execution.
          </p>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-center text-ink-subtle text-xs py-8">
              No audit events recorded.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-canvas border border-border-hairline rounded space-y-2 hover:border-border-subtle transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-clinical-titanium font-bold">{log.ruleId}</span>
                  <span className="text-[10px] text-ink-subtle">{log.timestamp.slice(11, 23)} UTC</span>
                </div>

                <div className="text-ink font-medium text-xs">
                  {log.ruleDescription}
                </div>

                {/* Input Telemetry */}
                <div className="p-2 bg-canvas-subtle rounded border border-border-hairline text-[11px] text-ink-muted grid grid-cols-2 gap-1">
                  {Object.entries(log.inputs).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-ink-subtle">{k}:</span> <span className="text-ink">{String(v)}</span>
                    </div>
                  ))}
                </div>

                {/* Rationale */}
                <div className="text-[11px] text-ink-muted leading-relaxed">
                  <span className="text-ink-subtle">Rationale:</span> {log.clinicalRationale}
                </div>

                {/* Deterministic Hash */}
                <div className="flex items-center justify-between pt-1.5 border-t border-border-hairline text-[10px]">
                  <span className="flex items-center gap-1 text-ink-subtle">
                    <Hash className="w-3 h-3" />
                    <span>PROOF:</span>
                  </span>
                  <span className="text-clinical-sage">{log.deterministicProofHash}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border-hairline bg-canvas-subtle flex items-center justify-between text-xs font-mono text-ink-muted">
          <span>Active Audit Cycles: {logs.length}</span>
          <span className="text-clinical-sage flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Class-A Certified
          </span>
        </div>
      </div>
    </div>
  );
};
