"use client";

import { GameState } from '../lib/types';
import { CLASSES, COLORS } from '../lib/constants';

interface StatBarProps {
  gameState: GameState;
}

export function StatBar({ gameState }: StatBarProps) {
  const [sphere1, sphere2] = gameState.spheres;
  
  if (!sphere1 || !sphere2) return null;
  
  const class1 = CLASSES[sphere1.className];
  const class2 = CLASSES[sphere2.className];
  
  const formatTime = (ms: number) => {
    const seconds = Math.max(0, Math.ceil((60000 - ms) / 1000));
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="stat-bar">
      {/* Left Fighter Stats */}
      <div className="fighter-stats left">
        <div className="fighter-header">
          <div 
            className="fighter-icon"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${class1.colors.SECONDARY}, ${class1.colors.PRIMARY})`,
              border: `2px solid ${class1.colors.ACCENT}`
            }}
          >
            <span className="fighter-symbol">
              {sphere1.className === 'REAPER' ? '⚰' : '🔨'}
            </span>
          </div>
          <div className="fighter-info">
            <h3 className="fighter-name" style={{ color: class1.colors.ACCENT }}>
              {class1.name}
            </h3>
            <p className="fighter-ability">{class1.specialAbility}</p>
          </div>
        </div>
        
        <div className="fighter-details">
          <div className="stat-row">
            <span className="stat-label">HP:</span>
            <div className="hp-bar">
              <div 
                className="hp-fill"
                style={{ 
                  width: `${(sphere1.hp / sphere1.maxHP) * 100}%`,
                  backgroundColor: sphere1.hp > sphere1.maxHP * 0.6 ? '#4CAF50' : 
                                 sphere1.hp > sphere1.maxHP * 0.3 ? '#FFC107' : '#F44336'
                }}
              />
              <span className="hp-text">{sphere1.hp}/{sphere1.maxHP}</span>
            </div>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">DMG:</span>
            <span className="stat-value">{class1.damage}</span>
          </div>
        </div>
      </div>

      {/* Center - VS and Timer */}
      <div className="center-section">
        <div className="vs-text">VS</div>
        {gameState.gameStarted && !gameState.gameEnded && (
          <div className="timer">{formatTime(gameState.gameTime)}</div>
        )}
        {gameState.gameEnded && (
          <div className="game-result">
            {gameState.winner === sphere1.id ? `${class1.name} WINS!` :
             gameState.winner === sphere2.id ? `${class2.name} WINS!` :
             'DRAW!'}
          </div>
        )}
      </div>

      {/* Right Fighter Stats */}
      <div className="fighter-stats right">
        <div className="fighter-header">
          <div className="fighter-info">
            <h3 className="fighter-name" style={{ color: class2.colors.ACCENT }}>
              {class2.name}
            </h3>
            <p className="fighter-ability">{class2.specialAbility}</p>
          </div>
          <div 
            className="fighter-icon"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${class2.colors.SECONDARY}, ${class2.colors.PRIMARY})`,
              border: `2px solid ${class2.colors.ACCENT}`
            }}
          >
            <span className="fighter-symbol">
              {sphere2.className === 'REAPER' ? '⚰' : '🔨'}
            </span>
          </div>
        </div>
        
        <div className="fighter-details">
          <div className="stat-row">
            <span className="stat-label">HP:</span>
            <div className="hp-bar">
              <div 
                className="hp-fill"
                style={{ 
                  width: `${(sphere2.hp / sphere2.maxHP) * 100}%`,
                  backgroundColor: sphere2.hp > sphere2.maxHP * 0.6 ? '#4CAF50' : 
                                 sphere2.hp > sphere2.maxHP * 0.3 ? '#FFC107' : '#F44336'
                }}
              />
              <span className="hp-text">{sphere2.hp}/{sphere2.maxHP}</span>
            </div>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">DMG:</span>
            <span className="stat-value">{class2.damage}</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .stat-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(42, 24, 16, 0.9);
          border: 2px solid ${COLORS.GOLD};
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          font-family: 'Times New Roman', serif;
          min-height: 120px;
        }
        
        .fighter-stats {
          flex: 1;
          max-width: 300px;
        }
        
        .fighter-stats.right {
          text-align: right;
        }
        
        .fighter-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }
        
        .fighter-stats.right .fighter-header {
          flex-direction: row-reverse;
        }
        
        .fighter-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        
        .fighter-symbol {
          filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.8));
        }
        
        .fighter-info {
          min-width: 0;
        }
        
        .fighter-name {
          font-size: 20px;
          font-weight: bold;
          margin: 0 0 4px 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
        
        .fighter-ability {
          color: ${COLORS.STONE_TEXT};
          font-size: 14px;
          margin: 0;
          font-style: italic;
        }
        
        .fighter-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .stat-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .fighter-stats.right .stat-row {
          flex-direction: row-reverse;
        }
        
        .stat-label {
          color: ${COLORS.STONE_TEXT};
          font-size: 14px;
          font-weight: bold;
          min-width: 40px;
        }
        
        .stat-value {
          color: ${COLORS.GOLD};
          font-size: 16px;
          font-weight: bold;
        }
        
        .hp-bar {
          position: relative;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid ${COLORS.GOLD};
          border-radius: 4px;
          height: 20px;
          width: 120px;
          overflow: hidden;
        }
        
        .hp-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        
        .hp-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
        
        .center-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin: 0 20px;
        }
        
        .vs-text {
          color: ${COLORS.GOLD};
          font-size: 32px;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          letter-spacing: 4px;
        }
        
        .timer {
          color: ${COLORS.STONE_TEXT};
          font-size: 24px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          background: rgba(0, 0, 0, 0.5);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid ${COLORS.GOLD};
        }
        
        .game-result {
          color: ${COLORS.GOLD};
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          background: rgba(0, 0, 0, 0.7);
          padding: 12px 20px;
          border-radius: 8px;
          border: 2px solid ${COLORS.GOLD};
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}