import { ArrowLeft, ChefHat, Heart, AlertCircle, Bookmark, Volume2 } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';
import { useState } from 'react';

interface RecipeScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
}

interface Recipe {
  id: number;
  name: string;
  nameCantonese: string;
  category: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  suitableFor: string[];
  warnings: string[];
  ingredients: string[];
  steps: string[];
  healthBenefits: string;
  saved: boolean;
}

export function RecipeScreen({ onNavigate, onEmergency }: RecipeScreenProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([1, 3]);

  const recipes: Recipe[] = [
    {
      id: 1,
      name: '清蒸石斑魚',
      nameCantonese: '清蒸石斑魚',
      category: '粵菜',
      image: '🐟',
      calories: 180,
      protein: 28,
      carbs: 2,
      fat: 6,
      sodium: 320,
      suitableFor: ['高血壓', '糖尿病', '心臟病'],
      warnings: ['魚類過敏者慎用'],
      ingredients: ['石斑魚 500克', '薑絲 30克', '蔥絲 20克', '豉油 2湯匙', '少許油'],
      steps: [
        '石斑魚清洗乾淨，放喺碟上',
        '魚身上放薑絲',
        '大火蒸8-10分鐘',
        '熄火後放蔥絲',
        '淋上熱油同豉油即成',
      ],
      healthBenefits: '石斑魚富含優質蛋白質同Omega-3脂肪酸，有助降低血壓，保護心血管健康。低脂低鈉，適合老年人食用。',
      saved: true,
    },
    {
      id: 2,
      name: '蓮藕排骨湯',
      nameCantonese: '蓮藕排骨湯',
      category: '湯水',
      image: '🍲',
      calories: 220,
      protein: 18,
      carbs: 15,
      fat: 10,
      sodium: 280,
      suitableFor: ['骨質疏鬆', '消化不良'],
      warnings: ['痛風患者減少食用'],
      ingredients: ['蓮藕 300克', '排骨 250克', '紅棗 5粒', '薑片 3片', '水 1500毫升'],
      steps: [
        '排骨汆水去血水',
        '蓮藕去皮切塊',
        '全部材料放入煲',
        '大火煲滾後轉細火',
        '煲1.5小時，加鹽調味',
      ],
      healthBenefits: '蓮藕含豐富膳食纖維，幫助消化。排骨提供鈣質，有助維持骨骼健康。清熱補益，適合秋冬飲用。',
      saved: false,
    },
    {
      id: 3,
      name: '白灼菜心',
      nameCantonese: '白灼菜心',
      category: '蔬菜',
      image: '🥬',
      calories: 80,
      protein: 4,
      carbs: 8,
      fat: 4,
      sodium: 180,
      suitableFor: ['糖尿病', '高血壓', '便秘'],
      warnings: ['甲狀腺疾病患者適量食用'],
      ingredients: ['菜心 400克', '蒜蓉 2茶匙', '蠔油 1湯匙', '油少許'],
      steps: [
        '菜心洗淨',
        '煲滾水，加少許油同鹽',
        '放菜心灼1-2分鐘',
        '撈起瀝乾',
        '淋上蒜蓉蠔油即成',
      ],
      healthBenefits: '菜心富含維他命C、鈣質同膳食纖維。有助控制血糖，促進腸道健康，增強免疫力。',
      saved: true,
    },
    {
      id: 4,
      name: '紫薯燕麥粥',
      nameCantonese: '紫薯燕麥粥',
      category: '粥品',
      image: '🍠',
      calories: 160,
      protein: 6,
      carbs: 32,
      fat: 3,
      sodium: 120,
      suitableFor: ['糖尿病', '便秘', '高血壓'],
      warnings: ['消化功能弱者少量食用'],
      ingredients: ['紫薯 150克', '燕麥 50克', '水 800毫升', '少許蜂蜜（可選）'],
      steps: [
        '紫薯去皮切小塊',
        '燕麥同紫薯放入煲',
        '加水煮滾',
        '轉細火煮30分鐘',
        '煮至軟綿，可加少許蜂蜜',
      ],
      healthBenefits: '紫薯含豐富花青素，抗氧化能力強。燕麥提供可溶性纖維，有助控制血糖同膽固醇。',
      saved: false,
    },
  ];

  const toggleSave = (recipeId: number) => {
    setSavedRecipes((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const speakRecipe = (recipe: Recipe) => {
    const text = `${recipe.name}。${recipe.healthBenefits}。主要食材包括：${recipe.ingredients.join('、')}。烹調步驟：${recipe.steps.join('。')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-HK';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
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
            <h1 className="text-green-700">AI智能菜譜</h1>
          </div>
          <VoiceButton 
            text="AI智能菜譜頁面。根據您嘅健康狀況，推薦適合老年人嘅粵菜食譜，包括營養資訊同烹調步驟。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <ChefHat className="w-12 h-12" />
            <h2 className="text-white">今日AI推薦</h2>
          </div>
          <p>根據您嘅健康數據（高血壓、血糖正常），我哋為您精選咗以下低鈉、營養均衡嘅菜式</p>
        </div>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl shadow-lg p-6 relative cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(recipe.id);
                }}
                className={`absolute top-6 right-6 p-3 rounded-2xl transition-all ${
                  savedRecipes.includes(recipe.id)
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="收藏"
              >
                <Bookmark className="w-6 h-6" />
              </button>

              <div className="text-center mb-4">
                <span style={{ fontSize: '80px' }}>{recipe.image}</span>
              </div>

              <h3 className="text-center mb-4">{recipe.name}</h3>

              {/* Nutrition Info */}
              <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                <p className="text-gray-700 mb-3">營養資訊（每份）：</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-gray-600">熱量</p>
                    <p className="text-blue-600">{recipe.calories} kcal</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-gray-600">蛋白質</p>
                    <p className="text-green-600">{recipe.protein}g</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-gray-600">碳水</p>
                    <p className="text-yellow-600">{recipe.carbs}g</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-gray-600">鈉</p>
                    <p className={recipe.sodium > 400 ? 'text-red-600' : 'text-green-600'}>
                      {recipe.sodium}mg
                    </p>
                  </div>
                </div>
              </div>

              {/* Suitable For */}
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.suitableFor.map((condition, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    {condition}
                  </span>
                ))}
              </div>

              {/* Warnings */}
              {recipe.warnings.length > 0 && (
                <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 mb-2">注意事項：</p>
                      {recipe.warnings.map((warning, idx) => (
                        <p key={idx} className="text-gray-600">{warning}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakRecipe(recipe);
                }}
                className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl px-6 py-4 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Volume2 className="w-6 h-6" />
                <span>語音講解</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-green-700">{selectedRecipe.name}</h2>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
                aria-label="關閉"
              >
                <ArrowLeft className="w-8 h-8 text-gray-700" />
              </button>
            </div>

            <div className="text-center mb-6">
              <span style={{ fontSize: '120px' }}>{selectedRecipe.image}</span>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <h3 className="text-green-700 mb-3">健康益處</h3>
              <p className="text-gray-700">{selectedRecipe.healthBenefits}</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="text-blue-700 mb-3">材料</h3>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6 mb-6">
              <h3 className="text-yellow-700 mb-3">烹調步驟</h3>
              <ol className="space-y-3">
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx} className="text-gray-700 flex gap-4">
                    <span className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => toggleSave(selectedRecipe.id)}
                className={`rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3 ${
                  savedRecipes.includes(selectedRecipe.id)
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <Bookmark className="w-8 h-8" />
                <span>{savedRecipes.includes(selectedRecipe.id) ? '已收藏' : '收藏'}</span>
              </button>

              <button
                onClick={() => speakRecipe(selectedRecipe)}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Volume2 className="w-8 h-8" />
                <span>語音講解</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
