// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Competition System
// ============================================================

import { COMPETITION_TYPES, RANKS, HARDCORE_MULTIPLIER, getRank } from '../data/competitions.js';
import { STAT_NAMES } from '../data/breeds.js';
import { getEffectiveStats } from './horseSystem.js';
import { getDragonStatBonus } from '../data/dragons.js';
import { randomFloat, randomInt, chance, gaussianRandom, clamp } from '../utils/random.js';

export function runCompetition(horse, competitionId, dragon = null, isHardcore = false, injuryReduction = 0) {
  const comp = COMPETITION_TYPES[competitionId];
  if (!comp) return { success: false, reason: 'Unknown competition type' };

  if (horse.injured) return { success: false, reason: 'Horse is injured' };
  if (horse.fatigue >= 90) return { success: false, reason: 'Horse is too fatigued' };

  // Check requirements
  if (comp.requiresWinged && !horse.isPegasus && !horse.isWinged) {
    return { success: false, reason: 'Only Pegasus or Winged horses can enter' };
  }
  if (comp.requiresDragon && !dragon) {
    return { success: false, reason: 'Must have a bonded dragon' };
  }

  const effectiveStats = getEffectiveStats(horse, dragon);

  // Generate opponents
  const opponents = generateOpponents(horse.level, comp, 5);

  // Score the player's horse
  const playerScore = calculateScore(effectiveStats, comp, isHardcore);

  // Score opponents
  const opponentScores = opponents.map(opp => ({
    name: opp.name,
    score: calculateScore(opp.stats, comp, false) // AI doesn't get hardcore bonus
  }));

  // Determine placement
  const allScores = [
    { name: horse.name, score: playerScore, isPlayer: true },
    ...opponentScores.map(o => ({ ...o, isPlayer: false }))
  ].sort((a, b) => b.score - a.score);

  const placement = allScores.findIndex(s => s.isPlayer) + 1;
  const totalEntrants = allScores.length;

  // Points awarded
  const placementPoints = calculatePlacementPoints(placement, totalEntrants, comp);
  const hardcoreBonus = isHardcore ? Math.round(placementPoints * (HARDCORE_MULTIPLIER - 1)) : 0;
  const totalPoints = placementPoints + hardcoreBonus;

  // Injury check
  const injuryChance = calculateInjuryChance(horse, comp, injuryReduction, isHardcore);
  let injuryOccurred = false;
  let injurySeverity = null;
  if (chance(injuryChance)) {
    injuryOccurred = true;
    injurySeverity = chance(0.3) ? 'major' : 'minor';
  }

  // XP and rewards
  const xpGained = Math.round(20 + (totalEntrants - placement) * 15 + horse.level * 2);
  const coinsWon = placement <= 3 ? Math.round((4 - placement) * 50 * (comp.rounds || 1)) : 10;
  const prestigeGained = placement === 1 ? Math.round(25 * (comp.rounds || 1)) : placement <= 3 ? 10 : 2;

  // Fatigue from competition
  const fatigueGain = 15 + (comp.rounds || 1) * 8;

  // Dragon energy cost
  let dragonEnergyCost = 0;
  if (comp.requiresDragon && dragon) {
    dragonEnergyCost = 40;
  }

  // Build round-by-round breakdown for multi-round comps
  const roundBreakdown = [];
  if (comp.rounds > 1) {
    for (let i = 0; i < comp.rounds; i++) {
      const roundScore = calculateScore(effectiveStats, comp, isHardcore) * randomFloat(0.9, 1.1);
      roundBreakdown.push({
        round: i + 1,
        score: Math.round(roundScore),
        highlight: roundScore > playerScore ? 'exceptional' : 'standard'
      });
    }
  }

  return {
    success: true,
    competitionId,
    competitionName: comp.name,
    placement,
    totalEntrants,
    playerScore: Math.round(playerScore),
    scores: allScores.map(s => ({ ...s, score: Math.round(s.score) })),
    pointsEarned: totalPoints,
    hardcoreBonus,
    xpGained,
    coinsWon,
    prestigeGained,
    injuryOccurred,
    injurySeverity,
    fatigueGain,
    dragonEnergyCost,
    roundBreakdown,
    isHardcore
  };
}

function calculateScore(stats, comp, isHardcore) {
  let score = 0;
  for (const [stat, weight] of Object.entries(comp.statWeights)) {
    const statValue = stats[stat] || 50;
    score += statValue * weight;
  }

  // Random performance variance (simulates "on the day" performance)
  const variance = gaussianRandom(1.0, 0.08);
  score *= clamp(variance, 0.75, 1.25);

  // Hardcore small penalty for risk
  if (isHardcore) {
    score *= 0.98; // slight disadvantage for risk/reward
  }

  return score;
}

function calculateInjuryChance(horse, comp, injuryReduction, isHardcore) {
  let baseChance = comp.injuryBaseChance;

  // Stat weakness factor
  const weakStat = comp.injuryStatFactor;
  if (horse.stats[weakStat] < 40) {
    baseChance += 0.05;
  } else if (horse.stats[weakStat] > 80) {
    baseChance -= 0.02;
  }

  // Temperament factor
  if (horse.stats.temperament < 30) {
    baseChance += 0.04;
  }

  // Fatigue factor
  if (horse.fatigue > 60) {
    baseChance += 0.03;
  }

  // Condition factor
  if (horse.condition < 70) {
    baseChance += 0.03;
  }

  // Hardcore increases injury risk
  if (isHardcore) {
    baseChance *= 1.5;
  }

  // Ranch pasture reduction
  baseChance *= (1 - injuryReduction);

  return clamp(baseChance, 0, 0.5);
}

function calculatePlacementPoints(placement, total, comp) {
  const basePoints = Math.round(100 * (comp.rounds || 1));
  if (placement === 1) return basePoints;
  if (placement === 2) return Math.round(basePoints * 0.7);
  if (placement === 3) return Math.round(basePoints * 0.5);
  if (placement <= Math.ceil(total / 2)) return Math.round(basePoints * 0.25);
  return Math.round(basePoints * 0.1);
}

function generateOpponents(playerLevel, comp, count) {
  const opponents = [];
  for (let i = 0; i < count; i++) {
    const levelVariance = randomInt(-3, 5);
    const oppLevel = clamp(playerLevel + levelVariance, 1, 50);
    const stats = {};

    for (const stat of STAT_NAMES) {
      const base = 30 + oppLevel * 1.8;
      stats[stat] = Math.round(base + randomFloat(-10, 10));
    }

    // Bias one stat based on competition focus
    const focusStat = Object.entries(comp.statWeights)
      .sort((a, b) => b[1] - a[1])[0][0];
    stats[focusStat] = Math.round(stats[focusStat] * randomFloat(1.0, 1.3));

    opponents.push({
      name: generateOpponentName(),
      level: oppLevel,
      stats
    });
  }
  return opponents;
}

const OPP_NAMES = [
  'Rival\'s Pride', 'Northern Star', 'Desert Wind', 'Iron Gallop',
  'Queen\'s Grace', 'Dark Thunder', 'Pacific Storm', 'Highland Echo',
  'Valley Swift', 'Coastal Blaze', 'Mountain King', 'River Dance',
  'Sunset Fury', 'Frozen Heart', 'Golden Arrow', 'Silver Reign',
  'Night Whisper', 'Steel Tempest', 'Ember Crown', 'Crystal Wing'
];

let oppNameIdx = 0;
function generateOpponentName() {
  const name = OPP_NAMES[oppNameIdx % OPP_NAMES.length];
  oppNameIdx++;
  return name;
}
