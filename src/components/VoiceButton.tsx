import { Volume2 } from 'lucide-react';
import { useState } from 'react';

interface VoiceButtonProps {
  text: string;
  size?: 'small' | 'large';
  className?: string;
}

export function VoiceButton({ text, size = 'small', className = '' }: VoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    
    // Mock voice playback - in production, would use Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-HK';
    utterance.rate = 0.8;
    utterance.volume = 0.8;
    
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
