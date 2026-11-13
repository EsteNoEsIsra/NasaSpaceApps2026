// ==============================================================================
// V.E.N.U.S. Voice Control & Dual Tactical Hotkeys Interface
// Hands-free microgravity voice recognition + bulletproof live demo fallbacks
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertOctagon, RefreshCw } from 'lucide-react';
import { parseSpokenIntent, speakTacticalMessage, SpeechCommandIntent } from '../../engine/speechEngine';

interface VoiceControlBarProps {
  onCommandReceived: (intent: SpeechCommandIntent) => void;
  lastSpokenText: string;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({
  onCommandReceived,
  lastSpokenText,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported) {
      speakTacticalMessage('Control por voz no soportado en este navegador. Usando teclado táctico.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onresult = (event) => {
          const spoken = event.results[0][0].transcript;
          setTranscript(spoken);
          const intent = parseSpokenIntent(spoken);
          onCommandReceived(intent);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="w-full bg-space-900/90 border border-space-800 rounded-xl p-3 backdrop-blur shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Voice Engine Status & Waveform */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2 ${
              isListening
                ? 'bg-red-950/80 border-hud-red text-hud-red shadow-[0_0_15px_rgba(255,51,102,0.4)] animate-pulse'
                : 'bg-space-850 hover:bg-space-800 border-space-700 text-slate-300'
            }`}
            title="Activar reconocimiento por voz"
          >
            {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <MicOff className="w-4 h-4" />}
            <span className="font-mono text-xs font-bold">
              {isListening ? 'ESCUCHANDO...' : 'VOZ: ACTIVAR'}
            </span>
          </button>

          {/* Audio Visualizer Wave Effect */}
          <div className="flex items-center gap-1 h-5 px-2 bg-space-950 rounded border border-space-800">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isListening ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700 h-2'
                }`}
                style={{
                  height: isListening ? `${Math.floor(Math.random() * 16 + 4)}px` : '4px',
                }}
              />
            ))}
          </div>

          {/* Transcript / Spoken Feedback */}
          <div className="text-xs font-mono text-slate-300 truncate max-w-xs">
            {transcript ? (
              <span className="text-cyan-300">"{transcript}"</span>
            ) : lastSpokenText ? (
              <span className="text-slate-400 italic">V.E.N.U.S: {lastSpokenText}</span>
            ) : (
              <span className="text-slate-500">"VENUS, registrar pastilla" o "reporte"</span>
            )}
          </div>
        </div>

        {/* Tactical Hotkeys / Pitch Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-[10px] text-slate-500 mr-1 hidden sm:inline">DEMO HOTKEYS:</span>

          <button
            onClick={() => onCommandReceived('LOG_PILL')}
            className="px-2 py-1 bg-space-850 hover:bg-space-800 text-purple-300 border border-purple-500/40 rounded transition-all flex items-center gap-1"
            title="Hotkey: P or Space"
          >
            <span className="bg-space-800 px-1 py-0.2 rounded text-[10px] text-white font-bold border border-space-700">P</span>
            <span>PASTILLA</span>
          </button>

          <button
            onClick={() => onCommandReceived('LAYER_VASCULAR')}
            className="px-2 py-1 bg-space-850 hover:bg-space-800 text-cyan-300 border border-cyan-500/40 rounded transition-all flex items-center gap-1"
            title="Hotkey: V"
          >
            <span className="bg-space-800 px-1 py-0.2 rounded text-[10px] text-white font-bold border border-space-700">V</span>
            <span>CAPA</span>
          </button>

          <button
            onClick={() => onCommandReceived('SIMULATE_EMERGENCY')}
            className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-hud-red border border-hud-red/60 rounded transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(255,51,102,0.2)] font-bold"
            title="Hotkey: Shift + D"
          >
            <span className="bg-red-900/80 px-1 py-0.2 rounded text-[10px] text-white font-bold border border-red-500">⇧D</span>
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>INCIDENTE</span>
          </button>

          <button
            onClick={() => onCommandReceived('RESET_NOMINAL')}
            className="px-2 py-1 bg-space-850 hover:bg-space-800 text-slate-300 border border-space-700 rounded transition-all flex items-center gap-1"
            title="Hotkey: R"
          >
            <span className="bg-space-800 px-1 py-0.2 rounded text-[10px] text-white font-bold border border-space-700">R</span>
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
};
