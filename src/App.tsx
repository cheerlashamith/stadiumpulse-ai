import React, { useState, useTransition } from 'react';
import { AppStateProvider, useAppState } from './hooks/useAppState';
import { translate } from './services/i18nService';
import { LandingPage } from './features/landing/LandingPage';
import { AIConcierge } from './features/multilingual/AIConcierge';
import { CrowdMap } from './features/crowd/CrowdMap';
import { AccessibilitySuite } from './features/accessibility/AccessibilitySuite';
import { TransportOptimizer } from './features/transport/TransportOptimizer';
import { SustainabilityLayer } from './features/sustainability/SustainabilityLayer';
import { VolunteerConsole } from './features/volunteer/VolunteerConsole';
import { OpsIntelDashboard } from './features/ops-intel/OpsIntelDashboard';
import { IndoorWayfinding } from './features/navigation/IndoorWayfinding';
import { NotificationCenter } from './features/alerts/NotificationCenter';
import { 
  Users, Accessibility, Shield, ClipboardList, Globe, AlertCircle, Sparkles, LogIn 
} from 'lucide-react';

const AppShell: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    highContrast, 
    textSize, 
    isPending 
  } = useAppState();

  // State to manage showing the Landing Page
  const [showLanding, setShowLanding] = useState(true);

  // Organizer auth gate states
  const [operatorCode, setOperatorCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleOrganizerAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (operatorCode === 'FIFA2026') {
      setIsAuthorized(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid Operator Access Code. Try: FIFA2026');
    }
  };

  const handleRoleChange = (newRole: 'fan' | 'accessibility_fan' | 'volunteer' | 'organizer') => {
    setRole(newRole);
    setShowLanding(false);
    if (newRole !== 'organizer') {
      setIsAuthorized(false);
      setOperatorCode('');
    }
  };

  return (
    <div className={`min-h-screen ${
      highContrast 
        ? 'bg-black text-white font-mono' 
        : 'bg-slate-50 text-slate-900 font-sans'
    } transition-colors duration-200`}>
      {/* Accessibility: Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold z-50 focus:ring-2 focus:ring-emerald-400"
      >
        Skip to main content
      </a>

      {/* Screen-reader friendly announcements */}
      <NotificationCenter />

      {/* Control Header Row */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 py-3.5 transition-all ${
        highContrast 
          ? 'bg-black border-white' 
          : 'bg-white/95 border-slate-200/80 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-85 select-none transition-all" 
            onClick={() => setShowLanding(true)}
            title="Return to Platform Overview"
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              highContrast ? 'bg-black border border-white' : 'bg-emerald-600 shadow-emerald-500/10'
            }`}>
              ⚽
            </div>
            <div>
              <h1 className={`text-md font-bold tracking-tight flex items-center space-x-2 ${
                highContrast ? 'text-white' : 'text-slate-950'
              }`}>
                <span>{translate('app.title', language)}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-mono font-bold border ${
                  highContrast 
                    ? 'bg-black border-white text-white' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  WC 2026
                </span>
              </h1>
              <p className={`text-[10px] font-medium ${
                highContrast ? 'text-slate-300' : 'text-slate-500'
              }`}>{translate('app.tagline', language)}</p>
            </div>
          </div>

          {/* Role and Language select controllers */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Selector */}
            <div className={`flex items-center space-x-1 border rounded-xl px-2.5 py-1.5 ${
              highContrast ? 'bg-black border-white' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <Globe className={`h-4 w-4 shrink-0 ${highContrast ? 'text-white' : 'text-slate-400'}`} />
              <select
                aria-label="Select Interface Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={`bg-transparent text-xs focus:outline-none cursor-pointer font-semibold font-sans ${
                  highContrast ? 'text-white' : 'text-slate-700'
                }`}
              >
                <option value="en" className={highContrast ? 'bg-black text-white' : 'bg-white text-slate-950'}>EN • English</option>
                <option value="es" className={highContrast ? 'bg-black text-white' : 'bg-white text-slate-950'}>ES • Español</option>
                <option value="hi" className={highContrast ? 'bg-black text-white' : 'bg-white text-slate-950'}>HI • हिंदी</option>
                <option value="fr" className={highContrast ? 'bg-black text-white' : 'bg-white text-slate-950'}>FR • Français</option>
                <option value="ar" className={highContrast ? 'bg-black text-white' : 'bg-white text-slate-950'}>AR • العربية (RTL)</option>
              </select>
            </div>

            {/* Role Switch Tabs */}
            <nav className={`flex items-center space-x-1 border rounded-xl p-1 ${
              highContrast ? 'bg-black border-white' : 'bg-slate-100 border-slate-200'
            }`} aria-label="Role Switch Navigation">
              
              {/* Overview Landing Page Tab */}
              <button
                onClick={() => setShowLanding(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  showLanding 
                    ? (highContrast ? 'bg-white text-black font-extrabold border border-white' : 'bg-emerald-600 text-white font-bold shadow-xs border border-emerald-500/10') 
                    : (highContrast ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900')
                }`}
                aria-current={showLanding ? 'page' : undefined}
                aria-label="View platform overview"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Overview</span>
              </button>

              {/* Fan Mode Tab */}
              <button
                onClick={() => handleRoleChange('fan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  role === 'fan' 
                    ? (highContrast ? 'bg-white text-black font-extrabold border border-white' : 'bg-white text-slate-950 font-bold shadow-xs border border-slate-250/20') 
                    : (highContrast ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900')
                }`}
                aria-current={role === 'fan' ? 'page' : undefined}
                aria-label="Switch to fan mode"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Fan App</span>
              </button>

              {/* Accessible Fan Mode Tab */}
              <button
                onClick={() => handleRoleChange('accessibility_fan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  role === 'accessibility_fan' 
                    ? (highContrast ? 'bg-white text-black font-extrabold border border-white' : 'bg-white text-slate-950 font-bold shadow-xs border border-slate-250/20') 
                    : (highContrast ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900')
                }`}
                aria-current={role === 'accessibility_fan' ? 'page' : undefined}
                aria-label="Switch to accessibility fan mode"
              >
                <Accessibility className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Accessible Mode</span>
              </button>

              {/* Volunteer Tab */}
              <button
                onClick={() => handleRoleChange('volunteer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  role === 'volunteer' 
                    ? (highContrast ? 'bg-white text-black font-extrabold border border-white' : 'bg-white text-slate-950 font-bold shadow-xs border border-slate-250/20') 
                    : (highContrast ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900')
                }`}
                aria-current={role === 'volunteer' ? 'page' : undefined}
                aria-label="Switch to volunteer console"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Volunteer</span>
              </button>

              {/* Staff Organizer Command Center Tab */}
              <button
                onClick={() => handleRoleChange('organizer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  role === 'organizer' 
                    ? (highContrast ? 'bg-white text-black font-extrabold border border-white' : 'bg-white text-slate-950 font-bold shadow-xs border border-slate-250/20') 
                    : (highContrast ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900')
                }`}
                aria-current={role === 'organizer' ? 'page' : undefined}
                aria-label="Switch to organizer command center"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Command</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Viewport Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6">
        {isPending && (
          <div className="text-center py-4 text-xs text-slate-400 animate-pulse">
            Loading view parameters...
          </div>
        )}

        {/* PLATFORM OVERVIEW LANDING PAGE */}
        {showLanding && (
          <LandingPage 
            onEnterRole={(selectedRole) => handleRoleChange(selectedRole)}
            language={language}
            highContrast={highContrast}
          />
        )}

        {/* 1. FAN APP MOBILE-FIRST WEB VIEW */}
        {!showLanding && role === 'fan' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* Simulated Mobile Mock Chassis Center */}
            <div className={`w-full max-w-md mx-auto rounded-3xl p-5 border space-y-6 transition-all ${
              highContrast 
                ? 'bg-black border-white border-2 text-white' 
                : 'bg-white border-slate-200 shadow-lg text-slate-900'
            }`} id="fan-mobile-view">
              {/* Header inside mock phone */}
              <div className={`border-b pb-3 flex justify-between items-center ${
                highContrast ? 'border-white' : 'border-slate-100'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  highContrast ? 'text-white' : 'text-slate-800'
                }`}>{translate('roles.fan', language)}</span>
                <span className={`text-[10px] border px-2 py-0.5 rounded font-mono font-bold ${
                  highContrast 
                    ? 'bg-black border-white text-white' 
                    : 'bg-emerald-50 border-emerald-150 text-emerald-700'
                }`}>MATCH DAY LIVE</span>
              </div>

              <SustainabilityLayer />
              <CrowdMap />
              <TransportOptimizer />
              <IndoorWayfinding />
            </div>

            {/* floating AI concierge for fan */}
            <AIConcierge />
          </div>
        )}

        {/* 2. ACCESSIBILITY-NEEDS FAN MODE (Dedicated screen-reader & keyboard layout) */}
        {!showLanding && role === 'accessibility_fan' && (
          <div className="max-w-2xl mx-auto space-y-6" id="accessibility-fan-view">
            <div className={`p-5 rounded-2xl flex items-start space-x-4 border ${
              highContrast 
                ? 'bg-black border-white text-white' 
                : 'bg-sky-50 border-sky-100 text-slate-900'
            }`}>
              <div className={`p-2.5 rounded-xl shrink-0 border ${
                highContrast ? 'bg-black border-white text-white' : 'bg-sky-100 border-sky-200 text-sky-700'
              }`}>
                <Accessibility className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{translate('roles.accessibility_fan', language)}</h2>
                <p className={`text-xs mt-1 leading-relaxed ${
                  highContrast ? 'text-slate-200' : 'text-slate-600 font-medium'
                }`}>
                  This simplified screen-reader-first layout features large keyboard hit areas, high-contrast assets, instant Text-to-Speech (TTS), and priority step-free routing finders.
                </p>
              </div>
            </div>

            {/* Controls panel integrated directly on-screen */}
            <AccessibilitySuite />
            
            {/* Indoor seat/restroom path finder */}
            <IndoorWayfinding />

            {/* Embedded compact chat assist rather than a float */}
            <div className={`rounded-2xl p-5 border space-y-4 ${
              highContrast 
                ? 'bg-black border-white text-white' 
                : 'bg-white border-slate-200 shadow-sm text-slate-900'
            }`}>
              <h3 className="text-md font-bold tracking-tight">Direct AI Voice Assistant</h3>
              <AIConcierge />
            </div>
          </div>
        )}

        {/* 3. VOLUNTEER DISPATCH CONSOLE */}
        {!showLanding && role === 'volunteer' && (
          <div className="max-w-3xl mx-auto space-y-6" id="volunteer-view">
            <div className={`p-5 rounded-2xl flex items-start space-x-4 border ${
              highContrast 
                ? 'bg-black border-white text-white' 
                : 'bg-amber-50 border-amber-100 text-slate-900'
            }`}>
              <div className={`p-2.5 rounded-xl shrink-0 border ${
                highContrast ? 'bg-black border-white text-white' : 'bg-amber-100 border-amber-200 text-amber-700'
              }`}>
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{translate('roles.volunteer', language)}</h2>
                <p className={`text-xs mt-1 leading-relaxed ${
                  highContrast ? 'text-slate-200' : 'text-slate-600 font-medium'
                }`}>
                  Field Volunteer dispatch desk. Review GenAI allocated emergency dispatches, medical support requests, or density control tasks. Mark items complete to sync with Command Center.
                </p>
              </div>
            </div>

            <VolunteerConsole />
          </div>
        )}

        {/* 4. STAFF ORGANIZER COMMAND CENTER (Mock-Auth gated) */}
        {!showLanding && role === 'organizer' && (
          <div className="space-y-6" id="organizer-view">
            {!isAuthorized ? (
              // Mock auth login gate
              <div className={`max-w-md mx-auto rounded-2xl p-6 text-center border ${
                highContrast 
                  ? 'bg-black border-white text-white' 
                  : 'bg-white border-slate-150 shadow-md text-slate-900'
              }`} id="organizer-login-card">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                  highContrast ? 'bg-black border-white text-white' : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                  <Shield className="h-6 w-6 animate-pulse" />
                </div>
                <h2 className="text-md font-bold tracking-tight">Operations Dashboard Authentication Gate</h2>
                <p className={`text-xs mt-1 px-4 ${
                  highContrast ? 'text-slate-300' : 'text-slate-500 font-medium'
                }`}>This control route is reserved exclusively for tournament directors and arena stewards. Authorization code required.</p>
                
                <form onSubmit={handleOrganizerAuth} className="mt-5 space-y-3.5">
                  <div>
                    <label htmlFor="operator-code-input" className="sr-only">Operator Code</label>
                    <div className="relative">
                      <LogIn className={`absolute left-3.5 top-3 h-4.5 w-4.5 ${
                        highContrast ? 'text-white' : 'text-slate-400'
                      }`} />
                      <input
                        id="operator-code-input"
                        type="password"
                        required
                        placeholder="Enter Operator Access Code (Try: FIFA2026)"
                        value={operatorCode}
                        onChange={(e) => {
                          setOperatorCode(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                        className={`w-full border pl-10 pr-4 py-2.5 rounded-xl text-sm text-center focus:outline-none focus:ring-1 ${
                          highContrast 
                            ? 'bg-black border-white text-white placeholder-slate-400 font-mono focus:ring-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 font-mono focus:ring-rose-500'
                        }`}
                      />
                    </div>
                  </div>

                  {authError && (
                    <div className={`text-xs font-semibold p-2.5 rounded-lg flex items-center space-x-1.5 justify-center border ${
                      highContrast 
                        ? 'bg-black border-white text-white' 
                        : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`w-full py-2.5 text-xs font-bold rounded-xl transition border ${
                      highContrast 
                        ? 'bg-white text-black hover:bg-slate-100 border-white' 
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs border-transparent'
                    }`}
                    id="btn-login-submit"
                  >
                    Authenticate Terminal
                  </button>
                </form>
              </div>
            ) : (
              // Authorized dashboard view
              <div className="space-y-6 animate-fade-in" id="organizer-dashboard-view">
                <OpsIntelDashboard />
                <CrowdMap />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={`py-6 text-center text-[10px] font-mono mt-12 border-t ${
        highContrast 
          ? 'bg-black border-white text-white' 
          : 'bg-white border-slate-200/60 text-slate-500 shadow-inner'
      }`}>
        <p>© FIFA World Cup 2026 Smart Stadium Pilot • StadiumPulse AI</p>
        <p className={`mt-1 ${highContrast ? 'text-slate-300' : 'text-slate-400'}`}>
          This platform runs fully offline using mocked local AI streams when API keys are not detected.
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  );
}
