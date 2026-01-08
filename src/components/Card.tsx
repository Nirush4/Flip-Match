import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

/**
 * Card component with enhanced 2D flip animation
 * Professional classic design with improved styling
 */
export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
  const handleClick = () => {
    if (card.isFlipped || card.isMatched || disabled) return;
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.key === 'Enter' || e.key === ' ') &&
      !card.isFlipped &&
      !card.isMatched &&
      !disabled
    ) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className='relative cursor-pointer w-full h-full group'
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled || card.isMatched ? -1 : 0}
      role='button'
      aria-label={
        card.isFlipped || card.isMatched
          ? `Card showing ${card.value}`
          : 'Face-down card'
      }
      aria-pressed={card.isFlipped || card.isMatched}
    >
      {/* Card Front (Face-down) */}
      <div
        className={`absolute inset-0 w-full h-full border-2 sm:border-3 md:border-4 border-[#2c3e50] bg-[#4169e1] flex items-center justify-center transition-all duration-200 ease-out ${
          card.isFlipped || card.isMatched
            ? 'opacity-0 scale-95 pointer-events-none'
            : 'opacity-100 scale-100 hover:bg-[#5a7de8] hover:scale-[1.05] hover:shadow-[3px_3px_0_0_rgba(44,62,80,0.4)] active:scale-[0.98]'
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Pattern overlay for texture */}
        <div className='absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]' />
        <span className='relative text-2xl sm:text-3xl md:text-4xl text-white font-bold select-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]'>
          ?
        </span>
      </div>

      {/* Card Back (Face-up) */}
      <div
        className={`absolute inset-0 w-full h-full border-2 sm:border-3 md:border-4 flex items-center justify-center transition-all duration-200 ease-out ${
          card.isFlipped || card.isMatched
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        } ${
          card.isMatched
            ? 'bg-[#228b22] border-[#2c3e50] animate-match shadow-[3px_3px_0_0_rgba(34,139,34,0.6)]'
            : 'bg-white border-[#2c3e50] hover:bg-[#f8f8f8] hover:shadow-[3px_3px_0_0_rgba(44,62,80,0.3)] active:scale-[0.98]'
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle pattern for matched cards */}
        {card.isMatched && (
          <div className='absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.2)_5px,rgba(255,255,255,0.2)_10px)]' />
        )}
        <span
          className={`relative text-2xl sm:text-3xl md:text-4xl font-bold select-none ${
            card.isMatched
              ? 'text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]'
              : 'text-[#2c3e50]'
          }`}
        >
          {card.value}
        </span>
      </div>
    </div>
  );
};
