import { ArrowLeft, Mic, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { VoiceButton } from './VoiceButton';
import { AICharacter } from './AICharacter';
import { useState, useEffect } from 'react';

interface AssistantScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export function AssistantScreen({ onNavigate, onEmergency, onVoiceInput }: AssistantScreenProps) {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      text: '您好！我是小健，您的健康助手。我可以幫助您管理用藥提醒、解答健康問題或提供緊急求助。請問有什麼可以幫到您？',
      timestamp: new Date(),
    },
  ]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    { text: '我需要用藥提醒', icon: '💊', emotion: 'caring' as const },
    { text: '如何管理血糖', icon: '📊', emotion: 'thinking' as const },
    { text: '緊急求助', icon: '🆘', emotion: 'caring' as const },
    { text: '健康飲食建議', icon: '🍎', emotion: 'happy' as const },
  ];

  // AI助手打招呼
  useEffect(() => {
    const greetings = [
      '今天感覺怎麼樣？',
      '有什麼我能幫您的嗎？',
      '記得按時吃藥哦！',
      '今天喝夠水了嗎？'
    ];

    const showRandomGreeting = () => {
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setCurrentMessage(randomGreeting);
      setAiEmotion('caring');
      
      setTimeout(() => {
        setCurrentMessage('');
        setAiEmotion('happy');
      }, 5000);
    };

    // 定期顯示關懷消息
    const greetingInterval = setInterval(showRandomGreeting, 30000);
    
    return () => clearInterval(greetingInterval);
  }, []);

  const handleQuickReply = (text: string, emotion: 'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping' = 'happy') => {
    // 設置AI表情
    setAiEmotion('thinking');
    setCurrentMessage('讓我想想...');
    
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    // Mock assistant response
    setTimeout(() => {
      setAiEmotion('talking');
      setCurrentMessage('');
      
      let responseText = '';
      
      if (text.includes('用藥') || text.includes('藥物')) {
        responseText = '好的！我已經為您設置了用藥提醒。您今天還有3種藥物需要服用。您可以到用藥管理頁面查看詳細信息。需要我現在為您播報嗎？';
        setAiEmotion('caring');
      } else if (text.includes('血糖')) {
        responseText = '管理血糖的關鍵包括：1) 定時測量血糖；2) 控制飲食，少吃高糖食物；3) 適量運動；4) 按時服藥。您可以在健康數據頁面記錄每日血糖值，我會幫您追蹤趨勢。';
        setAiEmotion('thinking');
      } else if (text.includes('緊急') || text.includes('求助')) {
        responseText = '我明白您需要緊急幫助。請點擊屏幕右下角的紅色緊急求助按鈕，系統會立即通知您的家人和醫護人員。或者您也可以告訴我具體情況，我會提供相應建議。';
        setAiEmotion('caring');
      } else if (text.includes('飲食') || text.includes('食物')) {
        responseText = '健康飲食建議：1) 多吃蔬菜水果；2) 選擇全穀類食物；3) 適量攝入優質蛋白質；4) 少油少鹽少糖；5) 每天飲水6-8杯。您可以在知識庫查看更詳細的飲食指南。';
        setAiEmotion('happy');
      } else {
        responseText = '謝謝您的提問！我已經記錄了您的問題。如果您需要更專業的建議，建議諮詢您的醫生。我可以幫您安排與醫生的聯繫，或者查看健康知識庫中的相關文章。';
        setAiEmotion('caring');
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        type: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // 說話完畢後回到愉快表情
      setTimeout(() => {
        setAiEmotion('happy');
      }, 3000);
    }, 2000);
  };

  const handleVoiceInput = () => {
    if (typeof onVoiceInput === 'function') {
      onVoiceInput();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 頂部導航 */}
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
            <h1 className="text-purple-700">AI健康助手 - 小健</h1>
          </div>
          <VoiceButton 
            text="這是AI健康助手小健。您可以通過語音與小健對話，獲取健康建議和幫助。小健會用親切的方式回應您。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* AI角色展示區 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-4 border-gradient-to-r from-blue-200 to-purple-200">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* 紧急求助按钮和AI角色 */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              {/* 紧急求助按钮 - 移到AI角色正上方 */}
              <div className="relative z-10">
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
              
              <AICharacter 
                emotion={aiEmotion}
                isAnimating={isVoiceMode || isTyping}
                size="large"
                message={currentMessage}
              />
            </div>

            {/* 歡迎信息 */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3 justify-center lg:justify-start">
                <Heart className="w-8 h-8 text-pink-500" />
                您好！我是小健
                <Sparkles className="w-8 h-8 text-purple-500" />
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                我是您的專屬健康助手，擁有豐富的醫療知識和關懷之心。
                我會用最親切的方式為您提供健康建議、用藥提醒和緊急幫助。
                請隨時與我對話，讓我陪伴您的健康之旅！
              </p>
              
              {/* 狀態提示 */}
              {isTyping && (
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>小健正在思考...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 對話歷史 */}
        {messages.length > 1 && (
          <div className="space-y-6 mb-8">
            {messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-3xl p-6 shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-white border-4 border-purple-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {message.type === 'assistant' && (
                      <AICharacter emotion="happy" size="small" />
                    )}
                    <div className="flex-1">
                      <p className={`text-lg leading-relaxed ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                        {message.text}
                      </p>
                      <p className={`mt-3 text-sm ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
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
        )}

        {/* 快速回覆選項 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-4 border-green-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            💬 常見問題 - 點擊與小健對話
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply.text, reply.emotion)}
                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-blue-50 text-gray-800 rounded-2xl px-8 py-6 transition-all hover:scale-105 hover:shadow-lg border-2 border-gray-200 hover:border-purple-300 flex items-center gap-4"
              >
                <span className="text-3xl">{reply.icon}</span>
                <span className="text-lg font-medium">{reply.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 語音輸入區域 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-purple-200 shadow-2xl p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">💭 想要與小健語音對話嗎？</p>
            </div>
            <button
              onClick={handleVoiceInput}
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-3xl px-12 py-8 transition-all hover:scale-105 shadow-xl flex items-center gap-6 ${
                isVoiceMode ? 'ring-4 ring-purple-300 animate-pulse' : ''
              }`}
              aria-label="語音輸入"
            >
              <Mic className="w-12 h-12" />
              <div className="text-left">
                <div className="text-xl font-bold">
                  {isVoiceMode ? '🎤 正在聆聽' : '🎤 按此說話'}
                </div>
                <div className="text-sm opacity-90">
                  與小健語音對話
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
