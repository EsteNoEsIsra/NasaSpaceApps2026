// frontend/src/components/MetricModal.tsx

import React, { useEffect, useRef } from 'react';
import { Callout } from './BodyViewer';

interface MetricModalProps {
  callout: Callout | null;
  onClose: () => void;
}

export function MetricModal({ callout, onClose }: MetricModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (callout) {
      if (!dialogElement.open) {
        dialogElement.showModal();
      }
    } else {
      if (dialogElement.open) {
        dialogElement.close();
      }
    }
  }, [callout]);

  if (!callout) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // Close modal when clicking on the backdrop area
        const dialogDimensions = dialogRef.current?.getBoundingClientRect();
        if (
          dialogDimensions &&
          (e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom)
        ) {
          onClose();
        }
      }}
      className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-0 w-[min(92vw,640px)] max-h-[85vh] backdrop:bg-black/80 backdrop:backdrop-blur-sm shadow-2xl overflow-hidden focus:outline-none animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold tracking-tight text-slate-100">
              {callout.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{callout.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-sm text-slate-300">
          
          {/* Current value vs Baseline visual bar */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-mono uppercase text-slate-400">Your Value vs. Baseline</span>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-base font-semibold text-cyan-400">{callout.value}</span>
                {callout.unit && <span className="text-xs text-slate-400">{callout.unit}</span>}
              </div>
            </div>
            {/* Visual comparison bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Nominal Baseline</span>
              <span>Upper Safe Limit</span>
            </div>
          </div>

          {/* What is it? */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">What is it?</h3>
            <p className="text-slate-300 leading-relaxed">
              This metric monitors the physiological response and structural integrity associated with {callout.title.toLowerCase()}. Continuous tracking ensures early detection of microgravity adaptation shifts.
            </p>
          </div>

          {/* Why it matters in space */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Why it matters in space</h3>
            <p className="text-slate-300 leading-relaxed">
              Prolonged exposure to microgravity and deep space radiation alters baseline fluid distribution and metabolic load, making proactive monitoring critical for mission safety and health preservation.
            </p>
          </div>

          {/* Actionable steps */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/60">
            <h3 className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Recommended actions for today</h3>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">1</span>
                <span>Complete the scheduled 45-minute resistance protocol on the ARED equipment.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">2</span>
                <span>Verify fluid intake meets the daily target of 2,500 ml to maintain optimal circulation pressure.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs transition-colors"
          >
            Mark as reviewed
          </button>
        </div>

      </div>
    </dialog>
  );
}