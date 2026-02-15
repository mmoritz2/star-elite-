// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Horse System
// ============================================================

import { BREEDS, STAT_NAMES, STAT_CAP, LEVEL_CAP } from '../data/breeds.js';
import { generateId, chance, pick, randomFloat, randomInt, clamp, gaussianRandom } from '../utils/random.js';

export function createHorse(breedId, options = {}) {
  const breed = BREEDS[breedId];
  if (!breed) throw new Error(`Unknown breed: ${breedId}`);

  const coat = rollCoat(breed);
  const stats = {};
  const statGrowth = {};

  for (const stat of STAT_NAMES) {
    const base = breed.baseStats[stat];
    const variance = randomFloat(-5, 5);
    stats[stat] = Math.round(clamp(base + variance, 1, STAT_CAP));
    statGrowth[stat] = breed.statBias[stat] + randomFloat(-0.05, 0.05);
  }

  return {
    id: options.id || generateId(),
    name: options.name || generateHorseName(),
    breed: breedId,
    breedName: breed.name,
    level: 1,
    xp: 0,
    xpToNext: 100,
    stats,
    statGrowth,
    coat: coat.name,
    coatRarity: coat.rarity,
    isShimmer: coat.rarity === 'shimmer',
    traits: [],
    carrierGenes: [],
    isPegasus: false,
    isWinged: options.isWinged || false,
    wingedFixed: options.isWinged || false,
    bondedDragonId: null,
    parentA: options.parentA || null,
    parentB: options.parentB || null,
    generation: options.generation || 0,
    mastery: 0,
    masteryLevel: 0,
    condition: 100,
    injured: false,
    injuryDaysLeft: 0,
    fatigue: 0,
    affinity: options.affinity || pick(['sprint', 'endurance', 'precision', 'power', 'balanced']),
    totalWins: 0,
    totalRaces: 0,
    trainingHistory: [],
    createdAt: Date.now(),
    rarity: breed.rarity,
    summonSource: options.summonSource || 'starter'
  };
}

function rollCoat(breed) {
  const roll = Math.random();
  if (roll < 0.01) {
    return { name: breed.coats.shimmer, rarity: 'shimmer' };
  } else if (roll < 0.06) {
    return { name: breed.coats.rare[0], rarity: 'rare' };
  } else {
    return { name: pick(breed.coats.standard), rarity: 'common' };
  }
}

export function trainHorse(horse, statFocus, xpBoost = 0) {
  if (horse.injured) return { success: false, reason: 'Horse is injured' };
  if (horse.level >= LEVEL_CAP) return { success: false, reason: 'Max level reached' };
  if (horse.fatigue >= 100) return { success: false, reason: 'Horse is exhausted' };

  const baseXP = 25 + horse.level * 2;
  const totalXP = Math.round(baseXP * (1 + xpBoost));
  horse.xp += totalXP;

  // Stat gain from focused training
  const statGain = randomFloat(0.3, 0.8) * horse.statGrowth[statFocus];
  horse.stats[statFocus] = Math.min(STAT_CAP, Math.round((horse.stats[statFocus] + statGain) * 10) / 10);

  // Minor random stat gain
  const secondaryStat = pick(STAT_NAMES.filter(s => s !== statFocus));
  const secondaryGain = randomFloat(0.1, 0.3) * horse.statGrowth[secondaryStat];
  horse.stats[secondaryStat] = Math.min(STAT_CAP, Math.round((horse.stats[secondaryStat] + secondaryGain) * 10) / 10);

  // Fatigue
  horse.fatigue = Math.min(100, horse.fatigue + randomInt(8, 15));

  // Level up check
  let leveledUp = false;
  while (horse.xp >= horse.xpToNext && horse.level < LEVEL_CAP) {
    horse.xp -= horse.xpToNext;
    horse.level++;
    horse.xpToNext = calculateXPToNext(horse.level);
    leveledUp = true;
    onLevelUp(horse);
  }

  horse.trainingHistory.push(statFocus);

  return {
    success: true,
    xpGained: totalXP,
    statFocus,
    statGain: Math.round(statGain * 10) / 10,
    secondaryStat,
    secondaryGain: Math.round(secondaryGain * 10) / 10,
    leveledUp,
    newLevel: horse.level
  };
}

