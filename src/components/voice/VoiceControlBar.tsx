// ==============================================================================
// V.E.N.U.S. Audio Interface & Tactical Keyboard Controls
// Industrial Teenage Engineering / Braun aesthetic: tactile, precise, zero-slop
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RefreshCw, AlertTriangle, Layers, Pill } from 'lucide-react';
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
      speakTacticalMessage('Control por voz no disponible en este navegador. Utilizando teclado táctico.');
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
    <div className="w-full bg-canvas-card border border-border-hairline rounded-xl p-3 shadow-fine">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Voice Microphone & Level Meter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={toggleListening}
            className={`px-3 py-1.5 rounded border transition-all duration-150 flex items-center gap-2 font-mono text-xs ${
              isListening
                ? 'bg-clinical-coral/20 text-clinical-coral border-clinical-coral'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-ink border-border-hairline'
            }`}
            title="Toggle hands-free voice engine"
          >
            {isListening ? <Mic className="w-3.5 h-3.5 animate-pulse" /> : <MicOff className="w-3.5 h-3.5 text-ink-muted" />}
            <span className="font-medium">
              {isListening ? 'LISTENING' : 'VOICE COMMAND'}
            </span>
          </button>

          {/* LED Style Level Meter */}
          <div className="flex items-center gap-1 h-4 px-2 bg-canvas rounded border border-border-hairline">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className={`w-1 rounded-sm transition-all duration-150 ${
                  isListening ? 'bg-clinical-sage' : 'bg-white/[0.12] h-2'
                }`}
                style={{
                  height: isListening ? `${Math.floor(Math.random() * 12 + 4)}px` : '4px',
                }}
              />
            ))}
          </div>

          {/* Audio Transcript / Feedback */}
          <div className="text-xs font-mono text-ink-muted truncate max-w-sm">
            {transcript ? (
              <span className="text-ink">"{transcript}"</span>
            ) : lastSpokenText ? (
              <span className="text-ink-muted italic">V.E.N.U.S: {lastSpokenText}</span>
            ) : (
              <span className="text-ink-subtle">"VENUS, registrar pastilla" · "reporte"</span>
            )}
          </div>
        </div>

        {/* Tactile Keycap Buttons for Pitch Demo */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[11px] text-ink-subtle mr-1 hidden sm:inline">PITCH KEYS:</span>

          <button
            onClick={() => onCommandReceived('LOG_PILL')}
            className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-ink border border-border-hairline rounded transition-all flex items-center gap-1.5"
            title="Shortcut: P or Space"
          >
            <span className="px-1 py-0.2 bg-canvas text-ink-muted rounded text-[10px] border border-border-hairline">P</span>
            <Pill className="w-3.5 h-3.5 text-clinical-titanium" />
            <span>RECORD PILL</span>
          </button>

          <button
            onClick={() => onCommandReceived('LAYER_VASCULAR')}
            className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-ink border border-border-hairline rounded transition-all flex items-center gap-1.5"
            title="Shortcut: V"
          >
            <span className="px-1 py-0.2 bg-canvas text-ink-muted rounded text-[10px] border border-border-hairline">V</span>
            <Layers className="w-3.5 h-3.5 text-clinical-sage" />
            <span>CYCLE LAYER</span>
          </button>

          <button
            onClick={() => onCommandReceived('SIMULATE_EMERGENCY')}
            className="px-2.5 py-1 bg-clinical-coral/10 hover:bg-clinical-coral/20 text-clinical-coral border border-clinical-coral/30 rounded transition-all flex items-center gap-1.5"
            title="Shortcut: Shift + D"
          >
            <span className="px-1 py-0.2 bg-canvas text-clinical-coral rounded text-[10px] border border-clinical-coral/30">⇧D</span>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SIMULATE STASIS</span>
          </button>

          <button
            onClick={() => onCommandReceived('RESET_NOMINAL')}
            className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-ink-muted hover:text-ink border border-border-hairline rounded transition-all flex items-center gap-1.5"
            title="Shortcut: R"
          >
            <span className="px-1 py-0.2 bg-canvas text-ink-muted rounded text-[10px] border border-border-hairline">R</span>
            <RefreshCw className="w-3 h-3 text-ink-muted" />
            <span>RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
};
