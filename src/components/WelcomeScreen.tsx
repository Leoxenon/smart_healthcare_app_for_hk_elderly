import { Fingerprint, Scan, UserPlus, Check, X } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { useState } from 'react';
import { speakText, stopAllAudio } from '../utils/audioManager';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onEmergency: () => void;
}

export function WelcomeScreen({ onLogin, onRegister, onEmergency }: WelcomeScreenProps) {
  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDetection, setShowDetection] = useState(false);
  const [detectionType, setDetectionType] = useState<'fingerprint' | 'face' | null>(null);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [detectionPassed, setDetectionPassed] = useState(false);

  const handleFingerprintLogin = () => {
    setDetectionType('fingerprint');
    setShowDetection(true);
    setDetectionProgress(0);
    setDetectionPassed(false);
    const timer = setInterval(() => {
      setDetectionProgress(prev => {
        const next = Math.min(100, prev + 10);
        if (next === 100) {
          clearInterval(timer);
          setDetectionPassed(true);
          setTimeout(() => {
            setShowDetection(false);
            onLogin();
          }, 800);
        }
        return next;
      });
    }, 150);
  };

  const handleFaceLogin = () => {
    setDetectionType('face');
    setShowDetection(true);
    setDetectionProgress(0);
    setDetectionPassed(false);
    const timer = setInterval(() => {
      setDetectionProgress(prev => {
        const next = Math.min(100, prev + 12);
        if (next === 100) {
          clearInterval(timer);
          setDetectionPassed(true);
          setTimeout(() => {
            setShowDetection(false);
            onLogin();
          }, 800);
        }
        return next;
      });
    }, 140);
  };

  // AI吉祥物点击交互
  const handleAIClick = () => {
    // 如果正在播放语音，点击停止
    if (isSpeaking) {
      stopAllAudio();
      setIsSpeaking(false);
      setCurrentMessage('');
      setAiEmotion('happy');
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
    setAiEmotion('talking'); // 说话时使用蓝色
    setCurrentMessage(randomMessage);
    
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          {/* SOS按钮 - 移到AI吉祥物正上方 */}
          <div className="mb-4 relative z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('WelcomeScreen SOS button clicked!');
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

      {showDetection && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-green-700">{detectionType === 'fingerprint' ? '指紋識別' : '人臉識別'}</h2>
              <button onClick={() => setShowDetection(false)} className="p-2 hover:bg-gray-100 rounded-xl" aria-label="關閉">
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className={`rounded-full p-6 ${detectionPassed ? 'bg-green-100' : 'bg-blue-100'} shadow-inner`}>
                {detectionType === 'fingerprint' ? (
                  <Fingerprint className={`w-10 h-10 ${detectionPassed ? 'text-green-600' : 'text-blue-600'}`} />
                ) : (
                  <Scan className={`w-10 h-10 ${detectionPassed ? 'text-green-600' : 'text-blue-600'}`} />
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${detectionProgress}%` }}></div>
              </div>
              <div className="text-gray-700">
                {detectionPassed ? '驗證通過' : '正在檢測...'}
              </div>
              {detectionPassed && (
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-6 h-6" />
                  <span>可以登入</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
