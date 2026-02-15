// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Competition Modes
// ============================================================

export const COMPETITION_TYPES = {
  sprint: {
    id: 'sprint',
    name: 'Sprint',
    description: 'Pure speed. First across the finish line wins.',
    region: 1,
    statWeights: { speed: 0.45, power: 0.2, stamina: 0.15, temperament: 0.1, precision: 0.05, recovery: 0.05 },
    injuryBaseChance: 0.05,
    injuryStatFactor: 'stamina', // low stamina increases injury
    rounds: 1,
    icon: '🏇'
  },
  endurance: {
    id: 'endurance',
    name: 'Endurance',
    description: 'Long-distance trials. Only the toughest finish strong.',
    region: 2,
    statWeights: { stamina: 0.4, recovery: 0.2, power: 0.15, temperament: 0.15, speed: 0.05, precision: 0.05 },
    injuryBaseChance: 0.08,
    injuryStatFactor: 'recovery',
    rounds: 3,
    icon: '🏔️'
  },
  precision: {
    id: 'precision',
    name: 'Precision',
    description: 'Dressage and technical courses. Elegance is everything.',
    region: 3,
    statWeights: { precision: 0.4, temperament: 0.25, speed: 0.1, power: 0.1, stamina: 0.1, recovery: 0.05 },
    injuryBaseChance: 0.03,
    injuryStatFactor: 'temperament',
    rounds: 2,
    icon: '🎯'
  },
  grand_cup: {
    id: 'grand_cup',
    name: 'Grand Cup',
    description: 'The national championship. Tests every stat across multiple disciplines.',
    region: 4,
    statWeights: { speed: 0.2, stamina: 0.2, precision: 0.2, power: 0.2, temperament: 0.1, recovery: 0.1 },
    injuryBaseChance: 0.1,
    injuryStatFactor: 'temperament',
    rounds: 5,
    icon: '🏆'
  },
  sky_invitational: {
    id: 'sky_invitational',
    name: 'Sky Invitational',
    description: 'Aerial championship. Only Pegasus and Winged horses may enter.',
    region: 5,
    statWeights: { speed: 0.25, precision: 0.25, stamina: 0.2, temperament: 0.15, power: 0.1, recovery: 0.05 },
    injuryBaseChance: 0.06,
    injuryStatFactor: 'temperament',
    rounds: 3,
    requiresWinged: true,
    icon: '🪽'
  },
  dragon_trials: {
    id: 'dragon_trials',
    name: 'Dragon Trials',
    description: 'Compete alongside your bonded dragon. Synergy is key.',
    region: 5,
    statWeights: { power: 0.25, speed: 0.2, stamina: 0.2, temperament: 0.15, precision: 0.1, recovery: 0.1 },
    injuryBaseChance: 0.12,
    injuryStatFactor: 'recovery',
    rounds: 4,
    requiresDragon: true,
    icon: '🐉'
  }
};

export const SEASON_LENGTH = 30; // in-game days

export const RANKS = {
  bronze:      { id: 'bronze',      name: 'Bronze',      minPoints: 0,    color: '#cd7f32', reward: { coins: 100, gems: 0 } },
  silver:      { id: 'silver',      name: 'Silver',      minPoints: 200,  color: '#c0c0c0', reward: { coins: 250, gems: 5 } },
  gold:        { id: 'gold',        name: 'Gold',        minPoints: 500,  color: '#ffd700', reward: { coins: 500, gems: 15 } },
  platinum:    { id: 'platinum',    name: 'Platinum',    minPoints: 1000, color: '#e5e4e2', reward: { coins: 1000, gems: 30 } },
  grand_elite: { id: 'grand_elite', name: 'Grand Elite', minPoints: 2000, color: '#ff6f00', reward: { coins: 2500, gems: 75 } }
};

export function getRank(points) {
  const sorted = Object.values(RANKS).sort((a, b) => b.minPoints - a.minPoints);
  for (const rank of sorted) {
    if (points >= rank.minPoints) return rank;
  }
  return RANKS.bronze;
}

export const HARDCORE_MULTIPLIER = 1.5;
