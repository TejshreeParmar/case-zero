import { GameSettings, PlayerProfile } from '../types/game';

const PROFILE_KEY = 'bughunter_player_profile_v3_coding';
const SETTINGS_KEY = 'bughunter_game_settings_v3';

export const INITIAL_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.8,
  ambientVolume: 0.3,
  scanlinesEnabled: true,
  theme: 'green',
  textSpeed: 'normal'
};

export const INITIAL_PROFILE: PlayerProfile = {
  name: 'Detective Byte',
  rank: 'Rookie Detective',
  score: 0,
  hintsUsed: 0,
  casesCompleted: [],
  activeCaseId: 'case-01',
  achievements: [
    {
      id: 'first_boot',
      title: 'First Day on Duty',
      description: 'Entered the Java Bug Hunter Investigation Bureau',
      icon: 'ShieldAlert',
      unlockedAt: new Date().toISOString()
    }
  ]
};

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return INITIAL_PROFILE;
    return { ...INITIAL_PROFILE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return INITIAL_SETTINGS;
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}

/**
 * 6 Official Detective Ranks:
 * 1. Rookie Detective (0-4 missions completed)
 * 2. Code Explorer (5-9 missions completed)
 * 3. Junior Programmer (10-13 missions completed)
 * 4. Senior Investigator (14-17 missions completed)
 * 5. Java Specialist (18-19 missions completed)
 * 6. Master Bug Hunter (All 20 missions completed!)
 */
export function calculateRank(_score: number, completedCount: number): string {
  if (completedCount >= 20) return 'Master Bug Hunter';
  if (completedCount >= 18) return 'Java Specialist';
  if (completedCount >= 14) return 'Senior Investigator';
  if (completedCount >= 10) return 'Junior Programmer';
  if (completedCount >= 5) return 'Code Explorer';
  return 'Rookie Detective';
}
