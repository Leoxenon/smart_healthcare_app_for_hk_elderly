import { Mic, X, Check, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VoiceListeningModalProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

export function VoiceListeningModal({ onClose, onCommand }: VoiceListeningModalProps) {
  const [isListening, setIsListening] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock voice commands in Cantonese
  const mockCommands = [
    '開啟用藥提醒',
    '記錄血壓',
    '查看健康知識',
    '打電話畀醫生',
    '緊急求助',
    '查看菜譜',
    '睇下風險預測',
  ];

  useEffect(() => {
    if (isListening) {
      // Play listening sound
      const utterance = new SpeechSynthesisUtterance('正在聆聽您嘅指令，請講嘢');
      utterance.lang = 'zh-HK';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);

      // Mock voice recognition after 2 seconds
      const timer = setTimeout(() => {
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        setRecognizedText(randomCommand);
        setShowConfirmation(true);
        setIsListening(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isListening]);

  const handleConfirm = () => {
    onCommand(recognizedText);
    onClose();
  };

  const handleRetry = () => {
    setRecognizedText('');
    setShowConfirmation(false);
    setIsListening(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full max-w-4xl p-8 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`bg-purple-500 rounded-full p-4 ${isListening ? 'animate-pulse' : ''}`}>
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-purple-700">
              {isListening ? '正在聆聽...' : '識別完成'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
            aria-label="關閉"
          >
            <X className="w-8 h-8 text-gray-700" />
          </button>
        </div>

        {isListening && (
          <div className="text-center py-12">
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-3 h-12 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-16 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-20 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-16 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-3 h-12 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-gray-700">請用粵語講出您嘅指令</p>
            <p className="text-gray-500 mt-3">例如：「開啟用藥提醒」、「記錄血壓」</p>
          </div>
        )}

        {showConfirmation && (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-3xl p-8 border-4 border-purple-300">
              <p className="text-gray-700 mb-3">您講嘅係：</p>
              <p className="text-purple-700">{recognizedText}</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-300">
              <p className="text-gray-700">
                ℹ️ 請確認指令係咪正確？如果唔正確，可以重新講過。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleConfirm}
                className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Check className="w-8 h-8" />
                <span>確認</span>
              </button>

              <button
                onClick={handleRetry}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-8 h-8" />
                <span>重新講過</span>
              </button>

              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <X className="w-8 h-8" />
                <span>取消</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
