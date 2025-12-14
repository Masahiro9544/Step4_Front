'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSound } from './useSound';

export const useTextToSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);
    const { soundEnabled } = useSound();
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);

            // 音声リストの読み込み待機と設定
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                const jpVoice = voices.find(v => v.lang.includes('ja')) || voices[0];
                setVoice(jpVoice);
                console.log("Voice loaded:", jpVoice?.name);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!isSupported) {
            console.log("Speech not supported");
            return;
        }
        if (!soundEnabled) {
            console.log("Speech skipped (Muted)");
            return;
        }

        console.log("Speaking:", text);

        // 既存の発話をキャンセル
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        if (voice) {
            utterance.voice = voice;
        }
        utterance.pitch = 1.4;
        utterance.rate = 1.1;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    }, [isSupported, soundEnabled, voice]);

    const cancel = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    return { speak, cancel, isSupported };
};
