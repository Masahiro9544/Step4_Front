'use client';

import { useCallback } from 'react';
import { useSoundContext } from '@/context/SoundContext';

export function useSound() {
    // コンテキストからグローバルな状態を取得
    const { soundEnabled, toggleSound, registerAudio, stopAll } = useSoundContext();

    const playButtonSound = useCallback(() => {
        if (!soundEnabled) return;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }, [soundEnabled]);

    const playSuccessSound = useCallback(() => {
        if (!soundEnabled) return;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

        // ファンファーレ風 (ド・ミ・ソ・ド↑)
        const notes = [261.63, 329.63, 392.00, 523.25];

        notes.forEach((note, i) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.type = 'triangle';
            osc.frequency.value = note;

            const now = audioCtx.currentTime + i * 0.1;
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

            osc.start(now);
            osc.stop(now + 0.5);
        });
    }, [soundEnabled]);

    // 既存のplaySoundは互換性のために残すが、基本はSE生成を使う
    const playSound = useCallback((audioUrl: string) => {
        if (!soundEnabled) return;

        // 既存の音を止めてから鳴らす (被りを防ぐため) 
        stopAll();

        const audio = new Audio(audioUrl);
        // 音量を30%に設定（大きすぎるため）
        audio.volume = 0.3;
        registerAudio(audio);
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // 自動再生ポリシーエラーや、play()直後のpause()による中断エラーを無視
                if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
                    // console.log('Audio playback was prevented or interrupted:', error);
                } else {
                    console.error('Audio playback error:', error);
                }
            });
        }
    }, [soundEnabled, stopAll, registerAudio]);

    return { soundEnabled, toggleSound, playSound, playButtonSound, playSuccessSound, stopAll };
}
