import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { MedicationScreen } from './components/MedicationScreen';
import { HealthDataScreen } from './components/HealthDataScreen';
import { KnowledgeScreen } from './components/KnowledgeScreen';
import { AssistantScreen } from './components/AssistantScreen';
import { ActivityScreen } from './components/ActivityScreen';
import { ContactsScreen } from './components/ContactsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { EmergencyModal } from './components/EmergencyModal';
import { RecipeScreen } from './components/RecipeScreen';
import { RiskPredictionScreen } from './components/RiskPredictionScreen';
import { VoiceListeningModal } from './components/VoiceListeningModal';
import { RescueVisualization } from './components/RescueVisualization';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showVoiceListening, setShowVoiceListening] = useState(false);
  const [showRescueVisualization, setShowRescueVisualization] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'large',
    theme: 'light',
    voiceSpeed: 0.8,
    voiceVolume: 0.8,
    language: 'cantonese',
    highContrast: false,
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleEmergency = () => {
    setShowEmergency(true);
  };

  const handleVoiceCommand = (command: string) => {
    // Process voice command and navigate
    if (command.includes('用藥') || command.includes('藥物')) {
      navigateTo('medication');
    } else if (command.includes('血壓') || command.includes('數據')) {
      navigateTo('health-data');
    } else if (command.includes('知識')) {
      navigateTo('knowledge');
    } else if (command.includes('醫生') || command.includes('電話')) {
      navigateTo('contacts');
    } else if (command.includes('緊急') || command.includes('求助')) {
      handleEmergency();
    } else if (command.includes('菜譜') || command.includes('食譜')) {
      navigateTo('recipe');
    } else if (command.includes('風險') || command.includes('預測')) {
      navigateTo('risk-prediction');
    } else {
      navigateTo('dashboard');
    }
  };

  const handleEmergencyConfirm = () => {
    setShowEmergency(false);
    setShowRescueVisualization(true);
  };

  const renderScreen = () => {
    if (!isLoggedIn) {
      return <WelcomeScreen onLogin={handleLogin} onEmergency={handleEmergency} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'medication':
        return <MedicationScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'health-data':
        return <HealthDataScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'knowledge':
        return <KnowledgeScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'assistant':
        return <AssistantScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'activity':
        return <ActivityScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'contacts':
        return <ContactsScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'settings':
        return <SettingsScreen onNavigate={navigateTo} onEmergency={handleEmergency} settings={settings} onUpdateSettings={setSettings} />;
      case 'recipe':
        return <RecipeScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      case 'risk-prediction':
        return <RiskPredictionScreen onNavigate={navigateTo} onEmergency={handleEmergency} />;
      default:
        return <Dashboard onNavigate={navigateTo} onEmergency={handleEmergency} />;
    }
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${settings.highContrast ? 'high-contrast' : ''}`}>
      {renderScreen()}
      
      {/* Global Voice Activation Button */}
      {isLoggedIn && !showRescueVisualization && (
        <button
          onClick={() => setShowVoiceListening(true)}
          className="fixed bottom-32 right-6 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-6 shadow-2xl transition-all hover:scale-110 z-40 animate-pulse"
          aria-label="語音喚醒"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
      )}

      {showEmergency && (
        <EmergencyModal 
          onClose={() => setShowEmergency(false)}
          onConfirm={handleEmergencyConfirm}
        />
      )}
      
      {showVoiceListening && (
        <VoiceListeningModal
          onClose={() => setShowVoiceListening(false)}
          onCommand={handleVoiceCommand}
        />
      )}

      {showRescueVisualization && (
        <RescueVisualization onClose={() => setShowRescueVisualization(false)} />
      )}
    </div>
  );
}
