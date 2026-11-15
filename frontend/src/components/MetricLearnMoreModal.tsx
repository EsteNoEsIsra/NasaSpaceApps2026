import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { Term } from './Term';
import type { MetricContent } from '@/data/metricContents';

interface MetricLearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: MetricContent | null;
  userValue: string | number;
  baselineValue: string | number;
  onActionTrigger?: (actionType?: string) => void;
}

export function MetricLearnMoreModal({
  isOpen,
  onClose,
  content,
  userValue,
  baselineValue,
  onActionTrigger,
}: MetricLearnMoreModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        titleRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        triggerRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscurecido con cierre al hacer clic fuera */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor Modal Centrado */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-50 w-[min(92vw,640px)] max-h-[85vh] flex flex-col bg-white rounded-3xl border border-[#EDE3DF] shadow-2xl overflow-hidden m-auto animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none"
      >
        {/* 1. Título en lenguaje claro con sigla entre paréntesis */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFDB] bg-[#F5F3F0]/60">
          <h2
            id="modal-title"
            ref={titleRef}
            tabIndex={-1}
            className="text-lg font-bold text-[var(--ink)] focus:outline-none flex items-center gap-2"
          >
            <span>{content.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-mono-tech">
              (<Term acronym={content.acronym} />)
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll interno */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[var(--ink)] flex-1">
          
          {/* 2. Tu valor frente a tu baseline con barra visual */}
          <div className="p-4 rounded-2xl bg-[#F8F5F3] border border-[#EAE3DF] space-y-2">
            <div className="flex justify-between items-baseline text-xs font-mono-tech uppercase">
              <span className="text-[var(--ink-muted)]">Your Value: <strong className="text-[var(--ink)]">{userValue}</strong></span>
              <span className="text-[var(--accent)]">Baseline: <strong>{baselineValue}</strong></span>
            </div>
            <div className="w-full h-2.5 bg-[#E6DFDA] rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 bottom-0 bg-[var(--accent)] rounded-full transition-all duration-500" 
                style={{ width: '72%' }}
              />
            </div>
            <p className="text-xs text-[var(--ink-muted)]">
              Evaluated against your personalized female endocrine curve in microgravity.
            </p>
          </div>

          {/* 3. ¿Qué es? */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[var(--accent)]">What is it?</h3>
            <p className="text-[var(--ink)] leading-relaxed font-medium">
              {content.whatIsIt}
            </p>
          </div>

          {/* 4. Por qué importa en el espacio */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[var(--accent)]">Why it matters in space</h3>
            <p className="text-[var(--ink-muted)] leading-relaxed">
              {content.whyInMatters}
            </p>
          </div>

          {/* 5. Qué puedes hacer ahora */}
          <div className="space-y-2 pt-2 border-t border-[#E8DFDB]">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[var(--accent)]">What you can do now</h3>
            <div className="space-y-2">
              {content.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#F5F3F0] border border-[#E6DFDA]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--ok)] shrink-0 mt-0.5" />
                    <span className="text-xs text-[var(--ink)] leading-snug">{step.text}</span>
                  </div>
                  {step.actionLabel && (
                    <button
                      type="button"
                      onClick={() => {
                        onActionTrigger?.(step.actionType);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}