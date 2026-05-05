'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Mode } from '@/lib/types';

interface ChatHeaderProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  xp: number;
}

export function ChatHeader({ mode, onModeChange, xp }: ChatHeaderProps) {
  return (
    <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-background/80 backdrop-blur-md">
      <Link
        href="/"
        className="hidden sm:flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors font-mono"
      >
        <ArrowLeft className="w-3 h-3" />
        Home
      </Link>

      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-surface border border-border">
        <ModeButton
          active={mode === 'study'}
          onClick={() => onModeChange('study')}
          icon={<BookOpen className="w-3.5 h-3.5" />}
          label="Study Mode"
        />
        <ModeButton
          active={mode === 'exam'}
          onClick={() => onModeChange('exam')}
          icon={<GraduationCap className="w-3.5 h-3.5" />}
          label="Exam Mode"
        />
      </div>

      {/* XP badge */}
      <motion.div
        key={xp}
        initial={{ scale: 0.95, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent"
      >
        <Zap className="w-3 h-3 fill-current" />
        <span className="text-xs font-mono font-semibold">{xp} XP</span>
      </motion.div>
    </header>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active ? 'text-black' : 'text-muted hover:text-white'
      }`}
    >
      {active && (
        <motion.div
          layoutId="mode-toggle-bg"
          className="absolute inset-0 bg-accent rounded-md"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </span>
    </button>
  );
}
