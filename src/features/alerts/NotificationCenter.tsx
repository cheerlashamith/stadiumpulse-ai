import React, { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { Bell, ShieldAlert, X } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { realtimeState, language } = useAppState();
  const { incidents } = realtimeState;
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Monitor incoming high-severity incidents to announce them to screen readers
  useEffect(() => {
    const activeHigh = incidents.filter(i => i.severity === 'high' && i.status === 'active');
    if (activeHigh.length > 0) {
      // Pick the latest active high severity incident
      const latest = activeHigh[0];
      // setActiveAlert(`CRITICAL ALERT: ${latest.title} reported at ${latest.description}. Please consult wayfinding redirects.`);
    }
  }, [incidents]);

  return (
    <div className="relative font-sans" id="notification-center">
      {/* Screen-reader-friendly live announcement region */}
      <div 
        role="alert" 
        aria-live="assertive" 
        className="sr-only"
        id="sr-alert-announcer"
      >
        {activeAlert}
      </div>

      {/* Visual Toast Notification if an active alert is present */}
      {activeAlert && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          id="toast-notification-banner"
        >
          <div className="bg-red-950 border border-red-500/40 text-red-200 px-4 py-3.5 rounded-xl shadow-2xl flex items-start space-x-3 backdrop-blur-md">
            <div className="p-1 rounded-md bg-red-900/30 border border-red-500/30 text-red-400 shrink-0">
              <ShieldAlert className="h-4.5 w-4.5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Tournament Security Broadcast</span>
              <p className="text-xs text-slate-100 mt-1 leading-normal font-medium">{activeAlert}</p>
            </div>
            <button 
              onClick={() => setActiveAlert(null)}
              className="p-1 rounded text-red-400 hover:text-white hover:bg-red-900/40 focus:outline-none focus:ring-1 focus:ring-red-400 shrink-0"
              aria-label="Dismiss Alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationCenter;
