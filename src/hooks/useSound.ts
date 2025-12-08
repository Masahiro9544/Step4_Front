'use client';

import { useState, useEffect } from 'react';

export function useSound() {
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        // ローカルストレージから設定を読み込み
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('merelax_sound_enabled');
            if (saved !== null) {
                setSoundEnabled(saved === 'true');
            }
        }
    }, []);

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        if (typeof window !== 'undefined') {
            localStorage.setItem('merelax_sound_enabled', String(newValue));
        }
    };

    const playButtonSound = () => {
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
    };

    const playSuccessSound = () => {
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
    };

    // 既存のplaySoundは互換性のために残すが、基本はSE生成を使う
    const playSound = (audioUrl: string) => {
        if (!soundEnabled) return;
        const audio = new Audio(audioUrl);
        audio.play().catch(console.error);
    };

    return { soundEnabled, toggleSound, playSound, playButtonSound, playSuccessSound };
}
