'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import OrbClient, { OrbState } from '@/components/three/OrbClient';
import { useSpeechRecognition } from '@/lib/speech';

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  showOrb?: boolean;
  orbState?: OrbState;
  onStop?: () => void;
}

export function InputBar({
  onSend,
  disabled = false,
  isStreaming = false,
  showOrb = false,
  orbState = 'idle',
  onStop,
}: InputBarProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { transcript, isListening, isSupported, start, stop, reset } = useSpeechRecognition();

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, [value]);

  // Sync transcript into the input as the user speaks
  useEffect(() => {
    if (transcript) setValue(transcript);
  }, [transcript]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    reset();
    if (isListening) stop();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleMic = () => {
    if (!isSupported) return;
    if (isListening) stop();
    else start();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 sm:pb-6">
      <motion.div
        layout
        className="relative rounded-2xl bg-elevated border border-border-strong overflow-hidden focus-within:border-accent/50 focus-within:shadow-glow-sm transition-all noise-overlay"
      >
        <div className="relative z-10 flex items-end gap-2 p-2 pl-3">
          {showOrb && (
            <div className="flex-shrink-0 w-8 h-8 mb-1">
              <OrbClient state={orbState} size="small" />
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening ? 'Listening…' : 'Ask EduMate anything…'
            }
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-[15px] text-white placeholder:text-muted-strong px-2 py-2.5 outline-none max-h-[200px] disabled:opacity-50"
          />

          <div className="flex items-center gap-1 flex-shrink-0">
            {isSupported && (
              <button
                onClick={toggleMic}
                disabled={disabled}
                aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-accent text-black shadow-glow-sm'
                    : 'text-muted hover:text-white hover:bg-white/5'
                } disabled:opacity-50`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}

            {isStreaming ? (
              <button
                onClick={onStop}
                aria-label="Stop"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <Square className="w-3.5 h-3.5" fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={disabled || !value.trim()}
                aria-label="Send"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent text-black hover:shadow-glow-sm disabled:bg-white/10 disabled:text-muted-strong disabled:shadow-none transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <p className="text-center text-[11px] font-mono text-muted-strong mt-2.5">
        EduMate can make mistakes. Always verify important answers.
      </p>
    </div>
  );
}
