// frontend/src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { SCENARIOS, INITIAL_TELEMETRY } from '../data/telemetrySeed';
import { FemaleAnatomy3D } from './FemaleAnatomy3D';
import { MetricModal } from './MetricModal';
import { HrvChart } from './HrvChart';
import { Term } from './Term';
import type { BodySystemId } from '@/types/hera';
import heraLogoLight from '@/assets/hera-logo-on-light.svg'; // Ajusta la ruta según la ubicación de tu logo

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'triage' | 'vascular' | 'intimate'>('overview');
  const [activeLayer, setActiveLayer] = useState<'circulation' | 'hormones' | 'bones'>('circulation');
  const [scenarioId, setScenarioId] = useState<string>(INITIAL_TELEMETRY.activeScenarioId);
  const [selectedSystem, setSelectedSystem] = useState<BodySystemId | null>(null);
  const [selectedCallout, setSelectedCallout] = useState<any | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Check for ?demo=1 query parameter in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') {
      setIsDemoMode(true);
    }
  }, []);

  const currentScenario = SCENARIOS[scenarioId] || SCENARIOS.gateway;

  return (
    <div className="grid grid-cols-[88px_1fr] h-screen w-screen overflow-hidden bg-[#FAF8F5] text-[#1A1517] font-sans">
      
      {/* Column 1: Vertical sidebar layer navigation tablist */}
      <aside 
        role="tablist" 
        aria-label="Body analysis layers"
        className="border-r border-[#E8E2DD] flex flex-col items-center py-6 gap-6 z-20 bg-white shadow-xs"
      >
        <div className="text-[10px] font-mono-tech tracking-widest text-[#7A6F73] uppercase rotate-[-90deg] mb-2 select-none">
          Layers
        </div>
        
        <button 
          role="tab"
          aria-selected={activeLayer === 'circulation'}
          onClick={() => setActiveLayer('circulation')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all w-16 cursor-pointer ${
            activeLayer === 'circulation' 
              ? 'bg-[#DF5A49]/10 text-[#DF5A49] border border-[#DF5A49]/30 font-semibold' 
              : 'text-[#7A6F73] hover:text-[#1A1517] hover:bg-[#F5F1EE]'
          }`}
        >
          <span className="text-xs font-medium">Heart</span>
        </button>

        <button 
          role="tab"
          aria-selected={activeLayer === 'hormones'}
          onClick={() => setActiveLayer('hormones')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all w-16 cursor-pointer ${
            activeLayer === 'hormones' 
              ? 'bg-[#6B4C7A]/10 text-[#6B4C7A] border border-[#6B4C7A]/30 font-semibold' 
              : 'text-[#7A6F73] hover:text-[#1A1517] hover:bg-[#F5F1EE]'
          }`}
        >
          <span className="text-xs font-medium">Hormones</span>
        </button>

        <button 
          role="tab"
          aria-selected={activeLayer === 'bones'}
          onClick={() => setActiveLayer('bones')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all w-16 cursor-pointer ${
            activeLayer === 'bones' 
              ? 'bg-[#2A9D8F]/10 text-[#2A9D8F] border border-[#2A9D8F]/30 font-semibold' 
              : 'text-[#7A6F73] hover:text-[#1A1517] hover:bg-[#F5F1EE]'
          }`}
        >
          <span className="text-xs font-medium">Bones</span>
        </button>
      </aside>

      {/* Column 2: Main content area */}
      <main className="relative overflow-y-auto p-8 flex flex-col gap-6">
        
        {/* Header and Status Banner */}
        <header className="flex flex-col gap-4 pb-4 border-b border-[#E8E2DD]">
          <div className="flex justify-between items-center">
            
            {/* Logo y título con hera-logo-on-light */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden bg-white border border-[#E8E2DD] shadow-xs">
                <img 
                  src={heraLogoLight} 
                  alt="HERA Logo" 
                  className="w-full h-full object-contain p-1" 
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-[#1A1517]">HERA</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-tech font-medium bg-[#6B4C7A]/10 text-[#6B4C7A] border border-[#6B4C7A]/20">
                    DAY 42 · LUNAR GATEWAY
                  </span>
                </div>
                <p className="text-xs text-[#7A6F73] font-medium">
                  Hormonal Evaluation and Regulation in Astronauts · Designed for Women in Space
                </p>
              </div>
            </div>
            
            {/* Location / Scenario Selector */}
            <div className="flex items-center gap-3 bg-white border border-[#E8E2DD] rounded-2xl p-2 shadow-2xs">
              <span className="text-xs text-[#7A6F73] px-2 font-mono-tech">Scenario / Hazard:</span>
              <select 
                value={scenarioId} 
                onChange={(e) => setScenarioId(e.target.value)}
                className="bg-[#FAF8F5] text-[#1A1517] text-xs rounded-xl px-3 py-1.5 border border-[#E8E2DD] focus:outline-none focus:border-[#DF5A49] font-medium cursor-pointer"
              >
                <option value="gateway">Nominal Baseline (Lunar Gateway)</option>
                <option value="co2_spike_dehydration">CO₂ Spike + Dehydration Critical</option>
                <option value="sans_precursor">SANS Precursor (Cephalad Fluid Shift)</option>
                <option value="microbiome_immuno">Microbiome / pH Imbalance</option>
              </select>
            </div>
          </div>

          {/* Hidden Jury Demo Mode controls */}
          {isDemoMode && (
            <div className="flex items-center gap-3 p-3 bg-[#6B4C7A]/10 border border-[#6B4C7A]/30 rounded-2xl text-xs">
              <span className="font-mono-tech uppercase text-[#6B4C7A] font-semibold">Jury Demo Mode:</span>
              <span className="text-[#1A1517]">Nominal Baseline locked for evaluation.</span>
            </div>
          )}

          {/* User-Goal Navigation Tabs */}
          <nav aria-label="User goals" className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#1A1517] text-white shadow-xs' : 'bg-white text-[#7A6F73] hover:text-[#1A1517] hover:bg-[#F2ECE8] border border-[#E8E2DD]'
              }`}
            >
              Overview (Today)
            </button>
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'triage' ? 'bg-[#1A1517] text-white shadow-xs' : 'bg-white text-[#7A6F73] hover:text-[#1A1517] hover:bg-[#F2ECE8] border border-[#E8E2DD]'
              }`}
            >
              Symptom Check
            </button>
            <button
              onClick={() => setActiveTab('vascular')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'vascular' ? 'bg-[#1A1517] text-white shadow-xs' : 'bg-white text-[#7A6F73] hover:text-[#1A1517] hover:bg-[#F2ECE8] border border-[#E8E2DD]'
              }`}
            >
              Heart &amp; Bones
            </button>
            <button
              onClick={() => setActiveTab('intimate')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'intimate' ? 'bg-[#1A1517] text-white shadow-xs' : 'bg-white text-[#7A6F73] hover:text-[#1A1517] hover:bg-[#F2ECE8] border border-[#E8E2DD]'
              }`}
            >
              Reproductive Health
            </button>
          </nav>
        </header>

        {/* Central layout depending on selected tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-2 bg-white border border-[#E8E2DD] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] shadow-xs">
              <FemaleAnatomy3D 
                selectedSystem={selectedSystem}
                onSelectSystem={(sys) => setSelectedSystem(sys)}
                systemSeverities={currentScenario.severities}
                co2Level={currentScenario.eclssCo2Percent}
                bodyTemp={36.8}
                baselineTemp={36.6}
                privacyMode={false}
                onOpenMetricModal={(metricId) => {
                  console.log('Open metric modal:', metricId);
                }}
              />
            </div>
            
            {/* Sidebar telemetry and trend charts */}
            <div className="bg-white border border-[#E8E2DD] rounded-3xl p-6 flex flex-col gap-6 shadow-xs">
              <div>
                <h2 className="text-xs font-medium tracking-wide text-[#7A6F73] uppercase font-mono-tech mb-3">
                  <Term term="Environmental Life Support" abbr="ECLSS" definition="Closed ecological life support system managing air, water, and waste." />
                </h2>
                <div className="flex justify-between items-center py-2.5 border-b border-[#F2ECE8] text-sm">
                  <span className="text-[#1A1517]">Internal CO₂ Loop</span>
                  <span className="font-mono-tech font-semibold text-[#2A9D8F]">{currentScenario.eclssCo2Percent}%</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[#F2ECE8] text-sm">
                  <span className="text-[#1A1517]">Water Hydration</span>
                  <span className="font-mono-tech font-semibold text-[#1A1517]">{INITIAL_TELEMETRY.water.consumedMl} / {INITIAL_TELEMETRY.water.targetMl} ml</span>
                </div>
              </div>

              <HrvChart 
                currentValue={INITIAL_TELEMETRY.hrv.current} 
                baseline={INITIAL_TELEMETRY.hrv.baseline} 
                unit={INITIAL_TELEMETRY.hrv.unit} 
              />
            </div>
          </div>
        )}

        {activeTab === 'triage' && (
          <div className="p-8 bg-white border border-[#E8E2DD] rounded-3xl flex flex-col gap-4 animate-in fade-in duration-200 shadow-xs">
            <h2 className="text-lg font-medium text-[#1A1517]">Differential Triage &amp; Symptom Checker</h2>
            <p className="text-sm text-[#7A6F73]">Select any unexpected symptom to run automated clinical differential checks against your orbital baseline.</p>
          </div>
        )}

        {activeTab === 'vascular' && (
          <div className="p-8 bg-white border border-[#E8E2DD] rounded-3xl flex flex-col gap-4 animate-in fade-in duration-200 shadow-xs">
            <h2 className="text-lg font-medium text-[#1A1517]">Vascular &amp; Bone Density Status</h2>
            <p className="text-sm text-[#7A6F73]">Detailed logs for bone mineral density (<Term term="Bone Mineral Density" abbr="BMD" definition="Measurement of bone mineral content per square centimeter." />) response to <Term term="Advanced Resistive Exercise Device" abbr="ARED" definition="Exercise machine used by astronauts to mitigate bone and muscle loss." /> protocols.</p>
          </div>
        )}

        {activeTab === 'intimate' && (
          <div className="p-8 bg-white border border-[#E8E2DD] rounded-3xl flex flex-col gap-4 animate-in fade-in duration-200 shadow-xs">
            <h2 className="text-lg font-medium text-[#1A1517]">Reproductive Health &amp; Basal Temperature</h2>
            <p className="text-sm text-[#7A6F73]">Continuous combined regimen (<Term term="Oral Contraceptive Pill" abbr="OCP" definition="Medication used for birth control and hormonal regulation." />) logs and cycle analytics evaluated against personal baseline.</p>
          </div>
        )}

      </main>

      {/* Centered Modal Component */}
      <MetricModal 
        callout={selectedCallout} 
        onClose={() => setSelectedCallout(null)} 
      />
    </div>
  );
}