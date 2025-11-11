import { Heart, Fingerprint, Scan, UserPlus } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onEmergency: () => void;
}

export function WelcomeScreen({ onLogin, onRegister, onEmergency }: WelcomeScreenProps) {
  const handleFingerprintLogin = () => {
    // Mock fingerprint login
    onLogin();
  };

  const handleFaceLogin = () => {
    // Mock face recognition login
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <VoiceButton 
          text="歡迎使用健康伴侶應用，為幫助老年人管理慢性疾病而設計。請使用指紋或人臉識別登錄。" 
          size="large"
        />
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-green-500 rounded-full p-8 mb-6">
            <Heart className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-center text-green-700 mb-4">健康伴侶</h1>
          <p className="text-center text-gray-600">您的智能健康管理助手</p>
        </div>

        <div className="space-y-6">
          <p className="text-center text-gray-700 mb-8">請選擇登錄方式</p>
          
          <button
            onClick={handleFingerprintLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-3xl px-8 py-12 transition-all hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-6"
          >
            <Fingerprint className="w-20 h-20" />
            <span>指紋識別</span>
          </button>

          <button
            onClick={handleFaceLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-3xl px-8 py-12 transition-all hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-6"
          >
            <Scan className="w-20 h-20" />
            <span>人臉識別</span>
          </button>

          {/* 分隔線 */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <span className="text-gray-500">或</span>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
          </div>

          {/* 新用戶注冊 */}
          <button
            onClick={onRegister}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-3xl px-8 py-12 transition-all hover:scale-105 shadow-lg flex flex-col items-center justify-center gap-6"
          >
            <UserPlus className="w-20 h-20" />
            <span>新用戶注冊</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            首次使用？請先注冊以建立您的健康檔案，讓AI為您提供個性化的健康建議。
          </p>
        </div>
      </div>

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
