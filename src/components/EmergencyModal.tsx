import { AlertTriangle, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmergencyModalProps {
  onClose: () => void;
  onConfirm?: () => void;
}

export function EmergencyModal({ onClose, onConfirm }: EmergencyModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (isCancelled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger emergency call
          handleConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCancelled]);

  useEffect(() => {
    // Play voice alert
    const utterance = new SpeechSynthesisUtterance(
      '已啟動緊急求助，將立即聯繫您的家屬和醫療機構。如需取消，請點擊取消按鈕。'
    );
    utterance.lang = 'zh-HK';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleConfirm = () => {
    // Trigger rescue visualization
    if (onConfirm) {
      onConfirm();
    } else {
      alert('正在聯繫緊急聯繫人...\n- 陳醫生\n- 李女士（女兒）\n- 張先生（兒子）');
      onClose();
    }
  };

  const handleCancel = () => {
    setIsCancelled(true);
    window.speechSynthesis.cancel();
    onClose();
  };

  const emergencyContacts = [
    { name: '陳醫生', relationship: '家庭醫生', avatar: '👨‍⚕️' },
    { name: '李女士', relationship: '女兒', avatar: '👩' },
    { name: '張先生', relationship: '兒子', avatar: '👨' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
      <div className="bg-red-600 rounded-3xl shadow-2xl max-w-3xl w-full p-8 animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-16 h-16 text-white" />
            <h1 className="text-white">緊急求助</h1>
          </div>
          <button
            onClick={handleCancel}
            className="p-4 hover:bg-red-700 rounded-2xl transition-all"
            aria-label="關閉"
          >
            <X className="w-10 h-10 text-white" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-12 mb-8">
          <div className="text-center mb-8">
            <div className="bg-red-100 rounded-full w-40 h-40 mx-auto flex items-center justify-center mb-6">
              <span className="text-red-600" style={{ fontSize: '80px' }}>
                {countdown}
              </span>
            </div>
            <p className="text-gray-800 mb-4">
              倒計時 {countdown} 秒後自動發送求助
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 py-8 mb-4 transition-all hover:scale-105 flex items-center justify-center gap-4 shadow-lg"
          >
            <AlertTriangle className="w-12 h-12" />
            <span>SOS - 點擊確認求助</span>
          </button>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">將要聯繫的人員：</p>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 flex items-center gap-4"
                >
                  <span className="text-4xl">{contact.avatar}</span>
                  <div className="flex-1">
                    <p className="text-gray-800">{contact.name}</p>
                    <p className="text-gray-600">{contact.relationship}</p>
                  </div>
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl px-8 py-6 transition-all hover:scale-105"
          >
            取消求助
          </button>
        </div>

        <div className="bg-red-700 rounded-2xl p-6 text-center">
          <p className="text-white">
            ⚠️ 如果這是誤觸，請立即點擊取消按鈕
          </p>
        </div>
      </div>
    </div>
  );
}
