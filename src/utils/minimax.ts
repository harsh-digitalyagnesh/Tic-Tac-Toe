import { BoardState, Sign } from '../types/game';
import { checkWinner } from './checkWinner';

/**
 * Get all available cell indices from the current board.
 */
export const getAvailableMoves = (board: BoardState): number[] => {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
};

/**
 * Easy AI: Returns a random available move.
 */
export const getEasyMove = (board: BoardState): number => {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

/**
 * Medium AI: Basic tactical moves.
 * - Wins if a winning move is available.
 * - Blocks opponent if they are about to win.
 * - Takes center if available (50% chance).
 * - Otherwise falls back to random available move.
 */
export const getMediumMove = (board: BoardState, aiPlayer: Sign, humanPlayer: Sign): number => {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  // 1. Check if AI can win in one move
  for (const move of availableMoves) {
    const boardCopy = [...board];
    boardCopy[move] = aiPlayer;
    const { winner } = checkWinner(boardCopy);
    if (winner === aiPlayer) {
      return move;
    }
  }

  // 2. Check if Human is about to win and block them
  for (const move of availableMoves) {
    const boardCopy = [...board];
    boardCopy[move] = humanPlayer;
    const { winner } = checkWinner(boardCopy);
    if (winner === humanPlayer) {
      return move;
    }
  }

  // 3. Take the center cell (4) if available with high likelihood
  if (availableMoves.includes(4) && Math.random() > 0.3) {
    return 4;
  }

  // 4. Otherwise, take random move
  return getEasyMove(board);
};

/**
 * Impossible AI: Uses Minimax to calculate the optimal move.
 * The AI will never lose. It either wins or forces a draw.
 */
export const getImpossibleMove = (board: BoardState, aiPlayer: Sign, humanPlayer: Sign): number => {
  // If board is completely empty, pick center (4) or corner (0) for speed/variety
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 9) {
    const openingMoves = [4, 0, 2, 6, 8];
    return openingMoves[Math.floor(Math.random() * openingMoves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = -1;

  for (const move of availableMoves) {
    const boardCopy = [...board];
    boardCopy[move] = aiPlayer;
    
    // Call minimax starting as human (minimizing player)
    const score = minimax(boardCopy, 0, false, aiPlayer, humanPlayer);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

/**
 * Minimax recursive algorithm with depth scoring.
 */
function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Sign,
  humanPlayer: Sign
): number {
  const { winner } = checkWinner(board);

  // Terminal states (Base cases)
  if (winner === aiPlayer) {
    return 10 - depth; // Win soonest
  }
  if (winner === humanPlayer) {
    return depth - 10; // Delay loss
  }
  if (winner === 'draw') {
    return 0;
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = aiPlayer;
      const score = minimax(boardCopy, depth + 1, false, aiPlayer, humanPlayer);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = humanPlayer;
      const score = minimax(boardCopy, depth + 1, true, aiPlayer, humanPlayer);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}
