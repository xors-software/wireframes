"use client"

import { useEffect, useRef } from 'react'
import type { Sphere, Projectile, Particle, Splatter, BattleConfig, BattleStats, Team } from '../lib/types'
import { UNIT_CLASSES } from '../lib/classes'
import * as C from '../lib/constants'
import {
  dist, randomKick, applyPhysics, wallBounce,
  checkSphereCollision, resolveSphereCollision,
  checkWeaponHit, checkWeaponClash, applyWeaponKnockback, applyClashKnockback, weaponHitParticles,
  updateProjectile, projectileHitsSphere,
  updateParticles,
} from '../lib/physics'
import {
  drawArena, drawSplatters, drawSphere, drawProjectile, drawParticles,
  drawHUD, drawBlastRing, drawFightText, drawStatsPanel,
} from '../lib/renderer'

interface Props {
  config: BattleConfig
  onVictory: (stats: BattleStats) => void
}

interface BlastEffect {
  x: number; y: number; radius: number; progress: number; color: string
}

let nextId = 0
function spawnSphere(classId: string, team: Team, x: number, y: number): Sphere {
  const cls = UNIT_CLASSES.find(c => c.id === classId)!
  const angle = Math.random() * Math.PI * 2
  return {
    id: nextId++,
    classId: cls.id, team,
    position: { x, y },
    velocity: {
      x: Math.cos(angle) * cls.baseSpeed,
      y: Math.sin(angle) * cls.baseSpeed,
    },
    mass: cls.mass, radius: cls.radius,
    hp: cls.hp, maxHp: cls.hp,
    contactDamage: cls.contactDamage,
    isAlive: true,
    color: cls.color, accentColor: cls.accentColor, icon: cls.icon,
    weaponAngle: Math.random() * Math.PI * 2,
    weaponSwingSpeed: C.WEAPON_BASE_SWING * (1 + cls.baseSpeed / 5),
    weaponType: cls.weaponType,
    weaponLength: cls.weaponLength,
    baseWeaponLength: cls.weaponLength,
    abilityCooldown: cls.ability.cooldownMs * (0.3 + Math.random() * 0.7),
    kickTimer: 1000 + Math.random() * 2000,
    weaponHitCooldown: 0,
    clashCooldown: 0,
    superCharge: 0,
    superActive: false,
    superTimer: 0,
    damageFlash: 0, deathTimer: 0,
  }
}

function spawnTeam(team: Team, counts: Record<string, number>): Sphere[] {
  const spheres: Sphere[] = []
  const isRed = team === 'red'
  const xMin = isRed ? C.ARENA_MARGIN + 25 : C.ARENA_W / 2 + 10
  const xMax = isRed ? C.ARENA_W / 2 - 10 : C.ARENA_W - C.ARENA_MARGIN - 25
  const yMin = C.ARENA_MARGIN + 25
  const yMax = C.ARENA_H - C.ARENA_MARGIN - 25

  for (const [classId, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i++) {
      let x: number, y: number, tries = 0
      do {
        x = xMin + Math.random() * (xMax - xMin)
        y = yMin + Math.random() * (yMax - yMin)
        tries++
      } while (
        tries < 40 &&
        spheres.some(s => Math.hypot(s.position.x - x, s.position.y - y) < s.radius + 24)
      )
      spheres.push(spawnSphere(classId, team, x, y))
    }
  }
  return spheres
}

