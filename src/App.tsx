import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { MainDashboard } from './components/MainDashboard';
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
import { SettingsProvider } from './contexts/SettingsContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showVoiceListening, setShowVoiceListening] = useState(false);
  const [showRescueVisualization, setShowRescueVisualization] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
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

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleRegistrationComplete = (profile: any) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    
    // 可以在這裡保存用戶檔案到本地存儲或發送到服務器
    localStorage.setItem('userProfile', JSON.stringify(profile));
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
      if (currentScreen === 'register') {
        return <RegisterScreen onNavigate={navigateTo} onRegister={handleRegistrationComplete} />;
      }
      return <WelcomeScreen onLogin={handleLogin} onRegister={handleRegister} onEmergency={handleEmergency} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <MainDashboard onNavigate={navigateTo} onEmergency={handleEmergency} />;
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
        return <MainDashboard onNavigate={navigateTo} onEmergency={handleEmergency} />;
    }
  };

  return (
    <SettingsProvider settings={settings} onUpdateSettings={setSettings}>
      <div 
        className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${settings.highContrast ? 'high-contrast' : ''}`}
        style={{
          fontSize: settings.fontSize === 'small' ? '16px' : 
                    settings.fontSize === 'standard' ? '20px' : 
                    settings.fontSize === 'large' ? '24px' : '28px'
        }}
      >
        {renderScreen()}
        
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
    </SettingsProvider>
  );
}
