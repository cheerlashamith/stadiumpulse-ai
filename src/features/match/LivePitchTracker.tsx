import React, { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { Activity, Target } from 'lucide-react';

export const LivePitchTracker: React.FC = () => {
  const { highContrast } = useAppState();
  
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [stats, setStats] = useState({ speed: 0, player: 'Midfielder' });

  useEffect(() => {
    // Simulate live ball movement
    const interval = setInterval(() => {
      setBallPos({
        x: Math.floor(Math.random() * 80) + 10, // 10% to 90%
        y: Math.floor(Math.random() * 80) + 10,
      });
      
      const speeds = [12, 24, 35, 18, 42, 8];
      const players = ['Striker (9)', 'Midfielder (8)', 'Winger (11)', 'Playmaker (10)'];
      
      setStats({
        speed: speeds[Math.floor(Math.random() * speeds.length)],
        player: players[Math.floor(Math.random() * players.length)]
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 overflow-hidden ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-slate-900 border-slate-800 shadow-xl text-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">Live Match Tracker</h3>
        </div>
        <div className="flex space-x-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center space-x-1">
            <Activity className="h-3 w-3 text-emerald-500" />
            <span>{stats.speed} KM/H</span>
          </span>
          <span className="flex items-center space-x-1">
            <Target className="h-3 w-3 text-sky-500" />
            <span>{stats.player}</span>
          </span>
        </div>
      </div>

      {/* The Futuristic Pitch */}
      <div className="relative w-full h-48 sm:h-64 rounded-lg border-2 border-emerald-500/30 bg-emerald-950/20 overflow-hidden perspective-1000">
        
        {/* Pitch markings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Center line */}
          <div className="h-full w-px bg-emerald-500/30"></div>
          {/* Center circle */}
          <div className="absolute h-16 w-16 sm:h-24 sm:w-24 rounded-full border border-emerald-500/30"></div>
          {/* Center dot */}
          <div className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500/50"></div>
          
          {/* Left Penalty Box */}
          <div className="absolute left-0 h-24 w-12 sm:h-32 sm:w-16 border border-l-0 border-emerald-500/30 flex items-center">
             <div className="absolute right-0 translate-x-1/2 h-8 w-4 sm:h-12 sm:w-6 border border-l-0 border-emerald-500/30 rounded-r-full"></div>
          </div>
          {/* Right Penalty Box */}
          <div className="absolute right-0 h-24 w-12 sm:h-32 sm:w-16 border border-r-0 border-emerald-500/30 flex items-center justify-end">
             <div className="absolute left-0 -translate-x-1/2 h-8 w-4 sm:h-12 sm:w-6 border border-r-0 border-emerald-500/30 rounded-l-full"></div>
          </div>
        </div>

        {/* Dynamic moving ball / icon */}
        <div 
          className="absolute h-4 w-4 sm:h-5 sm:w-5 -ml-2 -mt-2 sm:-ml-2.5 sm:-mt-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-emerald-400 z-10 transition-all duration-[2000ms] ease-in-out flex items-center justify-center"
          style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
        >
          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          {/* Trail effect */}
          <div className="absolute inset-0 rounded-full border border-emerald-300 animate-ping opacity-50"></div>
        </div>
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9811a_1px,transparent_1px),linear-gradient(to_bottom,#10b9811a_1px,transparent_1px)] bg-[size:1rem_1rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default LivePitchTracker;
