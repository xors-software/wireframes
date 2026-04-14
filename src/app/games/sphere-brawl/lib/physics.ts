import type { Sphere, Projectile, Particle, Vector2 } from './types'
import * as C from './constants'

export function dist(a: Vector2, b: Vector2): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

export function randomKick(s: Sphere, dt: number) {
  s.kickTimer -= dt
  if (s.kickTimer <= 0) {
    const angle = Math.random() * Math.PI * 2
    s.velocity.x += Math.cos(angle) * C.KICK_FORCE
    s.velocity.y += Math.sin(angle) * C.KICK_FORCE
    s.kickTimer = C.KICK_MIN_MS + Math.random() * (C.KICK_MAX_MS - C.KICK_MIN_MS)
  }
}

export function applyPhysics(s: Sphere, ts: number) {
  s.velocity.y += C.GRAVITY * ts
  s.velocity.x *= C.FRICTION
  s.velocity.y *= C.FRICTION

  const speed = Math.hypot(s.velocity.x, s.velocity.y)
  if (speed > C.MAX_VELOCITY) {
    s.velocity.x = (s.velocity.x / speed) * C.MAX_VELOCITY
    s.velocity.y = (s.velocity.y / speed) * C.MAX_VELOCITY
  }

  s.position.x += s.velocity.x * ts
  s.position.y += s.velocity.y * ts
}

export function wallBounce(s: Sphere): Particle[] {
  const particles: Particle[] = []
  const minX = C.ARENA_MARGIN + s.radius
  const maxX = C.ARENA_W - C.ARENA_MARGIN - s.radius
  const minY = C.ARENA_MARGIN + s.radius
  const maxY = C.ARENA_H - C.ARENA_MARGIN - s.radius
  const r = C.WALL_RESTITUTION

  if (s.position.x < minX) {
    s.position.x = minX
    s.velocity.x = Math.abs(s.velocity.x) * r
    if (Math.abs(s.velocity.x) > 1) particles.push(...dustAt(minX, s.position.y))
  } else if (s.position.x > maxX) {
    s.position.x = maxX
    s.velocity.x = -Math.abs(s.velocity.x) * r
    if (Math.abs(s.velocity.x) > 1) particles.push(...dustAt(maxX, s.position.y))
  }
  if (s.position.y < minY) {
    s.position.y = minY
    s.velocity.y = Math.abs(s.velocity.y) * r
    if (Math.abs(s.velocity.y) > 1) particles.push(...dustAt(s.position.x, minY))
  } else   if (s.position.y > maxY) {
    s.position.y = maxY
    s.velocity.y = -Math.abs(s.velocity.y) * r
    // Ping-pong floor: if bounce is too weak, give a minimum upward kick
    if (Math.abs(s.velocity.y) < 1.5) s.velocity.y = -1.5 - Math.random() * 1.5
    if (Math.abs(s.velocity.y) > 1) particles.push(...dustAt(s.position.x, maxY))
  }
  return particles
}

function dustAt(x: number, y: number): Particle[] {
  const out: Particle[] = []
  for (let i = 0; i < 3; i++) {
    const a = Math.random() * Math.PI * 2
    out.push({
      x, y,
      vx: Math.cos(a) * (0.5 + Math.random() * 1.5),
      vy: Math.sin(a) * (0.5 + Math.random() * 1.5),
      radius: 1 + Math.random(),
      color: '#8B7D6B', alpha: 0.5,
      life: 0, maxLife: 180 + Math.random() * 120,
    })
  }
  return out
}

// --- Sphere-sphere collision: bounce only, NO damage ---

export function checkSphereCollision(a: Sphere, b: Sphere): boolean {
  return dist(a.position, b.position) < a.radius + b.radius
}

