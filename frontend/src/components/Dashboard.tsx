// frontend/src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { SCENARIOS, INITIAL_TELEMETRY } from '../data/telemetrySeed';
import { BodyViewer, Callout } from './BodyViewer';
import { MetricModal } from './MetricModal';
import { HrvChart } from './HrvChart';
import { Term } from './Term';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'triage' | 'vascular' | 'intimate'>('overview');
  const [activeLayer, setActiveLayer] = useState<'circulation' | 'hormones' | 'bones'>('circulation');
  const [scenarioId, setScenarioId] = useState<string>(INITIAL_TELEMETRY.activeScenarioId);
  const [selectedCallout, setSelectedCallout] = useState<Callout | null>(null);
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
    <div className="grid grid-cols-[88px_1fr] h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Column 1: Vertical sidebar layer navigation tablist */}
      <aside 
        role="tablist" 
        aria-label="Body analysis layers"
        className="border-r border-slate-800/60 flex flex-col items-center py-6 gap-6 z-20 bg-slate-900/90 backdrop-blur-md"
      >
        <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase rotate-[-90deg] mb-2 select-none">
          Layers
        </div>
        
        <button 
          role="tab"
          aria-selected={activeLayer === 'circulation'}
          onClick={() => setActiveLayer('circulation')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all w-16 ${
            activeLayer === 'circulation' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-xs font-medium">Heart</span>
        </button>

        <button 
          role="tab"
          aria-selected={activeLayer === 'hormones'}
          onClick={() => setActiveLayer('hormones')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all w-16 ${
            activeLayer === 'hormones' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-xs font-medium">Hormones</span>
        </button>

        <button 
          role="tab"
          aria-selected={activeLayer === 'bones'}
          onClick={() => setActiveLayer('bones')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all w-16 ${
            activeLayer === 'bones' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-xs font-medium">Bones</span>
        </button>
      </aside>

      {/* Column 2: Main content area */}
      <main className="relative overflow-y-auto p-8 flex flex-col gap-6">
        
        {/* Header and Status Banner (Fase 5) */}
        <header className="flex flex-col gap-4 pb-4 border-b border-slate-800/40">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-100">{currentScenario.name} · Mission Health</h1>
              {/* Status Banner */}
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-sm text-emerald-400 font-medium">All nominal · 1 recommendation for today</p>
              </div>
            </div>
            
            {/* Location selector */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg p-1.5">
              <span className="text-xs text-slate-400 px-2 font-mono">Location:</span>
              <select 
                value={scenarioId} 
                onChange={(e) => setScenarioId(e.target.value)}
                className="bg-slate-950 text-slate-200 text-xs rounded px-2 py-1 border border-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="gateway">Lunar Gateway ({SCENARIOS.gateway.latencySeconds}s latency)</option>
                <option value="mars">Mars Transit ({currentScenario.latencySeconds / 60}m latency)</option>
              </select>
            </div>
          </div>

          {/* Hidden Jury Demo Mode controls (?demo=1) */}
          {isDemoMode && (
            <div className="flex items-center gap-3 p-3 bg-purple-950/30 border border-purple-800/50 rounded-xl text-xs">
              <span className="font-mono uppercase text-purple-400 font-semibold">Jury Demo Mode:</span>
              <span className="text-slate-300">Nominal Baseline locked for evaluation.</span>
            </div>
          )}

          {/* User-Goal Navigation Tabs */}
          <nav aria-label="User goals" className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'overview' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Overview (Today)
            </button>
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'triage' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Symptom Check
            </button>
            <button
              onClick={() => setActiveTab('vascular')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'vascular' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Heart & Bones
            </button>
            <button
              onClick={() => setActiveTab('intimate')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'intimate' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Reproductive Health
            </button>
          </nav>
        </header>

        {/* Central layout depending on selected tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
              <BodyViewer 
                activeLayer={activeLayer}
                onSelectCallout={(callout) => setSelectedCallout(callout)}
              />
            </div>
            
            {/* Sidebar telemetry and trend charts */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-xs font-medium tracking-wide text-slate-300 uppercase font-mono mb-3">
                  <Term term="Environmental Life Support" abbr="ECLSS" definition="Closed ecological life support system managing air, water, and waste." />
                </h2>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/40 text-sm">
                  <span className="text-slate-300">Internal CO₂ Loop</span>
                  <span className="font-mono font-semibold text-emerald-400">{currentScenario.eclssCo2Percent}%</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-800/40 text-sm">
                  <span className="text-slate-300">Water Hydration</span>
                  <span className="font-mono font-semibold text-slate-200">{INITIAL_TELEMETRY.water.consumedMl} / {INITIAL_TELEMETRY.water.targetMl} ml</span>
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
          <div className="p-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-medium text-slate-100">Differential Triage & Symptom Checker</h2>
            <p className="text-sm text-slate-300">Select any unexpected symptom to run automated clinical differential checks against your orbital baseline.</p>
          </div>
        )}

        {activeTab === 'vascular' && (
          <div className="p-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-medium text-slate-100">Vascular & Bone Density Status</h2>
            <p className="text-sm text-slate-300">Detailed logs for bone mineral density (<Term term="Bone Mineral Density" abbr="BMD" definition="Measurement of bone mineral content per square centimeter." />) response to <Term term="Advanced Resistive Exercise Device" abbr="ARED" definition="Exercise machine used by astronauts to mitigate bone and muscle loss." /> protocols.</p>
          </div>
        )}

        {activeTab === 'intimate' && (
          <div className="p-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-medium text-slate-100">Reproductive Health & Basal Temperature</h2>
            <p className="text-sm text-slate-300">Continuous combined regimen (<Term term="Oral Contraceptive Pill" abbr="OCP" definition="Medication used for birth control and hormonal regulation." />) logs and cycle analytics evaluated against personal baseline.</p>
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