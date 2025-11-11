import { Heart, Fingerprint, Scan } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';

interface WelcomeScreenProps {
  onLogin: () => void;
  onEmergency: () => void;
}

export function WelcomeScreen({ onLogin, onEmergency }: WelcomeScreenProps) {
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
        </div>
      </div>

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
