// ============================================================
// STARBOUND: ELITE EQUESTRIAN — World Regions
// ============================================================

export const REGIONS = {
  meadow_circuit: {
    id: 'meadow_circuit',
    name: 'Meadow Circuit',
    number: 1,
    focus: 'Fundamentals',
    description: 'Calm countryside where every equestrian begins. Learn the basics of riding, training, and competition.',
    unlocks: ['warmblood', 'sprint_competition', 'basic_breeding', 'starter_quests'],
    requiredPrestige: 0,
    tone: 'Rolling green hills, white fences, golden sunlight.',
    color: '#7cb342',
    bgGradient: ['#c5e1a5', '#7cb342'],
    competitions: ['sprint'],
    questLines: ['meadow_origins'],
    icon: '🌿'
  },
  timber_ridge: {
    id: 'timber_ridge',
    name: 'Timber Ridge',
    number: 2,
    focus: 'Endurance',
    description: 'Dense forests and mountain trails that test a horse\'s stamina and rider\'s strategy.',
    unlocks: ['thoroughbred', 'cross_country', 'compatibility_system', 'advanced_training'],
    requiredPrestige: 500,
    tone: 'Ancient oak forests, dirt trails, autumn foliage.',
    color: '#8d6e63',
    bgGradient: ['#d7ccc8', '#8d6e63'],
    competitions: ['sprint', 'endurance'],
    questLines: ['timber_tales'],
    icon: '🌲'
  },
  coastline_arena: {
    id: 'coastline_arena',
    name: 'Coastline Arena',
    number: 3,
    focus: 'Precision',
    description: 'Gleaming seaside arenas where precision and elegance reign supreme.',
    unlocks: ['friesian_sport', 'precision_competition', 'mastery_system', 'ranch_upgrades'],
    requiredPrestige: 1500,
    tone: 'Ocean breeze, marble arenas, blue and white flags.',
    color: '#039be5',
    bgGradient: ['#b3e5fc', '#039be5'],
    competitions: ['sprint', 'endurance', 'precision'],
    questLines: ['coastal_legends'],
    icon: '🌊'
  },
  highland_trials: {
    id: 'highland_trials',
    name: 'Highland Trials',
    number: 4,
    focus: 'Elite Circuit',
    description: 'The brutal highland proving grounds where only the elite survive.',
    unlocks: ['highland_warmblood', 'national_championship', 'winged_banner', 'dragon_summoning'],
    requiredPrestige: 4000,
    tone: 'Snow-capped peaks, stone fortresses, thunderstorms.',
    color: '#5e35b1',
    bgGradient: ['#d1c4e9', '#5e35b1'],
    competitions: ['sprint', 'endurance', 'precision', 'grand_cup'],
    questLines: ['highland_sagas', 'mythic_awakening'],
    icon: '⛰️'
  },
  celestial_grounds: {
    id: 'celestial_grounds',
    name: 'Celestial Grounds',
    number: 5,
    focus: 'Endgame',
    description: 'Where the sky meets the earth. The ultimate proving ground for ascended champions.',
    unlocks: ['celestial_line', 'pegasus_ascension', 'dragon_trials', 'sky_invitational'],
    requiredPrestige: 10000,
    tone: 'Floating arenas, aurora skies, ethereal glow.',
    color: '#f9a825',
    bgGradient: ['#fff9c4', '#f9a825'],
    competitions: ['sprint', 'endurance', 'precision', 'grand_cup', 'sky_invitational', 'dragon_trials'],
    questLines: ['celestial_circuit', 'ascended_lineage'],
    icon: '✨'
  }
};

export function getRegionByNumber(num) {
  return Object.values(REGIONS).find(r => r.number === num);
}

export function getUnlockedRegions(prestige) {
  return Object.values(REGIONS).filter(r => prestige >= r.requiredPrestige);
}
