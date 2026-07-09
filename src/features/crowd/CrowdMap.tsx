import React, { useEffect, useState, useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { getCrowdRecommendations } from '../../services/geminiService';
import { AlertTriangle, Shield, CheckCircle2, UserCheck, RefreshCw } from 'lucide-react';

export const CrowdMap: React.FC = () => {
  const { realtimeState, language, role, highContrast } = useAppState();
  const { zones } = realtimeState;
  const [aiPlan, setAiPlan] = useState<{
    fanDirective: string;
    staffDirective: string;
    severity: 'low' | 'medium' | 'high';
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Memoize high-occupancy zones to optimize rendering
  const highDensityZones = useMemo(() => {
    return zones.filter(z => (z.occupancy / z.capacity) > 0.8);
  }, [zones]);

  // Generate Gemini rerouting advice whenever high-density zones change
  useEffect(() => {
    if (highDensityZones.length > 0) {
      setIsGenerating(true);
      getCrowdRecommendations(zones)
        .then(plan => {
          setAiPlan(plan);
        })
        .catch(err => console.warn('Rerouting calculation handled via policy:', err?.message || err))
        .finally(() => setIsGenerating(false));
    } else {
      setAiPlan(null);
    }
  }, [highDensityZones, zones]);

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 font-sans ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`} id="crowd-map-card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`text-md font-bold tracking-tight flex items-center space-x-2 ${
            highContrast ? 'text-white' : 'text-slate-900'
          }`}>
            <Shield className={`h-5 w-5 ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
            <span>{translate('crowd.title', language)}</span>
          </h3>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>{translate('crowd.updateText', language)}</p>
        </div>
        <span className={`flex items-center space-x-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border ${
          highContrast 
            ? 'bg-black text-white border-white' 
            : 'bg-slate-100 text-slate-600 border-slate-200 shadow-xs'
        }`}>
          <RefreshCw className={`h-3 w-3 animate-spin ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
          <span>LIVE SENSORS</span>
        </span>
      </div>

      {/* Stadium Grid Heatmap visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-6" role="region" aria-label="Stadium Zones Occupancy Grid">
        {zones.map(zone => {
          const occupancyRate = Math.round((zone.occupancy / zone.capacity) * 100);
          
          let colorClass = highContrast
            ? 'border-white bg-black text-white font-mono'
            : 'border-emerald-100 bg-emerald-50 text-emerald-800';
          let levelTag = 'Fluid';
          
          if (zone.crowdLevel === 'high') {
            colorClass = highContrast
              ? 'border-white bg-black text-white font-mono font-bold'
              : 'border-red-100 bg-red-50 text-red-800';
            levelTag = 'Congested (Critical)';
          } else if (zone.crowdLevel === 'medium') {
            colorClass = highContrast
              ? 'border-white bg-black text-white font-mono'
              : 'border-amber-100 bg-amber-50 text-amber-800';
            levelTag = 'Moderate (Steady)';
          }

          return (
            <div 
              key={zone.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${colorClass}`}
              id={`zone-tile-${zone.id}`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold truncate max-w-[80%] ${
                    highContrast ? 'text-white' : 'text-slate-900'
                  }`}>{zone.name}</h4>
                  {zone.accessible && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      highContrast 
                        ? 'bg-black text-white border-white' 
                        : 'bg-white text-indigo-600 border-indigo-100'
                    }`} title="Accessible Zone">
                      ♿
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 line-clamp-1 ${
                  highContrast ? 'text-slate-300' : 'text-slate-500'
                }`}>{zone.description}</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>{occupancyRate}% Full</span>
                  <span className="font-mono">{zone.occupancy.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                </div>
                {/* Progress bar */}
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  highContrast ? 'bg-slate-800 border border-white' : 'bg-slate-200/60'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      zone.crowdLevel === 'high' ? 'bg-red-500' : zone.crowdLevel === 'medium' ? 'bg-yellow-400' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min(100, occupancyRate)}%` }}
                  />
                </div>
                <div className="flex items-center space-x-1 mt-2 text-[10px] font-mono opacity-90">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    zone.crowdLevel === 'high' ? 'bg-red-500' : zone.crowdLevel === 'medium' ? 'bg-yellow-400' : 'bg-emerald-500'
                  }`} />
                  <span>{levelTag}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reroute and Decision Support Banner */}
      {highDensityZones.length > 0 && (
        <div className={`border rounded-xl p-4.5 ${
          highContrast ? 'bg-black border-white' : 'bg-red-50 border-red-100'
        }`} id="bottleneck-alerts">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg shrink-0 border ${
              highContrast ? 'bg-black border-white text-white' : 'bg-red-100 border-red-200 text-red-600'
            }`}>
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-bold flex flex-wrap items-center justify-between gap-2 ${
                highContrast ? 'text-white' : 'text-red-800'
              }`}>
                <span>BOTTLENECK WARNING: {highDensityZones.map(z => z.name).join(', ')}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border ${
                  highContrast ? 'bg-black text-white border-white' : 'bg-red-100 border-red-200 text-red-600'
                }`}>
                  Alert Active
                </span>
              </h4>

              {isGenerating ? (
                <div className="mt-2 text-xs text-slate-400 flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full border border-t-transparent border-slate-400 animate-spin" />
                  <span>Gemini is evaluating crowd dispersion pathways...</span>
                </div>
              ) : aiPlan ? (
                <div className={`mt-3.5 space-y-3.5 border-t pt-3 ${
                  highContrast ? 'border-white' : 'border-slate-100'
                }`}>
                  {/* Fan perspective advice (shown to fans and staff) */}
                  {(role === 'fan' || role === 'accessibility_fan' || role === 'organizer') && (
                    <div className={`p-3 rounded-lg border ${
                      highContrast ? 'bg-black border-white' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                        highContrast ? 'text-white' : 'text-indigo-600'
                      }`}>
                        📢 {translate('crowd.reRouteRecommendation', language)} (For Fans)
                      </span>
                      <p className={`text-xs leading-relaxed ${highContrast ? 'text-white' : 'text-slate-700'}`}>{aiPlan.fanDirective}</p>
                    </div>
                  )}

                  {/* Staff perspective instructions (only shown to organizers/volunteers) */}
                  {(role === 'organizer' || role === 'volunteer') && (
                    <div className={`p-3 rounded-lg border ${
                      highContrast ? 'bg-black border-white' : 'bg-emerald-50/50 border-emerald-100/80'
                    }`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 flex items-center space-x-1 ${
                        highContrast ? 'text-white' : 'text-emerald-700'
                      }`}>
                        <UserCheck className="h-3 w-3" />
                        <span>🛠️ ACTIONABLE OPERATIONAL INSTRUCTION (For Staff)</span>
                      </span>
                      <p className={`text-xs leading-relaxed ${highContrast ? 'text-white font-mono' : 'text-slate-700 font-sans'}`}>{aiPlan.staffDirective}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Clean, normal state when no bottleneck exists */}
      {highDensityZones.length === 0 && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 border ${
          highContrast ? 'bg-black border-white text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-855'
        }`}>
          <CheckCircle2 className={`h-5 w-5 shrink-0 ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
          <div className="text-xs">
            <span className={`font-bold block ${highContrast ? 'text-white' : 'text-emerald-900'}`}>All Entrance Gates & Concourses Fluid</span>
            <span className={`text-[11px] mt-0.5 ${highContrast ? 'text-slate-300' : 'text-slate-600'}`}>Crowd circulation is operating optimally. No active bottlenecks detected.</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default CrowdMap;
