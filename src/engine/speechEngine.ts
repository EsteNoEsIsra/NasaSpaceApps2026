// ==============================================================================
// V.E.N.U.S. Hands-Free Voice Control & Audio Feedback Engine
// Web Speech API + SpeechSynthesis for hands-free microgravity operation
// ==============================================================================

export type SpeechCommandIntent = 
  | 'LOG_PILL'
  | 'DAILY_REPORT'
  | 'LAYER_VASCULAR'
  | 'LAYER_OCULAR'
  | 'LAYER_ENDOCRINE'
  | 'LAYER_ALL'
  | 'START_LBNP'
  | 'START_ULTRASOUND'
  | 'SIMULATE_EMERGENCY'
  | 'RESET_NOMINAL'
  | 'UNKNOWN';

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (error: unknown) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

/**
 * Text to speech synthesizer with a cool, calm tactical mission-voice tone
 */
export function speakTacticalMessage(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    utterance.lang = 'es-ES'; // Spanish by default as requested in prompt

    // Pick a good Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es') || v.name.includes('Spanish'));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
  }
}

/**
 * Parse spoken phrase deterministically using closed-grammar matching
 */
export function parseSpokenIntent(text: string): SpeechCommandIntent {
  const clean = text.toLowerCase().trim();

  if (clean.includes('pastilla') || clean.includes('dosis') || clean.includes('medicación') || clean.includes('anticonceptivo')) {
    return 'LOG_PILL';
  }
  if (clean.includes('reporte') || clean.includes('estado') || clean.includes('informe') || clean.includes('resumen')) {
    return 'DAILY_REPORT';
  }
  if (clean.includes('vascular') || clean.includes('venas') || clean.includes('sangre')) {
    return 'LAYER_VASCULAR';
  }
  if (clean.includes('ocular') || clean.includes('ojo') || clean.includes('visión') || clean.includes('sans')) {
    return 'LAYER_OCULAR';
  }
  if (clean.includes('endocrino') || clean.includes('hormonas') || clean.includes('ovario')) {
    return 'LAYER_ENDOCRINE';
  }
  if (clean.includes('todo') || clean.includes('completo') || clean.includes('general')) {
    return 'LAYER_ALL';
  }
  if (clean.includes('ultrasonido') || clean.includes('eco') || clean.includes('sonda')) {
    return 'START_ULTRASOUND';
  }
  if (clean.includes('lbnp') || clean.includes('presión negativa') || clean.includes('vacío')) {
    return 'START_LBNP';
  }
  if (clean.includes('emergencia') || clean.includes('incidente') || clean.includes('alerta roja')) {
    return 'SIMULATE_EMERGENCY';
  }
  if (clean.includes('reset') || clean.includes('reiniciar') || clean.includes('nominal')) {
    return 'RESET_NOMINAL';
  }

  return 'UNKNOWN';
}
