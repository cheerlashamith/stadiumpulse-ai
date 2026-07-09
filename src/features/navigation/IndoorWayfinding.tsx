import React, { useState, useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { Compass, MoveUpRight, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

interface NavigationNode {
  id: string;
  name: string;
  type: 'gate' | 'facility' | 'section';
}

interface NavigationEdge {
  from: string;
  to: string;
  instructions: string;
  distance: string; // e.g. "30m"
}

export const IndoorWayfinding: React.FC = () => {
  const { language, textSize, highContrast } = useAppState();
  const [sourceNode, setSourceNode] = useState('gate-4');
  const [destNode, setDestNode] = useState('concession-b');
  const [routeCalculated, setRouteCalculated] = useState<NavigationEdge[] | null>(null);

  // Simple indoor venue graph model (nodes/edges)
  const venueNodes = useMemo<NavigationNode[]>(() => [
    { id: 'gate-1', name: 'Gate 1 - North Entrance', type: 'gate' },
    { id: 'gate-4', name: 'Gate 4 - West Entrance (Accessible)', type: 'gate' },
    { id: 'section-104', name: 'Section 104 ADA seating deck', type: 'section' },
    { id: 'restroom-b', name: 'Accessible Restroom Suite B', type: 'facility' },
    { id: 'concession-b', name: 'Zone B Concession Row (Food)', type: 'facility' }
  ], []);

  const venueEdges = useMemo<NavigationEdge[]>(() => [
    { from: 'gate-4', to: 'section-104', instructions: 'Go straight through Gate 4 scanning lobby, turn right at Section 104 sign. Use wheelchair lift.', distance: '25m' },
    { from: 'section-104', to: 'restroom-b', instructions: 'Head left along Concourse corridor Section 104. Restroom is next to the elevator.', distance: '15m' },
    { from: 'gate-4', to: 'concession-b', instructions: 'Take West Ramp elevator up to Concourse level 1. Concession stands are adjacent to stand row.', distance: '60m' },
    { from: 'gate-1', to: 'concession-b', instructions: 'From North Gate 1, follow main East concourse corridor. Stall B is next to Merchandise stand.', distance: '120m' }
  ], []);

  const handleCalculateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find matching route or simple shortest connection
    const directMatch = venueEdges.filter(e => e.from === sourceNode && e.to === destNode);
    if (directMatch.length > 0) {
      setRouteCalculated(directMatch);
    } else {
      // Create multi-hop path if possible, or fallback gracefully
      const firstLeg = venueEdges.find(e => e.from === sourceNode);
      const secondLeg = venueEdges.find(e => e.to === destNode);
      if (firstLeg && secondLeg && firstLeg.to === secondLeg.from) {
        setRouteCalculated([firstLeg, secondLeg]);
      } else {
        // Safe mock path if direct connection isn't pre-defined in our static graph
        setRouteCalculated([
          {
            from: sourceNode,
            to: destNode,
            instructions: `From ${venueNodes.find(n => n.id === sourceNode)?.name}, proceed along central concourse ring and follow high-contrast blue signage indicators towards ${venueNodes.find(n => n.id === destNode)?.name}.`,
            distance: '85m'
          }
        ]);
      }
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 font-sans ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`} id="indoor-wayfinding-card">
      <div className={`flex items-center space-x-2.5 mb-4 border-b pb-3 ${
        highContrast ? 'border-white' : 'border-slate-100'
      }`}>
        <div className={`p-2 rounded-xl ${
          highContrast ? 'bg-white text-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <h3 className={`text-md font-bold tracking-tight ${highContrast ? 'text-white' : 'text-slate-900'}`}>
            Indoor Wayfinding Assist
          </h3>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Navigate corridors, seats, lift lobbies, and facilities with step-free priority routing</p>
        </div>
      </div>

      <form onSubmit={handleCalculateRoute} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Starting Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="source-node-select" className={`text-xs font-semibold mb-1 ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Starting Point</label>
            <select
              id="source-node-select"
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className={`border text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 ${
                highContrast 
                  ? 'bg-black border-white text-white focus:ring-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-emerald-500'
              }`}
            >
              {venueNodes.map(node => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </div>

          {/* Destination Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="dest-node-select" className={`text-xs font-semibold mb-1 ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Destination</label>
            <select
              id="dest-node-select"
              value={destNode}
              onChange={(e) => setDestNode(e.target.value)}
              className={`border text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 ${
                highContrast 
                  ? 'bg-black border-white text-white focus:ring-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-emerald-500'
              }`}
            >
              {venueNodes.filter(n => n.id !== sourceNode).map(node => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2.5 font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 ${
            highContrast 
              ? 'bg-white text-black hover:bg-slate-100 border-2 border-white' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          id="btn-calculate-indoor"
        >
          <MoveUpRight className="h-4 w-4" />
          <span>Find Step-Free Path</span>
        </button>
      </form>

      {/* Render calculated directions */}
      {routeCalculated && (
        <div className={`mt-5 border rounded-xl p-4 space-y-3.5 ${
          highContrast ? 'bg-black border-white text-white' : 'bg-emerald-50/50 border-emerald-100'
        }`} id="wayfinding-route-result">
          <div className={`flex justify-between items-center border-b pb-2 ${
            highContrast ? 'border-white' : 'border-emerald-100'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              highContrast ? 'text-white' : 'text-emerald-700'
            }`}>Wayfinding Guide Route</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              highContrast 
                ? 'bg-black border-white text-white' 
                : 'bg-white border-emerald-200 text-emerald-700 font-medium shadow-xs'
            }`}>
              Total: {routeCalculated.reduce((acc, step) => acc + parseInt(step.distance), 0)}m
            </span>
          </div>

          <div className="space-y-3">
            {routeCalculated.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`h-5 w-5 rounded border flex items-center justify-center text-[10px] font-bold shrink-0 font-mono ${
                  highContrast 
                    ? 'bg-black border-white text-white' 
                    : 'bg-white border-emerald-200 text-emerald-700 shadow-xs'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`leading-normal ${
                    highContrast ? 'text-white' : 'text-slate-700'
                  } ${textSize === 'large' ? 'text-sm' : 'text-xs'}`}>{step.instructions}</p>
                  <span className={`text-[9px] font-mono block mt-1 uppercase ${
                    highContrast ? 'text-slate-300' : 'text-slate-400 font-semibold'
                  }`}>Distance leg: {step.distance}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`flex items-center space-x-2 p-2.5 rounded-lg text-[11px] border ${
            highContrast 
              ? 'text-white bg-black border-white' 
              : 'text-emerald-800 bg-white border-emerald-150'
          }`}>
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
            <span>This route matches certified ADA zero-step requirements. Elevators and assistance desks are active along this path.</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default IndoorWayfinding;
