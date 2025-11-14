import { Mic, X, Check, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { speakText } from '../utils/audioManager';

interface VoiceListeningModalProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

export function VoiceListeningModal({ onClose, onCommand }: VoiceListeningModalProps) {
  const { settings } = useSettings();
  const [isListening, setIsListening] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentLangIndex, setCurrentLangIndex] = useState(0);

  // 支持的语言列表 - 按优先级排序
  const supportedLanguages = [
    { code: 'zh-HK', name: '粵語' },
    { code: 'zh-CN', name: '普通話' },
    { code: 'en-US', name: 'English' }
  ];

  useEffect(() => {
    if (!isListening) return;

    const userLang = settings.language === 'mandarin' ? 'zh-CN' : settings.language === 'english' ? 'en-US' : 'zh-HK';
    const orderedLangs = [userLang, ...supportedLanguages.map(l => l.code).filter(l => l !== userLang)];
    const recogLang = orderedLangs[currentLangIndex];
    const promptText = recogLang === 'en-US' ? 'Listening in multiple languages, please speak' : recogLang === 'zh-CN' ? '正在聆听，支持粤语、普通话和英文' : '正在聆聽，支援粵語、普通話同英文';

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(false);
      setShowConfirmation(true);
      setRecognizedText('');
      return;
    }

    const startRecognition = () => {
      const recognition = new SpeechRecognition();
      recognition.lang = recogLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript as string;
        const confidence = event.results[0][0].confidence;
        const t = (transcript || '').toLowerCase();
        const isPromptPhrase = t.includes('正在聆') || t.includes('listening');
        console.log(`Recognized in ${recogLang}: "${transcript}" (confidence: ${confidence})`);
        if (isPromptPhrase) {
          return;
        }
        if (confidence > 0.5 || currentLangIndex >= orderedLangs.length - 1) {
          setRecognizedText(transcript);
          setShowConfirmation(true);
          setIsListening(false);
        } else {
          setCurrentLangIndex(prev => prev + 1);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error, 'in', recogLang);
        if (event.error === 'no-speech' && currentLangIndex < orderedLangs.length - 1) {
          setCurrentLangIndex(prev => prev + 1);
        } else {
          setIsListening(false);
          setShowConfirmation(true);
          if (event.error === 'no-speech') {
            setRecognizedText('未能識別到語音，請重試');
          } else if (event.error === 'network') {
            setRecognizedText('網絡錯誤，請檢查網絡連接');
          } else {
            setRecognizedText('語音識別失敗，請重試');
          }
        }
      };

      recognition.onend = () => {
        if (currentLangIndex < orderedLangs.length - 1 && !showConfirmation) {
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      return recognition;
    };

    let recognitionInstance: any;
    if (currentLangIndex === 0) {
      speakText(promptText, { lang: recogLang, rate: 0.9, volume: 0.8 }).then(() => {
        recognitionInstance = startRecognition();
      });
    } else {
      recognitionInstance = startRecognition();
    }

    return () => {
      try { recognitionInstance?.stop?.(); } catch {}
    };
  }, [isListening, currentLangIndex]);

  const handleConfirm = () => {
    onCommand(recognizedText);
    onClose();
  };

  const handleRetry = () => {
    setRecognizedText('');
    setShowConfirmation(false);
    setCurrentLangIndex(0); // 重置语言索引
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
              {settings.language === 'english' ? 'Speak in Cantonese, Mandarin, or English' : settings.language === 'mandarin' ? '请用粤语、普通话或英文说出指令' : '請用粵語、普通話或英文講出指令'}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {settings.language === 'english' ? '🌐 Multi-language support enabled' : settings.language === 'mandarin' ? '🌐 已启用多语言识别' : '🌐 已啟用多語言識別'}
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 mt-6 text-left">
              <p className="text-gray-700 font-semibold mb-3">
                {settings.language === 'english' ? '📢 Available Commands (Any Language):' : settings.language === 'mandarin' ? '📢 可用指令（任何语言）：' : '📢 可用指令（任何語言）：'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 text-sm">
                <p>• 今日用藥 / 用药 / Medication</p>
                <p>• 健康數據 / 健康数据 / Health Data</p>
                <p>• 健康知識 / 知识 / Knowledge</p>
                <p>• 聯絡醫生 / 联系医生 / Contact Doctor</p>
                <p>• AI菜譜 / 食谱 / Recipe</p>
                <p>• 風險預測 / 风险预测 / Risk Prediction</p>
                <p>• 設置 / 设置 / Settings</p>
                <p>• 緊急求助 / 紧急求助 / Emergency</p>
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
