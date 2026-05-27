"use client";

import React from 'react';
import { Sign } from '../types/game';
import { playSound } from '../utils/sounds';
import { motion } from 'framer-motion';

interface CellProps {
  index: number;
  value: Sign | null;
  onClick: () => void;
  isWinningCell: boolean;
  disabled: boolean;
  showKeyboardShortcut: boolean;
}

export const Cell: React.FC<CellProps> = ({
  index,
  value,
  onClick,
  isWinningCell,
  disabled,
  showKeyboardShortcut,
}) => {
  const handleMouseEnter = () => {
    if (!value && !disabled) {
      playSound.hover();
    }
  };

  const handleCellClick = () => {
    if (!value && !disabled) {
      onClick();
    }
  };

  // Variants for Framer Motion drawing animations
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeInOut' }
    }
  } as const;

  return (
    <motion.button
      onClick={handleCellClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled || value !== null}
      className={`aspect-square w-full rounded-2xl border transition-all duration-300 relative flex items-center justify-center cursor-pointer overflow-hidden ${
        value === null && !disabled
          ? 'glass-card glass-card-hover border-white/[0.04] bg-zinc-950/20 active:scale-95'
          : value === 'X'
          ? `glass-card border-cyan-500/20 bg-cyan-950/5 shadow-md ${isWinningCell ? 'cell-glow-x border-cyan-400 bg-cyan-950/20' : ''}`
          : value === 'O'
          ? `glass-card border-fuchsia-500/20 bg-fuchsia-950/5 shadow-md ${isWinningCell ? 'cell-glow-o border-fuchsia-400 bg-fuchsia-950/20' : ''}`
          : 'glass-card border-white/[0.02] bg-zinc-950/10 cursor-not-allowed'
      }`}
      whileHover={value === null && !disabled ? { scale: 1.03 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Keyboard Shortcut Hint Tag (1-9) */}
      {value === null && !disabled && showKeyboardShortcut && (
        <span className="absolute top-2 left-2 text-[9px] font-black font-mono text-zinc-600/80 leading-none select-none">
          {index + 1}
        </span>
      )}

      {/* SVG X / O Animated Drawing */}
      <div className="w-[60%] h-[60%] flex items-center justify-center relative">
        {value === 'X' && (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full stroke-current text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          >
            {/* First Diagonal line of X */}
            <motion.path
              d="M15 15 L85 85"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Second Diagonal line of X */}
            <motion.path
              d="M85 15 L15 85"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
            />
          </svg>
        )}

        {value === 'O' && (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full stroke-current text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          >
            {/* Circular Ring of O */}
            <motion.circle
              cx="50"
              cy="50"
              r="35"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          </svg>
        )}
      </div>

      {/* Winning Indicator Overlay (faint flash pulse) */}
      {isWinningCell && (
        <motion.div
          className={`absolute inset-0 -z-10 opacity-30 ${
            value === 'X' ? 'bg-cyan-500' : 'bg-fuchsia-500'
          }`}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  );
};
export default Cell;