export function resolveSphereCollision(a: Sphere, b: Sphere): Particle[] {
  const dx = b.position.x - a.position.x
  const dy = b.position.y - a.position.y
  const d = Math.hypot(dx, dy)
  if (d === 0) return []

  const nx = dx / d, ny = dy / d

  // Separate overlap
  const overlap = (a.radius + b.radius) - d
  if (overlap > 0) {
    a.position.x -= nx * overlap * 0.5
    a.position.y -= ny * overlap * 0.5
    b.position.x += nx * overlap * 0.5
    b.position.y += ny * overlap * 0.5
  }

  const dvx = a.velocity.x - b.velocity.x
  const dvy = a.velocity.y - b.velocity.y
  const dvn = dvx * nx + dvy * ny
  if (dvn <= 0) return []

  // Standard elastic collision — restitution < 1 so energy is lost, not gained
  const j = -(1 + C.SPHERE_RESTITUTION) * dvn / (1 / a.mass + 1 / b.mass)
  a.velocity.x += (j / a.mass) * nx
  a.velocity.y += (j / a.mass) * ny
  b.velocity.x -= (j / b.mass) * nx
  b.velocity.y -= (j / b.mass) * ny

  // Bounce spark particles
  const cx = a.position.x + nx * a.radius
  const cy = a.position.y + ny * a.radius
  const impactForce = Math.abs(dvn)
  const particles: Particle[] = []
  const n = Math.min(6, Math.floor(impactForce * 1.2))
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2
    const sp = 0.5 + Math.random() * impactForce * 0.3
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
      radius: 1 + Math.random(), color: '#888',
      alpha: 0.8, life: 0, maxLife: 150 + Math.random() * 100,
    })
  }
  return particles
}

// --- Weapon hit detection: full blade vs sphere (line-circle test) ---

function weaponSegment(s: Sphere): [number, number, number, number] {
  const cos = Math.cos(s.weaponAngle)
  const sin = Math.sin(s.weaponAngle)
  return [
    s.position.x + cos * s.radius,
    s.position.y + sin * s.radius,
    s.position.x + cos * (s.radius + s.weaponLength),
    s.position.y + sin * (s.radius + s.weaponLength),
  ]
}

// --- Analytical segment-segment intersection (exact, no sampling) ---

function segmentIntersection(
  ax1: number, ay1: number, ax2: number, ay2: number,
  bx1: number, by1: number, bx2: number, by2: number,
): { x: number; y: number } | null {
  const d1x = ax2 - ax1, d1y = ay2 - ay1
  const d2x = bx2 - bx1, d2y = by2 - by1
  const cross = d1x * d2y - d1y * d2x
  if (Math.abs(cross) < 1e-10) return null // parallel
  const dx = bx1 - ax1, dy = by1 - ay1
  const t = (dx * d2y - dy * d2x) / cross
  const u = (dx * d1y - dy * d1x) / cross
  if (t < 0 || t > 1 || u < 0 || u > 1) return null
  return { x: ax1 + t * d1x, y: ay1 + t * d1y }
}

function segmentCircleHit(
  x1: number, y1: number, x2: number, y2: number,
  cx: number, cy: number, cr: number,
): boolean {
  const dx = x2 - x1, dy = y2 - y1
  const fx = x1 - cx, fy = y1 - cy
  const a = dx * dx + dy * dy
  if (a < 0.001) return Math.hypot(fx, fy) < cr
  const b = 2 * (fx * dx + fy * dy)
  const c = fx * fx + fy * fy - cr * cr
  let disc = b * b - 4 * a * c
  if (disc < 0) return false
  disc = Math.sqrt(disc)
  const t1 = (-b - disc) / (2 * a)
  const t2 = (-b + disc) / (2 * a)
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1) || (t1 < 0 && t2 > 1)
}

export function checkWeaponHit(attacker: Sphere, target: Sphere): boolean {
  if (attacker.team === target.team) return false
  if (attacker.weaponHitCooldown > 0) return false

  const aSeg = weaponSegment(attacker)
  if (!segmentCircleHit(...aSeg, target.position.x, target.position.y, target.radius)) {
    return false
  }

  // Weapon blocking: if defender's weapon crosses attacker's weapon, the hit is parried
  const bSeg = weaponSegment(target)
  if (segmentIntersection(...aSeg, ...bSeg)) {
    return false
  }

  return true
}

// --- Weapon-weapon clash: minimum distance between segments ---

function closestPointOnSegment(
  px: number, py: number,
  ax: number, ay: number, bx: number, by: number,
): [number, number] {
  const dx = bx - ax, dy = by - ay
  const len2 = dx * dx + dy * dy
  if (len2 < 0.001) return [ax, ay]
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2))
  return [ax + t * dx, ay + t * dy]
}

