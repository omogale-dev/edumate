'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface OrbProps {
  state?: OrbState;
  size?: 'small' | 'medium' | 'large';
}

function OrbMesh({ state }: { state: OrbState }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  // MeshDistortMaterial extends a custom shader material from drei; we type it loosely
  // because the exported `DistortMaterialImpl` type is internal.
  const matRef = useRef<THREE.Material & { distort?: number; speed?: number }>(null);

  // animation parameters per state
  const params = useMemo(() => {
    switch (state) {
      case 'listening':
        return { distort: 0.55, speed: 4.5, scale: 1.15, pulseAmp: 0.08, pulseFreq: 6 };
      case 'thinking':
        return { distort: 0.7, speed: 5.5, scale: 1.05, pulseAmp: 0.05, pulseFreq: 3.5 };
      case 'speaking':
        return { distort: 0.6, speed: 5, scale: 1.12, pulseAmp: 0.1, pulseFreq: 8 };
      default:
        return { distort: 0.35, speed: 1.6, scale: 1, pulseAmp: 0.03, pulseFreq: 1.2 };
    }
  }, [state]);

  useFrame((stateThree) => {
    const t = stateThree.clock.getElapsedTime();
    if (meshRef.current) {
      const breath = 1 + Math.sin(t * params.pulseFreq) * params.pulseAmp;
      const target = params.scale * breath;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
    if (innerRef.current) {
      const innerScale = 0.55 + Math.sin(t * params.pulseFreq * 1.3) * 0.04;
      innerRef.current.scale.set(innerScale, innerScale, innerScale);
      innerRef.current.rotation.y = -t * 0.25;
    }
    if (matRef.current) {
      // animate distort/speed toward target for smooth state transitions
      const m = matRef.current as unknown as { distort: number; speed: number };
      m.distort = THREE.MathUtils.lerp(m.distort ?? 0.3, params.distort, 0.05);
      m.speed = THREE.MathUtils.lerp(m.speed ?? 1, params.speed, 0.05);
    }
  });

  return (
    <group>
      {/* Outer glowing distorted sphere */}
      <Sphere ref={meshRef} args={[1, 96, 96]}>
        <MeshDistortMaterial
          ref={matRef as React.Ref<never>}
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={1.2}
          roughness={0.15}
          metalness={0.4}
          distort={0.35}
          speed={1.6}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Inner bright core */}
      <Sphere ref={innerRef} args={[0.55, 48, 48]}>
        <meshBasicMaterial color="#7CE8FF" transparent opacity={0.6} />
      </Sphere>

      {/* Soft outer halo */}
      <Sphere args={[1.35, 32, 32]}>
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.05} />
      </Sphere>
    </group>
  );
}

export function Orb({ state = 'idle', size = 'large' }: OrbProps) {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
  const dimensions = {
    small: 'w-10 h-10',
    medium: 'w-32 h-32',
    large: 'w-full h-full',
  }[size];

  return (
    <div className={`${dimensions} relative`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={dpr}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#00D4FF" />
        <pointLight position={[-3, -3, 2]} intensity={0.8} color="#0EA5E9" />
        <pointLight position={[0, 0, 4]} intensity={2} color="#7CE8FF" />

        <OrbMesh state={state} />

        {size !== 'small' && (
          <EffectComposer>
            <Bloom
              intensity={1.4}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
