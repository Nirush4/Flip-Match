import React from 'react';
import { Card as CardType } from '../types';
import { Card } from './Card';

interface BoardProps {
  cards: CardType[];
  onCardClick: (cardId: number) => void;
  disabled: boolean;
  gridCols: number;
}

export const Board: React.FC<BoardProps> = ({
  cards,
  onCardClick,
  disabled,
  gridCols,
}) => {
  if (cards.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[300px] sm:min-h-[400px]'>
        <div className='text-center'>
          <div className='inline-block w-8 h-8 sm:w-12 sm:h-12 border-4 border-[#2c3e50] border-t-transparent animate-spin mb-4'></div>
          <p className='text-[#2c3e50] text-sm sm:text-base'>
            Loading cards...
          </p>
        </div>
      </div>
    );
  }

  const getGridCols = () => {
    if (gridCols === 3) {
      return 'grid-cols-2 sm:grid-cols-3';
    }
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
  };

  const getMaxWidth = () => {
    if (gridCols === 3) {
      return 'max-w-md sm:max-w-lg md:max-w-2xl';
    }
    return 'max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl';
  };

  return (
    <div
      className={`grid ${getGridCols()} gap-2 sm:gap-3  p-2 sm:p-4 ${getMaxWidth()} mx-auto`}
      role='grid'
      aria-label='Memory game board'
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className='w-full'
          style={{ aspectRatio: '1' }}
          role='gridcell'
        >
          <div className='w-full h-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] mx-auto'>
            <Card
              card={card}
              onClick={() => onCardClick(card.id)}
              disabled={disabled}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
