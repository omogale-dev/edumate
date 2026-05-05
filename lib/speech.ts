'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ---------- Type augmentation for browser SpeechRecognition ----------
type SpeechRecognitionResult = {
  isFinal: boolean;
  0: { transcript: string };
};
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResult>;
};
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => ISpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

// ---------- useSpeechRecognition ----------
export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);
    const rec = new Ctor();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      setTranscript((final || interim).trim());
    };
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    recognitionRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {
        // noop
      }
    };
  }, []);

  const start = useCallback(() => {
    setTranscript('');
    try {
      recognitionRef.current?.start();
    } catch {
      // ignore "already started" errors
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // noop
    }
  }, []);

  const reset = useCallback(() => setTranscript(''), []);

  return { transcript, isListening, isSupported, start, stop, reset };
}

// ---------- useSpeechSynthesis ----------
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-IN';
      utter.rate = 1;
      utter.pitch = 1;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      synth.speak(utter);
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, cancel, isSpeaking, isSupported };
}