function segmentSegmentDist(
  ax1: number, ay1: number, ax2: number, ay2: number,
  bx1: number, by1: number, bx2: number, by2: number,
): [number, number, number] {
  let bestD = Infinity, bestX = 0, bestY = 0

  const samples = 5
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const px = ax1 + (ax2 - ax1) * t
    const py = ay1 + (ay2 - ay1) * t
    const [cx, cy] = closestPointOnSegment(px, py, bx1, by1, bx2, by2)
    const d = Math.hypot(px - cx, py - cy)
    if (d < bestD) { bestD = d; bestX = (px + cx) / 2; bestY = (py + cy) / 2 }
  }
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const px = bx1 + (bx2 - bx1) * t
    const py = by1 + (by2 - by1) * t
    const [cx, cy] = closestPointOnSegment(px, py, ax1, ay1, ax2, ay2)
    const d = Math.hypot(px - cx, py - cy)
    if (d < bestD) { bestD = d; bestX = (px + cx) / 2; bestY = (py + cy) / 2 }
  }

  return [bestD, bestX, bestY]
}

const CLASH_THRESHOLD = 6

export function checkWeaponClash(a: Sphere, b: Sphere): { x: number; y: number } | null {
  if (a.team === b.team) return null
  if (a.clashCooldown > 0 || b.clashCooldown > 0) return null

  const [ax1, ay1, ax2, ay2] = weaponSegment(a)
  const [bx1, by1, bx2, by2] = weaponSegment(b)

  // Analytical intersection — catches crossing weapons exactly
  const hit = segmentIntersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2)
  if (hit) return hit

  // Proximity fallback — catches near-misses for visual weapon width
  const [d, cx, cy] = segmentSegmentDist(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2)
  if (d < CLASH_THRESHOLD) {
    return { x: cx, y: cy }
  }
  return null
}

export function applyWeaponKnockback(attacker: Sphere, target: Sphere) {
  const dx = target.position.x - attacker.position.x
  const dy = target.position.y - attacker.position.y
  const d = Math.hypot(dx, dy) || 1
  const force = 5 + attacker.mass * 2
  target.velocity.x += (dx / d) * force
  target.velocity.y += (dy / d) * force
}

export function applyClashKnockback(a: Sphere, b: Sphere) {
  const dx = b.position.x - a.position.x
  const dy = b.position.y - a.position.y
  const d = Math.hypot(dx, dy) || 1
  const force = 4.5
  a.velocity.x -= (dx / d) * force
  a.velocity.y -= (dy / d) * force
  b.velocity.x += (dx / d) * force
  b.velocity.y += (dy / d) * force
}

export function weaponHitParticles(attacker: Sphere, target: Sphere): Particle[] {
  const tipX = attacker.position.x + Math.cos(attacker.weaponAngle) * (attacker.radius + attacker.weaponLength)
  const tipY = attacker.position.y + Math.sin(attacker.weaponAngle) * (attacker.radius + attacker.weaponLength)
  const out: Particle[] = []
  for (let i = 0; i < 6; i++) {
    const a = Math.random() * Math.PI * 2
    const sp = 1 + Math.random() * 2
    out.push({
      x: tipX, y: tipY,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      radius: 1 + Math.random() * 1.5, color: '#FFD700',
      alpha: 1, life: 0, maxLife: 200 + Math.random() * 150,
    })
  }
  return out
}

// --- Projectiles ---

export function updateProjectile(p: Projectile, dt: number) {
  const ts = dt / (1000 / 60)
  p.velocity.y += C.GRAVITY * 0.5 * ts
  p.position.x += p.velocity.x * ts
  p.position.y += p.velocity.y * ts
  p.life += dt
}

export function projectileHitsSphere(p: Projectile, s: Sphere): boolean {
  return s.isAlive && s.team !== p.team && dist(p.position, s.position) < p.radius + s.radius
}

// --- Death & particles ---

export function createDeathParticles(s: Sphere): Particle[] {
  const out: Particle[] = []
  for (let i = 0; i < 14; i++) {
    const a = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4
    const sp = 1.5 + Math.random() * 3
    out.push({
      x: s.position.x, y: s.position.y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      radius: 2 + Math.random() * 3, color: s.color,
      alpha: 1, life: 0, maxLife: 400 + Math.random() * 400,
    })
  }
  return out
}

export function updateParticles(particles: Particle[], dt: number): Particle[] {
  const ts = dt / 16
  return particles.filter(p => {
    p.life += dt
    if (p.life >= p.maxLife) return false
    p.vy += C.GRAVITY * 0.25 * ts
    p.x += p.vx * ts
    p.y += p.vy * ts
    p.vx *= 0.96
    p.vy *= 0.96
    p.alpha = 1 - p.life / p.maxLife
    return true
  })
}
