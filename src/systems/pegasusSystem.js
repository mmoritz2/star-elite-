// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Pegasus & Winged Horse System
// ============================================================

import { STAT_CAP } from '../data/breeds.js';

export const PEGASUS_REQUIREMENTS = {
  minLevel: 40,
  minRank: 'gold',
  questComplete: 'celestial_circuit',
  minPrestige: 8000
};

export const PEGASUS_BONUSES = {
  stamina: 1.05,    // +5% endurance
  recovery: 1.03,   // +3% recovery
  skyAccess: true,   // Sky Invitational
  breedable: true,   // Can pass pegasus gene
  ascendedSynergy: true // Dragon match bonus
};

export const WINGED_HORSE_RULES = {
  summonOnly: true,
  summonRate: 0.01,  // 1%
  canBreed: false,
  canAscend: false,
  statCeiling: 120,  // Fixed ceiling
  skyAccess: true
};

export function canAscendToPegasus(horse, playerState) {
  const reasons = [];

  if (horse.isPegasus) {
    reasons.push('Already a Pegasus');
    return { canAscend: false, reasons };
  }

  if (horse.isWinged) {
    reasons.push('Winged horses cannot ascend');
    return { canAscend: false, reasons };
  }

  if (horse.level < PEGASUS_REQUIREMENTS.minLevel) {
    reasons.push(`Horse must be level ${PEGASUS_REQUIREMENTS.minLevel}+ (currently ${horse.level})`);
  }

  if (playerState.prestige < PEGASUS_REQUIREMENTS.minPrestige) {
    reasons.push(`Need ${PEGASUS_REQUIREMENTS.minPrestige} prestige (have ${playerState.prestige})`);
  }

  // Check if Celestial Circuit quest is complete
  const questComplete = playerState.completedQuests?.includes('cc_2') || false;
  if (!questComplete) {
    reasons.push('Must complete Celestial Circuit quest "Wings of Light"');
  }

  return {
    canAscend: reasons.length === 0,
    reasons
  };
}

export function ascendToPegasus(horse) {
  if (horse.isPegasus) return { success: false, reason: 'Already a Pegasus' };
  if (horse.isWinged) return { success: false, reason: 'Winged horses cannot ascend' };

  horse.isPegasus = true;

  // Apply stat bonuses
  horse.stats.stamina = Math.min(STAT_CAP, Math.round(horse.stats.stamina * PEGASUS_BONUSES.stamina));
  horse.stats.recovery = Math.min(STAT_CAP, Math.round(horse.stats.recovery * PEGASUS_BONUSES.recovery));

  return {
    success: true,
    message: `${horse.name} has ascended to Pegasus!`,
    newStats: { ...horse.stats }
  };
}

export function hasAscendedSynergy(horse, dragon) {
  if (!horse.isPegasus || !dragon) return false;
  const { DRAGON_TYPES } = require('../data/dragons.js');
  const typeData = DRAGON_TYPES[dragon.type];
  return typeData?.affinityMatch === horse.breed;
}

export function getAscendedSynergyBonus() {
  return {
    statMultiplier: 1.08,  // +8% all stats
    mutationBonus: 0.05,   // +5% mutation chance in breeding
    competitionBonus: 1.1  // +10% competition score
  };
}

export function getWingedHorseCeiling(horse) {
  if (!horse.isWinged) return STAT_CAP;
  return WINGED_HORSE_RULES.statCeiling;
}

export function isWingedCapped(horse) {
  if (!horse.isWinged) return false;
  const ceiling = WINGED_HORSE_RULES.statCeiling;
  return Object.values(horse.stats).some(s => s >= ceiling);
}
