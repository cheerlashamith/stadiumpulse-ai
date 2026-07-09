import React, { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { Accessibility, Eye, Type, Volume2, UserCheck, Check } from 'lucide-react';

export const AccessibilitySuite: React.FC = () => {
  const { 
    language, 
    highContrast, 
    setHighContrast, 
    textSize, 
    setTextSize, 
    audioWayfinding, 
    setAudioWayfinding,
    signAvatar,
    setSignAvatar
  } = useAppState();

  const [activeFacility, setActiveFacility] = useState<string | null>(null);

  const facilities = [
    { id: 'acc-1', type: 'seating', name: 'West Lower Section 104 ADA Deck', desc: 'Step-free wheelchair platforms with companion seats and electrical charging outlets.', gate: 'Gate 4 West Entrance' },
    { id: 'acc-2', type: 'restroom', name: 'Restroom Suite B - Section 104', desc: 'Unisex accessible restroom with automated door openers and low-level panic alarms.', gate: 'Gate 4 West Entrance' },
    { id: 'acc-3', type: 'elevator', name: 'Lift Lobby 1 - West Gate 4 Entrance', desc: 'Tactile braille lift connecting Ground Plaza, Concourse levels, and stand corridors.', gate: 'Gate 4 West Entrance' },
    { id: 'acc-4', type: 'zeroStep', name: 'Level North-to-West Ramp Path', desc: 'Gentle 1:12 maximum slope paving bypasses escalators completely.', gate: 'Gate 1 North Entrance' }
  ];

  // Helper to resolve button state colors across regular and high-contrast modes
  const getButtonClass = (isActive: boolean, activeColor: string) => {
    if (highContrast) {
      return isActive 
        ? 'bg-white border-white text-black font-black border-2 shadow-xs' 
        : 'bg-black border-white text-white border-2 hover:bg-slate-900';
    }
    return isActive 
      ? `${activeColor} font-bold border` 
      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border';
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 font-sans ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`} id="accessibility-suite-card">
      <div className={`flex items-center space-x-2.5 mb-4 border-b pb-3 ${
        highContrast ? 'border-white' : 'border-slate-100'
      }`}>
        <div className={`p-2 rounded-xl ${
          highContrast ? 'bg-white text-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          <Accessibility className="h-5 w-5" />
        </div>
        <div>
          <h3 className={`text-md font-bold tracking-tight ${highContrast ? 'text-white' : 'text-slate-900'}`}>
            {translate('accessibility.accessibleFinder', language)}
          </h3>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Screen-reader optimized assistance, toggles, and step-free facility routing</p>
        </div>
      </div>

      {/* Accessible Toggles Row */}
      <div className="grid grid-cols-2 gap-2.5 mb-5" role="group" aria-label="Accessibility Settings Toggles">
        {/* High Contrast Mode Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center space-x-2.5 p-3.5 rounded-xl text-xs transition ${getButtonClass(highContrast, 'bg-amber-100 border-amber-300 text-amber-900')}`}
          aria-pressed={highContrast}
          id="btn-toggle-contrast"
        >
          <Eye className="h-4.5 w-4.5" />
          <span>{translate('accessibility.highContrast', language)}</span>
        </button>

        {/* Text Size Toggle */}
        <button
          onClick={() => setTextSize(textSize === 'large' ? 'regular' : 'large')}
          className={`flex items-center space-x-2.5 p-3.5 rounded-xl text-xs transition ${getButtonClass(textSize === 'large', 'bg-emerald-50 border-emerald-200 text-emerald-800')}`}
          aria-pressed={textSize === 'large'}
          id="btn-toggle-text-size"
        >
          <Type className="h-4.5 w-4.5" />
          <span>{textSize === 'large' ? translate('accessibility.regularText', language) : translate('accessibility.largeText', language)}</span>
        </button>

        {/* Audio Wayfinding Navigation Speech Mode */}
        <button
          onClick={() => setAudioWayfinding(!audioWayfinding)}
          className={`flex items-center space-x-2.5 p-3.5 rounded-xl text-xs transition ${getButtonClass(audioWayfinding, 'bg-sky-50 border-sky-200 text-sky-800')}`}
          aria-pressed={audioWayfinding}
          id="btn-toggle-audio-nav"
        >
          <Volume2 className="h-4.5 w-4.5" />
          <span>{translate('accessibility.audioNav', language)}</span>
        </button>

        {/* Sign Language Avatar Toggle */}
        <button
          onClick={() => setSignAvatar(!signAvatar)}
          className={`flex items-center space-x-2.5 p-3.5 rounded-xl text-xs transition ${getButtonClass(signAvatar, 'bg-purple-50 border-purple-200 text-purple-800')}`}
          aria-pressed={signAvatar}
          id="btn-toggle-sign-avatar"
        >
          <Accessibility className="h-4.5 w-4.5" />
          <span>{translate('accessibility.signAvatar', language)}</span>
        </button>
      </div>

      {/* Sign Language Interactive Placeholder */}
      {signAvatar && (
        <div className={`mb-5 p-4 rounded-xl border ${
          highContrast ? 'bg-black border-white text-white' : 'bg-purple-50 border-purple-100'
        }`} id="sign-avatar-preview">
          <div className="flex items-center space-x-3">
            {/* Animated avatar box */}
            <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl animate-bounce border-2 ${
              highContrast ? 'bg-black border-white text-white' : 'bg-white border-purple-300 shadow-xs'
            }`}>
              🤟
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wide ${
                highContrast ? 'text-white font-mono' : 'text-purple-700'
              }`}>Live Sign Assist Active</h4>
              <p className={`text-xs mt-1 ${highContrast ? 'text-slate-300' : 'text-purple-950/80'}`}>This digital avatar interprets AI concierge advice into ASL and International Sign Language in real-time.</p>
            </div>
          </div>
        </div>
      )}

      {/* Filterable Accessible Facility Finder */}
      <div role="region" aria-label="Step-Free Facility List">
        <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
          highContrast ? 'text-white' : 'text-slate-400'
        }`}>
          Accessible Amenities (Step-Free Finder)
        </h4>
        <div className="space-y-2">
          {facilities.map(facility => (
            <button
              key={facility.id}
              onClick={() => setActiveFacility(activeFacility === facility.id ? null : facility.id)}
              className={`w-full text-left p-4.5 rounded-xl border text-xs transition relative overflow-hidden ${
                activeFacility === facility.id 
                  ? (highContrast ? 'border-white bg-white text-black font-bold' : 'border-emerald-500 bg-emerald-50 text-emerald-800') 
                  : (highContrast ? 'border-slate-700 bg-black text-white hover:bg-slate-900' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-700')
              }`}
              aria-expanded={activeFacility === facility.id}
              id={`facility-${facility.id}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`font-bold flex items-center space-x-1 ${
                    activeFacility === facility.id 
                      ? (highContrast ? 'text-black' : 'text-emerald-950') 
                      : (highContrast ? 'text-slate-800' : 'text-slate-800')
                  }`}>
                    <span>♿ {facility.name}</span>
                    {activeFacility === facility.id && <Check className={`h-3.5 w-3.5 ${highContrast ? 'text-black' : 'text-emerald-600'}`} />}
                  </span>
                  <span className={`text-[10px] block mt-0.5 font-mono ${
                    activeFacility === facility.id 
                      ? (highContrast ? 'text-black/80' : 'text-emerald-700/85') 
                      : (highContrast ? 'text-slate-300' : 'text-slate-500')
                  }`}>Entrance: {facility.gate}</span>
                </div>
              </div>

              {activeFacility === facility.id && (
                <div className={`mt-3.5 pt-3.5 border-t leading-relaxed font-sans ${
                  highContrast 
                    ? 'border-white text-black' 
                    : 'border-emerald-200 text-slate-700'
                }`}>
                  <p>{facility.desc}</p>
                  <p className={`mt-2 text-[10px] px-2 py-1 rounded w-max border ${
                    highContrast 
                      ? 'bg-white text-black border-black font-bold' 
                      : 'bg-white text-sky-700 border-sky-100 shadow-xs'
                  }`}>
                    🔊 Wayfinding Guide: Exit Gate 4, follow blue tactile ground tiles East for 30m. Lift lobby on left.
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AccessibilitySuite;
