import { Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { speakText, stopAllAudio } from '../utils/audioManager';

interface VoiceButtonProps {
  text: string;
  size?: 'small' | 'large';
  className?: string;
}

export function VoiceButton({ text, size = 'small', className = '' }: VoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { settings } = useSettings();

  const handlePlay = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }

    let lang = 'zh-HK';
    if (settings.language === 'cantonese') {
      lang = 'zh-HK';
    } else if (settings.language === 'mandarin') {
      lang = 'zh-CN';
    } else if (settings.language === 'english') {
      lang = 'en-US';
    }

    speakText(text, {
      lang,
      rate: settings.voiceSpeed,
      volume: settings.voiceVolume,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  if (size === 'large') {
    return (
      <button
        onClick={handlePlay}
        className={`flex items-center justify-center gap-3 text-white rounded-2xl px-8 py-6 transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-300' : 'bg-blue-500 hover:bg-blue-600'} ${className}`}
        aria-label={isPlaying ? '停止播放' : '播放語音說明'}
      >
        <Volume2 className="w-10 h-10" />
        <span>{isPlaying ? '停止播放' : '播放語音說明'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handlePlay}
      className={`flex items-center justify-center rounded-full p-3 transition-all ${isPlaying ? 'bg-red-100 hover:bg-red-200 text-red-700 ring-2 ring-red-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'} ${className}`}
      aria-label={isPlaying ? '停止播放' : '播放語音'}
    >
      <Volume2 className="w-6 h-6" />
    </button>
  );
}
