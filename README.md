# 🌌 CYBER TAC TOE — Retro-Futuristic Arena

Cyber Tac Toe is a premium, highly-animated, retro-futuristic Tic Tac Toe platform built using **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. 

Featuring a deep cyber space theme, real-time browser-synthesized audio effects, unbeatable recursive minimax AI agents, customizable player names, high-suspense Blitz timers, and simulated Net Arena Matchmaking lobbies.

---

## 🌟 Key Features

* **3 Immersive Game Modes**:
  * **PvP Local Match**: Play face-to-face with a friend sitting next to you.
  * **Vs Cyber AI**: Challenge our custom neural processor stubs locally.
  * **Net Arena (Online Prep)**: A simulated online matchmaking lobby and room allocator.
* **Multi-tiered AI Opponents**:
  * **Novice (Easy)**: AI selects random cells using basic mathematical boundaries.
  * **Tactical (Medium)**: AI proactively takes winning moves, blocks human victories, and claims center cells.
  * **Cyber God (Impossible)**: Operates a recursive **Minimax decision tree** with depth penalties. Unbeatable by human players.
* **Real-time Web Audio Synthesizer**: Programmatic client-side audio oscillator generates satisfying retro sine, triangle, and sawtooth waves for hover, click, victory fanfare, and draw swell effects—completely eliminating physical asset loading.
* **Keyboard Hotkeys Accessibility**: Hover a cell or play immediately using keyboard numbers `[1 - 9]`. Press `[R]` to instantly trigger a round restart.
* **Blitz Turn Timer**: Configure high-stakes turn timers (5s, 10s, 15s, 30s, or Off) that automatically forfeit turns when time hits 0.
* **Persistent Cache Storage**: Instantly saves configurations, scores, custom names, and match records into `localStorage` across page updates.

---

## 🏗️ Folder Architecture

```
src/
├── app/
│   ├── layout.tsx         # Responsive HTML wrapper, SEO metadata, and Geist font styles
│   ├── globals.css        # Cybergrid, CRT scanlines, and neon fuchsia/cyan glow styles
│   └── page.tsx           # Page stiching and component assembly wrapper
├── components/
│   ├── Navbar.tsx         # Title logo, settings (mute, keybindings), and game mode select
│   ├── PlayerInfo.tsx     # Custom player naming stubs, pencil edits, and active turn indicators
│   ├── DifficultySelector.tsx # Neural Processor stubs for Easy, Medium, and Impossible AI modes
│   ├── ScoreBoard.tsx     # Neon scores tracker and turn Countdown Blitz Timer progress bar
│   ├── Board.tsx          # 3x3 cells grid + overlay SVG that draws the neon winning line
│   ├── Cell.tsx           # Animated cells with reactive sound hover/clicks & X/O vector drawings
│   ├── Controls.tsx       # Reset/Restart controls + Match History drawer panel
│   └── GameStatus.tsx     # Verdict screen overlays & simulated matchmaking loader
├── hooks/
│   ├── useGame.ts         # Handles turn timer intervals, local score caching, and keyboard listeners
│   └── useAI.ts           # Decides AI action based on current board + simulates natural thinking delays
├── store/
│   └── gameStore.ts       # Reactive state container based on React useSyncExternalStore
├── types/
│   └── game.ts            # Complete Type definitions for players, settings, state, and records
└── utils/
    ├── checkWinner.ts     # Win combinations evaluation logic
    ├── minimax.ts         # Easy, Medium, and Impossible minimax decision tree Pure functions
    └── sounds.ts          # Client Web Audio API real-time sound synthesizers
```

---

## 🚀 Getting Started

### 📦 Installation

Clone this repository and install the project dependencies:

```bash
# Navigate to project directory
cd "c:\Harsh\Games\Tic Tac Toe"

# Install Tailwind, Framer Motion, and Confetti components
npm install --legacy-peer-deps
```

### 💻 Launch Development Server

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your favorite browser.

### 🏗️ Compiling Production Build

To test and compile highly optimized production bundles:

```bash
# Compile and check TypeScript types
npm run build

# Start production server
npm run start
```

---

## 🧠 Algorithmic Deep Dive: Minimax Unbeatable AI

The Unbeatable AI uses the **Minimax recursive algorithm** inside `src/utils/minimax.ts`. When the AI makes a move, it creates a game tree, analyzing all future board states to determine the mathematically optimal move.

### Base Scoring System:
* **AI Wins (O)**: `+10 - depth` (Favors fast victories)
* **Human Wins (X)**: `depth - 10` (Favors delaying inevitable defeat)
* **Draw**: `0`

By computing standard backtracking minimax evaluation and selecting the maximum score for itself and minimizing the human player, the AI mathematically guarantees it will never lose a match.
