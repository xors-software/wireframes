import type { Sphere, Projectile, Particle, Splatter } from './types'
import { UNIT_CLASSES } from './classes'
import * as C from './constants'

// --- Arena (light background, stone-style border) ---

export function drawArena(ctx: CanvasRenderingContext2D) {
  const m = C.ARENA_MARGIN
  const bs = Math.floor(m * 0.9)

  // Warm brown outer fill
  ctx.fillStyle = '#8B7D6B'
  ctx.fillRect(0, 0, C.ARENA_W, C.ARENA_H)

  // Stone border blocks — alternating warm tones with dark mortar
  const lightStone = '#7A7062'
  const darkStone = '#5E5549'

  for (let x = 0; x < C.ARENA_W; x += bs) {
    const w = Math.min(bs, C.ARENA_W - x)
    const shade = (Math.floor(x / bs) % 2 === 0) ? lightStone : darkStone
    ctx.fillStyle = shade
    ctx.fillRect(x, 0, w, m)
    ctx.fillRect(x, C.ARENA_H - m, w, m)
    ctx.strokeStyle = '#3D3529'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, 0.5, w - 1, m - 1)
    ctx.strokeRect(x + 0.5, C.ARENA_H - m + 0.5, w - 1, m - 1)
  }
  for (let y = m; y < C.ARENA_H - m; y += bs) {
    const h = Math.min(bs, C.ARENA_H - m - y)
    const shade = (Math.floor(y / bs) % 2 === 0) ? lightStone : darkStone
    ctx.fillStyle = shade
    ctx.fillRect(0, y, m, h)
    ctx.fillRect(C.ARENA_W - m, y, m, h)
    ctx.strokeStyle = '#3D3529'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, y + 0.5, m - 1, h - 1)
    ctx.strokeRect(C.ARENA_W - m + 0.5, y + 0.5, m - 1, h - 1)
  }

  // Bold corner blocks
  const cs = m + 3
  ctx.fillStyle = '#9E9484'
  ctx.fillRect(0, 0, cs, cs)
  ctx.fillRect(C.ARENA_W - cs, 0, cs, cs)
  ctx.fillRect(0, C.ARENA_H - cs, cs, cs)
  ctx.fillRect(C.ARENA_W - cs, C.ARENA_H - cs, cs, cs)
  ctx.strokeStyle = '#3D3529'
  ctx.lineWidth = 1
  ctx.strokeRect(0.5, 0.5, cs - 1, cs - 1)
  ctx.strokeRect(C.ARENA_W - cs + 0.5, 0.5, cs - 1, cs - 1)
  ctx.strokeRect(0.5, C.ARENA_H - cs + 0.5, cs - 1, cs - 1)
  ctx.strokeRect(C.ARENA_W - cs + 0.5, C.ARENA_H - cs + 0.5, cs - 1, cs - 1)

  // Arena floor — warm off-white
  ctx.fillStyle = '#F2EDE4'
  ctx.fillRect(m, m, C.ARENA_W - m * 2, C.ARENA_H - m * 2)

  // Inner dark border for clean edge
  ctx.strokeStyle = '#3D3529'
  ctx.lineWidth = 2
  ctx.strokeRect(m, m, C.ARENA_W - m * 2, C.ARENA_H - m * 2)
}

// --- Sphere (HP number on ball, no bar) ---

