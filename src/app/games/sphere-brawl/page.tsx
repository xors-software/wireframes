"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.scss";

interface Sphere {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  radius: number;
  color: string;
  name: string;
  class: string;
  ability: string;
  damage: number;
  lastAttack: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const BORDER_WIDTH = 20;
const ATTACK_COOLDOWN = 1000; // ms

export default function SphereBrawl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [gameState, setGameState] = useState<"menu" | "playing" | "finished">("menu");
  const [winner, setWinner] = useState<string>("");
  
  const [reaper, setReaper] = useState<Sphere>({
    x: 200,
    y: 250,
    vx: 2,
    vy: 1.5,
    hp: 100,
    maxHp: 100,
    radius: 30,
    color: "#2d1b2e",
    name: "Reaper",
    class: "Dark Warrior",
    ability: "Lifesteal",
    damage: 25,
    lastAttack: 0,
  });

  const [blacksmith, setBlacksmith] = useState<Sphere>({
    x: 600,
    y: 250,
    vx: -1.8,
    vy: -2,
    hp: 120,
    maxHp: 120,
    radius: 32,
    color: "#d4621a",
    name: "Blacksmith",
    class: "Forge Master",
    ability: "Heavy Strike",
    damage: 35,
    lastAttack: 0,
  });

  const checkCollision = (sphere1: Sphere, sphere2: Sphere): boolean => {
    const dx = sphere1.x - sphere2.x;
    const dy = sphere1.y - sphere2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (sphere1.radius + sphere2.radius);
  };

  const updateSphere = (sphere: Sphere): Sphere => {
    let newX = sphere.x + sphere.vx;
    let newY = sphere.y + sphere.vy;
    let newVx = sphere.vx;
    let newVy = sphere.vy;

    // Bounce off walls
    if (newX - sphere.radius <= BORDER_WIDTH || newX + sphere.radius >= CANVAS_WIDTH - BORDER_WIDTH) {
      newVx = -newVx;
      newX = Math.max(BORDER_WIDTH + sphere.radius, Math.min(CANVAS_WIDTH - BORDER_WIDTH - sphere.radius, newX));
    }
    
    if (newY - sphere.radius <= BORDER_WIDTH || newY + sphere.radius >= CANVAS_HEIGHT - BORDER_WIDTH) {
      newVy = -newVy;
      newY = Math.max(BORDER_WIDTH + sphere.radius, Math.min(CANVAS_HEIGHT - BORDER_WIDTH - sphere.radius, newY));
    }

    return { ...sphere, x: newX, y: newY, vx: newVx, vy: newVy };
  };

  const handleCombat = (attacker: Sphere, defender: Sphere, now: number): { attacker: Sphere; defender: Sphere } => {
    if (now - attacker.lastAttack < ATTACK_COOLDOWN) {
      return { attacker, defender };
    }

    let newDefenderHp = Math.max(0, defender.hp - attacker.damage);
    let newAttackerHp = attacker.hp;

    // Reaper lifesteal ability
    if (attacker.name === "Reaper") {
      const lifesteal = Math.floor(attacker.damage * 0.3);
      newAttackerHp = Math.min(attacker.maxHp, attacker.hp + lifesteal);
    }

    return {
      attacker: { ...attacker, hp: newAttackerHp, lastAttack: now },
      defender: { ...defender, hp: newDefenderHp }
    };
  };

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    const now = Date.now();
    
