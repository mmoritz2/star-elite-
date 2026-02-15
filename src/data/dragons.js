// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Dragon System Database
// ============================================================

export const DRAGON_TYPES = {
  storm: {
    id: 'storm',
    name: 'Storm Dragon',
    element: 'Lightning',
    description: 'Crackling with electric fury. Boosts speed and power.',
    color: '#7c4dff',
    statBonus: { speed: 0.08, power: 0.06 },
    mutationBonus: 0.02,
    affinityMatch: 'thoroughbred',
    icon: '⚡'
  },
  frost: {
    id: 'frost',
    name: 'Frost Dragon',
    element: 'Ice',
    description: 'Patient and relentless. Boosts stamina and recovery.',
    color: '#40c4ff',
    statBonus: { stamina: 0.08, recovery: 0.06 },
    mutationBonus: 0.015,
    affinityMatch: 'highland_warmblood',
    icon: '❄️'
  },
  ember: {
    id: 'ember',
    name: 'Ember Dragon',
    element: 'Fire',
    description: 'Fierce and explosive. Boosts power and speed.',
    color: '#ff6d00',
    statBonus: { power: 0.08, speed: 0.06 },
    mutationBonus: 0.025,
    affinityMatch: 'warmblood',
    icon: '🔥'
  },
  solar: {
    id: 'solar',
    name: 'Solar Dragon',
    element: 'Light',
    description: 'Radiant and precise. Boosts precision and temperament.',
    color: '#ffd740',
    statBonus: { precision: 0.08, temperament: 0.06 },
    mutationBonus: 0.02,
    affinityMatch: 'friesian_sport',
    icon: '☀️'
  },
  lunar: {
    id: 'lunar',
    name: 'Lunar Dragon',
    element: 'Shadow',
    description: 'Mysterious and balanced. Boosts all stats moderately.',
    color: '#b388ff',
    statBonus: { speed: 0.03, stamina: 0.03, precision: 0.03, power: 0.03, temperament: 0.03, recovery: 0.03 },
    mutationBonus: 0.03,
    affinityMatch: 'celestial',
    icon: '🌙'
  }
};

export const DRAGON_TIERS = {
  shard: {
    id: 'shard',
    name: 'Dragon Shard',
    level: 1,
    statMultiplier: 0.5,
    energyCap: 50,
    energyRegen: 2, // per hour
    essencesToUpgrade: 0,
    description: 'A fragment of draconic power, waiting to awaken.'
  },
  young: {
    id: 'young',
    name: 'Young Dragon',
    level: 2,
    statMultiplier: 1.0,
    energyCap: 100,
    energyRegen: 3,
    essencesToUpgrade: 25,
    description: 'Growing in strength. Beginning to form a true bond.'
  },
  ancient: {
    id: 'ancient',
    name: 'Ancient Dragon',
    level: 3,
    statMultiplier: 1.5,
    energyCap: 175,
    energyRegen: 5,
    essencesToUpgrade: 75,
    description: 'Centuries of wisdom condensed into raw power.'
  },
  elder: {
    id: 'elder',
    name: 'Elder Dragon',
    level: 4,
    statMultiplier: 2.0,
    energyCap: 250,
    energyRegen: 8,
    essencesToUpgrade: null, // max tier
    description: 'The pinnacle of draconic evolution. Unmatched.'
  }
};

export const DRAGON_ENERGY_COSTS = {
  breeding_enhance: 20,
  dragon_trial: 40,
  mutation_boost: 15,
  stat_infusion: 30
};

export const DRAGON_TRADE_RULES = {
  cooldownDays: 7,
  taxPercent: 5,
  minTier: 'young' // shards cannot be traded
};

export function getDragonStatBonus(dragonType, dragonTier) {
  const type = DRAGON_TYPES[dragonType];
  const tier = DRAGON_TIERS[dragonTier];
  if (!type || !tier) return {};
  const bonus = {};
  for (const [stat, val] of Object.entries(type.statBonus)) {
    bonus[stat] = val * tier.statMultiplier;
  }
  return bonus;
}

export function getDragonMutationBonus(dragonType, dragonTier) {
  const type = DRAGON_TYPES[dragonType];
  const tier = DRAGON_TIERS[dragonTier];
  if (!type || !tier) return 0;
  return type.mutationBonus * tier.statMultiplier;
}
