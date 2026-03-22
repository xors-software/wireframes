"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Arena } from './components/Arena';
import { StatBar } from './components/StatBar';
import { ClassSelector } from './components/ClassSelector';
import { GameState, Sphere } from './lib/types';
import { COLORS } from './lib/constants';
import { 
  SPHERE_CLASSES,
  initializeGame,
  updateSpherePhysics,
  checkSphereCollision,
  resolveSphereCollision,
  dealDamage,
  checkGameEnd,
  useSpecial,
  canUseSpecial
} from './lib/game-logic';

export default function SphereBrawl() {
  const [gameState, setGameState] = useState<GameState>(
    initializeGame(SPHERE_CLASSES.REAPER, SPHERE_CLASSES.BLACKSMITH)
  );
  const [selectedClasses, setSelectedClasses] = useState({
    player1: SPHERE_CLASSES.REAPER,
    player2: SPHERE_CLASSES.BLACKSMITH
  });
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  const startGame = useCallback(() => {
    const newGameState = initializeGame(selectedClasses.player1, selectedClasses.player2);
    setGameState(newGameState);
    setGamePhase('playing');
    lastUpdateRef.current = Date.now();
  }, [selectedClasses]);

  const resetGame = useCallback(() => {
    setGamePhase('setup');
    setGameState(initializeGame(selectedClasses.player1, selectedClasses.player2));
  }, [selectedClasses]);

  const handleSphereClick = useCallback((clickedSphere: Sphere) => {
    if (gamePhase !== 'playing') return;
    
    setGameState(prevState => {
      const newState = { ...prevState };
      const spheres = [...newState.spheres] as [Sphere, Sphere];
      const clickedIndex = spheres.findIndex(s => s.id === clickedSphere.id);
      const targetIndex = clickedIndex === 0 ? 1 : 0;
      
      if (clickedIndex !== -1) {
        const attacker = { ...spheres[clickedIndex] };
        const target = { ...spheres[targetIndex] };
        
        // Deal damage
        dealDamage(attacker, target, false);
        
        // Add some knockback force
        const dx = target.position.x - attacker.position.x;
        const dy = target.position.y - attacker.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = 8;
          target.velocity.x += (dx / distance) * force;
          target.velocity.y += (dy / distance) * force;
        }
        
        spheres[clickedIndex] = attacker;
        spheres[targetIndex] = target;
        newState.spheres = spheres;
      }
      
      return newState;
    });
  }, [gamePhase]);

  const handleSpecialAttack = useCallback((attackerId: string) => {
    if (gamePhase !== 'playing') return;
    
    setGameState(prevState => {
      const newState = { ...prevState };
      const spheres = [...newState.spheres] as [Sphere, Sphere];
      const attackerIndex = spheres.findIndex(s => s.id === attackerId);
      const targetIndex = attackerIndex === 0 ? 1 : 0;
      
      if (attackerIndex !== -1) {
        const attacker = { ...spheres[attackerIndex] };
        const target = { ...spheres[targetIndex] };
        
        if (canUseSpecial(attacker)) {
          useSpecial(attacker);
          dealDamage(attacker, target, true);
          
          // Special attack knockback is stronger
          const dx = target.position.x - attacker.position.x;
          const dy = target.position.y - attacker.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const force = 15;
            target.velocity.x += (dx / distance) * force;
            target.velocity.y += (dy / distance) * force;
          }
          
          spheres[attackerIndex] = attacker;
          spheres[targetIndex] = target;
          newState.spheres = spheres;
        }
      }
      
      return newState;
    });
  }, [gamePhase]);

  // Game loop
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastUpdateRef.current) / 1000, 0.016);
      lastUpdateRef.current = now;

      setGameState(prevState => {
        const newState = { ...prevState };
        const spheres = [...newState.spheres] as [Sphere, Sphere];

        // Update physics
        spheres.forEach(sphere => updateSpherePhysics(sphere, deltaTime));

        // Check collisions
        if (checkSphereCollision(spheres[0], spheres[1])) {
          resolveSphereCollision(spheres[0], spheres[1]);
          
          // Deal collision damage
          dealDamage(spheres[0], spheres[1], false);
          dealDamage(spheres[1], spheres[0], false);
        }

        newState.spheres = spheres;

        // Check for game end
        const winner = checkGameEnd(newState);
        if (winner && gamePhase === 'playing') {
          newState.winner = winner;
          setGamePhase('finished');
        }

        return newState;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gamePhase]);

  const handleClassSelect = useCallback((player: 'player1' | 'player2', sphereClass: any) => {
    setSelectedClasses(prev => ({
      ...prev,
      [player]: sphereClass
    }));
  }, []);

  return (
    <div className="sphere-brawl">
      {/* Title */}
      <header className="game-header">
        <h1 className="game-title">SPHERE BRAWL</h1>
        <div className="game-subtitle">Medieval Arena Combat</div>
      </header>

      {gamePhase === 'setup' && (
        <div className="setup-phase">
          <div className="class-selectors">
            <ClassSelector
              selectedClass={selectedClasses.player1}
              onClassSelect={(sphereClass) => handleClassSelect('player1', sphereClass)}
              position="left"
            />
            <ClassSelector
              selectedClass={selectedClasses.player2}
              onClassSelect={(sphereClass) => handleClassSelect('player2', sphereClass)}
              position="right"
            />
          </div>
          
          <div className="vs-section">
            <div className="vs-text">{selectedClasses.player1.name} VS {selectedClasses.player2.name}</div>
            <button className="start-button" onClick={startGame}>
              ENTER THE ARENA
            </button>
          </div>
        </div>
      )}

      {(gamePhase === 'playing' || gamePhase === 'finished') && (
        <div className="game-phase">
          <div className="battle-title">
            {selectedClasses.player1.name} VS {selectedClasses.player2.name}
          </div>
          
          <div className="game-area">
            <div className="stat-bars">
              <StatBar
                sphere={gameState.spheres[0]}
                position="left"
                onSpecialAttack={() => handleSpecialAttack(gameState.spheres[0].id)}
              />
              <StatBar
                sphere={gameState.spheres[1]}
                position="right"
                onSpecialAttack={() => handleSpecialAttack(gameState.spheres[1].id)}
              />
            </div>
            
            <Arena
              spheres={gameState.spheres}
              onSphereClick={handleSphereClick}
            />
            
            <div className="game-instructions">
              {gamePhase === 'playing' && (
                <div>Click on spheres to attack • Use special abilities when ready</div>
              )}
              {gamePhase === 'finished' && (
                <div className="victory-message">
                  🏆 {gameState.winner} WINS! 🏆
                </div>
              )}
            </div>
          </div>

          {gamePhase === 'finished' && (
            <div className="game-over">
              <button className="reset-button" onClick={resetGame}>
                NEW BATTLE
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .sphere-brawl {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a0e0a, #2d1810, #3e2723);
          color: ${COLORS.TEXT_LIGHT};
          font-family: 'Cinzel', serif;
          padding: 20px;
        }

        .game-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .game-title {
          font-size: 48px;
          font-weight: bold;
          color: ${COLORS.GOLD};
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
          margin: 0;
          letter-spacing: 4px;
        }

        .game-subtitle {
          font-size: 18px;
          color: ${COLORS.TEXT_LIGHT};
          opacity: 0.8;
          margin-top: 8px;
          letter-spacing: 2px;
        }

        .setup-phase {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .class-selectors {
          display: flex;
          gap: 40px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .vs-section {
          text-align: center;
        }

        .vs-text {
          font-size: 24px;
          font-weight: bold;
          color: ${COLORS.ORANGE};
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .start-button {
          padding: 16px 32px;
          font-size: 18px;
          font-weight: bold;
          background: linear-gradient(135deg, ${COLORS.GOLD}, ${COLORS.ORANGE});
          border: 3px solid ${COLORS.STONE_GRAY};
          border-radius: 8px;
          color: ${COLORS.TEXT_DARK};
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: 'Cinzel', serif;
        }

        .start-button:hover {
          background: linear-gradient(135deg, #ffcc02, #ff9800);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 179, 0, 0.4);
        }

        .game-phase {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .battle-title {
          font-size: 28px;
          font-weight: bold;
          color: ${COLORS.GOLD};
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          text-align: center;
        }

        .game-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          width: 100%;
          max-width: 1200px;
        }

        .stat-bars {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 900px;
          gap: 20px;
        }

        .game-instructions {
          text-align: center;
          font-size: 14px;
          color: ${COLORS.TEXT_LIGHT};
          opacity: 0.8;
          background: rgba(0, 0, 0, 0.3);
          padding: 12px 24px;
          border-radius: 6px;
          border: 1px solid ${COLORS.STONE_GRAY};
        }

        .victory-message {
          font-size: 18px;
          font-weight: bold;
          color: ${COLORS.GOLD};
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .game-over {
          margin-top: 20px;
        }

        .reset-button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: bold;
          background: linear-gradient(135deg, ${COLORS.GOLD}, ${COLORS.ORANGE});
          border: 2px solid ${COLORS.STONE_GRAY};
          border-radius: 6px;
          color: ${COLORS.TEXT_DARK};
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Cinzel', serif;
        }

        .reset-button:hover {
          background: linear-gradient(135deg, #ffcc02, #ff9800);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 179, 0, 0.4);
        }

        @media (max-width: 768px) {
          .game-title {
            font-size: 32px;
          }
          
          .class-selectors {
            flex-direction: column;
            align-items: center;
          }
          
          .stat-bars {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}