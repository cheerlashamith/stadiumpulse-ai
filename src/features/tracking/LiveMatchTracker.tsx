import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { 
  Play, Pause, RefreshCw, Zap, Flame, Award, Shield, 
  Volume2, Info, Compass 
} from 'lucide-react';

// Player coordinate data type
interface PlayerPos {
  id: string;
  name: string;
  number: number;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
}

// Frame representation in simulation script
interface PlayFrame {
  ball: { x: number; y: number };
  teamA: PlayerPos[];
  teamB: PlayerPos[];
  commentary: string;
  event?: 'goal' | 'foul' | 'shoot' | 'none';
  stats?: {
    possession: [number, number];
    crowdEnergy: number;
    passAccuracy: [number, number];
  };
}

// 1. Kickoff sequence
const kickoffFrames: PlayFrame[] = [
  {
    ball: { x: 50, y: 50 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 28, y: 50 },
      { id: 'a2', name: 'Gomez', number: 10, x: 46, y: 44 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 49, y: 52 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 72, y: 50 },
      { id: 'b2', name: 'Johnson', number: 8, x: 54, y: 45 },
      { id: 'b3', name: 'Kane', number: 11, x: 54, y: 55 }
    ],
    commentary: "Match day kickoff! Emerald FC vs Teal United here under the smart stadium twin.",
    event: 'none',
    stats: { possession: [50, 50], crowdEnergy: 75, passAccuracy: [85, 85] }
  },
  {
    ball: { x: 42, y: 44 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 30, y: 48 },
      { id: 'a2', name: 'Gomez', number: 10, x: 42, y: 44 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 49, y: 48 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 70, y: 48 },
      { id: 'b2', name: 'Johnson', number: 8, x: 45, y: 42 },
      { id: 'b3', name: 'Kane', number: 11, x: 58, y: 56 }
    ],
    commentary: "Gomez (Emerald #10) wins the midfield duel and scans options down the wing.",
    event: 'none',
    stats: { possession: [55, 45], crowdEnergy: 78, passAccuracy: [86, 84] }
  },
  {
    ball: { x: 72, y: 28 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 32, y: 45 },
      { id: 'a2', name: 'Gomez', number: 10, x: 46, y: 35 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 71, y: 29 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 72, y: 38 },
      { id: 'b2', name: 'Johnson', number: 8, x: 50, y: 38 },
      { id: 'b3', name: 'Kane', number: 11, x: 60, y: 50 }
    ],
    commentary: "Brilliant diagonal chip from Gomez finding Rodriguez behind the defensive line!",
    event: 'none',
    stats: { possession: [60, 40], crowdEnergy: 84, passAccuracy: [88, 83] }
  },
  {
    ball: { x: 84, y: 46 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 35, y: 45 },
      { id: 'a2', name: 'Gomez', number: 10, x: 58, y: 38 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 83, y: 46 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 84, y: 48 },
      { id: 'b2', name: 'Johnson', number: 8, x: 62, y: 40 },
      { id: 'b3', name: 'Kane', number: 11, x: 62, y: 45 }
    ],
    commentary: "Rodriguez cuts inside the penalty box! Smith attempts a sliding tackle.",
    event: 'shoot',
    stats: { possession: [62, 38], crowdEnergy: 90, passAccuracy: [88, 82] }
  },
  {
    ball: { x: 96, y: 50 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 38, y: 45 },
      { id: 'a2', name: 'Gomez', number: 10, x: 68, y: 40 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 90, y: 52 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 91, y: 50 },
      { id: 'b2', name: 'Johnson', number: 8, x: 70, y: 42 },
      { id: 'b3', name: 'Kane', number: 11, x: 65, y: 43 }
    ],
    commentary: "⚽ GOAL! Rodriguez lashes a fierce drive right into the roof of the net!",
    event: 'goal',
    stats: { possession: [65, 35], crowdEnergy: 98, passAccuracy: [89, 82] }
  },
  {
    ball: { x: 96, y: 50 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 45, y: 45 },
      { id: 'a2', name: 'Gomez', number: 10, x: 80, y: 48 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 93, y: 56 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 91, y: 50 },
      { id: 'b2', name: 'Johnson', number: 8, x: 74, y: 46 },
      { id: 'b3', name: 'Kane', number: 11, x: 65, y: 43 }
    ],
    commentary: "Deafening roar in Section 104! Supporters are celebrating. Fan energy meter hits maximum.",
    event: 'none',
    stats: { possession: [64, 36], crowdEnergy: 100, passAccuracy: [89, 82] }
  }
];

