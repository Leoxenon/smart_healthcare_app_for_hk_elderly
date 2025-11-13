import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface AICharacterProps {
  emotion?: 'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping';
  isAnimating?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
  ariaLabel?: string;
  autoEmotionOnMessage?: boolean;
  onClick?: () => void;
}

export function AICharacter({ 
  emotion = 'happy', 
  isAnimating = false, 
  size = 'medium',
  message,
  className,
  ariaLabel,
  autoEmotionOnMessage = true,
  onClick
}: AICharacterProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [mouthState, setMouthState] = useState(0); // 0: closed, 1: small open, 2: big open

  // 眨眼動畫
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // 說話動畫
  useEffect(() => {
    if (currentEmotion === 'talking') {
      const talkInterval = setInterval(() => {
        setMouthState(prev => (prev + 1) % 3);
      }, 200);

      return () => clearInterval(talkInterval);
    } else {
      setMouthState(0);
    }
  }, [currentEmotion]);

  // 更新表情
  useEffect(() => {
    if (autoEmotionOnMessage && message && emotion !== 'sleeping') {
      setCurrentEmotion('talking');
    } else {
      setCurrentEmotion(emotion);
    }
  }, [emotion, message, autoEmotionOnMessage]);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const getEyeStyle = () => {
    if (eyeBlink) return 'scale-y-0';
    
    switch (currentEmotion) {
      case 'happy':
        return 'scale-100';
      case 'caring':
        return 'scale-100';
      case 'thinking':
        return 'scale-x-75';
      case 'sleeping':
        return 'scale-y-0';
      default:
        return 'scale-100';
    }
  };

  const getMouthPath = () => {
    if (currentEmotion === 'talking') {
      switch (mouthState) {
        case 0:
          return 'M35 45 Q40 48 45 45'; // 閉嘴
        case 1:
          return 'M35 45 Q40 50 45 45'; // 小開口
        case 2:
          return 'M35 45 Q40 55 45 45'; // 大開口
        default:
          return 'M35 45 Q40 48 45 45';
      }
    }

    switch (currentEmotion) {
      case 'happy':
        return 'M35 45 Q40 52 45 45'; // 微笑
      case 'caring':
        return 'M35 47 Q40 52 45 47'; // 溫暖的笑
      case 'thinking':
        return 'M37 48 L43 48'; // 一條線
      case 'sleeping':
        return 'M35 47 Q40 50 45 47'; // 安詳
      default:
        return 'M35 45 Q40 48 45 45';
    }
  };

  const getCharacterColor = () => {
    switch (currentEmotion) {
      case 'happy':
        return '#10B981'; // emerald-500
      case 'talking':
        return '#3B82F6'; // blue-500
      case 'thinking':
        return '#8B5CF6'; // violet-500
      case 'caring':
        return '#EC4899'; // pink-500
      case 'sleeping':
        return '#6B7280'; // gray-500
      default:
        return '#10B981';
    }
  };

  const emotionLabelMap: Record<'happy' | 'talking' | 'thinking' | 'caring' | 'sleeping', string> = {
    happy: '開心的AI角色',
    talking: '正在說話的AI角色',
    thinking: '思考中的AI角色',
    caring: '關懷的AI角色',
    sleeping: '睡覺的AI角色'
  };

  const computedAriaLabel = ariaLabel ?? (message ? `${emotionLabelMap[currentEmotion]}，消息：${message}` : emotionLabelMap[currentEmotion]);

  const showAura = (isAnimating || currentEmotion === 'talking') && currentEmotion !== 'sleeping';

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} mx-auto ${className ?? ''}`}
      role={onClick ? 'button' : 'img'}
      aria-label={computedAriaLabel}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {/* 光環效果 - 已取消波纹动画 */}
      {showAura && (
        <div className="absolute inset-0">
          <div 
            className="w-full h-full rounded-full opacity-20"
            style={{ backgroundColor: getCharacterColor() }}
          />
        </div>
      )}

      {/* 主要角色 */}
      <div 
        className={`relative w-full h-full rounded-full shadow-lg transition-all duration-300 ${
          showAura ? 'scale-110' : 'scale-100'
        }`}
        style={{ backgroundColor: getCharacterColor() }}
      >
        {/* 裝飾花紋 */}
        <div className="absolute top-2 right-2">
          <Sparkles className="w-4 h-4 text-white opacity-70" />
        </div>

        {/* AI角色面部 */}
        <svg 
          viewBox="0 0 80 80" 
          className="w-full h-full p-4"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          {/* 臉部背景 */}
          <circle 
            cx="40" 
            cy="40" 
            r="32" 
            fill="white" 
            opacity="0.9"
          />
          
          {/* 腮紅 */}
          {(currentEmotion === 'happy' || currentEmotion === 'caring') && (
            <>
              <circle cx="25" cy="37" r="4" fill="#FCA5A5" opacity="0.6" />
              <circle cx="55" cy="37" r="4" fill="#FCA5A5" opacity="0.6" />
            </>
          )}

          {/* 眼睛 */}
          <g className={`transition-transform duration-150 ${getEyeStyle()}`}>
            <circle cx="30" cy="32" r="3" fill="#1F2937" />
            <circle cx="50" cy="32" r="3" fill="#1F2937" />
            {/* 眼睛高光 */}
            <circle cx="31" cy="31" r="1" fill="white" />
            <circle cx="51" cy="31" r="1" fill="white" />
          </g>

          {/* 嘴巴 */}
          <path
            d={getMouthPath()}
            stroke="#1F2937"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-150"
          />

          {/* 思考泡泡 */}
          {currentEmotion === 'thinking' && (
            <g>
              <circle cx="60" cy="20" r="3" fill="white" opacity="0.8" />
              <circle cx="65" cy="15" r="2" fill="white" opacity="0.6" />
              <circle cx="68" cy="10" r="1" fill="white" opacity="0.4" />
            </g>
          )}

          {/* 愛心 */}
          {currentEmotion === 'caring' && (
            <g transform="translate(55, 25)">
              <Heart className="w-3 h-3" fill="#EC4899" stroke="none" />
            </g>
          )}

          {/* ZZZ睡眠符號 */}
          {currentEmotion === 'sleeping' && (
            <g transform="translate(55, 20)" fill="#6B7280" opacity="0.6">
              <text x="0" y="0" fontSize="8" fontFamily="serif">Z</text>
              <text x="4" y="-3" fontSize="6" fontFamily="serif">Z</text>
              <text x="7" y="-6" fontSize="4" fontFamily="serif">Z</text>
            </g>
          )}
        </svg>
      </div>

      {/* 對話氣泡 */}
      {message && (
        <div className="absolute -top-16 -left-8 bg-white rounded-2xl shadow-lg p-3 border-4 border-blue-200 max-w-48 z-10">
          <p className="text-sm text-gray-800 font-medium">{message}</p>
          {/* 氣泡尾巴 */}
          <div 
            className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200"
          />
          <div 
            className="absolute top-full left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white transform translate-y-px"
          />
        </div>
      )}
    </div>
  );
}
