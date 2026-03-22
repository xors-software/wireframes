"use client";

import { useRef, useEffect } from 'react';
import { GameState, Sphere } from '../lib/types';
import { ARENA_WIDTH, ARENA_HEIGHT, BORDER_WIDTH, COLORS, CLASSES } from '../lib/constants';

interface ArenaProps {
  gameState: GameState;
}

export function Arena({ gameState }: ArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = ARENA_WIDTH;
    canvas.height = ARENA_HEIGHT;

    // Clear canvas
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw arena background
    ctx.fillStyle = COLORS.ARENA_BG;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw stone border
    ctx.fillStyle = COLORS.STONE_BORDER;
    ctx.fillRect(0, 0, ARENA_WIDTH, BORDER_WIDTH); // Top
    ctx.fillRect(0, ARENA_HEIGHT - BORDER_WIDTH, ARENA_WIDTH, BORDER_WIDTH); // Bottom
    ctx.fillRect(0, 0, BORDER_WIDTH, ARENA_HEIGHT); // Left
    ctx.fillRect(ARENA_WIDTH - BORDER_WIDTH, 0, BORDER_WIDTH, ARENA_HEIGHT); // Right

    // Draw stone border highlights
    ctx.fillStyle = COLORS.STONE_HIGHLIGHT;
    ctx.fillRect(0, 0, ARENA_WIDTH, 3); // Top highlight
    ctx.fillRect(0, 0, 3, ARENA_HEIGHT); // Left highlight

    // Draw arena floor pattern
    ctx.strokeStyle = COLORS.DARK_STONE;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    // Draw grid pattern
    for (let x = BORDER_WIDTH; x < ARENA_WIDTH - BORDER_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, BORDER_WIDTH);
      ctx.lineTo(x, ARENA_HEIGHT - BORDER_WIDTH);
      ctx.stroke();
    }
    
    for (let y = BORDER_WIDTH; y < ARENA_HEIGHT - BORDER_WIDTH; y += 40) {
      ctx.beginPath();
      ctx.moveTo(BORDER_WIDTH, y);
      ctx.lineTo(ARENA_WIDTH - BORDER_WIDTH, y);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;

    // Draw spheres
    gameState.spheres.forEach(sphere => {
      drawSphere(ctx, sphere);
    });

  }, [gameState]);

  const drawSphere = (ctx: CanvasRenderingContext2D, sphere: Sphere) => {
    const classData = CLASSES[sphere.className];
    const colors = classData.colors;
    
    // Create radial gradient for 3D effect
    const gradient = ctx.createRadialGradient(
      sphere.position.x - sphere.radius * 0.3,
      sphere.position.y - sphere.radius * 0.3,
      0,
      sphere.position.x,
      sphere.position.y,
      sphere.radius
    );
    
    gradient.addColorStop(0, colors.SECONDARY);
    gradient.addColorStop(0.7, colors.PRIMARY);
    gradient.addColorStop(1, colors.ACCENT);

    // Draw sphere shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(
      sphere.position.x + 3,
      sphere.position.y + sphere.radius + 3,
      sphere.radius * 0.8,
      sphere.radius * 0.3,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw main sphere
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(sphere.position.x, sphere.position.y, sphere.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw sphere outline
    ctx.strokeStyle = colors.ACCENT;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw HP text inside sphere
    ctx.fillStyle = colors.TEXT;
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const hpText = `${sphere.hp}`;
    ctx.fillText(hpText, sphere.position.x, sphere.position.y);

    // Draw class symbol
    ctx.font = 'bold 12px serif';
    const symbol = sphere.className === 'REAPER' ? '⚰' : '🔨';
    ctx.fillText(symbol, sphere.position.x, sphere.position.y - 15);

    // Draw HP bar above sphere
    const barWidth = sphere.radius * 1.5;
    const barHeight = 6;
    const barX = sphere.position.x - barWidth / 2;
    const barY = sphere.position.y - sphere.radius - 15;
    
    // HP bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // HP bar fill
    const hpPercent = sphere.hp / sphere.maxHP;
    const fillWidth = barWidth * hpPercent;
    
    if (hpPercent > 0.6) {
      ctx.fillStyle = '#4CAF50'; // Green
    } else if (hpPercent > 0.3) {
      ctx.fillStyle = '#FFC107'; // Yellow
    } else {
      ctx.fillStyle = '#F44336'; // Red
    }
    
    ctx.fillRect(barX, barY, fillWidth, barHeight);
    
    // HP bar border
    ctx.strokeStyle = colors.ACCENT;
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  };

  return (
    <div className="arena-container">
      <canvas
        ref={canvasRef}
        className="arena-canvas"
        style={{
          border: `3px solid ${COLORS.GOLD}`,
          borderRadius: '8px',
          background: COLORS.ARENA_BG,
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3)'
        }}
      />
      <style jsx>{`
        .arena-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }
        
        .arena-canvas {
          display: block;
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
}