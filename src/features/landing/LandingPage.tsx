import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Users, Accessibility, ClipboardList, Shield, ArrowRight, Play, Pause, RefreshCw, 
  Globe, Trees, Zap, Compass, CheckCircle2, MessageSquare, AlertTriangle, Lightbulb 
} from 'lucide-react';
import { translate } from '../../services/i18nService';
import { AppLanguage } from '../../types';
import { LiveMatchTracker } from '../tracking/LiveMatchTracker';

interface LandingPageProps {
  onEnterRole: (role: 'fan' | 'accessibility_fan' | 'volunteer' | 'organizer') => void;
  language: AppLanguage;
  highContrast: boolean;
}

type SimulationIncident = 'congestion' | 'medical' | 'eco';

interface SimulationStep {
  agent: string;
  avatar: string;
  color: string;
  bgColor: string;
  borderColor: string;
  message: string;
  role: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterRole, language, highContrast }) => {
  const [activeIncident, setActiveIncident] = useState<SimulationIncident>('congestion');
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(true);

  // Multi-agent orchestration timelines
  const simulations: Record<SimulationIncident, SimulationStep[]> = {
    congestion: [
      {
        agent: 'Operations Director',
        avatar: '🛡️',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/30',
        borderColor: 'border-rose-200 dark:border-rose-900',
        message: '🚨 LIVE SENSOR TRIGGER: South Gate 3 density has exceeded 90% capacity. Ingress latency is 12 minutes.',
        role: 'organizer'
      },
      {
        agent: 'Crowd & Wayfinding AI',
        avatar: '🧭',
        color: 'text-sky-600 dark:text-sky-400',
        bgColor: 'bg-sky-50 dark:bg-sky-950/30',
        borderColor: 'border-sky-200 dark:border-sky-900',
        message: '🗺️ ANALYSIS COMPLETE: Gate 1 and Gate 4 are operating under 45% capacity. Commencing active crowd rerouting.',
        role: 'fan'
      },
      {
        agent: 'Logistics & Eco-Transit AI',
        avatar: '🚇',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderColor: 'border-emerald-200 dark:border-emerald-900',
        message: '🚇 TRANSIT UPDATE: Dynamically updating journey planners to direct arriving Metro riders to Gate 1 (North Entrance). Estimated travel time optimized by 8 mins.',
        role: 'fan'
      },
      {
        agent: 'Volunteer Coordinator AI',
        avatar: '📋',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        borderColor: 'border-amber-200 dark:border-amber-900',
        message: '🤝 TASK ALLOCATION: Auto-generating 3 standby crowd control tasks. Dispatched nearby Volunteers (Sam & Maria) to Gate 3 for line management.',
        role: 'volunteer'
      },
      {
        agent: 'Multilingual Fan Assistant',
        avatar: '💬',
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        borderColor: 'border-indigo-200 dark:border-indigo-900',
        message: '💬 FAN NUDGES: Broadcasting real-time, translated notifications in ES, AR, HI: "Proceed to Gate 4 for expedited entry. Hot snacks available inside Gate 4 Concourse."',
        role: 'fan'
      },
      {
        agent: 'Operations Director',
        avatar: '🛡️',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/30',
        borderColor: 'border-rose-200 dark:border-rose-900',
        message: '✅ RESOLUTION: Gate 3 density dropped to 65%. Ingress back to standard 3 mins. All agents synchronized and on standby.',
        role: 'organizer'
      }
    ],
    medical: [
      {
        agent: 'Multilingual Fan Assistant',
        avatar: '💬',
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        borderColor: 'border-indigo-200 dark:border-indigo-900',
        message: '💬 FAN REPORT: Spanish-speaking fan in Section 104 chats: "Mi abuela se siente mareada y no puede subir las gradas" (My grandmother feels dizzy and cannot climb the stairs).',
        role: 'fan'
      },
      {
        agent: 'Operations Director',
        avatar: '🛡️',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/30',
        borderColor: 'border-rose-200 dark:border-rose-900',
        message: '🚨 INCIDENT CREATED: Severity: MEDIUM. Title: "Medical Assistance - Sec 104". Translation & Context logged automatically.',
        role: 'organizer'
      },
      {
        agent: 'Crowd & Wayfinding AI',
        avatar: '🧭',
        color: 'text-sky-600 dark:text-sky-400',
        bgColor: 'bg-sky-50 dark:bg-sky-950/30',
        borderColor: 'border-sky-200 dark:border-sky-900',
        message: '♿ WAYFINDING ROUTING: Calculated step-free emergency route from Zone C First-Aid Station to Section 104, bypassing standard stairwells.',
        role: 'accessibility_fan'
      },
      {
        agent: 'Volunteer Coordinator AI',
        avatar: '📋',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        borderColor: 'border-amber-200 dark:border-amber-900',
        message: '🤝 DISPATCH ASSIGNMENT: Dispatched Volunteer "Alex" with wheelchair to Section 104. Delivered voice instructions and custom step-free map.',
        role: 'volunteer'
      },
      {
        agent: 'Volunteer Coordinator AI',
        avatar: '📋',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        borderColor: 'border-amber-200 dark:border-amber-900',
        message: '✅ FIELD RESOLUTION: Alex arrived in 2.2 mins. Patient escorted via elevator to air-conditioned medical unit. Incident marked RESOLVED.',
        role: 'volunteer'
      }
    ],
    eco: [
      {
        agent: 'Logistics & Eco-Transit AI',
        avatar: '🚇',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderColor: 'border-emerald-200 dark:border-emerald-900',
        message: '📈 CARBON WATCH: Rideshare & private drop-offs are 35% higher than carbon-neutral target levels. Smart route analytics triggered.',
        role: 'fan'
      },
      {
        agent: 'Operations Director',
        avatar: '🛡️',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/30',
        borderColor: 'border-rose-200 dark:border-rose-900',
        message: '🌱 INITIATIVE APPROVED: Push customized "Eco-Nudges" rewarding Metro/Bus choices with priority concessions and stadium merchandise points.',
        role: 'organizer'
      },
      {
        agent: 'Multilingual Fan Assistant',
        avatar: '💬',
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
        borderColor: 'border-indigo-200 dark:border-indigo-900',
        message: '🎁 CAMPAIGN DEPLOYED: Dispatched personalized notification: "Choose the Metropolitan Metro and save 3.4kg of CO2. Gain a free tournament digital badge!"',
        role: 'fan'
      },
      {
        agent: 'Logistics & Eco-Transit AI',
        avatar: '🚇',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderColor: 'border-emerald-200 dark:border-emerald-900',
        message: '📉 GREEN SUCCESS: Metro volume increased by 18%. Saved an extra 240kg of CO2 this hour. Global Carbon score updated!',
        role: 'fan'
      }
    ]
  };

  // Autoplay simulation steps
  useEffect(() => {
    if (!isSimPlaying) return;

    const timer = setInterval(() => {
      setSimStep((prev) => {
        const next = prev + 1;
        if (next >= simulations[activeIncident].length) {
          return 0; // loop
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isSimPlaying, activeIncident]);

  const handleIncidentChange = (incident: SimulationIncident) => {
    setActiveIncident(incident);
    setSimStep(0);
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'organizer': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800';
      case 'volunteer': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800';
      case 'accessibility_fan': return 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div className="space-y-12 py-4 animate-fade-in" id="landing-page">
      
      {/* 1. HERO HEADER */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-bold font-mono transition-all ${
          highContrast 
            ? 'bg-black border-white text-white' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-slate-900 dark:border-emerald-900/30 dark:text-emerald-400'
        }`}>
          <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span>FIFA WORLD CUP 2026 PILOT PLATFORM</span>
        </div>

        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans transition-all leading-tight ${
          highContrast ? 'text-white' : 'text-slate-950 dark:text-white'
        }`}>
          Where Generative AI <br className="hidden sm:inline" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
            Meets Live Stadium Ops
          </span>
        </h1>

        <p className={`text-sm md:text-base max-w-2.5xl mx-auto leading-relaxed transition-all ${
          highContrast ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300 font-medium'
        }`}>
          StadiumPulse AI orchestrates crowd flows, accessibility services, volunteer dispatches, and intelligent green transit options across a fully integrated, multi-agent real-time stadium digital twin.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => onEnterRole('fan')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center space-x-2 transition cursor-pointer border ${
              highContrast 
                ? 'bg-white text-black border-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/15 border-transparent'
            }`}
          >
            <span>Enter Fan Hub</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onEnterRole('organizer')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center space-x-2 transition cursor-pointer border ${
              highContrast 
                ? 'bg-black text-white border-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-750'
            }`}
          >
            <span>Launch Ops Command</span>
            <Shield className="h-4 w-4 text-rose-500" />
          </button>
        </div>
      </section>

      {/* LIVE FOOTBALL MAP CENTERPIECE */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <LiveMatchTracker />
      </section>

      {/* 2. CORE PORTALS SELECTOR GRID */}
      <section className="space-y-6 px-4">
        <div className="text-center space-y-2">
          <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${highContrast ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            Explore Connected User Portal Spheres
          </h2>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500 font-medium'}`}>
            Click any core operator platform below to switch interface roles and interact with specialized AI pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Fan Experience Portal Card */}
          <div 
            onClick={() => onEnterRole('fan')}
            className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-full space-y-4 ${
              highContrast 
                ? 'bg-black border-white text-white hover:border-2' 
                : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors ${
                highContrast ? 'bg-black border-white' : 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                <Users className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-sm tracking-tight ${highContrast ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                {translate('roles.fan', language)}
              </h3>
              <p className={`text-xs leading-relaxed ${highContrast ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300 font-medium'}`}>
                Smart green journey planning, live gate density meters, indoor waypoint routes, and a personal AI Chat Assistant.
              </p>
            </div>
            <div className={`text-xs font-bold flex items-center space-x-1 transition-all ${
              highContrast ? 'text-white' : 'text-emerald-600 group-hover:translate-x-1'
            }`}>
              <span>Open Fan Hub</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Accessible Fan Portal Card */}
          <div 
            onClick={() => onEnterRole('accessibility_fan')}
            className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-full space-y-4 ${
              highContrast 
                ? 'bg-black border-white text-white hover:border-2' 
                : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors ${
                highContrast ? 'bg-black border-white' : 'bg-sky-50 border-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white'
              }`}>
                <Accessibility className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-sm tracking-tight ${highContrast ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                {translate('roles.accessibility_fan', language)}
              </h3>
              <p className={`text-xs leading-relaxed ${highContrast ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300 font-medium'}`}>
                Enhanced touch targets, step-free waypoint finders, automated audio-wayfinding, and accessible rest docks.
              </p>
            </div>
            <div className={`text-xs font-bold flex items-center space-x-1 transition-all ${
              highContrast ? 'text-white' : 'text-sky-600 group-hover:translate-x-1'
            }`}>
              <span>Open Accessible Hub</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Volunteer Console Card */}
          <div 
            onClick={() => onEnterRole('volunteer')}
            className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-full space-y-4 ${
              highContrast 
                ? 'bg-black border-white text-white hover:border-2' 
                : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors ${
                highContrast ? 'bg-black border-white' : 'bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
              }`}>
                <ClipboardList className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-sm tracking-tight ${highContrast ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                {translate('roles.volunteer', language)}
              </h3>
              <p className={`text-xs leading-relaxed ${highContrast ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300 font-medium'}`}>
                Live incident queues dispatched automatically by Gemini context, crowd control directives, and safety resolution logs.
              </p>
            </div>
            <div className={`text-xs font-bold flex items-center space-x-1 transition-all ${
              highContrast ? 'text-white' : 'text-amber-600 group-hover:translate-x-1'
            }`}>
              <span>Open Volunteer Board</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Operations Command Card */}
          <div 
            onClick={() => onEnterRole('organizer')}
            className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-full space-y-4 ${
              highContrast 
                ? 'bg-black border-white text-white hover:border-2' 
                : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors ${
                highContrast ? 'bg-black border-white' : 'bg-rose-50 border-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
              }`}>
                <Shield className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-sm tracking-tight ${highContrast ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                {translate('roles.organizer', language)}
              </h3>
              <p className={`text-xs leading-relaxed ${highContrast ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300 font-medium'}`}>
                Anomaly diagnosis, crowd re-route models, real-time automated shift briefings, and tactical stewards deployment.
              </p>
            </div>
            <div className={`text-xs font-bold flex items-center space-x-1 transition-all ${
              highContrast ? 'text-white' : 'text-rose-600 group-hover:translate-x-1'
            }`}>
              <span>Launch Ops Center</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MULTI-AGENT ORCHESTRATION INTERACTIVE SIMULATION */}
      <section className={`p-6 md:p-8 rounded-3xl border ${
        highContrast 
          ? 'bg-black border-white text-white' 
          : 'bg-slate-900 text-slate-100 border-slate-800 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Simulation Controllers & Choices */}
          <div className="w-full lg:w-2/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase font-mono">
                <Zap className="h-3.5 w-3.5 animate-pulse" />
                <span>Multi-Agent Live Twin Engine</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Generative AI Orchestration Simulator
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Observe how distinct, autonomous Gemini-powered agents coordinate in real time to monitor crowd conditions, resolve medical safety issues, and optimize stadium carbon footprint.
              </p>
            </div>

            {/* Select Scenario */}
            <div className="space-y-3.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Select Stadium Scenario</p>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleIncidentChange('congestion')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs font-bold ${
                    activeIncident === 'congestion'
                      ? (highContrast ? 'bg-white text-black border-white' : 'bg-emerald-600/10 border-emerald-500 text-white')
                      : 'bg-transparent border-slate-850 text-slate-300 hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">🚨</span>
                    <div>
                      <div>Gate 3 Congestion Spike</div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">Auto-routing + volunteer dispatch</div>
                    </div>
                  </div>
                  {activeIncident === 'congestion' && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                </button>

                <button
                  onClick={() => handleIncidentChange('medical')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs font-bold ${
                    activeIncident === 'medical'
                      ? (highContrast ? 'bg-white text-black border-white' : 'bg-emerald-600/10 border-emerald-500 text-white')
                      : 'bg-transparent border-slate-850 text-slate-300 hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">👵</span>
                    <div>
                      <div>Spanish Medical Support</div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">Translation + step-free waypoint dispatch</div>
                    </div>
                  </div>
                  {activeIncident === 'medical' && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                </button>

                <button
                  onClick={() => handleIncidentChange('eco')}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs font-bold ${
                    activeIncident === 'eco'
                      ? (highContrast ? 'bg-white text-black border-white' : 'bg-emerald-600/10 border-emerald-500 text-white')
                      : 'bg-transparent border-slate-850 text-slate-300 hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">🌱</span>
                    <div>
                      <div>Carbon Emission Spike</div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">Eco incentives + transport nudges</div>
                    </div>
                  </div>
                  {activeIncident === 'eco' && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                </button>
              </div>
            </div>

            {/* Sim Control Player */}
            <div className="flex items-center space-x-3 border-t border-slate-850 pt-4 mt-2">
              <button
                onClick={() => setIsSimPlaying(!isSimPlaying)}
                className={`p-2.5 rounded-lg border text-xs flex items-center space-x-1.5 transition cursor-pointer font-bold ${
                  highContrast 
                    ? 'bg-white text-black border-white' 
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-100 border-slate-700'
                }`}
                aria-label={isSimPlaying ? 'Pause Simulation' : 'Play Simulation'}
              >
                {isSimPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />}
                <span>{isSimPlaying ? 'Pause Flow' : 'Resume Flow'}</span>
              </button>

              <button
                onClick={() => setSimStep(0)}
                className={`p-2.5 rounded-lg border text-xs flex items-center space-x-1.5 transition cursor-pointer font-semibold ${
                  highContrast 
                    ? 'bg-black text-white border-white hover:bg-white/10' 
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-100 border-slate-700'
                }`}
                aria-label="Restart Scenario"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Restart</span>
              </button>

              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest ml-auto">
                STEP {simStep + 1} OF {simulations[activeIncident].length}
              </span>
            </div>
          </div>

          {/* Simulation Visual Feed */}
          <div className="w-full lg:w-3/5 flex flex-col justify-between bg-slate-950/60 rounded-2xl border border-slate-850 p-5 space-y-4">
            
            {/* Visual Header */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">Live Operations Twin Output</span>
              </div>
              <div className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                API MODE: DEMO STREAM
              </div>
            </div>

            {/* Stepper Dialogue List */}
            <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] min-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {simulations[activeIncident].map((step, idx) => {
                const isActive = idx === simStep;
                const isPassed = idx < simStep;

                return (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start space-x-3.5 ${
                      isActive 
                        ? `${step.bgColor} ${step.borderColor} border-l-4 scale-[1.01] opacity-100 shadow-sm shadow-emerald-500/5` 
                        : isPassed 
                          ? 'bg-transparent border-transparent opacity-40 scale-[0.99]' 
                          : 'bg-transparent border-transparent opacity-15'
                    }`}
                  >
                    <div className="text-xl shrink-0 mt-0.5 select-none">{step.avatar}</div>
                    
                    <div className="space-y-1 text-left flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${step.color}`}>{step.agent}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider border font-mono ${getRoleBadgeColor(step.role)}`}>
                          {step.role === 'fan' ? 'Fan Agent' : step.role === 'organizer' ? 'Director' : step.role === 'volunteer' ? 'Volunteer Agent' : 'Access Agent'}
                        </span>
                      </div>
                      <p className="text-xs font-medium leading-relaxed text-slate-200">
                        {step.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Coordination Indicator Banner */}
            <div className="bg-slate-900/80 border border-slate-850/80 p-3.5 rounded-xl flex items-center space-x-3.5">
              <div className="h-8 w-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/25 shrink-0 select-none">
                ⚽
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-100">Synchronized Arena Digital State</p>
                <p className="text-[10px] text-slate-400 font-medium">All operator roles are updated in parallel. Try launching any of the portals above to view live state adjustments.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. KEY CAPABILITIES METRICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div className={`p-5 rounded-2xl border flex items-start space-x-4 ${
          highContrast 
            ? 'bg-black border-white text-white' 
            : 'bg-white border-slate-200/80 shadow-xs text-slate-900 dark:bg-slate-900 dark:border-slate-800'
        }`}>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm tracking-tight ${highContrast ? 'text-white' : 'text-slate-950 dark:text-white'}`}>Multilingual AI Core</h4>
            <p className={`text-xs mt-1 leading-relaxed ${highContrast ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300 font-medium'}`}>
              Seamless real-time translation for 5 major World Cup host languages. Handles speech synthesis and translation of incoming alerts instantly.
            </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border flex items-start space-x-4 ${
          highContrast 
            ? 'bg-black border-white text-white' 
            : 'bg-white border-slate-200/80 shadow-xs text-slate-900 dark:bg-slate-900 dark:border-slate-800'
        }`}>
          <div className="p-2.5 bg-sky-50 dark:bg-sky-950/20 text-sky-600 rounded-xl border border-sky-100 dark:border-sky-900/30 shrink-0">
            <Accessibility className="h-5 w-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm tracking-tight ${highContrast ? 'text-white' : 'text-slate-950 dark:text-white'}`}>Adaptive Accessibility</h4>
            <p className={`text-xs mt-1 leading-relaxed ${highContrast ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300 font-medium'}`}>
              Fully WCAG-compliant design variables. Switch to large font layouts, high-contrast states, audio navigators, and dynamic sign language feeds on the fly.
            </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border flex items-start space-x-4 ${
          highContrast 
            ? 'bg-black border-white text-white' 
            : 'bg-white border-slate-200/80 shadow-xs text-slate-900 dark:bg-slate-900 dark:border-slate-800'
        }`}>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shrink-0">
            <Trees className="h-5 w-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm tracking-tight ${highContrast ? 'text-white' : 'text-slate-950 dark:text-white'}`}>Eco-Transit Analytics</h4>
            <p className={`text-xs mt-1 leading-relaxed ${highContrast ? 'text-slate-300' : 'text-slate-500 dark:text-slate-300 font-medium'}`}>
              Dynamic CO2 footprint estimation engine that tracks transport preferences. Recommends lowest-emission public routes with gamified incentives.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
