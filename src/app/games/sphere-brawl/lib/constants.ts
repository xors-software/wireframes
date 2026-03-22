// =============================================================================
// GAME CONSTANTS
// =============================================================================

export const ARENA_WIDTH = 800;
export const ARENA_HEIGHT = 500;
export const SPHERE_RADIUS = 30;
export const BORDER_WIDTH = 20;

// =============================================================================
// PHYSICS CONSTANTS
// =============================================================================

export const GRAVITY = 0.5;
export const FRICTION = 0.98;
export const BOUNCE_DAMPING = 0.8;
export const COLLISION_DAMAGE = 10;
export const MOVEMENT_SPEED = 3;

// =============================================================================
// GAME SETTINGS
// =============================================================================

export const GAME_DURATION = 60000; // 60 seconds
export const TICK_RATE = 16; // ~60 FPS

// =============================================================================
// MEDIEVAL COLOR SCHEME
// =============================================================================

export const COLORS = {
  // Arena
  ARENA_BG: '#2a1810',
  STONE_BORDER: '#5a5a5a',
  STONE_HIGHLIGHT: '#7a7a7a',
  
  // Classes
  REAPER: {
    PRIMARY: '#1a0d0d',
    SECONDARY: '#4a1a1a',
    ACCENT: '#8B0000',
    TEXT: '#ffffff'
  },
  BLACKSMITH: {
    PRIMARY: '#8B4513',
    SECONDARY: '#CD853F',
    ACCENT: '#FFD700',
    TEXT: '#000000'
  },
  
  // UI
  GOLD: '#FFD700',
  STONE_TEXT: '#d4c5b0',
  DARK_STONE: '#3a3a3a'
} as const;

// =============================================================================
// CLASS DEFINITIONS
// =============================================================================

export const CLASSES = {
  REAPER: {
    name: 'Reaper',
    maxHP: 100,
    damage: 20,
    specialAbility: 'Lifesteal',
    description: 'Dark sphere with scythe. Heals when dealing damage.',
    colors: COLORS.REAPER
  },
  BLACKSMITH: {
    name: 'Blacksmith', 
    maxHP: 120,
    damage: 30,
    specialAbility: 'Heavy Strike',
    description: 'Orange sphere with hammer. High damage attacks.',
    colors: COLORS.BLACKSMITH
  }
} as const;

export type ClassName = keyof typeof CLASSES;