    setReaper(prevReaper => {
      setBlacksmith(prevBlacksmith => {
        let newReaper = updateSphere(prevReaper);
        let newBlacksmith = updateSphere(prevBlacksmith);

        // Check collision and handle combat
        if (checkCollision(newReaper, newBlacksmith)) {
          // Both attack each other
          const reaperAttack = handleCombat(newReaper, newBlacksmith, now);
          const blacksmithAttack = handleCombat(newBlacksmith, reaperAttack.attacker, now);
          
          newReaper = blacksmithAttack.defender;
          newBlacksmith = reaperAttack.defender;

          // Separate spheres to prevent overlap
          const dx = newReaper.x - newBlacksmith.x;
          const dy = newReaper.y - newBlacksmith.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const overlap = (newReaper.radius + newBlacksmith.radius) - distance;
          
          if (overlap > 0) {
            const separationX = (dx / distance) * (overlap / 2);
            const separationY = (dy / distance) * (overlap / 2);
            
            newReaper.x += separationX;
            newReaper.y += separationY;
            newBlacksmith.x -= separationX;
            newBlacksmith.y -= separationY;
          }

          // Bounce off each other
          newReaper.vx = -newReaper.vx * 0.8;
          newReaper.vy = -newReaper.vy * 0.8;
          newBlacksmith.vx = -newBlacksmith.vx * 0.8;
          newBlacksmith.vy = -newBlacksmith.vy * 0.8;
        }

        // Check for winner
        if (newReaper.hp <= 0) {
          setGameState("finished");
          setWinner("Blacksmith");
        } else if (newBlacksmith.hp <= 0) {
          setGameState("finished");
          setWinner("Reaper");
        }

        return newBlacksmith;
      });
      return newReaper;
    });
  }, [gameState]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#3a2f2a";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw stone border
    ctx.fillStyle = "#5c5248";
    ctx.fillRect(0, 0, CANVAS_WIDTH, BORDER_WIDTH); // top
    ctx.fillRect(0, CANVAS_HEIGHT - BORDER_WIDTH, CANVAS_WIDTH, BORDER_WIDTH); // bottom
    ctx.fillRect(0, 0, BORDER_WIDTH, CANVAS_HEIGHT); // left
    ctx.fillRect(CANVAS_WIDTH - BORDER_WIDTH, 0, BORDER_WIDTH, CANVAS_HEIGHT); // right

    // Draw arena pattern
    ctx.strokeStyle = "#4a3f3a";
    ctx.lineWidth = 1;
    for (let i = BORDER_WIDTH; i < CANVAS_WIDTH - BORDER_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, BORDER_WIDTH);
      ctx.lineTo(i, CANVAS_HEIGHT - BORDER_WIDTH);
      ctx.stroke();
    }
    for (let i = BORDER_WIDTH; i < CANVAS_HEIGHT - BORDER_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(BORDER_WIDTH, i);
      ctx.lineTo(CANVAS_WIDTH - BORDER_WIDTH, i);
      ctx.stroke();
    }

    if (gameState === "playing") {
      // Draw spheres
      [reaper, blacksmith].forEach(sphere => {
        // Draw sphere shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.ellipse(sphere.x + 3, sphere.y + 3, sphere.radius - 2, sphere.radius - 5, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Draw sphere
        const gradient = ctx.createRadialGradient(
          sphere.x - sphere.radius * 0.3,
          sphere.y - sphere.radius * 0.3,
          0,
          sphere.x,
          sphere.y,
          sphere.radius
        );
        gradient.addColorStop(0, sphere.name === "Reaper" ? "#4a3d4e" : "#ff8c42");
        gradient.addColorStop(1, sphere.color);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sphere.x, sphere.y, sphere.radius, 0, 2 * Math.PI);
        ctx.fill();

        // Draw sphere outline
        ctx.strokeStyle = sphere.name === "Reaper" ? "#1a1a1a" : "#b8621a";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw HP inside sphere
        ctx.fillStyle = "#f4e4c1";
        ctx.font = "bold 14px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${sphere.hp}`, sphere.x, sphere.y);

        // Draw class symbol
        ctx.fillStyle = "#d4af37";
        ctx.font = "20px serif";
        if (sphere.name === "Reaper") {
          ctx.fillText("⚰", sphere.x, sphere.y - 25);
        } else {
          ctx.fillText("🔨", sphere.x, sphere.y - 25);
        }
      });
    }
  }, [gameState, reaper, blacksmith]);

  useEffect(() => {
    const animate = () => {
      gameLoop();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (gameState === "playing") {
      animate();
    } else {
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, draw, gameState]);

  const startGame = () => {
    setReaper(prev => ({ ...prev, hp: prev.maxHp, x: 200, y: 250, vx: 2, vy: 1.5 }));
    setBlacksmith(prev => ({ ...prev, hp: prev.maxHp, x: 600, y: 250, vx: -1.8, vy: -2 }));
    setGameState("playing");
    setWinner("");
  };

  const resetGame = () => {
    setGameState("menu");
    setWinner("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>⚔️ REAPER VS BLACKSMITH ⚔️</h1>
        <p className={styles.subtitle}>Medieval Arena Brawl</p>
      </header>

      <div className={styles.gameArea}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={styles.canvas}
        />
        
        {gameState === "menu" && (
          <div className={styles.overlay}>
            <div className={styles.menuContent}>
              <h2>Enter the Arena</h2>
              <p>Two warriors enter, one warrior leaves.</p>
              <button onClick={startGame} className={styles.startButton}>
                BEGIN BATTLE
              </button>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className={styles.overlay}>
            <div className={styles.menuContent}>
              <h2>🏆 {winner} Wins! 🏆</h2>
              <p>Victory in the arena!</p>
              <div className={styles.buttonGroup}>
                <button onClick={startGame} className={styles.startButton}>
                  FIGHT AGAIN
                </button>
                <button onClick={resetGame} className={styles.menuButton}>
                  MAIN MENU
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.statsArea}>
        <div className={styles.fighterStats}>
          <div className={styles.fighter}>
            <h3>⚰️ {reaper.name}</h3>
            <div className={styles.statRow}>
              <span>Class:</span>
              <span>{reaper.class}</span>
            </div>
            <div className={styles.statRow}>
              <span>Ability:</span>
              <span>{reaper.ability}</span>
            </div>
            <div className={styles.statRow}>
              <span>Damage:</span>
              <span>{reaper.damage}</span>
            </div>
            <div className={styles.statRow}>
              <span>HP:</span>
              <span>{reaper.hp}/{reaper.maxHp}</span>
            </div>
            <div className={styles.hpBar}>
              <div 
                className={styles.hpFill}
                style={{ 
                  width: `${(reaper.hp / reaper.maxHp) * 100}%`,
                  backgroundColor: '#8b0000'
                }}
              />
            </div>
          </div>

          <div className={styles.vs}>VS</div>

          <div className={styles.fighter}>
            <h3>🔨 {blacksmith.name}</h3>
            <div className={styles.statRow}>
              <span>Class:</span>
              <span>{blacksmith.class}</span>
            </div>
            <div className={styles.statRow}>
              <span>Ability:</span>
              <span>{blacksmith.ability}</span>
            </div>
            <div className={styles.statRow}>
              <span>Damage:</span>
              <span>{blacksmith.damage}</span>
            </div>
            <div className={styles.statRow}>
              <span>HP:</span>
              <span>{blacksmith.hp}/{blacksmith.maxHp}</span>
            </div>
            <div className={styles.hpBar}>
              <div 
                className={styles.hpFill}
                style={{ 
                  width: `${(blacksmith.hp / blacksmith.maxHp) * 100}%`,
                  backgroundColor: '#d4621a'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}