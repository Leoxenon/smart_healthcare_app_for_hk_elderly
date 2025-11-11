import { ArrowLeft, Home } from 'lucide-react';
import { VoiceButton } from './VoiceButton';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  onHome?: () => void;
  voiceText: string;
  titleColor?: string;
}

export function ScreenHeader({ 
  title, 
  onBack, 
  onHome, 
  voiceText, 
  titleColor = 'text-blue-700' 
}: ScreenHeaderProps) {
  return (
    <div className="bg-white shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
            aria-label="返回"
          >
            <ArrowLeft className="w-8 h-8 text-gray-700" />
          </button>
          {onHome && (
            <button
              onClick={onHome}
              className="p-4 hover:bg-green-100 rounded-2xl transition-all"
              aria-label="回到首頁"
            >
              <Home className="w-8 h-8 text-green-600" />
            </button>
          )}
          <h1 className={titleColor}>{title}</h1>
        </div>
        <VoiceButton 
          text={voiceText}
          size="large"
        />
      </div>
    </div>
  );
}
