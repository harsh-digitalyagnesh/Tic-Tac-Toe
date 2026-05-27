"use client";

import React from 'react';
import { useGameStore, gameActions } from '../store/gameStore';
import { GameMode } from '../types/game';
import { Volume2, VolumeX, Keyboard, Gamepad2, Users, Globe, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { mode, isMuted, useKeyboardShortcuts, activeRoom } = useGameStore();

  const modesList: { id: GameMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'pvp',
      label: 'Local',
      icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      desc: 'Play with a friend sitting next to you'
    },
    {
      id: 'ai',
      label: 'Vs AI',
      icon: <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      desc: 'Test your skills against our neural networks'
    },
    {
      id: 'online',
      label: 'Online',
      icon: <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      desc: 'Simulated online multiplayer arena'
    }
  ];

  return (
    <header className="w-full border-b border-white/[0.06] py-2.5 sm:py-3.5 px-3 sm:px-6 md:px-12 flex items-center justify-between gap-2 sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md shadow-md">
      {/* Title / Logo (Horizontal & Compact) */}
      <div className="flex items-center gap-2">
        <div className="w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
          <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="leading-none">
          <h1 className="text-xs sm:text-base md:text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-transparent uppercase font-sans">
            <span className="hidden xs:inline">Cyber Tac Toe</span>
            <span className="xs:hidden">Cyber Toe</span>
          </h1>
          <p className="hidden sm:block text-[8px] tracking-widest text-zinc-500 uppercase font-mono mt-0.5">
            Retro Synth Edition
          </p>
        </div>
      </div>

      {/* Game Mode Selector (Icons on mobile, text on desktop) */}
      <nav className="flex items-center bg-zinc-900/60 p-0.5 sm:p-1 rounded-xl border border-white/[0.04]">
        {modesList.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                if (m.id === 'online' && activeRoom) return; // Cannot switch mode while in active online match
                gameActions.setMode(m.id);
              }}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-xs font-bold uppercase transition-all duration-300 select-none ${
                isActive
                  ? 'text-black font-extrabold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title={m.desc}
            >
              {isActive && (
                <motion.div
                  layoutId="activeModeBg"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {m.icon}
              <span className="hidden md:inline">{m.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Utility Settings (Compact Horizontally) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Keyboard Shortcut Indicators */}
        <button
          onClick={() => gameActions.toggleKeyboardShortcuts()}
          className={`w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cyber-btn border ${
            useKeyboardShortcuts
              ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]'
              : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          title={useKeyboardShortcuts ? "Keyboard inputs (1-9) active" : "Keyboard inputs inactive"}
        >
          <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => gameActions.toggleMute()}
          className={`w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cyber-btn border ${
            !isMuted
              ? 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-950/20 shadow-[0_0_8px_rgba(217,70,239,0.1)]'
              : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          title={isMuted ? "Sound muted" : "Sound active"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>
    </header>
  );
};
export default Navbar;
