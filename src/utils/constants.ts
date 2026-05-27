import { AIDifficulty, GameMode } from '../types/game';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diag 1
  [2, 4, 6], // Diag 2
];

export const DEFAULT_PLAYERS = {
  X: {
    id: 'X' as const,
    name: 'Player X',
    score: 0,
    color: 'from-cyan-400 to-blue-500',
    glowColor: 'shadow-cyan-500/50 text-cyan-400 border-cyan-500/30',
  },
  O: {
    id: 'O' as const,
    name: 'Player O',
    score: 0,
    color: 'from-fuchsia-400 to-purple-600',
    glowColor: 'shadow-fuchsia-500/50 text-fuchsia-400 border-fuchsia-500/30',
  },
};

export const DIFFICULTY_LABELS: Record<AIDifficulty, string> = {
  easy: 'Easy',
  medium: 'Tactical',
  impossible: 'Unbeatable',
};

export const MODE_LABELS: Record<GameMode, string> = {
  pvp: 'Local Match',
  ai: 'Cyber AI',
  online: 'Net Arena',
};

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'tictactoe_cyber_settings',
  SCORES: 'tictactoe_cyber_scores',
  HISTORY: 'tictactoe_cyber_history',
  PLAYER_NAMES: 'tictactoe_cyber_names',
};
