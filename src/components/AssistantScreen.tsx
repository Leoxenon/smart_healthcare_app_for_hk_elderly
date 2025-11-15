import { ArrowLeft, Mic, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { VoiceButton } from './VoiceButton';
import { AICharacter } from './AICharacter';
import { useState, useEffect } from 'react';
import { speakText } from '../utils/audioManager';
import { knowledgeArticles } from './KnowledgeScreen';

interface AssistantScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
  incomingText?: string;
  onConsumeIncoming?: () => void;
  onBack?: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export function AssistantScreen({ onNavigate, onEmergency, onVoiceInput, incomingText, onConsumeIncoming, onBack }: AssistantScreenProps) {
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

  const getResponse = (text: string) => {
    let responseText = '';
    let emotion: 'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping' = 'happy';
    let articleToRead: string | null = null;
    const t = text.toLowerCase();
    const sadKeys = ['唔開心', '不開心', '不开心', 'sad', '傷心', '伤心'];
    const lonelyKeys = ['孤獨', '孤独', 'lonely', '一個人', '一个人'];
    const positiveHappyKeys = ['開心','开心','好開心','好开心','高興','高兴','愉快','喜悅','喜悦','喜歡','喜欢','心情好','興奮','兴奋'];
    const positiveGratitudeKeys = ['多謝','谢谢','感謝','感谢','致謝','谢意'];
    const positiveRelaxKeys = ['放鬆','放松','平靜','平静','安心','安定','安穩','安稳','舒適','舒适','舒服','輕鬆','轻松'];
    const positiveSatisfactionKeys = ['滿意','满意','心滿意足','心满意足','順利','顺利','稱心','称心','如願','如愿'];
    const positiveEnergyKeys = ['精神好','有精神','有動力','有动力','起勁','起劲','想做','想開始','想开始','干劲'];
    const positiveComfortKeys = ['舒服','好舒服','好返','好返了','好返啲','改善','好轉','好转','痛少了'];
    const positiveSocialKeys = ['朋友','家人','傾計','聊天','團聚','聚會','見面','來探我','探望','探訪','聯絡','联系'];
    const positiveHopeKeys = ['期待','希望','有信心','信心','樂觀','乐观'];
    const positiveLearnKeys = ['學到','学到','學習','学习','進步','进步','新事物','新东西'];
    const worryKeys = ['擔心', '担心', '焦慮', '焦虑', '壓力', '压力', 'anxious', 'worry'];
    const painKeys = ['痛', '唔舒服', '不舒服', 'pain'];
    const sleepKeys = ['瞓唔著', '睡不著', '睡不着', '失眠'];
    const boredKeys = ['悶', '闷', '無聊', '无聊'];
    // 特定正面情景：有年輕人來聊天與測試應用
    const hasYoungVisit = t.includes('後生仔') || t.includes('年輕人') || t.includes('年轻人');
    const hasAppTest = t.includes('測試') || t.includes('测试') || t.includes('應用程式') || t.includes('应用程式') || t.includes('應用程序') || t.includes('应用程序');
    const hasDesignApp = t.includes('設計') || t.includes('设计');

    const allArticles = Object.values(knowledgeArticles).flat();
    const matched = allArticles.find(a => a.title.includes(text) || a.content.some(p => p.includes(text)));
    if (matched) {
      responseText = `我找到一篇關於「${matched.title}」的文章，現在為您朗讀。`;
      emotion = 'talking';
      articleToRead = matched.content.join(' ');
    } else if (hasYoungVisit && hasAppTest && (t.includes('開心') || t.includes('开心'))) {
      responseText = '聽起來真是太好了！能有年輕人來和您聊天，還有測試應用程式，一定讓您感到很受重視和開心。這樣的互動很棒，還能學到新事物！您和他們聊了些什麼呢？如果有趣的事情，也可以分享一下！这种交流真的很美好！';
      emotion = 'happy';
    } else if (hasDesignApp && (t.includes('應用程式') || t.includes('应用程式') || t.includes('應用程序') || t.includes('应用程序'))) {
      responseText = '這聽起來真是太棒了，希望你每天都能過得開心愉快，有健康的生活';
      emotion = 'happy';
    } else if ((t.includes('院友') || t.includes('院友')) && (t.includes('社工')) && (t.includes('下棋') || t.includes('棋'))) {
      responseText = '太好了！能和院友和社工一起下棋真的很棒！下棋不但能促進思維，還能增進彼此的交流和聯繫。您有沒有贏得幾局呢？或者在下棋的過程中發生了什麼有趣的事情？小健聽到您開心的心情，真的讓我也感到高興！';
      emotion = 'happy';
    } else if (t.includes('有趣') || t.includes('趣味')) {
      responseText = '小健聽到這個有趣味的分享，希望你可以繼續開心下去，保持良好的心情過好每一天。';
      emotion = 'happy';
    } else if ((t.includes('後生仔') || t.includes('年輕人') || t.includes('年轻人')) && (t.includes('生果') || t.includes('水果'))) {
      responseText = '真是太好了！他們不僅來陪您聊天，還帶了水果，這樣的關懷真的讓人感到特別舒服和開心。這樣的互動讓大家更有連結，也讓生活增色不少。您最喜歡什麼水果呢？希望您能經常享受到這樣的愉快時光！';
      emotion = 'happy';
    } else if (t.includes('橙') || t.includes('橙子') || t.includes('桔') || t.includes('橘')) {
      responseText = '橙子真是個好選擇！酸酸甜甜的口感既清爽又美味，還能提供豐富的維生素C，對健康很有好處。享受橙子的同時，也能帶來好心情。您平常還有其他喜歡的水果嗎？或者有沒有特別的吃水果的方式？';
      emotion = 'happy';
    } else if (t.includes('蘋果') || t.includes('苹果')) {
      responseText = '蘋果也是非常好的選擇！它們脆脆的口感和多樣的味道很受歡迎，還富含纖維和抗氧化劑，有助於保持健康。無論是直接吃、切片、還是做成沙拉或果汁，蘋果都很美味。';
      emotion = 'happy';
    } else if (t.includes('社工') && (t.includes('姐姐') || t.includes('職員') || t.includes('同事')) && (t.includes('傾計') || t.includes('聊天'))) {
      responseText = '小健聽到有社工姐姐陪您聊天，真的非常好！這樣的支持讓人感到被關心和重視，能帶來很多溫暖和安慰。她們的陪伴讓您更容易分享心情，這是很重要的。不知道您們聊了哪些有趣的話題呢？這樣的交流對生活一定有很多幫助！';
      emotion = 'happy';
    } else if (t.includes('往事')) {
      responseText = '往事常常能帶給我們很多回憶和情感。您想聊聊某些特別的往事嗎？也許是一些快樂的回憶，或者特別讓您感觸的事件。小健在這裡傾聽！';
      emotion = 'caring';
    } else if (t.includes('回憶') || t.includes('回忆')) {
      responseText = '你的回憶令小健難忘，這些獨特的回憶，讓小健我充滿感激，讓他心中明白，無論生活怎樣變化，愛與關懷將永遠留在我的心中，指引著我關懷下一個有需要的人，感謝您的分享。';
      emotion = 'caring';
    } else if (t.includes('早餐')) {
      responseText = '小健聽起來您的早餐非常美味！吃得好能讓人有很好的開始，特別是新的一天。您早餐吃了和喝了些什麼呢？';
      emotion = 'happy';
    } else if (t.includes('雞蛋') || t.includes('鸡蛋') || t.includes('蛋')) {
      responseText = '雞蛋是非常健康的早餐選擇！它們不僅富含蛋白質，還能提供多種營養素，非常有助於身體健康。您是喜歡煮蛋、炒蛋還是其他方式吃蛋呢？';
      emotion = 'happy';
    } else if (t.includes('牛奶') || t.includes('奶')) {
      responseText = '牛奶是個很棒的補充！它富含鈣質和蛋白質，對骨骼和整體健康都很有益。喝牛奶也可以搭配早餐，讓一餐更加營養！';
      emotion = 'happy';
    } else if (t.includes('麵包') || t.includes('面包')) {
      if (t.includes('全麥') || t.includes('全麦')) {
        responseText = '全麥麵包真是一個健康的選擇！它富含纖維，有助於消化，而且比白麵包更有營養,一定是既美味又充滿能量的早餐！';
      } else {
        responseText = '麵包搭配雞蛋真是個美味的早餐組合！麵包可以給予能量，讓您一天開始得更好。您喜歡吃什麼樣的麵包呢？全麥還是法式的？';
      }
      emotion = 'happy';
    } else if (t.includes('粥')) {
      if (t.includes('白粥')) {
        responseText = '白粥是經典的早餐選擇，清淡而舒適，是個不錯的選擇，小健會推薦這麼健康的食物給其他老人家食哦。';
      } else {
        responseText = '粥也是非常好的選擇，尤其適合早餐！它輕盈而滋潤，容易消化。您是喜歡食白粥嗎？';
      }
      emotion = 'happy';
    } else if (t.includes('其他')) {
      responseText = '聽起來挺美味又健康，小健要好好推薦給下一個老家人食用。';
      emotion = 'happy';
    } else if (t.includes('沒有食') || t.includes('没吃') || t.includes('未食') || t.includes('冇食')) {
      responseText = '小健溫馨提示：早餐是一天中重要的一餐，可以提供能量，幫助您開始美好的一天。也許您可以嘗試簡單的食物，比如水果、麵包或牛奶，這樣容易準備。如果您有時間，可以考慮午餐或晚餐好好補充一下。下次如果有空的話，小健希望您能享受一頓美味的早餐！';
      emotion = 'caring';
    } else if (positiveHappyKeys.some(k => t.includes(k))) {
      responseText = '聽到您今日好開心，我都替您開心！不如記低今日開心嘅事情，我可以幫您保留呢份好心情，或者推薦輕鬆活動～';
      emotion = 'happy';
    } else if (positiveGratitudeKeys.some(k => t.includes(k))) {
      responseText = '感受到您嘅感謝之心，真係好溫暖。保持感恩可以令心情更穩定，要唔要我幫您發一條感謝訊息畀相關人？';
      emotion = 'happy';
    } else if (positiveRelaxKeys.some(k => t.includes(k))) {
      responseText = '而家覺得放鬆同安心真係好好，可以繼續做深呼吸或者聽輕鬆音樂。我可以播放舒緩音樂，或者推薦柔和伸展～';
      emotion = 'happy';
    } else if (positiveSatisfactionKeys.some(k => t.includes(k))) {
      responseText = '覺得滿意同順利真係好事。不如用一分鐘回顧今日完成嘅小目標，我可以幫您記錄落嚟。';
      emotion = 'happy';
    } else if (positiveEnergyKeys.some(k => t.includes(k))) {
      responseText = '有精神同動力真係好！要唔要安排一個輕量運動或短行走？我可以喺活動頁面為您設定。';
      emotion = 'happy';
    } else if (positiveComfortKeys.some(k => t.includes(k))) {
      responseText = '聽到您覺得舒服或者好返啲，我替您高興。想保持呢個感覺，可以按時用藥同做輕鬆活動。我可以幫您提醒用藥或記錄感覺變化。';
      emotion = 'happy';
    } else if (positiveSocialKeys.some(k => t.includes(k))) {
      responseText = '同家人朋友傾計真係好開心。要唔要記錄一次美好相聚，或者安排下次聯絡？我可以打開聯絡頁面。';
      emotion = 'happy';
    } else if (positiveHopeKeys.some(k => t.includes(k))) {
      responseText = '保持期待同信心非常好。我可以同您定一個細目標，慢慢達成，保持呢份正能量～';
      emotion = 'happy';
    } else if (positiveLearnKeys.some(k => t.includes(k))) {
      responseText = '學到新嘢真係好有意思。我可以將今日學到嘅要點記錄，或者推薦相關知識文章畀您。';
      emotion = 'happy';
    } else if (sadKeys.some(k => t.includes(k)) || lonelyKeys.some(k => t.includes(k))) {
      responseText = '聽到您唔開心/覺得孤獨，我好關心您。可以同我講講發生咩事嗎？我一直都喺度陪住您。要唔要我播放輕鬆音樂、或者幫您聯絡家人同朋友？您唔係一個人。';
      emotion = 'caring';
    } else if (worryKeys.some(k => t.includes(k))) {
      responseText = '我明白您有擔心同壓力。試吓慢慢深呼吸，吸氣四秒、停四秒、呼氣四秒。我可以為您安排健康資訊，或者聯絡醫生解答疑問。您已經做得好好，慢慢嚟。';
      emotion = 'caring';
    } else if (painKeys.some(k => t.includes(k))) {
      responseText = '您覺得痛或唔舒服，記錄一下症狀同強度會有幫助。我可以帶您去用藥頁面睇用藥時間，或者幫您聯絡醫護人員。如果情況嚴重，請按緊急求助。';
      emotion = 'caring';
    } else if (sleepKeys.some(k => t.includes(k))) {
      responseText = '最近瞓得唔好好辛苦。睡前可以試吓溫水洗手面、少用手機同做放鬆呼吸。我可以播放助眠音樂，或者提供睡眠小貼士。';
      emotion = 'caring';
    } else if (boredKeys.some(k => t.includes(k))) {
      responseText = '覺得悶嘅時候，可以試吓簡單伸展、聽下音樂、或者同朋友傾下計。我可以帶您去活動頁面揀下輕鬆運動或小任務，一齊加油。';
      emotion = 'happy';
    } else if (text.includes('用藥') || text.includes('藥物')) {
      responseText = '好的！我已經為您設置了用藥提醒。您今天還有3種藥物需要服用。您可以到用藥管理頁面查看詳細信息。需要我現在為您播報嗎？';
      emotion = 'caring';
    } else if (text.includes('血糖')) {
      responseText = '管理血糖的關鍵包括：1) 定時測量血糖；2) 控制飲食，少吃高糖食物；3) 適量運動；4) 按時服藥。您可以在健康數據頁面記錄每日血糖值，我會幫您追蹤趨勢。';
      emotion = 'thinking';
    } else if (text.includes('緊急') || text.includes('求助')) {
      responseText = '我明白您需要緊急幫助。請點擊屏幕右下角的紅色緊急求助按鈕，系統會立即通知您的家人和醫護人員。或者您也可以告訴我具體情況，我會提供相應建議。';
      emotion = 'caring';
    } else if (text.includes('飲食') || text.includes('食物')) {
      responseText = '健康飲食建議：1) 多吃蔬菜水果；2) 選擇全穀類食物；3) 適量攝入優質蛋白質；4) 少油少鹽少糖；5) 每天飲水6-8杯。您可以在知識庫查看更詳細的飲食指南。';
      emotion = 'happy';
    } else {
      responseText = '謝謝您的分享。我已經記錄咗您的情況，如果需要更專業嘅建議，可以聯絡醫生。我亦都可以陪您傾吓、或者提供相關健康資訊。';
      emotion = 'caring';
    }
    return { responseText, emotion, articleToRead };
  };

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

  const handleQuickReply = (text: string) => {
    setAiEmotion('thinking');
    setCurrentMessage('讓我想想...');
    const userMessage: Message = { id: messages.length + 1, type: 'user', text, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setIsTyping(true);
    setTimeout(() => {
      setAiEmotion('talking');
      setCurrentMessage('');
      const { responseText, emotion } = getResponse(text);
      setAiEmotion(emotion);
      const assistantMessage: Message = { id: messages.length + 2, type: 'assistant', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      speakText(responseText, { lang: settings.language === 'mandarin' ? 'zh-CN' : settings.language === 'english' ? 'en-US' : 'zh-HK', rate: settings.voiceSpeed, volume: settings.voiceVolume });
      setTimeout(() => { setAiEmotion('happy'); }, 3000);
    }, 2000);
  };

  const handleVoiceInput = () => {
    if (typeof onVoiceInput === 'function') {
      onVoiceInput();
    }
  };

  useEffect(() => {
    if (!incomingText) return;
    setAiEmotion('thinking');
    setCurrentMessage('讓我想想...');
    const userMessage: Message = { id: messages.length + 1, type: 'user', text: incomingText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setTimeout(() => {
      setAiEmotion('talking');
      setCurrentMessage('');
      const { responseText, emotion, articleToRead } = getResponse(incomingText);
      setAiEmotion(emotion);
      const assistantMessage: Message = { id: messages.length + 2, type: 'assistant', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      speakText(responseText, { lang: settings.language === 'mandarin' ? 'zh-CN' : settings.language === 'english' ? 'en-US' : 'zh-HK', rate: settings.voiceSpeed, volume: settings.voiceVolume }).then(() => {
        if (articleToRead) {
          speakText(articleToRead, { lang: settings.language === 'mandarin' ? 'zh-CN' : settings.language === 'english' ? 'en-US' : 'zh-HK', rate: settings.voiceSpeed, volume: Math.min(1, settings.voiceVolume) });
        }
      });
      setTimeout(() => { setAiEmotion('happy'); }, 3000);
      onConsumeIncoming?.();
    }, 1500);
  }, [incomingText]);

  useEffect(() => {
    try {
      const greet = sessionStorage.getItem('assistantArrivalGreeting');
      if (greet) {
        setAiEmotion('talking');
        setCurrentMessage(greet);
        setTimeout(() => {
          setCurrentMessage('');
          setAiEmotion('happy');
        }, 5000);
        sessionStorage.removeItem('assistantArrivalGreeting');
      }
    } catch {}
  }, []);

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
          </div>
        </div>

      <div className="p-6 max-w-6xl mx-auto pb-40">
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
              
              <div className="cursor-pointer" onClick={() => onBack?.()}>
                <AICharacter 
                  emotion={aiEmotion}
                  isAnimating={isVoiceMode || isTyping}
                  size="large"
                  message={currentMessage}
                />
              </div>
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
                      ? 'bg-purple-50 border-2 border-purple-200'
                      : 'bg-white border-4 border-purple-100'
                  }`}
                >
                  {message.type === 'assistant' ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <AICharacter emotion="happy" size="small" />
                        <VoiceButton text={message.text} />
                      </div>
                      <div>
                        <p className="text-lg leading-relaxed text-gray-800">{message.text}</p>
                        <p className="mt-3 text-sm text-gray-600">
                          {message.timestamp.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-lg leading-relaxed text-gray-800">{message.text}</p>
                        <p className="mt-3 text-sm text-gray-600">
                          {message.timestamp.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )}
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
                onClick={() => handleQuickReply(reply.text)}
                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-blue-50 text-gray-800 rounded-2xl px-8 py-6 transition-all hover:scale-105 hover:shadow-lg border-2 border-gray-200 hover:border-purple-300 flex items-center gap-4"
              >
                <span className="text-3xl">{reply.icon}</span>
                <span className="text-lg font-medium">{reply.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 語音輸入區域 - 圓形紫色按鈕 */}
      <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center">
        <button
          onClick={handleVoiceInput}
          className={`bg-purple-500 hover:bg-purple-600 text-white rounded-full p-6 shadow-2xl transition-all hover:scale-110 flex items-center justify-center ${
            isVoiceMode ? 'ring-4 ring-purple-300 animate-pulse' : ''
          }`}
          aria-label="語音輸入"
        >
          <Mic className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