export function BattleArena({ config, onVictory }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onVictoryRef = useRef(onVictory)
  onVictoryRef.current = onVictory

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = C.ARENA_W * dpr
    canvas.height = (C.ARENA_H + C.STATS_H) * dpr
    const ctx = canvas.getContext('2d')!

    nextId = 0
    const spheres = [...spawnTeam('red', config.red), ...spawnTeam('blue', config.blue)]
    const totalRed = spheres.filter(s => s.team === 'red').length
    const totalBlue = spheres.filter(s => s.team === 'blue').length

    let projectiles: Projectile[] = []
    let particles: Particle[] = []
    let splatters: Splatter[] = []
    let blasts: BlastEffect[] = []
    let shakeX = 0, shakeY = 0
    let elapsed = 0
    let fightTextProgress = 0
    let gameOver = false
    let lastTime = 0
    let rafId = 0
    let hitSlow = 0

    function update(rawDt: number) {
      // Hit-freeze: slow time briefly on weapon hits for impact feel
      if (hitSlow > 0) hitSlow -= rawDt
      const timeScale = hitSlow > 0 ? 0.15 : 1
      const dt = rawDt * timeScale

      elapsed += dt
      fightTextProgress = Math.min(1, elapsed / 1500)
      const ts = dt / (1000 / 60)

      const alive = spheres.filter(s => s.isAlive)

      for (const s of alive) {
        s.weaponAngle += s.weaponSwingSpeed * ts

        randomKick(s, dt)
        applyPhysics(s, ts)
        particles.push(...wallBounce(s))

        // Weapon cooldowns
        if (s.weaponHitCooldown > 0) s.weaponHitCooldown -= dt
        if (s.clashCooldown > 0) s.clashCooldown -= dt

        // Superpower activation & duration
        if (!s.superActive && s.superCharge >= C.SUPER_CHARGE_MAX) {
          s.superActive = true
          s.superTimer = C.SUPER_DURATION_MS
          // Apply per-class activation effects
          if (s.classId === 'knight') {
            s.weaponLength = s.baseWeaponLength * 2
          } else if (s.classId === 'archer') {
            // rapid fire handled via cooldown override below
          } else if (s.classId === 'viking') {
            s.weaponSwingSpeed = (Math.abs(s.weaponSwingSpeed) * 2.5) * Math.sign(s.weaponSwingSpeed)
          } else if (s.classId === 'paladin') {
            // divine shield — heal to full on activation
            s.hp = s.maxHp
          } else if (s.classId === 'cavalry') {
            // stampede — speed boost applied via physics
          }
        }
        if (s.superActive) {
          s.superTimer -= dt
          // Per-frame super effects
          if (s.classId === 'cavalry') {
            const speed = Math.hypot(s.velocity.x, s.velocity.y)
            if (speed > 0 && speed < C.MAX_VELOCITY * 1.5) {
              s.velocity.x *= 1.02
              s.velocity.y *= 1.02
            }
          }
          if (s.superTimer <= 0) {
            s.superActive = false
            s.superCharge = 0
            // Reset per-class effects
            if (s.classId === 'knight') {
              s.weaponLength = s.baseWeaponLength
            } else if (s.classId === 'viking') {
              const cls = UNIT_CLASSES.find(c => c.id === 'viking')!
              s.weaponSwingSpeed = C.WEAPON_BASE_SWING * (1 + cls.baseSpeed / 5) * Math.sign(s.weaponSwingSpeed)
            }
          }
        }

        // Ranged/area abilities
        if (s.abilityCooldown > 0) {
          s.abilityCooldown -= dt
        } else {
          const cls = UNIT_CLASSES.find(c => c.id === s.classId)!
          if (cls.ability.type !== 'none') {
            const ab = cls.ability

            if (ab.type === 'projectile') {
              const target = findNearestEnemy(s, alive)
              if (target && dist(s.position, target.position) < ab.range) {
                const dx = target.position.x - s.position.x
                const dy = target.position.y - s.position.y
                const d = Math.hypot(dx, dy) || 1
                const spd = ab.projectileSpeed || 6
                projectiles.push({
                  id: nextId++,
                  position: { x: s.position.x, y: s.position.y },
                  velocity: { x: (dx / d) * spd, y: (dy / d) * spd },
                  radius: ab.projectileRadius || 3,
                  damage: ab.damage, team: s.team,
                  type: 'arrow', life: 0, maxLife: 1800,
                  color: s.team === 'red' ? '#E74C3C' : '#3498DB',
                })
                s.abilityCooldown = (s.superActive && s.classId === 'archer')
                  ? ab.cooldownMs * 0.3 : ab.cooldownMs
              }
            } else if (ab.type === 'area_blast') {
              const hasEnemy = alive.some(
                o => o.team !== s.team && dist(s.position, o.position) < (ab.blastRadius || 90),
              )
              if (hasEnemy) {
                const r = ab.blastRadius || 90
                blasts.push({ x: s.position.x, y: s.position.y, radius: r, progress: 0, color: s.accentColor })
                for (const o of alive) {
                  if (o.team === s.team || !o.isAlive) continue
                  const d = dist(s.position, o.position)
                  if (d < r) {
                    const force = ((r - d) / r) * 5
                    const dx = o.position.x - s.position.x
                    const dy = o.position.y - s.position.y
                    const nd = Math.hypot(dx, dy) || 1
                    o.velocity.x += (dx / nd) * force
                    o.velocity.y += (dy / nd) * force
                    o.hp -= ab.damage
                    o.damageFlash = C.HIT_FLASH_MS
                  }
                }
                s.abilityCooldown = (s.superActive && s.classId === 'viking')
                  ? ab.cooldownMs * 0.3 : ab.cooldownMs
              }
            } else if (ab.type === 'heal_aura') {
              const hasAlly = alive.some(
                o => o.team === s.team && o.id !== s.id && o.hp < o.maxHp &&
                  dist(s.position, o.position) < (ab.blastRadius || 70),
              )
              if (hasAlly) {
                const r = ab.blastRadius || 70
                blasts.push({ x: s.position.x, y: s.position.y, radius: r, progress: 0, color: '#FFD700' })
                for (const o of alive) {
                  if (o.team !== s.team || !o.isAlive) continue
                  if (dist(s.position, o.position) < r) {
                    o.hp = Math.min(o.maxHp, o.hp + (ab.healAmount || 18))
                  }
                }
                s.abilityCooldown = ab.cooldownMs
              }
            }
          }
        }

        if (s.damageFlash > 0) s.damageFlash -= dt
      }

      // Sphere-sphere collisions — bounce only, NO damage
      for (let i = 0; i < alive.length; i++) {
        for (let j = i + 1; j < alive.length; j++) {
          if (!checkSphereCollision(alive[i], alive[j])) continue
          const p = resolveSphereCollision(alive[i], alive[j])
          particles.push(...p)
        }
      }

      // Weapon-weapon clashes — analytical intersection + proximity
      for (let i = 0; i < alive.length; i++) {
        for (let j = i + 1; j < alive.length; j++) {
          const clash = checkWeaponClash(alive[i], alive[j])
          if (clash) {
            // Always reverse spin to prevent phasing
            alive[i].weaponSwingSpeed = -alive[i].weaponSwingSpeed
            alive[j].weaponSwingSpeed = -alive[j].weaponSwingSpeed
            alive[i].clashCooldown = C.CLASH_COOLDOWN_MS
            alive[j].clashCooldown = C.CLASH_COOLDOWN_MS

            // Full effects (knockback, particles, shake) only when not on hit cooldown
            if (alive[i].weaponHitCooldown <= 0 && alive[j].weaponHitCooldown <= 0) {
              alive[i].weaponHitCooldown = 200
              alive[j].weaponHitCooldown = 200
              applyClashKnockback(alive[i], alive[j])
              for (let k = 0; k < 8; k++) {
                const a = Math.random() * Math.PI * 2
                const sp = 1 + Math.random() * 3
                particles.push({
                  x: clash.x, y: clash.y,
                  vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                  radius: 1 + Math.random() * 1.5, color: '#FFF',
                  alpha: 1, life: 0, maxLife: 120 + Math.random() * 80,
                })
              }
              shakeX += (Math.random() - 0.5) * 2
              shakeY += (Math.random() - 0.5) * 2
              hitSlow = 50
            }
          }
        }
      }

      // Weapon hits — the ONLY melee damage source
      for (const attacker of alive) {
        for (const target of alive) {
          if (attacker.id === target.id) continue
          if (checkWeaponHit(attacker, target)) {
            const dmg = attacker.superActive && attacker.classId === 'cavalry'
              ? attacker.contactDamage * 2 : attacker.contactDamage
            target.hp -= dmg
            target.damageFlash = C.HIT_FLASH_MS
            attacker.weaponHitCooldown = C.WEAPON_HIT_COOLDOWN_MS
            attacker.weaponSwingSpeed = -attacker.weaponSwingSpeed
            applyWeaponKnockback(attacker, target)
            // Charge super (not while super is active)
            if (!attacker.superActive) {
              attacker.superCharge = Math.min(C.SUPER_CHARGE_MAX, attacker.superCharge + C.SUPER_CHARGE_PER_HIT)
            }
            particles.push(...weaponHitParticles(attacker, target))
            const tipX = attacker.position.x + Math.cos(attacker.weaponAngle) * (attacker.radius + attacker.weaponLength)
            const tipY = attacker.position.y + Math.sin(attacker.weaponAngle) * (attacker.radius + attacker.weaponLength)
            splatters.push(makeSplatter(tipX, tipY, target.color))
            shakeX += (Math.random() - 0.5) * 4
            shakeY += (Math.random() - 0.5) * 4
            hitSlow = 80
          }
        }
      }

      // Projectiles
      projectiles = projectiles.filter(p => {
        updateProjectile(p, dt)
        if (p.life >= p.maxLife) return false
        if (p.position.x < 0 || p.position.x > C.ARENA_W ||
            p.position.y < 0 || p.position.y > C.ARENA_H) return false
        for (const s of alive) {
          if (projectileHitsSphere(p, s)) {
            s.hp -= p.damage
            s.damageFlash = C.HIT_FLASH_MS
            splatters.push(makeSplatter(p.position.x, p.position.y, s.color))
            for (let k = 0; k < 5; k++) {
              const a = Math.random() * Math.PI * 2
              particles.push({
                x: p.position.x, y: p.position.y,
                vx: Math.cos(a) * 2, vy: Math.sin(a) * 2,
                radius: 1.5, color: p.color,
                alpha: 1, life: 0, maxLife: 200,
              })
            }
            return false
          }
        }
        return true
      })

      // Deaths — instant vanish, no effects
      for (const s of alive) {
        if (s.hp <= 0 && s.isAlive) {
          s.isAlive = false
          s.deathTimer = 0
        }
      }

      blasts = blasts.filter(b => { b.progress += dt / 350; return b.progress < 1 })
      particles = updateParticles(particles, dt)
      shakeX *= C.SHAKE_DECAY
      shakeY *= C.SHAKE_DECAY

      if (!gameOver) {
        const rA = spheres.filter(s => s.isAlive && s.team === 'red').length
        const bA = spheres.filter(s => s.isAlive && s.team === 'blue').length
        if (rA === 0 || bA === 0) {
          gameOver = true
          setTimeout(() => {
            onVictoryRef.current({
              winner: rA > 0 ? 'red' : bA > 0 ? 'blue' : 'draw',
              redRemaining: rA, blueRemaining: bA,
              totalKnockouts: totalRed + totalBlue - rA - bA,
              battleDurationMs: elapsed,
            })
          }, 1500)
        }
      }
    }

    function render() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.save()
      ctx.translate(shakeX, shakeY)

      drawArena(ctx)
      drawSplatters(ctx, splatters)
      drawParticles(ctx, particles)

      const visible = spheres
        .filter(s => s.isAlive)
        .sort((a, b) => a.position.y - b.position.y)
      for (const s of visible) drawSphere(ctx, s)

      for (const p of projectiles) drawProjectile(ctx, p)
      for (const b of blasts) drawBlastRing(ctx, b.x, b.y, b.radius, b.progress, b.color)

      drawHUD(
        ctx,
        spheres.filter(s => s.isAlive && s.team === 'red').length, totalRed,
        spheres.filter(s => s.isAlive && s.team === 'blue').length, totalBlue,
        elapsed,
      )
      drawFightText(ctx, fightTextProgress)
      drawStatsPanel(ctx, spheres)
      ctx.restore()
    }

    function loop(ts: number) {
      if (lastTime === 0) lastTime = ts
      const dt = Math.min(ts - lastTime, 50)
      lastTime = ts
      update(dt)
      render()
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [config])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        maxWidth: C.ARENA_W * 2.5,
        height: 'auto',
        margin: '0 auto',
        imageRendering: 'auto',
      }}
    />
  )
}

function makeSplatter(x: number, y: number, color: string): Splatter {
  const radius = 3 + Math.random() * 3
  const blobs: Splatter['blobs'] = []
  const count = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    blobs.push({
      ox: (Math.random() - 0.5) * radius * 2,
      oy: (Math.random() - 0.5) * radius * 2,
      r: radius * (0.2 + Math.random() * 0.35),
    })
  }
  return {
    x: x + (Math.random() - 0.5) * 4,
    y: y + (Math.random() - 0.5) * 4,
    radius,
    color,
    blobs,
  }
}

function findNearestEnemy(s: Sphere, all: Sphere[]): Sphere | undefined {
  let best: Sphere | undefined, bestD = Infinity
  for (const o of all) {
    if (!o.isAlive || o.team === s.team) continue
    const d = dist(s.position, o.position)
    if (d < bestD) { bestD = d; best = o }
  }
  return best
}
