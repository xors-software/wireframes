"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.scss";

interface Sphere {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  color: string;
  className: string;
  ability: string;
  damage: number;
  lastAttack: number;
}

export default function SphereBrawl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Initialize spheres
  const [reaper, setReaper] = useState<Sphere>({
    x: 150,
    y: 200,
    vx: 2,
    vy: 1.5,
    radius: 25,
    hp: 100,
    maxHp: 100,
    color: "#2C1810",
    className: "Reaper",
    ability: "Lifesteal",
    damage: 15,
    lastAttack: 0,
  });

  const [blacksmith, setBlacksmith] = useState<Sphere>({
    x: 450,
    y: 200,
    vx: -1.8,
    vy: -2,
    radius: 25,
    hp: 120,
    maxHp: 120,
    color: "#D2691E",
    className: "Blacksmith",
    ability: "High Damage",
    damage: 20,
    lastAttack: 0,
  });

  const ARENA_WIDTH = 600;
  const ARENA_HEIGHT = 400;
  const BORDER_WIDTH = 20;

  // Collision detection
  const checkCollision = (sphere1: Sphere, sphere2: Sphere) => {
    const dx = sphere1.x - sphere2.x;
    const dy = sphere1.y - sphere2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < sphere1.radius + sphere2.radius;
  };

  // Handle sphere collision and combat
  const handleCombat = useCallback((sphere1: Sphere, sphere2: Sphere, timestamp: number) => {
    if (timestamp - sphere1.lastAttack > 1000) { // Attack cooldown
      sphere2.hp = Math.max(0, sphere2.hp - sphere1.damage);
      sphere1.lastAttack = timestamp;
      
      // Reaper lifesteal
      if (sphere1.className === "Reaper") {
        sphere1.hp = Math.min(sphere1.maxHp, sphere1.hp + Math.floor(sphere1.damage * 0.3));
      }
    }
  }, []);

  // Physics update
  const updatePhysics = useCallback((timestamp: number) => {
    setReaper(prevReaper => {
      setBlacksmith(prevBlacksmith => {
        let newReaper = { ...prevReaper };
        let newBlacksmith = { ...prevBlacksmith };

        // Update positions
        newReaper.x += newReaper.vx;
        newReaper.y += newReaper.vy;
        newBlacksmith.x += newBlacksmith.vx;
        newBlacksmith.y += newBlacksmith.vy;

        // Bounce off walls
        if (newReaper.x - newReaper.radius <= BORDER_WIDTH || newReaper.x + newReaper.radius >= ARENA_WIDTH - BORDER_WIDTH) {
          newReaper.vx *= -1;
        }
        if (newReaper.y - newReaper.radius <= BORDER_WIDTH || newReaper.y + newReaper.radius >= ARENA_HEIGHT - BORDER_WIDTH) {
          newReaper.vy *= -1;
        }

        if (newBlacksmith.x - newBlacksmith.radius <= BORDER_WIDTH || newBlacksmith.x + newBlacksmith.radius >= ARENA_WIDTH - BORDER_WIDTH) {
          newBlacksmith.vx *= -1;
        }
        if (newBlacksmith.y - newBlacksmith.radius <= BORDER_WIDTH || newBlacksmith.y + newBlacksmith.radius >= ARENA_HEIGHT - BORDER_WIDTH) {
          newBlacksmith.vy *= -1;
        }

        // Keep spheres within bounds
        newReaper.x = Math.max(BORDER_WIDTH + newReaper.radius, Math.min(ARENA_WIDTH - BORDER_WIDTH - newReaper.radius, newReaper.x));
        newReaper.y = Math.max(BORDER_WIDTH + newReaper.radius, Math.min(ARENA_HEIGHT - BORDER_WIDTH - newReaper.radius, newReaper.y));
        newBlacksmith.x = Math.max(BORDER_WIDTH + newBlacksmith.radius, Math.min(ARENA_WIDTH - BORDER_WIDTH - newBlacksmith.radius, newBlacksmith.x));
        newBlacksmith.y = Math.max(BORDER_WIDTH + newBlacksmith.radius, Math.min(ARENA_HEIGHT - BORDER_WIDTH - newBlacksmith.radius, newBlacksmith.y));

        // Check collision and handle combat
        if (checkCollision(newReaper, newBlacksmith)) {
          handleCombat(newReaper, newBlacksmith, timestamp);
          handleCombat(newBlacksmith, newReaper, timestamp);

          // Separate spheres to prevent sticking
          const dx = newReaper.x - newBlacksmith.x;
          const dy = newReaper.y - newBlacksmith.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const overlap = newReaper.radius + newBlacksmith.radius - distance;
          
          if (overlap > 0) {
            const separationX = (dx / distance) * (overlap / 2);
            const separationY = (dy / distance) * (overlap / 2);
            
            newReaper.x += separationX;
            newReaper.y += separationY;
            newBlacksmith.x -= separationX;
            newBlacksmith.y -= separationY;
          }

          // Bounce off each other
          const tempVx = newReaper.vx;
          const tempVy = newReaper.vy;
          newReaper.vx = newBlacksmith.vx * 0.8;
          newReaper.vy = newBlacksmith.vy * 0.8;
          newBlacksmith.vx = tempVx * 0.8;
          newBlacksmith.vy = tempVy * 0.8;
        }

        // Check for winner
        if (newReaper.hp <= 0 && !winner) {
          setWinner("Blacksmith");
        } else if (newBlacksmith.hp <= 0 && !winner) {
          setWinner("Reaper");
        }

        return newBlacksmith;
      });
      return newReaper;
    });
  }, [handleCombat, winner]);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw stone border
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    
    // Draw inner arena
    ctx.fillStyle = "#F5DEB3";
    ctx.fillRect(BORDER_WIDTH, BORDER_WIDTH, ARENA_WIDTH - BORDER_WIDTH * 2, ARENA_HEIGHT - BORDER_WIDTH * 2);

    // Draw border pattern
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    for (let i = 0; i < ARENA_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, BORDER_WIDTH);
      ctx.moveTo(i, ARENA_HEIGHT - BORDER_WIDTH);
      ctx.lineTo(i, ARENA_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < ARENA_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(BORDER_WIDTH, i);
      ctx.moveTo(ARENA_WIDTH - BORDER_WIDTH, i);
      ctx.lineTo(ARENA_WIDTH, i);
      ctx.stroke();
    }

    // Draw Reaper sphere
    ctx.beginPath();
    ctx.arc(reaper.x, reaper.y, reaper.radius, 0, Math.PI * 2);
    ctx.fillStyle = reaper.color;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Reaper HP
    ctx.fillStyle = "#FF0000";
    ctx.font = "12px serif";
    ctx.textAlign = "center";
    ctx.fillText(`${reaper.hp}`, reaper.x, reaper.y + 4);

    // Draw Reaper scythe symbol
    ctx.fillStyle = "#666";
    ctx.font = "16px serif";
    ctx.fillText("⚔", reaper.x, reaper.y - 15);

    // Draw Blacksmith sphere
    ctx.beginPath();
    ctx.arc(blacksmith.x, blacksmith.y, blacksmith.radius, 0, Math.PI * 2);
    ctx.fillStyle = blacksmith.color;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Blacksmith HP
    ctx.fillStyle = "#FF0000";
    ctx.font = "12px serif";
    ctx.textAlign = "center";
    ctx.fillText(`${blacksmith.hp}`, blacksmith.x, blacksmith.y + 4);

    // Draw Blacksmith hammer symbol
    ctx.fillStyle = "#8B4513";
    ctx.font = "16px serif";
    ctx.fillText("🔨", blacksmith.x, blacksmith.y - 15);
  }, [reaper, blacksmith]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (gameStarted && !winner) {
      updatePhysics(timestamp);
    }
    render();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, winner, updatePhysics, render]);

  // Start game loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  const startGame = () => {
    setGameStarted(true);
    setWinner(null);
    setReaper(prev => ({ ...prev, hp: prev.maxHp, lastAttack: 0 }));
    setBlacksmith(prev => ({ ...prev, hp: prev.maxHp, lastAttack: 0 }));
  };

  const resetGame = () => {
    setGameStarted(false);
    setWinner(null);
    setReaper(prev => ({
      ...prev,
      x: 150,
      y: 200,
      vx: 2,
      vy: 1.5,
      hp: prev.maxHp,
      lastAttack: 0,
    }));
    setBlacksmith(prev => ({
      ...prev,
      x: 450,
      y: 200,
      vx: -1.8,
      vy: -2,
      hp: prev.maxHp,
      lastAttack: 0,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>REAPER VS BLACKSMITH</h1>
          <p className={styles.subtitle}>Medieval Sphere Arena</p>
        </header>

        {/* Arena */}
        <div className={styles.arena}>
          <canvas
            ref={canvasRef}
            width={ARENA_WIDTH}
            height={ARENA_HEIGHT}
            className={styles.canvas}
          />
          
          {winner && (
            <div className={styles.winnerOverlay}>
              <div className={styles.winnerText}>{winner} Wins!</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.className}>{reaper.className}</span>
              <span className={styles.hp}>{reaper.hp}/{reaper.maxHp} HP</span>
            </div>
            <div className={styles.statDetails}>
              <div className={styles.ability}>Special: {reaper.ability}</div>
              <div className={styles.damage}>Damage: {reaper.damage}</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.className}>{blacksmith.className}</span>
              <span className={styles.hp}>{blacksmith.hp}/{blacksmith.maxHp} HP</span>
            </div>
            <div className={styles.statDetails}>
              <div className={styles.ability}>Special: {blacksmith.ability}</div>
              <div className={styles.damage}>Damage: {blacksmith.damage}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {!gameStarted ? (
            <button className={styles.btnStart} onClick={startGame}>
              START BATTLE
            </button>
          ) : winner ? (
            <button className={styles.btnReset} onClick={resetGame}>
              RESET ARENA
            </button>
          ) : (
            <div className={styles.battleStatus}>Battle in Progress...</div>
          )}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <span className={styles.footerText}>WIREFRAMES</span>
        </footer>
      </div>
    </div>
  );
}