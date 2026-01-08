import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Difficulty,
  CardTheme,
  GameHistory,
  GameSettings,
} from '../types';
import { Board } from './Board';
import {
  createCards,
  shuffleArray,
  DIFFICULTY_CONFIGS,
  calculateScore,
  formatTime,
} from '../utils/gameUtils';
import { getCardValues } from '../utils/cardThemes';
import {
  playFlipSound,
  playMatchSound,
  playMismatchSound,
  playWinSound,
} from '../utils/sounds';

interface GameProps {
  difficulty: Difficulty;
  theme: CardTheme;
}

export const Game: React.FC<GameProps> = ({ difficulty, theme }) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    showHints: false,
    cardPreview: false,
  });

  const initializeGame = useCallback(() => {
    const values = getCardValues(theme, config.pairs);
    const newCards = shuffleArray(createCards(values));
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setStreak(0);
    setIsGameStarted(false);
    setIsGameWon(false);
    setIsDisabled(false);
  }, [config.pairs, theme]);

  useEffect(() => {
    const storedBestTime = localStorage.getItem(`bestTime_${difficulty}`);
    if (storedBestTime) {
      setBestTime(parseInt(storedBestTime, 10));
    }

    const storedBestStreak = localStorage.getItem('bestStreak');
    if (storedBestStreak) {
      setBestStreak(parseInt(storedBestStreak, 10));
    }

    const storedHistory = localStorage.getItem('gameHistory');
    if (storedHistory) {
      try {
        setGameHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to load game history');
      }
    }

    const storedSettings = localStorage.getItem('gameSettings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings({
          soundEnabled:
            parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
          showHints: parsed.showHints || false,
          cardPreview: parsed.cardPreview || false,
        });
      } catch (e) {
        console.error('Failed to load settings');
      }
    }
  }, [difficulty]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: number | undefined;
    if (isGameStarted && !isGameWon) {
      interval = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameStarted, isGameWon]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsGameWon(true);
      setIsGameStarted(false);
      playWinSound(!settings.soundEnabled);

      const score = calculateScore(moves, time, config.pairs);
      const gameEntry: GameHistory = {
        id: Date.now().toString(),
        difficulty,
        theme,
        moves,
        time,
        score,
        date: new Date().toISOString(),
      };

      const newHistory = [gameEntry, ...gameHistory].slice(0, 10);
      setGameHistory(newHistory);
      localStorage.setItem('gameHistory', JSON.stringify(newHistory));

      const currentBest = bestTime;
      if (!currentBest || time < currentBest) {
        setBestTime(time);
        localStorage.setItem(`bestTime_${difficulty}`, time.toString());
      }

      if (streak > bestStreak) {
        setBestStreak(streak);
        localStorage.setItem('bestStreak', streak.toString());
      }
    }
  }, [
    cards,
    time,
    moves,
    difficulty,
    theme,
    bestTime,
    streak,
    bestStreak,
    gameHistory,
    settings.soundEnabled,
    config.pairs,
  ]);

  const handleCardClick = (cardId: number) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || isDisabled || card.isFlipped || card.isMatched) return;

    if (!isGameStarted) {
      setIsGameStarted(true);
    }

    playFlipSound(!settings.soundEnabled);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards((prevCards) =>
      prevCards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlippedCards.length === 2) {
      setIsDisabled(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        playMatchSound(!settings.soundEnabled);
        setStreak((prev) => prev + 1);
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);
          setIsDisabled(false);
        }, 600);
      } else {
        playMismatchSound(!settings.soundEnabled);
        setStreak(0);
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsDisabled(false);
        }, 1000);
      }
    }
  };

  const score = calculateScore(moves, time, config.pairs);
  const matchedPairs = cards.filter((c) => c.isMatched).length / 2;
  const progress = cards.length > 0 ? (matchedPairs / config.pairs) * 100 : 0;

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('gameSettings', JSON.stringify(updated));
  };

  return (
    <div className='w-full max-w-6xl px-2 py-4 mx-auto sm:px-4 sm:py-6'>
      {/* Game Header with Enhanced Stats */}
      <div className='p-5 mb-6 border-2 shadow-2xl bg-white/95 backdrop-blur-xl border-white/50 rounded-3xl sm:p-6'>
        {/* Progress Bar */}
        <div className='mb-5'>
          <div className='flex justify-between mb-2 text-sm font-semibold text-gray-700'>
            <span>Progress</span>
            <span>
              {matchedPairs} / {config.pairs} pairs
            </span>
          </div>
          <div className='w-full h-5 overflow-hidden bg-gray-200 border-2 border-gray-300 rounded-full'>
            <div
              className='h-full transition-all duration-500 ease-out rounded-full shadow-lg bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
          <div className='grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4'>
            {/* Moves */}
            <div className='p-4 text-center border-2 border-blue-200 shadow-md bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl'>
              <div className='mb-1 text-xs font-semibold text-gray-600 sm:text-sm'>
                Moves
              </div>
              <div className='text-2xl font-extrabold text-transparent sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text'>
                {moves}
              </div>
            </div>

            {/* Timer */}
            <div className='p-4 text-center border-2 border-pink-200 shadow-md bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl'>
              <div className='mb-1 text-xs font-semibold text-gray-600 sm:text-sm'>
                Time
              </div>
              <div className='text-2xl font-extrabold text-transparent sm:text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text'>
                {formatTime(time)}
              </div>
            </div>

            {/* Score */}
            <div className='p-4 text-center border-2 border-yellow-200 shadow-md bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl'>
              <div className='mb-1 text-xs font-semibold text-gray-600 sm:text-sm'>
                Score
              </div>
              <div className='text-2xl font-extrabold text-transparent sm:text-3xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text'>
                {score}
              </div>
            </div>

            {/* Streak */}
            <div className='p-4 text-center border-2 border-purple-600 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl'>
              <div className='mb-1 text-xs font-semibold text-white sm:text-sm'>
                Streak
              </div>
              <div className='text-2xl font-extrabold text-white sm:text-3xl'>
                {streak}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center justify-end w-full gap-2 sm:gap-3 sm:w-auto'>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className='px-4 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:shadow-lg hover:scale-105 sm:text-base'
              aria-label='Show game history'
            >
              📊
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className='px-4 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:shadow-lg hover:scale-105 sm:text-base'
              aria-label='Settings'
            >
              ⚙️
            </button>

            <button
              onClick={() =>
                updateSettings({ soundEnabled: !settings.soundEnabled })
              }
              className='px-4 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:shadow-lg hover:scale-105 sm:text-base'
              aria-label={
                settings.soundEnabled ? 'Mute sounds' : 'Unmute sounds'
              }
            >
              {settings.soundEnabled ? '🔊' : '🔇'}
            </button>

            <button
              onClick={initializeGame}
              className='px-5 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg hover:scale-105 sm:text-base'
              aria-label='Restart game'
            >
              🔄 Restart
            </button>
          </div>
        </div>

        {/* Best Stats */}
        {(bestTime !== null || bestStreak > 0) && (
          <div className='flex flex-wrap gap-3 text-sm'>
            {bestTime !== null && (
              <div className='px-4 py-2 font-semibold text-white border-2 border-green-500 shadow-md bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl'>
                🏆 Best Time: {formatTime(bestTime)}
              </div>
            )}
            {bestStreak > 0 && (
              <div className='px-4 py-2 font-semibold text-white border-2 border-orange-500 shadow-md bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl'>
                🔥 Best Streak: {bestStreak}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className='p-6 mb-6 border-2 shadow-2xl bg-white/95 backdrop-blur-xl border-white/50 rounded-3xl animate-slide-in'>
          <h3 className='mb-4 text-xl font-bold text-gray-800 sm:text-2xl'>
            Settings
          </h3>
          <div className='space-y-4'>
            <label className='flex items-center gap-3 p-3 transition-colors cursor-pointer rounded-xl hover:bg-gray-50'>
              <input
                type='checkbox'
                checked={settings.soundEnabled}
                onChange={(e) =>
                  updateSettings({ soundEnabled: e.target.checked })
                }
                className='w-5 h-5 accent-purple-500'
              />
              <span className='text-base font-medium text-gray-700'>
                Sound Effects
              </span>
            </label>
            <label className='flex items-center gap-3 p-3 transition-colors cursor-pointer rounded-xl hover:bg-gray-50'>
              <input
                type='checkbox'
                checked={settings.showHints}
                onChange={(e) =>
                  updateSettings({ showHints: e.target.checked })
                }
                className='w-5 h-5 accent-purple-500'
              />
              <span className='text-base font-medium text-gray-700'>
                Show Hints
              </span>
            </label>
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && gameHistory.length > 0 && (
        <div className='p-6 mb-6 overflow-y-auto border-2 shadow-2xl bg-white/95 backdrop-blur-xl border-white/50 rounded-3xl animate-slide-in max-h-64'>
          <h3 className='mb-4 text-xl font-bold text-gray-800 sm:text-2xl'>
            Recent Games
          </h3>
          <div className='space-y-3'>
            {gameHistory.slice(0, 5).map((game) => (
              <div
                key={game.id}
                className='p-4 text-sm border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl'
              >
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-bold text-gray-800'>
                    {game.difficulty} • {game.theme}
                  </span>
                  <span className='font-semibold text-gray-600'>
                    {formatTime(game.time)}
                  </span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>{game.moves} moves</span>
                  <span className='font-bold text-purple-600'>
                    Score: {game.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Board */}
      <Board
        cards={cards}
        onCardClick={handleCardClick}
        disabled={isDisabled}
        gridCols={config.gridCols}
      />

      {/* Enhanced Win Modal */}
      {isGameWon && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
          <div className='relative w-full max-w-md p-8 overflow-hidden text-center border-2 shadow-2xl bg-white/95 backdrop-blur-xl border-white/50 rounded-3xl animate-slide-in'>
            {/* Confetti Effect */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className='absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-confetti'
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  top: '50%',
                }}
              />
            ))}

            <div className='relative z-10 mb-4 text-6xl'>🎉</div>
            <h2 className='relative z-10 mb-3 text-3xl font-extrabold text-transparent sm:text-4xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text'>
              Congratulations!
            </h2>
            <p className='relative z-10 mb-6 text-lg font-medium text-gray-600'>
              You've matched all pairs!
            </p>

            <div className='relative z-10 p-5 mb-6 space-y-3 text-left border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl'>
              <div className='flex justify-between text-base sm:text-lg'>
                <span className='font-medium text-gray-600'>Moves:</span>
                <span className='font-bold text-purple-600'>{moves}</span>
              </div>
              <div className='flex justify-between text-base sm:text-lg'>
                <span className='font-medium text-gray-600'>Time:</span>
                <span className='font-bold text-purple-600'>
                  {formatTime(time)}
                </span>
              </div>
              <div className='flex justify-between text-base sm:text-lg'>
                <span className='font-medium text-gray-600'>Score:</span>
                <span className='font-bold text-purple-600'>{score}</span>
              </div>
              {streak > 0 && (
                <div className='flex justify-between text-base sm:text-lg'>
                  <span className='font-medium text-gray-600'>
                    Final Streak:
                  </span>
                  <span className='font-bold text-pink-600'>{streak}</span>
                </div>
              )}
            </div>

            <button
              onClick={initializeGame}
              className='relative z-10 w-full px-6 py-4 text-lg font-bold text-white transition-all shadow-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-2xl hover:shadow-2xl hover:scale-105'
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
