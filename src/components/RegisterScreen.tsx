import { useState } from 'react';
import { ArrowLeft, User, Calendar, Weight, AlertTriangle, Heart, Droplets, Mic, MicOff } from 'lucide-react';
import { VoiceButton } from './VoiceButton';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  allergies: string;
  medications: string;
  chronicDiseases: string[];
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  notes: string;
}

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
  onRegister: (profile: UserProfile) => void;
}

export function RegisterScreen({ onNavigate, onRegister }: RegisterScreenProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: '男',
    weight: '',
    height: '',
    allergies: '',
    medications: '',
    chronicDiseases: [],
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isListening, setIsListening] = useState<string | null>(null);
  const totalSteps = 4;

  const chronicDiseaseOptions = [
    '高血壓', '糖尿病', '心臟病', '高血脂', '關節炎', 
    '骨質疏鬆', '哮喘', '慢性腎病', '甲狀腺疾病', '其他'
  ];

  const genderOptions = [
    { value: '男', label: '男' },
    { value: '女', label: '女' }
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '不清楚'];

  // 語音輸入功能
  const startVoiceInput = (field: string) => {
    setIsListening(field);
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'zh-HK';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setProfile(prev => ({
          ...prev,
          [field]: transcript
        }));
        setIsListening(null);
      };

      recognition.onerror = () => {
        setIsListening(null);
      };

      recognition.onend = () => {
        setIsListening(null);
      };

      recognition.start();
    } else {
      alert('您的瀏覽器不支持語音識別功能');
      setIsListening(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChronicDiseaseToggle = (disease: string) => {
    setProfile(prev => ({
      ...prev,
      chronicDiseases: prev.chronicDiseases.includes(disease)
        ? prev.chronicDiseases.filter(d => d !== disease)
        : [...prev.chronicDiseases, disease]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 完成注冊
      onRegister(profile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.name && profile.age && profile.weight && profile.height;
      case 2:
        return true; // 健康信息可選
      case 3:
        return true; // 過敏和用藥可選
      case 4:
        return profile.emergencyContact && profile.emergencyPhone;
      default:
        return false;
    }
  };

  const VoiceInputButton = ({ field }: { field: string }) => (
    <button
      type="button"
      onClick={() => startVoiceInput(field)}
      className={`p-3 rounded-xl transition-all flex-shrink-0 min-w-[48px] ${
        isListening === field 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      }`}
      aria-label="語音輸入"
    >
      {isListening === field ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">基本資料</h2>
              <p className="text-gray-600 text-sm">請填寫您的基本信息</p>
            </div>

            {/* 姓名 */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">姓名 *</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base max-w-[160px]"
                  placeholder="請輸入姓名"
                />
                <VoiceInputButton field="name" />
              </div>
            </div>

            {/* 年齡 */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">年齡 *</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base max-w-[100px]"
                  placeholder="年齡"
                  min="1"
                  max="120"
                />
                <VoiceInputButton field="age" />
              </div>
            </div>

            {/* 性別 */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">性別</label>
              <div className="grid grid-cols-2 gap-2">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('gender', option.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-base ${
                      profile.gender === option.value
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 體重和身高 - 优化手机端布局 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">體重 (kg) *</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full sm:flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base max-w-[100px]"
                    placeholder="體重"
                    min="20"
                    max="300"
                  />
                  <VoiceInputButton field="weight" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">身高 (cm) *</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full sm:flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base max-w-[100px]"
                    placeholder="身高"
                    min="100"
                    max="250"
                  />
                  <VoiceInputButton field="height" />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-red-500 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">健康狀況</h2>
              <p className="text-gray-600">請選擇您的慢性疾病（如有）</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-4">慢性疾病（可多選）</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {chronicDiseaseOptions.map((disease) => (
                  <button
                    key={disease}
                    type="button"
                    onClick={() => handleChronicDiseaseToggle(disease)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      profile.chronicDiseases.includes(disease)
                        ? 'bg-red-500 text-white border-red-600'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {disease}
                  </button>
                ))}
              </div>
            </div>

            {/* 血型 */}
            <div>
              <label className="block text-gray-700 mb-3">血型</label>
              <div className="grid grid-cols-3 gap-3">
                {bloodTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('bloodType', type)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      profile.bloodType === type
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-yellow-500 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">過敏與用藥</h2>
              <p className="text-gray-600">請填寫過敏信息和正在服用的藥物</p>
            </div>

            {/* 過敏食物/藥物 */}
            <div>
              <label className="block text-gray-700 mb-3">過敏食物或藥物</label>
              <div className="flex gap-3">
                <textarea
                  value={profile.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none text-lg h-24 resize-none"
                  placeholder="例如：花生、青霉素、海鮮等（如無過敏可留空）"
                />
                <VoiceInputButton field="allergies" />
              </div>
            </div>

            {/* 正在服用的藥物 */}
            <div>
              <label className="block text-gray-700 mb-3">正在服用的藥物</label>
              <div className="flex gap-3">
                <textarea
                  value={profile.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none text-lg h-24 resize-none"
                  placeholder="請列出您正在服用的藥物名稱和劑量（如無可留空）"
                />
                <VoiceInputButton field="medications" />
              </div>
            </div>

            {/* 補充說明 */}
            <div>
              <label className="block text-gray-700 mb-3">補充說明</label>
              <div className="flex gap-3">
                <textarea
                  value={profile.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none text-lg h-24 resize-none"
                  placeholder="其他需要注意的健康狀況或特殊需求"
                />
                <VoiceInputButton field="notes" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-green-500 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">緊急聯繫人</h2>
              <p className="text-gray-600">請填寫緊急情況下的聯繫人信息</p>
            </div>

            {/* 緊急聯繫人姓名 */}
            <div>
              <label className="block text-gray-700 mb-3">聯繫人姓名 *</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={profile.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                  placeholder="例如：李太太（女兒）"
                />
                <VoiceInputButton field="emergencyContact" />
              </div>
            </div>

            {/* 緊急聯繫電話 */}
            <div>
              <label className="block text-gray-700 mb-3">聯繫電話 *</label>
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={profile.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                  placeholder="請輸入聯繫電話"
                />
                <VoiceInputButton field="emergencyPhone" />
              </div>
            </div>

            {/* 注冊完成提示 */}
            <div className="bg-blue-50 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">即將完成注冊</h3>
              <p className="text-blue-600">
                您提供的信息將幫助我們的AI系統為您提供個性化的健康建議和風險預測。
                我們承諾保護您的隱私，所有信息僅用於改善您的健康管理體驗。
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <div className="bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('welcome')}
              className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
              aria-label="返回登錄"
            >
              <ArrowLeft className="w-8 h-8 text-gray-700" />
            </button>
            <h1 className="text-gray-700">用戶注冊</h1>
          </div>
          <VoiceButton 
            text={`用戶注冊，第${currentStep}步，共${totalSteps}步。${
              currentStep === 1 ? '請填寫基本資料。' :
              currentStep === 2 ? '請選擇您的健康狀況。' :
              currentStep === 3 ? '請填寫過敏和用藥信息。' :
              '請填寫緊急聯繫人信息。'
            }`}
            size="large"
          />
        </div>

        {/* 進度條 */}
        <div className="flex items-center gap-2 mt-6">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all ${
                index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>基本資料</span>
          <span>健康狀況</span>
          <span>過敏用藥</span>
          <span>緊急聯繫</span>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
          {renderStep()}

          {/* 導航按鈕 */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl transition-all text-sm ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              }`}
            >
              上一步
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-6 py-3 rounded-xl transition-all text-sm ${
                isStepValid()
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === totalSteps ? '完成注冊' : '下一步'}
            </button>
          </div>

          {/* 語音輸入提示 */}
          {isListening && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">正在聆聽...</h3>
                <p className="text-gray-600">請說出您要輸入的內容</p>
                <button
                  onClick={() => setIsListening(null)}
                  className="mt-4 px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-xl transition-all"
                >
                  停止錄音
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
