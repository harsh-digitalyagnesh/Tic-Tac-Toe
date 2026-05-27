import { useSyncExternalStore } from 'react';
import { BoardState, Sign, GameStatus, GameMode, AIDifficulty, MatchRecord } from '../types/game';
import { checkWinner } from '../utils/checkWinner';
import { LOCAL_STORAGE_KEYS, DEFAULT_PLAYERS } from '../utils/constants';
import { playSound, setMuteState } from '../utils/sounds';
import confetti from 'canvas-confetti';

export interface GameStoreState {
  board: BoardState;
  currentTurn: Sign;
  status: GameStatus;
  winner: Sign | 'draw' | null;
  winningLine?: number[];
  scores: { X: number; O: number; draws: number };
  mode: GameMode;
  difficulty: AIDifficulty;
  isMuted: boolean;
  timerDuration: number; // 0 to disable, e.g., 10 seconds for blitz mode
  timeLeft: number;
  matchHistory: MatchRecord[];
  playerXName: string;
  playerOName: string;
  showConfetti: boolean;
  useKeyboardShortcuts: boolean;
  isOnlineConnecting: boolean;
  activeRoom: string | null;
}

const DEFAULT_INITIAL_STATE: GameStoreState = {
  board: Array(9).fill(null) as BoardState,
  currentTurn: 'X',
  status: 'setup',
  winner: null,
  winningLine: undefined,
  scores: { X: 0, O: 0, draws: 0 },
  mode: 'pvp',
  difficulty: 'medium',
  isMuted: false,
  timerDuration: 10,
  timeLeft: 10,
  matchHistory: [],
  playerXName: 'Player X',
  playerOName: 'Player O',
  showConfetti: false,
  useKeyboardShortcuts: true,
  isOnlineConnecting: false,
  activeRoom: null,
};

let storeState: GameStoreState = { ...DEFAULT_INITIAL_STATE };
const listeners = new Set<() => void>();

// Subscribe to store updates
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Get snapshot of current state
const getSnapshot = () => storeState;

// Notify all subscribers of state changes
const emitChange = () => {
  listeners.forEach((listener) => listener());
};

// Sync state to local storage (only on client side)
const syncToLocalStorage = (keys: ('settings' | 'scores' | 'history' | 'names')[]) => {
  if (typeof window === 'undefined') return;

  if (keys.includes('settings')) {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SETTINGS,
      JSON.stringify({
        mode: storeState.mode,
        difficulty: storeState.difficulty,
        isMuted: storeState.isMuted,
        timerDuration: storeState.timerDuration,
        useKeyboardShortcuts: storeState.useKeyboardShortcuts,
      })
    );
  }

  if (keys.includes('scores')) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SCORES, JSON.stringify(storeState.scores));
  }

  if (keys.includes('history')) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(storeState.matchHistory));
  }

  if (keys.includes('names')) {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.PLAYER_NAMES,
      JSON.stringify({
        playerXName: storeState.playerXName,
        playerOName: storeState.playerOName,
      })
    );
  }
};

// Load state from local storage on client initialization
export const initializeStore = () => {
  if (typeof window === 'undefined') return;

  try {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    const savedScores = localStorage.getItem(LOCAL_STORAGE_KEYS.SCORES);
    const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
    const savedNames = localStorage.getItem(LOCAL_STORAGE_KEYS.PLAYER_NAMES);

    let updatedState = { ...storeState };

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      updatedState.mode = parsed.mode ?? updatedState.mode;
      updatedState.difficulty = parsed.difficulty ?? updatedState.difficulty;
      updatedState.isMuted = parsed.isMuted ?? updatedState.isMuted;
      updatedState.timerDuration = parsed.timerDuration ?? updatedState.timerDuration;
      updatedState.timeLeft = updatedState.timerDuration;
      updatedState.useKeyboardShortcuts = parsed.useKeyboardShortcuts ?? updatedState.useKeyboardShortcuts;
      
      setMuteState(updatedState.isMuted);
    }

    if (savedScores) {
      updatedState.scores = JSON.parse(savedScores);
    }

    if (savedHistory) {
      updatedState.matchHistory = JSON.parse(savedHistory);
    }

    if (savedNames) {
      const parsed = JSON.parse(savedNames);
      updatedState.playerXName = parsed.playerXName ?? updatedState.playerXName;
      updatedState.playerOName = parsed.playerOName ?? updatedState.playerOName;
    }

    storeState = updatedState;
    emitChange();
  } catch (error) {
    console.error('Failed to load initial state from local storage:', error);
  }
};