// 2. Teal Counter-Attack sequence
const counterFrames: PlayFrame[] = [
  {
    ball: { x: 50, y: 50 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 30, y: 50 },
      { id: 'a2', name: 'Gomez', number: 10, x: 45, y: 45 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 48, y: 55 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 70, y: 50 },
      { id: 'b2', name: 'Johnson', number: 8, x: 52, y: 48 },
      { id: 'b3', name: 'Kane', number: 11, x: 52, y: 52 }
    ],
    commentary: "Teal United resets control. Johnson initiates short passing cycles.",
    event: 'none',
    stats: { possession: [45, 55], crowdEnergy: 74, passAccuracy: [87, 86] }
  },
  {
    ball: { x: 35, y: 72 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 26, y: 65 },
      { id: 'a2', name: 'Gomez', number: 10, x: 42, y: 52 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 45, y: 58 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 65, y: 50 },
      { id: 'b2', name: 'Johnson', number: 8, x: 38, y: 68 },
      { id: 'b3', name: 'Kane', number: 11, x: 32, y: 74 }
    ],
    commentary: "Intercepted by Johnson, who maps a fast forward sequence towards Kane on the left.",
    event: 'none',
    stats: { possession: [42, 58], crowdEnergy: 77, passAccuracy: [86, 88] }
  },
  {
    ball: { x: 18, y: 68 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 19, y: 66 },
      { id: 'a2', name: 'Gomez', number: 10, x: 38, y: 54 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 45, y: 58 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 60, y: 48 },
      { id: 'b2', name: 'Johnson', number: 8, x: 36, y: 60 },
      { id: 'b3', name: 'Kane', number: 11, x: 19, y: 67 }
    ],
    commentary: "Foul! Alvarez locks legs with Kane. Free kick awarded to Teal United close to the box.",
    event: 'foul',
    stats: { possession: [40, 60], crowdEnergy: 85, passAccuracy: [85, 87] }
  },
  {
    ball: { x: 18, y: 68 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 15, y: 54 },
      { id: 'a2', name: 'Gomez', number: 10, x: 14, y: 58 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 15, y: 62 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 42, y: 48 },
      { id: 'b2', name: 'Johnson', number: 8, x: 26, y: 68 },
      { id: 'b3', name: 'Kane', number: 11, x: 18, y: 68 }
    ],
    commentary: "Kane is setting up the ball. Emerald FC sets up a three-man defensive wall.",
    event: 'none',
    stats: { possession: [40, 60], crowdEnergy: 88, passAccuracy: [85, 87] }
  },
  {
    ball: { x: 4, y: 52 },
    teamA: [
      { id: 'a1', name: 'Alvarez', number: 4, x: 13, y: 54 },
      { id: 'a2', name: 'Gomez', number: 10, x: 12, y: 58 },
      { id: 'a3', name: 'Rodriguez', number: 9, x: 14, y: 62 }
    ],
    teamB: [
      { id: 'b1', name: 'Smith', number: 3, x: 38, y: 48 },
      { id: 'b2', name: 'Johnson', number: 8, x: 25, y: 60 },
      { id: 'b3', name: 'Kane', number: 11, x: 16, y: 64 }
    ],
    commentary: "Kane shoots! Magnificent leap by Emerald's goalkeeper pushing it out for a corner!",
    event: 'shoot',
    stats: { possession: [44, 56], crowdEnergy: 95, passAccuracy: [85, 86] }
  }
];

