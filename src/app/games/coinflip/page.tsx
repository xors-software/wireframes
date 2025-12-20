"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useTokens } from "@/hooks/useTokens";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { API_BASE, STARTING_BALANCE } from "@/lib/constants";

// Dynamic import for Three.js component
const Coin3DCanvas = dynamic(
  () => import("@/components/Coin3D").then((mod) => mod.Coin3DCanvas),
  { ssr: false }
);

export default function CoinflipGame() {
  const tokens = useTokens(STARTING_BALANCE);
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayResult, setDisplayResult] = useState<'heads' | 'tails' | null>(null);
  const [animationResult, setAnimationResult] = useState<'heads' | 'tails' | null>(null);
  const isFlippingRef = useRef(false);

  const flip = useCallback(async () => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;

    let flipResult: 'heads' | 'tails';

    // Get the result FIRST, before starting animation
    if (tokens.isConnected && tokens.apiKey) {
      try {
        const response = await fetch(`${API_BASE}/api/games/coinflip`, {
          method: 'POST',
          headers: {
            'x-api-key': tokens.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bet: 0, guess: 'heads' }),
        });

        const data = await response.json();
        if (data.success) {
          flipResult = data.data.result;
        } else {
          flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
        }
      } catch {
        flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
      }
    } else {
      flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
    }

    // NOW start the animation with the known result
    setAnimationResult(flipResult);
    setIsFlipping(true);
  }, [tokens]);

  const handleFlipComplete = useCallback(() => {
    setDisplayResult(animationResult);
    setIsFlipping(false);
    isFlippingRef.current = false;
  }, [animationResult]);

  const handleClick = () => {
    if (!isFlippingRef.current) {
      flip();
    }
  };

  return (
    <div className="container">
      {/* Mode Toggle */}
      <div className="mode-toggle">
        <ApiKeyInput
          apiKey={tokens.apiKey}
          isConnected={tokens.isConnected}
          isLoading={tokens.isLoading}
          error={tokens.error}
          onSetApiKey={tokens.setApiKey}
          onClearApiKey={tokens.clearApiKey}
        />
      </div>

      {/* 3D Coin */}
      <div className="coin-container" onClick={handleClick}>
        <Coin3DCanvas
          isFlipping={isFlipping}
          result={animationResult}
          onFlipComplete={handleFlipComplete}
        />
      </div>

      {/* Result Label */}
      <div className="result-label">
        {isFlipping ? 'FLIPPING...' : displayResult ? displayResult.toUpperCase() : 'CLICK TO FLIP'}
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #faf7f2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: "SF Mono", "Monaco", "Inconsolata", monospace;
        }

        .mode-toggle {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 100;
        }

        .coin-container {
          width: 100%;
          height: 60vh;
          max-width: 600px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-label {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: #1a1a1a;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
