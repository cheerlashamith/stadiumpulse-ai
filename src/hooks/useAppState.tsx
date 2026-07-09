import React, { createContext, useContext, useState, useEffect, useMemo, useTransition } from 'react';
import { UserRole, AppLanguage, Incident } from '../types';
import { mockRealtimeService, RealtimeState } from '../services/mockRealtimeService';

interface AppStateContextType {
  role: UserRole;
  language: AppLanguage;
  highContrast: boolean;
  textSize: 'regular' | 'large';
  audioWayfinding: boolean;
  signAvatar: boolean;
  realtimeState: RealtimeState;
  carbonSaved: number;
  setRole: (role: UserRole) => void;
  setLanguage: (lang: AppLanguage) => void;
  setHighContrast: (active: boolean) => void;
  setTextSize: (size: 'regular' | 'large') => void;
  setAudioWayfinding: (active: boolean) => void;
  setSignAvatar: (active: boolean) => void;
  reportIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => Incident;
  assignTask: (taskId: string, volunteerName: string) => void;
  completeTask: (taskId: string) => void;
  addCarbonSaved: (amount: number) => void;
  isPending: boolean;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('fan');
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'regular' | 'large'>('regular');
  const [audioWayfinding, setAudioWayfinding] = useState<boolean>(false);
  const [signAvatar, setSignAvatar] = useState<boolean>(false);
  const [carbonSaved, setCarbonSaved] = useState<number>(1.2); // Start with a default base savings
  const [realtimeState, setRealtimeState] = useState<RealtimeState>(mockRealtimeService.getState());
  const [isPending, startTransition] = useTransition();

  // Role Gate transition optimization
  const setRole = (newRole: UserRole) => {
    startTransition(() => {
      setRoleState(newRole);
    });
  };

  // Language HTML element alignment (accessibility)
  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Subscribe to the real-time sensor simulator
  useEffect(() => {
    const unsubscribe = mockRealtimeService.subscribe((updatedState) => {
      setRealtimeState(updatedState);
    });
    return () => unsubscribe();
  }, []);

  const reportIncident = (incident: Omit<Incident, 'id' | 'timestamp'>): Incident => {
    return mockRealtimeService.reportIncident(incident);
  };

  const assignTask = (taskId: string, volunteerName: string) => {
    mockRealtimeService.assignTask(taskId, volunteerName);
  };

  const completeTask = (taskId: string) => {
    mockRealtimeService.completeTask(taskId);
  };

  const addCarbonSaved = (amount: number) => {
    setCarbonSaved(prev => parseFloat((prev + amount).toFixed(2)));
  };

  const value = useMemo(() => ({
    role,
    language,
    highContrast,
    textSize,
    audioWayfinding,
    signAvatar,
    realtimeState,
    carbonSaved,
    setRole,
    setLanguage,
    setHighContrast,
    setTextSize,
    setAudioWayfinding,
    setSignAvatar,
    reportIncident,
    assignTask,
    completeTask,
    addCarbonSaved,
    isPending
  }), [role, language, highContrast, textSize, audioWayfinding, signAvatar, realtimeState, carbonSaved, isPending]);

  return (
    <AppStateContext.Provider value={value}>
      <div className={`${highContrast ? 'high-contrast bg-black text-white' : ''}`}>
        {children}
      </div>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
export default useAppState;
