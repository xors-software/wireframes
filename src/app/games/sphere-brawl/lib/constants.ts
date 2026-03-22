// =============================================================================
// GAME CONSTANTS
// =============================================================================

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const ARENA_PADDING = 40;
export const SPHERE_RADIUS = 25;
export const INITIAL_HP = 100;

// =============================================================================
// PHYSICS CONSTANTS
// =============================================================================

export const GRAVITY = 0.3;
export const BOUNCE_DAMPING = 0.8;
export const FRICTION = 0.98;
export const COLLISION_DAMPING = 0.9;

// =============================================================================
// COLOR SCHEME - MEDIEVAL THEME
// =============================================================================

export const COLORS = {
  // Arena colors
  ARENA_BG: '#2d1810',
  ARENA_BORDER: '#5d4e37',
  ARENA_ACCENT: '#8b7355',
  
  // UI colors
  STONE_GRAY: '#6b6b6b',
  DARK_BROWN: '#3e2723',
  GOLD: '#ffb300',
  ORANGE: '#ff8f00',
  
  // Class colors
  REAPER: '#2c1810',
  BLACKSMITH: '#d84315',
  
  // Text colors
  TEXT_LIGHT: '#f5f5dc',
  TEXT_DARK: '#2d1810',
} as const;

// =============================================================================
// ANIMATION CONSTANTS
// =============================================================================

export const ANIMATION_SPEED = 0.016; // 60fps
export const DAMAGE_FLASH_DURATION = 200;
export const SPECIAL_COOLDOWN = 3000; // 3 seconds