/**
 * Futuristic 2D Digital Twin Football Match Tracker component.
 * Renders a soccer pitch utilizing framer-motion keyframes to animate the positions
 * of the soccer ball and players on the field. Features modular tab selections for:
 * - Live Tracking: moving players with synchronized text-based match commentary.
 * - Tactical Heatmap: pulsing alpha blur gradient meshes.
 * - Passing Vectors: animated directional SVG arrow arrays.
 * 
 * Supports standard accessibility high contrast configurations and multilingual lookups.
 * 
 * @component
 */
export const LiveMatchTracker: React.FC = () => {
  const { language, highContrast } = useAppState();
  
  // Tracking modes
  const [viewMode, setViewMode] = useState<'track' | 'heatmap' | 'vectors'>('track');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [score, setScore] = useState<[number, number]>([1, 0]);
  
  // Active simulation timelines
  const [activeTimeline, setActiveTimeline] = useState<'kickoff' | 'counter'>('kickoff');
  const [frameIndex, setFrameIndex] = useState<number>(0);
  
  // Custom mock analytics state
  const [liveCarbonSaved, setLiveCarbonSaved] = useState<number>(8432.12);
  const [energyHistory, setEnergyHistory] = useState<number[]>([70, 75, 74, 80, 85, 90, 95]);

  const timelineFrames = useMemo(() => {
    return activeTimeline === 'kickoff' ? kickoffFrames : counterFrames;
  }, [activeTimeline]);

  const currentFrame = timelineFrames[frameIndex];

  // Simulation timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= timelineFrames.length) {
          // If kickoff sequence ends, increment score and switch to counter attack sequence
          if (activeTimeline === 'kickoff') {
            setActiveTimeline('counter');
            setFrameIndex(0);
          } else {
            setActiveTimeline('kickoff');
            setFrameIndex(0);
          }
          return 0;
        }
        return nextIndex;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, activeTimeline, timelineFrames]);

  // Handle Score Updates based on Goal Events
  useEffect(() => {
    if (currentFrame?.event === 'goal' && activeTimeline === 'kickoff' && frameIndex === 4) {
      setScore([2, 0]); // E9 scores
    }
  }, [frameIndex, activeTimeline, currentFrame]);

  // Carbon ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCarbonSaved((prev) => parseFloat((prev + Math.random() * 0.08).toFixed(2)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Update Crowd Energy History
  useEffect(() => {
    if (currentFrame?.stats) {
      setEnergyHistory(prev => {
        const next = [...prev.slice(1), currentFrame.stats!.crowdEnergy];
        return next;
      });
    }
  }, [frameIndex, currentFrame]);

  const handleEventSimulation = (type: 'goal' | 'foul') => {
    setIsPlaying(false);
    if (type === 'goal') {
      setActiveTimeline('kickoff');
      setFrameIndex(4); // Trigger Goal Frame directly
      setScore(prev => [prev[0] + 1, prev[1]]);
    } else {
      setActiveTimeline('counter');
      setFrameIndex(2); // Trigger Foul Frame directly
    }
  };

  const handleReset = () => {
    setActiveTimeline('kickoff');
    setFrameIndex(0);
    setScore([1, 0]);
    setIsPlaying(true);
  };

  // Helper colors mapping for accessibility & team tags
  const themeStyles = {
    cardBg: highContrast 
      ? 'bg-black border-2 border-white text-white' 
      : 'bg-slate-900/90 border-slate-800 backdrop-blur-md text-slate-100 shadow-xl shadow-emerald-950/5',
    pitchBg: highContrast 
      ? 'bg-black border-2 border-white' 
      : 'bg-radial from-emerald-950/80 to-slate-950 border-emerald-500/20 shadow-inner',
    pitchLines: highContrast ? 'border-white opacity-100' : 'border-emerald-500/20 opacity-70',
    statLabel: highContrast ? 'text-white font-mono' : 'text-slate-400 font-medium',
    accentGreen: highContrast ? '#ffffff' : '#10b981',
    accentCyan: highContrast ? '#ffffff' : '#06b6d4',
  };

  return (
    <div 
      className={`p-5 rounded-3xl border ${themeStyles.cardBg} w-full transition-all duration-300 font-sans`}
      id="live-match-tracker"
      role="region" 
      aria-label="Futuristic Live Football Match Digital Twin Tracker"
    >
      {/* Scoreboard and Status Control Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3.5 mb-5 border-b border-slate-800/80 pb-4">
        
        {/* Brand & Score */}
        <div className="flex items-center space-x-4 select-none">
          <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 border ${
            highContrast ? 'bg-black border-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-sm'
          }`}>
            <Compass className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest border font-mono ${
                highContrast ? 'bg-black border-white text-white' : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'
              }`}>
                Live Twin
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <h3 className="text-sm font-extrabold tracking-tight mt-0.5">StadiumPulse Derby</h3>
          </div>
        </div>

        {/* Live Scoreboard */}
        <div className="flex items-center space-x-3.5 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className={highContrast ? 'text-white' : 'text-emerald-400'}>EMD</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400">FC</span>
          </div>
          <div className="text-md font-mono font-black tracking-widest text-white px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">
            {score[0]} : {score[1]}
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-400">UTD</span>
            <span className={highContrast ? 'text-white' : 'text-cyan-400'}>TEL</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Main Pitch on left/top, stats and ticker on right/bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        
        {/* Futuristic 2D Pitch Twin (Span 2 columns on large screens) */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          
          {/* View Mode Tabs Selector */}
          <div className="flex justify-between items-center bg-slate-950/50 p-1 border border-slate-850 rounded-2xl">
            <div className="flex items-center space-x-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('track')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  viewMode === 'track' 
                    ? (highContrast ? 'bg-white text-black font-extrabold' : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10')
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Switch to Live Ball and Player Tracker"
              >
                <span>Live Tracker</span>
              </button>

              <button
                onClick={() => setViewMode('heatmap')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  viewMode === 'heatmap' 
                    ? (highContrast ? 'bg-white text-black font-extrabold' : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10')
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Switch to Heatmap Mode"
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Tactical Heatmap</span>
              </button>

              <button
                onClick={() => setViewMode('vectors')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  viewMode === 'vectors' 
                    ? (highContrast ? 'bg-white text-black font-extrabold' : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10')
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label="Switch to Passing Vectors View"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Pass Vectors</span>
              </button>
            </div>
            
            <div className="hidden sm:flex items-center text-[10px] text-slate-500 font-mono font-bold mr-2">
              MODE: {viewMode.toUpperCase()}
            </div>
          </div>

          {/* The Pitch Container */}
          <div className={`relative rounded-2xl overflow-hidden aspect-video md:aspect-[21/9] p-4 ${themeStyles.pitchBg}`}>
            
            {/* Pitch Markings */}
            {/* Field Boundary */}
            <div className={`absolute inset-3 border-2 ${themeStyles.pitchLines} rounded-lg`} />
            
            {/* Midfield Line */}
            <div className={`absolute top-3 bottom-3 left-1/2 -translate-x-1/2 border-l-2 ${themeStyles.pitchLines}`} />
            
            {/* Midfield Circle */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 ${themeStyles.pitchLines}`} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${highContrast ? 'bg-white' : 'bg-emerald-500/40'}`} />

            {/* Left Penalty Area */}
            <div className={`absolute left-3 top-[25%] bottom-[25%] w-[12%] border-t-2 border-b-2 border-r-2 ${themeStyles.pitchLines}`} />
            <div className={`absolute left-3 top-[37%] bottom-[37%] w-[5%] border-t-2 border-b-2 border-r-2 ${themeStyles.pitchLines}`} />
            
            {/* Right Penalty Area */}
            <div className={`absolute right-3 top-[25%] bottom-[25%] w-[12%] border-t-2 border-b-2 border-l-2 ${themeStyles.pitchLines}`} />
            <div className={`absolute right-3 top-[37%] bottom-[37%] w-[5%] border-t-2 border-b-2 border-l-2 ${themeStyles.pitchLines}`} />

            {/* Left/Right Goals */}
            <div className={`absolute -left-1 top-[44%] bottom-[44%] w-4 border-2 ${themeStyles.pitchLines} bg-slate-900/50 rounded-r`} />
            <div className={`absolute -right-1 top-[44%] bottom-[44%] w-4 border-2 ${themeStyles.pitchLines} bg-slate-900/50 rounded-l`} />

            {/* Stands Fan Crowd Flow Pulse Overlay (Border areas of pitch) */}
            {!highContrast && (
              <>
                {/* Top Stands (North) */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-60 animate-pulse"></div>
                {/* Bottom Stands (South) */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-60 animate-pulse"></div>
              </>
            )}

            {/* SVG Passing Vectors Overlay */}
            {viewMode === 'vectors' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={themeStyles.accentGreen} />
                  </marker>
                  <marker id="arrow-teal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={themeStyles.accentCyan} />
                  </marker>
                </defs>

                {/* Draw dynamic active passing lines based on timeline */}
                {activeTimeline === 'kickoff' && (
                  <>
                    {/* E4 to E10 pass arrow */}
                    <motion.path 
                      d={`M ${currentFrame.teamA[0].x}% ${currentFrame.teamA[0].y}% L ${currentFrame.teamA[1].x}% ${currentFrame.teamA[1].y}%`} 
                      fill="none" 
                      stroke={themeStyles.accentGreen} 
                      strokeWidth="1.5" 
                      strokeDasharray="4 4"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      markerEnd="url(#arrow)"
                    />
                    
                    {/* E10 to E9 shot vector */}
                    {frameIndex >= 2 && (
                      <motion.path 
                        d={`M ${currentFrame.teamA[1].x}% ${currentFrame.teamA[1].y}% L ${currentFrame.teamA[2].x}% ${currentFrame.teamA[2].y}%`} 
                        fill="none" 
                        stroke={themeStyles.accentGreen} 
                        strokeWidth="2" 
                        animate={{ opacity: [0.2, 0.9, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        markerEnd="url(#arrow)"
                      />
                    )}
                  </>
                )}

                {activeTimeline === 'counter' && (
                  <>
                    {/* T8 to T11 pass arrow */}
                    <motion.path 
                      d={`M ${currentFrame.teamB[1].x}% ${currentFrame.teamB[1].y}% L ${currentFrame.teamB[2].x}% ${currentFrame.teamB[2].y}%`} 
                      fill="none" 
                      stroke={themeStyles.accentCyan} 
                      strokeWidth="1.5" 
                      strokeDasharray="4 4"
                      animate={{ strokeDashoffset: [0, 20] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      markerEnd="url(#arrow-teal)"
                    />
                  </>
                )}
              </svg>
            )}

            {/* Tactical Heatmap Overlay */}
            {viewMode === 'heatmap' && (
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {/* Emerald Zone Heat */}
                <motion.div 
                  className="absolute bg-emerald-500/25 dark:bg-emerald-500/15 rounded-full blur-2xl"
                  style={{ left: '35%', top: '40%', width: '120px', height: '120px', transform: 'translate(-50%, -50%)' }}
                  animate={{ 
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    x: [0, 20, -10, 10, 0],
                    y: [0, -10, 15, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                />

                {/* High Attack Zone Heat */}
                <motion.div 
                  className="absolute bg-amber-500/20 dark:bg-amber-600/10 rounded-full blur-2xl"
                  style={{ left: '78%', top: '35%', width: '140px', height: '140px', transform: 'translate(-50%, -50%)' }}
                  animate={{ 
                    scale: [1.1, 0.95, 1.15, 1, 1.1],
                    x: [0, -15, 20, -5, 0],
                    y: [0, 20, -10, 10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                />

                {/* Defensive Zone Teal Heat */}
                <motion.div 
                  className="absolute bg-cyan-500/20 dark:bg-cyan-600/15 rounded-full blur-2xl"
                  style={{ left: '20%', top: '55%', width: '100px', height: '100px', transform: 'translate(-50%, -50%)' }}
                  animate={{ 
                    scale: [0.9, 1.1, 0.85, 1, 0.9],
                    x: [0, 10, -15, 5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                />
              </div>
            )}

            {/* RENDER MOVING BALL & PLAYERS */}
            <AnimatePresence>
              {/* Ball Tracking */}
              <motion.div
                key="soccer-ball"
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none"
                style={{ 
                  left: `${currentFrame.ball.x}%`, 
                  top: `${currentFrame.ball.y}%`,
                  width: '20px', 
                  height: '20px'
                }}
                animate={{ 
                  x: 0, 
                  y: 0,
                  scale: currentFrame.event === 'shoot' ? [1, 1.3, 1] : 1,
                  rotate: currentFrame.event === 'shoot' ? [0, 360] : 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: currentFrame.event === 'shoot' ? 120 : 60, 
                  damping: 15 
                }}
              >
                <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] ${
                  highContrast 
                    ? 'bg-white border-2 border-black text-black font-mono font-bold' 
                    : 'bg-white text-slate-900 border border-slate-950/80 shadow-md shadow-white/20'
                }`}>
                  ⚽
                </div>
                {/* Action Splash Alert */}
                {currentFrame.event === 'shoot' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.5, 0], opacity: [1, 0.8, 0] }}
                    className="absolute -inset-2 bg-amber-500/30 rounded-full blur-xs"
                    transition={{ duration: 0.8 }}
                  />
                )}
              </motion.div>

              {/* Team A Players (Emerald) */}
              {currentFrame.teamA.map((player) => (
                <motion.div
                  key={player.id}
                  className="absolute z-15 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center select-none"
                  style={{ left: `${player.x}%`, top: `${player.y}%` }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 50, damping: 14 }}
                >
                  <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                    highContrast
                      ? 'bg-black border-white text-white font-mono'
                      : 'bg-emerald-600 border-emerald-300 text-white shadow-md shadow-emerald-500/20 hover:scale-110 ring-2 ring-emerald-500/10'
                  }`}>
                    {player.number}
                  </div>
                  <span className={`text-[8px] mt-0.5 tracking-tight font-medium px-1 rounded-sm bg-slate-950/80 max-w-[65px] truncate ${
                    highContrast ? 'text-white border border-white font-mono bg-black' : 'text-slate-300'
                  }`}>
                    {player.name}
                  </span>
                </motion.div>
              ))}

              {/* Team B Players (Teal) */}
              {currentFrame.teamB.map((player) => (
                <motion.div
                  key={player.id}
                  className="absolute z-15 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center select-none"
                  style={{ left: `${player.x}%`, top: `${player.y}%` }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 50, damping: 14 }}
                >
                  <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                    highContrast
                      ? 'bg-black border-white text-white font-mono'
                      : 'bg-cyan-600 border-cyan-300 text-white shadow-md shadow-cyan-500/20 hover:scale-110 ring-2 ring-cyan-500/10'
                  }`}>
                    {player.number}
                  </div>
                  <span className={`text-[8px] mt-0.5 tracking-tight font-medium px-1 rounded-sm bg-slate-950/80 max-w-[65px] truncate ${
                    highContrast ? 'text-white border border-white font-mono bg-black' : 'text-slate-300'
                  }`}>
                    {player.name}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Goal Celebration Flash */}
            {currentFrame.event === 'goal' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0.1, 0.4, 0] }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-emerald-500/30 pointer-events-none z-20 flex items-center justify-center font-black text-2xl tracking-widest text-white uppercase drop-shadow-lg"
              >
                ⚽ GOAL!
              </motion.div>
            )}
            
            {/* Foul Alert Overlay */}
            {currentFrame.event === 'foul' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1, 0.9, 1], opacity: 1 }}
                className="absolute top-4 left-4 bg-amber-500 border border-amber-300 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-md shadow-md z-30 flex items-center space-x-1 uppercase animate-bounce"
              >
                <span>⚠️ FOUL IN SECTOR C</span>
              </motion.div>
            )}
          </div>

          {/* Interactive Event Injectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-widest font-mono ${themeStyles.statLabel}`}>
              Inject Game Scripts:
            </span>
            
            <button
              onClick={() => handleEventSimulation('goal')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                highContrast 
                  ? 'bg-black border-white text-white hover:bg-white/10' 
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30 shadow-xs'
              }`}
            >
              Simulate Goal
            </button>

            <button
              onClick={() => handleEventSimulation('foul')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                highContrast 
                  ? 'bg-black border-white text-white hover:bg-white/10' 
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-900/30 shadow-xs'
              }`}
            >
              Simulate Foul
            </button>

            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-200 ml-auto border border-transparent hover:border-slate-800 transition cursor-pointer flex items-center space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

        </div>

        {/* Live Commentary Feed & Dynamic Twin Stats Panel */}
        <div className="flex flex-col space-y-4 justify-between h-full">
          
          {/* Simulation Playback & Controller */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.statLabel}`}>
                Tracker Player Control
              </span>
              <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">
                FRM {frameIndex + 1}/{timelineFrames.length}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer border ${
                  isPlaying 
                    ? (highContrast ? 'bg-black text-white border-white' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-100')
                    : (highContrast ? 'bg-white text-black border-white font-extrabold' : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent')
                }`}
                aria-label={isPlaying ? "Pause Tracking Simulation" : "Resume Tracking Simulation"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause Live Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Resume Tracking</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Commentary Feed Box */}
          <div className="bg-slate-950/70 border border-slate-850 p-4 rounded-2xl flex-1 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-850/80 pb-2 mb-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono flex items-center space-x-1.5 ${themeStyles.statLabel}`}>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Match Commentary Ticker</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              
              <div className="min-h-[72px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${activeTimeline}-${frameIndex}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs leading-relaxed text-slate-200 font-medium"
                  >
                    {currentFrame?.commentary}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="border-t border-slate-850/60 pt-2 flex items-center space-x-1.5 text-[9px] text-slate-500 font-medium">
              <Info className="h-3 w-3 text-slate-400 shrink-0" />
              <span>Simulated tracking feed updates matches live.</span>
            </div>
          </div>

          {/* Match Day Twin Metrics (Match Energy / Green Stats) */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl space-y-3.5">
            <h4 className={`text-[10px] font-bold uppercase tracking-widest font-mono ${themeStyles.statLabel}`}>
              Real-time Operations Data
            </h4>
            
            {/* Possession stats */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-slate-300">
                <span>Possession</span>
                <span>{currentFrame?.stats?.possession[0]}% - {currentFrame?.stats?.possession[1]}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <motion.div 
                  className={`h-full ${highContrast ? 'bg-white' : 'bg-emerald-500'}`}
                  animate={{ width: `${currentFrame?.stats?.possession[0]}%` }}
                  transition={{ type: "spring", stiffness: 40 }}
                />
                <motion.div 
                  className={`h-full ${highContrast ? 'bg-slate-400' : 'bg-cyan-500'}`}
                  animate={{ width: `${currentFrame?.stats?.possession[1]}%` }}
                  transition={{ type: "spring", stiffness: 40 }}
                />
              </div>
            </div>

            {/* Stadium Noise Level Indicator */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-slate-300">
                <span>Fan Crowd energy</span>
                <span>{currentFrame?.stats?.crowdEnergy}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${
                    currentFrame?.stats?.crowdEnergy && currentFrame?.stats?.crowdEnergy > 90
                      ? (highContrast ? 'bg-white' : 'bg-rose-500')
                      : (highContrast ? 'bg-white' : 'bg-emerald-500')
                  }`}
                  animate={{ width: `${currentFrame?.stats?.crowdEnergy}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>
            </div>

            {/* Eco Savings Score Offset */}
            <div className="flex justify-between items-center border-t border-slate-850 pt-2.5">
              <div className="flex items-center space-x-2">
                <Award className={`h-4 w-4 ${highContrast ? 'text-white' : 'text-emerald-400'}`} />
                <span className={`text-[10px] font-bold ${themeStyles.statLabel}`}>Fan Transit Offset</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-black font-mono tracking-tight text-white">
                  {liveCarbonSaved} kg
                </div>
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-mono">CO2 Saved</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LiveMatchTracker;
