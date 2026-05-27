import { useEffect } from 'react';
import { useGameStore, gameActions, initializeStore } from '../store/gameStore';

export const useGame = () => {
  const state = useGameStore();

  // 1. Initialize store state from localStorage (runs once on client mount)
  useEffect(() => {
    initializeStore();
  }, []);

  // 2. Blitz Countdown Timer Loop
  useEffect(() => {
    if (state.status !== 'playing' || state.timerDuration === 0) return;

    const interval = setInterval(() => {
      gameActions.tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status, state.timerDuration]);

  // 3. Keyboard Shortcuts Listener
  useEffect(() => {
    if (!state.useKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger moves if user is typing in input fields (like custom player names)
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key;

      // 1-9 keys map to Board grid cells (0-8 index)
      // Keyboard visual map:
      // 1 2 3
      // 4 5 6
      // 7 8 9
      if (key >= '1' && key <= '9') {
        const cellIndex = parseInt(key, 10) - 1;
        if (state.board[cellIndex] === null && (state.status === 'playing' || state.status === 'setup')) {
          // If it's Player vs AI, only allow human keyboard move if it's actually human turn
          if (state.mode === 'ai' && state.currentTurn !== 'X') {
            return;
          }
          // If online mode, only allow moves if active room is active
          if (state.mode === 'online' && (!state.activeRoom || state.currentTurn !== 'X')) {
            return;
          }
          gameActions.makeMove(cellIndex);
        }
      }

      // 'R' or 'r' to quick restart match
      if (key.toLowerCase() === 'r') {
        gameActions.restartGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.board, state.status, state.useKeyboardShortcuts, state.mode, state.currentTurn, state.activeRoom]);

  return {
    ...state,
    ...gameActions,
  };
};
