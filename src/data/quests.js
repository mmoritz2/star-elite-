// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Quest System
// ============================================================

export const QUEST_TYPES = {
  daily: 'daily',
  weekly: 'weekly',
  story: 'story',
  mythic: 'mythic',
  celestial: 'celestial'
};

export const DAILY_QUEST_POOL = [
  { id: 'daily_train_1', name: 'Morning Drills', description: 'Complete 3 training sessions.', requirement: { type: 'train', count: 3 }, reward: { coins: 50, xp: 30 } },
  { id: 'daily_compete_1', name: 'Daily Gallop', description: 'Enter 1 competition.', requirement: { type: 'compete', count: 1 }, reward: { coins: 75, xp: 50 } },
  { id: 'daily_breed_1', name: 'Stable Care', description: 'Feed and groom a horse.', requirement: { type: 'care', count: 1 }, reward: { coins: 30, xp: 20 } },
  { id: 'daily_summon_1', name: 'Lucky Draw', description: 'Perform 1 summon.', requirement: { type: 'summon', count: 1 }, reward: { coins: 40, gems: 2 } },
  { id: 'daily_win_1', name: 'Victor\'s Lap', description: 'Win a competition.', requirement: { type: 'win', count: 1 }, reward: { coins: 100, xp: 75 } }
];

export const WEEKLY_QUEST_POOL = [
  { id: 'weekly_compete_5', name: 'Weekly Circuit', description: 'Compete in 5 events.', requirement: { type: 'compete', count: 5 }, reward: { coins: 300, gems: 10 } },
  { id: 'weekly_train_10', name: 'Dedicated Trainer', description: 'Complete 10 training sessions.', requirement: { type: 'train', count: 10 }, reward: { coins: 200, gems: 5, xp: 150 } },
  { id: 'weekly_breed_3', name: 'Bloodline Builder', description: 'Breed 3 horses.', requirement: { type: 'breed', count: 3 }, reward: { coins: 250, gems: 8 } },
  { id: 'weekly_win_3', name: 'Triple Crown', description: 'Win 3 competitions.', requirement: { type: 'win', count: 3 }, reward: { coins: 500, gems: 15 } }
];

export const STORY_QUESTS = {
  meadow_origins: {
    id: 'meadow_origins',
    name: 'Meadow Origins',
    region: 1,
    chapters: [
      { id: 'mo_1', name: 'First Ride', description: 'Bond with your starter horse and complete your first training session.', requirement: { type: 'train', count: 1 }, reward: { coins: 100, xp: 50 } },
      { id: 'mo_2', name: 'Into the Ring', description: 'Enter your first Sprint competition.', requirement: { type: 'compete_type', compType: 'sprint', count: 1 }, reward: { coins: 150, xp: 75 } },
      { id: 'mo_3', name: 'A Promising Start', description: 'Win a Sprint competition.', requirement: { type: 'win_type', compType: 'sprint', count: 1 }, reward: { coins: 200, xp: 100, prestige: 100 } },
      { id: 'mo_4', name: 'The Breeder\'s Way', description: 'Breed your first foal.', requirement: { type: 'breed', count: 1 }, reward: { coins: 300, xp: 150, prestige: 150 } },
      { id: 'mo_5', name: 'Meadow Champion', description: 'Reach Silver rank in Sprint.', requirement: { type: 'rank', rank: 'silver', compType: 'sprint' }, reward: { coins: 500, gems: 10, prestige: 250, title: 'Meadow Champion' } }
    ]
  },
  timber_tales: {
    id: 'timber_tales',
    name: 'Timber Tales',
    region: 2,
    chapters: [
      { id: 'tt_1', name: 'Forest Trails', description: 'Enter an Endurance competition.', requirement: { type: 'compete_type', compType: 'endurance', count: 1 }, reward: { coins: 200, xp: 100 } },
      { id: 'tt_2', name: 'Bloodline Analysis', description: 'Check compatibility between two horses.', requirement: { type: 'check_compatibility', count: 1 }, reward: { coins: 150, xp: 75 } },
      { id: 'tt_3', name: 'Ridge Runner', description: 'Win 3 Endurance events.', requirement: { type: 'win_type', compType: 'endurance', count: 3 }, reward: { coins: 400, gems: 5, prestige: 300 } },
      { id: 'tt_4', name: 'Deep Woods', description: 'Train a horse to level 20.', requirement: { type: 'horse_level', level: 20 }, reward: { coins: 500, gems: 10, prestige: 400, title: 'Trail Master' } }
    ]
  },
  mythic_awakening: {
    id: 'mythic_awakening',
    name: 'Mythic Awakening',
    region: 4,
    type: 'mythic',
    chapters: [
      { id: 'ma_1', name: 'Whispers of Fire', description: 'Summon your first Dragon Shard.', requirement: { type: 'summon_dragon', count: 1 }, reward: { coins: 500, gems: 20 } },
      { id: 'ma_2', name: 'The Bond Ignites', description: 'Upgrade a dragon to Young tier.', requirement: { type: 'dragon_tier', tier: 'young' }, reward: { coins: 750, gems: 25, prestige: 500 } },
      { id: 'ma_3', name: 'Trial by Dragonfire', description: 'Win a Dragon Trial.', requirement: { type: 'win_type', compType: 'dragon_trials', count: 1 }, reward: { coins: 1000, gems: 50, prestige: 1000 } },
      { id: 'ma_4', name: 'Elder Ascendant', description: 'Upgrade a dragon to Elder tier.', requirement: { type: 'dragon_tier', tier: 'elder' }, reward: { coins: 2500, gems: 100, prestige: 2000, title: 'Dragonlord' } }
    ]
  },
  celestial_circuit: {
    id: 'celestial_circuit',
    name: 'Celestial Circuit',
    region: 5,
    type: 'celestial',
    chapters: [
      { id: 'cc_1', name: 'The Ascension Call', description: 'Have a horse reach level 40 with Gold rank.', requirement: { type: 'horse_level_rank', level: 40, rank: 'gold' }, reward: { coins: 1000, gems: 30 } },
      { id: 'cc_2', name: 'Wings of Light', description: 'Ascend a horse to Pegasus.', requirement: { type: 'ascend_pegasus', count: 1 }, reward: { coins: 2000, gems: 50, prestige: 1500 } },
      { id: 'cc_3', name: 'Sky Invitational Debut', description: 'Compete in the Sky Invitational.', requirement: { type: 'compete_type', compType: 'sky_invitational', count: 1 }, reward: { coins: 1500, gems: 40, prestige: 1000 } },
      { id: 'cc_4', name: 'Starbound', description: 'Win the Sky Invitational with an Ascended Pegasus + Elder Dragon synergy.', requirement: { type: 'win_synergy_sky' }, reward: { coins: 5000, gems: 200, prestige: 5000, title: 'Starbound' } }
    ]
  }
};

export const TITLES = [
  { id: 'meadow_champion', name: 'Meadow Champion', source: 'meadow_origins' },
  { id: 'trail_master', name: 'Trail Master', source: 'timber_tales' },
  { id: 'dragonlord', name: 'Dragonlord', source: 'mythic_awakening' },
  { id: 'starbound', name: 'Starbound', source: 'celestial_circuit' },
  { id: 'grand_elite', name: 'Grand Elite', source: 'season_rank' },
  { id: 'hardcore_survivor', name: 'Hardcore Survivor', source: 'hardcore_completion' }
];
