// Card interface representing a single card in the game
export interface Card {
  id: number;
  value: string; // The emoji/icon that identifies matching pairs
  isFlipped: boolean; // Whether the card is currently face-up
  isMatched: boolean; // Whether the card has been matched with its pair
}

// Difficulty level configuration
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  name: string;
  pairs: number; // Number of pairs (grid will be pairs * 2 cards)
  gridCols: number; // Number of columns in the grid
}

// Game statistics
export interface GameStats {
  moves: number;
  time: number; // Time in seconds
  score: number;
}

// Game history entry
export interface GameHistory {
  id: string;
  difficulty: Difficulty;
  theme: CardTheme;
  moves: number;
  time: number;
  score: number;
  date: string;
}

// Card theme configuration
export type CardTheme = 'emojis' | 'icons' | 'numbers';

// Game settings
export interface GameSettings {
  soundEnabled: boolean;
  showHints: boolean;
  cardPreview: boolean;
}
