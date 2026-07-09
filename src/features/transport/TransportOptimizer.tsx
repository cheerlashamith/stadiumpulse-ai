import React, { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { getTransitPlan } from '../../services/geminiService';
import { MapPin, Navigation, Leaf, Clock, Compass, HelpCircle } from 'lucide-react';

export const TransportOptimizer: React.FC = () => {
  const { realtimeState, language, addCarbonSaved, highContrast } = useAppState();
  const { transport } = realtimeState;
  const [startingPoint, setStartingPoint] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [journeyPlan, setJourneyPlan] = useState<{
    recommendedMode: string;
    eta: string;
    recommendedGate: string;
    journeyExplanation: string;
    co2SavedKg: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingPoint.trim()) return;

    setIsCalculating(true);
    try {
      const plan = await getTransitPlan(startingPoint, transport);
      setJourneyPlan(plan);
      // Credit carbon savings to user's local score
      addCarbonSaved(plan.co2SavedKg || 2.5);
    } catch (err) {
      console.warn('Transit plan optimization processed via standby policy:', (err as any)?.message || err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 font-sans ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`} id="transit-optimizer-card">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className={`p-2 rounded-xl ${
          highContrast ? 'bg-white text-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          <Navigation className="h-5 w-5" />
        </div>
        <div>
          <h3 className={`text-md font-bold tracking-tight ${highContrast ? 'text-white' : 'text-slate-900'}`}>
            {translate('transport.title', language)}
          </h3>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Real-time multi-modal route planner with low-emission prioritization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <label htmlFor="starting-point-input" className="sr-only">Starting Location</label>
          <MapPin className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            id="starting-point-input"
            type="text"
            required
            placeholder={translate('transport.placeholder', language)}
            value={startingPoint}
            onChange={(e) => setStartingPoint(e.target.value)}
            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 ${
              highContrast 
                ? 'bg-black border-white text-white placeholder-slate-400 focus:ring-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
          />
        </div>
        
        {/* Preset Locations Buttons to ease Demo selection */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
          <span className={`self-center font-semibold ${highContrast ? 'text-slate-300' : 'text-slate-400'}`}>Demo origins:</span>
          <button 
            type="button" 
            onClick={() => setStartingPoint('Dallas Fort Worth Airport (DFW)')}
            className={`px-2.5 py-1 rounded border text-xs transition ${
              highContrast 
                ? 'bg-black hover:bg-slate-900 border-white text-white' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            ✈️ DFW Airport
          </button>
          <button 
            type="button" 
            onClick={() => setStartingPoint('Downtown Fan Zone Plaza')}
            className={`px-2.5 py-1 rounded border text-xs transition ${
              highContrast 
                ? 'bg-black hover:bg-slate-900 border-white text-white' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            Stadium Fan Zone
          </button>
          <button 
            type="button" 
            onClick={() => setStartingPoint('Grand Sheraton Hotel North')}
            className={`px-2.5 py-1 rounded border text-xs transition ${
              highContrast 
                ? 'bg-black hover:bg-slate-900 border-white text-white' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            Sheraton Hotel
          </button>
        </div>

        <button
          type="submit"
          disabled={isCalculating || !startingPoint.trim()}
          className={`w-full py-3 text-white font-semibold text-sm rounded-xl transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
            highContrast 
              ? 'bg-white text-black hover:bg-slate-100 border-2 border-white' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          id="btn-optimize-route"
        >
          {isCalculating ? (
            <>
              <div className="h-4.5 w-4.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
              <span>Optimizing via Gemini...</span>
            </>
          ) : (
            <span>{translate('transport.calculate', language)}</span>
          )}
        </button>
      </form>

      {/* Generated Plan Result */}
      {journeyPlan && (
        <div className={`mt-5 border rounded-xl p-4.5 space-y-4 ${
          highContrast ? 'bg-black border-white text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
        }`} id="transit-plan-result">
          <div className={`flex justify-between items-start border-b pb-3 ${
            highContrast ? 'border-white' : 'border-emerald-100'
          }`}>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                highContrast ? 'text-white' : 'text-emerald-700'
              }`}>
                {translate('transport.bestRoute', language)}
              </span>
              <h4 className={`text-sm font-bold mt-1 ${highContrast ? 'text-white' : 'text-slate-900'}`}>{journeyPlan.recommendedMode}</h4>
            </div>
            {/* Carbon Saved Badge */}
            <div className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${
              highContrast 
                ? 'bg-black border-white text-white' 
                : 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
            }`}>
              <Leaf className="h-3.5 w-3.5" />
              <span>+{journeyPlan.co2SavedKg}kg CO₂</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border flex items-center space-x-2 ${
              highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-150 shadow-xs'
            }`}>
              <Clock className={`h-5 w-5 shrink-0 ${highContrast ? 'text-white' : 'text-sky-500'}`} />
              <div>
                <span className={`text-[10px] block uppercase font-mono ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Travel Duration</span>
                <span className={`text-xs font-semibold ${highContrast ? 'text-white font-mono' : 'text-slate-800'}`}>{journeyPlan.eta}</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border flex items-center space-x-2 ${
              highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-150 shadow-xs'
            }`}>
              <Compass className={`h-5 w-5 shrink-0 ${highContrast ? 'text-white' : 'text-amber-500'}`} />
              <div>
                <span className={`text-[10px] block uppercase font-mono ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Recommended Gate</span>
                <span className={`text-xs font-semibold truncate max-w-full block ${highContrast ? 'text-white font-mono' : 'text-slate-800'}`}>{journeyPlan.recommendedGate}</span>
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${
            highContrast ? 'bg-black border-white' : 'bg-white/80 border-slate-100'
          }`}>
            <p className={`text-xs leading-relaxed font-sans ${highContrast ? 'text-white' : 'text-slate-600'}`}>{journeyPlan.journeyExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default TransportOptimizer;
