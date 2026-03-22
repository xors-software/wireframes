"use client";

import { SphereClass } from '../lib/types';
import { SPHERE_CLASSES } from '../lib/game-logic';
import { COLORS } from '../lib/constants';

interface ClassSelectorProps {
  selectedClass: SphereClass;
  onClassSelect: (sphereClass: SphereClass) => void;
  position: 'left' | 'right';
  disabled?: boolean;
}

export function ClassSelector({ selectedClass, onClassSelect, position, disabled = false }: ClassSelectorProps) {
  const classes = Object.values(SPHERE_CLASSES);
  const isLeft = position === 'left';

  return (
    <div className={`class-selector ${position} ${disabled ? 'disabled' : ''}`}>
      <div className="selector-title">
        {isLeft ? 'Player 1' : 'Player 2'}
      </div>
      
      <div className="class-options">
        {classes.map((sphereClass) => (
          <div
            key={sphereClass.name}
            className={`class-option ${selectedClass.name === sphereClass.name ? 'selected' : ''}`}
            onClick={() => !disabled && onClassSelect(sphereClass)}
          >
            <div className="class-preview">
              <div 
                className="sphere-preview" 
                style={{ backgroundColor: sphereClass.color }}
              >
                <span className="weapon-icon">
                  {sphereClass.name === 'Reaper' ? '⚰' : '⚒'}
                </span>
              </div>
            </div>
            
            <div className="class-details">
              <div className="class-name">{sphereClass.name}</div>
              <div className="class-weapon">⚔ {sphereClass.weapon}</div>
              <div className="class-special">{sphereClass.specialAbility}</div>
              <div className="class-stats">
                <span>DMG: {sphereClass.baseDamage}</span>
                <span>SPEC: {sphereClass.specialDamage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="selected-description">
        <div className="description-title">Selected Class:</div>
        <div className="description-text">{selectedClass.description}</div>
      </div>
      
      <style jsx>{`
        .class-selector {
          width: 320px;
          padding: 20px;
          background: linear-gradient(135deg, ${COLORS.DARK_BROWN}, #4a3728);
          border: 3px solid ${COLORS.STONE_GRAY};
          border-radius: 12px;
          color: ${COLORS.TEXT_LIGHT};
          font-family: 'Cinzel', serif;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        
        .class-selector.left {
          border-left: 4px solid ${COLORS.GOLD};
        }
        
        .class-selector.right {
          border-right: 4px solid ${COLORS.GOLD};
        }
        
        .class-selector.disabled {
          opacity: 0.7;
          pointer-events: none;
        }
        
        .selector-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: ${COLORS.GOLD};
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .class-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .class-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .class-option:hover {
          background: rgba(255, 179, 0, 0.1);
          border-color: ${COLORS.GOLD};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .class-option.selected {
          background: rgba(255, 179, 0, 0.2);
          border-color: ${COLORS.GOLD};
          box-shadow: 0 0 16px rgba(255, 179, 0, 0.3);
        }
        
        .class-preview {
          flex-shrink: 0;
        }
        
        .sphere-preview {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid ${COLORS.STONE_GRAY};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          position: relative;
        }
        
        .sphere-preview::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 12px;
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          filter: blur(4px);
        }
        
        .weapon-icon {
          font-size: 20px;
          color: ${COLORS.GOLD};
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        .class-details {
          flex: 1;
        }
        
        .class-name {
          font-size: 16px;
          font-weight: bold;
          color: ${COLORS.TEXT_LIGHT};
          margin-bottom: 4px;
        }
        
        .class-weapon {
          font-size: 12px;
          color: ${COLORS.ORANGE};
          margin-bottom: 2px;
        }
        
        .class-special {
          font-size: 12px;
          color: ${COLORS.GOLD};
          margin-bottom: 4px;
          font-style: italic;
        }
        
        .class-stats {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: ${COLORS.TEXT_LIGHT};
          opacity: 0.8;
        }
        
        .class-stats span {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .selected-description {
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid ${COLORS.STONE_GRAY};
          border-radius: 6px;
        }
        
        .description-title {
          font-size: 12px;
          color: ${COLORS.GOLD};
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        
        .description-text {
          font-size: 13px;
          line-height: 1.4;
          color: ${COLORS.TEXT_LIGHT};
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}