// ============================================================
// STARBOUND: ELITE EQUESTRIAN — Core Game State Manager
// ============================================================

import { generateId } from '../utils/random.js';

export function createInitialState() {
  return {
    version: '1.0.0',
    player: {
      name: '',
      title: '',
      prestige: 0,
      coins: 500,
      gems: 10,
      spiritTokens: 0,
      dragonEssences: 0,
      currentRegion: 'meadow_circuit',
      unlockedRegions: ['meadow_circuit'],
      titles: [],
      createdAt: Date.now(),
      lastLogin: Date.now(),
      totalPlayTime: 0,
      hardcoreMode: false
    },
    horses: [],
    dragons: [],
    ranch: {
      facilities: {
        stable: 1,
        training_ring: 0,
        indoor_arena: 0,
        pasture: 0,
        dragon_roost: 0
      },
      decor: [],
      partyLastUsed: 0,
      partyActive: false
    },
    breeding: {
      totalBreeds: 0,
      cooldownEnd: 0
    },
    competition: {
      seasonDay: 1,
      seasonPoints: {},
      seasonRanks: {},
      totalWins: 0,
      totalCompetitions: 0,
      history: []
    },
    summon: {
      pityCounterElite: 0,
      pityCounterLegendary: 0,
      pityCounterDragonShard: 0,
      pityCounterTrueDragon: 0,
      totalSummons: 0,
      history: []
    },
    quests: {
      activeDaily: [],
      activeWeekly: [],
      storyProgress: {},
      completedQuests: [],
      dailyResetTime: 0,
      weeklyResetTime: 0,
      questCounters: {}
    },
    settings: {
      musicVolume: 0.7,
      sfxVolume: 0.8,
      notifications: true,
      autoSave: true,
      theme: 'default'
    },
    stats: {
      totalTrainingSessions: 0,
      totalCoinsEarned: 0,
      totalGemsEarned: 0,
      highestPrestige: 0,
      rareCoatsFound: 0,
      shimmerCoatsFound: 0,
      dragonsUpgraded: 0,
      pegasusAscended: 0
    },
    gameDay: 1,
    lastSaved: Date.now()
  };
}

export class GameState {
  constructor() {
    this.state = createInitialState();
    this.listeners = new Map();
    this.history = [];
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  set(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], this.state);
    const oldValue = target[last];
    target[last] = value;
    this.notify(path, value, oldValue);
  }

  update(path, fn) {
    const current = this.get(path);
    this.set(path, fn(current));
  }

  notify(path, newValue, oldValue) {
    for (const [pattern, callbacks] of this.listeners) {
      if (path.startsWith(pattern) || pattern === '*') {
        callbacks.forEach(cb => cb(path, newValue, oldValue));
      }
    }
  }

  on(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path).add(callback);
    return () => this.listeners.get(path)?.delete(callback);
  }

  addHorse(horse) {
    horse.id = horse.id || generateId();
    this.state.horses.push(horse);
    this.notify('horses', this.state.horses);
    return horse;
  }

  removeHorse(horseId) {
    this.state.horses = this.state.horses.filter(h => h.id !== horseId);
    this.notify('horses', this.state.horses);
  }

  getHorse(horseId) {
    return this.state.horses.find(h => h.id === horseId);
  }

  addDragon(dragon) {
    dragon.id = dragon.id || generateId();
    this.state.dragons.push(dragon);
    this.notify('dragons', this.state.dragons);
    return dragon;
  }

  removeDragon(dragonId) {
    this.state.dragons = this.state.dragons.filter(d => d.id !== dragonId);
    this.notify('dragons', this.state.dragons);
  }

  getDragon(dragonId) {
    return this.state.dragons.find(d => d.id === dragonId);
  }

  addCoins(amount) {
    this.state.player.coins += amount;
    this.state.stats.totalCoinsEarned += amount;
    this.notify('player.coins', this.state.player.coins);
  }

  spendCoins(amount) {
    if (this.state.player.coins < amount) return false;
    this.state.player.coins -= amount;
    this.notify('player.coins', this.state.player.coins);
    return true;
  }

  addGems(amount) {
    this.state.player.gems += amount;
    this.state.stats.totalGemsEarned += amount;
    this.notify('player.gems', this.state.player.gems);
  }

  spendGems(amount) {
    if (this.state.player.gems < amount) return false;
    this.state.player.gems -= amount;
    this.notify('player.gems', this.state.player.gems);
    return true;
  }

  addPrestige(amount) {
    this.state.player.prestige += amount;
    if (this.state.player.prestige > this.state.stats.highestPrestige) {
      this.state.stats.highestPrestige = this.state.player.prestige;
    }
    this.notify('player.prestige', this.state.player.prestige);
  }

  getStableCapacity() {
    const level = this.state.ranch.facilities.stable;
    const capacities = [0, 3, 5, 8, 12, 16, 20, 25, 30, 36, 42];
    return capacities[level] || 3;
  }

  canAddHorse() {
    return this.state.horses.length < this.getStableCapacity();
  }

  serialize() {
    return JSON.stringify(this.state);
  }

  deserialize(json) {
    this.state = JSON.parse(json);
    this.notify('*', this.state);
  }

  save() {
    this.state.lastSaved = Date.now();
    const data = this.serialize();
    try {
      localStorage.setItem('starbound_save', data);
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  load() {
    try {
      const data = localStorage.getItem('starbound_save');
      if (data) {
        this.deserialize(data);
        return true;
      }
    } catch (e) {
      console.error('Load failed:', e);
    }
    return false;
  }
}