function calculateXPToNext(level) {
  return Math.floor(100 * Math.pow(1.12, level - 1));
}

function onLevelUp(horse) {
  // All stats get a small bump on level up
  for (const stat of STAT_NAMES) {
    const gain = randomFloat(0.2, 0.5) * horse.statGrowth[stat];
    horse.stats[stat] = Math.min(STAT_CAP, Math.round((horse.stats[stat] + gain) * 10) / 10);
  }

  // Mastery progression
  if (horse.level % 10 === 0) {
    horse.masteryLevel++;
  }
}

export function restHorse(horse, hours = 1) {
  const recovery = hours * 5;
  horse.fatigue = Math.max(0, horse.fatigue - recovery);

  if (horse.injured) {
    // Rest doesn't heal injuries — they heal by day ticks
  }

  return { fatigue: horse.fatigue };
}

export function tickHorseDay(horse) {
  // Daily fatigue recovery
  horse.fatigue = Math.max(0, horse.fatigue - 15);

  // Injury countdown
  if (horse.injured && horse.injuryDaysLeft > 0) {
    horse.injuryDaysLeft--;
    if (horse.injuryDaysLeft <= 0) {
      horse.injured = false;
      horse.injuryDaysLeft = 0;
    }
  }

  // Condition drift toward 100
  if (horse.condition < 100) {
    horse.condition = Math.min(100, horse.condition + 5);
  }
}

export function injureHorse(horse, severity = 'minor') {
  horse.injured = true;
  horse.injuryDaysLeft = severity === 'minor' ? randomInt(1, 3) : randomInt(3, 7);
  horse.condition = Math.max(0, horse.condition - (severity === 'minor' ? 15 : 35));
}

export function getEffectiveStats(horse, dragon = null) {
  const effective = { ...horse.stats };

  // Pegasus bonuses
  if (horse.isPegasus) {
    effective.stamina = Math.min(STAT_CAP, effective.stamina * 1.05);
    effective.recovery = Math.min(STAT_CAP, effective.recovery * 1.03);
  }

  // Dragon synergy bonuses
  if (dragon) {
    const { getDragonStatBonus } = require('../data/dragons.js');
    const bonus = getDragonStatBonus(dragon.type, dragon.tier);
    for (const [stat, val] of Object.entries(bonus)) {
      if (effective[stat] !== undefined) {
        effective[stat] = Math.min(STAT_CAP, effective[stat] * (1 + val));
      }
    }
  }

  // Round all stats
  for (const stat of STAT_NAMES) {
    effective[stat] = Math.round(effective[stat]);
  }

  return effective;
}

export function getHorsePower(horse) {
  return STAT_NAMES.reduce((sum, s) => sum + horse.stats[s], 0);
}

const HORSE_NAMES_PREFIX = [
  'Shadow', 'Storm', 'Midnight', 'Golden', 'Silver', 'Thunder', 'Star', 'Crystal',
  'Noble', 'Royal', 'Mystic', 'Swift', 'Brave', 'Iron', 'Wild', 'Dawn',
  'Ember', 'Frost', 'Luna', 'Solar', 'Onyx', 'Ruby', 'Azure', 'Raven',
  'Phoenix', 'Ivory', 'Scarlet', 'Copper', 'Jade', 'Obsidian', 'Titan', 'Echo'
];

const HORSE_NAMES_SUFFIX = [
  'Runner', 'Dancer', 'Spirit', 'Wind', 'Fire', 'Heart', 'Dream', 'Song',
  'Blaze', 'Fury', 'Grace', 'Legend', 'Whisper', 'Flight', 'Crown', 'Steel',
  'Bolt', 'Crest', 'Dusk', 'Gale', 'Storm', 'Flame', 'Haven', 'Quest',
  'Valor', 'Wing', 'Arc', 'Reign', 'Sage', 'Fable', 'Peak', 'Spark'
];

export function generateHorseName() {
  return pick(HORSE_NAMES_PREFIX) + ' ' + pick(HORSE_NAMES_SUFFIX);
}
