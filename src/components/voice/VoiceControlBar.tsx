// ==============================================================================
// V.E.N.U.S. Voice Control & Dual Tactical Hotkeys Interface (Warm & Friendly)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, RefreshCw, AlertCircle, Flower2, Layers } from 'lucide-react';
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
      speakTacticalMessage('Control por voz no soportado en este navegador. Puedes usar los botones táctiles o el teclado.');
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
    <div className="w-full bg-venus-900/80 border border-venus-border rounded-3xl p-3.5 backdrop-blur-xl shadow-soft-glass">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Voice Microphone & Feedback */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={toggleListening}
            className={`px-3.5 py-2.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 ${
              isListening
                ? 'bg-venus-coral text-white border-white shadow-glow-coral animate-pulse'
                : 'bg-venus-850 hover:bg-venus-800 border-venus-border text-venus-blush hover:shadow-glow-rose'
            }`}
            title="Activar asistente de voz para manos libres"
          >
            {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <MicOff className="w-4 h-4" />}
            <span className="text-xs font-semibold">
              {isListening ? 'Escuchándote...' : 'Hablar con V.E.N.U.S.'}
            </span>
          </button>

          {/* Gentle Sound Wave Visualizer */}
          <div className="flex items-center gap-1 h-6 px-2.5 bg-venus-950/80 rounded-xl border border-venus-border/40">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isListening ? 'bg-venus-rose animate-pulse' : 'bg-venus-700 h-2'
                }`}
                style={{
                  height: isListening ? `${Math.floor(Math.random() * 16 + 6)}px` : '4px',
                }}
              />
            ))}
          </div>

          {/* Transcript / Spoken Output */}
          <div className="text-xs text-slate-300 truncate max-w-sm">
            {transcript ? (
              <span className="text-venus-blush font-medium">"{transcript}"</span>
            ) : lastSpokenText ? (
              <span className="text-slate-300 italic">V.E.N.U.S: {lastSpokenText}</span>
            ) : (
              <span className="text-slate-400">Prueba: "VENUS, registrar pastilla" o "reporte"</span>
            )}
          </div>
        </div>

        {/* Demo Fast Action Pills (Pitch Friendly) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Atajos Rápidos:</span>

          <button
            onClick={() => onCommandReceived('LOG_PILL')}
            className="px-3 py-1.5 bg-venus-rose/15 hover:bg-venus-rose/25 text-venus-blush border border-venus-rose/40 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            title="Tecla rápida: P o Espacio"
          >
            <Flower2 className="w-3.5 h-3.5 text-venus-rose" />
            <span className="font-medium">Tomar Dosis [P]</span>
          </button>

          <button
            onClick={() => onCommandReceived('LAYER_VASCULAR')}
            className="px-3 py-1.5 bg-venus-teal/15 hover:bg-venus-teal/25 text-emerald-200 border border-venus-teal/40 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            title="Tecla rápida: V"
          >
            <Layers className="w-3.5 h-3.5 text-venus-teal" />
            <span className="font-medium">Cambiar Capa [V]</span>
          </button>

          <button
            onClick={() => onCommandReceived('SIMULATE_EMERGENCY')}
            className="px-3 py-1.5 bg-venus-coral/20 hover:bg-venus-coral/30 text-white border border-venus-coral/60 rounded-xl transition-all flex items-center gap-1.5 shadow-glow-coral font-medium"
            title="Tecla rápida: Shift + D"
          >
            <AlertCircle className="w-3.5 h-3.5 text-venus-coral" />
            <span>Simular Incidente [⇧D]</span>
          </button>

          <button
            onClick={() => onCommandReceived('RESET_NOMINAL')}
            className="px-2.5 py-1.5 bg-venus-850 hover:bg-venus-800 text-slate-300 border border-venus-border rounded-xl transition-all flex items-center gap-1"
            title="Tecla rápida: R"
          >
            <RefreshCw className="w-3.5 h-3.5 text-venus-teal" />
            <span>Reset [R]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
