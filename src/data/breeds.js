// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Horse Breed Database
// ============================================================

export const COAT_FAMILIES = {
  warmblood: {
    standard: ['Bay', 'Chestnut', 'Dark Bay'],
    rare: ['Golden Dun'],
    shimmer: 'Starlit Bay'
  },
  thoroughbred: {
    standard: ['Black', 'Gray', 'Sorrel'],
    rare: ['Silver Dapple'],
    shimmer: 'Phantom Silver'
  },
  friesian_sport: {
    standard: ['True Black', 'Midnight Blue', 'Charcoal'],
    rare: ['Blue Roan'],
    shimmer: 'Obsidian Gleam'
  },
  highland_warmblood: {
    standard: ['Buckskin', 'Grullo', 'Red Roan'],
    rare: ['Cremello'],
    shimmer: 'Ivory Flame'
  },
  celestial: {
    standard: ['Pearl White', 'Astral Silver', 'Nebula Violet'],
    rare: ['Aurora Borealis'],
    shimmer: 'Cosmic Radiance'
  }
};

export const BREEDS = {
  warmblood: {
    id: 'warmblood',
    name: 'Warmblood',
    region: 1,
    description: 'A well-balanced breed with solid fundamentals across all disciplines.',
    baseStats: { speed: 50, stamina: 50, precision: 50, power: 50, temperament: 55, recovery: 50 },
    statBias: { speed: 1.0, stamina: 1.0, precision: 1.0, power: 1.0, temperament: 1.05, recovery: 1.0 },
    growthRate: 1.0,
    coats: COAT_FAMILIES.warmblood,
    rarity: 'common'
  },
  thoroughbred: {
    id: 'thoroughbred',
    name: 'Thoroughbred',
    region: 2,
    description: 'Born to run. Exceptional speed but requires careful stamina management.',
    baseStats: { speed: 70, stamina: 40, precision: 45, power: 45, temperament: 40, recovery: 45 },
    statBias: { speed: 1.3, stamina: 0.85, precision: 0.95, power: 0.95, temperament: 0.85, recovery: 0.95 },
    growthRate: 1.1,
    coats: COAT_FAMILIES.thoroughbred,
    rarity: 'uncommon'
  },
  friesian_sport: {
    id: 'friesian_sport',
    name: 'Friesian Sport',
    region: 3,
    description: 'Elegant and precise. Masters of dressage and technical disciplines.',
    baseStats: { speed: 40, stamina: 50, precision: 70, power: 40, temperament: 60, recovery: 50 },
    statBias: { speed: 0.85, stamina: 1.0, precision: 1.3, power: 0.85, temperament: 1.1, recovery: 1.0 },
    growthRate: 1.0,
    coats: COAT_FAMILIES.friesian_sport,
    rarity: 'uncommon'
  },
  highland_warmblood: {
    id: 'highland_warmblood',
    name: 'Highland Warmblood',
    region: 4,
    description: 'Mountain-bred powerhouse. Dominates rugged terrain and endurance events.',
    baseStats: { speed: 45, stamina: 55, precision: 40, power: 70, temperament: 50, recovery: 55 },
    statBias: { speed: 0.9, stamina: 1.1, precision: 0.85, power: 1.3, temperament: 1.0, recovery: 1.1 },
    growthRate: 0.95,
    coats: COAT_FAMILIES.highland_warmblood,
    rarity: 'rare'
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial Line',
    region: 5,
    description: 'Otherworldly heritage. Peak potential across all stats with proper investment.',
    baseStats: { speed: 60, stamina: 60, precision: 60, power: 60, temperament: 65, recovery: 60 },
    statBias: { speed: 1.15, stamina: 1.15, precision: 1.15, power: 1.15, temperament: 1.2, recovery: 1.15 },
    growthRate: 0.85,
    coats: COAT_FAMILIES.celestial,
    rarity: 'legendary'
  }
};

export const STAT_NAMES = ['speed', 'stamina', 'precision', 'power', 'temperament', 'recovery'];

export const STAT_DESCRIPTIONS = {
  speed: 'Raw pace in sprint and racing events',
  stamina: 'Endurance over long distances and multi-round competitions',
  precision: 'Accuracy in dressage, jumping technique, and technical events',
  power: 'Raw strength for jumps, hills, and cross-country obstacles',
  temperament: 'Composure under pressure; affects injury chance and consistency',
  recovery: 'How quickly the horse bounces back from fatigue and injury'
};

export const STAT_CAP = 150;
export const LEVEL_CAP = 50;

export function getStatColor(statName) {
  const colors = {
    speed: '#ff6b6b',
    stamina: '#51cf66',
    precision: '#339af0',
    power: '#ff922b',
    temperament: '#cc5de8',
    recovery: '#20c997'
  };
  return colors[statName] || '#adb5bd';
}
