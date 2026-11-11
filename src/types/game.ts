export type ScreenView = 
  | 'main_menu'
  | 'office'
  | 'case_select'
  | 'investigation'
  | 'investigation_board'
  | 'filing_cabinet'
  | 'results'
  | 'settings'
  | 'credits'
  | 'master_victory';

export type GameTheme = 'green' | 'amber' | 'cyan';

export type MissionLevel = 
  | 'LEVEL 1 — ROOKIE DETECTIVE'
  | 'LEVEL 2 — CODE INVESTIGATOR'
  | 'LEVEL 3 — SENIOR INVESTIGATOR'
  | 'LEVEL 4 — ELITE CODE SPECIALIST';

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  scanlinesEnabled: boolean;
  theme: GameTheme;
  textSpeed: 'normal' | 'fast';
}

export interface PlayerProfile {
  name: string;
  rank: string;
  score: number; // XP
  hintsUsed: number;
  casesCompleted: string[];
  activeCaseId: string | null;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'log' | 'report' | 'code' | 'witness';
  content: string;
  timestamp: string;
  isKeyEvidence?: boolean;
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  description?: string;
  isHidden?: boolean;
}

export interface TestCaseResult {
  testId: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface JavaExecutionResult {
  success: boolean;
  stdout: string;
  compilerError?: string;
  runtimeError?: string;
  testResults: TestCaseResult[];
  allPassed: boolean;
}

export type CaseData = MissionData;

export interface MissionData {
  id: string;
  number: string;
  missionNumberInt: number;
  title: string;
  subtitle: string;
  level: MissionLevel;
  difficulty: 'Easy' | 'Easy-Medium' | 'Medium' | 'Hard' | 'Final Boss';
  topic: string;
  client?: string;
  systemName?: string;
  storyline: string;
  investigationObjectives: string[];
  clues: string[];
  evidence: EvidenceItem[];
  
  // Coding Challenge
  problemStatement: string;
  sampleInput: string;
  expectedOutput: string;
  starterCode: string;
  referenceSolution: string;
  testCases: TestCase[];
  hints: [string, string, string]; // Exactly 3 progressive hints
  explanation: string;
  xpReward: number;
  hintPenalty: number;
}

export interface CaseResult {
  caseId: string;
  caseTitle: string;
  isSuccess: boolean;
  scoreEarned: number;
  timeSpentSeconds: number;
  wrongAttempts: number;
  hintsUsedCount: number;
  grade: 'S' | 'A' | 'B' | 'C';
}
