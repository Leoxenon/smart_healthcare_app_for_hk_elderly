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
    try { sessionStorage.removeItem('hasGreetedDashboardSession'); } catch {}
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleRegistrationComplete = (profile: any) => {
    setUserProfile(profile);
    try { sessionStorage.removeItem('hasGreetedDashboardSession'); } catch {}
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
    const t = command.toLowerCase();
    if (t.includes('用藥') || t.includes('藥物') || t.includes('用药') || t.includes('药物') || t.includes('吃药') || t.includes('medicine') || t.includes('medication') || t.includes('pill') || t.includes('drug')) {
      navigateTo('medication');
      return;
    }
    if (t.includes('血壓') || t.includes('數據') || t.includes('血压') || t.includes('健康数据') || t.includes('数据') || t.includes('血糖') || t.includes('blood pressure') || t.includes('health data') || t.includes('glucose') || t.includes('sugar')) {
      navigateTo('health-data');
      return;
    }
    if (t.includes('知識') || t.includes('知識庫') || t.includes('知识') || t.includes('知识库') || t.includes('tips') || t.includes('knowledge') || t.includes('info') || t.includes('information')) {
      navigateTo('knowledge');
      return;
    }
    if (t.includes('醫生') || t.includes('聯絡') || t.includes('電話') || t.includes('医生') || t.includes('联系') || t.includes('电话') || t.includes('doctor') || t.includes('contact') || t.includes('call') || t.includes('phone')) {
      navigateTo('contacts');
      return;
    }
    if (t.includes('緊急') || t.includes('求助') || t.includes('救命') || t.includes('紧急') || t.includes('帮助') || t.includes('急救') || t.includes('emergency') || t.includes('help')) {
      handleEmergency();
      return;
    }
    if (t.includes('菜譜') || t.includes('食譜') || t.includes('菜谱') || t.includes('食谱') || t.includes('recipe') || t.includes('food') || t.includes('cook') || t.includes('meal')) {
      navigateTo('recipe');
      return;
    }
    if (t.includes('風險') || t.includes('預測') || t.includes('評估') || t.includes('风险') || t.includes('预测') || t.includes('评估') || t.includes('risk') || t.includes('prediction') || t.includes('assess')) {
      navigateTo('risk-prediction');
      return;
    }
    navigateTo('dashboard');
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
        return <MainDashboard onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'medication':
        return <MedicationScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'health-data':
        return <HealthDataScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'knowledge':
        return <KnowledgeScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'assistant':
        return <AssistantScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'activity':
        return <ActivityScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'contacts':
        return <ContactsScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'settings':
        return <SettingsScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} settings={settings} onUpdateSettings={setSettings} />;
      case 'recipe':
        return <RecipeScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'risk-prediction':
        return <RiskPredictionScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
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
