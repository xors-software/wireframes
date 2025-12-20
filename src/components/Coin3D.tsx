'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoinProps {
  isFlipping: boolean;
  result: 'heads' | 'tails' | null;
  onFlipComplete: () => void;
}

function Coin({ isFlipping, result, onFlipComplete }: CoinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const flipProgress = useRef(0);
  const hasCalledComplete = useRef(false);
  const startRotation = useRef(0);

  useEffect(() => {
    if (isFlipping && result) {
      flipProgress.current = 0;
      hasCalledComplete.current = false;
      
      // Get current rotation and normalize to 0-2π range
      const currentRotation = groupRef.current?.rotation.x || 0;
      startRotation.current = currentRotation;
      
      // Target face: heads = π, tails = 0
      const targetFace = result === 'heads' ? Math.PI : 0;
      
      // Calculate current face position (normalized)
      const normalizedCurrent = ((currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      
      // Random number of full rotations (3-5)
      const fullRotations = (3 + Math.floor(Math.random() * 3)) * Math.PI * 2;
      
      // Calculate how much extra we need to reach the target face
      let extraRotation = targetFace - normalizedCurrent;
      if (extraRotation < 0) extraRotation += Math.PI * 2;
      
      setTargetRotation(currentRotation + fullRotations + extraRotation);
    }
  }, [isFlipping, result]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isFlipping && flipProgress.current < 1) {
      flipProgress.current += delta * 0.7;
      if (flipProgress.current > 1) flipProgress.current = 1;

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - flipProgress.current, 3);
      groupRef.current.rotation.x = startRotation.current + (targetRotation - startRotation.current) * eased;

      // Arc/bounce effect
      const arc = Math.sin(flipProgress.current * Math.PI) * 1.5;
      groupRef.current.position.y = arc;

      if (flipProgress.current >= 1 && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onFlipComplete();
      }
    } else if (!isFlipping) {
      // Subtle idle animation
      const time = Date.now() * 0.001;
      groupRef.current.rotation.z = Math.sin(time) * 0.02;
      groupRef.current.rotation.y = Math.sin(time * 0.7) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Coin disc - rotated so flat face points toward camera (Z axis) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.12, 64]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* TAILS side (front face at rotation 0) */}
      <group position={[0, 0, 0.07]}>
        {/* T - Horizontal top */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.6, 0.12, 0.01]} />
          <meshStandardMaterial color="#ff6b00" />
        </mesh>
        {/* T - Vertical stem */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.12, 0.6, 0.01]} />
          <meshStandardMaterial color="#ff6b00" />
        </mesh>
      </group>
      
      {/* HEADS side (back face, visible when rotated PI) */}
      <group position={[0, 0, -0.07]} rotation={[0, Math.PI, 0]}>
        {/* H - Left vertical */}
        <mesh position={[-0.35, 0, 0]}>
          <boxGeometry args={[0.12, 0.7, 0.01]} />
          <meshStandardMaterial color="#ff6b00" />
        </mesh>
        {/* H - Right vertical */}
        <mesh position={[0.35, 0, 0]}>
          <boxGeometry args={[0.12, 0.7, 0.01]} />
          <meshStandardMaterial color="#ff6b00" />
        </mesh>
        {/* H - Horizontal crossbar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.58, 0.12, 0.01]} />
          <meshStandardMaterial color="#ff6b00" />
        </mesh>
      </group>
    </group>
  );
}

interface Coin3DCanvasProps {
  isFlipping: boolean;
  result: 'heads' | 'tails' | null;
  onFlipComplete: () => void;
}

export function Coin3DCanvas({ isFlipping, result, onFlipComplete }: Coin3DCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 5]} intensity={1} />
      <directionalLight position={[-3, -3, 5]} intensity={0.3} />
      <Coin isFlipping={isFlipping} result={result} onFlipComplete={onFlipComplete} />
    </Canvas>
  );
}
