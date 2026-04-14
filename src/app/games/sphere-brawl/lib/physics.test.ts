import { describe, it, expect } from 'vitest'
import type { Sphere, Team } from './types'
import {
  checkWeaponHit,
  checkWeaponClash,
  checkSphereCollision,
  resolveSphereCollision,
  applyWeaponKnockback,
  applyClashKnockback,
  projectileHitsSphere,
} from './physics'

// --- Helpers ---

function makeSphere(overrides: Partial<Sphere> & { team: Team }): Sphere {
  return {
    id: 0,
    classId: 'knight',
    position: { x: 100, y: 100 },
    velocity: { x: 0, y: 0 },
    mass: 1.4,
    radius: 18,
    hp: 100,
    maxHp: 100,
    contactDamage: 14,
    isAlive: true,
    color: '#5A6577',
    accentColor: '#8899AA',
    icon: '⚔',
    weaponAngle: 0,
    weaponSwingSpeed: 0.06,
    weaponType: 'sword',
    weaponLength: 48,
    baseWeaponLength: 48,
    abilityCooldown: 0,
    kickTimer: 3000,
    weaponHitCooldown: 0,
    clashCooldown: 0,
    superCharge: 0,
    superActive: false,
    superTimer: 0,
    damageFlash: 0,
    deathTimer: 0,
    ...overrides,
  }
}

// --- checkWeaponHit ---

describe('checkWeaponHit', () => {
  it('registers a hit when weapon reaches enemy body', () => {
    // Attacker at (50, 100) pointing right (angle=0), weapon extends from radius to radius+48
    // Target at (120, 100) with radius 18 — weapon tip at 50+18+48=116, target body at 102–138
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: 0 })
    const target = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, weaponAngle: Math.PI })
    // Target weapon points left (away from attacker), so no blocking
    expect(checkWeaponHit(attacker, target)).toBe(true)
  })

  it('does not hit when weapon points away from target', () => {
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: Math.PI }) // pointing left
    const target = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 } })
    expect(checkWeaponHit(attacker, target)).toBe(false)
  })

  it('does not hit allies', () => {
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: 0 })
    const target = makeSphere({ id: 2, team: 'red', position: { x: 120, y: 100 } })
    expect(checkWeaponHit(attacker, target)).toBe(false)
  })

  it('does not hit when attacker is on hit cooldown', () => {
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: 0, weaponHitCooldown: 300 })
    const target = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, weaponAngle: Math.PI })
    expect(checkWeaponHit(attacker, target)).toBe(false)
  })

  it('does not hit when target is out of range', () => {
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: 0 })
    const target = makeSphere({ id: 2, team: 'blue', position: { x: 250, y: 100 } })
    expect(checkWeaponHit(attacker, target)).toBe(false)
  })

  it('blocks hit when defender weapon crosses attacker weapon', () => {
    // Attacker pointing right, target pointing left — weapons cross in the middle
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: 0 })
    const target = makeSphere({
      id: 2, team: 'blue',
      position: { x: 120, y: 100 },
      weaponAngle: Math.PI, // pointing left toward attacker
    })
    // Both weapons point toward each other — they will intersect
    // But we need them close enough that the attacker's weapon reaches the body
    // AND the defender's weapon crosses the attacker's weapon

    // Closer positions so weapons definitely cross and reach body
    const a = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: 0.1 })
    const b = makeSphere({
      id: 2, team: 'blue',
      position: { x: 110, y: 100 },
      weaponAngle: Math.PI - 0.1, // pointing back toward attacker, slightly angled
    })
    // Attacker weapon tip: ~50 + 18 + 48 = 116, offset slightly up by sin(0.1)
    // Target body center at 110, radius 18 → body from 92 to 128
    // Attacker weapon reaches body ✓
    // Target weapon tip: ~110 - 18 - 48 = 44, slightly angled
    // The two weapons should cross somewhere around x=80
    expect(checkWeaponHit(a, b)).toBe(false) // blocked!
  })

  it('allows hit when defender weapon does NOT cross attacker weapon', () => {
    // Attacker pointing right, defender weapon pointing up (perpendicular, away)
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 }, weaponAngle: 0 })
    const target = makeSphere({
      id: 2, team: 'blue',
      position: { x: 110, y: 100 },
      weaponAngle: -Math.PI / 2, // pointing up, out of the way
    })
    expect(checkWeaponHit(attacker, target)).toBe(true)
  })
})

// --- checkWeaponClash ---

describe('checkWeaponClash', () => {
  it('detects clash when weapons cross', () => {
    // Two spheres facing each other, weapons crossing
    const a = makeSphere({ id: 1, team: 'red', position: { x: 60, y: 100 }, weaponAngle: 0.15 })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, weaponAngle: Math.PI - 0.15 })
    const clash = checkWeaponClash(a, b)
    expect(clash).not.toBeNull()
    // Clash point should be roughly between the two spheres
    expect(clash!.x).toBeGreaterThan(60)
    expect(clash!.x).toBeLessThan(120)
  })

  it('does not clash when weapons point away from each other', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 60, y: 100 }, weaponAngle: Math.PI }) // pointing left
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, weaponAngle: 0 }) // pointing right
    expect(checkWeaponClash(a, b)).toBeNull()
  })

  it('does not clash between allies', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 60, y: 100 }, weaponAngle: 0.15 })
    const b = makeSphere({ id: 2, team: 'red', position: { x: 120, y: 100 }, weaponAngle: Math.PI - 0.15 })
    expect(checkWeaponClash(a, b)).toBeNull()
  })

  it('does not clash when on clash cooldown', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 60, y: 100 }, weaponAngle: 0.15, clashCooldown: 100 })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, weaponAngle: Math.PI - 0.15 })
    expect(checkWeaponClash(a, b)).toBeNull()
  })

  it('DOES clash even when on hit cooldown (not clash cooldown)', () => {
    // This is the key fix — weaponHitCooldown should NOT prevent clash detection
    const a = makeSphere({ id: 1, team: 'red', position: { x: 60, y: 100 }, weaponAngle: 0.15, weaponHitCooldown: 400 })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, weaponAngle: Math.PI - 0.15 })
    expect(checkWeaponClash(a, b)).not.toBeNull()
  })

  it('detects proximity-based clash (near miss within threshold)', () => {
    // Weapons parallel but very close — should still clash via proximity
    const a = makeSphere({ id: 1, team: 'red', position: { x: 60, y: 100 }, weaponAngle: 0 })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 60, y: 104 }, weaponAngle: 0 })
    // Both point right from similar positions, ~4px apart (< CLASH_THRESHOLD of 6)
    expect(checkWeaponClash(a, b)).not.toBeNull()
  })
})

