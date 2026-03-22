// =============================================================================
// SPHERE BRAWL TYPES
// =============================================================================

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface SphereClass {
  name: 'Reaper' | 'Blacksmith';
  color: string;
  weapon: string;
  specialAbility: string;
  baseDamage: number;
  specialDamage: number;
  description: string;
}

export interface Sphere {
  id: string;
  position: Position;
  velocity: Velocity;
  hp: number;
  maxHp: number;
  radius: number;
  class: SphereClass;
  lastDamageTime: number;
  lastSpecialTime: number;
  isFlashing: boolean;
}

export interface GameState {
  spheres: [Sphere, Sphere];
  isRunning: boolean;
  winner: string | null;
  gameStartTime: number;
  lastUpdateTime: number;
}

export interface ArenaProps {
  width: number;
  height: number;
  spheres: Sphere[];
  onSphereCollision: (sphere1: Sphere, sphere2: Sphere) => void;
}

export interface StatBarProps {
  sphere: Sphere;
  position: 'left' | 'right';
}

export interface ClassSelectorProps {
  selectedClass: SphereClass;
  onClassSelect: (sphereClass: SphereClass) => void;
  position: 'left' | 'right';
  disabled?: boolean;
}