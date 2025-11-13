import { ArrowLeft, Mic, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthDataScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
}

export function HealthDataScreen({ onNavigate, onEmergency, onVoiceInput }: HealthDataScreenProps) {
  const [activeTab, setActiveTab] = useState('blood-pressure');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');
  const [weight, setWeight] = useState('');
  const [heartRate, setHeartRate] = useState('');

  const bloodPressureData = [
    { day: '週一', systolic: 120, diastolic: 80 },
    { day: '週二', systolic: 125, diastolic: 82 },
    { day: '週三', systolic: 118, diastolic: 78 },
    { day: '週四', systolic: 122, diastolic: 81 },
    { day: '週五', systolic: 125, diastolic: 80 },
    { day: '週六', systolic: 120, diastolic: 79 },
    { day: '週日', systolic: 125, diastolic: 80 },
  ];

  const glucoseData = [
    { day: '週一', value: 5.6 },
    { day: '週二', value: 6.1 },
    { day: '週三', value: 5.8 },
    { day: '週四', value: 5.9 },
    { day: '週五', value: 6.0 },
    { day: '週六', value: 5.7 },
    { day: '週日', value: 5.8 },
  ];

  const weightData = [
    { day: '週一', value: 68.5 },
    { day: '週二', value: 68.3 },
    { day: '週三', value: 68.4 },
    { day: '週四', value: 68.2 },
    { day: '週五', value: 68.1 },
    { day: '週六', value: 68.0 },
    { day: '週日', value: 67.9 },
  ];

  const heartRateData = [
    { day: '週一', value: 72 },
    { day: '週二', value: 75 },
    { day: '週三', value: 70 },
    { day: '週四', value: 73 },
    { day: '週五', value: 74 },
    { day: '週六', value: 71 },
    { day: '週日', value: 72 },
  ];

  const tabs = [
    { id: 'blood-pressure', label: '血壓', color: 'bg-red-500' },
    { id: 'glucose', label: '血糖', color: 'bg-blue-500' },
    { id: 'weight', label: '體重', color: 'bg-green-500' },
    { id: 'heart-rate', label: '心率', color: 'bg-purple-500' },
  ];

  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('我可以幫您記錄數據或解讀趨勢');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAIClick = () => {
    if (isSpeaking) return;
    const msgs = [
      '需要我幫您記錄血壓、血糖、體重或心率嗎？',
      '我可以解釋趨勢變化，提供健康建議。',
      '保持定期記錄有助及早發現問題。'
    ];
    const m = msgs[Math.floor(Math.random() * msgs.length)];
    setAiEmotion('thinking');
    setCurrentMessage(m);
    setIsSpeaking(true);
    const u = new SpeechSynthesisUtterance(m);
    u.lang = 'zh-HK';
    u.rate = 0.8;
    u.volume = 0.8;
    u.onend = () => {
      setIsSpeaking(false);
      setCurrentMessage('我可以幫您記錄數據或解讀趨勢');
      setAiEmotion('happy');
    };
    window.speechSynthesis.speak(u);
  };

  const handleVoiceInput = () => {
    alert('請說出您的數據');
  };

  const handleSubmit = () => {
    alert('數據已記錄');
    setSystolic('');
    setDiastolic('');
    setGlucose('');
    setWeight('');
    setHeartRate('');
  };

  const getStatusColor = (value: number, type: string) => {
    if (type === 'systolic') {
      if (value < 120) return 'text-green-600';
      if (value < 140) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (type === 'glucose') {
      if (value < 5.6) return 'text-green-600';
      if (value < 7.0) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-green-600';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'blood-pressure':
        return (
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2>最近7天血壓趨勢</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" tick={{ fontSize: 16 }} />
                  <YAxis tick={{ fontSize: 16 }} />
                  <Tooltip contentStyle={{ fontSize: 16, padding: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="收縮壓"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="舒張壓"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="mb-6">記錄新數據</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-gray-700">收縮壓 (mmHg)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full px-6 py-6 border-4 border-gray-300 rounded-2xl focus:border-red-500 focus:outline-none bg-gray-50"
                    placeholder="例如: 120"
                  />
                </div>

                <div>
                  <label className="block mb-3 text-gray-700">舒張壓 (mmHg)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full px-6 py-6 border-4 border-gray-300 rounded-2xl focus:border-red-500 focus:outline-none bg-gray-50"
                    placeholder="例如: 80"
                  />
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                  <p className="text-gray-700">正常範圍：</p>
                  <p className="text-green-600">收縮壓 &lt; 120 mmHg</p>
                  <p className="text-green-600">舒張壓 &lt; 80 mmHg</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleVoiceInput}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Mic className="w-8 h-8" />
                    <span>語音輸入</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'glucose':
        return (
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2>最近7天血糖趨勢</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={glucoseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" tick={{ fontSize: 16 }} />
                  <YAxis tick={{ fontSize: 16 }} />
                  <Tooltip contentStyle={{ fontSize: 16, padding: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="血糖"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="mb-6">記錄新數據</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-gray-700">血糖 (mmol/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="w-full px-6 py-6 border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none bg-gray-50"
                    placeholder="例如: 5.6"
                  />
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                  <p className="text-gray-700">正常範圍（空腹）：</p>
                  <p className="text-green-600">3.9 - 5.6 mmol/L</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleVoiceInput}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Mic className="w-8 h-8" />
                    <span>語音輸入</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'weight':
        return (
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2>最近7天體重趨勢</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" tick={{ fontSize: 16 }} />
                  <YAxis tick={{ fontSize: 16 }} domain={[67, 69]} />
                  <Tooltip contentStyle={{ fontSize: 16, padding: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    name="體重"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="mb-6">記錄新數據</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-gray-700">體重 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-6 py-6 border-4 border-gray-300 rounded-2xl focus:border-green-500 focus:outline-none bg-gray-50"
                    placeholder="例如: 68.0"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleVoiceInput}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Mic className="w-8 h-8" />
                    <span>語音輸入</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'heart-rate':
        return (
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2>最近7天心率趨勢</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" tick={{ fontSize: 16 }} />
                  <YAxis tick={{ fontSize: 16 }} />
                  <Tooltip contentStyle={{ fontSize: 16, padding: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    name="心率"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="mb-6">記錄新數據</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-gray-700">心率 (次/分鐘)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-full px-6 py-6 border-4 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none bg-gray-50"
                    placeholder="例如: 72"
                  />
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                  <p className="text-gray-700">正常範圍（靜止）：</p>
                  <p className="text-green-600">60 - 100 次/分鐘</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleVoiceInput}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Mic className="w-8 h-8" />
                    <span>語音輸入</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105"
                  >
                    提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            <h1 className="text-blue-700">健康數據記錄</h1>
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
        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-8 py-6 rounded-2xl transition-all ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
