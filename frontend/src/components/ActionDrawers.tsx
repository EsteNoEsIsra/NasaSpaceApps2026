import { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldAlert,
  Lock,
  Unlock,
  Send,
  Stethoscope,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { api } from '@/services/api';
import type {
  AstronautProfile,
  ContraceptiveType,
  DailyCheckin,
  HealthAlert,
  VascularBoneBalance,
} from '@/types/hera';

export type ActiveDrawer =
  | null
  | 'checkin'
  | 'triage'
  | 'vascular-bone'
  | 'intimate'
  | 'calibration'
  | 'ground-packet';

interface ActionDrawersProps {
  activeDrawer: ActiveDrawer;
  onClose: () => void;
  profile: AstronautProfile | null;
  checkin: DailyCheckin | null;
  alerts: HealthAlert[];
  balance: VascularBoneBalance;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onSubmitCheckin: (payload: Record<string, unknown>) => Promise<void>;
  onUpdateProfile: (payload: Record<string, unknown>) => Promise<void>;
}

const SYMPTOM_OPTIONS = [
  { id: 'headache', label: 'Headache' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'vision_blur', label: 'Blurred Vision (SANS)' },
  { id: 'leg_swelling', label: 'Lower-Limb Swelling' },
  { id: 'leg_pain', label: 'Calf / Leg Tenderness' },
  { id: 'burning_urination', label: 'Urinary Discomfort' },
  { id: 'vaginal_itching', label: 'Intimate Flora Irritation' },
];

const PH_SWATCHES = [
  { value: 4.0, label: '4.0 Optimal', color: '#E8C547' },
  { value: 4.4, label: '4.4 Balanced', color: '#C4B454' },
  { value: 4.8, label: '4.8 Elevated', color: '#7A9A65' },
  { value: 5.3, label: '5.3 High Shift', color: '#457B7D' },
];

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
  const [pillTaken, setPillTaken] = useState(checkin?.pillTaken ?? true);
  const [hydrationMl, setHydrationMl] = useState(checkin?.hydrationMl ?? 2500);
  const [exerciseMinutes, setExerciseMinutes] = useState(checkin?.exerciseMinutes ?? 60);
  const [symptoms, setSymptoms] = useState<string[]>(checkin?.symptoms ?? []);
  const [vaginalPh, setVaginalPh] = useState<number>(checkin?.vaginalPh ?? 4.2);
  const [swabResult, setSwabResult] = useState<'normal' | 'candida_risk' | 'bv_risk' | 'uti_risk'>(
    checkin?.swabResult ?? 'normal'
  );
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [contraceptiveType, setContraceptiveType] = useState<ContraceptiveType>(
    profile?.contraceptiveType ?? 'combined'
  );
  const [baselineTemp, setBaselineTemp] = useState(profile?.baselineTemp ?? 36.6);
  const [baselineHRV, setBaselineHRV] = useState(profile?.baselineHRV ?? 68);
  const [targetHydrationMl, setTargetHydrationMl] = useState(
    profile?.targetHydrationMl ?? 2500
  );

  const [groundPacket, setGroundPacket] = useState<Record<string, unknown> | null>(null);
  const [includeIntimateInPacket, setIncludeIntimateInPacket] = useState(false);

  useEffect(() => {
    if (checkin) {
      setPillTaken(checkin.pillTaken);
      setHydrationMl(checkin.hydrationMl);
      setExerciseMinutes(checkin.exerciseMinutes);
      setSymptoms(checkin.symptoms);
      if (checkin.vaginalPh) setVaginalPh(checkin.vaginalPh);
      if (checkin.swabResult) setSwabResult(checkin.swabResult);
    }
  }, [checkin]);

  useEffect(() => {
    if (profile) {
      setContraceptiveType(profile.contraceptiveType);
      setBaselineTemp(profile.baselineTemp);
      setBaselineHRV(profile.baselineHRV);
      setTargetHydrationMl(profile.targetHydrationMl);
    }
  }, [profile]);

  useEffect(() => {
    if (activeDrawer === 'ground-packet') {
      api
        .get<{ data: Record<string, unknown> }>(
          `/api/health/ground-packet?includeIntimate=${includeIntimateInPacket}`
        )
        .then((res) => setGroundPacket(res.data))
        .catch(() => setGroundPacket({ error: 'Unable to compile packet' }));
    }
  }, [activeDrawer, includeIntimateInPacket]);

  if (!activeDrawer) return null;

  const toggleSymptom = (id: string) => {
    setSymptoms((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleCheckinSave = async () => {
    setSaving(true);
    try {
      await onSubmitCheckin({
        pillTaken,
        hydrationMl,
        exerciseMinutes,
        symptoms,
        notes: notes || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleIntimateSave = async () => {
    setSaving(true);
    try {
      await onSubmitCheckin({
        pillTaken,
        hydrationMl,
        exerciseMinutes,
        symptoms,
        vaginalPh,
        swabResult,
        isPrivate: true,
        notes: notes || 'Intimate microbiome & pH strip logged.',
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleCalibrationSave = async () => {
    setSaving(true);
    try {
      await onUpdateProfile({
        contraceptiveType,
        baselineTemp,
        baselineHRV,
        targetHydrationMl,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#181113]/45 backdrop-blur-xs flex items-center justify-end p-4">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl border border-[#E6DFDA] text-[#1A1517]">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE6]">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#DF5A49]" />
            <h2 className="text-base font-semibold">
              {activeDrawer === 'checkin' && 'Quick Daily Check-In (< 20 sec)'}
              {activeDrawer === 'triage' && 'Anti-Bias Differential Diagnosis Engine'}
              {activeDrawer === 'vascular-bone' && 'Vascular VTE vs. Bone Protection Balance'}
              {activeDrawer === 'intimate' && 'Private Space: Microbiome & Urogenital pH'}
              {activeDrawer === 'calibration' && 'Her Endocrine Baseline Calibration'}
              {activeDrawer === 'ground-packet' && 'Asynchronous Flight Surgeon Telemetry Packet'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F5F3F0] text-[#7A6F73] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. QUICK DAILY CHECK-IN */}
        {activeDrawer === 'checkin' && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F5F3]">
              <div>
                <div className="text-xs font-semibold">Continuous Oral Contraceptive Dose</div>
                <div className="text-[11px] text-[#7A6F73]">
                  Confirms daily endocrine suppression schedule
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPillTaken(!pillTaken)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  pillTaken ? 'bg-[#2A9D8F] text-white' : 'bg-[#DF5A49] text-white'
                }`}
              >
                {pillTaken ? 'Taken Today ✓' : 'Mark Taken'}
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Fluid Intake (ml)</span>
                <span className="font-mono-tech text-[#2A9D8F]">{hydrationMl} ml</span>
              </div>
              <input
                type="range"
                min={500}
                max={4000}
                step={100}
                value={hydrationMl}
                onChange={(e) => setHydrationMl(Number(e.target.value))}
                className="w-full accent-[#2A9D8F]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>ARED Resistive Exercise (min)</span>
                <span className="font-mono-tech text-[#6B4C7A]">{exerciseMinutes} min</span>
              </div>
              <input
                type="range"
                min={0}
                max={120}
                step={5}
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                className="w-full accent-[#6B4C7A]"
              />
            </div>

            <div>
              <div className="text-xs font-semibold mb-2">
                Report Symptoms (Cross-checked against Cabin CO₂ &amp; SANS)
              </div>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map((sym) => {
                  const active = symptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#DF5A49] text-white border-[#DF5A49]'
                          : 'bg-white text-[#4A4145] border-[#E2DAD5] hover:border-[#DF5A49]'
                      }`}
                    >
                      {sym.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleCheckinSave}
              className="w-full py-3 rounded-2xl bg-[#181113] text-white text-xs font-semibold hover:bg-[#2C2024] transition-colors cursor-pointer"
            >
              {saving ? 'Running Differential Engine...' : 'Save Log & Run Differential Analysis'}
            </button>
          </div>
        )}

        {/* 2. DIFFERENTIAL TRIAGE */}
        {activeDrawer === 'triage' && (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-[#6B5F63] leading-relaxed">
              HERA prevents medical bias by cross-referencing reported symptoms against live spacecraft ECLSS gases (CO₂/O₂), ocular telemetry, and her calibrated hormonal baseline.
            </p>

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border border-[#E6DFDA] bg-[#FAF8F6] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {alert.severity === 'info' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-[#DF5A49] shrink-0" />
                    )}
                    <span className="text-xs font-bold text-[#1A1517]">{alert.title}</span>
                  </div>
                  <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#181113] text-white shrink-0">
                    {alert.confidence}% CONF
                  </span>
                </div>

                <p className="text-xs text-[#4A4145] leading-relaxed">{alert.description}</p>

                <div className="bg-white p-3 rounded-xl border border-[#EDE7E3]">
                  <div className="text-[10px] font-mono-tech uppercase text-[#7A6F73] mb-1">
                    Differential Attribution Breakdown
                  </div>
                  <ul className="space-y-1">
                    {alert.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="text-xs text-[#1A1517] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DF5A49]" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-[10px] font-mono-tech uppercase text-[#2A9D8F] font-semibold mb-1">
                    Autonomous Onboard Countermeasures
                  </div>
                  <ol className="space-y-1 list-decimal list-inside text-xs text-[#2B2427]">
                    {alert.recommendedActions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. VASCULAR VS BONE BALANCE */}
        {activeDrawer === 'vascular-bone' && (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#6B4C7A]/10 text-xs text-[#493254] font-medium leading-relaxed">
              {balance.netBalanceSummary}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-[#E6DFDA]">
                <div className="text-[10px] font-mono-tech uppercase text-[#7A6F73]">
                  Thrombotic Risk (VTE)
                </div>
                <div className="text-2xl font-semibold text-[#DF5A49] mt-1 tabular-nums">
                  {balance.thrombosis.score}/100
                </div>
                <div className="text-[11px] uppercase font-mono-tech text-[#7A6F73]">
                  Level: {balance.thrombosis.level}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#E6DFDA]">
                <div className="text-[10px] font-mono-tech uppercase text-[#7A6F73]">
                  Bone Density Shield
                </div>
                <div className="text-2xl font-semibold text-[#2A9D8F] mt-1 tabular-nums">
                  {balance.boneProtection.score}/100
                </div>
                <div className="text-[11px] uppercase font-mono-tech text-[#7A6F73]">
                  Level: {balance.boneProtection.level}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold">Vascular Factor Breakdown</div>
              {balance.thrombosis.factors.map((f, i) => (
                <div key={i} className="text-xs text-[#4A4145] bg-[#FAF8F6] p-2.5 rounded-xl">
                  {f}
                </div>
              ))}
              <p className="text-xs font-medium text-[#1A1517] pt-1">
                {balance.thrombosis.recommendation}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EFEAE6]">
              <div className="text-xs font-semibold">Skeletal Osteoprotection Breakdown</div>
              {balance.boneProtection.factors.map((f, i) => (
                <div key={i} className="text-xs text-[#4A4145] bg-[#FAF8F6] p-2.5 rounded-xl">
                  {f}
                </div>
              ))}
              <p className="text-xs font-medium text-[#2A9D8F] pt-1">
                {balance.boneProtection.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* 4. INTIMATE MICROBIOME & pH VAULT */}
        {activeDrawer === 'intimate' && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#6B4C7A]/10">
              <div className="flex items-center gap-2 text-xs text-[#493254] font-medium">
                {privacyMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>
                  {privacyMode
                    ? 'Privacy Shield Active (Shared Cabin Mode)'
                    : 'Private Vault Unlocked (Astronaut Eyes Only)'}
                </span>
              </div>
              <button
                type="button"
                onClick={onTogglePrivacy}
                className="px-3 py-1 rounded-full bg-[#6B4C7A] text-white text-[11px] font-semibold cursor-pointer"
              >
                {privacyMode ? 'Unlock' : 'Lock'}
              </button>
            </div>

            <div className={privacyMode ? 'blur-sm pointer-events-none select-none' : ''}>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold mb-2">
                    Colorimetric Urogenital pH Strip (Weekly / On-Demand)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PH_SWATCHES.map((sw) => (
                      <button
                        key={sw.value}
                        type="button"
                        onClick={() => setVaginalPh(sw.value)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer ${
                          vaginalPh === sw.value
                            ? 'border-[#181113] bg-[#F8F5F3]'
                            : 'border-[#E6DFDA]'
                        }`}
                      >
                        <span
                          style={{ backgroundColor: sw.color }}
                          className="w-5 h-5 rounded-full shrink-0 border border-black/10"
                        />
                        <span className="text-xs font-medium">{sw.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-1.5">Onboard Swab Assay Result</div>
                  <select
                    value={swabResult}
                    onChange={(e) =>
                      setSwabResult(
                        e.target.value as 'normal' | 'candida_risk' | 'bv_risk' | 'uti_risk'
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-[#E2DAD5] text-xs bg-white"
                  >
                    <option value="normal">Balanced Lactobacillus Flora (Nominal)</option>
                    <option value="candida_risk">Fungal / Candida Overgrowth Marker</option>
                    <option value="bv_risk">Bacterial Flora Shift (pH &gt; 4.5)</option>
                    <option value="uti_risk">Urinary Tract Bacterial Marker</option>
                  </select>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-1">Private Astronaut Notes</div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Encrypted onboard log — excluded from Flight Surgeon packets unless authorized..."
                    className="w-full p-2.5 rounded-xl border border-[#E2DAD5] text-xs"
                  />
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleIntimateSave}
                  className="w-full py-3 rounded-2xl bg-[#6B4C7A] text-white text-xs font-semibold hover:opacity-95 cursor-pointer"
                >
                  {saving ? 'Saving Encrypted Log...' : 'Log Periodic Swab & Evaluate Immunity'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. ENDOCRINE BASELINE CALIBRATION */}
        {activeDrawer === 'calibration' && (
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#F8F5F3] text-xs text-[#4A4145]">
              <Sliders className="w-4 h-4 text-[#DF5A49] shrink-0 mt-0.5" />
              <span>
                HERA sets <strong>her endocrine profile</strong> as the reference zero-point so basal temperature and HRV shifts are never misread against male norms.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Active Hormonal Regimen
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'combined', label: 'Combined OCP' },
                    { id: 'progestin-only', label: 'Progestin-Only' },
                    { id: 'none', label: 'Natural Cycle' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setContraceptiveType(opt.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border cursor-pointer ${
                      contraceptiveType === opt.id
                        ? 'bg-[#181113] text-white border-[#181113]'
                        : 'bg-white border-[#E2DAD5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#7A6F73] mb-1">Basal Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={baselineTemp}
                  onChange={(e) => setBaselineTemp(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-[#E2DAD5] text-xs font-mono-tech"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#7A6F73] mb-1">Calibrated HRV</label>
                <input
                  type="number"
                  value={baselineHRV}
                  onChange={(e) => setBaselineHRV(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-[#E2DAD5] text-xs font-mono-tech"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#7A6F73] mb-1">Fluid Goal (ml)</label>
                <input
                  type="number"
                  step="100"
                  value={targetHydrationMl}
                  onChange={(e) => setTargetHydrationMl(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-[#E2DAD5] text-xs font-mono-tech"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleCalibrationSave}
              className="w-full py-3 rounded-2xl bg-[#181113] text-white text-xs font-semibold cursor-pointer"
            >
              {saving ? 'Recalibrating...' : 'Apply Her Calibrated Baseline'}
            </button>
          </div>
        )}

        {/* 6. FLIGHT SURGEON ASYNCHRONOUS TELEMETRY PACKET */}
        {activeDrawer === 'ground-packet' && (
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#F8F5F3] text-xs text-[#4A4145]">
              <Sparkles className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
              <span>
                Designed for deep-space communication latency: compresses clinical triage &amp; ECLSS context while stripping private intimate logs unless explicitly authorized.
              </span>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#E6DFDA] text-xs cursor-pointer">
              <span>Authorize inclusion of intimate pH / swab details</span>
              <input
                type="checkbox"
                checked={includeIntimateInPacket}
                onChange={(e) => setIncludeIntimateInPacket(e.target.checked)}
                className="accent-[#6B4C7A]"
              />
            </label>

            <pre className="p-3.5 rounded-2xl bg-[#181113] text-[#2EC4B6] text-[11px] font-mono-tech overflow-x-auto max-h-72">
              {groundPacket ? JSON.stringify(groundPacket, null, 2) : 'Compiling telemetry packet...'}
            </pre>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#2A9D8F] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Queue Asynchronous Downlink to Houston Flight Surgeon
            </button>
          </div>
        )}
      </div>
    </div>
  );
}