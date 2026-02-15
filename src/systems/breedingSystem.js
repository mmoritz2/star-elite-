// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Breeding System
// ============================================================

import { BREEDS, STAT_NAMES, STAT_CAP } from '../data/breeds.js';
import { createHorse, generateHorseName } from './horseSystem.js';
import { generateId, chance, pick, randomFloat, clamp, gaussianRandom } from '../utils/random.js';

export function calculateCompatibility(horseA, horseB) {
  let compatibility = 50; // base

  // Same affinity bonus: +10
  if (horseA.affinity === horseB.affinity) {
    compatibility += 10;
  }

  // Complementary stat build: +15
  const statsA = STAT_NAMES.map(s => horseA.stats[s]);
  const statsB = STAT_NAMES.map(s => horseB.stats[s]);
  const maxStatA = STAT_NAMES[statsA.indexOf(Math.max(...statsA))];
  const maxStatB = STAT_NAMES[statsB.indexOf(Math.max(...statsB))];
  if (maxStatA !== maxStatB) {
    compatibility += 15;
  }

  // Shared training history: +5
  const sharedTraining = horseA.trainingHistory.filter(t =>
    horseB.trainingHistory.includes(t)
  );
  if (sharedTraining.length >= 3) {
    compatibility += 5;
  }

  // Breed diversity bonus
  if (horseA.breed !== horseB.breed) {
    compatibility += 5;
  }

  // Level proximity bonus
  const levelDiff = Math.abs(horseA.level - horseB.level);
  if (levelDiff <= 5) {
    compatibility += 5;
  }

  // High mastery bonus
  if (horseA.masteryLevel >= 1 && horseB.masteryLevel >= 1) {
    compatibility += 5;
  }

  // Pegasus bonus
  if (horseA.isPegasus || horseB.isPegasus) {
    compatibility += 5;
  }

  return clamp(compatibility, 0, 100);
}

export function breed(horseA, horseB, dragonBoost = null) {
  if (horseA.isWinged || horseB.isWinged) {
    return { success: false, reason: 'Winged horses cannot breed.' };
  }
  if (horseA.injured || horseB.injured) {
    return { success: false, reason: 'Injured horses cannot breed.' };
  }

  const compatibility = calculateCompatibility(horseA, horseB);

  // Choose breed — weighted toward higher-level parent
  const breedPool = [horseA.breed, horseB.breed];
  const childBreed = horseA.level >= horseB.level ? breedPool[0] : breedPool[1];

  // Stat inheritance: (ParentA + ParentB) / 2 + mutation roll
  const childStats = {};
  const mutations = [];

  for (const stat of STAT_NAMES) {
    const avgStat = (horseA.stats[stat] + horseB.stats[stat]) / 2;
    let mutationRoll = 0;

    // 7% minor stat bump mutation
    if (chance(0.07 + (dragonBoost?.mutationBonus || 0))) {
      mutationRoll = randomFloat(2, 8);
      mutations.push({ stat, type: 'minor_bump', value: Math.round(mutationRoll * 10) / 10 });
    }

    // Compatibility scaling
    const compatMultiplier = 1 + (compatibility - 50) / 200; // range: 0.75 - 1.25

    childStats[stat] = clamp(
      Math.round((avgStat + mutationRoll) * compatMultiplier),
      1,
      STAT_CAP
    );
  }

  // Coat inheritance
  let coat, coatRarity;
  const rareChanceBoost = compatibility >= 80 ? 0.02 : 0;

  if (chance(0.01 + rareChanceBoost + (dragonBoost?.mutationBonus || 0) * 0.5)) {
    // Shimmer coat
    const breed = BREEDS[childBreed];
    coat = breed.coats.shimmer;
    coatRarity = 'shimmer';
    mutations.push({ type: 'shimmer_coat' });
  } else if (chance(0.05 + rareChanceBoost)) {
    // Rare coat
    const breed = BREEDS[childBreed];
    coat = breed.coats.rare[0];
    coatRarity = 'rare';
    mutations.push({ type: 'rare_coat' });
  } else {
    // Standard coat from either parent
    coat = chance(0.5)
      ? BREEDS[horseA.breed].coats.standard[0]
      : BREEDS[horseB.breed].coats.standard[0];
    coatRarity = 'common';
  }

  // Carrier genes from parents
  const carrierGenes = [];
  if (horseA.isShimmer || horseB.isShimmer) {
    if (chance(0.15)) carrierGenes.push('shimmer_carrier');
  }
  if (horseA.isPegasus || horseB.isPegasus) {
    if (chance(0.1)) carrierGenes.push('pegasus_affinity');
  }

  // Affinity inheritance
  let affinity;
  if (compatibility >= 70) {
    affinity = chance(0.5) ? horseA.affinity : horseB.affinity;
  } else {
    affinity = pick(['sprint', 'endurance', 'precision', 'power', 'balanced']);
  }

  // Create the foal
  const foal = createHorse(childBreed, {
    name: generateHorseName(),
    parentA: horseA.id,
    parentB: horseB.id,
    generation: Math.max(horseA.generation, horseB.generation) + 1,
    affinity,
    summonSource: 'bred'
  });

  // Override generated stats with bred stats
  foal.stats = childStats;
  foal.coat = coat;
  foatRarity: coatRarity;
  foal.isShimmer = coatRarity === 'shimmer';
  foal.carrierGenes = carrierGenes;

  // Pegasus gene from parents
  if (horseA.isPegasus && horseB.isPegasus) {
    if (chance(0.25)) {
      foal.isPegasus = true;
      mutations.push({ type: 'inherited_pegasus' });
    }
  } else if (horseA.isPegasus || horseB.isPegasus) {
    if (chance(0.05)) {
      foal.isPegasus = true;
      mutations.push({ type: 'inherited_pegasus' });
    }
  }

  return {
    success: true,
    foal,
    compatibility,
    mutations,
    parents: { a: horseA.id, b: horseB.id }
  };
}

export function getCompatibilityLabel(score) {
  if (score >= 90) return { label: 'Perfect Match', color: '#ffd700' };
  if (score >= 75) return { label: 'Excellent', color: '#51cf66' };
  if (score >= 60) return { label: 'Good', color: '#339af0' };
  if (score >= 40) return { label: 'Fair', color: '#ff922b' };
  return { label: 'Poor', color: '#ff6b6b' };
}
