import { Card, Difficulty, DifficultyConfig } from '../types';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    pairs: 6,
    gridCols: 3,
  },
  medium: {
    name: 'Medium',
    pairs: 8,
    gridCols: 4,
  },
  hard: {
    name: 'Hard',
    pairs: 12,
    gridCols: 4,
  },
};

export const createCards = (values: string[]): Card[] => {
  const cards: Card[] = [];
  let id = 0;

  values.forEach((value) => {
    cards.push(
      { id: id++, value, isFlipped: false, isMatched: false },
      { id: id++, value, isFlipped: false, isMatched: false }
    );
  });

  return cards;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateScore = (
  moves: number,
  time: number,
  pairs: number
): number => {
  const baseScore = pairs * 100;
  const movePenalty = moves * 5;
  const timePenalty = Math.floor(time / 10) * 2;
  return Math.max(0, baseScore - movePenalty - timePenalty);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};
