import { Pill, Activity, BookOpen, Phone, Settings, MessageCircle, ChefHat, TrendingUp } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
}

export function Dashboard({ onNavigate, onEmergency }: DashboardProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-HK', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
  const timeStr = now.toLocaleTimeString('zh-HK', { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  const cards = [
    {
      id: 'medication',
      title: '今日用藥提醒',
      icon: Pill,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      content: '還有 3 種藥物待服用',
      buttonText: '查看詳情',
      voiceText: '今日用藥提醒：還有三種藥物待服用。點擊查看詳情按鈕了解更多。',
      onClick: () => onNavigate('medication'),
    },
    {
      id: 'risk-prediction',
      title: 'AI風險預測',
      icon: TrendingUp,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      content: '心血管風險：中高危',
      buttonText: '查看分析',
      voiceText: 'AI風險預測：您嘅心血管風險處於中高危水平。點擊查看分析按鈕了解詳情同建議。',
      onClick: () => onNavigate('risk-prediction'),
    },
    {
      id: 'recipe',
      title: 'AI智能菜譜',
      icon: ChefHat,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      content: '今日推薦：清蒸石斑魚',
      buttonText: '查看菜譜',
      voiceText: 'AI智能菜譜：根據您嘅健康狀況，今日推薦清蒸石斑魚。點擊查看菜譜按鈕了解烹調方法。',
      onClick: () => onNavigate('recipe'),
    },
    {
      id: 'health-data',
      title: '健康數據',
      icon: Activity,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      content: '血壓: 125/80 mmHg',
      buttonText: '記錄',
      voiceText: '健康數據：最新血壓為125/80毫米汞柱。點擊記錄按鈕添加新數據。',
      onClick: () => onNavigate('health-data'),
    },
    {
      id: 'knowledge',
      title: '健康提示',
      icon: BookOpen,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      content: '每日飲水8杯有益健康',
      buttonText: '了解更多',
      voiceText: '健康提示：每日飲水八杯有益健康。點擊了解更多按鈕查看詳細建議。',
      onClick: () => onNavigate('knowledge'),
    },
    {
      id: 'emergency',
      title: '緊急求助',
      icon: Phone,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      content: '24小時緊急聯繫',
      buttonText: '立即求助',
      voiceText: '緊急求助：24小時緊急聯繫。點擊立即求助按鈕聯絡您的家人或醫護人員。',
      onClick: onEmergency,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-green-700 mb-2">您好！歡迎回來</h1>
            <p className="text-gray-600">{dateStr}</p>
            <p className="text-gray-600">{timeStr}</p>
          </div>
          <VoiceButton 
            text="歡迎使用健康伴侶首頁。您可以查看今日用藥提醒、記錄健康數據、閱讀健康提示或使用緊急求助功能。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl shadow-lg p-8 relative"
              >
                <div className="absolute top-6 right-6">
                  <VoiceButton text={card.voiceText} />
                </div>
                
                <div className={`${card.color} rounded-2xl p-6 inline-block mb-6`}>
                  <Icon className="w-16 h-16 text-white" />
                </div>
                
                <h2 className="mb-4">{card.title}</h2>
                <p className="text-gray-600 mb-8">{card.content}</p>
                
                <button
                  onClick={card.onClick}
                  className={`w-full ${card.color} ${card.hoverColor} text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-md`}
                >
                  {card.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 shadow-2xl">
        <div className="flex justify-around items-center py-4 max-w-6xl mx-auto">
          <button
            onClick={() => onNavigate('medication')}
            className="flex flex-col items-center gap-2 px-6 py-3 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <Pill className="w-10 h-10 text-green-600" />
            <span className="text-gray-700">用藥</span>
          </button>
          <button
            onClick={() => onNavigate('health-data')}
            className="flex flex-col items-center gap-2 px-6 py-3 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <Activity className="w-10 h-10 text-blue-600" />
            <span className="text-gray-700">數據</span>
          </button>
          <button
            onClick={() => onNavigate('knowledge')}
            className="flex flex-col items-center gap-2 px-6 py-3 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <BookOpen className="w-10 h-10 text-yellow-600" />
            <span className="text-gray-700">知識</span>
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className="flex flex-col items-center gap-2 px-6 py-3 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <MessageCircle className="w-10 h-10 text-purple-600" />
            <span className="text-gray-700">助手</span>
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="flex flex-col items-center gap-2 px-6 py-3 hover:bg-gray-100 rounded-2xl transition-all"
          >
            <Settings className="w-10 h-10 text-gray-600" />
            <span className="text-gray-700">設置</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
