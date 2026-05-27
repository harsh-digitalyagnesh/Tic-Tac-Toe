"use client";

import React from 'react';
import { useGameStore, gameActions } from '../store/gameStore';
import { Cell } from './Cell';
import { useAI } from '../hooks/useAI';
import { motion } from 'framer-motion';

export const Board: React.FC = () => {
  const {
    board,
    winningLine,
    winner,
    status,
    currentTurn,
    mode,
    activeRoom,
    useKeyboardShortcuts,
  } = useGameStore();

  // Initialize AI hook so that the AI makes a move when it's O's turn
  const { isThinking } = useAI();

  // Disabled cells when: game is over, AI is thinking, or it's remote player's turn online
  const isBoardDisabled =
    (status !== 'playing' && status !== 'setup') ||
    isThinking ||
    (mode === 'online' && (!activeRoom || currentTurn !== 'X'));

  // Coordinate lookup for winning lines (expressed as percentages)
  // [x1, y1, x2, y2]
  const getLineCoordinates = (line: number[] | undefined): [string, string, string, string] | null => {
    if (!line) return null;
    
    // Sort array to easily match combinations
    const key = [...line].sort((a, b) => a - b).join(',');

    const coordMap: Record<string, [string, string, string, string]> = {
      // Rows
      '0,1,2': ['5%', '16.66%', '95%', '16.66%'],
      '3,4,5': ['5%', '50%', '95%', '50%'],
      '6,7,8': ['5%', '83.33%', '95%', '83.33%'],
      // Columns
      '0,3,6': ['16.66%', '5%', '16.66%', '95%'],
      '1,4,7': ['50%', '5%', '50%', '95%'],
      '2,5,8': ['83.33%', '5%', '83.33%', '95%'],
      // Diagonals
      '0,4,8': ['10%', '10%', '90%', '90%'],
      '2,4,6': ['90%', '10%', '10%', '90%'],
    };

    return coordMap[key] || null;
  };

  const lineCoords = getLineCoordinates(winningLine);

  return (
    <div className="w-full max-w-[340px] sm:max-w-sm mx-auto px-2 sm:px-4 mt-4 sm:mt-6">
      {/* Visual board wrapping card */}
      <motion.div
        className="glass-card p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/[0.05] bg-zinc-950/30 relative shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Cell Grid Layout */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine ? winningLine.includes(idx) : false;
            return (
              <Cell
                key={idx}
                index={idx}
                value={cell}
                onClick={() => gameActions.makeMove(idx)}
                isWinningCell={isWinningCell}
                disabled={isBoardDisabled}
                showKeyboardShortcut={useKeyboardShortcuts}
              />
            );
          })}
        </div>

        {/* Dynamic SVG Drawing Winning Line Overlay */}
        {winner && winner !== 'draw' && lineCoords && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            <motion.line
              x1={lineCoords[0]}
              y1={lineCoords[1]}
              x2={lineCoords[2]}
              y2={lineCoords[3]}
              className={
                winner === 'X'
                  ? 'stroke-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                  : 'stroke-fuchsia-400 drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]'
              }
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </svg>
        )}

        {/* AI "Processing" Glass Overlay */}
        {isThinking && (
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30 flex items-center justify-center rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Pulsing processor circle */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full border-2 border-fuchsia-500/20 animate-ping" />
                <span className="w-10 h-10 rounded-full border-2 border-dashed border-fuchsia-500 animate-spin" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-fuchsia-400 font-mono uppercase animate-pulse">
                AI PROCESSING MOVE...
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
export default Board;
