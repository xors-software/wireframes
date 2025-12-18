"use client";

import { useEffect, useState } from "react";

interface CelebrationProps {
  type: "win" | "blackjack" | "lose" | null;
  amount?: number;
}

export function Celebration({ type, amount }: CelebrationProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);

  const isWinType = type === "blackjack" || type === "win";

  useEffect(() => {
    // Show celebration for wins and blackjacks
    if (isWinType) {
      setVisible(true);
      setPhase(1);
      
      // Phase 2: content visible
      const t1 = setTimeout(() => setPhase(2), 50);
      // Phase 3: exit
      const t2 = setTimeout(() => setPhase(3), 2000);
      // Hide
      const t3 = setTimeout(() => {
        setVisible(false);
        setPhase(0);
      }, 2300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setVisible(false);
      setPhase(0);
    }
  }, [isWinType]);

  if (!visible || !isWinType) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backgroundColor: "#ff6b00",
        opacity: phase === 3 ? 0 : 1,
        transition: "opacity 300ms ease-out",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, #1a1a1a 1px, transparent 1px),
            linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.1,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          transform: phase >= 2 ? "scale(1)" : "scale(0.8)",
          opacity: phase >= 2 ? 1 : 0,
          transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            width: "300px",
            height: "4px",
            backgroundColor: "#1a1a1a",
          }}
        />

        {/* Main text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.3em",
              color: "#1a1a1a",
              textTransform: "uppercase",
            }}
          >
            {type === "blackjack" ? "YOU GOT" : "YOU"}
          </span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "72px",
              fontWeight: 900,
              letterSpacing: "0.05em",
              color: "#1a1a1a",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {type === "blackjack" ? "BLACKJACK" : "WIN"}
          </span>
          {amount !== undefined && amount > 0 && (
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                color: "#1a1a1a",
                marginTop: "8px",
              }}
            >
              +${amount.toLocaleString()}
            </span>
          )}
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#1a1a1a",
              marginTop: amount ? "4px" : "0",
            }}
          >
            ♠ ♥ ♦ ♣
          </span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            width: "300px",
            height: "4px",
            backgroundColor: "#1a1a1a",
          }}
        />
      </div>

      {/* Corner accents */}
      <div style={{ position: "absolute", top: "40px", left: "40px" }}>
        <div style={{ width: "40px", height: "4px", backgroundColor: "#1a1a1a" }} />
        <div style={{ width: "4px", height: "40px", backgroundColor: "#1a1a1a" }} />
      </div>
      <div style={{ position: "absolute", top: "40px", right: "40px" }}>
        <div style={{ width: "40px", height: "4px", backgroundColor: "#1a1a1a", marginLeft: "auto" }} />
        <div style={{ width: "4px", height: "40px", backgroundColor: "#1a1a1a", marginLeft: "auto" }} />
      </div>
      <div style={{ position: "absolute", bottom: "40px", left: "40px" }}>
        <div style={{ width: "4px", height: "40px", backgroundColor: "#1a1a1a" }} />
        <div style={{ width: "40px", height: "4px", backgroundColor: "#1a1a1a" }} />
      </div>
      <div style={{ position: "absolute", bottom: "40px", right: "40px" }}>
        <div style={{ width: "4px", height: "40px", backgroundColor: "#1a1a1a", marginLeft: "auto" }} />
        <div style={{ width: "40px", height: "4px", backgroundColor: "#1a1a1a", marginLeft: "auto" }} />
      </div>
    </div>
  );
}
