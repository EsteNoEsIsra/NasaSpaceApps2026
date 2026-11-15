import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type {
  AlertItem,
  CheckinPayload,
  HeraUserProfile,
  LatestCheckin,
  VascularBoneBalance,
} from '@/types/hera';

export type ActiveDrawer =
  | 'triage'
  | 'vascular-bone'
  | 'intimate'
  | 'ground-packet'
  | 'calibration'
  | null;

interface ActionDrawersProps {
  activeDrawer: ActiveDrawer;
  onClose: () => void;
  profile: HeraUserProfile | null;
  checkin: LatestCheckin | null;
  alerts: AlertItem[];
  balance: VascularBoneBalance;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onSubmitCheckin: (payload: CheckinPayload) => Promise<void>;
  onUpdateProfile: (payload: Partial<HeraUserProfile>) => Promise<void>;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Componente Modal Base Centrado (Cumple criterios 1 a 5)
function CenteredModal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Guardar elemento enfocado previamente para devolverle el foco al cerrar
      triggerElementRef.current = document.activeElement as HTMLElement;
      
      // Bloquear scroll del cuerpo
      document.body.style.overflow = 'hidden';

      // Poner foco inicial en el título
      setTimeout(() => {
        titleRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        triggerElementRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscurecido con cierre al hacer clic fuera */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor Modal Centrado: min(92vw, 640px) y max-h-[85vh] */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-50 w-[min(92vw,640px)] max-h-[85vh] flex flex-col bg-white rounded-3xl border border-[#EDE3DF] shadow-2xl overflow-hidden transform transition-all duration-150 animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none m-auto"
      >
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFDB] bg-[#F5F3F0]/60">
          <h2
            id="modal-title"
            ref={titleRef}
            tabIndex={-1}
            className="text-lg font-bold text-[var(--ink)] focus:outline-none"
          >
            {title}
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
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[var(--ink)] flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ActionDrawers({
  activeDrawer,
  onClose,
  profile,
  checkin,
  alerts,
  balance,
  privacyMode,
  onTogglePrivacy,
  onSubmitCheckin,
  onUpdateProfile,
}: ActionDrawersProps) {
  return (
    <>
      {/* 1. Modal: Triage Diferencial */}
      <CenteredModal
        isOpen={activeDrawer === 'triage'}
        onClose={onClose}
        title="Differential Triage & Clinical Decision"
      >
        <p className="text-[var(--ink-muted)]">
          Autonomous assessment separating cephalad fluid shifts (SANS) and cabin CO₂ pockets from systemic estrogenic symptoms.
        </p>
        <div className="space-y-3 mt-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-2xl bg-[#F5F3F0] border border-[#E6DFDA] space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-[var(--accent)] font-mono-tech">
                  {alert.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-[#EDE3DF] font-medium">
                  {alert.severity}
                </span>
              </div>
              <p className="font-medium text-[var(--ink)]">{alert.message}</p>
              <p className="text-xs text-[var(--ink-muted)]">{alert.recommendation}</p>
            </div>
          ))}
        </div>
      </CenteredModal>

      {/* 2. Modal: Vascular y Huesos */}
      <CenteredModal
        isOpen={activeDrawer === 'vascular-bone'}
        onClose={onClose}
        title="Vascular Return & Bone Demineralization"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F5F3F0] border border-[#E8DFDB]">
            <h3 className="font-semibold text-[var(--ink)]">Thrombosis &amp; Venous Stasis Score</h3>
            <p className="text-2xl font-light text-[var(--ink)] mt-1">
              {balance.thrombosis.score} <span className="text-xs text-[var(--ink-muted)]">/ 100</span>
            </p>
            <p className="text-xs text-[var(--ink-muted)] mt-1">
              Monitors 0g venous pooling alongside exogenous estrogen clotting risk.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F3F0] border border-[#E8DFDB]">
            <h3 className="font-semibold text-[var(--ink)]">ARED Bone Shield Index</h3>
            <p className="text-2xl font-light text-[var(--ink)] mt-1">
              {balance.boneProtection.score} <span className="text-xs text-[var(--ink-muted)]">/ 100</span>
            </p>
            <p className="text-xs text-[var(--ink-muted)] mt-1">
              Status: <strong className="uppercase font-mono-tech">{balance.boneProtection.level}</strong>
            </p>
          </div>
        </div>
      </CenteredModal>

      {/* 3. Modal: Salud Íntima */}
      <CenteredModal
        isOpen={activeDrawer === 'intimate'}
        onClose={onClose}
        title="Microbiome & Intimate Health Vault"
      >
        {privacyMode ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-[var(--accent)] font-medium">
              Intimate telemetry is currently locked under Onboard Privacy Protocol.
            </p>
            <button
              type="button"
              onClick={onTogglePrivacy}
              className="px-4 py-2 rounded-full bg-[var(--accent)] text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              Unlock Vault
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#F5F3F0] border border-[#E8DFDB]">
              <span className="text-xs font-mono-tech uppercase text-[var(--ink-muted)]">Weekly pH Status</span>
              <p className="text-base font-semibold text-[var(--ink)] mt-0.5">4.2 (Nominal Flora)</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F5F3F0] border border-[#E8DFDB]">
              <span className="text-xs font-mono-tech uppercase text-[var(--ink-muted)]">Continuous Regimen Log</span>
              <p className="text-sm text-[var(--ink)] mt-0.5">Combined OCP Active · 0 Break Days Reported</p>
            </div>
          </div>
        )}
      </CenteredModal>

      {/* 4. Modal: Cirujano de Vuelo */}
      <CenteredModal
        isOpen={activeDrawer === 'ground-packet'}
        onClose={onClose}
        title="Flight Surgeon Telemetry Sync"
      >
        <p className="text-[var(--ink-muted)]">
          Packages encrypted physiological telemetry logs for Earth ground control review.
        </p>
        <div className="p-4 rounded-2xl bg-[#F8F5F3] border border-[#EAE3DF] space-y-2 mt-3 font-mono-tech text-xs">
          <div className="flex justify-between">
            <span>Target Body:</span>
            <span className="font-semibold text-[var(--ink)]">Lunar Gateway</span>
          </div>
          <div className="flex justify-between">
            <span>Encryption Standard:</span>
            <span className="font-semibold text-[var(--accent)]">AES-256 Medical Vault</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-semibold text-[var(--ok)]">Ready for Transmission</span>
          </div>
        </div>
      </CenteredModal>

      {/* 5. Modal: Calibración / Perfil */}
      <CenteredModal
        isOpen={activeDrawer === 'calibration'}
        onClose={onClose}
        title="Endocrine Baseline Calibration"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-mono-tech uppercase text-[var(--ink-muted)] mb-1">
              Basal Temperature Baseline (°C)
            </label>
            <input
              type="number"
              step="0.1"
              defaultValue={profile?.baselineTemp ?? 36.6}
              onChange={(e) => onUpdateProfile({ baselineTemp: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E6DFDA] bg-[#F5F3F0] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono-tech uppercase text-[var(--ink-muted)] mb-1">
              Autonomic HRV Baseline (ms)
            </label>
            <input
              type="number"
              defaultValue={profile?.baselineHRV ?? 68}
              onChange={(e) => onUpdateProfile({ baselineHRV: parseInt(e.target.value, 10) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E6DFDA] bg-[#F5F3F0] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </form>
      </CenteredModal>
    </>
  );
}