// --- checkSphereCollision ---

describe('checkSphereCollision', () => {
  it('detects overlapping spheres', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 } })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 130, y: 100 } }) // 30px apart, radii sum = 36
    expect(checkSphereCollision(a, b)).toBe(true)
  })

  it('does not detect distant spheres', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 } })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 200, y: 100 } })
    expect(checkSphereCollision(a, b)).toBe(false)
  })
})

// --- resolveSphereCollision ---

describe('resolveSphereCollision', () => {
  it('separates overlapping spheres and bounces velocities', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 }, velocity: { x: 2, y: 0 }, mass: 1 })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 130, y: 100 }, velocity: { x: -1, y: 0 }, mass: 1 })

    const particles = resolveSphereCollision(a, b)

    // After resolution, spheres should be separated
    const dist = Math.hypot(b.position.x - a.position.x, b.position.y - a.position.y)
    expect(dist).toBeGreaterThanOrEqual(a.radius + b.radius - 0.01)

    // Velocities should have changed direction (bounced)
    expect(a.velocity.x).toBeLessThan(2) // slowed down
    expect(b.velocity.x).toBeGreaterThan(-1) // reversed or slowed

    // Particles should be generated from impact
    expect(particles.length).toBeGreaterThan(0)
  })

  it('does nothing when spheres are moving apart', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 }, velocity: { x: -2, y: 0 } })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 130, y: 100 }, velocity: { x: 2, y: 0 } })

    const particles = resolveSphereCollision(a, b)
    // No velocity exchange when separating
    expect(particles.length).toBe(0)
  })
})

// --- applyWeaponKnockback ---

describe('applyWeaponKnockback', () => {
  it('pushes target away from attacker', () => {
    const attacker = makeSphere({ id: 1, team: 'red', position: { x: 50, y: 100 } })
    const target = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, velocity: { x: 0, y: 0 } })

    applyWeaponKnockback(attacker, target)

    expect(target.velocity.x).toBeGreaterThan(0) // pushed right (away from attacker)
    expect(Math.abs(target.velocity.y)).toBeLessThan(0.01) // minimal vertical
  })
})

// --- applyClashKnockback ---

describe('applyClashKnockback', () => {
  it('pushes both spheres apart', () => {
    const a = makeSphere({ id: 1, team: 'red', position: { x: 80, y: 100 }, velocity: { x: 0, y: 0 } })
    const b = makeSphere({ id: 2, team: 'blue', position: { x: 120, y: 100 }, velocity: { x: 0, y: 0 } })

    applyClashKnockback(a, b)

    expect(a.velocity.x).toBeLessThan(0) // pushed left
    expect(b.velocity.x).toBeGreaterThan(0) // pushed right
  })
})

// --- projectileHitsSphere ---

describe('projectileHitsSphere', () => {
  it('hits enemy sphere in range', () => {
    const sphere = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 } })
    const proj = { id: 99, position: { x: 105, y: 100 }, velocity: { x: 0, y: 0 }, radius: 3, damage: 10, team: 'blue' as Team, type: 'arrow' as const, life: 0, maxLife: 1800, color: '#3498DB' }
    expect(projectileHitsSphere(proj, sphere)).toBe(true)
  })

  it('does not hit allied sphere', () => {
    const sphere = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 } })
    const proj = { id: 99, position: { x: 105, y: 100 }, velocity: { x: 0, y: 0 }, radius: 3, damage: 10, team: 'red' as Team, type: 'arrow' as const, life: 0, maxLife: 1800, color: '#E74C3C' }
    expect(projectileHitsSphere(proj, sphere)).toBe(false)
  })

  it('does not hit dead sphere', () => {
    const sphere = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 }, isAlive: false })
    const proj = { id: 99, position: { x: 105, y: 100 }, velocity: { x: 0, y: 0 }, radius: 3, damage: 10, team: 'blue' as Team, type: 'arrow' as const, life: 0, maxLife: 1800, color: '#3498DB' }
    expect(projectileHitsSphere(proj, sphere)).toBe(false)
  })

  it('does not hit out-of-range sphere', () => {
    const sphere = makeSphere({ id: 1, team: 'red', position: { x: 100, y: 100 } })
    const proj = { id: 99, position: { x: 200, y: 200 }, velocity: { x: 0, y: 0 }, radius: 3, damage: 10, team: 'blue' as Team, type: 'arrow' as const, life: 0, maxLife: 1800, color: '#3498DB' }
    expect(projectileHitsSphere(proj, sphere)).toBe(false)
  })
})
