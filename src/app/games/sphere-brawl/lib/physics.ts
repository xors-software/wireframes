import { Vector2, Sphere, GameState, ClassName } from './types';
import { 
  ARENA_WIDTH, 
  ARENA_HEIGHT, 
  SPHERE_RADIUS, 
  BORDER_WIDTH,
  GRAVITY,
  FRICTION,
  BOUNCE_DAMPING,
  COLLISION_DAMAGE,
  CLASSES
} from './constants';

// =============================================================================
// PHYSICS UTILITIES
// =============================================================================

export function distance(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(vector: Vector2): Vector2 {
  const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: vector.x / mag, y: vector.y / mag };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// =============================================================================
// GAME INITIALIZATION
// =============================================================================

export function createSphere(id: string, className: ClassName, startX: number, startY: number): Sphere {
  const classData = CLASSES[className];
  
  return {
    id,
    className,
    position: { x: startX, y: startY },
    velocity: { x: 0, y: 0 },
    radius: SPHERE_RADIUS,
    hp: classData.maxHP,
    maxHP: classData.maxHP,
    lastDamageTime: 0
  };
}

export function initializeGame(): GameState {
  const leftSphere = createSphere('player1', 'REAPER', 150, ARENA_HEIGHT / 2);
  const rightSphere = createSphere('player2', 'BLACKSMITH', ARENA_WIDTH - 150, ARENA_HEIGHT / 2);

  return {
    spheres: [leftSphere, rightSphere],
    gameTime: 0,
    gameStarted: false,
    gameEnded: false,
    winner: null,
    lastUpdate: Date.now()
  };
}

// =============================================================================
// PHYSICS SIMULATION
// =============================================================================

export function updateSphere(sphere: Sphere, deltaTime: number): Sphere {
  const newSphere = { ...sphere };
  
  // Apply gravity
  newSphere.velocity.y += GRAVITY;
  
  // Apply friction
  newSphere.velocity.x *= FRICTION;
  newSphere.velocity.y *= FRICTION;
  
  // Update position
  newSphere.position.x += newSphere.velocity.x * deltaTime;
  newSphere.position.y += newSphere.velocity.y * deltaTime;
  
  // Boundary collision
  const minX = BORDER_WIDTH + sphere.radius;
  const maxX = ARENA_WIDTH - BORDER_WIDTH - sphere.radius;
  const minY = BORDER_WIDTH + sphere.radius;
  const maxY = ARENA_HEIGHT - BORDER_WIDTH - sphere.radius;
  
  if (newSphere.position.x < minX) {
    newSphere.position.x = minX;
    newSphere.velocity.x *= -BOUNCE_DAMPING;
  } else if (newSphere.position.x > maxX) {
    newSphere.position.x = maxX;
    newSphere.velocity.x *= -BOUNCE_DAMPING;
  }
  
  if (newSphere.position.y < minY) {
    newSphere.position.y = minY;
    newSphere.velocity.y *= -BOUNCE_DAMPING;
  } else if (newSphere.position.y > maxY) {
    newSphere.position.y = maxY;
    newSphere.velocity.y *= -BOUNCE_DAMPING;
  }
  
  return newSphere;
}

export function checkCollision(sphere1: Sphere, sphere2: Sphere): boolean {
  const dist = distance(sphere1.position, sphere2.position);
  return dist < (sphere1.radius + sphere2.radius);
}

export function handleCollision(sphere1: Sphere, sphere2: Sphere): [Sphere, Sphere] {
  const newSphere1 = { ...sphere1 };
  const newSphere2 = { ...sphere2 };
  
  // Calculate collision normal
  const dx = sphere2.position.x - sphere1.position.x;
  const dy = sphere2.position.y - sphere1.position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist === 0) return [newSphere1, newSphere2];
  
  const normalX = dx / dist;
  const normalY = dy / dist;
  
  // Separate spheres
  const overlap = (sphere1.radius + sphere2.radius) - dist;
  const separateX = normalX * overlap * 0.5;
  const separateY = normalY * overlap * 0.5;
  
  newSphere1.position.x -= separateX;
  newSphere1.position.y -= separateY;
  newSphere2.position.x += separateX;
  newSphere2.position.y += separateY;
  
  // Apply collision impulse
  const relativeVelocityX = sphere2.velocity.x - sphere1.velocity.x;
  const relativeVelocityY = sphere2.velocity.y - sphere1.velocity.y;
  const speed = relativeVelocityX * normalX + relativeVelocityY * normalY;
  
  if (speed < 0) return [newSphere1, newSphere2];
  
  const impulse = 2 * speed / 2; // Equal mass assumption
  
  newSphere1.velocity.x += impulse * normalX;
  newSphere1.velocity.y += impulse * normalY;
  newSphere2.velocity.x -= impulse * normalX;
  newSphere2.velocity.y -= impulse * normalY;
  
  // Apply damage
  const now = Date.now();
  if (now - sphere1.lastDamageTime > 500) { // 500ms cooldown
    newSphere1.hp = Math.max(0, newSphere1.hp - CLASSES[sphere2.className].damage);
    newSphere1.lastDamageTime = now;
    
    // Lifesteal for Reaper
    if (sphere2.className === 'REAPER') {
      newSphere2.hp = Math.min(newSphere2.maxHP, newSphere2.hp + Math.floor(CLASSES.REAPER.damage * 0.3));
    }
  }
  
  if (now - sphere2.lastDamageTime > 500) {
    newSphere2.hp = Math.max(0, newSphere2.hp - CLASSES[sphere1.className].damage);
    newSphere2.lastDamageTime = now;
    
    // Lifesteal for Reaper
    if (sphere1.className === 'REAPER') {
      newSphere1.hp = Math.min(newSphere1.maxHP, newSphere1.hp + Math.floor(CLASSES.REAPER.damage * 0.3));
    }
  }
  
  return [newSphere1, newSphere2];
}

