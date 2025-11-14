import { ArrowLeft, BookOpen, Clock, Volume2, Mic, Settings, Play, Youtube } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { VoiceButton } from './VoiceButton';
import { useState } from 'react';
import { speakText, stopAllAudio } from '../utils/audioManager';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

interface KnowledgeScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
}

export const knowledgeArticles = {
  diabetes: [
    {
      id: 1,
      title: '糖尿病患者的飲食建議',
      readTime: '5分鐘',
      thumbnail: '🍎',
      content: [
        '糖尿病患者應該控制碳水化合物的攝入量。建議每餐攝入的碳水化合物量保持一致，有助於穩定血糖水平。',
        '多吃高纖維食物，如全穀類、蔬菜和豆類。纖維有助於延緩血糖上升，並改善腸道健康。',
        '選擇健康的脂肪來源，如橄欖油、堅果和魚類。避免反式脂肪和飽和脂肪。',
        '少吃含糖食物和飲料。糖分會迅速提高血糖水平，對糖尿病控制不利。',
        '定時定量進食，避免暴飲暴食。規律的進食時間有助於血糖管理。',
      ],
    },
    {
      id: 2,
      title: '如何正確測量血糖',
      readTime: '3分鐘',
      thumbnail: '📊',
      content: [
        '測量前先洗手並擦乾，確保手部清潔。髒手可能影響測量結果。',
        '使用酒精棉片消毒手指側面，等待酒精完全揮發後再測量。',
        '使用採血筆在手指側面採血，不要在指尖採血。側面疼痛較少。',
        '將血糖試紙插入血糖儀，等待儀器準備好後再滴血。',
        '記錄每次測量結果和測量時間，以便與醫生討論。',
      ],
    },
  ],
  hypertension: [
    {
      id: 3,
      title: '降低血壓的生活方式',
      readTime: '4分鐘',
      thumbnail: '❤️',
      content: [
        '減少鹽分攝入。每天鈉攝入量應少於2300毫克，最好控制在1500毫克以下。',
        '保持健康體重。減輕體重可以顯著降低血壓，每減輕1公斤，血壓可降低約1毫米汞柱。',
        '定期運動。每週至少150分鐘中等強度運動，如快走、游泳或騎自行車。',
        '限制酒精攝入。男性每天不超過2杯，女性每天不超過1杯。',
        '管理壓力。嘗試冥想、深呼吸或瑜伽等放鬆技巧。',
      ],
    },
    {
      id: 4,
      title: '正確測量血壓的方法',
      readTime: '3分鐘',
      thumbnail: '🩺',
      content: [
        '測量前30分鐘避免吸煙、喝咖啡或劇烈運動。這些活動會暫時提高血壓。',
        '坐在有靠背的椅子上，雙腳平放在地板上，背部挺直。',
        '將手臂放在桌上，保持與心臟同高。手臂應該放鬆，不要緊張。',
        '袖帶應該緊貼皮膚，鬆緊適中。太緊或太鬆都會影響測量結果。',
        '測量前靜坐5分鐘，保持安靜。連續測量2-3次，取平均值。',
      ],
    },
  ],
  heart: [
    {
      id: 5,
      title: '心臟病的預警信號',
      readTime: '4分鐘',
      thumbnail: '💓',
      content: [
        '胸痛或胸部不適。這是最常見的心臟病症狀，可能表現為壓迫感、緊縮感或疼痛。',
        '呼吸困難。輕微活動或休息時感到氣短，可能是心臟功能下降的信號。',
        '疲勞和虛弱。持續的疲勞感，特別是之前能輕鬆完成的活動現在感到困難。',
        '心悸或不規則心跳。感覺心臟跳動過快、過慢或不規律。',
        '頭暈或暈厥。特別是在站立或活動時突然感到頭暈。',
      ],
    },
  ],
  other: [
    {
      id: 6,
      title: '老年人的日常保健',
      readTime: '5分鐘',
      thumbnail: '🌟',
      content: [
        '保持充足睡眠。每晚7-8小時的優質睡眠對身體修復和免疫系統很重要。',
        '多喝水。老年人容易脫水，每天應喝6-8杯水。',
        '保持社交活動。與家人朋友保持聯繫，參加社區活動，有助於心理健康。',
        '定期體檢。每年至少進行一次全面體檢，及早發現和預防疾病。',
        '保持大腦活躍。閱讀、做益智遊戲或學習新技能，有助於預防認知能力下降。',
      ],
    },
  ],
};

