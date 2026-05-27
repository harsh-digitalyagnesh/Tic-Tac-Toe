"use client";

import React from 'react';
import { useGameStore, gameActions } from '../store/gameStore';
import { AIDifficulty } from '../types/game';
import { Shield, ShieldAlert, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DifficultySelector: React.FC = () => {
  const { mode, difficulty } = useGameStore();

  if (mode !== 'ai') return null;

  const difficultyLevels: {
    id: AIDifficulty;
    label: string;
    icon: React.ReactNode;
    color: string;
    glow: string;
    desc: string;
  }[] = [
    {
      id: 'easy',
      label: 'Novice (Easy)',
      icon: <Shield className="w-3.5 h-3.5" />,
      color: 'from-emerald-500/10 to-emerald-500/20 border-emerald-500/20 text-emerald-400',
      glow: 'shadow-emerald-500/10',
      desc: 'AI makes random moves'
    },
    {
      id: 'medium',
      label: 'Tactical (Med)',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      color: 'from-amber-500/10 to-amber-500/20 border-amber-500/20 text-amber-400',
      glow: 'shadow-amber-500/10',
      desc: 'AI blocks wins and takes wins'
    },
    {
      id: 'impossible',
      label: 'Cyber God (Impos)',
      icon: <Zap className="w-3.5 h-3.5" />,
      color: 'from-fuchsia-500/10 to-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-400',
      glow: 'shadow-fuchsia-500/20',
      desc: 'Minimax AI. You will never win!'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="w-full max-w-3xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.04] bg-zinc-950/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-fuchsia-400 tracking-widest uppercase font-mono">
                Neural Processor Settings
              </span>
              <h4 className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
                Adjust the difficulty level of the cybernetic opponent.
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              {difficultyLevels.map((level) => {
                const isActive = difficulty === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => gameActions.setDifficulty(level.id)}
                    className={`flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-300 relative ${
                      isActive
                        ? `${level.color} bg-white/[0.02] ${level.glow} shadow-md`
                        : 'border-white/[0.03] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.08]'
                    }`}
                    title={level.desc}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeDifficultyLight"
                        className={`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${
                          level.id === 'easy'
                            ? 'bg-emerald-400'
                            : level.id === 'medium'
                            ? 'bg-amber-400'
                            : 'bg-fuchsia-400'
                        }`}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    {level.icon}
                    <span>{level.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default DifficultySelector;
