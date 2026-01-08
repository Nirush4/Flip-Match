# Memory Card Matching Game

A complete memory card matching game built with React, TypeScript, and Tailwind CSS.

## Features

### Core Game Features
- ✅ Grid of face-down cards with matching pairs
- ✅ Smooth CSS flip animations
- ✅ Only two cards can be flipped at a time
- ✅ Match detection - matched cards stay face-up
- ✅ Mismatch handling - cards flip back after a delay
- ✅ Random card shuffling at game start
- ✅ Prevents clicking already matched or currently flipped cards
- ✅ Move counter
- ✅ Win detection with celebration modal
- ✅ Restart button

### UI/UX
- ✅ Clean, modern UI with Tailwind CSS
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth 3D flip animations
- ✅ Visual distinction for matched cards
- ✅ Gradient backgrounds and modern styling

### Optional Features (All Implemented!)
- ✅ **Difficulty Levels**: Easy (6 pairs), Medium (8 pairs), Hard (12 pairs)
- ✅ **Timer**: Tracks game time with best time stored in localStorage
- ✅ **Score System**: Calculated based on moves and time
- ✅ **Sound Effects**: Flip, match, mismatch, and win sounds with mute toggle
- ✅ **Card Themes**: Emojis, Icons, and Numbers
- ✅ **Accessibility**: Keyboard navigation (Enter/Space to flip), ARIA roles and labels
- ✅ **Animations**: Match success animations, confetti effects, scale animations

## Tech Stack

- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling and animations
- **Vite** for fast development and building

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
memory-game/
├── src/
│   ├── components/
│   │   ├── Card.tsx          # Individual card component with flip animation
│   │   ├── Board.tsx         # Grid layout for cards
│   │   └── Game.tsx          # Main game logic and state management
│   ├── utils/
│   │   ├── cardThemes.ts     # Card theme configurations
│   │   ├── gameUtils.ts      # Game utility functions (shuffle, score, etc.)
│   │   └── sounds.ts         # Sound effect system
│   ├── types.ts              # TypeScript interfaces and types
│   ├── App.tsx               # Main app with menu and game selection
│   ├── main.tsx              # React entry point
│   └── index.css             # Tailwind CSS imports
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## How to Play

1. Select a difficulty level (Easy, Medium, or Hard)
2. Choose a card theme (Emojis, Icons, or Numbers)
3. Click "Start Game"
4. Click cards to flip them and find matching pairs
5. Match all pairs to win!
6. Try to achieve the best score with fewer moves and faster time

## Code Quality

- Clean, readable, well-structured code
- Separated into reusable components (Game, Board, Card)
- TypeScript interfaces/types for all data structures
- Comments explaining important logic
- Accessible with keyboard navigation and ARIA labels

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS 3D Transforms
- Web Audio API (for sound effects)

## Author 👨‍💻​

• Nirushan Rajamanoharan (@Nirush4)

**Happy coding!**
