export interface Vector2 {
  x: number
  y: number
}

export type Team = 'red' | 'blue'

export interface UnitClassDef {
  id: string
  name: string
  icon: string
  mass: number
  hp: number
  contactDamage: number
  baseSpeed: number
  radius: number
  color: string
  accentColor: string
  weaponType: 'sword' | 'bow' | 'axe' | 'staff' | 'shield' | 'lance'
  weaponLength: number
  ability: {
    type: 'none' | 'projectile' | 'area_blast' | 'heal_aura'
    cooldownMs: number
    range: number
    damage: number
    projectileSpeed?: number
    projectileRadius?: number
    blastRadius?: number
    healAmount?: number
  }
}

export interface Sphere {
  id: number
  classId: string
  team: Team
  position: Vector2
  velocity: Vector2
  mass: number
  radius: number
  hp: number
  maxHp: number
  contactDamage: number
  isAlive: boolean
  color: string
  accentColor: string
  icon: string
  weaponAngle: number
  weaponSwingSpeed: number
  weaponType: string
  weaponLength: number
  abilityCooldown: number
  kickTimer: number
  weaponHitCooldown: number
  superCharge: number
  superActive: boolean
  superTimer: number
  baseWeaponLength: number
  damageFlash: number
  deathTimer: number
}

export interface Projectile {
  id: number
  position: Vector2
  velocity: Vector2
  radius: number
  damage: number
  team: Team
  type: 'arrow' | 'fireball'
  life: number
  maxLife: number
  color: string
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  life: number
  maxLife: number
}

export interface Splatter {
  x: number
  y: number
  radius: number
  color: string
  blobs: { ox: number; oy: number; r: number }[]
}

export interface BattleConfig {
  red: Record<string, number>
  blue: Record<string, number>
}

export interface BattleStats {
  winner: Team | 'draw'
  redRemaining: number
  blueRemaining: number
  totalKnockouts: number
  battleDurationMs: number
}

export type GamePhase = 'setup' | 'battle' | 'victory'

export interface Preset {
  name: string
  red: Record<string, number>
  blue: Record<string, number>
}
