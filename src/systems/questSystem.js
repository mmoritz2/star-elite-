// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Quest System
// ============================================================

import { DAILY_QUEST_POOL, WEEKLY_QUEST_POOL, STORY_QUESTS } from '../data/quests.js';
import { pick, shuffle, generateId } from '../utils/random.js';

export function generateDailyQuests(count = 3) {
  const shuffled = shuffle(DAILY_QUEST_POOL);
  return shuffled.slice(0, count).map(q => ({
    ...q,
    instanceId: generateId(),
    progress: 0,
    completed: false,
    claimed: false
  }));
}

export function generateWeeklyQuests(count = 2) {
  const shuffled = shuffle(WEEKLY_QUEST_POOL);
  return shuffled.slice(0, count).map(q => ({
    ...q,
    instanceId: generateId(),
    progress: 0,
    completed: false,
    claimed: false
  }));
}

export function updateQuestProgress(quests, eventType, amount = 1, details = {}) {
  const updates = [];

  for (const quest of quests) {
    if (quest.completed || quest.claimed) continue;

    let matches = false;

    switch (quest.requirement.type) {
      case 'train':
        matches = eventType === 'train';
        break;
      case 'compete':
        matches = eventType === 'compete';
        break;
      case 'win':
        matches = eventType === 'win';
        break;
      case 'breed':
        matches = eventType === 'breed';
        break;
      case 'summon':
        matches = eventType === 'summon';
        break;
      case 'care':
        matches = eventType === 'care';
        break;
      case 'compete_type':
        matches = eventType === 'compete' && details.compType === quest.requirement.compType;
        break;
      case 'win_type':
        matches = eventType === 'win' && details.compType === quest.requirement.compType;
        break;
      case 'check_compatibility':
        matches = eventType === 'check_compatibility';
        break;
      case 'horse_level':
        matches = eventType === 'level_up' && details.level >= quest.requirement.level;
        break;
      case 'summon_dragon':
        matches = eventType === 'summon_dragon';
        break;
      case 'dragon_tier':
        matches = eventType === 'dragon_upgrade' && details.tier === quest.requirement.tier;
        break;
      case 'ascend_pegasus':
        matches = eventType === 'ascend_pegasus';
        break;
      case 'rank':
        matches = eventType === 'rank_achieved' &&
          details.rank === quest.requirement.rank &&
          details.compType === quest.requirement.compType;
        break;
      case 'horse_level_rank':
        matches = eventType === 'level_up' && details.level >= quest.requirement.level;
        break;
      case 'win_synergy_sky':
        matches = eventType === 'win' && details.compType === 'sky_invitational' && details.hasSynergy;
        break;
    }

    if (matches) {
      quest.progress += amount;
      if (quest.progress >= (quest.requirement.count || 1)) {
        quest.completed = true;
      }
      updates.push({
        questId: quest.id || quest.instanceId,
        questName: quest.name,
        progress: quest.progress,
        target: quest.requirement.count || 1,
        completed: quest.completed
      });
    }
  }

  return updates;
}

export function claimQuestReward(quest) {
  if (!quest.completed || quest.claimed) {
    return { success: false, reason: quest.claimed ? 'Already claimed' : 'Not completed' };
  }

  quest.claimed = true;
  return {
    success: true,
    reward: quest.reward,
    questName: quest.name
  };
}

export function getStoryQuestProgress(storyId, completedChapters) {
  const story = STORY_QUESTS[storyId];
  if (!story) return null;

  const chapters = story.chapters.map(ch => ({
    ...ch,
    completed: completedChapters.includes(ch.id),
    active: false
  }));

  // Find first uncompleted chapter
  const nextChapter = chapters.find(ch => !ch.completed);
  if (nextChapter) nextChapter.active = true;

  return {
    storyId,
    storyName: story.name,
    region: story.region,
    chapters,
    progress: chapters.filter(ch => ch.completed).length,
    total: chapters.length,
    isComplete: chapters.every(ch => ch.completed)
  };
}

export function getAllStoryProgress(completedChapters) {
  return Object.keys(STORY_QUESTS).map(id =>
    getStoryQuestProgress(id, completedChapters)
  );
}
