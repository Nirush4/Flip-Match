import React, { useState, useEffect } from 'react';

export const BackgroundAnimation: React.FC = () => {
  const [opacity, setOpacity] = useState('0.08');

  useEffect(() => {
    const updateOpacity = () => {
      setOpacity(window.innerWidth >= 640 ? '0.3' : '0.08');
    };
    updateOpacity();
    window.addEventListener('resize', updateOpacity);
    return () => window.removeEventListener('resize', updateOpacity);
  }, []);

  const icons = [
    {
      emoji: '🧠',
      delay: 0,
      duration: 20,
      x: '10%',
      y: '15%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
    {
      emoji: '💡',
      delay: 2,
      duration: 25,
      x: '85%',
      y: '20%',
      size: 'text-xl sm:text-2xl md:text-3xl',
    },
    {
      emoji: '🔍',
      delay: 4,
      duration: 22,
      x: '15%',
      y: '60%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
    {
      emoji: '🧩',
      delay: 1,
      duration: 18,
      x: '80%',
      y: '55%',
      size: 'text-xl sm:text-2xl md:text-3xl',
    },
    {
      emoji: '⚡',
      delay: 3,
      duration: 24,
      x: '50%',
      y: '10%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
    {
      emoji: '🎯',
      delay: 5,
      duration: 21,
      x: '70%',
      y: '75%',
      size: 'text-xl sm:text-2xl md:text-3xl',
    },
    {
      emoji: '💎',
      delay: 1.5,
      duration: 23,
      x: '25%',
      y: '80%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
    {
      emoji: '⭐',
      delay: 2.5,
      duration: 19,
      x: '90%',
      y: '45%',
      size: 'text-xl sm:text-2xl md:text-3xl',
    },
    {
      emoji: '🔢',
      delay: 0.5,
      duration: 26,
      x: '5%',
      y: '40%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
    {
      emoji: '🎨',
      delay: 3.5,
      duration: 20,
      x: '60%',
      y: '30%',
      size: 'text-xl sm:text-2xl md:text-3xl',
    },
    {
      emoji: '🧪',
      delay: 4.5,
      duration: 22,
      x: '35%',
      y: '25%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
    {
      emoji: '📊',
      delay: 1.2,
      duration: 24,
      x: '75%',
      y: '65%',
      size: 'text-xl sm:text-2xl md:text-3xl',
    },
    {
      emoji: '🔬',
      delay: 2.2,
      duration: 21,
      x: '45%',
      y: '70%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
    {
      emoji: '🎲',
      delay: 3.2,
      duration: 23,
      x: '20%',
      y: '35%',
      size: 'text-xl sm:text-2xl md:text-3xl',
    },
    {
      emoji: '🧮',
      delay: 4.2,
      duration: 19,
      x: '65%',
      y: '85%',
      size: 'text-2xl sm:text-3xl md:text-4xl',
    },
  ];

  const getAnimationType = (index: number) => {
    if (index % 3 === 0) return 'float';
    if (index % 3 === 1) return 'floatReverse';
    return 'drift';
  };

  return (
    <div className='fixed inset-0 z-0 overflow-hidden pointer-events-none'>
      {icons.map((icon, index) => (
        <div
          key={index}
          className={`absolute ${icon.size}`}
          style={{
            left: icon.x,
            top: icon.y,
            opacity: opacity,
            animation: `${getAnimationType(index)} ${
              icon.duration
            }s ease-in-out infinite`,
            animationDelay: `${icon.delay}s`,
          }}
        >
          {icon.emoji}
        </div>
      ))}
    </div>
  );
};