export function KnowledgeScreen({ onNavigate, onEmergency, onVoiceInput }: KnowledgeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('diabetes');
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('我可以為您推薦文章或朗讀重點');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReadingFullText, setIsReadingFullText] = useState(false); // 新增：全文朗读状态

  const categories = [
    { id: 'diabetes', label: '糖尿病', color: 'bg-blue-500' },
    { id: 'hypertension', label: '高血壓', color: 'bg-red-500' },
    { id: 'heart', label: '心臟病', color: 'bg-purple-500' },
    { id: 'other', label: '其他', color: 'bg-green-500' },
  ];

  const articles = knowledgeArticles;
  const knowledgeVideos = {
    diabetes: [
      {
        id: 101,
        title: '糖尿病前期飲食貼士 — 養和醫院高級營養師 余思行',
        videoEmbedUrl: 'https://www.youtube.com/embed/Pkv9BVhVrs0',
        source: 'YouTube',
        thumbnail: '🎥',
      },
    ],
    hypertension: [
      {
        id: 102,
        title: '高血壓終身需服藥？另類降壓偏方是否有用？',
        videoEmbedUrl: 'https://www.youtube.com/embed/GjAq8PrMbSc',
        source: 'YouTube',
        thumbnail: '🎥',
      },
    ],
    heart: [
      {
        id: 103,
        title: '使用健康的食用油可以降低心臟病風險（粵語）',
        videoEmbedUrl: 'https://www.youtube.com/embed/qr48Tc59vt8',
        source: 'YouTube',
        thumbnail: '🎥',
      },
    ],
    other: [
      {
        id: 104,
        title: '長壽老人三大「絕活」— 要教會家中老人（粵語）',
        videoEmbedUrl: 'https://www.youtube.com/embed/J4llUsyw-ts',
        source: 'YouTube',
        thumbnail: '🎥',
      },
    ],
  } as const;

  const currentArticles = articles[selectedCategory as keyof typeof articles] || [];
  const currentVideos = knowledgeVideos[selectedCategory as keyof typeof knowledgeVideos] || [];

  if (selectedVideo !== null) {
    const video = currentVideos.find(v => v.id === selectedVideo);
    if (!video) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
                aria-label="返回"
              >
                <ArrowLeft className="w-8 h-8 text-gray-700" />
              </button>
              <h1 className="text-yellow-700">影片詳情</h1>
            </div>
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
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{video.thumbnail}</div>
              <h1 className="mb-2">{video.title}</h1>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Youtube className="w-5 h-5" />
                <span>{video.source}</span>
              </div>
            </div>
            <AspectRatio.Root ratio={16/9} className="rounded-xl overflow-hidden shadow">
              <iframe
                src={video.videoEmbedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </AspectRatio.Root>
          </div>
        </div>
      </div>
    );
  }

  const handleAIClick = () => {
    // 如果正在说话，点击停止
    if (isSpeaking) {
      stopAllAudio();
      setIsSpeaking(false);
      setCurrentMessage('我可以為您推薦文章或朗讀重點');
      setAiEmotion('happy');
      return;
    }
    
    const msgs = [
      '需要我推薦適合您健康狀況的文章嗎？',
      '我可以朗讀文章重點，幫您快速了解。',
      '常看健康知識有助改善生活習慣。'
    ];
    const m = msgs[Math.floor(Math.random() * msgs.length)];
    setAiEmotion('talking');
    setCurrentMessage(m);
    
    speakText(m, {
      lang: 'zh-HK',
      rate: 0.8,
      volume: 0.8,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentMessage('我可以為您推薦文章或朗讀重點');
        setAiEmotion('happy');
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentMessage('我可以為您推薦文章或朗讀重點');
        setAiEmotion('happy');
      },
    });
  };

  if (selectedArticle !== null) {
    const article = currentArticles.find(a => a.id === selectedArticle);
    if (!article) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
                aria-label="返回"
              >
                <ArrowLeft className="w-8 h-8 text-gray-700" />
              </button>
              <h1 className="text-yellow-700">文章詳情</h1>
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
          {/* 紧急求助按钮卡片 - 移到顶部 */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-4 border-purple-100">
            <div className="flex flex-col items-center text-center">
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
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">{article.thumbnail}</div>
              <h1 className="mb-4">{article.title}</h1>
              <div className="flex items-center justify-center gap-3 text-gray-600 mb-6">
                <Clock className="w-6 h-6" />
                <span>閱讀時長: {article.readTime}</span>
              </div>
              { (article as any).videoEmbedUrl && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
                  <h2 className="text-gray-800 mb-3">🎬 影片</h2>
                  <AspectRatio.Root ratio={16/9} className="rounded-xl overflow-hidden shadow">
                    <iframe
                      src={(article as any).videoEmbedUrl}
                      title="健康知識影片"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </AspectRatio.Root>
                </div>
              )}
              
              {/* 全文朗读按钮 - 移到文章开头 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('全文朗读按钮被点击，当前状态:', isReadingFullText);
                  
                  if (isReadingFullText) {
                    // 如果正在播放，则暂停
                    console.log('暂停朗读');
                    stopAllAudio();
                    setIsReadingFullText(false);
                  } else {
                    // 如果未播放，则开始播放
                    console.log('开始朗读');
                    setIsReadingFullText(true);
                    
                    const fullText = article.content.join(' ');
                    console.log('全文内容长度:', fullText.length);
                    
                    speakText(fullText, {
                      lang: 'zh-HK',
                      rate: 0.8,
                      volume: 1.0,
                      onStart: () => {
                        console.log('朗读已开始');
                        setIsReadingFullText(true);
                      },
                      onEnd: () => {
                        console.log('朗读已结束');
                        setIsReadingFullText(false);
                      },
                      onError: (event) => {
                        console.error('朗读出错:', event);
                        setIsReadingFullText(false);
                      },
                    });
                  }
                }}
                className={`${
                  isReadingFullText 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-4 shadow-lg mx-auto cursor-pointer`}
                type="button"
              >
                <Volume2 className="w-8 h-8" />
                <span className="text-lg font-medium">
                  {isReadingFullText ? '⏸️ 暫停朗讀' : '🔊 全文朗讀'}
                </span>
              </button>
            </div>

            <div className="space-y-8">
              {article.content.map((paragraph, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-800 leading-relaxed mb-4">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-yellow-700">健康知識庫</h1>
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
        {/* Category Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-8 py-6 rounded-2xl transition-all ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Videos */}
        <div className="space-y-6 mb-8">
          {currentVideos.length > 0 && (
            <h2 className="text-gray-800 mb-4 flex items-center gap-2"><Play className="w-6 h-6 text-purple-600" /> 影片</h2>
          )}
          {currentVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-start gap-6">
                <div className="text-6xl flex-shrink-0">{video.thumbnail}</div>
                <div className="flex-1">
                  <h2 className="mb-3">{video.title}</h2>
                  <div className="flex items-center gap-3 text-gray-600 mb-6">
                    <Youtube className="w-5 h-5" />
                    <span>{video.source}</span>
                  </div>
                  <div className="flex gap-4 items-center flex-wrap">
                    <button
                      onClick={() => setSelectedVideo(video.id)}
                      className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105"
                    >
                      播放
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-6">
          {currentArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl flex-shrink-0">{article.thumbnail}</div>
                <div className="flex-1">
                  <h2 className="mb-3">{article.title}</h2>
                  <div className="flex items-center gap-3 text-gray-600 mb-6">
                    <Clock className="w-6 h-6" />
                    <span>閱讀時長: {article.readTime}</span>
                  </div>
                  <div className="flex gap-4 items-center flex-wrap">
                    <button
                      onClick={() => setSelectedArticle(article.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex-1 md:flex-none"
                    >
                      閱讀
                    </button>
                    <VoiceButton text={`${article.title}。閱讀時長：${article.readTime}。點擊閱讀按鈕查看完整內容。`} />
                    { (article as any).videoEmbedUrl && (
                      <span className="text-sm px-3 py-2 rounded-xl bg-purple-100 text-purple-700 border border-purple-200">
                        🎬 可觀看影片
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
