/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StoryCategory =
  | 'prophets'
  | 'fantasy'
  | 'mystery'
  | 'adventure'
  | 'animals'
  | 'detective'
  | 'history'
  | 'morals'
  | 'scifi'
  | 'custom';

export interface CategoryMeta {
  id: StoryCategory;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  badge: string;
}

export type DifficultyLevel = 'سهل' | 'متوسط' | 'متقدم';

export interface StoryParagraph {
  id: string;
  text: string;
  sentences: string[];
}

export type MiniGameType =
  | 'quiz'
  | 'timeline'
  | 'who_is_it'
  | 'memory_match'
  | 'treasure_chest'
  | 'detective_clues'
  | 'true_false'
  | 'word_search'
  | 'choose_ending';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  order: number;
}

export interface ClueQuestion {
  characterName: string;
  characterDescription: string;
  options: string[];
  clues: string[];
}

export interface MemoryCardItem {
  id: string;
  label: string;
  icon: string;
}

export interface WordSearchData {
  words: string[];
  grid: string[][];
}

export interface DetectiveClue {
  id: string;
  title: string;
  description: string;
}

export interface DetectiveSuspect {
  id: string;
  name: string;
  role: string;
  alibi: string;
  isGuilty: boolean;
}

export interface DetectiveCase {
  clues: DetectiveClue[];
  suspects: DetectiveSuspect[];
  solutionExplanation: string;
}

export interface TrueFalseQuestion {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface TreasureRiddle {
  riddleText: string;
  codeAnswer: string;
  hint: string;
}

export interface BranchingNode {
  id: string;
  text: string;
  isEnding?: boolean;
  outcome?: string;
  choices?: { text: string; nextNodeId: string }[];
}

export interface MiniGamePayload {
  type: MiniGameType;
  title: string;
  instruction: string;
  quiz?: QuizQuestion[];
  timeline?: TimelineEvent[];
  whoIsIt?: ClueQuestion;
  memoryCards?: MemoryCardItem[];
  wordSearch?: WordSearchData;
  detective?: DetectiveCase;
  trueFalse?: TrueFalseQuestion[];
  treasure?: TreasureRiddle[];
  branching?: { startNodeId: string; nodes: Record<string, BranchingNode> };
  rewardXp: number;
  rewardCoins: number;
  rewardStars: number;
}

export interface Story {
  id: string;
  title: string;
  category: StoryCategory;
  coverImage?: string;
  coverGradient: string;
  coverIcon: string;
  synopsis: string;
  difficulty: DifficultyLevel;
  readTimeMinutes: number;
  ageGroup: string;
  paragraphs: StoryParagraph[];
  moralLesson: string;
  tags: string[];
  game: MiniGamePayload;
}

export interface PlayerProfile {
  name: string;
  level: number;
  xp: number;
  coins: number;
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedStoryIds: string[];
  completedStoryIds: string[];
  unlockedGameIds: string[];
  completedGameIds: string[];
  favoriteStoryIds: string[];
  offlineSavedStoryIds: string[];
  lastReadPositions: Record<string, number>;
  selectedAvatar: string;
  selectedTitle: string;
  inventory: string[];
  settings: {
    soundEffects: boolean;
    fontSize: 'sm' | 'md' | 'lg' | 'xl';
    readingTheme: 'night' | 'warm' | 'day';
    speechRate: number;
    speechVolume: number;
    softenSpooky: boolean;
  };
}

export interface ShopItem {
  id: string;
  type: 'avatar' | 'title' | 'frame';
  name: string;
  description: string;
  price: number;
  icon: string;
  previewColor?: string;
}
