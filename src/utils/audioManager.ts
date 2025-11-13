/**
 * 全局音频管理工具
 * 确保同时只播放一个音频
 */

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

    // 等待一下确保之前的音频已停止
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'zh-HK';
      utterance.rate = options.rate || 0.8;
      utterance.volume = options.volume || 1.0;

      utterance.onstart = () => {
        if (options.onStart) {
          options.onStart();
        }
      };

      utterance.onend = () => {
        if (options.onEnd) {
          options.onEnd();
        }
        resolve();
      };

      utterance.onerror = (event) => {
        if (options.onError) {
          options.onError(event);
        }
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
  window.speechSynthesis.cancel();
}

/**
 * 检查是否有音频正在播放
 */
export function isAudioPlaying(): boolean {
  return window.speechSynthesis.speaking;
}
