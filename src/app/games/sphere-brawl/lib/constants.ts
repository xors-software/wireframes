export const ARENA_W = 250
export const ARENA_H = 280
export const ARENA_MARGIN = 18
export const STATS_H = 55

export const GRAVITY = 0.015
export const FRICTION = 0.9997
export const WALL_RESTITUTION = 0.98
export const SPHERE_RESTITUTION = 0.65
export const MAX_VELOCITY = 7

// Gentle nudges to keep energy up — not sudden launches
export const KICK_MIN_MS = 3000
export const KICK_MAX_MS = 6000
export const KICK_FORCE = 0.8

// Weapon damage (only weapons deal damage, not body collisions)
export const WEAPON_HIT_COOLDOWN_MS = 600

// Superpower — charges per hit, activates when full
export const SUPER_CHARGE_MAX = 100
export const SUPER_CHARGE_PER_HIT = 25
export const SUPER_DURATION_MS = 4000
export const WEAPON_BASE_SWING = 0.06
export const HIT_FLASH_MS = 100
export const DEATH_ANIM_MS = 400
export const SHAKE_DECAY = 0.88

export const TEAM_COLORS = {
  red: { ring: '#E74C3C', glow: 'rgba(231,76,60,0.25)' },
  blue: { ring: '#3498DB', glow: 'rgba(52,152,219,0.25)' },
} as const

export const MAX_PER_CLASS = 20
export const MAX_TOTAL = 100
