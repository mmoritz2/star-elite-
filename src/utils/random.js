// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Random & Math Utilities
// ============================================================

// Seeded PRNG (xoshiro128** algorithm) for reproducible results
export class SeededRandom {
  constructor(seed) {
    this.state = new Uint32Array(4);
    this.state[0] = seed >>> 0;
    this.state[1] = (seed * 1812433253 + 1) >>> 0;
    this.state[2] = (this.state[1] * 1812433253 + 1) >>> 0;
    this.state[3] = (this.state[2] * 1812433253 + 1) >>> 0;
  }

  next() {
    const s = this.state;
    const result = (((s[1] * 5) << 7 | (s[1] * 5) >>> 25) * 9) >>> 0;
    const t = s[1] << 9;
    s[2] ^= s[0];
    s[3] ^= s[1];
    s[1] ^= s[2];
    s[0] ^= s[3];
    s[2] ^= t;
    s[3] = (s[3] << 11 | s[3] >>> 21) >>> 0;
    return result / 4294967296;
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }

  pick(array) {
    return array[this.nextInt(0, array.length - 1)];
  }

  chance(probability) {
    return this.next() < probability;
  }

  weightedPick(items, weights) {
    const total = weights.reduce((s, w) => s + w, 0);
    let roll = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return items[i];
    }
    return items[items.length - 1];
  }
}

// Global non-seeded random helpers
export function random() { return Math.random(); }
export function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
export function randomFloat(min, max) { return Math.random() * (max - min) + min; }
export function pick(array) { return array[randomInt(0, array.length - 1)]; }
export function chance(probability) { return Math.random() < probability; }
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
export function lerp(a, b, t) { return a + (b - a) * t; }

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function weightedPick(items, weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}
