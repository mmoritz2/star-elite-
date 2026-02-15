// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Dragon System
// ============================================================

import { DRAGON_TYPES, DRAGON_TIERS, DRAGON_ENERGY_COSTS, DRAGON_TRADE_RULES } from '../data/dragons.js';
import { generateId } from '../utils/random.js';

const TIER_ORDER = ['shard', 'young', 'ancient', 'elder'];

export function createDragon(type, tier = 'shard') {
  const typeData = DRAGON_TYPES[type];
  const tierData = DRAGON_TIERS[tier];
  if (!typeData || !tierData) return null;

  return {
    id: generateId(),
    type,
    typeName: typeData.name,
    element: typeData.element,
    tier,
    tierName: tierData.name,
    energy: tierData.energyCap,
    energyCap: tierData.energyCap,
    energyRegen: tierData.energyRegen,
    essencesInvested: 0,
    bondedHorseId: null,
    tradeCooldownEnd: 0,
    createdAt: Date.now(),
    lastEnergyUpdate: Date.now()
  };
}

export function upgradeDragon(dragon, essences) {
  const currentTierIdx = TIER_ORDER.indexOf(dragon.tier);
  if (currentTierIdx >= TIER_ORDER.length - 1) {
    return { success: false, reason: 'Already at maximum tier' };
  }

  const nextTier = TIER_ORDER[currentTierIdx + 1];
  const nextTierData = DRAGON_TIERS[nextTier];
  const cost = nextTierData.essencesToUpgrade;

  if (essences < cost) {
    return { success: false, reason: `Need ${cost} essences, have ${essences}`, cost };
  }

  dragon.tier = nextTier;
  dragon.tierName = nextTierData.name;
  dragon.energyCap = nextTierData.energyCap;
  dragon.energyRegen = nextTierData.energyRegen;
  dragon.energy = dragon.energyCap; // Refill on upgrade

  return {
    success: true,
    newTier: nextTier,
    tierName: nextTierData.name,
    essencesCost: cost,
    essencesRemaining: essences - cost
  };
}

export function consumeEnergy(dragon, action) {
  const cost = DRAGON_ENERGY_COSTS[action];
  if (!cost) return { success: false, reason: 'Unknown action' };
  if (dragon.energy < cost) {
    return { success: false, reason: `Not enough energy. Need ${cost}, have ${dragon.energy}` };
  }

  dragon.energy -= cost;
  return { success: true, energySpent: cost, energyRemaining: dragon.energy };
}

export function rechargeEnergy(dragon, hours, roostBonus = 0) {
  const regenRate = dragon.energyRegen + roostBonus;
  const gain = Math.floor(regenRate * hours);
  dragon.energy = Math.min(dragon.energyCap, dragon.energy + gain);
  dragon.lastEnergyUpdate = Date.now();
  return { energy: dragon.energy, gained: gain };
}

export function tickDragonEnergy(dragon, roostBonus = 0) {
  const now = Date.now();
  const hoursSinceUpdate = (now - dragon.lastEnergyUpdate) / (1000 * 60 * 60);
  if (hoursSinceUpdate >= 1) {
    const fullHours = Math.floor(hoursSinceUpdate);
    rechargeEnergy(dragon, fullHours, roostBonus);
  }
}

export function bondDragon(dragon, horseId) {
  if (dragon.bondedHorseId) {
    return { success: false, reason: 'Dragon already bonded' };
  }
  dragon.bondedHorseId = horseId;
  return { success: true };
}

export function unbondDragon(dragon) {
  dragon.bondedHorseId = null;
  return { success: true };
}

export function canTradeDragon(dragon) {
  if (dragon.tier === 'shard') {
    return { canTrade: false, reason: 'Shards cannot be traded' };
  }
  if (Date.now() < dragon.tradeCooldownEnd) {
    const hoursLeft = Math.ceil((dragon.tradeCooldownEnd - Date.now()) / (1000 * 60 * 60));
    return { canTrade: false, reason: `Trade cooldown: ${hoursLeft}h remaining` };
  }
  return { canTrade: true };
}

export function tradeDragon(dragon) {
  const check = canTradeDragon(dragon);
  if (!check.canTrade) return { success: false, reason: check.reason };

  dragon.tradeCooldownEnd = Date.now() + (DRAGON_TRADE_RULES.cooldownDays * 24 * 60 * 60 * 1000);
  dragon.bondedHorseId = null;
  return {
    success: true,
    taxPercent: DRAGON_TRADE_RULES.taxPercent,
    newCooldownEnd: dragon.tradeCooldownEnd
  };
}

export function getAffinityBonus(dragon, horse) {
  const type = DRAGON_TYPES[dragon.type];
  if (!type) return 0;
  if (horse.breed === type.affinityMatch) return 15;
  return 0;
}

export function getDragonPowerRating(dragon) {
  const tierData = DRAGON_TIERS[dragon.tier];
  const typeData = DRAGON_TYPES[dragon.type];
  if (!tierData || !typeData) return 0;

  const statTotal = Object.values(typeData.statBonus).reduce((s, v) => s + v, 0);
  return Math.round(statTotal * tierData.statMultiplier * 100);
}
