"use client";

import React from 'react';
import Navbar from '../components/Navbar';
import PlayerInfo from '../components/PlayerInfo';
import DifficultySelector from '../components/DifficultySelector';
import ScoreBoard from '../components/ScoreBoard';
import Board from '../components/Board';
import Controls from '../components/Controls';
import GameStatus from '../components/GameStatus';
import { useGame } from '../hooks/useGame';
import { motion } from 'framer-motion';
import { Keyboard, ShieldAlert } from 'lucide-react';

export default function Home() {
  // We invoke the useGame hook which hydrates localStorage and registers intervals & listeners
  const game = useGame();

  return (
    <div className="flex-1 flex flex-col relative pb-12">
      {/* 1. Cyber Retro Backgrounds */}
      <div className="cyber-bg" />
      <div className="cyber-scanlines" />

      {/* 2. Top Navigation header */}
      <Navbar />

      {/* 3. Main Dashboard Wrapper */}
      <main className="flex-1 flex flex-col items-center justify-start md:justify-center py-4 w-full px-2 sm:px-4">
        {/* Animated Cybernetic Header Banner */}
        <motion.div
          className="text-center max-w-sm px-4 mb-2 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-[10px] font-black tracking-widest text-cyan-400 font-mono uppercase bg-cyan-950/20 px-2.5 py-0.5 rounded border border-cyan-500/10">
            Secure PvP & AI Grid
          </span>
        </motion.div>

        {/* Player Name and Visual Info */}
        <PlayerInfo />

        {/* AI Processor Difficulty Level Panel */}
        <DifficultySelector />

        {/* Score Board Cards & Timer Progress */}
        <ScoreBoard />

        {/* Interactive 3x3 Grid Board */}
        <Board />

        {/* Controls, Timer and History Buttons */}
        <Controls />

        {/* Winner Dialog Overlay, Draw Overlay, simulated Matchmaking */}
        <GameStatus />
      </main>

      {/* 4. Accessibility and Keyboard Hotkeys Footer */}
      <footer className="w-full max-w-3xl mx-auto px-4 mt-8">
        <motion.div
          className="glass-card p-3 rounded-2xl border border-white/[0.03] bg-zinc-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase">
              Keyboard Short-Keys Activated:
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] font-black font-mono tracking-widest uppercase">
            <span className="px-2 py-0.5 rounded border border-zinc-800 text-zinc-400 bg-zinc-900/60 shadow-sm">
              [1 - 9] cells
            </span>
            <span className="px-2 py-0.5 rounded border border-zinc-800 text-zinc-400 bg-zinc-900/60 shadow-sm">
              [r] quick restart
            </span>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
