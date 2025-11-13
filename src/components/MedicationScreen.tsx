import { ArrowLeft, Plus, Check, Clock, Mic, Settings } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { VoiceButton } from './VoiceButton';
import { useState } from 'react';

interface MedicationScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
}

export function MedicationScreen({ onNavigate, onEmergency, onVoiceInput }: MedicationScreenProps) {
  const [medications, setMedications] = useState([
    {
      id: 1,
      time: '08:00',
      name: '降血壓藥',
      dosage: '1粒',
      taken: true,
      image: '💊',
      instructions: '飯後服用，配溫水',
      voiceText: '早上八點：降血壓藥，一粒，飯後服用，配溫水。',
    },
    {
      id: 2,
      time: '12:00',
      name: '降血糖藥',
      dosage: '2粒',
      taken: false,
      image: '💊',
      instructions: '午餐前30分鐘服用',
      voiceText: '中午十二點：降血糖藥，兩粒，午餐前三十分鐘服用。',
    },
    {
      id: 3,
      time: '18:00',
      name: '心臟藥',
      dosage: '1粒',
      taken: false,
      image: '💊',
      instructions: '晚餐後服用',
      voiceText: '晚上六點：心臟藥，一粒，晚餐後服用。',
    },
    {
      id: 4,
      time: '21:00',
      name: '安眠藥',
      dosage: '半粒',
      taken: false,
      image: '💊',
      instructions: '睡前服用',
      voiceText: '晚上九點：安眠藥，半粒，睡前服用。',
    },
  ]);

  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('我可以幫您按時用藥，點我獲取提示');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTaken = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: true } : med
    ));
  };

  const handleRemindLater = (id: number) => {
    // Mock remind later functionality
    alert('將在15分鐘後再次提醒您');
  };

  const handleAIClick = () => {
    if (isSpeaking) return;
    const msgs = [
      '記得按時服用藥物，有需要我可以提醒您。',
      '下一次用藥時間要留意，我可以幫您播報。',
      '用藥要配合醫生建議，如有不適請聯絡醫生。'
    ];
    const m = msgs[Math.floor(Math.random() * msgs.length)];
    setAiEmotion('caring');
    setCurrentMessage(m);
    setIsSpeaking(true);
    const u = new SpeechSynthesisUtterance(m);
    u.lang = 'zh-HK';
    u.rate = 0.8;
    u.volume = 0.8;
    u.onend = () => {
      setIsSpeaking(false);
      setCurrentMessage('我可以幫您按時用藥，點我獲取提示');
      setAiEmotion('happy');
    };
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
              aria-label="返回"
            >
              <ArrowLeft className="w-8 h-8 text-gray-700" />
            </button>
            <h1 className="text-green-700">今天的用藥</h1>
          </div>
          {/* 设置按钮 - 替换原来的语音按钮 */}
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

      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-4 border-purple-100">
          <div className="flex flex-col items-center text-center">
            {/* 紧急求助按钮 - 移到AI角色正上方 */}
            <div className="mb-4 relative z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('SOS button clicked!');
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

            <div className="mb-8 cursor-pointer" onClick={handleAIClick}>
              <AICharacter emotion={aiEmotion} isAnimating={false} size="large" message={currentMessage} />
            </div>
            
            {/* 占位空间 - 为语句气泡留出空间 */}
            <div className="mb-6"></div>
            
            <button
              onClick={() => typeof onVoiceInput === 'function' && onVoiceInput()}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
              aria-label="語音輸入"
            >
              <Mic className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`bg-white rounded-3xl shadow-lg p-8 border-4 ${
                med.taken ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{med.image}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <span className="text-blue-600">{med.time}</span>
                    </div>
                    <h2 className="mb-2">{med.name}</h2>
                    <p className="text-gray-600">用量：{med.dosage}</p>
                    <p className="text-gray-600">{med.instructions}</p>
                  </div>
                </div>
                <VoiceButton text={med.voiceText} />
              </div>

              {med.taken ? (
                <div className="bg-green-100 border-2 border-green-400 rounded-2xl px-8 py-6 flex items-center justify-center gap-3">
                  <Check className="w-8 h-8 text-green-700" />
                  <span className="text-green-700">已服用</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTaken(med.id)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Check className="w-8 h-8" />
                    <span>已服用</span>
                  </button>
                  <button
                    onClick={() => handleRemindLater(med.id)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Clock className="w-8 h-8" />
                    <span>稍後提醒</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => alert('添加新用藥')}
          className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-8 transition-all hover:scale-105 flex items-center justify-center gap-4 shadow-lg"
        >
          <Plus className="w-10 h-10" />
          <span>添加用藥</span>
        </button>
      </div>
    </div>
  );
}
