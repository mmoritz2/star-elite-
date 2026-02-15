// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Summon (Gacha) System
// ============================================================

import { BREEDS } from '../data/breeds.js';
import { DRAGON_TYPES, DRAGON_TIERS } from '../data/dragons.js';
import { createHorse } from './horseSystem.js';
import { generateId, chance, pick, weightedPick } from '../utils/random.js';

export const BANNERS = {
  standard: {
    id: 'standard',
    name: 'Standard Banner',
    description: 'A mix of common and uncommon horses.',
    cost: { coins: 300 },
    pool: 'horses',
    rates: { common: 0.70, uncommon: 0.22, rare: 0.06, legendary: 0.015, shimmer: 0.005 },
    icon: '🏴'
  },
  champion_rotation: {
    id: 'champion_rotation',
    name: 'Champion Rotation',
    description: 'Increased chance for elite bloodlines.',
    cost: { gems: 5 },
    pool: 'horses',
    rates: { common: 0.50, uncommon: 0.30, rare: 0.13, legendary: 0.05, shimmer: 0.02 },
    icon: '🏅'
  },
  seasonal: {
    id: 'seasonal',
    name: 'Seasonal Banner',
    description: 'Limited-time seasonal horses with unique coats.',
    cost: { gems: 8 },
    pool: 'horses',
    rates: { common: 0.45, uncommon: 0.30, rare: 0.15, legendary: 0.07, shimmer: 0.03 },
    icon: '🌟'
  },
  skybound: {
    id: 'skybound',
    name: 'Skybound Banner',
    description: 'Chance to summon rare Winged Horses.',
    cost: { gems: 10 },
    pool: 'winged',
    rates: { common: 0.50, uncommon: 0.25, rare: 0.14, winged: 0.01, legendary: 0.07, shimmer: 0.03 },
    icon: '🪽'
  },
  elder_relics: {
    id: 'elder_relics',
    name: 'Elder Relics',
    description: 'Summon Dragon Shards and rare dragon essences.',
    cost: { gems: 12 },
    pool: 'dragons',
    rates: { shard: 0.60, young: 0.25, ancient: 0.10, elder: 0.04, true_dragon: 0.01 },
    icon: '🐉'
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial Banner',
    description: 'VIP banner with the highest legendary rates.',
    cost: { gems: 15 },
    pool: 'horses',
    rates: { common: 0.30, uncommon: 0.30, rare: 0.20, legendary: 0.13, shimmer: 0.07 },
    vipRequired: true,
    icon: '✨'
  }
};

export const PITY_THRESHOLDS = {
  elite: 20,       // guaranteed elite every 20 pulls
  legendary: 75,   // guaranteed legendary every 75 pulls
  dragonShard: 25,  // guaranteed shard every 25 dragon pulls
  trueDragon: 120   // guaranteed true dragon every 120 dragon pulls
};

export function performSummon(banner, summonState, playerRegion = 1) {
  const bannerData = BANNERS[banner];
  if (!bannerData) return { success: false, reason: 'Unknown banner' };

  summonState.totalSummons++;

  if (bannerData.pool === 'dragons') {
    return summonDragon(bannerData, summonState);
  } else {
    return summonHorse(bannerData, summonState, playerRegion);
  }
}

function summonHorse(bannerData, summonState, playerRegion) {
  summonState.pityCounterElite++;
  summonState.pityCounterLegendary++;

  let rarity;

  // Pity system
  if (summonState.pityCounterLegendary >= PITY_THRESHOLDS.legendary) {
    rarity = 'legendary';
    summonState.pityCounterLegendary = 0;
    summonState.pityCounterElite = 0;
  } else if (summonState.pityCounterElite >= PITY_THRESHOLDS.elite) {
    rarity = chance(0.3) ? 'legendary' : 'rare';
    summonState.pityCounterElite = 0;
  } else {
    // Normal roll
    const roll = Math.random();
    const rates = bannerData.rates;
    let cumulative = 0;

    if (rates.shimmer && roll < (cumulative += rates.shimmer)) {
      rarity = 'shimmer';
    } else if (rates.winged && roll < (cumulative += rates.winged)) {
      rarity = 'winged';
    } else if (rates.legendary && roll < (cumulative += rates.legendary)) {
      rarity = 'legendary';
    } else if (rates.rare && roll < (cumulative += rates.rare)) {
      rarity = 'rare';
    } else if (rates.uncommon && roll < (cumulative += rates.uncommon)) {
      rarity = 'uncommon';
    } else {
      rarity = 'common';
    }
  }

  // Reset pity on high-tier pulls
  if (rarity === 'legendary' || rarity === 'shimmer') {
    summonState.pityCounterLegendary = 0;
    summonState.pityCounterElite = 0;
  } else if (rarity === 'rare') {
    summonState.pityCounterElite = 0;
  }

  // Determine breed based on rarity and region access
  const breedId = pickBreedForRarity(rarity, playerRegion);
  const isWinged = rarity === 'winged';

  const horse = createHorse(breedId, {
    isWinged,
    summonSource: bannerData.id
  });

  // Force shimmer coat for shimmer rarity
  if (rarity === 'shimmer') {
    const breed = BREEDS[breedId];
    horse.coat = breed.coats.shimmer;
    horse.coatRarity = 'shimmer';
    horse.isShimmer = true;
  }

  const result = {
    success: true,
    type: 'horse',
    item: horse,
    rarity,
    isNew: true, // would check dex in full implementation
    banner: bannerData.id,
    pityElite: summonState.pityCounterElite,
    pityLegendary: summonState.pityCounterLegendary
  };

  summonState.history.unshift({
    type: 'horse',
    rarity,
    breed: breedId,
    coat: horse.coat,
    timestamp: Date.now()
  });

  return result;
}

