"use client";

import React from 'react';
import { useGameStore, gameActions } from '../store/gameStore';
import { Trophy, RefreshCw, AlertTriangle, ShieldCheck, Globe, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GameStatus: React.FC = () => {
  const {
    winner,
    status,
    playerXName,
    playerOName,
    mode,
    isOnlineConnecting,
    activeRoom,
  } = useGameStore();

  const isGameOver = status === 'won' || status === 'draw';

  return (
    <AnimatePresence>
      {/* 1. Simulated Matchmaking / Online Connecting Loader */}
      {isOnlineConnecting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
            {/* Pulsing Globe with spinning network arches */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-500/20"
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border border-fuchsia-500/30"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <Globe className="w-10 h-10 text-cyan-400 animate-pulse drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
            </div>

            <div>
              <h3 className="text-base font-black tracking-wider text-zinc-100 uppercase font-mono">
                SECURE MATCHMAKING
              </h3>
              <p className="text-[10px] text-cyan-400 font-mono tracking-widest mt-1">
                SEARCHING CYBERNET CHANNELS...
              </p>
            </div>

            <div className="w-48 h-1 rounded-full bg-zinc-900 overflow-hidden relative border border-white/[0.03] mt-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            
            <p className="text-[10px] text-zinc-500 mt-1 font-mono italic">
              Allocating dedicated game room at ping: 14ms
            </p>
          </div>
        </motion.div>
      )}

      {/* 2. Setup screen prompts for Online Mode */}
      {mode === 'online' && !activeRoom && !isOnlineConnecting && (
        <motion.div
          className="w-full max-w-sm mx-auto px-4 mt-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="glass-card p-6 rounded-3xl border border-cyan-500/20 bg-cyan-950/5 flex flex-col items-center gap-4">
            <Wifi className="w-12 h-12 text-cyan-400 animate-bounce" />
            
            <div>
              <h4 className="text-sm font-bold text-zinc-100 font-mono tracking-wider uppercase">
                NET ARENA lobby
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Establish high-frequency connections to play online matches against synthetic opponents.
              </p>
            </div>

            <button
              onClick={() => gameActions.connectOnline()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              CONNECT TO NET ARENA
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. Game Over Results Overlay */}
      {isGameOver && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Card */}
          <motion.div
            className={`w-full max-w-sm glass-card p-6 rounded-3xl border relative text-center flex flex-col items-center gap-5 shadow-2xl ${
              winner === 'draw'
                ? 'border-zinc-700 bg-zinc-950/80'
                : winner === 'X'
                ? 'border-cyan-500/40 bg-cyan-950/80 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                : 'border-fuchsia-500/40 bg-fuchsia-950/80 shadow-[0_0_30px_rgba(217,70,239,0.2)]'
            }`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 380 }}
          >
            {/* Visual Icon Trophy / Alert */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative ${
                winner === 'draw'
                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                  : winner === 'X'
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 shadow-cyan-500/20'
                  : 'bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-500/40 shadow-fuchsia-500/20'
              }`}
            >
              {winner === 'draw' ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <Trophy className="w-8 h-8" />
              )}
            </div>

            {/* Verdict text */}
            <div>
              <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase font-mono">
                Match concluded
              </span>
              <h2
                className={`text-2xl font-black mt-1 uppercase font-mono ${
                  winner === 'draw'
                    ? 'text-zinc-300'
                    : winner === 'X'
                    ? 'text-cyan-400 neon-text-cyan'
                    : 'text-fuchsia-400 neon-text-fuchsia'
                }`}
              >
                {winner === 'draw'
                  ? 'ARENA DRAW'
                  : winner === 'X'
                  ? `${playerXName} Wins!`
                  : `${playerOName} Wins!`}
              </h2>
              <p className="text-[11px] text-zinc-400 mt-2 max-w-[240px] mx-auto">
                {winner === 'draw'
                  ? 'Perfect defense on both sides. No processor was harmed.'
                  : winner === 'X'
                  ? 'Flawless calculation vectors deployed by player X.'
                  : 'Neural net O sweeps grid cells with absolute supremacy.'}
              </p>
            </div>

            {/* Restart Buttons */}
            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => gameActions.restartGame()}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                  winner === 'draw'
                    ? 'bg-zinc-100 text-black hover:bg-white'
                    : winner === 'X'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:shadow-lg hover:shadow-cyan-500/20'
                    : 'bg-gradient-to-r from-fuchsia-400 to-purple-600 text-black hover:shadow-lg hover:shadow-fuchsia-500/20'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Play Next Round
              </button>
              
              {mode === 'online' && (
                <button
                  onClick={() => gameActions.disconnectOnline()}
                  className="w-full py-2.5 rounded-2xl border border-white/[0.06] text-zinc-400 hover:text-zinc-200 text-xs font-bold uppercase tracking-wider transition bg-zinc-950/40 hover:bg-zinc-900"
                >
                  Leave Arena
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default GameStatus;
