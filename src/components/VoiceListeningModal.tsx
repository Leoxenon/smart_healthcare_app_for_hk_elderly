import { Mic, X, Check, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface VoiceListeningModalProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

export function VoiceListeningModal({ onClose, onCommand }: VoiceListeningModalProps) {
  const { settings } = useSettings();
  const [isListening, setIsListening] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!isListening) return;

    const recogLang = settings.language === 'mandarin' ? 'zh-CN' : settings.language === 'english' ? 'en-US' : 'zh-HK';
    const promptText = recogLang === 'en-US' ? 'Listening, please speak' : recogLang === 'zh-CN' ? '正在聆听您的指令，请讲话' : '正在聆聽您嘅指令，請講嘢';

    const utterance = new SpeechSynthesisUtterance(promptText);
    utterance.lang = recogLang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = recogLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript as string;
        setRecognizedText(transcript);
        setShowConfirmation(true);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setShowConfirmation(true);
        // 根据错误类型设置不同的提示
        if (event.error === 'no-speech') {
          setRecognizedText('未能識別到語音，請重試');
        } else if (event.error === 'network') {
          setRecognizedText('網絡錯誤，請檢查網絡連接');
        } else {
          setRecognizedText('語音識別失敗，請重試');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      return () => {
        recognition.stop?.();
      };
    } else {
      setIsListening(false);
      setShowConfirmation(true);
      setRecognizedText('');
    }
  }, [isListening, settings.language]);

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
            <p className="text-gray-700 text-xl mb-4">
              {settings.language === 'english' ? 'Please say your command' : settings.language === 'mandarin' ? '請說出您的指令' : '請用粵語講出您嘅指令'}
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 mt-6 text-left">
              <p className="text-gray-700 font-semibold mb-3">
                {settings.language === 'english' ? '📢 Available Commands:' : settings.language === 'mandarin' ? '📢 可用指令：' : '📢 可用指令：'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                {settings.language === 'english' ? (
                  <>
                    <p>• "Open medication"</p>
                    <p>• "Health data"</p>
                    <p>• "Knowledge base"</p>
                    <p>• "Contact doctor"</p>
                    <p>• "Recipe"</p>
                    <p>• "Risk prediction"</p>
                    <p>• "Settings"</p>
                    <p>• "Emergency help"</p>
                  </>
                ) : settings.language === 'mandarin' ? (
                  <>
                    <p>• 「开启用药提醒」</p>
                    <p>• 「健康数据」</p>
                    <p>• 「知识库」</p>
                    <p>• 「联系医生」</p>
                    <p>• 「食谱」</p>
                    <p>• 「风险预测」</p>
                    <p>• 「设置」</p>
                    <p>• 「紧急求助」</p>
                  </>
                ) : (
                  <>
                    <p>• 「今日用藥」</p>
                    <p>• 「健康數據」</p>
                    <p>• 「健康知識」</p>
                    <p>• 「聯絡醫生」</p>
                    <p>• 「AI菜譜」</p>
                    <p>• 「AI風險預測」</p>
                    <p>• 「設置」</p>
                    <p>• 「緊急求助」</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-3xl p-8 border-4 border-purple-300">
              <p className="text-gray-700 mb-3 text-xl">
                {settings.language === 'english' ? 'You said:' : settings.language === 'mandarin' ? '您说的是：' : '您講嘅係：'}
              </p>
              <p className="text-purple-700 text-2xl font-semibold">{recognizedText || (settings.language === 'english' ? 'No speech detected' : settings.language === 'mandarin' ? '未能识别语音' : '未能識別到語音')}</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-300">
              <p className="text-gray-700 text-lg">
                {settings.language === 'english' ? 'ℹ️ Please confirm if the command is correct. If not, you can try again.' : settings.language === 'mandarin' ? 'ℹ️ 请确认指令是否正确？如果不正确，可以重新说一次。' : 'ℹ️ 請確認指令係咪正確？如果唔正確，可以重新講過。'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleConfirm}
                disabled={!recognizedText || recognizedText.includes('未能識別') || recognizedText.includes('未能识别') || recognizedText.includes('失敗') || recognizedText.includes('失败') || recognizedText.includes('錯誤') || recognizedText.includes('错误')}
                className={`${!recognizedText || recognizedText.includes('未能識別') || recognizedText.includes('未能识别') || recognizedText.includes('失敗') || recognizedText.includes('失败') || recognizedText.includes('錯誤') || recognizedText.includes('错误') ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3`}
              >
                <Check className="w-8 h-8" />
                <span>{settings.language === 'english' ? 'Confirm' : settings.language === 'mandarin' ? '确认' : '確認'}</span>
              </button>

              <button
                onClick={handleRetry}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-8 h-8" />
                <span>{settings.language === 'english' ? 'Try Again' : settings.language === 'mandarin' ? '重新说一次' : '重新講過'}</span>
              </button>

              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <X className="w-8 h-8" />
                <span>{settings.language === 'english' ? 'Cancel' : settings.language === 'mandarin' ? '取消' : '取消'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
