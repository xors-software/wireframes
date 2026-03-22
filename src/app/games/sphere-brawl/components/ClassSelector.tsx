"use client";

import { CLASSES, COLORS } from '../lib/constants';
import { ClassName } from '../lib/types';

interface ClassSelectorProps {
  selectedClass: ClassName;
  onClassSelect: (className: ClassName) => void;
  disabled?: boolean;
}

export function ClassSelector({ selectedClass, onClassSelect, disabled = false }: ClassSelectorProps) {
  return (
    <div className="class-selector">
      <h3 className="selector-title">Choose Your Class</h3>
      <div className="class-options">
        {(Object.keys(CLASSES) as ClassName[]).map(className => {
          const classData = CLASSES[className];
          const isSelected = selectedClass === className;
          
          return (
            <button
              key={className}
              className={`class-option ${isSelected ? 'selected' : ''}`}
              onClick={() => !disabled && onClassSelect(className)}
              disabled={disabled}
              style={{
                borderColor: classData.colors.ACCENT,
                backgroundColor: isSelected ? classData.colors.PRIMARY : 'transparent'
              }}
            >
              <div className="class-preview">
                <div 
                  className="class-sphere"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${classData.colors.SECONDARY}, ${classData.colors.PRIMARY})`,
                    border: `2px solid ${classData.colors.ACCENT}`
                  }}
                >
                  <span className="class-symbol">
                    {className === 'REAPER' ? '⚰' : '🔨'}
                  </span>
                </div>
              </div>
              <div className="class-info">
                <h4 className="class-name" style={{ color: classData.colors.ACCENT }}>
                  {classData.name}
                </h4>
                <p className="class-description">{classData.description}</p>
                <div className="class-stats">
                  <div className="stat">
                    <span className="stat-label">HP:</span>
                    <span className="stat-value">{classData.maxHP}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">DMG:</span>
                    <span className="stat-value">{classData.damage}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        .class-selector {
          background: rgba(42, 24, 16, 0.9);
          border: 2px solid ${COLORS.GOLD};
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
          font-family: 'Times New Roman', serif;
        }
        
        .selector-title {
          color: ${COLORS.GOLD};
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 0 0 20px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }
        
        .class-options {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .class-option {
          background: transparent;
          border: 3px solid;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .class-option:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(255, 215, 0, 0.3);
        }
        
        .class-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .class-option.selected {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        
        .class-preview {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        
        .class-sphere {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          position: relative;
        }
        
        .class-symbol {
          filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.8));
        }
        
        .class-info {
          text-align: center;
        }
        
        .class-name {
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 8px 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
        
        .class-description {
          color: ${COLORS.STONE_TEXT};
          font-size: 14px;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }
        
        .class-stats {
          display: flex;
          justify-content: space-around;
          gap: 16px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .stat-label {
          color: ${COLORS.STONE_TEXT};
          font-size: 12px;
          font-weight: bold;
        }
        
        .stat-value {
          color: ${COLORS.GOLD};
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}