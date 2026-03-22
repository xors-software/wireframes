import { SphereClass, Sphere, Position, Velocity, GameState } from './types';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  ARENA_PADDING, 
  SPHERE_RADIUS, 
  INITIAL_HP,
  GRAVITY,
  BOUNCE_DAMPING,
  FRICTION,
  COLLISION_DAMPING,
  COLORS,
  SPECIAL_COOLDOWN
} from './constants';

// =============================================================================
// CLASS DEFINITIONS
// =============================================================================

export const SPHERE_CLASSES: Record<string, SphereClass> = {
  REAPER: {
    name: 'Reaper',
    color: COLORS.REAPER,
    weapon: 'Scythe',
    specialAbility: 'Lifesteal',
    baseDamage: 15,
    specialDamage: 25,
    description: 'Dark sphere that steals life from enemies'
  },
  BLACKSMITH: {
    name: 'Blacksmith',
    color: COLORS.BLACKSMITH,
    weapon: 'Hammer',
    specialAbility: 'Heavy Strike',
    baseDamage: 20,
    specialDamage: 35,
    description: 'Orange sphere with devastating hammer attacks'
  }
};

// =============================================================================
// PHYSICS UTILITIES
// =============================================================================

export function distance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(velocity: Velocity): Velocity {
  const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  if (magnitude === 0) return { x: 0, y: 0 };
  return {
    x: velocity.x / magnitude,
    y: velocity.y / magnitude
  };
}

export function applyForce(velocity: Velocity, force: Velocity): Velocity {
  return {
    x: velocity.x + force.x,
    y: velocity.y + force.y
  };
}

// =============================================================================
// COLLISION DETECTION
// =============================================================================

export function checkSphereCollision(sphere1: Sphere, sphere2: Sphere): boolean {
  const dist = distance(sphere1.position, sphere2.position);
  return dist < (sphere1.radius + sphere2.radius);
}

export function resolveSphereCollision(sphere1: Sphere, sphere2: Sphere): void {
  const dist = distance(sphere1.position, sphere2.position);
  const overlap = (sphere1.radius + sphere2.radius) - dist;
  
  if (overlap > 0) {
    // Separate spheres
    const dx = sphere2.position.x - sphere1.position.x;
    const dy = sphere2.position.y - sphere1.position.y;
    const angle = Math.atan2(dy, dx);
    
    const separationX = Math.cos(angle) * overlap * 0.5;
    const separationY = Math.sin(angle) * overlap * 0.5;
    
    sphere1.position.x -= separationX;
    sphere1.position.y -= separationY;
    sphere2.position.x += separationX;
    sphere2.position.y += separationY;
    
    // Exchange velocities with damping
    const tempVelX = sphere1.velocity.x;
    const tempVelY = sphere1.velocity.y;
    
    sphere1.velocity.x = sphere2.velocity.x * COLLISION_DAMPING;
    sphere1.velocity.y = sphere2.velocity.y * COLLISION_DAMPING;
    sphere2.velocity.x = tempVelX * COLLISION_DAMPING;
    sphere2.velocity.y = tempVelY * COLLISION_DAMPING;
  }
}

// =============================================================================
// ARENA BOUNDARIES
// =============================================================================

export function checkArenaBounds(sphere: Sphere): void {
  const minX = ARENA_PADDING + sphere.radius;
  const maxX = CANVAS_WIDTH - ARENA_PADDING - sphere.radius;
  const minY = ARENA_PADDING + sphere.radius;
  const maxY = CANVAS_HEIGHT - ARENA_PADDING - sphere.radius;
  
  // Horizontal bounds
  if (sphere.position.x < minX) {
    sphere.position.x = minX;
    sphere.velocity.x = -sphere.velocity.x * BOUNCE_DAMPING;
  } else if (sphere.position.x > maxX) {
    sphere.position.x = maxX;
    sphere.velocity.x = -sphere.velocity.x * BOUNCE_DAMPING;
  }
  
  // Vertical bounds
  if (sphere.position.y < minY) {
    sphere.position.y = minY;
    sphere.velocity.y = -sphere.velocity.y * BOUNCE_DAMPING;
  } else if (sphere.position.y > maxY) {
    sphere.position.y = maxY;
    sphere.velocity.y = -sphere.velocity.y * BOUNCE_DAMPING;
  }
}

// =============================================================================
// PHYSICS UPDATE
// =============================================================================

export function updateSpherePhysics(sphere: Sphere, deltaTime: number): void {
  // Apply gravity
  sphere.velocity.y += GRAVITY * deltaTime * 60;
  
  // Apply friction
  sphere.velocity.x *= FRICTION;
  sphere.velocity.y *= FRICTION;
  
  // Update position
  sphere.position.x += sphere.velocity.x * deltaTime * 60;
  sphere.position.y += sphere.velocity.y * deltaTime * 60;
  
  // Check arena bounds
  checkArenaBounds(sphere);
  
  // Update damage flash
  if (sphere.isFlashing && Date.now() - sphere.lastDamageTime > 200) {
    sphere.isFlashing = false;
  }
}

// =============================================================================
// COMBAT SYSTEM
// =============================================================================

export function dealDamage(attacker: Sphere, target: Sphere, isSpecial: boolean = false): number {
  const damage = isSpecial ? attacker.class.specialDamage : attacker.class.baseDamage;
  const actualDamage = Math.min(damage, target.hp);
  
  target.hp -= actualDamage;
  target.lastDamageTime = Date.now();
  target.isFlashing = true;
  
  // Lifesteal for Reaper
  if (attacker.class.name === 'Reaper' && isSpecial) {
    const healAmount = Math.floor(actualDamage * 0.5);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
  }
  
  return actualDamage;
}

export function canUseSpecial(sphere: Sphere): boolean {
  return Date.now() - sphere.lastSpecialTime >= SPECIAL_COOLDOWN;
}

export function useSpecial(sphere: Sphere): void {
  sphere.lastSpecialTime = Date.now();
}

// =============================================================================
// GAME STATE MANAGEMENT
// =============================================================================

export function createSphere(
  id: string, 
  position: Position, 
  sphereClass: SphereClass
): Sphere {
  return {
    id,
    position: { ...position },
    velocity: { x: 0, y: 0 },
    hp: INITIAL_HP,
    maxHp: INITIAL_HP,
    radius: SPHERE_RADIUS,
    class: sphereClass,
    lastDamageTime: 0,
    lastSpecialTime: 0,
    isFlashing: false
  };
}

export function initializeGame(class1: SphereClass, class2: SphereClass): GameState {
  const sphere1 = createSphere('player1', { x: 200, y: 300 }, class1);
  const sphere2 = createSphere('player2', { x: 600, y: 300 }, class2);
  
  return {
    spheres: [sphere1, sphere2],
    isRunning: false,
    winner: null,
    gameStartTime: Date.now(),
    lastUpdateTime: Date.now()
  };
}

export function checkGameEnd(gameState: GameState): string | null {
  const [sphere1, sphere2] = gameState.spheres;
  
  if (sphere1.hp <= 0) {
    return sphere2.class.name;
  }
  if (sphere2.hp <= 0) {
    return sphere1.class.name;
  }
  
  return null;
}