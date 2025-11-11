import { Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface VoiceButtonProps {
  text: string;
  size?: 'small' | 'large';
  className?: string;
}

export function VoiceButton({ text, size = 'small', className = '' }: VoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { settings } = useSettings();

  const handlePlay = () => {
    setIsPlaying(true);
    
    // Use Web Speech API with settings
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply language settings
    if (settings.language === 'cantonese') {
      utterance.lang = 'zh-HK';
    } else if (settings.language === 'mandarin') {
      utterance.lang = 'zh-CN';
    } else {
      utterance.lang = 'zh-HK'; // Default to Cantonese
    }
    
    // Apply voice settings
    utterance.rate = settings.voiceSpeed;
    utterance.volume = settings.voiceVolume;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  if (size === 'large') {
    return (
      <button
        onClick={handlePlay}
        className={`flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-6 transition-all ${isPlaying ? 'ring-4 ring-blue-300' : ''} ${className}`}
        aria-label="播放語音說明"
      >
        <Volume2 className="w-10 h-10" />
        <span>播放語音說明</span>
      </button>
    );
  }

  return (
    <button
      onClick={handlePlay}
      className={`flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-3 transition-all ${isPlaying ? 'ring-2 ring-blue-400' : ''} ${className}`}
      aria-label="播放語音"
    >
      <Volume2 className="w-6 h-6" />
    </button>
  );
}
