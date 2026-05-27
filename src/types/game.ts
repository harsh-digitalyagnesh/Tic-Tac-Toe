export type Sign = 'X' | 'O';

export type CellState = Sign | null;

export type BoardState = CellState[];

export type GameMode = 'pvp' | 'ai' | 'online';

export type AIDifficulty = 'easy' | 'medium' | 'impossible';

export type GameStatus = 'setup' | 'playing' | 'won' | 'draw';

export interface Player {
  id: Sign;
  name: string;
  score: number;
  isAI?: boolean;
  color: string; // Tailwind color class or hex for neon themes
  glowColor: string; // Neon shadow color
}

export interface MatchRecord {
  id: string;
  date: string;
  playerX: string;
  playerO: string;
  winner: Sign | 'draw';
  winningLine?: number[];
  mode: GameMode;
  difficulty?: AIDifficulty;
}

export interface GameSettings {
  mode: GameMode;
  difficulty: AIDifficulty;
  isMuted: boolean;
  timerDuration: number; // in seconds (e.g. 10s for blitz mode, 0 to disable)
  useKeyboardShortcuts: boolean;
}
