"use client";

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Hourglass, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const ScoreBoard: React.FC = () => {
  const {
    scores,
    playerXName,
    playerOName,
    timerDuration,
    timeLeft,
    status,
    currentTurn,
  } = useGameStore();

  const isLowTime = timeLeft <= 3 && timerDuration > 0 && status === 'playing';

  // Percentage of timer remaining
  const timerPercentage = timerDuration > 0 ? (timeLeft / timerDuration) * 100 : 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6 flex flex-col gap-2.5 sm:gap-4">
      {/* 3-Column Score Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Player X Score Card */}
        <motion.div
          className="glass-card p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-cyan-500/20 bg-cyan-950/5 text-center shadow-lg relative overflow-hidden flex flex-col justify-center"
          whileHover={{ y: -2 }}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-cyan-500/30" />
          <h4 className="text-[8px] sm:text-[10px] font-bold text-cyan-400 tracking-wider sm:tracking-widest uppercase font-mono truncate px-1">
            {playerXName}
          </h4>
          <span className="text-lg sm:text-2xl font-black text-white mt-0.5 sm:mt-1 neon-text-cyan font-mono">
            {scores.X}
          </span>
        </motion.div>

        {/* Draws Card */}
        <motion.div
          className="glass-card p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-950/20 text-center shadow-lg relative overflow-hidden flex flex-col justify-center"
          whileHover={{ y: -2 }}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-zinc-700/30" />
          <h4 className="text-[8px] sm:text-[10px] font-bold text-zinc-500 tracking-wider sm:tracking-widest uppercase font-mono">
            Draws
          </h4>
          <span className="text-lg sm:text-2xl font-black text-white mt-0.5 sm:mt-1 font-mono">
            {scores.draws}
          </span>
        </motion.div>

        {/* Player O Score Card */}
        <motion.div
          className="glass-card p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-fuchsia-500/20 bg-fuchsia-950/5 text-center shadow-lg relative overflow-hidden flex flex-col justify-center"
          whileHover={{ y: -2 }}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-fuchsia-500/30" />
          <h4 className="text-[8px] sm:text-[10px] font-bold text-fuchsia-400 tracking-wider sm:tracking-widest uppercase font-mono truncate px-1">
            {playerOName}
          </h4>
          <span className="text-lg sm:text-2xl font-black text-white mt-0.5 sm:mt-1 neon-text-fuchsia font-mono">
            {scores.O}
          </span>
        </motion.div>
      </div>

      {/* Timer Bar (Blitz mode indicator) */}
      {timerDuration > 0 && status === 'playing' && (
        <div className="w-full glass-card p-3 rounded-2xl border border-white/[0.04] bg-zinc-950/40 relative overflow-hidden flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider font-mono">
            <span className="flex items-center gap-1 text-zinc-400">
              <Hourglass className={`w-3.5 h-3.5 ${isLowTime ? 'text-red-500 animate-spin' : 'text-zinc-500'}`} />
              BLITZ TIMER ACTIVE
            </span>
            <span className={isLowTime ? 'text-red-500 animate-pulse font-extrabold' : 'text-zinc-300'}>
              {timeLeft} SECONDS LEFT
            </span>
          </div>

          {/* Progress Slider Track */}
          <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden relative border border-white/[0.03]">
            <motion.div
              className={`h-full rounded-full ${
                isLowTime
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                  : currentTurn === 'X'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-gradient-to-r from-fuchsia-400 to-purple-600 shadow-[0_0_10px_rgba(217,70,239,0.4)]'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: `${timerPercentage}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ScoreBoard;
