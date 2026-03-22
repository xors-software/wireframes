"use client";

import { Sphere } from '../lib/types';
import { COLORS, SPECIAL_COOLDOWN } from '../lib/constants';
import { canUseSpecial } from '../lib/game-logic';

interface StatBarProps {
  sphere: Sphere;
  position: 'left' | 'right';
  onSpecialAttack?: () => void;
}

export function StatBar({ sphere, position, onSpecialAttack }: StatBarProps) {
  const { class: sphereClass, hp, maxHp } = sphere;
  const hpPercentage = (hp / maxHp) * 100;
  const specialReady = canUseSpecial(sphere);
  const specialCooldownRemaining = Math.max(0, SPECIAL_COOLDOWN - (Date.now() - sphere.lastSpecialTime));
  const specialCooldownPercentage = (specialCooldownRemaining / SPECIAL_COOLDOWN) * 100;

  const isLeft = position === 'left';

  return (
    <div className={`stat-bar ${position}`}>
      <div className="class-info">
        <div className="class-name">{sphereClass.name}</div>
        <div className="weapon">⚔ {sphereClass.weapon}</div>
      </div>
      
      <div className="hp-section">
        <div className="hp-label">Health</div>
        <div className="hp-bar-container">
          <div 
            className="hp-bar" 
            style={{ width: `${hpPercentage}%` }}
          />
          <div className="hp-text">{hp}/{maxHp}</div>
        </div>
      </div>
      
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Damage:</span>
          <span className="stat-value">{sphereClass.baseDamage}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Special:</span>
          <span className="stat-value">{sphereClass.specialDamage}</span>
        </div>
      </div>
      
      <div className="special-section">
        <div className="special-name">{sphereClass.specialAbility}</div>
        <button 
          className={`special-button ${!specialReady ? 'disabled' : ''}`}
          onClick={onSpecialAttack}
          disabled={!specialReady}
        >
          {specialReady ? 'READY' : `${Math.ceil(specialCooldownRemaining / 1000)}s`}
        </button>
        {!specialReady && (
          <div className="cooldown-bar-container">
            <div 
              className="cooldown-bar" 
              style={{ width: `${100 - specialCooldownPercentage}%` }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        .stat-bar {
          width: 280px;
          padding: 16px;
          background: linear-gradient(135deg, ${COLORS.DARK_BROWN}, #4a3728);
          border: 3px solid ${COLORS.STONE_GRAY};
          border-radius: 8px;
          color: ${COLORS.TEXT_LIGHT};
          font-family: 'Cinzel', serif;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        
        .stat-bar.left {
          border-left: 4px solid ${COLORS.GOLD};
        }
        
        .stat-bar.right {
          border-right: 4px solid ${COLORS.GOLD};
        }
        
        .class-info {
          text-align: center;
          margin-bottom: 12px;
        }
        
        .class-name {
          font-size: 20px;
          font-weight: bold;
          color: ${COLORS.GOLD};
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          margin-bottom: 4px;
        }
        
        .weapon {
          font-size: 14px;
          color: ${COLORS.TEXT_LIGHT};
          opacity: 0.9;
        }
        
        .hp-section {
          margin-bottom: 12px;
        }
        
        .hp-label {
          font-size: 12px;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${COLORS.TEXT_LIGHT};
          opacity: 0.8;
        }
        
        .hp-bar-container {
          position: relative;
          height: 24px;
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid ${COLORS.STONE_GRAY};
          border-radius: 4px;
          overflow: hidden;
        }
        
        .hp-bar {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #8bc34a);
          transition: width 0.3s ease;
        }
        
        .hp-bar-container:has(.hp-bar[style*="width: 0"]) .hp-bar,
        .hp-bar-container:has(.hp-bar[style*="width: 1"]) .hp-bar,
        .hp-bar-container:has(.hp-bar[style*="width: 2"]) .hp-bar,
        .hp-bar-container:has(.hp-bar[style*="width: 3"]) .hp-bar {
          background: linear-gradient(90deg, #f44336, #ff5722);
        }
        
        .hp-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          color: ${COLORS.TEXT_LIGHT};
        }
        
        .stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${COLORS.TEXT_LIGHT};
          opacity: 0.7;
        }
        
        .stat-value {
          font-size: 16px;
          font-weight: bold;
          color: ${COLORS.GOLD};
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        .special-section {
          text-align: center;
        }
        
        .special-name {
          font-size: 14px;
          margin-bottom: 8px;
          color: ${COLORS.ORANGE};
          font-weight: bold;
        }
        
        .special-button {
          width: 100%;
          padding: 8px 16px;
          background: linear-gradient(135deg, ${COLORS.GOLD}, ${COLORS.ORANGE});
          border: 2px solid ${COLORS.STONE_GRAY};
          border-radius: 4px;
          color: ${COLORS.TEXT_DARK};
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .special-button:hover:not(.disabled) {
          background: linear-gradient(135deg, #ffcc02, #ff9800);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .special-button.disabled {
          background: linear-gradient(135deg, #666, #888);
          color: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .cooldown-bar-container {
          position: relative;
          height: 4px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 2px;
          margin-top: 4px;
          overflow: hidden;
        }
        
        .cooldown-bar {
          height: 100%;
          background: linear-gradient(90deg, ${COLORS.GOLD}, ${COLORS.ORANGE});
          transition: width 0.1s linear;
        }
      `}</style>
    </div>
  );
}