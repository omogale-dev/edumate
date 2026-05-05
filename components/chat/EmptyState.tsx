'use client';

import { motion } from 'framer-motion';
import { Atom, Calculator, BookOpen, Sparkles } from 'lucide-react';
import OrbClient, { OrbState } from '@/components/three/OrbClient';

interface EmptyStateProps {
  userName?: string;
  orbState: OrbState;
  onSuggestion: (text: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Atom,
    title: "Explain Newton's laws",
    prompt: "Explain Newton's three laws of motion with everyday Indian examples.",
  },
  {
    icon: BookOpen,
    title: 'JEE physics tips',
    prompt: 'Give me a focused 4-week strategy to master JEE Main physics.',
  },
  {
    icon: Calculator,
    title: 'Solve this equation',
    prompt: 'Solve and explain step-by-step: 3x² - 7x + 2 = 0',
  },
  {
    icon: Sparkles,
    title: 'NEET biology revision',
    prompt: 'Quiz me on NEET biology — human reproduction, 5 questions.',
  },
];

export function EmptyState({ userName, orbState, onSuggestion }: EmptyStateProps) {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <div className="absolute inset-0 spotlight-center pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] mb-6"
      >
        <OrbClient state={orbState} size="large" />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-accent/20 blur-2xl rounded-full pointer-events-none" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl sm:text-3xl font-semibold text-gradient text-center mb-1.5"
      >
        {userName ? `Hi ${userName}, what shall we learn?` : 'What shall we learn?'}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-sm text-muted text-center mb-8"
      >
        Type, speak, or pick a starting point below.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl"
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.title}
            onClick={() => onSuggestion(s.prompt)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ transitionDelay: `${0.4 + i * 0.05}s` }}
            className="group flex items-start gap-3 text-left p-3.5 rounded-xl bg-surface border border-border hover:border-accent/30 hover:bg-elevated transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
              <s.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white mb-0.5">{s.title}</p>
              <p className="text-xs text-muted line-clamp-2">{s.prompt}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
