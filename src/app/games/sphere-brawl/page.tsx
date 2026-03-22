"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Arena } from './components/Arena';
import { ClassSelector } from './components/ClassSelector';
import { StatBar } from './components/StatBar';
import { GameState, ClassName, GamePhase } from './lib/types';
import { COLORS } from './lib/constants';
import { initializeGame, updateGameState, applySphereMovement } from './lib/physics';

export default function SphereBrawl() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [selectedClass, setSelectedClass] = useState<ClassName>('REAPER');
  const gameLoopRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());

  // Game loop
  useEffect(() => {
    if (gamePhase === 'playing' && !gameState.gameEnded) {
      const loop = () => {
        setGameState(prevState => {
          const newState = updateGameState(prevState);
          
          // Handle input
          const keys = keysRef.current;
          if (newState.spheres.length >= 2) {
            let [sphere1, sphere2] = newState.spheres;
            
            // Player 1 controls (WASD)
            let p1Direction = { x: 0, y: 0 };
            if (keys.has('KeyA') || keys.has('ArrowLeft')) p1Direction.x -= 1;
            if (keys.has('KeyD') || keys.has('ArrowRight')) p1Direction.x += 1;
            if (keys.has('KeyW') || keys.has('ArrowUp')) p1Direction.y -= 1;
            if (keys.has('KeyS') || keys.has('ArrowDown')) p1Direction.y += 1;
            
            if (p1Direction.x !== 0 || p1Direction.y !== 0) {
              sphere1 = applySphereMovement(sphere1, p1Direction);
            }
            
            // Player 2 controls (Arrow keys / IJKL)
            let p2Direction = { x: 0, y: 0 };
            if (keys.has('KeyJ')) p2Direction.x -= 1;
            if (keys.has('KeyL')) p2Direction.x += 1;
            if (keys.has('KeyI')) p2Direction.y -= 1;
            if (keys.has('KeyK')) p2Direction.y += 1;
            
            if (p2Direction.x !== 0 || p2Direction.y !== 0) {
              sphere2 = applySphereMovement(sphere2, p2Direction);
            }
            
            newState.spheres = [sphere1, sphere2];
          }
          
          // Check if game ended
          if (newState.gameEnded && gamePhase === 'playing') {
            setGamePhase('finished');
          }
          
          return newState;
        });
        
        gameLoopRef.current = requestAnimationFrame(loop);
      };
      
      gameLoopRef.current = requestAnimationFrame(loop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gamePhase, gameState.gameEnded]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };
    
    if (gamePhase === 'playing') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gamePhase]);

  const startGame = useCallback(() => {
    const newGameState = initializeGame();
    // Set player 1 to selected class, player 2 to the other class
    const otherClass: ClassName = selectedClass === 'REAPER' ? 'BLACKSMITH' : 'REAPER';
    newGameState.spheres[0].className = selectedClass;
    newGameState.spheres[1].className = otherClass;
    
    // Reset HP based on class
    const { CLASSES } = require('./lib/constants');
    newGameState.spheres[0].hp = CLASSES[selectedClass].maxHP;
    newGameState.spheres[0].maxHP = CLASSES[selectedClass].maxHP;
    newGameState.spheres[1].hp = CLASSES[otherClass].maxHP;
    newGameState.spheres[1].maxHP = CLASSES[otherClass].maxHP;
    
    newGameState.gameStarted = true;
    setGameState(newGameState);
    setGamePhase('playing');
  }, [selectedClass]);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
    setGamePhase('setup');
    keysRef.current.clear();
  }, []);

  return (
    <div className="game-container">
      {/* Game Title */}
      <header className="game-header">
        <h1 className="game-title">Sphere Brawl</h1>
        <p className="game-subtitle">Medieval Arena Combat</p>
      </header>

      {/* Setup Phase */}
      {gamePhase === 'setup' && (
        <div className="setup-phase">
          <ClassSelector
            selectedClass={selectedClass}
            onClassSelect={setSelectedClass}
          />
          <div className="start-section">
            <button className="start-button" onClick={startGame}>
              Enter the Arena
            </button>
            <div className="controls-info">
              <h4>Controls:</h4>
              <div className="control-groups">
                <div className="control-group">
                  <span className="player-label">Player 1 ({selectedClass}):</span>
                  <span className="controls">WASD to move</span>
                </div>
                <div className="control-group">
                  <span className="player-label">Player 2 ({selectedClass === 'REAPER' ? 'BLACKSMITH' : 'REAPER'}):</span>
                  <span className="controls">IJKL to move</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playing/Finished Phase */}
      {(gamePhase === 'playing' || gamePhase === 'finished') && (
        <>
          <StatBar gameState={gameState} />
          <Arena gameState={gameState} />
          
          {gamePhase === 'finished' && (
            <div className="game-over">
              <button className="restart-button" onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .game-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a0f0a, #2d1b13);
          padding: 20px;
          font-family: 'Times New Roman', serif;
        }
        
        .game-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .game-title {
          color: ${COLORS.GOLD};
          font-size: 48px;
          font-weight: bold;
          margin: 0 0 8px 0;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
          letter-spacing: 2px;
        }
        
        .game-subtitle {
          color: ${COLORS.STONE_TEXT};
          font-size: 18px;
          margin: 0;
          font-style: italic;
        }
        
        .setup-phase {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .start-section {
          text-align: center;
          margin-top: 30px;
        }
        
        .start-button {
          background: linear-gradient(135deg, ${COLORS.GOLD}, #b8860b);
          color: #000;
          border: none;
          padding: 16px 32px;
          font-size: 24px;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          text-shadow: 1px 1px 2px rgba(255,255,255,0.3);
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
          margin-bottom: 30px;
        }
        
        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(255,215,0,0.4);
        }
        
        .controls-info {
          background: rgba(42, 24, 16, 0.8);
          border: 1px solid ${COLORS.GOLD};
          border-radius: 8px;
          padding: 20px;
          margin: 0 auto;
          max-width: 500px;
        }
        
        .controls-info h4 {
          color: ${COLORS.GOLD};
          margin: 0 0 16px 0;
          font-size: 18px;
        }
        
        .control-groups {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .control-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .player-label {
          color: ${COLORS.STONE_TEXT};
          font-weight: bold;
        }
        
        .controls {
          color: ${COLORS.GOLD};
          font-family: 'Courier New', monospace;
          background: rgba(0,0,0,0.5);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .game-over {
          text-align: center;
          margin-top: 30px;
        }
        
        .restart-button {
          background: linear-gradient(135deg, ${COLORS.GOLD}, #b8860b);
          color: #000;
          border: none;
          padding: 12px 24px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
        }
        
        .restart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(255,215,0,0.4);
        }
        
        @media (max-width: 768px) {
          .game-title {
            font-size: 36px;
          }
          
          .control-group {
            flex-direction: column;
            gap: 4px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}