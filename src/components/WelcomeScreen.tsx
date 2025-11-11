import { Fingerprint, Scan, UserPlus } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { useState } from 'react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onEmergency: () => void;
}

export function WelcomeScreen({ onLogin, onRegister, onEmergency }: WelcomeScreenProps) {
  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFingerprintLogin = () => {
    // Mock fingerprint login
    onLogin();
  };

  const handleFaceLogin = () => {
    // Mock face recognition login
    onLogin();
  };

  // AI吉祥物点击交互
  const handleAIClick = () => {
    // 如果正在播放语音，忽略点击
    if (isSpeaking) {
      return;
    }

    const welcomeGreetings = [
      '您好！歡迎使用健康伴侶應用！',
      '早晨！我係小健，您嘅健康助手！',
      '歡迎回嚟！準備好管理您嘅健康啦！',
      '您好呀！我會幫您照顧身體健康！',
      '歡迎使用智能健康管理應用！'
    ];
    
    const randomMessage = welcomeGreetings[Math.floor(Math.random() * welcomeGreetings.length)];
    setAiEmotion('caring');
    setCurrentMessage(randomMessage);
    setIsSpeaking(true);
    
    // 播放粤语语音问候
    const utterance = new SpeechSynthesisUtterance(randomMessage);
    utterance.lang = 'zh-HK';
    utterance.rate = 0.8;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentMessage('');
      setAiEmotion('happy');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          {/* SOS按钮 - 移到AI吉祥物正上方 */}
          <div className="mb-4">
            <button
              onClick={onEmergency}
              className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-6 py-3 shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              aria-label="緊急求助"
            >
              <span className="text-lg">🆘</span>
              <span className="font-bold">緊急求助</span>
            </button>
          </div>

          {/* AI吉祥物头像 - 替换心形图标 */}
          <div className="mb-6 cursor-pointer" onClick={handleAIClick}>
            <AICharacter 
              emotion={aiEmotion}
              isAnimating={isSpeaking}
              size="large"
              message={currentMessage}
            />
          </div>
          
          <h1 className="text-center text-green-700 mb-2">您好！</h1>
          <h2 className="text-center text-green-700 mb-4">歡迎回來</h2>
          <p className="text-center text-gray-600">您的智能健康管理助手</p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-700 mb-6">請選擇登錄方式</p>
          
          {/* 扁平化按钮设计 */}
          <button
            onClick={handleFingerprintLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-6 transition-all hover:scale-105 shadow-md flex items-center justify-center gap-4"
          >
            <Fingerprint className="w-8 h-8" />
            <span className="text-lg font-medium">指紋識別</span>
          </button>

          <button
            onClick={handleFaceLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl px-6 py-6 transition-all hover:scale-105 shadow-md flex items-center justify-center gap-4"
          >
            <Scan className="w-8 h-8" />
            <span className="text-lg font-medium">人臉識別</span>
          </button>

          {/* 分隔線 */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <span className="text-gray-500">或</span>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
          </div>

          {/* 新用戶注冊 - 扁平化设计 */}
          <button
            onClick={onRegister}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-2xl px-6 py-6 transition-all hover:scale-105 shadow-md flex items-center justify-center gap-4"
          >
            <UserPlus className="w-8 h-8" />
            <span className="text-lg font-medium">新用戶注冊</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            首次使用？請先注冊以建立您的健康檔案，讓AI為您提供個性化的健康建議。
          </p>
        </div>
      </div>
    </div>
  );
}
