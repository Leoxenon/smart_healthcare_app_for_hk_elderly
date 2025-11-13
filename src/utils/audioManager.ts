/**
 * 全局音频管理工具
 * 确保同时只播放一个音频
 */

// 用于追踪当前正在播放的utterance，以便在手动停止时不触发回调
let currentUtterance: SpeechSynthesisUtterance | null = null;
let isManuallyStopped = false;

/**
 * 播放语音，会自动停止之前正在播放的音频
 * @param text 要朗读的文本
 * @param options 语音选项
 * @returns Promise，在音频结束时resolve
 */
export function speakText(
  text: string,
  options: {
    lang?: string;
    rate?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (event: SpeechSynthesisErrorEvent) => void;
  } = {}
): Promise<void> {
  return new Promise((resolve) => {
    // 先停止所有正在播放的音频
    window.speechSynthesis.cancel();
    isManuallyStopped = false; // 重置标志

    // 等待一下确保之前的音频已停止
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'zh-HK';
      utterance.rate = options.rate || 0.8;
      utterance.volume = options.volume || 1.0;
      
      currentUtterance = utterance;

      utterance.onstart = () => {
        if (!isManuallyStopped && options.onStart) {
          options.onStart();
        }
      };

      utterance.onend = () => {
        if (!isManuallyStopped && options.onEnd) {
          options.onEnd();
        }
        currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        // 只有在不是手动停止的情况下才触发错误回调
        if (!isManuallyStopped && options.onError) {
          options.onError(event);
        }
        currentUtterance = null;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    }, 100);
  });
}

/**
 * 停止所有正在播放的音频
 */
export function stopAllAudio(): void {
  isManuallyStopped = true; // 设置标志，防止回调触发
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

/**
 * 检查是否有音频正在播放
 */
export function isAudioPlaying(): boolean {
  return window.speechSynthesis.speaking;
}
