import { BoardState, Sign } from '../types/game';
import { WINNING_COMBINATIONS } from './constants';

interface WinResult {
  winner: Sign | 'draw' | null;
  line?: number[];
}

export const checkWinner = (board: BoardState): WinResult => {
  // 1. Check for winning combinations
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Sign,
        line: combination,
      };
    }
  }

  // 2. Check if the board is completely full (Draw)
  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return {
      winner: 'draw',
    };
  }

  // 3. Game is still active
  return {
    winner: null,
  };
};
