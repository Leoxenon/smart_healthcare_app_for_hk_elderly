import { ArrowLeft, TrendingUp, Target, Plus, Mic } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { VoiceButton } from './VoiceButton';
import { useState } from 'react';
import { Progress } from './ui/progress';
import { speakText, stopAllAudio } from '../utils/audioManager';

interface ActivityScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
}

export function ActivityScreen({ onNavigate, onEmergency, onVoiceInput }: ActivityScreenProps) {
  const [todaySteps] = useState(6543);
  const [weeklyGoal] = useState(50000);
  const [weeklySteps] = useState(35420);
  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('我可以陪您運動並給予鼓勵');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const weekData = [
    { day: '週一', steps: 5200 },
    { day: '週二', steps: 6800 },
    { day: '週三', steps: 4500 },
    { day: '週四', steps: 5900 },
    { day: '週五', steps: 6500 },
    { day: '週六', steps: 6520 },
    { day: '週日', steps: 0 },
  ];

  const progress = (weeklySteps / weeklyGoal) * 100;

  const handleAddActivity = () => {
    alert('記錄運動活動');
  };

  const handleAIClick = () => {
    if (isSpeaking) {
      stopAllAudio();
      setIsSpeaking(false);
      setCurrentMessage('我可以陪您運動並給予鼓勵');
      setAiEmotion('happy');
      return;
    }
    
    const msgs = [
      '今日加油！步行三十分鐘對心臟好有幫助。',
      '要不要我幫您設定一個小目標？',
      '保持運動可降低風險，您做得到！'
    ];
    const m = msgs[Math.floor(Math.random() * msgs.length)];
    setAiEmotion('talking'); // 说话时使用蓝色
    setCurrentMessage(m);
    
    speakText(m, {
      lang: 'zh-HK',
      rate: 0.8,
      volume: 0.8,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentMessage('我可以陪您運動並給予鼓勵');
        setAiEmotion('happy');
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentMessage('我可以陪您運動並給予鼓勵');
        setAiEmotion('happy');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">{/* 去掉pb-24底部padding */}
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
            <h1 className="text-green-700">運動跟蹤</h1>
          </div>
          <VoiceButton 
            text="運動跟蹤頁面。查看您的每日步數和運動記錄，保持活躍有助於健康。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
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
        {/* Today's Steps */}
        <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl shadow-2xl p-12 text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white">今日步數</h2>
            <VoiceButton text={`今日步數：${todaySteps.toLocaleString()}步。`} />
          </div>
          
          <div className="text-center">
            <div className="inline-block bg-white bg-opacity-20 rounded-full p-12 mb-6">
              <TrendingUp className="w-24 h-24" />
            </div>
            <div className="mb-4">
              <span className="text-white">{todaySteps.toLocaleString()}</span>
            </div>
            <p className="text-white text-opacity-90">步</p>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 rounded-full p-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2>本週目標</h2>
                <p className="text-gray-600">
                  {weeklySteps.toLocaleString()} / {weeklyGoal.toLocaleString()} 步
                </p>
              </div>
            </div>
            <VoiceButton text={`本週目標進度：已完成${weeklySteps.toLocaleString()}步，目標${weeklyGoal.toLocaleString()}步，完成率${Math.round(progress)}%。`} />
          </div>

          <div className="mb-6">
            <Progress value={progress} className="h-6" />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-blue-700">
              {progress >= 100
                ? '🎉 恭喜！您已達成本週目標！'
                : `還需 ${(weeklyGoal - weeklySteps).toLocaleString()} 步即可達成目標`}
            </p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2>本週記錄</h2>
            <VoiceButton text="本週每日步數記錄柱狀圖。" />
          </div>

          <div className="space-y-4">
            {weekData.map((day) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-20">
                  <span className="text-gray-700">{day.day}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-10 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full flex items-center justify-end pr-4 transition-all"
                      style={{ width: `${(day.steps / 10000) * 100}%` }}
                    >
                      {day.steps > 0 && (
                        <span className="text-white">{day.steps.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-yellow-50 border-4 border-yellow-200 rounded-3xl p-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl">💪</div>
            <div className="flex-1">
              <h2 className="text-yellow-800 mb-3">健康小貼士</h2>
              <p className="text-gray-700 mb-4">
                每天步行30分鐘可以：降低心臟病風險、改善血糖控制、增強骨骼健康、提升心情。繼續保持！
              </p>
              <VoiceButton text="健康小貼士：每天步行三十分鐘可以降低心臟病風險、改善血糖控制、增強骨骼健康、提升心情。繼續保持！" />
            </div>
          </div>
        </div>

        {/* Add Activity Button */}
        <button
          onClick={handleAddActivity}
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-8 transition-all hover:scale-105 flex items-center justify-center gap-4 shadow-lg"
        >
          <Plus className="w-10 h-10" />
          <span>記錄運動</span>
        </button>
      </div>
    </div>
  );
}
