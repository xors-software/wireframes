// =============================================================================
// GAME TYPES
// =============================================================================

export interface Vector2 {
  x: number;
  y: number;
}

export interface Sphere {
  id: string;
  position: Vector2;
  velocity: Vector2;
  radius: number;
  hp: number;
  maxHP: number;
  className: ClassName;
  lastDamageTime: number;
}

export interface GameState {
  spheres: Sphere[];
  gameTime: number;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: string | null;
  lastUpdate: number;
}

export interface ClassStats {
  name: string;
  maxHP: number;
  damage: number;
  specialAbility: string;
  description: string;
  colors: {
    PRIMARY: string;
    SECONDARY: string;
    ACCENT: string;
    TEXT: string;
  };
}

export type ClassName = 'REAPER' | 'BLACKSMITH';

export type GamePhase = 'setup' | 'playing' | 'finished';