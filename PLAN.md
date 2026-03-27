# 🎭 Monty Hall Probability Lab: Technical Specification

## 1. Project Background
- **Objective**: To visualize the counter-intuitive nature of the Monty Hall Paradox through interactive game-play and high-speed statistical simulation.
- **Goal**: Paradox proof by visualizing the law of large numbers (Convergence to 2/3 win-rate for switching).

## 2. Structural Requirements (Phase 1: Shell)
- **Container**: 1200x800px Dark Lab Layout.
- **Stage**: Three Doors (Door 1, 2, 3) with hover effects.
- **Dashboard**:
  - Current Game State Display (Mission Briefing).
  - Paradox Simulation Console.
  - Real-time Convergence Chart (using Chart.js).

## 3. Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+).
- **Visualization**: Chart.js for data plotting.
- **Animations**: CSS Transitions / Keyframes for door mechanics.

## 4. Design Guidelines (Premium & Functional)
- **Glassmorphism**: 
  - `backdrop-filter: blur(10px);`
  - `background: rgba(255, 255, 255, 0.05);`
- **Typography**: 
  - Headline: 'Inter', sans-serif (Bold/Neon).
  - Data: 'Roboto Mono', monospace.
- **Color Palette**:
  - Background: #0a0a0b (Midnight Black)
  - Surface: #1a1a1d
  - Cyan Accent: #00d2ff
  - Success Green: #00c853
  - Warning Red: #d50000

## 5. Branch Workflow
- **Branch**: `feature/monty-hall-lab`
- **Commit Frequency**: Every major component completion.
- **Push Target**: `origin feature/monty-hall-lab` (damemoto-shiro/jibun-os-backup)
