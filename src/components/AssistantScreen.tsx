import { ArrowLeft, Mic, MessageCircle } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';
import { useState } from 'react';

interface AssistantScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export function AssistantScreen({ onNavigate, onEmergency }: AssistantScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      text: '您好！我是您的健康助手。我可以幫助您管理用藥提醒、解答健康問題或提供緊急求助。請問有什麼可以幫到您？',
      timestamp: new Date(),
    },
  ]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const quickReplies = [
    { text: '我需要用藥提醒', icon: '💊' },
    { text: '如何管理血糖', icon: '📊' },
    { text: '緊急求助', icon: '🆘' },
    { text: '健康飲食建議', icon: '🍎' },
  ];

  const handleQuickReply = (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // Mock assistant response
    setTimeout(() => {
      let responseText = '';
      
      if (text.includes('用藥') || text.includes('藥物')) {
        responseText = '好的！我已經為您設置了用藥提醒。您今天還有3種藥物需要服用。您可以到用藥管理頁面查看詳細信息。需要我現在為您播報嗎？';
      } else if (text.includes('血糖')) {
        responseText = '管理血糖的關鍵包括：1) 定時測量血糖；2) 控制飲食，少吃高糖食物；3) 適量運動；4) 按時服藥。您可以在健康數據頁面記錄每日血糖值，我會幫您追蹤趨勢。';
      } else if (text.includes('緊急') || text.includes('求助')) {
        responseText = '我明白您需要緊急幫助。請點擊屏幕右下角的紅色緊急求助按鈕，系統會立即通知您的家人和醫護人員。或者您也可以告訴我具體情況，我會提供相應建議。';
      } else if (text.includes('飲食') || text.includes('食物')) {
        responseText = '健康飲食建議：1) 多吃蔬菜水果；2) 選擇全穀類食物；3) 適量攝入優質蛋白質；4) 少油少鹽少糖；5) 每天飲水6-8杯。您可以在知識庫查看更詳細的飲食指南。';
      } else {
        responseText = '謝謝您的提問！我已經記錄了您的問題。如果您需要更專業的建議，建議諮詢您的醫生。我可以幫您安排與醫生的聯繫，或者查看健康知識庫中的相關文章。';
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        type: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    setIsVoiceMode(true);
    alert('請開始說話...');
    // Mock voice input - simulate the user saying "我需要用藥提醒"
    setTimeout(() => {
      handleQuickReply('我需要用藥提醒');
      setIsVoiceMode(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
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
            <h1 className="text-purple-700">健康助手</h1>
          </div>
          <VoiceButton 
            text="虛擬健康助手頁面。您可以通過語音與助手對話，獲取健康建議和幫助。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Messages */}
        <div className="space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl rounded-3xl p-6 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4">
                  {message.type === 'assistant' && (
                    <div className="bg-purple-500 rounded-full p-3 flex-shrink-0">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className={message.type === 'user' ? 'text-white' : 'text-gray-800'}>
                      {message.text}
                    </p>
                    <p className={`mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('zh-HK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.type === 'assistant' && (
                    <VoiceButton text={message.text} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">快速回覆：</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply.text)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl px-6 py-5 transition-all hover:scale-105 flex items-center gap-3"
              >
                <span className="text-2xl">{reply.icon}</span>
                <span>{reply.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 shadow-2xl p-6">
        <div className="max-w-4xl mx-auto flex justify-center">
          <button
            onClick={handleVoiceInput}
            className={`bg-purple-500 hover:bg-purple-600 text-white rounded-3xl px-12 py-10 transition-all hover:scale-105 shadow-xl flex items-center gap-6 ${
              isVoiceMode ? 'ring-4 ring-purple-300 animate-pulse' : ''
            }`}
            aria-label="語音輸入"
          >
            <Mic className="w-12 h-12" />
            <span className="text-xl">按此說話</span>
          </button>
        </div>
      </div>

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
