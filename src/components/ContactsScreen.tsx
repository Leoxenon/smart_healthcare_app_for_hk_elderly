import { ArrowLeft, Phone, MessageCircle, Plus, User, Mic } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';
import { useState } from 'react';

interface ContactsScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
}

export function ContactsScreen({ onNavigate, onEmergency, onVoiceInput }: ContactsScreenProps) {
  const [contacts] = useState([
    {
      id: 1,
      name: '陳醫生',
      relationship: '家庭醫生',
      phone: '2345-6789',
      avatar: '👨‍⚕️',
      isEmergency: true,
    },
    {
      id: 2,
      name: '李女士',
      relationship: '女兒',
      phone: '9876-5432',
      avatar: '👩',
      isEmergency: true,
    },
    {
      id: 3,
      name: '張先生',
      relationship: '兒子',
      phone: '9123-4567',
      avatar: '👨',
      isEmergency: true,
    },
    {
      id: 4,
      name: '王護士',
      relationship: '護理人員',
      phone: '2456-7890',
      avatar: '👩‍⚕️',
      isEmergency: false,
    },
    {
      id: 5,
      name: '黃太太',
      relationship: '鄰居',
      phone: '9234-5678',
      avatar: '👵',
      isEmergency: false,
    },
  ]);

  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('我可以幫您快速聯絡醫生或家屬');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const emergencyContacts = contacts.filter(c => c.isEmergency);
  const regularContacts = contacts.filter(c => !c.isEmergency);

  const handleCall = (contact: typeof contacts[0]) => {
    alert(`正在撥打 ${contact.name} (${contact.phone})`);
  };

  const handleMessage = (contact: typeof contacts[0]) => {
    alert(`正在打開與 ${contact.name} 的對話`);
  };

  const handleAddContact = () => {
    alert('添加新聯繫人');
  };

  const handleAIClick = () => {
    if (isSpeaking) return;
    const msgs = [
      '如需緊急幫助，我可以引導您撥打電話。',
      '我可以幫您確認聯繫人資訊是否最新。',
      '需要我播報某位聯繫人的電話嗎？'
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
      setCurrentMessage('我可以幫您快速聯絡醫生或家屬');
      setAiEmotion('happy');
    };
    window.speechSynthesis.speak(u);
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
            <h1 className="text-blue-700">聯繫人</h1>
          </div>
          <VoiceButton 
            text="聯繫人頁面。查看您的家屬和醫生聯繫方式，可以一鍵撥打電話或發送消息。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
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
        {/* Emergency Contacts */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 rounded-full p-3">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-red-700">緊急聯繫人</h2>
          </div>

          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-3xl shadow-lg p-8 border-4 border-red-200"
              >
                <div className="flex items-center gap-6">
                  <div className="text-6xl flex-shrink-0">{contact.avatar}</div>
                  <div className="flex-1">
                    <h2 className="mb-2">{contact.name}</h2>
                    <p className="text-gray-600 mb-3">{contact.relationship}</p>
                    <p className="text-gray-700">{contact.phone}</p>
                  </div>
                  <VoiceButton text={`${contact.name}，${contact.relationship}，電話${contact.phone}。`} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => handleCall(contact)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Phone className="w-8 h-8" />
                    <span>撥打電話</span>
                  </button>
                  <button
                    onClick={() => handleMessage(contact)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-8 h-8" />
                    <span>發送消息</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Contacts */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 rounded-full p-3">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-blue-700">其他聯繫人</h2>
          </div>

          <div className="space-y-4">
            {regularContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-3xl shadow-lg p-8"
              >
                <div className="flex items-center gap-6">
                  <div className="text-6xl flex-shrink-0">{contact.avatar}</div>
                  <div className="flex-1">
                    <h2 className="mb-2">{contact.name}</h2>
                    <p className="text-gray-600 mb-3">{contact.relationship}</p>
                    <p className="text-gray-700">{contact.phone}</p>
                  </div>
                  <VoiceButton text={`${contact.name}，${contact.relationship}，電話${contact.phone}。`} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => handleCall(contact)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Phone className="w-8 h-8" />
                    <span>撥打電話</span>
                  </button>
                  <button
                    onClick={() => handleMessage(contact)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-8 h-8" />
                    <span>發送消息</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Contact Button */}
        <button
          onClick={handleAddContact}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-8 transition-all hover:scale-105 flex items-center justify-center gap-4 shadow-lg"
        >
          <Plus className="w-10 h-10" />
          <span>添加聯繫人</span>
        </button>

        {/* Emergency Info */}
        <div className="bg-red-50 border-4 border-red-200 rounded-3xl p-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl">🆘</div>
            <div className="flex-1">
              <h2 className="text-red-800 mb-3">緊急求助提示</h2>
              <p className="text-gray-700 mb-4">
                如遇緊急情況，請點擊屏幕右下角的紅色緊急求助按鈕，或直接撥打緊急聯繫人電話。系統會自動通知您的家人和醫護人員。
              </p>
              <VoiceButton text="緊急求助提示：如遇緊急情況，請點擊屏幕右下角的紅色緊急求助按鈕，或直接撥打緊急聯繫人電話。系統會自動通知您的家人和醫護人員。" />
            </div>
          </div>
        </div>
      </div>

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
