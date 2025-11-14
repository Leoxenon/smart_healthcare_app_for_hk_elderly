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
import { stopAllAudio } from './utils/audioManager';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [prevScreen, setPrevScreen] = useState<string>('welcome');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showVoiceListening, setShowVoiceListening] = useState(false);
  const [showRescueVisualization, setShowRescueVisualization] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pendingAssistantText, setPendingAssistantText] = useState<string>('');
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

  const handleLogout = () => {
    stopAllAudio();
    setIsLoggedIn(false);
    setCurrentScreen('welcome');
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
    try { setPrevScreen(currentScreen); } catch {}
    try {
      const preserve = sessionStorage.getItem('preserveAudioOnNavigate') === 'true';
      if (preserve) {
        sessionStorage.removeItem('preserveAudioOnNavigate');
      } else {
        stopAllAudio();
      }
    } catch {
      stopAllAudio();
    }
    setCurrentScreen(screen);
  };

  const handleEmergency = () => {
    console.log('App.tsx: handleEmergency called');
    setShowEmergency(true);
  };

  const handleVoiceCommand = (command: string) => {
    if (currentScreen === 'assistant') {
      setPendingAssistantText(command);
      return;
    }
    const t = command.toLowerCase();
    const emotionKeys = ['唔開心','不開心','不开心','sad','傷心','伤心','孤獨','孤独','lonely','一個人','一个人','擔心','担心','焦慮','焦虑','壓力','压力','anxious','worry','痛','唔舒服','不舒服','pain','瞓唔著','睡不著','睡不着','失眠','悶','闷','無聊','无聊','開心','开心','好開心','好开心','高興','高兴','愉快','喜悅','喜悦','喜歡','喜欢','精神好','心情好','放鬆','放松','平靜','平静','安心','安定','安穩','安稳','滿意','满意','心滿意足','心满意足','順利','顺利','稱心','称心','如願','如愿','舒服','好舒服','輕鬆','轻松','興奮','兴奋','有精神','有動力','有动力','起勁','起劲','想做','想開始','想开始','干劲','朋友','家人','傾計','聊天','團聚','聚會','見面','來探我','探望','探訪','聯絡','联系','期待','希望','有信心','信心','樂觀','乐观','學到','学到','學習','学习','進步','进步','新事物','新东西'];
    if (emotionKeys.some(k => t.includes(k))) {
      setPendingAssistantText(command);
      navigateTo('assistant');
      return;
    }
    
    // 用药管理
    if (t.includes('用藥') || t.includes('藥物') || t.includes('用药') || t.includes('药物') || t.includes('吃药') || t.includes('食藥') || t.includes('食药') || t.includes('服藥') || t.includes('服药') || t.includes('medicine') || t.includes('medication') || t.includes('pill') || t.includes('drug')) {
      navigateTo('medication');
      return;
    }
    
    // 健康数据
    if (t.includes('血壓') || t.includes('數據') || t.includes('血压') || t.includes('健康数据') || t.includes('数据') || t.includes('血糖') || t.includes('量血壓') || t.includes('测血压') || t.includes('量血糖') || t.includes('测血糖') || t.includes('blood pressure') || t.includes('health data') || t.includes('glucose') || t.includes('sugar')) {
      navigateTo('health-data');
      return;
    }
    
    // 健康知识
    if (t.includes('知識') || t.includes('知識庫') || t.includes('知识') || t.includes('知识库') || t.includes('健康提示') || t.includes('健康資訊') || t.includes('tips') || t.includes('knowledge') || t.includes('info') || t.includes('information')) {
      navigateTo('knowledge');
      return;
    }
    
    // 联络医生
    if (t.includes('醫生') || t.includes('聯絡') || t.includes('電話') || t.includes('医生') || t.includes('联系') || t.includes('电话') || t.includes('doctor') || t.includes('contact') || t.includes('call') || t.includes('phone')) {
      navigateTo('contacts');
      return;
    }
    
    // 紧急求助
    if (t.includes('緊急') || t.includes('求助') || t.includes('救命') || t.includes('紧急') || t.includes('帮助') || t.includes('急救') || t.includes('報警') || t.includes('报警') || t.includes('emergency') || t.includes('help') || t.includes('sos')) {
      handleEmergency();
      return;
    }
    
    // AI菜谱
    if (t.includes('菜譜') || t.includes('食譜') || t.includes('菜谱') || t.includes('食谱') || t.includes('recipe') || t.includes('food') || t.includes('cook') || t.includes('meal')) {
      navigateTo('recipe');
      return;
    }
    
    // AI风险预测
    if (t.includes('風險') || t.includes('預測') || t.includes('評估') || t.includes('风险') || t.includes('预测') || t.includes('评估') || t.includes('risk') || t.includes('prediction') || t.includes('assess')) {
      navigateTo('risk-prediction');
      return;
    }
    
    // 设置页面
    if (t.includes('設置') || t.includes('设置') || t.includes('setting') || t.includes('settings') || t.includes('配置') || t.includes('選項') || t.includes('选项') || t.includes('options')) {
      navigateTo('settings');
      return;
    }
    
    // 主页/首页
    if (t.includes('主頁') || t.includes('首頁') || t.includes('主页') || t.includes('首页') || t.includes('home') || t.includes('dashboard') || t.includes('返回')) {
      navigateTo('dashboard');
      return;
    }
    
    // 默认返回主页
    navigateTo('dashboard');
  };

  const navigateBackFromAssistant = () => {
    stopAllAudio();
    setCurrentScreen(prevScreen || 'dashboard');
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
        return <MainDashboard onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} onLogout={handleLogout} />;
      case 'medication':
        return <MedicationScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'health-data':
        return <HealthDataScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'knowledge':
        return <KnowledgeScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} />;
      case 'assistant':
        return <AssistantScreen onNavigate={navigateTo} onEmergency={handleEmergency} onVoiceInput={() => setShowVoiceListening(true)} incomingText={pendingAssistantText} onConsumeIncoming={() => setPendingAssistantText('')} onBack={navigateBackFromAssistant} />;
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
