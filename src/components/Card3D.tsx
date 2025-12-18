"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface CardData {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
}

interface CardMeshProps {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
  targetX: number;
  targetY: number;
  cardKey: string;
}

function CardMesh({ suit, rank, hidden, targetX, targetY, cardKey }: CardMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [showFront, setShowFront] = useState(!hidden);
  
  // Animation state stored in refs to persist across renders
  const animState = useRef({
    posX: targetX + 5,
    posY: targetY + 3,
    rotation: hidden ? Math.PI : 0,
    initialized: false,
  });

  // Initialize position on first render
  useEffect(() => {
    if (!animState.current.initialized) {
      animState.current.posX = targetX + 5;
      animState.current.posY = targetY + 3;
      animState.current.initialized = true;
    }
  }, [targetX, targetY]);

  const isRed = suit === "♥" || suit === "♦";
  const cardColor = isRed ? "#d64545" : "#1a1a1a";

  // Handle reveal animation
  useEffect(() => {
    if (!hidden) {
      setShowFront(true);
    }
  }, [hidden]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    const speed = 6;

    // Animate X position
    const xDiff = targetX - animState.current.posX;
    animState.current.posX += xDiff * dt * speed;

    // Animate Y position
    const yDiff = targetY - animState.current.posY;
    animState.current.posY += yDiff * dt * speed;

    // Animate rotation (flip)
    const targetRot = hidden ? Math.PI : 0;
    const rotDiff = targetRot - animState.current.rotation;
    animState.current.rotation += rotDiff * dt * 4;

    meshRef.current.position.x = animState.current.posX;
    meshRef.current.position.y = animState.current.posY;
    meshRef.current.rotation.y = animState.current.rotation;
  });

  return (
    <group ref={meshRef}>
      {/* Card body */}
      <RoundedBox args={[1.3, 1.9, 0.03]} radius={0.06} smoothness={2}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>

      {/* Front face */}
      {showFront && (
        <group position={[0, 0, 0.016]}>
          <Text
            position={[-0.42, 0.7, 0]}
            fontSize={0.26}
            color={cardColor}
            anchorX="center"
            anchorY="middle"
          >
            {rank}
          </Text>
          <Text
            position={[-0.42, 0.45, 0]}
            fontSize={0.2}
            color={cardColor}
            anchorX="center"
            anchorY="middle"
          >
            {suit}
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.55}
            color={cardColor}
            anchorX="center"
            anchorY="middle"
          >
            {suit}
          </Text>
          <group position={[0.42, -0.7, 0]} rotation={[0, 0, Math.PI]}>
            <Text fontSize={0.26} color={cardColor} anchorX="center" anchorY="middle">
              {rank}
            </Text>
          </group>
          <group position={[0.42, -0.45, 0]} rotation={[0, 0, Math.PI]}>
            <Text fontSize={0.2} color={cardColor} anchorX="center" anchorY="middle">
              {suit}
            </Text>
          </group>
        </group>
      )}

      {/* Back face */}
      <group position={[0, 0, -0.016]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[1.2, 1.8, 0.001]} radius={0.04} smoothness={2}>
          <meshStandardMaterial color="#1a1a1a" />
        </RoundedBox>
        <RoundedBox args={[1.0, 1.6, 0.002]} radius={0.03} smoothness={2} position={[0, 0, 0.001]}>
          <meshStandardMaterial color="#ff6b00" />
        </RoundedBox>
        <Text position={[0, 0, 0.003]} fontSize={0.4} color="#1a1a1a" anchorX="center" anchorY="middle">
          ∞
        </Text>
      </group>
    </group>
  );
}

// Camera that adjusts based on total cards
function CameraController({ totalCards }: { totalCards: number }) {
  const { camera } = useThree();
  
  useFrame((_, delta) => {
    const targetZ = Math.max(10, 8 + totalCards * 0.5);
    const diff = targetZ - camera.position.z;
    if (Math.abs(diff) > 0.01) {
      camera.position.z += diff * Math.min(delta, 0.05) * 3;
    }
  });

  return null;
}

