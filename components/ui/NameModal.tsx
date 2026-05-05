'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { generatePhoneId, getUser, saveUser } from '@/lib/storage';

interface NameModalProps {
  onComplete: (name: string) => void;
}

export function NameModal({ onComplete }: NameModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const existing = getUser();
    if (existing?.name) {
      onComplete(existing.name);
      return;
    }
    setOpen(true);
  }, [onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Please enter at least 2 characters.');
      return;
    }
    saveUser({ name: trimmed, phone: generatePhoneId(), xp: 0 });
    setOpen(false);
    onComplete(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-elevated border border-border-strong p-8 shadow-glow-lg noise-overlay"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs uppercase tracking-widest text-accent font-mono">
                  Welcome
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-gradient mb-2">
                What should we call you?
              </h2>
              <p className="text-sm text-muted mb-6">
                EduMate personalizes every lesson. Your name helps us greet you
                and track your progress.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-border-strong text-white placeholder:text-muted-strong focus:outline-none focus:border-accent focus:shadow-glow-sm transition-all"
                  />
                  {error && (
                    <p className="text-xs text-red-400 mt-2">{error}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full">
                  Continue
                </button>

                <p className="text-[11px] text-muted-strong text-center font-mono">
                  No password. No email. Just learning.
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
