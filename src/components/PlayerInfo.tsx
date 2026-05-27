"use client";

import React, { useState, useEffect } from 'react';
import { useGameStore, gameActions } from '../store/gameStore';
import { Edit2, Check, User, Cpu, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlayerInfo: React.FC = () => {
  const {
    playerXName,
    playerOName,
    currentTurn,
    status,
    mode,
  } = useGameStore();

  const [editX, setEditX] = useState(false);
  const [editO, setEditO] = useState(false);
  const [nameX, setNameX] = useState(playerXName);
  const [nameO, setNameO] = useState(playerOName);

  // Sync names when game store values change
  useEffect(() => {
    setNameX(playerXName);
  }, [playerXName]);

  useEffect(() => {
    setNameO(playerOName);
  }, [playerOName]);

  const saveNames = () => {
    gameActions.updatePlayerNames(nameX, nameO);
  };

  const isXActive = currentTurn === 'X' && status === 'playing';
  const isOActive = currentTurn === 'O' && status === 'playing';

  return (
    <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-4 max-w-3xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
      {/* Player X Info Panel */}
      <motion.div
        className={`glass-card p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all duration-300 relative border ${
          isXActive
            ? 'border-cyan-500 bg-cyan-950/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
            : 'border-white/[0.04]'
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isXActive && (
          <span className="absolute top-1 right-2 sm:top-2 sm:right-3 text-[8px] sm:text-[9px] font-bold text-cyan-400 tracking-wider animate-pulse flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="hidden xs:inline">ACTIVE</span>
          </span>
        )}

        <div className="flex items-center gap-2 sm:gap-4 w-full mr-1 sm:mr-2">
          {/* Avatar X */}
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-950 to-blue-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shrink-0">
            <User className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[8px] sm:text-[10px] font-bold text-cyan-400 tracking-wider sm:tracking-widest uppercase font-mono">
                Player X
              </span>
              <span className="text-[7px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-mono font-semibold">
                {mode === 'online' ? 'Local' : 'P1'}
              </span>
            </div>

            {editX ? (
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  value={nameX}
                  onChange={(e) => setNameX(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditX(false);
                      saveNames();
                    }
                  }}
                  className="bg-zinc-900 border border-cyan-500/50 rounded px-1.5 py-0.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full"
                  maxLength={12}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setEditX(false);
                    saveNames();
                  }}
                  className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 shrink-0"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5">
                <h3 className="text-xs sm:text-base font-bold text-zinc-100 truncate max-w-[80px] sm:max-w-[160px]">
                  {playerXName}
                </h3>
                {mode !== 'online' && (
                  <button
                    onClick={() => setEditX(true)}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] transition"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-xl sm:text-3xl font-black text-cyan-400 select-none font-mono shrink-0 pl-1">
          X
        </div>
      </motion.div>

      {/* Player O Info Panel */}
      <motion.div
        className={`glass-card p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all duration-300 relative border ${
          isOActive
            ? 'border-fuchsia-500 bg-fuchsia-950/10 shadow-[0_0_20px_rgba(217,70,239,0.15)]'
            : 'border-white/[0.04]'
        }`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isOActive && (
          <span className="absolute top-1 right-2 sm:top-2 sm:right-3 text-[8px] sm:text-[9px] font-bold text-fuchsia-400 tracking-wider animate-pulse flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            <span className="hidden xs:inline">ACTIVE</span>
          </span>
        )}

        <div className="flex items-center gap-2 sm:gap-4 w-full mr-1 sm:mr-2">
          {/* Avatar O */}
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-fuchsia-950 to-purple-900 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shadow-md shrink-0">
            {mode === 'ai' ? <Cpu className="w-4 h-4 sm:w-6 sm:h-6" /> : mode === 'online' ? <Network className="w-4 h-4 sm:w-6 sm:h-6" /> : <User className="w-4 h-4 sm:w-6 sm:h-6" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[8px] sm:text-[10px] font-bold text-fuchsia-400 tracking-wider sm:tracking-widest uppercase font-mono">
                Player O
              </span>
              <span className="text-[7px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-mono font-semibold">
                {mode === 'ai' ? 'Neural' : mode === 'online' ? 'Remote' : 'P2'}
              </span>
            </div>

            {editO ? (
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  value={nameO}
                  onChange={(e) => setNameO(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditO(false);
                      saveNames();
                    }
                  }}
                  className="bg-zinc-900 border border-fuchsia-500/50 rounded px-1.5 py-0.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 w-full"
                  maxLength={12}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setEditO(false);
                    saveNames();
                  }}
                  className="p-1 rounded bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-500/30 shrink-0"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5">
                <h3 className="text-xs sm:text-base font-bold text-zinc-100 truncate max-w-[80px] sm:max-w-[160px]">
                  {playerOName}
                </h3>
                {mode === 'pvp' && (
                  <button
                    onClick={() => setEditO(true)}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] transition"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-xl sm:text-3xl font-black text-fuchsia-400 select-none font-mono shrink-0 pl-1">
          O
        </div>
      </motion.div>
    </div>
  );
};
export default PlayerInfo;