// Preload scene - renders all geometry/materials off-screen to compile shaders
function PreloadScene({ onReady }: { onReady?: () => void }) {
  const { gl } = useThree();
  const hasSignaled = useRef(false);

  useEffect(() => {
    // Signal ready after first frame renders (shaders compiled)
    if (!hasSignaled.current) {
      hasSignaled.current = true;
      // Wait for next frame to ensure everything is compiled
      requestAnimationFrame(() => {
        gl.compile(new THREE.Scene(), new THREE.Camera());
        onReady?.();
      });
    }
  }, [gl, onReady]);

  // Render all materials/geometries used in cards, but far off-screen
  return (
    <group position={[0, 1000, 0]} visible={false}>
      {/* Card body material */}
      <RoundedBox args={[1.3, 1.9, 0.03]} radius={0.06} smoothness={2}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      {/* Back materials */}
      <RoundedBox args={[1.2, 1.8, 0.001]} radius={0.04} smoothness={2}>
        <meshStandardMaterial color="#1a1a1a" />
      </RoundedBox>
      <RoundedBox args={[1.0, 1.6, 0.002]} radius={0.03} smoothness={2}>
        <meshStandardMaterial color="#ff6b00" />
      </RoundedBox>
      {/* Preload text with both colors and all characters used */}
      <Text fontSize={0.26} color="#1a1a1a" anchorX="center" anchorY="middle">
        A23456789JQK
      </Text>
      <Text fontSize={0.26} color="#d64545" anchorX="center" anchorY="middle">
        ♠♥♦♣∞
      </Text>
    </group>
  );
}

// Single canvas for both hands
export function GameTableCanvas({
  dealerCards,
  playerCards,
}: {
  dealerCards: CardData[];
  playerCards: CardData[];
}) {
  const spacing = 1.5;
  const dealerY = 2.5;
  const playerY = -2.5;
  const containerRef = useRef<HTMLDivElement>(null);
  const [contextLost, setContextLost] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const dealerWidth = (dealerCards.length - 1) * spacing;
  const playerWidth = (playerCards.length - 1) * spacing;
  const totalCards = dealerCards.length + playerCards.length;

  const handlePreloadReady = useCallback(() => {
    setIsReady(true);
  }, []);

  // Handle WebGL context loss/restore
  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    console.warn("WebGL context lost, will attempt restore...");
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    console.log("WebGL context restored");
    setContextLost(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [handleContextLost, handleContextRestored]);

  // Force remount canvas if context was lost
  const [canvasKey, setCanvasKey] = useState(0);
  useEffect(() => {
    if (contextLost) {
      const timer = setTimeout(() => {
        setCanvasKey(k => k + 1);
        setContextLost(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [contextLost]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: "100%",
        maxWidth: "800px", // Cap canvas size to prevent GPU memory issues
        height: "400px", 
        position: "relative",
        margin: "0 auto",
      }}
    >
      <Canvas
        key={canvasKey}
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ background: "transparent", opacity: isReady ? 1 : 0, transition: "opacity 0.2s" }}
        dpr={1} // Fixed DPR of 1 to reduce GPU memory usage
        gl={{ 
          antialias: false, // Disable antialiasing for better performance
          alpha: true,
          powerPreference: "low-power", // Prefer integrated GPU
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
        }}
        frameloop="always"
      >
        {/* Preload all shaders/textures on mount */}
        <PreloadScene onReady={handlePreloadReady} />
        
        <CameraController totalCards={totalCards} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        
        {/* Dealer cards */}
        {dealerCards.map((card, i) => (
          <CardMesh
            key={`dealer-${i}-${card.rank}-${card.suit}`}
            cardKey={`dealer-${i}`}
            suit={card.suit}
            rank={card.rank}
            hidden={card.hidden}
            targetX={i * spacing - dealerWidth / 2}
            targetY={dealerY}
          />
        ))}

        {/* Player cards */}
        {playerCards.map((card, i) => (
          <CardMesh
            key={`player-${i}-${card.rank}-${card.suit}`}
            cardKey={`player-${i}`}
            suit={card.suit}
            rank={card.rank}
            hidden={card.hidden}
            targetX={i * spacing - playerWidth / 2}
            targetY={playerY}
          />
        ))}
      </Canvas>
      {contextLost && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(250, 247, 242, 0.9)",
          color: "#1a1a1a",
          fontSize: "14px",
        }}>
          Restoring graphics...
        </div>
      )}
    </div>
  );
}

// Keep old export for compatibility but mark deprecated
export function Card3DCanvas({
  cards,
}: {
  cards: CardData[];
}) {
  const spacing = 1.5;
  const totalWidth = (cards.length - 1) * spacing;

  return (
    <div style={{ width: "100%", maxWidth: "600px", height: "220px", margin: "0 auto" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={1}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: false,
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        
        {cards.map((card, i) => (
          <CardMesh
            key={`${i}-${card.rank}-${card.suit}`}
            cardKey={`card-${i}`}
            suit={card.suit}
            rank={card.rank}
            hidden={card.hidden}
            targetX={i * spacing - totalWidth / 2}
            targetY={0}
          />
        ))}
      </Canvas>
    </div>
  );
}
