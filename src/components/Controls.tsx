"use client";

import React, { useState } from 'react';
import { useGameStore, gameActions } from '../store/gameStore';
import { RotateCcw, Award, History, Clock, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Controls: React.FC = () => {
  const {
    timerDuration,
    matchHistory,
    status,
    mode,
    activeRoom,
  } = useGameStore();

  const [showHistory, setShowHistory] = useState(false);

  const timerOptions = [
    { value: 0, label: 'Off' },
    { value: 5, label: '5s' },
    { value: 10, label: '10s' },
    { value: 15, label: '15s' },
    { value: 30, label: '30s' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      {/* 1. Timer Selection (Blitz Control) */}
      <div className="glass-card px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/[0.04] bg-zinc-950/20 flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 tracking-wider font-mono">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          BLITZ TIME:
        </span>
        <div className="flex bg-zinc-900/60 p-0.5 rounded-lg border border-white/[0.02]">
          {timerOptions.map((opt) => {
            const isActive = timerDuration === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => gameActions.setTimerDuration(opt.value)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition ${
                  isActive
                    ? 'bg-zinc-800 text-cyan-400 font-extrabold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Match Controls */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        {/* Restart Board */}
        <button
          onClick={() => {
            if (mode === 'online' && !activeRoom) {
              gameActions.connectOnline();
            } else {
              gameActions.restartGame();
            }
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-zinc-900 text-zinc-200 border border-white/[0.06] text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-800 hover:border-zinc-700/60 cyber-btn"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          Restart Match
        </button>

        {/* Reset Scores */}
        <button
          onClick={() => gameActions.resetScores()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-zinc-900 text-zinc-200 border border-white/[0.06] text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-800 hover:border-zinc-700/60 cyber-btn"
        >
          <Award className="w-3.5 h-3.5 text-zinc-400" />
          Reset Score
        </button>

        {/* Match History Trigger */}
        <button
          onClick={() => setShowHistory(true)}
          className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition hover:bg-zinc-800 relative shrink-0 cyber-btn"
          title="View match history logs"
        >
          <History className="w-4 h-4" />
          {matchHistory.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-fuchsia-600 text-white font-mono text-[9px] font-black flex items-center justify-center shadow-lg border border-zinc-950">
              {matchHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. Match History Modal Drawer overlay */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-lg glass-card rounded-2xl border border-white/[0.08] relative z-10 flex flex-col max-h-[80vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-zinc-950/40">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-black tracking-wider text-zinc-100 uppercase font-mono">
                      MATCH RECORDS LOG
                    </h3>
                    <p className="text-[9px] text-zinc-500 font-mono tracking-widest">
                      ARCHIVE OF RETRO ARENA SHOWDOWNS
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHistory(false)}
                  className="w-7 h-7 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center hover:bg-zinc-900 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content - History List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {matchHistory.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center gap-2">
                    <History className="w-8 h-8 text-zinc-700 animate-pulse" />
                    <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                      Zero Match Logged
                    </span>
                  </div>
                ) : (
                  matchHistory.map((match) => {
                    const isDraw = match.winner === 'draw';
                    const winLabel = isDraw
                      ? 'ROUND DRAW'
                      : `VICTORY FOR ${match.winner === 'X' ? match.playerX : match.playerO}`;

                    return (
                      <div
                        key={match.id}
                        className={`p-3.5 rounded-xl border flex flex-col gap-2 relative overflow-hidden bg-zinc-950/60 ${
                          isDraw
                            ? 'border-zinc-800'
                            : match.winner === 'X'
                            ? 'border-cyan-500/20'
                            : 'border-fuchsia-500/20'
                        }`}
                      >
                        {/* Winner glow bar */}
                        {!isDraw && (
                          <div
                            className={`absolute left-0 inset-y-0 w-1 ${
                              match.winner === 'X' ? 'bg-cyan-500' : 'bg-fuchsia-500'
                            }`}
                          />
                        )}

                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 tracking-wider">
                          <span className="uppercase">
                            {match.mode === 'ai' ? `AI Arena (${match.difficulty})` : match.mode === 'online' ? 'Net Arena' : 'Local Arena'}
                          </span>
                          <span>{match.date}</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-200">
                          <span className="text-xs font-bold max-w-[150px] truncate">
                            {match.playerX} (X)
                          </span>
                          <span className="text-[10px] font-black text-zinc-600 font-mono">VS</span>
                          <span className="text-xs font-bold max-w-[150px] truncate text-right">
                            {match.playerO} (O)
                          </span>
                        </div>

                        <div className="border-t border-white/[0.03] pt-1.5 flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black font-mono tracking-wider ${
                              isDraw
                                ? 'text-zinc-500'
                                : match.winner === 'X'
                                ? 'text-cyan-400 neon-text-cyan'
                                : 'text-fuchsia-400 neon-text-fuchsia'
                            }`}
                          >
                            {winLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              {matchHistory.length > 0 && (
                <div className="p-4 border-t border-white/[0.06] bg-zinc-950/40 flex justify-end">
                  <button
                    onClick={() => {
                      if (confirm('Clear entire cyber match archive?')) {
                        gameActions.clearMatchHistory();
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/20 text-red-400 border border-red-500/20 text-xs font-bold uppercase transition hover:bg-red-900/30 hover:border-red-500/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Logs
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Controls;