export function drawSphere(ctx: CanvasRenderingContext2D, s: Sphere) {
  if (!s.isAlive) return
  const { position: p, radius: r } = s

  ctx.save()

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.beginPath()
  ctx.ellipse(p.x + 2, p.y + r * 0.6, r * 0.75, r * 0.25, 0, 0, Math.PI * 2)
  ctx.fill()

  // Super glow
  if (s.superActive) {
    ctx.fillStyle = 'rgba(255,200,0,0.18)'
    ctx.beginPath()
    ctx.arc(p.x, p.y, r + 8, 0, Math.PI * 2)
    ctx.fill()
  }

  // Body — flat fill with a subtle highlight, not a gradient
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.fillStyle = s.damageFlash > 0 ? '#FF6666' : s.accentColor
  ctx.fill()

  // Bold black outline
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Simple highlight arc for depth
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(p.x, p.y, r * 0.7, -2.2, -0.8)
  ctx.stroke()

  // HP number — bold white with thick black stroke
  const hp = Math.ceil(s.hp)
  ctx.font = `bold ${Math.round(r * 0.9)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 3
  ctx.strokeText(String(hp), p.x, p.y + 1)
  ctx.fillStyle = '#FFF'
  ctx.fillText(String(hp), p.x, p.y + 1)

  // Super charge bar below
  const barW = r * 2
  const barH = 5
  const barX = p.x - barW / 2
  const barY = p.y + r + 7
  const chargeRatio = s.superActive ? 1 : s.superCharge / C.SUPER_CHARGE_MAX

  if (chargeRatio > 0) {
    ctx.fillStyle = '#333'
    ctx.fillRect(barX, barY, barW, barH)
    ctx.fillStyle = s.superActive ? '#FFD700' : '#FF8C00'
    ctx.fillRect(barX, barY, barW * chargeRatio, barH)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 1
    ctx.strokeRect(barX, barY, barW, barH)
  }

  // Weapon
  drawWeapon(ctx, s)

  ctx.restore()
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, ((n >> 16) & 0xff) + amt)
  const g = Math.min(255, ((n >> 8) & 0xff) + amt)
  const b = Math.min(255, (n & 0xff) + amt)
  return `rgb(${r},${g},${b})`
}

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, ((n >> 16) & 0xff) - amt)
  const g = Math.max(0, ((n >> 8) & 0xff) - amt)
  const b = Math.max(0, (n & 0xff) - amt)
  return `rgb(${r},${g},${b})`
}

function drawWeapon(ctx: CanvasRenderingContext2D, s: Sphere) {
  const { position: p, radius: r, weaponAngle: a, weaponLength: len, weaponType: wt } = s
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(a)

  switch (wt) {
    case 'sword': {
      // Blade — thick and chunky
      ctx.fillStyle = '#D1D5DB'
      ctx.beginPath()
      ctx.moveTo(r - 2, -5)
      ctx.lineTo(r + len, -2.5)
      ctx.lineTo(r + len + 6, 0)
      ctx.lineTo(r + len, 2.5)
      ctx.lineTo(r - 2, 5)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#9CA3AF'
      ctx.lineWidth = 1.5
      ctx.stroke()
      // Edge highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(r + 2, -2)
      ctx.lineTo(r + len - 4, 0)
      ctx.stroke()
      // Guard
      ctx.fillStyle = '#D97706'
      ctx.fillRect(r - 4, -7, 5, 14)
      // Handle
      ctx.fillStyle = '#78350F'
      ctx.fillRect(r - 10, -3.5, 7, 7)
      break
    }
    case 'bow': {
      ctx.strokeStyle = '#92400E'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(r + 8, 0, len * 0.5, -0.9, 0.9)
      ctx.stroke()
      ctx.strokeStyle = '#E5E7EB'
      ctx.lineWidth = 1.5
      const bx = r + 8 + len * 0.5 * Math.cos(-0.9)
      const by = len * 0.5 * Math.sin(-0.9)
      ctx.beginPath()
      ctx.moveTo(bx, by)
      ctx.lineTo(bx, -by)
      ctx.stroke()
      // Arrow
      ctx.fillStyle = '#6B7280'
      ctx.beginPath()
      ctx.moveTo(r + 8 + len * 0.5 - 4, -1.5)
      ctx.lineTo(r + 8 + len * 0.5 + 10, 0)
      ctx.lineTo(r + 8 + len * 0.5 - 4, 1.5)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#78350F'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(r - 2, 0)
      ctx.lineTo(r + 8 + len * 0.5 - 4, 0)
      ctx.stroke()
      break
    }
    case 'staff': {
      ctx.strokeStyle = '#78350F'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(r - 4, 0)
      ctx.lineTo(r + len, 0)
      ctx.stroke()
      const orbR = 7
      const orbGrad = ctx.createRadialGradient(r + len - 1, -1, 1, r + len, 0, orbR)
      orbGrad.addColorStop(0, '#E9D5FF')
      orbGrad.addColorStop(1, '#7C3AED')
      ctx.fillStyle = orbGrad
      ctx.beginPath()
      ctx.arc(r + len, 0, orbR, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#6D28D9'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = 'rgba(167,139,250,0.2)'
      ctx.beginPath()
      ctx.arc(r + len, 0, orbR + 5, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'shield': {
      ctx.fillStyle = '#D97706'
      ctx.beginPath()
      ctx.arc(r + len * 0.5, 0, len * 0.45, -1.3, 1.3)
      ctx.lineTo(r + len * 0.5 - 3, 0)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#92400E'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.strokeStyle = '#FDE68A'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(r + len * 0.5, -6)
      ctx.lineTo(r + len * 0.5, 6)
      ctx.moveTo(r + len * 0.5 - 5, 0)
      ctx.lineTo(r + len * 0.5 + 5, 0)
      ctx.stroke()
      break
    }
    case 'axe': {
      // Handle
      ctx.strokeStyle = '#5C3A1E'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(r - 4, 0)
      ctx.lineTo(r + len, 0)
      ctx.stroke()
      // Axe head — double-sided
      ctx.fillStyle = '#9CA3AF'
      ctx.beginPath()
      ctx.moveTo(r + len - 10, -2)
      ctx.quadraticCurveTo(r + len + 4, -12, r + len + 6, -3)
      ctx.lineTo(r + len + 6, 3)
      ctx.quadraticCurveTo(r + len + 4, 12, r + len - 10, 2)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#6B7280'
      ctx.lineWidth = 1.5
      ctx.stroke()
      // Edge shine
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.quadraticCurveTo(r + len + 3, -8, r + len + 5, 0)
      ctx.stroke()
      break
    }
    case 'lance': {
      ctx.strokeStyle = '#78350F'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(r - 4, 0)
      ctx.lineTo(r + len, 0)
      ctx.stroke()
      ctx.fillStyle = '#D1D5DB'
      ctx.beginPath()
      ctx.moveTo(r + len - 3, -5)
      ctx.lineTo(r + len + 10, 0)
      ctx.lineTo(r + len - 3, 5)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#9CA3AF'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = s.team === 'red' ? '#EF4444' : '#3B82F6'
      ctx.beginPath()
      ctx.moveTo(r + 8, -3)
      ctx.lineTo(r + 20, -8)
      ctx.lineTo(r + 18, -3)
      ctx.closePath()
      ctx.fill()
      break
    }
  }

  ctx.restore()
}

// --- Splatters (persistent floor marks from hits) ---

export function drawSplatters(ctx: CanvasRenderingContext2D, splatters: Splatter[]) {
  for (const s of splatters) {
    ctx.globalAlpha = 0.3
    ctx.fillStyle = s.color
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
    ctx.fill()
    for (const b of s.blobs) {
      ctx.beginPath()
      ctx.arc(s.x + b.ox, s.y + b.oy, b.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

// --- Projectiles ---

export function drawProjectile(ctx: CanvasRenderingContext2D, p: Projectile) {
  ctx.save()
  const alpha = Math.max(0, 1 - p.life / p.maxLife)
  ctx.globalAlpha = alpha

  const speed = Math.hypot(p.velocity.x, p.velocity.y)
  if (speed > 0.5) {
    ctx.strokeStyle = p.color
    ctx.lineWidth = p.radius * 0.6
    ctx.globalAlpha = alpha * 0.3
    ctx.beginPath()
    ctx.moveTo(p.position.x, p.position.y)
    ctx.lineTo(p.position.x - p.velocity.x * 2, p.position.y - p.velocity.y * 2)
    ctx.stroke()
    ctx.globalAlpha = alpha
  }

  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// --- Particles ---

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = p.alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// --- HUD ---

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  redAlive: number, redTotal: number,
  blueAlive: number, blueTotal: number,
  _elapsed: number,
) {
  ctx.font = 'bold 8px sans-serif'

  ctx.textAlign = 'left'
  ctx.fillStyle = '#F2EDE4'
  ctx.fillText(`RED ${redAlive}/${redTotal}`, C.ARENA_MARGIN + 4, C.ARENA_MARGIN - 5)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#F2EDE4'
  ctx.fillText(`BLUE ${blueAlive}/${blueTotal}`, C.ARENA_W - C.ARENA_MARGIN - 4, C.ARENA_MARGIN - 5)
}

// --- Blast ring ---

export function drawBlastRing(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, progress: number, color: string) {
  ctx.save()
  ctx.globalAlpha = 1 - progress
  ctx.strokeStyle = color
  ctx.lineWidth = 2 * (1 - progress)
  ctx.beginPath()
  ctx.arc(x, y, radius * progress, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

// --- Stats panel below arena ---

export function drawStatsPanel(ctx: CanvasRenderingContext2D, spheres: Sphere[]) {
  const y = C.ARENA_H
  const w = C.ARENA_W
  const h = C.STATS_H

  // Background — warm tones matching border
  ctx.fillStyle = '#7A7062'
  ctx.fillRect(0, y, w, h)
  ctx.fillStyle = '#5E5549'
  ctx.fillRect(2, y + 2, w - 4, h - 4)

  // Divider
  ctx.strokeStyle = '#7A7062'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(w / 2, y + 6)
  ctx.lineTo(w / 2, y + h - 6)
  ctx.stroke()

  const red = spheres.filter(s => s.team === 'red')
  const blue = spheres.filter(s => s.team === 'blue')

  const drawTeamStats = (team: Sphere[], x: number, align: CanvasTextAlign) => {
    if (team.length === 0) return
    const rep = team[0]
    const cls = UNIT_CLASSES.find(c => c.id === rep.classId)!

    ctx.textAlign = align

    // Class name
    ctx.font = 'bold 10px sans-serif'
    ctx.fillStyle = rep.team === 'red' ? '#F87171' : '#60A5FA'
    ctx.fillText(cls.name, x, y + 16)

    // Weapon type
    ctx.font = '8px sans-serif'
    ctx.fillStyle = '#D1D5DB'
    ctx.fillText(cls.weaponType.toUpperCase(), x, y + 27)

    // DMG
    ctx.font = 'bold 9px sans-serif'
    ctx.fillStyle = '#FCD34D'
    ctx.fillText(`DMG: ${cls.contactDamage}`, x, y + 39)

    // HP
    ctx.fillStyle = '#86EFAC'
    ctx.fillText(`HP: ${Math.ceil(rep.hp)}/${cls.hp}`, x, y + 49)
  }

  drawTeamStats(red, 14, 'left')
  drawTeamStats(blue, w - 14, 'right')
}

// --- "FIGHT!" text ---

export function drawFightText(ctx: CanvasRenderingContext2D, progress: number) {
  if (progress >= 1) return
  ctx.save()
  const scale = 1 + progress * 0.3
  ctx.globalAlpha = 1 - progress
  ctx.font = `bold ${Math.round(28 * scale)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.lineWidth = 3
  ctx.strokeText('FIGHT!', C.ARENA_W / 2, C.ARENA_H / 2)
  ctx.fillStyle = '#F59E0B'
  ctx.fillText('FIGHT!', C.ARENA_W / 2, C.ARENA_H / 2)
  ctx.restore()
}
