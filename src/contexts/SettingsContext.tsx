import { createContext, useContext, ReactNode } from 'react';

interface Settings {
  fontSize: string;
  theme: string;
  voiceSpeed: number;
  voiceVolume: number;
  language: string;
  highContrast: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ 
  children, 
  settings, 
  onUpdateSettings 
}: {
  children: ReactNode;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}) {
  return (
    <SettingsContext.Provider value={{ settings, updateSettings: onUpdateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
