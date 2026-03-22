"use client";

import { useRef, useEffect, useCallback } from 'react';
import { Sphere } from '../lib/types';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  ARENA_PADDING,
  COLORS
} from '../lib/constants';

interface ArenaProps {
  spheres: Sphere[];
  onSphereClick?: (sphere: Sphere) => void;
}

export function Arena({ spheres, onSphereClick }: ArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const drawArena = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw arena background
    ctx.fillStyle = COLORS.ARENA_BG;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw stone border
    ctx.strokeStyle = COLORS.ARENA_BORDER;
    ctx.lineWidth = 8;
    ctx.strokeRect(ARENA_PADDING, ARENA_PADDING, 
      CANVAS_WIDTH - ARENA_PADDING * 2, 
      CANVAS_HEIGHT - ARENA_PADDING * 2);
    
    // Draw inner accent border
    ctx.strokeStyle = COLORS.ARENA_ACCENT;
    ctx.lineWidth = 2;
    ctx.strokeRect(ARENA_PADDING + 4, ARENA_PADDING + 4, 
      CANVAS_WIDTH - ARENA_PADDING * 2 - 8, 
      CANVAS_HEIGHT - ARENA_PADDING * 2 - 8);
    
    // Draw corner decorations
    const cornerSize = 16;
    ctx.fillStyle = COLORS.GOLD;
    
    // Top corners
    ctx.fillRect(ARENA_PADDING, ARENA_PADDING, cornerSize, cornerSize);
    ctx.fillRect(CANVAS_WIDTH - ARENA_PADDING - cornerSize, ARENA_PADDING, cornerSize, cornerSize);
    
    // Bottom corners
    ctx.fillRect(ARENA_PADDING, CANVAS_HEIGHT - ARENA_PADDING - cornerSize, cornerSize, cornerSize);
    ctx.fillRect(CANVAS_WIDTH - ARENA_PADDING - cornerSize, CANVAS_HEIGHT - ARENA_PADDING - cornerSize, cornerSize, cornerSize);
  }, []);

  const drawSphere = useCallback((ctx: CanvasRenderingContext2D, sphere: Sphere) => {
    const { position, radius, class: sphereClass, hp, maxHp, isFlashing } = sphere;
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(position.x + 3, position.y + 3, radius * 0.8, radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Main sphere color (with flash effect)
    let sphereColor = sphereClass.color;
    if (isFlashing) {
      sphereColor = '#ffffff';
    }
    
    // Draw main sphere
    const gradient = ctx.createRadialGradient(
      position.x - radius * 0.3, position.y - radius * 0.3, 0,
      position.x, position.y, radius
    );
    gradient.addColorStop(0, sphereColor);
    gradient.addColorStop(0.7, sphereClass.color);
    gradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw sphere outline
    ctx.strokeStyle = COLORS.STONE_GRAY;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw HP bar inside sphere
    const hpBarWidth = radius * 1.2;
    const hpBarHeight = 6;
    const hpBarX = position.x - hpBarWidth / 2;
    const hpBarY = position.y - 2;
    
    // HP background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
    
    // HP fill
    const hpPercentage = hp / maxHp;
    const hpFillWidth = hpBarWidth * hpPercentage;
    
    if (hpPercentage > 0.6) {
      ctx.fillStyle = '#4caf50';
    } else if (hpPercentage > 0.3) {
      ctx.fillStyle = COLORS.GOLD;
    } else {
      ctx.fillStyle = '#f44336';
    }
    
    ctx.fillRect(hpBarX, hpBarY, hpFillWidth, hpBarHeight);
    
    // HP text
    ctx.fillStyle = COLORS.TEXT_LIGHT;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${hp}`, position.x, position.y + 5);
    
    // Draw weapon symbol
    ctx.fillStyle = COLORS.GOLD;
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    
    const weaponSymbol = sphereClass.name === 'Reaper' ? '⚰' : '⚒';
    ctx.fillText(weaponSymbol, position.x, position.y - 15);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawArena(ctx);
    spheres.forEach(sphere => drawSphere(ctx, sphere));
  }, [spheres, drawArena, drawSphere]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSphereClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Check if click is on any sphere
    for (const sphere of spheres) {
      const distance = Math.sqrt(
        Math.pow(clickX - sphere.position.x, 2) + 
        Math.pow(clickY - sphere.position.y, 2)
      );
      
      if (distance <= sphere.radius) {
        onSphereClick(sphere);
        break;
      }
    }
  }, [spheres, onSphereClick]);

  useEffect(() => {
    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <div className="arena-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        style={{
          border: `4px solid ${COLORS.STONE_GRAY}`,
          borderRadius: '8px',
          cursor: onSphereClick ? 'pointer' : 'default',
          background: COLORS.ARENA_BG
        }}
      />
      
      <style jsx>{`
        .arena-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #3e2723, #5d4e37);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        canvas {
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}