// --- Store Actions ---
export const gameActions = {
  // Move execution
  makeMove: (cellIndex: number) => {
    if (storeState.status !== 'playing' && storeState.status !== 'setup') return;
    if (storeState.board[cellIndex] !== null) return;

    playSound.click();

    const newBoard = [...storeState.board] as BoardState;
    const currentTurn = storeState.currentTurn;
    newBoard[cellIndex] = currentTurn;

    const winCheck = checkWinner(newBoard);
    const nextTurn = currentTurn === 'X' ? 'O' : 'X';

    let nextStatus: GameStatus = 'playing';
    let winner: Sign | 'draw' | null = null;
    let winningLine: number[] | undefined;
    let scores = { ...storeState.scores };
    let showConfetti = false;

    if (winCheck.winner) {
      winner = winCheck.winner;
      winningLine = winCheck.line;
      nextStatus = 'won';
      
      if (winner === 'draw') {
        scores.draws += 1;
        playSound.draw();
      } else {
        if (winner === 'X') scores.X += 1;
        if (winner === 'O') scores.O += 1;
        
        playSound.win();
        showConfetti = true;
        
        // Burst confetti effect
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#d946ef', '#ffffff'] // neon blue, purple, white
        });
      }

      // Record match history
      const newMatch: MatchRecord = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleString(),
        playerX: storeState.playerXName,
        playerO: storeState.playerOName,
        winner: winner,
        winningLine: winningLine,
        mode: storeState.mode,
        difficulty: storeState.mode === 'ai' ? storeState.difficulty : undefined,
      };

      storeState = {
        ...storeState,
        board: newBoard,
        status: nextStatus,
        winner,
        winningLine,
        scores,
        showConfetti,
        matchHistory: [newMatch, ...storeState.matchHistory],
      };

      syncToLocalStorage(['scores', 'history']);
      emitChange();
    } else {
      // Game continues
      storeState = {
        ...storeState,
        board: newBoard,
        currentTurn: nextTurn,
        status: 'playing',
        timeLeft: storeState.timerDuration, // Reset timer
      };
      emitChange();
    }
  },

  // Tick the timer down by 1s (called in interval)
  tickTimer: () => {
    if (storeState.status !== 'playing' || storeState.timerDuration === 0) return;

    if (storeState.timeLeft <= 1) {
      // Time is up! Switch turn or auto play random move
      playSound.click();
      const availableMoves = storeState.board
        .map((cell, index) => (cell === null ? index : -1))
        .filter((idx) => idx !== -1);
      
      if (availableMoves.length > 0) {
        // Auto-play a random move for the current player
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        gameActions.makeMove(randomMove);
      }
    } else {
      storeState = {
        ...storeState,
        timeLeft: storeState.timeLeft - 1,
      };
      emitChange();
    }
  },

  // Change Game Mode
  setMode: (mode: GameMode) => {
    playSound.reset();
    let playerXName = storeState.playerXName;
    let playerOName = storeState.playerOName;

    if (mode === 'ai') {
      playerOName = 'Cyber AI';
      if (playerXName === 'Player X' || playerXName === 'Cyber AI') playerXName = 'Player X';
    } else if (mode === 'pvp') {
      if (playerOName === 'Cyber AI') playerOName = 'Player O';
    } else if (mode === 'online') {
      playerXName = 'Local Hero';
      playerOName = 'Remote Player';
    }

    storeState = {
      ...storeState,
      ...DEFAULT_INITIAL_STATE,
      mode,
      playerXName,
      playerOName,
      scores: storeState.scores, // Keep scores unless reset explicitly
      matchHistory: storeState.matchHistory,
      isMuted: storeState.isMuted,
      timerDuration: storeState.timerDuration,
      timeLeft: storeState.timerDuration,
      useKeyboardShortcuts: storeState.useKeyboardShortcuts,
    };
    
    syncToLocalStorage(['settings', 'names']);
    emitChange();
  },

  // Set AI Difficulty
  setDifficulty: (difficulty: AIDifficulty) => {
    playSound.click();
    storeState = {
      ...storeState,
      difficulty,
    };
    syncToLocalStorage(['settings']);
    emitChange();
  },

  // Custom player names update
  updatePlayerNames: (xName: string, oName: string) => {
    storeState = {
      ...storeState,
      playerXName: xName.trim() || 'Player X',
      playerOName: oName.trim() || 'Player O',
    };
    syncToLocalStorage(['names']);
    emitChange();
  },

  // Reset or Restart game board
  restartGame: () => {
    playSound.reset();
    storeState = {
      ...storeState,
      board: Array(9).fill(null) as BoardState,
      currentTurn: 'X',
      status: 'playing',
      winner: null,
      winningLine: undefined,
      timeLeft: storeState.timerDuration,
      showConfetti: false,
    };
    emitChange();
  },

  // Reset score board
  resetScores: () => {
    playSound.reset();
    storeState = {
      ...storeState,
      scores: { X: 0, O: 0, draws: 0 },
    };
    syncToLocalStorage(['scores']);
    emitChange();
  },

  // Mute/unmute settings
  toggleMute: () => {
    const isMuted = !storeState.isMuted;
    setMuteState(isMuted);
    
    storeState = {
      ...storeState,
      isMuted,
    };
    syncToLocalStorage(['settings']);
    
    if (!isMuted) {
      playSound.click();
    }
    emitChange();
  },

  // Timer duration setup
  setTimerDuration: (seconds: number) => {
    playSound.click();
    storeState = {
      ...storeState,
      timerDuration: seconds,
      timeLeft: seconds,
    };
    syncToLocalStorage(['settings']);
    emitChange();
  },

  // Keyboard shortcut configuration
  toggleKeyboardShortcuts: () => {
    playSound.click();
    storeState = {
      ...storeState,
      useKeyboardShortcuts: !storeState.useKeyboardShortcuts,
    };
    syncToLocalStorage(['settings']);
    emitChange();
  },

  // Simulated Online Matchmaking Architecture
  connectOnline: () => {
    if (storeState.status === 'playing') return;
    
    playSound.click();
    storeState = {
      ...storeState,
      isOnlineConnecting: true,
    };
    emitChange();

    // Simulate matchmaking search
    setTimeout(() => {
      storeState = {
        ...storeState,
        isOnlineConnecting: false,
        activeRoom: `cyber-arena-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: 'playing',
        board: Array(9).fill(null) as BoardState,
        currentTurn: 'X',
        playerXName: 'Local Hero',
        playerOName: `CyberNet_${Math.floor(Math.random() * 800 + 100)}`,
      };
      emitChange();
      
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 },
      });
    }, 2000);
  },

  disconnectOnline: () => {
    playSound.reset();
    storeState = {
      ...storeState,
      activeRoom: null,
      status: 'setup',
      board: Array(9).fill(null) as BoardState,
    };
    emitChange();
  },

  clearMatchHistory: () => {
    playSound.reset();
    storeState = {
      ...storeState,
      matchHistory: [],
    };
    syncToLocalStorage(['history']);
    emitChange();
  }
};

// React hook to tap into state reactive updates
export const useGameStore = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
