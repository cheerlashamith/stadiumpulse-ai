import React, { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { Leaf, QrCode, Trash2, Globe, Heart, AlertCircle } from 'lucide-react';

export const SustainabilityLayer: React.FC = () => {
  const { carbonSaved, language, highContrast } = useAppState();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const recyclingStations = [
    { id: 'bin-1', name: 'West Gate 4 Eco Hub', materials: 'Bottles, Plastics, Food Waste', distance: '40m away' },
    { id: 'bin-2', name: 'Zone B Concession Row', materials: 'Aluminum Cans, Paper, Cardboard', distance: '120m away' },
    { id: 'bin-3', name: 'North Stand Concourse Row #2', materials: 'General Composting, Cups, Liquids', distance: '80m away' }
  ];

  const nudges = [
    "💧 World Cup 2026 is plastic-free! Refill your water bottle at any water tap station in Zone B & D.",
    "♻️ Plastic cups are fully recyclable. Deposit them at the nearest Green Hub to earn tournament points!",
    "🚇 Choosing public transit rather than rideshare reduces fan travel carbon footprint by up to 88%."
  ];

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 font-sans ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`} id="sustainability-layer-card">
      <div className={`flex items-center space-x-2.5 mb-4 border-b pb-3 ${
        highContrast ? 'border-white' : 'border-slate-100'
      }`}>
        <div className={`p-2 rounded-xl ${
          highContrast ? 'bg-white text-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <h3 className={`text-md font-bold tracking-tight ${highContrast ? 'text-white' : 'text-slate-900'}`}>
            {translate('sustainability.title', language)}
          </h3>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Tournament eco-initiatives and personal carbon savings offset</p>
        </div>
      </div>

      {/* Carbon Offset Score card */}
      <div className={`border rounded-xl p-4 text-center mb-5 relative overflow-hidden ${
        highContrast ? 'bg-black border-white' : 'bg-emerald-50/50 border-emerald-100'
      }`}>
        <div className="absolute right-2 top-2 opacity-5">
          <Globe className={`h-16 w-16 ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
        </div>
        <span className={`text-[10px] uppercase font-mono tracking-wider block ${
          highContrast ? 'text-white' : 'text-slate-500 font-semibold'
        }`}>{translate('sustainability.carbonGoal', language)}</span>
        <span className={`text-3xl font-extrabold mt-1 block font-mono ${
          highContrast ? 'text-white' : 'text-emerald-600'
        }`}>
          {carbonSaved.toFixed(2)} kg CO₂
        </span>
        <p className={`text-xs mt-2.5 flex items-center justify-center space-x-1.5 px-2 ${
          highContrast ? 'text-white' : 'text-emerald-800'
        }`}>
          <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
          <span>You have saved more carbon than 78% of fans arriving today!</span>
        </p>
      </div>

      {/* QR Code Digital Ticket */}
      <div className={`p-4 rounded-xl flex items-center space-x-4 mb-5 border ${
        highContrast ? 'bg-black border-white' : 'bg-indigo-50 border-indigo-100'
      }`} id="digital-ticket-container">
        <div className="p-2 bg-white rounded-lg text-black border border-slate-200">
          {/* Simulated beautiful vector QR */}
          <QrCode className="h-12 w-12" aria-label="NFC digital ticket QR code" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${highContrast ? 'bg-white' : 'bg-emerald-500'}`} />
            <span className={`text-xs font-bold uppercase tracking-wide ${
              highContrast ? 'text-white' : 'text-indigo-600'
            }`}>
              {translate('sustainability.paperlessTicket', language)}
            </span>
          </div>
          <h4 className={`text-sm font-bold mt-1 ${highContrast ? 'text-white' : 'text-indigo-950'}`}>World Cup Match #12</h4>
          <p className={`text-[11px] mt-0.5 ${highContrast ? 'text-slate-300' : 'text-indigo-800/80'}`}>Seat 14, Row F • Zero-paper digital NFC entry enabled</p>
        </div>
      </div>

      {/* Eco Waste & Recycling Docks Finder */}
      <div className="mb-4">
        <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center space-x-1.5 ${
          highContrast ? 'text-white' : 'text-slate-400'
        }`}>
          <Trash2 className="h-3.5 w-3.5" />
          <span>{translate('sustainability.recyclingTitle', language)}</span>
        </h4>
        <div className="space-y-2">
          {recyclingStations.map(station => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(selectedStation === station.id ? null : station.id)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition flex justify-between items-center ${
                selectedStation === station.id 
                  ? (highContrast ? 'border-white bg-white text-black' : 'border-emerald-500 bg-emerald-50 text-emerald-800 font-medium') 
                  : (highContrast ? 'border-slate-700 bg-black text-white hover:bg-slate-900' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-700')
              }`}
              aria-expanded={selectedStation === station.id}
              id={`station-${station.id}`}
            >
              <div>
                <span className={`font-semibold block ${
                  selectedStation === station.id 
                    ? (highContrast ? 'text-black' : 'text-emerald-950') 
                    : (highContrast ? 'text-white' : 'text-slate-800')
                }`}>{station.name}</span>
                <span className={`text-[11px] mt-0.5 block ${
                  selectedStation === station.id 
                    ? (highContrast ? 'text-black opacity-80' : 'text-emerald-700') 
                    : (highContrast ? 'text-slate-300' : 'text-slate-500')
                }`}>{station.materials}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                selectedStation === station.id 
                  ? (highContrast ? 'bg-white border-black text-black' : 'bg-emerald-100/50 border-emerald-200 text-emerald-700') 
                  : (highContrast ? 'bg-black border-slate-750 text-slate-300' : 'bg-white border-slate-200 text-slate-500')
              }`}>
                {station.distance}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sustainability Nudges */}
      <div className={`border p-3.5 rounded-xl ${
        highContrast ? 'bg-black border-white' : 'bg-emerald-50 border-emerald-100'
      }`}>
        <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center space-x-1.5 ${
          highContrast ? 'text-white' : 'text-emerald-700'
        }`}>
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{translate('sustainability.greenTips', language)}</span>
        </h4>
        <div className="space-y-2">
          {nudges.map((nudge, index) => (
            <p key={index} className={`text-xs leading-relaxed pl-1.5 border-l-2 ${
              highContrast ? 'text-white border-white' : 'text-emerald-800 border-emerald-500/40'
            }`}>
              {nudge}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SustainabilityLayer;
