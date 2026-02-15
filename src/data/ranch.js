// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Ranch Building System
// ============================================================

export const FACILITIES = {
  stable: {
    id: 'stable',
    name: 'Stable',
    description: 'Houses your horses. Each level adds capacity.',
    maxLevel: 10,
    baseCost: 200,
    costMultiplier: 1.5,
    effects: [
      { level: 1, capacity: 3 },
      { level: 2, capacity: 5 },
      { level: 3, capacity: 8 },
      { level: 4, capacity: 12 },
      { level: 5, capacity: 16 },
      { level: 6, capacity: 20 },
      { level: 7, capacity: 25 },
      { level: 8, capacity: 30 },
      { level: 9, capacity: 36 },
      { level: 10, capacity: 42 }
    ],
    icon: '🏠'
  },
  training_ring: {
    id: 'training_ring',
    name: 'Training Ring',
    description: 'Boosts XP gained from training sessions.',
    maxLevel: 5,
    baseCost: 500,
    costMultiplier: 2.0,
    effects: [
      { level: 1, xpBoost: 0.05 },
      { level: 2, xpBoost: 0.10 },
      { level: 3, xpBoost: 0.18 },
      { level: 4, xpBoost: 0.25 },
      { level: 5, xpBoost: 0.35 }
    ],
    icon: '🔄'
  },
  indoor_arena: {
    id: 'indoor_arena',
    name: 'Indoor Arena',
    description: 'Train regardless of weather. Removes weather penalties.',
    maxLevel: 3,
    baseCost: 1000,
    costMultiplier: 2.5,
    effects: [
      { level: 1, weatherImmunity: 0.5 },
      { level: 2, weatherImmunity: 0.8 },
      { level: 3, weatherImmunity: 1.0 }
    ],
    icon: '🏟️'
  },
  pasture: {
    id: 'pasture',
    name: 'Pasture',
    description: 'Open grazing land. Reduces injury duration and chance.',
    maxLevel: 5,
    baseCost: 400,
    costMultiplier: 1.8,
    effects: [
      { level: 1, injuryReduction: 0.05 },
      { level: 2, injuryReduction: 0.10 },
      { level: 3, injuryReduction: 0.18 },
      { level: 4, injuryReduction: 0.25 },
      { level: 5, injuryReduction: 0.35 }
    ],
    icon: '🌾'
  },
  dragon_roost: {
    id: 'dragon_roost',
    name: 'Dragon Roost',
    description: 'A sanctuary for your dragon. Boosts energy regeneration.',
    maxLevel: 5,
    baseCost: 2000,
    costMultiplier: 2.0,
    effects: [
      { level: 1, energyRegenBonus: 1 },
      { level: 2, energyRegenBonus: 2 },
      { level: 3, energyRegenBonus: 4 },
      { level: 4, energyRegenBonus: 6 },
      { level: 5, energyRegenBonus: 10 }
    ],
    icon: '🐉'
  }
};

export const DECOR_ITEMS = {
  flower_garden: { id: 'flower_garden', name: 'Flower Garden', cost: 150, bonus: { temperament: 0.01 }, icon: '🌸' },
  fountain: { id: 'fountain', name: 'Fountain', cost: 300, bonus: { recovery: 0.02 }, icon: '⛲' },
  trophy_case: { id: 'trophy_case', name: 'Trophy Case', cost: 500, bonus: { prestige: 0.03 }, icon: '🏆' },
  wind_chimes: { id: 'wind_chimes', name: 'Wind Chimes', cost: 200, bonus: { temperament: 0.02 }, icon: '🎐' },
  training_dummy: { id: 'training_dummy', name: 'Training Dummy', cost: 350, bonus: { xpBoost: 0.01 }, icon: '🎯' },
  banner_stand: { id: 'banner_stand', name: 'Banner Stand', cost: 250, bonus: { prestige: 0.02 }, icon: '🚩' }
};

export const RANCH_PARTY = {
  duration: 60, // minutes
  cooldown: 1440, // 24h in minutes
  buffs: {
    xpBoost: 0.1,
    temperamentBoost: 5,
    recoveryBoost: 3
  },
  socialReward: { coins: 50, gems: 1 }
};

export function getFacilityCost(facilityId, currentLevel) {
  const facility = FACILITIES[facilityId];
  if (!facility || currentLevel >= facility.maxLevel) return Infinity;
  return Math.floor(facility.baseCost * Math.pow(facility.costMultiplier, currentLevel));
}

export function getFacilityEffect(facilityId, level) {
  const facility = FACILITIES[facilityId];
  if (!facility || level <= 0) return null;
  return facility.effects[Math.min(level, facility.maxLevel) - 1];
}
