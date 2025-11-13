import { ArrowLeft, TrendingUp, AlertTriangle, Heart, Activity, CheckCircle, Calendar, Phone, Mic } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface RiskPredictionScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
}

export function RiskPredictionScreen({ onNavigate, onEmergency, onVoiceInput }: RiskPredictionScreenProps) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('我可以解釋風險並提供行動建議');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mock risk trend data
  const riskTrendData = [
    { date: '11/4', cardiovascular: 45, stroke: 38, diabetes: 25 },
    { date: '11/5', cardiovascular: 48, stroke: 40, diabetes: 28 },
    { date: '11/6', cardiovascular: 52, stroke: 43, diabetes: 30 },
    { date: '11/7', cardiovascular: 55, stroke: 45, diabetes: 32 },
    { date: '11/8', cardiovascular: 58, stroke: 48, diabetes: 35 },
    { date: '11/9', cardiovascular: 62, stroke: 52, diabetes: 38 },
    { date: '11/10', cardiovascular: 65, stroke: 55, diabetes: 40 },
  ];

  // Current risk level
  const currentRisk = {
    cardiovascular: 65, // High
    stroke: 55, // Medium-High
    diabetes: 40, // Medium
    overall: 62, // High
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: '高危', color: 'red', bgColor: 'bg-red-500' };
    if (score >= 50) return { level: '中高危', color: 'orange', bgColor: 'bg-orange-500' };
    if (score >= 30) return { level: '中危', color: 'yellow', bgColor: 'bg-yellow-500' };
    return { level: '低危', color: 'green', bgColor: 'bg-green-500' };
  };

  const handleAIClick = () => {
    if (isSpeaking) return;
    const msgs = [
      '我可以用簡單方式解釋當前風險。',
      '需要我幫您制定運動、飲食或監測計劃嗎？',
      '有疑問可隨時問我，或者聯絡醫生。'
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
      setCurrentMessage('我可以解釋風險並提供行動建議');
      setAiEmotion('happy');
    };
    window.speechSynthesis.speak(u);
  };

  const recommendations = [
    {
      id: 1,
      icon: Activity,
      title: '增加運動量',
      description: '每日步行30分鐘，有助降低心血管風險',
      priority: 'high',
      action: 'exercise',
    },
    {
      id: 2,
      icon: Heart,
      title: '控制血壓',
      description: '建議每日早晚測量血壓，保持記錄',
      priority: 'high',
      action: 'monitor',
    },
    {
      id: 3,
      icon: Calendar,
      title: '定期體檢',
      description: '建議2週內預約心臟科醫生進行詳細檢查',
      priority: 'medium',
      action: 'appointment',
    },
    {
      id: 4,
      icon: CheckCircle,
      title: '飲食調整',
      description: '減少鹽分攝入，每日少於5克',
      priority: 'medium',
      action: 'diet',
    },
  ];

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    setShowActionModal(true);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'exercise':
        onNavigate('activity');
        break;
      case 'monitor':
        onNavigate('health-data');
        break;
      case 'appointment':
        onNavigate('contacts');
        break;
      case 'diet':
        onNavigate('recipe');
        break;
    }
    setShowActionModal(false);
  };

  const overallRisk = getRiskLevel(currentRisk.overall);

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
            <h1 className="text-red-700">AI健康風險預測</h1>
          </div>
          <VoiceButton 
            text="AI健康風險預測頁面。根據您嘅健康數據，分析心腦血管疾病風險，並提供個人化預防建議。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-4 border-purple-100">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 cursor-pointer" onClick={handleAIClick}>
              <AICharacter emotion={aiEmotion} isAnimating={false} size="large" message={currentMessage} />
            </div>
            <button
              onClick={() => typeof onVoiceInput === 'function' && onVoiceInput()}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
              aria-label="語音輸入"
            >
              <Mic className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Risk Alert Banner */}
        {currentRisk.overall >= 60 && (
          <div className="bg-red-500 rounded-3xl shadow-lg p-8 mb-6 text-white animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="w-12 h-12" />
              <h2 className="text-white">健康警告</h2>
            </div>
            <p className="mb-4">您嘅心血管疾病風險較高，建議盡快採取預防措施並諮詢醫生。</p>
            <button
              onClick={() => onNavigate('contacts')}
              className="bg-white text-red-600 hover:bg-gray-100 rounded-2xl px-8 py-4 transition-all hover:scale-105 shadow-lg flex items-center gap-3"
            >
              <Phone className="w-6 h-6" />
              <span>立即聯繫醫生</span>
            </button>
          </div>
        )}

        {/* Overall Risk Gauge */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <h2 className="text-gray-800 mb-6">今日綜合風險等級</h2>
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-64 h-64">
              {/* Circular gauge */}
              <svg className="transform -rotate-90 w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke={overallRisk.color === 'red' ? '#EF4444' : overallRisk.color === 'orange' ? '#F97316' : overallRisk.color === 'yellow' ? '#EAB308' : '#22C55E'}
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={`${(currentRisk.overall / 100) * 754} 754`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-gray-800" style={{ fontSize: '48px' }}>
                  {currentRisk.overall}%
                </span>
                <span className={`text-${overallRisk.color}-600 mt-2`}>
                  {overallRisk.level}
                </span>
              </div>
            </div>
          </div>

          {/* Individual Risk Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-8 h-8 text-red-600" />
                <p className="text-gray-700">心血管疾病</p>
              </div>
              <p className="text-red-600">{currentRisk.cardiovascular}% - {getRiskLevel(currentRisk.cardiovascular).level}</p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-8 h-8 text-orange-600" />
                <p className="text-gray-700">中風風險</p>
              </div>
              <p className="text-orange-600">{currentRisk.stroke}% - {getRiskLevel(currentRisk.stroke).level}</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
                <p className="text-gray-700">糖尿病併發症</p>
              </div>
              <p className="text-yellow-600">{currentRisk.diabetes}% - {getRiskLevel(currentRisk.diabetes).level}</p>
            </div>
          </div>
        </div>

        {/* Risk Trend Chart */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <h2 className="text-gray-800 mb-6">過去7日風險趨勢</h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: '14px' }} />
              <YAxis style={{ fontSize: '14px' }} />
              <Tooltip contentStyle={{ fontSize: '16px' }} />
              <Legend wrapperStyle={{ fontSize: '16px' }} />
              <Line 
                type="monotone" 
                dataKey="cardiovascular" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="心血管疾病" 
              />
              <Line 
                type="monotone" 
                dataKey="stroke" 
                stroke="#F97316" 
                strokeWidth={3}
                name="中風風險" 
              />
              <Line 
                type="monotone" 
                dataKey="diabetes" 
                stroke="#EAB308" 
                strokeWidth={3}
                name="糖尿病併發症" 
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="bg-blue-50 rounded-2xl p-6 mt-6">
            <p className="text-gray-700">
              <TrendingUp className="inline w-6 h-6 text-red-600 mr-2" />
              AI分析：過去7日您嘅風險指數持續上升，可能同最近血壓偏高、運動量減少有關。
            </p>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-gray-800 mb-6">AI個人化建議</h2>
          
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              const isPriority = rec.priority === 'high';
              
              return (
                <div
                  key={rec.id}
                  className={`rounded-2xl p-6 border-2 ${
                    isPriority
                      ? 'bg-red-50 border-red-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${isPriority ? 'bg-red-500' : 'bg-blue-500'} rounded-2xl p-4 flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-800">{rec.title}</h3>
                        {isPriority && (
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full">
                            優先
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{rec.description}</p>
                      
                      <button
                        onClick={() => handleActionClick(rec.action)}
                        className={`${
                          isPriority
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white rounded-2xl px-6 py-3 transition-all hover:scale-105 shadow-md`}
                      >
                        一鍵採納
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
            <h2 className="text-green-700 mb-6">確認採納建議</h2>
            
            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <p className="text-gray-700 mb-4">
                系統將為您自動安排相關活動，並加入提醒。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickAction(selectedAction)}
                className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg"
              >
                確認採納
              </button>
              
              <button
                onClick={() => setShowActionModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl px-8 py-6 transition-all hover:scale-105"
              >
                暫時唔要
              </button>
            </div>
          </div>
        </div>
      )}

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