export function updateGameState(gameState: GameState): GameState {
  if (!gameState.gameStarted || gameState.gameEnded) {
    return gameState;
  }
  
  const now = Date.now();
  const deltaTime = (now - gameState.lastUpdate) / 16; // Normalize to 60fps
  
  const newState: GameState = {
    ...gameState,
    lastUpdate: now,
    gameTime: gameState.gameTime + (now - gameState.lastUpdate)
  };
  
  // Update sphere physics
  newState.spheres = newState.spheres.map(sphere => updateSphere(sphere, deltaTime));
  
  // Check collisions
  if (newState.spheres.length === 2) {
    const [sphere1, sphere2] = newState.spheres;
    if (checkCollision(sphere1, sphere2)) {
      const [newSphere1, newSphere2] = handleCollision(sphere1, sphere2);
      newState.spheres = [newSphere1, newSphere2];
    }
  }
  
  // Check win conditions
  const aliveSpheres = newState.spheres.filter(s => s.hp > 0);
  if (aliveSpheres.length === 1) {
    newState.gameEnded = true;
    newState.winner = aliveSpheres[0].id;
  } else if (newState.gameTime >= 60000) { // 60 second time limit
    newState.gameEnded = true;
    // Winner is sphere with more HP
    const [sphere1, sphere2] = newState.spheres;
    newState.winner = sphere1.hp > sphere2.hp ? sphere1.id : sphere2.hp > sphere1.hp ? sphere2.id : null;
  }
  
  return newState;
}

// =============================================================================
// INPUT HANDLING
// =============================================================================

export function applySphereMovement(sphere: Sphere, direction: Vector2, strength: number = 1): Sphere {
  const newSphere = { ...sphere };
  const force = 5 * strength;
  
  newSphere.velocity.x += direction.x * force;
  newSphere.velocity.y += direction.y * force;
  
  // Cap velocity
  const maxSpeed = 15;
  const speed = Math.sqrt(newSphere.velocity.x ** 2 + newSphere.velocity.y ** 2);
  if (speed > maxSpeed) {
    newSphere.velocity.x = (newSphere.velocity.x / speed) * maxSpeed;
    newSphere.velocity.y = (newSphere.velocity.y / speed) * maxSpeed;
  }
  
  return newSphere;
}