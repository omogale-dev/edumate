'use client';

import { motion } from 'framer-motion';
import OrbClient from '@/components/three/OrbClient';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden bg-black flex-shrink-0 mt-1">
        <OrbClient state="thinking" size="small" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-elevated border border-border">
        <div className="dot-loader">
          <span />
          <span />
          <span />
        </div>
      </div>
    </motion.div>
  );
}
