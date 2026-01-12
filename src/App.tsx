import { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { Difficulty, CardTheme } from './types';
import { DIFFICULTY_CONFIGS, formatTime } from './utils/gameUtils';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [theme, setTheme] = useState<CardTheme>('emojis');
  const [gameStarted, setGameStarted] = useState(false);
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>(
    {
      easy: null,
      medium: null,
      hard: null,
    }
  );
  const [bestStreak, setBestStreak] = useState<number>(0);

  useEffect(() => {
    const times: Record<Difficulty, number | null> = {
      easy: null,
      medium: null,
      hard: null,
    };
    (Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).forEach((diff) => {
      const stored = localStorage.getItem(`bestTime_${diff}`);
      if (stored) {
        times[diff] = parseInt(stored, 10);
      }
    });
    setBestTimes(times);

    const storedStreak = localStorage.getItem('bestStreak');
    if (storedStreak) {
      setBestStreak(parseInt(storedStreak, 10));
    }
  }, [gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  if (gameStarted) {
    return (
      <div className='relative min-h-screen px-2 py-4 sm:px-4'>
        <BackgroundAnimation />
        <div className='relative z-10 mb-4 text-center'>
          <button
            onClick={handleBackToMenu}
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm border-2 border-purple-500 text-purple-700 font-semibold rounded-xl hover:bg-purple-500 hover:text-white hover:shadow-lg transition-all duration-200 text-sm sm:text-base'
            aria-label='Back to menu'
          >
            <span>←</span> Back to Menu
          </button>
        </div>
        <div className='relative z-10'>
          <Game difficulty={difficulty} theme={theme} />
        </div>
      </div>
    );
  }

  return (
    <div className='relative flex items-center justify-center min-h-screen p-4'>
      <BackgroundAnimation />
      <div className='relative z-10 w-full max-w-3xl'>
        <div className='w-full p-6 border-2 shadow-2xl bg-white/95 backdrop-blur-xl border-white/50 rounded-3xl sm:p-8 md:p-10'>
          <div className='mb-10 text-center'>
            <h1 className='mb-3 text-2xl font-extrabold text-green-600 sm:text-3xl md:text-5xl'>
              🧠 Memory Game
            </h1>
            <p className='text-base font-medium text-gray-600 sm:text-lg'>
              Challenge your memory and match pairs!
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className='mb-8'>
            <h2 className='flex items-center gap-2 mb-4 text-lg font-bold text-gray-800 sm:text-xl'>
              <span className='text-purple-500'>●</span> Choose Difficulty
            </h2>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((diff) => {
                const config = DIFFICULTY_CONFIGS[diff];
                const isActive = difficulty === diff;
                const colors = {
                  easy: 'from-green-600 to-emerald-700',
                  medium: 'from-yellow-600 to-orange-700',
                  hard: 'from-red-600 to-red-700',
                };
                return (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-2 pl-4 rounded-xl text-left transition-all duration-200 relative overflow-hidden group ${
                      isActive
                        ? `bg-gradient-to-br ${colors[diff]} text-white shadow-xl scale-105`
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow-lg'
                    }`}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <div className='absolute inset-0 bg-white/20 animate-pulse' />
                    )}
                    <div className='relative z-10 flex items-start justify-between'>
                      <div className='text-base font-medium opacity-90'>
                        {config.pairs} pairs
                      </div>
                      {bestTimes[diff] !== null && (
                        <div className='px-2 py-1 text-xs font-semibold text-white rounded-full bg-white/30 backdrop-blur-sm'>
                          🏆 {formatTime(bestTimes[diff]!)}
                        </div>
                      )}
                    </div>
                    <div className='relative z-10 text-base font-bold sm:text-lg'>
                      {config.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='mb-10'>
            <h2 className='flex items-center gap-2 mb-4 text-lg font-bold text-gray-800 sm:text-xl'>
              <span className='text-blue-500'>●</span> Choose Theme
            </h2>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              {(['emojis', 'icons', 'numbers'] as CardTheme[]).map((t) => {
                const isActive = theme === t;
                const themeColors = {
                  emojis: 'from-green-400 to-green-500',
                  icons: 'from-blue-400 to-cyan-500',
                  numbers: 'from-purple-400 to-indigo-500',
                };
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-2 rounded-xl text-center capitalize transition-all duration-200 relative overflow-hidden group ${
                      isActive
                        ? `bg-gradient-to-br ${themeColors[t]} text-white shadow-xl scale-105`
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-lg'
                    }`}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <div className='absolute inset-0 bg-white/20 animate-pulse' />
                    )}
                    <div className='relative z-10 text-3xl'>
                      {t === 'emojis' && '😀'}
                      {t === 'icons' && '⭐'}
                      {t === 'numbers' && '🔢'}
                    </div>
                    <div className='relative z-10 text-base font-bold sm:text-lg'>
                      {t}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className='w-full px-8 py-4 bg-gradient-to-r from-green-600 to-blue-700 text-white font-bold text-lg sm:text-xl rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 relative overflow-hidden group'
            aria-label='Start game'
          >
            <span className='relative z-10 flex items-center justify-center gap-2'>
              <span>🎮</span> Start Game
            </span>
            <div className='absolute inset-0 transition-opacity duration-200 opacity-0 bg-gradient-to-r from-green-500 to-blue-500 group-hover:opacity-100' />
          </button>

          {/* Statistics */}
          {bestStreak > 0 && (
            <div className='p-5 mt-8 text-white shadow-lg bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl'>
              <div className='flex items-center gap-2 mb-1 text-base font-bold sm:text-lg'>
                <span>🔥</span> Best Streak: {bestStreak}
              </div>
              <div className='text-sm opacity-90'>
                Consecutive matches without mistakes
              </div>
            </div>
          )}

          <div className='p-5 mt-8 border-2 border-blue-100 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl'>
            <h3 className='flex items-center gap-2 mb-3 text-base font-bold text-gray-800 sm:text-lg'>
              <span className='text-blue-500'>📖</span> How to Play
            </h3>
            <ul className='space-y-2 text-sm text-gray-700 list-disc list-inside sm:text-base'>
              <li>Click cards to flip them and reveal their values</li>
              <li>Match pairs of cards with the same symbol</li>
              <li>Only two cards can be flipped at once</li>
              <li>Complete with fewer moves for a better score</li>
              <li>Build streaks by matching consecutively</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