function summonDragon(bannerData, summonState) {
  summonState.pityCounterDragonShard++;
  summonState.pityCounterTrueDragon++;

  let tier;

  // Dragon pity
  if (summonState.pityCounterTrueDragon >= PITY_THRESHOLDS.trueDragon) {
    tier = 'elder';
    summonState.pityCounterTrueDragon = 0;
    summonState.pityCounterDragonShard = 0;
  } else if (summonState.pityCounterDragonShard >= PITY_THRESHOLDS.dragonShard) {
    tier = 'young';
    summonState.pityCounterDragonShard = 0;
  } else {
    const roll = Math.random();
    const rates = bannerData.rates;
    let cumulative = 0;

    if (roll < (cumulative += rates.true_dragon || 0)) {
      tier = 'elder';
    } else if (roll < (cumulative += rates.ancient || 0)) {
      tier = 'ancient';
    } else if (roll < (cumulative += rates.young || 0)) {
      tier = 'young';
    } else {
      tier = 'shard';
    }
  }

  // Reset pity
  if (tier === 'elder') {
    summonState.pityCounterTrueDragon = 0;
    summonState.pityCounterDragonShard = 0;
  } else if (tier !== 'shard') {
    summonState.pityCounterDragonShard = 0;
  }

  const dragonType = pick(Object.keys(DRAGON_TYPES));

  const dragon = {
    id: generateId(),
    type: dragonType,
    typeName: DRAGON_TYPES[dragonType].name,
    tier,
    tierName: DRAGON_TIERS[tier].name,
    energy: DRAGON_TIERS[tier].energyCap,
    energyCap: DRAGON_TIERS[tier].energyCap,
    energyRegen: DRAGON_TIERS[tier].energyRegen,
    essencesInvested: 0,
    bondedHorseId: null,
    tradeCooldownEnd: 0,
    createdAt: Date.now()
  };

  const result = {
    success: true,
    type: 'dragon',
    item: dragon,
    rarity: tier,
    dragonType,
    banner: bannerData.id,
    pityDragonShard: summonState.pityCounterDragonShard,
    pityTrueDragon: summonState.pityCounterTrueDragon
  };

  summonState.history.unshift({
    type: 'dragon',
    tier,
    dragonType,
    timestamp: Date.now()
  });

  return result;
}

function pickBreedForRarity(rarity, playerRegion) {
  const availableBreeds = Object.values(BREEDS).filter(b => b.region <= playerRegion);

  if (rarity === 'legendary' || rarity === 'shimmer') {
    // Higher chance for advanced breeds
    const best = availableBreeds.sort((a, b) => b.region - a.region);
    return best[0]?.id || 'warmblood';
  } else if (rarity === 'rare' || rarity === 'winged') {
    // Pick from top two available
    const sorted = availableBreeds.sort((a, b) => b.region - a.region);
    return sorted.length > 1 ? pick(sorted.slice(0, 2)).id : sorted[0].id;
  } else {
    // Common/uncommon — any available
    return pick(availableBreeds).id;
  }
}

export function getDuplicateConversion(type, rarity) {
  if (type === 'horse') {
    const tokenValues = { common: 1, uncommon: 3, rare: 10, legendary: 25, shimmer: 50 };
    return { currency: 'spiritTokens', amount: tokenValues[rarity] || 1 };
  } else {
    const essenceValues = { shard: 2, young: 8, ancient: 20, elder: 50 };
    return { currency: 'dragonEssences', amount: essenceValues[rarity] || 2 };
  }
}
