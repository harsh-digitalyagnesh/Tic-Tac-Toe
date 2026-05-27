import { useEffect, useRef } from 'react';
import { useGameStore, gameActions } from '../store/gameStore';
import { getEasyMove, getMediumMove, getImpossibleMove } from '../utils/minimax';

export const useAI = () => {
  const { board, currentTurn, status, mode, difficulty } = useGameStore();
  const thinkingRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if we are in AI mode, it's AI's turn (O), and game is active
    if (mode !== 'ai' || currentTurn !== 'O' || status !== 'playing') {
      return;
    }

    // Prevent double invocation
    if (thinkingRef.current) return;
    thinkingRef.current = true;

    // Simulate "thinking" state with a futuristic short delay (e.g., 600ms)
    // This gives a premium polished feel rather than instantaneous calculations.
    const timer = setTimeout(() => {
      let selectedMove = -1;

      switch (difficulty) {
        case 'easy':
          selectedMove = getEasyMove(board);
          break;
        case 'medium':
          selectedMove = getMediumMove(board, 'O', 'X');
          break;
        case 'impossible':
          selectedMove = getImpossibleMove(board, 'O', 'X');
          break;
        default:
          selectedMove = getEasyMove(board);
      }

      if (selectedMove !== -1) {
        thinkingRef.current = false;
        gameActions.makeMove(selectedMove);
      } else {
        thinkingRef.current = false;
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      thinkingRef.current = false;
    };
  }, [board, currentTurn, status, mode, difficulty]);

  return {
    isThinking: currentTurn === 'O' && mode === 'ai' && status === 'playing',
  };
};
