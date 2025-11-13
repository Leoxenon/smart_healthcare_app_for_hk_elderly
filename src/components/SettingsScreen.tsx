import { useState } from 'react';
import { ArrowLeft, Type, Volume2, Palette, Eye, Users, HelpCircle, Mic } from 'lucide-react';
import { AICharacter } from './AICharacter';
import { VoiceButton } from './VoiceButton';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
  onVoiceInput?: () => void;
  settings: {
    fontSize: string;
    theme: string;
    voiceSpeed: number;
    voiceVolume: number;
    language: string;
    highContrast: boolean;
  };
  onUpdateSettings: (settings: any) => void;
}

export function SettingsScreen({ onNavigate, onEmergency, onVoiceInput, settings, onUpdateSettings }: SettingsScreenProps) {
  const fontSizes = [
    { id: 'small', label: '小', value: 'small' },
    { id: 'standard', label: '標準', value: 'standard' },
    { id: 'large', label: '大', value: 'large' },
    { id: 'extra-large', label: '特大', value: 'extra-large' },
  ];

  const themes = [
    { id: 'light', label: '淺色', value: 'light' },
    { id: 'dark', label: '深色', value: 'dark' },
  ];

  const languages = [
    { id: 'cantonese', label: '粵語', value: 'cantonese' },
    { id: 'mandarin', label: '普通話', value: 'mandarin' },
    { id: 'english', label: '英文', value: 'english' },
  ];

  const [aiEmotion, setAiEmotion] = useState<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('我可以協助您調整設置以更易用');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAIClick = () => {
    if (isSpeaking) return;
    const msgs = [
      '需要我幫您選擇合適的字體大小或主題嗎？',
      '我可以示範語音設置效果。',
      '開啟高對比度有助閱讀。'
    ];
    const m = msgs[Math.floor(Math.random() * msgs.length)];
    setAiEmotion('talking');
    setCurrentMessage(m);
    setIsSpeaking(true);
    const u = new SpeechSynthesisUtterance(m);
    u.lang = 'zh-HK';
    u.rate = 0.8;
    u.volume = 0.8;
    u.onend = () => {
      setIsSpeaking(false);
      setCurrentMessage('我可以協助您調整設置以更易用');
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
            <h1 className="text-gray-700">設置</h1>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
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
        {/* Font Size */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-500 rounded-full p-4">
              <Type className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2>字體大小</h2>
              <p className="text-gray-600">選擇最適合您的字體大小</p>
            </div>
            <VoiceButton text="字體大小設置。選擇小、標準、大或特大字體。" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => onUpdateSettings({ ...settings, fontSize: size.value })}
                className={`rounded-2xl px-6 py-6 transition-all border-4 ${
                  settings.fontSize === size.value
                    ? 'bg-blue-500 text-white border-blue-600 scale-105'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-500 rounded-full p-4">
              <Volume2 className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2>語音設置</h2>
              <p className="text-gray-600">調整語音播放選項</p>
            </div>
            <VoiceButton text="語音設置。調整語速、音量和語言。" />
          </div>

          <div className="space-y-8">
            {/* Language */}
            <div>
              <label className="block mb-4 text-gray-700">語言</label>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => onUpdateSettings({ ...settings, language: lang.value })}
                    className={`rounded-2xl px-6 py-6 transition-all border-4 ${
                      settings.language === lang.value
                        ? 'bg-purple-500 text-white border-purple-600 scale-105'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Speed */}
            <div>
              <label className="block mb-4 text-gray-700">
                語速：{settings.voiceSpeed.toFixed(1)}x
              </label>
              <Slider
                value={[settings.voiceSpeed * 100]}
                onValueChange={([value]) => onUpdateSettings({ ...settings, voiceSpeed: value / 100 })}
                min={50}
                max={150}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-gray-600">
                <span>慢</span>
                <span>正常</span>
                <span>快</span>
              </div>
            </div>

            {/* Voice Volume */}
            <div>
              <label className="block mb-4 text-gray-700">
                音量：{Math.round(settings.voiceVolume * 100)}%
              </label>
              <Slider
                value={[settings.voiceVolume * 100]}
                onValueChange={([value]) => onUpdateSettings({ ...settings, voiceVolume: value / 100 })}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-gray-600">
                <span>靜音</span>
                <span>中</span>
                <span>最大</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-yellow-500 rounded-full p-4">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2>主題選擇</h2>
              <p className="text-gray-600">選擇淺色或深色主題</p>
            </div>
            <VoiceButton text="主題選擇。選擇淺色或深色模式。" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onUpdateSettings({ ...settings, theme: theme.value })}
                className={`rounded-2xl px-6 py-8 transition-all border-4 ${
                  settings.theme === theme.value
                    ? 'bg-yellow-500 text-white border-yellow-600 scale-105'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-500 rounded-full p-4">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2>輔助功能</h2>
              <p className="text-gray-600">額外的無障礙選項</p>
            </div>
            <VoiceButton text="輔助功能設置。包括高對比度模式和其他無障礙選項。" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
              <div className="flex-1">
                <p className="text-gray-800 mb-2">高對比度模式</p>
                <p className="text-gray-600">提高文字和背景的對比度</p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, highContrast: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
              <div className="flex-1">
                <p className="text-gray-800 mb-2">屏幕放大鏡</p>
                <p className="text-gray-600">使用系統放大功能</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-3">
                啟用
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
              <div className="flex-1">
                <p className="text-gray-800 mb-2">屏幕閱讀器支持</p>
                <p className="text-gray-600">兼容VoiceOver/TalkBack</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-3">
                設置
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-500 rounded-full p-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2>緊急聯繫人設置</h2>
              <p className="text-gray-600">管理緊急求助聯繫人</p>
            </div>
            <VoiceButton text="緊急聯繫人設置。管理在緊急情況下將被通知的人員。" />
          </div>

          <button
            onClick={() => onNavigate('contacts')}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105"
          >
            管理緊急聯繫人
          </button>
        </div>

        {/* About & Help */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-500 rounded-full p-4">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2>關於和幫助</h2>
              <p className="text-gray-600">應用信息和使用指南</p>
            </div>
            <VoiceButton text="關於和幫助。查看應用版本信息和使用教程。" />
          </div>

          <div className="space-y-4">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl px-8 py-6 transition-all text-left">
              <p className="mb-1">應用版本</p>
              <p className="text-gray-600">v1.0.0</p>
            </button>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl px-8 py-6 transition-all">
              使用教程
            </button>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl px-8 py-6 transition-all">
              常見問題
            </button>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl px-8 py-6 transition-all">
              聯繫客服
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
