'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, GraduationCap, Brain } from 'lucide-react';
import OrbClient from '@/components/three/OrbClient';
import { Logo } from '@/components/ui/Logo';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background noise-overlay">
      {/* Top spotlight */}
      <div className="absolute inset-0 spotlight pointer-events-none" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Nav */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo />
        <nav className="hidden sm:flex items-center gap-1">
          <a
            href="#features"
            className="px-3 py-1.5 text-sm text-muted hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#exams"
            className="px-3 py-1.5 text-sm text-muted hover:text-white transition-colors"
          >
            Exams
          </a>
          <Link
            href="/chat"
            className="px-3 py-1.5 text-sm text-muted hover:text-white transition-colors"
          >
            Chat
          </Link>
        </nav>
        <Link href="/chat" className="btn-primary text-sm">
          Open EduMate
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 sm:pt-20 pb-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-border-strong text-xs font-mono text-muted">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            India&apos;s most premium AI tutor — now in beta
          </div>
        </motion.div>

        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative mx-auto w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] mb-2"
        >
          <OrbClient state="idle" size="large" />
          {/* Soft floor reflection */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-accent/20 blur-3xl rounded-full" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-gradient mb-6 leading-[1.05]"
        >
          Your personal AI teacher.
          <br />
          <span className="text-accent-gradient">From Class 5 to PhD.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-center text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10"
        >
          Built for India&apos;s curious minds. NEET, JEE, board exams, or pure
          curiosity — EduMate explains, quizzes, and guides you with the
          patience of a great teacher.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/chat" className="btn-primary text-base px-6 py-3">
            Start Learning Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="btn-ghost text-base px-6 py-3">
            See how it works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center text-xs font-mono text-muted-strong mt-8"
        >
          No signup. No credit card. Just type your name and learn.
        </motion.p>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Brain,
              title: 'Adaptive intelligence',
              body: 'EduMate adjusts to your level — explains a concept like you are 10, then drills you like a JEE topper. All in one chat.',
            },
            {
              icon: GraduationCap,
              title: 'Built for Indian curricula',
              body: 'CBSE, ICSE, state boards, NEET, JEE Main and Advanced, GATE, UPSC essentials — covered with care.',
            },
            {
              icon: Zap,
              title: 'Voice-first learning',
              body: 'Speak your doubt. Hear the answer. Perfect for revision walks, long commutes, or hands-busy moments.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glow-border rounded-xl p-6 bg-surface noise-overlay"
            >
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                  <f.icon className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Exams */}
      <section id="exams" className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-border-strong text-[11px] font-mono text-muted mb-4">
            <Sparkles className="w-3 h-3 text-accent" />
            EXAMS WE COVER
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gradient">
            From your first quiz to your final board.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            'Class 5–10',
            'CBSE',
            'ICSE',
            'JEE Main',
            'JEE Advanced',
            'NEET',
            'Class 11–12',
            'Boards',
            'Olympiads',
            'GATE',
            'PhD prep',
            'GK & SAT',
          ].map((exam) => (
            <div
              key={exam}
              className="text-center py-3 rounded-lg bg-white/[0.02] border border-border text-xs font-mono text-muted hover:text-white hover:border-accent/30 transition-colors"
            >
              {exam}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl glow-border p-10 sm:p-14 bg-elevated text-center noise-overlay"
        >
          <div className="absolute inset-0 spotlight-center pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-semibold text-gradient mb-4">
              Ready when you are.
            </h2>
            <p className="text-muted max-w-lg mx-auto mb-8">
              Open EduMate in your browser. Ask anything. Learn faster.
            </p>
            <Link href="/chat" className="btn-primary text-base px-6 py-3">
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-strong">
        <Logo size="sm" />
        <p className="font-mono">© {new Date().getFullYear()} EduMate · Made in India</p>
      </footer>
    </div>
  );
}
