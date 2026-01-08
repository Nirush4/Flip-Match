// Simple sound effect system using Web Audio API
// Creates beep sounds for different game events

const createTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine'
): void => {
  try {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return; // Browser doesn't support Web Audio API

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // Silently fail if audio context cannot be created
    console.debug('Audio not available:', error);
  }
};

export const playFlipSound = (muted: boolean): void => {
  if (muted) return;
  createTone(400, 0.1, 'sine');
};

export const playMatchSound = (muted: boolean): void => {
  if (muted) return;
  createTone(600, 0.2, 'sine');
  setTimeout(() => createTone(800, 0.2, 'sine'), 100);
};

export const playMismatchSound = (muted: boolean): void => {
  if (muted) return;
  createTone(200, 0.15, 'sine');
};

export const playWinSound = (muted: boolean): void => {
  if (muted) return;
  // Play a short melody
  const notes = [523, 659, 784, 1047]; // C, E, G, C (C major chord)
  notes.forEach((freq, index) => {
    setTimeout(() => createTone(freq, 0.3, 'sine'), index * 150);
  });
};
