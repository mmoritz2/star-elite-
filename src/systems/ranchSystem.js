// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Ranch System
// ============================================================

import { FACILITIES, DECOR_ITEMS, RANCH_PARTY, getFacilityCost, getFacilityEffect } from '../data/ranch.js';

export function upgradeFacility(ranchState, facilityId, playerCoins) {
  const facility = FACILITIES[facilityId];
  if (!facility) return { success: false, reason: 'Unknown facility' };

  const currentLevel = ranchState.facilities[facilityId] || 0;
  if (currentLevel >= facility.maxLevel) {
    return { success: false, reason: 'Already at max level' };
  }

  const cost = getFacilityCost(facilityId, currentLevel);
  if (playerCoins < cost) {
    return { success: false, reason: `Need ${cost} coins (have ${playerCoins})`, cost };
  }

  ranchState.facilities[facilityId] = currentLevel + 1;
  const effect = getFacilityEffect(facilityId, currentLevel + 1);

  return {
    success: true,
    facility: facility.name,
    newLevel: currentLevel + 1,
    maxLevel: facility.maxLevel,
    cost,
    effect
  };
}

export function buyDecor(ranchState, decorId, playerCoins) {
  const decor = DECOR_ITEMS[decorId];
  if (!decor) return { success: false, reason: 'Unknown decor item' };

  if (ranchState.decor.includes(decorId)) {
    return { success: false, reason: 'Already owned' };
  }

  if (playerCoins < decor.cost) {
    return { success: false, reason: `Need ${decor.cost} coins` };
  }

  ranchState.decor.push(decorId);

  return {
    success: true,
    item: decor.name,
    cost: decor.cost,
    bonus: decor.bonus
  };
}

export function getRanchBonuses(ranchState) {
  const bonuses = {
    stableCapacity: 3,
    xpBoost: 0,
    weatherImmunity: 0,
    injuryReduction: 0,
    energyRegenBonus: 0,
    temperamentBonus: 0,
    recoveryBonus: 0,
    prestigeBonus: 0
  };

  // Facility bonuses
  for (const [facilityId, level] of Object.entries(ranchState.facilities)) {
    if (level <= 0) continue;
    const effect = getFacilityEffect(facilityId, level);
    if (!effect) continue;

    if (effect.capacity) bonuses.stableCapacity = effect.capacity;
    if (effect.xpBoost) bonuses.xpBoost += effect.xpBoost;
    if (effect.weatherImmunity) bonuses.weatherImmunity = effect.weatherImmunity;
    if (effect.injuryReduction) bonuses.injuryReduction += effect.injuryReduction;
    if (effect.energyRegenBonus) bonuses.energyRegenBonus += effect.energyRegenBonus;
  }

  // Decor bonuses
  for (const decorId of ranchState.decor) {
    const decor = DECOR_ITEMS[decorId];
    if (!decor) continue;
    for (const [key, val] of Object.entries(decor.bonus)) {
      if (bonuses[key] !== undefined) {
        bonuses[key] += val;
      } else if (key === 'temperament') {
        bonuses.temperamentBonus += val;
      } else if (key === 'recovery') {
        bonuses.recoveryBonus += val;
      } else if (key === 'prestige') {
        bonuses.prestigeBonus += val;
      }
    }
  }

  return bonuses;
}

export function startRanchParty(ranchState) {
  const now = Date.now();
  const cooldownEnd = ranchState.partyLastUsed + (RANCH_PARTY.cooldown * 60 * 1000);

  if (now < cooldownEnd) {
    const minutesLeft = Math.ceil((cooldownEnd - now) / (60 * 1000));
    return { success: false, reason: `Party on cooldown. ${minutesLeft} minutes remaining.` };
  }

  ranchState.partyActive = true;
  ranchState.partyLastUsed = now;

  return {
    success: true,
    buffs: RANCH_PARTY.buffs,
    duration: RANCH_PARTY.duration,
    socialReward: RANCH_PARTY.socialReward
  };
}

export function isPartyActive(ranchState) {
  if (!ranchState.partyActive) return false;
  const elapsed = (Date.now() - ranchState.partyLastUsed) / (60 * 1000);
  if (elapsed >= RANCH_PARTY.duration) {
    ranchState.partyActive = false;
    return false;
  }
  return true;
}

export function getRanchSummary(ranchState) {
  const bonuses = getRanchBonuses(ranchState);
  const facilities = Object.entries(ranchState.facilities).map(([id, level]) => {
    const data = FACILITIES[id];
    return {
      id,
      name: data?.name || id,
      level,
      maxLevel: data?.maxLevel || 0,
      icon: data?.icon || '',
      nextCost: level < (data?.maxLevel || 0) ? getFacilityCost(id, level) : null
    };
  });

  return {
    facilities,
    decor: ranchState.decor.map(id => DECOR_ITEMS[id]).filter(Boolean),
    bonuses,
    partyActive: isPartyActive(ranchState)
  };
}
