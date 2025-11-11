import { ArrowLeft, BookOpen, Clock, Volume2 } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';
import { useState } from 'react';

interface KnowledgeScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
}

export function KnowledgeScreen({ onNavigate, onEmergency }: KnowledgeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('diabetes');
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const categories = [
    { id: 'diabetes', label: '糖尿病', color: 'bg-blue-500' },
    { id: 'hypertension', label: '高血壓', color: 'bg-red-500' },
    { id: 'heart', label: '心臟病', color: 'bg-purple-500' },
    { id: 'other', label: '其他', color: 'bg-green-500' },
  ];

  const articles = {
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

  const currentArticles = articles[selectedCategory as keyof typeof articles] || [];

  if (selectedArticle !== null) {
    const article = currentArticles.find(a => a.id === selectedArticle);
    if (!article) return null;

    return (
      <div className="min-h-screen bg-gray-50">{/* 去掉pb-24底部padding */}
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
            <VoiceButton 
              text={`文章標題：${article.title}。閱讀時長約${article.readTime}。`}
              size="large"
            />
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">{article.thumbnail}</div>
              <h1 className="mb-4">{article.title}</h1>
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <Clock className="w-6 h-6" />
                <span>閱讀時長: {article.readTime}</span>
              </div>
            </div>

            <div className="space-y-8">
              {article.content.map((paragraph, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{paragraph}</p>
                    </div>
                    <VoiceButton text={paragraph} />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const fullText = article.content.join(' ');
                const utterance = new SpeechSynthesisUtterance(fullText);
                utterance.lang = 'zh-HK';
                utterance.rate = 0.8;
                window.speechSynthesis.speak(utterance);
              }}
              className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-8 transition-all hover:scale-105 flex items-center justify-center gap-4"
            >
              <Volume2 className="w-10 h-10" />
              <span>全文朗讀</span>
            </button>
          </div>
        </div>

        <EmergencyButton onClick={onEmergency} />
      </div>
    );
  }

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
            <h1 className="text-yellow-700">健康知識庫</h1>
          </div>
          <VoiceButton 
            text="健康知識庫頁面。選擇分類查看相關的健康文章和建議。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
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
                  <button
                    onClick={() => setSelectedArticle(article.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 w-full md:w-auto"
                  >
                    閱讀
                  </button>
                </div>
                <VoiceButton text={`文章：${article.title}，閱讀時長約${article.readTime}。`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
