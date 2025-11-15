import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Mic, MessageCircle, Settings, LogOut } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { speakText, stopAllAudio } from '../utils/audioManager';

interface MainDashboardProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
  onLogout?: () => void;
}

export function MainDashboard({ onNavigate, onEmergency, onVoiceInput, onLogout }: MainDashboardProps) {
  const { settings } = useSettings();
  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('點擊我可以問候，點擊想法氣泡去不同功能！');
  const [showBubbles, setShowBubbles] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [hasGreeted, setHasGreeted] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hasGreetedDashboardSession') === 'true';
    } catch {
      return true;
    }
  });
  const [isSpeaking, setIsSpeaking] = useState(false); // 新增：语音播放状态

  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-HK', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
  const timeStr = now.toLocaleTimeString('zh-HK', { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  // 想法气泡导航选项
  const thoughtBubbles = [
    {
      id: 'medication',
      text: '今日用藥',
      icon: '💊',
      color: 'bg-green-100 border-green-300 text-green-800',
      onClick: () => {
        onNavigate('medication');
        setShowBubbles(false);
      }
    },
    {
      id: 'health-data',
      text: '健康數據',
      icon: '📊',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      onClick: () => {
        onNavigate('health-data');
        setShowBubbles(false);
      }
    },
    {
      id: 'risk-prediction',
      text: 'AI風險預測',
      icon: '⚠️',
      color: 'bg-red-100 border-red-300 text-red-800',
      onClick: () => {
        onNavigate('risk-prediction');
        setShowBubbles(false);
      }
    },
    {
      id: 'knowledge',
      text: '健康知識',
      icon: '📚',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      onClick: () => {
        onNavigate('knowledge');
        setShowBubbles(false);
      }
    },
    {
      id: 'recipe',
      text: 'AI菜譜',
      icon: '👨‍🍳',
      color: 'bg-orange-100 border-orange-300 text-orange-800',
      onClick: () => {
        onNavigate('recipe');
        setShowBubbles(false);
      }
    },
    {
      id: 'contacts',
      text: '問診服務',
      icon: '📞',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      onClick: () => {
        onNavigate('contacts');
        setShowBubbles(false);
      }
    }
  ];

  // 粤语问候语
  const cantoneseGreetings = [
    '早晨！今日天氣好靚呀！',
    '您好！身體點樣呀？',
    '午安！記得食飯呀！',
    '您好！今日感覺好啲未？',
    '晚安！早啲瞓覺呀！'
  ];

  // 初始问候（仅首次进入）
  useEffect(() => {
    if (!hasGreeted) {
      const greeting = '早晨，今日身體點呀？今日有冇準時食藥？';

      setTimeout(() => {
        setAiEmotion('talking');
        setCurrentMessage(greeting);
        setHasGreeted(true);
        try {
          sessionStorage.setItem('hasGreetedDashboardSession', 'true');
        } catch {}
        
        speakText(greeting, {
          lang: 'zh-HK',
          rate: 0.8,
          volume: 0.8,
          onStart: () => setIsSpeaking(true),
          onEnd: () => {
            setIsSpeaking(false);
            setCurrentMessage('點擊我可以問候，點擊想法氣泡去不同功能！');
            setAiEmotion('happy');
            setShowBubbles(true);
            
            // 5秒后清除提示信息
            setTimeout(() => {
              setCurrentMessage('');
            }, 5000);
          },
          onError: () => {
            setIsSpeaking(false);
            setCurrentMessage('點擊我可以問候，點擊想法氣泡去不同功能！');
            setAiEmotion('happy');
            setShowBubbles(true);
          },
        });
      }, 1000);
    }
  }, [hasGreeted, now]);

  const handleVoiceInput = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setIsSpeaking(false);
    if (typeof onVoiceInput === 'function') onVoiceInput();
  };

  // 点击AI角色交互
  const handleAIClick = () => {
    const simpleGreetings = [
      '您好呀！有咩可以幫到您？',
      '今日身體感覺點樣？',
      '記得按時食藥呀！',
      '要唔要我提醒您做運動？',
      '今日飲夠水未呀？',
      '有咩想問小健嘅？',
      '身體健康最重要呀！',
      '記得定期檢查身體呀！'
    ];
    
    const randomMessage = simpleGreetings[Math.floor(Math.random() * simpleGreetings.length)];
    try {
      sessionStorage.setItem('preserveAudioOnNavigate', 'true');
      sessionStorage.setItem('assistantArrivalGreeting', randomMessage);
    } catch {}
    onNavigate('assistant');
    speakText(randomMessage, {
      lang: 'zh-HK',
      rate: 0.8,
      volume: 0.8,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentMessage('');
        setAiEmotion('happy');
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentMessage('');
        setAiEmotion('happy');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部欢迎区域 */}
      <div className="bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-green-700 mb-2">您好！</h1>
            <h2 className="text-green-700 mb-2">歡迎回來</h2>
            <p className="text-gray-600">{dateStr}</p>
            <p className="text-gray-600">{timeStr}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => typeof onLogout === 'function' && onLogout()}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2"
              aria-label="退出"
            >
              <LogOut className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">退出</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2"
              aria-label="設置"
            >
              <Settings className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">設置</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI助手主区域 */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* AI角色展示区 */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-4 border-gradient-to-r from-blue-200 to-purple-200 relative">
            <div className="flex flex-col items-center text-center relative">
              {/* 紧急求助按钮 - 移到AI角色正上方 */}
              <div className="mb-4 relative z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('MainDashboard SOS button clicked!');
                    onEmergency();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-6 py-3 shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                  aria-label="緊急求助"
                  type="button"
                >
                  <span className="text-lg">🆘</span>
                  <span className="font-bold">緊急求助</span>
                </button>
              </div>

              {/* AI角色 */}
              <div className="mb-6 cursor-pointer" onClick={handleAIClick}>
                <AICharacter 
                  emotion={aiEmotion}
                  isAnimating={isVoiceMode}
                  size="large"
                  message={currentMessage}
                />
              </div>

              {/* AI介绍 - 简化版 */}
              <div className="max-w-2xl mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3 justify-center">
                  <MessageCircle className="w-8 h-8 text-purple-500" />
                  小健 - 您嘅健康助手
                </h2>
              </div>

              {/* 想法气泡 - 移到AI下方 */}
              {showBubbles && (
                <div className="mb-8 w-full max-w-4xl">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                    {thoughtBubbles.map((bubble, index) => (
                      <button
                        key={bubble.id}
                        onClick={bubble.onClick}
                        className={`${bubble.color} px-6 py-4 rounded-2xl shadow-lg border-2 hover:scale-110 transition-all duration-300 flex flex-col items-center gap-2 min-w-[120px]`}
                      >
                        <span className="text-2xl">{bubble.icon}</span>
                        <span className="text-sm font-medium text-center leading-tight">{bubble.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 语音输入按钮 - 改为圆形紫色按钮 */}
              <button
                onClick={handleVoiceInput}
                className={`bg-purple-500 hover:bg-purple-600 text-white rounded-full p-6 shadow-2xl transition-all hover:scale-110 flex items-center justify-center ${
                  isVoiceMode ? 'ring-4 ring-purple-300 animate-pulse' : ''
                }`}
                aria-label="語音輸入"
              >
                <Mic className="w-10 h-10" />
              </button>

              {/* 提示信息 */}
              {!hasGreeted && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    💡 正在載入小健...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
