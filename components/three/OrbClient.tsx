'use client';

import dynamic from 'next/dynamic';
import type { OrbState } from './Orb';

const OrbInner = dynamic(() => import('./Orb').then((m) => m.Orb), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-accent/10 blur-2xl animate-pulse-glow" />
    </div>
  ),
});

export default function OrbClient(props: { state?: OrbState; size?: 'small' | 'medium' | 'large' }) {
  return <OrbInner {...props} />;
}

export type { OrbState };
