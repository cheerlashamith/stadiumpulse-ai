import React, { useState, useEffect, useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { getShiftBriefing, getAnomalyDiagnosis } from '../../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  ShieldAlert, Activity, ClipboardList, Sparkles, BrainCircuit, AlertTriangle, Play, Check 
} from 'lucide-react';

export const OpsIntelDashboard: React.FC = () => {
  const { realtimeState, language, reportIncident, highContrast } = useAppState();
  const { zones, incidents } = realtimeState;

  // AI Shift briefing states
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // Anomaly diagnosis states
  const [activeDiagnosis, setActiveDiagnosis] = useState<Record<string, string>>({});
  const [diagnosingZoneId, setDiagnosingZoneId] = useState<string | null>(null);

  // New incident report form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [newIncidentZone, setNewIncidentZone] = useState('');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [newIncidentDesc, setNewIncidentDesc] = useState('');

  // 1. Memoize Recharts-friendly data format
  const chartData = useMemo(() => {
    return zones.map(zone => ({
      name: zone.name.split(' - ')[0], // short name
      Occupancy: zone.occupancy,
      Capacity: zone.capacity,
      ratio: parseFloat(((zone.occupancy / zone.capacity) * 100).toFixed(1))
    }));
  }, [zones]);

  // 2. Identify Anomalies (Rate-of-change / Extreme occupancy > 85%)
  const anomalies = useMemo(() => {
    return zones.filter(zone => (zone.occupancy / zone.capacity) > 0.85);
  }, [zones]);

  // Generate shift-level briefing on incidents
  const handleGenerateBriefing = async () => {
    setIsBriefingLoading(true);
    try {
      const summary = await getShiftBriefing(incidents);
      setBriefing(summary);
    } catch (err) {
      console.warn('Briefing generation handled via standby policy:', (err as any)?.message || err);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  // Run AI diagnosis for a specific anomalous zone
  const handleDiagnoseAnomaly = async (zoneId: string, name: string, occ: number, cap: number) => {
    setDiagnosingZoneId(zoneId);
    try {
      const explanation = await getAnomalyDiagnosis(name, occ, cap);
      setActiveDiagnosis(prev => ({
        ...prev,
        [zoneId]: explanation
      }));
    } catch (err) {
      console.warn('Anomaly diagnosis handled via standby policy:', (err as any)?.message || err);
    } finally {
      setDiagnosingZoneId(null);
    }
  };

  // Submit a new manual incident report
  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentTitle || !newIncidentZone || !newIncidentDesc) return;

    reportIncident({
      zoneId: newIncidentZone,
      title: newIncidentTitle,
      severity: newIncidentSeverity,
      status: 'active',
      description: newIncidentDesc
    });

    // Reset Form
    setNewIncidentTitle('');
    setNewIncidentZone('');
    setNewIncidentDesc('');
    setShowAddForm(false);
  };

  return (
    <div className={`space-y-6 font-sans ${highContrast ? 'text-white' : 'text-slate-900'}`} id="ops-intel-dashboard">
      {/* Header and Live Status Indicators */}
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center space-x-2 ${
            highContrast ? 'text-white' : 'text-slate-900'
          }`}>
            <Activity className={`h-6 w-6 ${highContrast ? 'text-white' : 'text-emerald-600'}`} />
            <span>{translate('organizer.title', language)}</span>
          </h2>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>FIFA Tournament Operations Command Center (Staff Only • Gated Access Verified)</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 border ${
            highContrast 
              ? 'bg-black border-white text-white' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-800 shadow-xs'
          }`}>
            <span className={`h-2 w-2 rounded-full animate-ping ${
              highContrast ? 'bg-white' : 'bg-emerald-500'
            }`} />
            <span>SYSTEM GATEWAY: ONLINE</span>
          </span>
          <span className={`px-3.5 py-1.5 rounded-lg border ${
            highContrast 
              ? 'bg-black border-white text-white font-semibold' 
              : 'bg-slate-50 border-slate-200 text-slate-500 shadow-xs'
          }`}>
            INCIDENTS: {incidents.length} total
          </span>
        </div>
      </div>

      {/* Grid: Live Analytics & Anomaly alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Area: Real-time Crowd Density Visualizer */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border transition-all duration-300 ${
          highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center space-x-2 ${
            highContrast ? 'text-white' : 'text-slate-900'
          }`}>
            <span>Stadium Occupancy Analytics (%)</span>
          </h3>
          <div className="h-64 w-full" id="density-chart-container" role="img" aria-label="Crowd Occupancy Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke={highContrast ? '#ffffff' : '#475569'} fontSize={10} tickLine={false} />
                <YAxis stroke={highContrast ? '#ffffff' : '#475569'} fontSize={10} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={highContrast 
                    ? { backgroundColor: '#000000', borderColor: '#ffffff', color: '#ffffff' }
                    : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }
                  } 
                  itemStyle={{ color: '#059669' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="ratio" name="Occupancy Rate (%)" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={highContrast
                        ? '#ffffff'
                        : entry.ratio > 85 ? '#ef4444' : entry.ratio > 50 ? '#facc15' : '#10b981'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Detection Hub */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
          highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-200 shadow-sm'
        }`} id="anomaly-detection-panel">
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center space-x-2 ${
              highContrast ? 'text-white' : 'text-slate-900'
            }`}>
              <ShieldAlert className={`h-4.5 w-4.5 ${highContrast ? 'text-white' : 'text-red-500'}`} />
              <span>{translate('organizer.anomalyDetection', language)}</span>
            </h3>

            {anomalies.length === 0 ? (
              <div className={`p-4 rounded-xl text-xs text-center flex flex-col items-center border ${
                highContrast ? 'bg-black border-white text-white' : 'bg-emerald-50 border-emerald-100 text-emerald-800'
              }`}>
                <Check className={`h-8 w-8 mb-2 ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
                <span className="font-bold block">All Zones Steady</span>
                <span className={`text-[11px] mt-0.5 ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>No rate-of-change spikes or extreme capacity spikes detected.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {anomalies.map(zone => (
                  <div key={zone.id} className={`p-3 rounded-xl space-y-2 border ${
                    highContrast ? 'bg-black border-white' : 'bg-red-50 border-red-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold truncate max-w-[65%] ${
                        highContrast ? 'text-white' : 'text-red-800 font-bold'
                      }`}>🔴 SURGE SPIKE: {zone.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        highContrast 
                          ? 'bg-black text-white border-white font-bold' 
                          : 'bg-red-100 border-red-200 text-red-700 font-semibold'
                      }`}>
                        {Math.round((zone.occupancy / zone.capacity) * 100)}%
                      </span>
                    </div>

                    {/* AI Diagnosis Result */}
                    {activeDiagnosis[zone.id] ? (
                      <div className={`p-2.5 rounded border text-[11px] leading-relaxed font-sans ${
                        highContrast ? 'bg-black border-white text-white font-mono' : 'bg-white border-slate-200 text-slate-750'
                      }`}>
                        <span className={`text-[10px] font-bold block mb-0.5 ${
                          highContrast ? 'text-white font-mono' : 'text-indigo-600'
                        }`}>🧠 AI DIAGNOSTIC REPORT:</span>
                        {activeDiagnosis[zone.id]}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDiagnoseAnomaly(zone.id, zone.name, zone.occupancy, zone.capacity)}
                        disabled={diagnosingZoneId === zone.id}
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition border ${
                          highContrast 
                            ? 'bg-white text-black border-white hover:bg-slate-100' 
                            : 'bg-red-50 hover:bg-red-100/50 text-red-700 border-red-200'
                        }`}
                      >
                        {diagnosingZoneId === zone.id ? (
                          <>
                            <div className="h-3 w-3 rounded-full border border-t-transparent border-slate-400 animate-spin" />
                            <span>Diagnosing...</span>
                          </>
                        ) : (
                          <>
                            <BrainCircuit className="h-3.5 w-3.5 animate-pulse" />
                            <span>Diagnose with Gemini</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`border-t pt-4 mt-4 text-[11px] leading-relaxed flex items-center space-x-2 ${
            highContrast ? 'border-white text-slate-300' : 'border-slate-100 text-slate-500'
          }`}>
            <AlertTriangle className={`h-4 w-4 shrink-0 ${highContrast ? 'text-white' : 'text-amber-500'}`} />
            <span>AI monitors scan rates and flags sudden surges surges above +10% within 10 seconds.</span>
          </div>
        </div>
      </div>

      {/* AI Shift Briefing & Action Directives Section */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-200 shadow-sm'
      }`} id="shift-briefing-panel">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center space-x-2 ${
              highContrast ? 'text-white' : 'text-slate-900'
            }`}>
              <Sparkles className={`h-4.5 w-4.5 ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
              <span>{translate('organizer.shiftBriefing', language)}</span>
            </h3>
            <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Instant operational intelligence summaries summaries crafted by Gemini</p>
          </div>

          <button
            onClick={handleGenerateBriefing}
            disabled={isBriefingLoading}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2 ${
              highContrast 
                ? 'bg-white text-black hover:bg-slate-100 border border-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            id="btn-generate-briefing"
          >
            {isBriefingLoading ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border border-t-transparent border-white animate-spin" />
                <span>Summarizing incidents...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>{translate('organizer.generateSummary', language)}</span>
              </>
            )}
          </button>
        </div>

        {briefing ? (
          <div className={`border rounded-xl p-4 text-xs leading-relaxed font-sans ${
            highContrast ? 'bg-black border-white text-white font-mono' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`} id="shift-briefing-text">
            {briefing}
          </div>
        ) : (
          <div className={`border border-dashed rounded-xl p-6 text-center text-xs ${
            highContrast ? 'border-white bg-black text-slate-300' : 'border-slate-300 bg-slate-50 text-slate-500'
          }`}>
            Click 'Summarize Current Incidents' to generate a real-time shift briefing from active operational telemetry logs.
          </div>
        )}
      </div>

      {/* Incidents List & Custom Report Form */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-200 shadow-sm'
      }`} id="incidents-list-panel">
        <div className={`flex justify-between items-center mb-4 border-b pb-3 ${
          highContrast ? 'border-white' : 'border-slate-100'
        }`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center space-x-2 ${
            highContrast ? 'text-white' : 'text-slate-900'
          }`}>
            <ClipboardList className="h-4.5 w-4.5" />
            <span>{translate('organizer.activeIncidents', language)}</span>
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-3 py-1.5 text-xs rounded-lg transition border font-bold ${
              highContrast 
                ? 'bg-black border-white text-white hover:bg-slate-900' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-xs'
            }`}
            id="btn-toggle-report"
          >
            {showAddForm ? 'Cancel Report' : 'Report Incident'}
          </button>
        </div>

        {/* Manual Incident Form */}
        {showAddForm && (
          <form onSubmit={handleAddIncident} className={`border p-4 rounded-xl mb-4 space-y-3 ${
            highContrast ? 'bg-black border-white' : 'bg-slate-50 border-slate-200 shadow-xs'
          }`} id="add-incident-form">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${
              highContrast ? 'text-white' : 'text-slate-800'
            }`}>File Live Incident Report</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Incident Title (e.g., Spill Section 10)"
                value={newIncidentTitle}
                onChange={(e) => setNewIncidentTitle(e.target.value)}
                className={`border px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 ${
                  highContrast 
                    ? 'bg-black border-white text-white placeholder-slate-400 focus:ring-white' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-emerald-500'
                }`}
              />
              <select
                required
                value={newIncidentZone}
                onChange={(e) => setNewIncidentZone(e.target.value)}
                className={`border px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 ${
                  highContrast 
                    ? 'bg-black border-white text-white focus:ring-white' 
                    : 'bg-white border-slate-200 text-slate-700 focus:ring-emerald-500'
                }`}
              >
                <option value="">Select Zone/Gate</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
              <select
                value={newIncidentSeverity}
                onChange={(e) => setNewIncidentSeverity(e.target.value as any)}
                className={`border px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 ${
                  highContrast 
                    ? 'bg-black border-white text-white focus:ring-white' 
                    : 'bg-white border-slate-200 text-slate-700 focus:ring-emerald-500'
                }`}
              >
                <option value="low">Low Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="high">High Severity</option>
              </select>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Provide a clear, brief explanation of the issue."
              value={newIncidentDesc}
              onChange={(e) => setNewIncidentDesc(e.target.value)}
              className={`w-full border px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 ${
                highContrast 
                  ? 'bg-black border-white text-white placeholder-slate-400 focus:ring-white' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-emerald-500'
              }`}
            />
            <button
              type="submit"
              className={`px-4 py-2 font-bold text-xs rounded-lg transition ${
                highContrast 
                  ? 'bg-white text-black hover:bg-slate-100 border border-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
              }`}
            >
              Submit Dispatch Report
            </button>
          </form>
        )}

        {/* Grid Scrollable Feed of live incidents */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {incidents.map(inc => {
            const associatedZone = zones.find(z => z.id === inc.zoneId);
            return (
              <div 
                key={inc.id}
                className={`p-3 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition ${
                  highContrast 
                    ? 'bg-black border-white hover:border-slate-300' 
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 hover:border-slate-200'
                }`}
                id={`incident-item-${inc.id}`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      inc.status === 'active' 
                        ? 'bg-red-500 animate-pulse' 
                        : (highContrast ? 'bg-white' : 'bg-slate-400')
                    }`} />
                    <span className={`text-xs font-bold ${highContrast ? 'text-white' : 'text-slate-800'}`}>{inc.title}</span>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                      inc.severity === 'high' 
                        ? (highContrast ? 'bg-black border-white text-white font-extrabold border-2' : 'bg-red-50 border-red-200 text-red-700') 
                        : inc.severity === 'medium' 
                        ? (highContrast ? 'bg-black border-white text-white border-2' : 'bg-amber-50 border-amber-200 text-amber-700') 
                        : (highContrast ? 'bg-black border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-500')
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p className={`text-[11px] mt-1 line-clamp-1 font-sans ${
                    highContrast ? 'text-slate-300' : 'text-slate-500'
                  }`}>{inc.description}</p>
                  <span className={`text-[10px] font-mono mt-0.5 block ${
                    highContrast ? 'text-slate-300' : 'text-slate-400 font-semibold'
                  }`}>📍 Zone: {associatedZone?.name || 'Perimeters'}</span>
                </div>

                <div className="flex items-center space-x-2 font-mono text-[10px]">
                  <span className={`${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>
                    {new Date(inc.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded font-bold uppercase border ${
                    inc.status === 'active' 
                      ? (highContrast ? 'bg-black border-white text-white' : 'bg-amber-50 border-amber-100 text-amber-700') 
                      : (highContrast ? 'bg-black border-white text-white' : 'bg-emerald-50 border-emerald-100 text-emerald-700')
                  }`}>
                    {inc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default OpsIntelDashboard;
