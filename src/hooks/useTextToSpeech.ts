'use client';

import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!isSupported) return;

        // 既存の発話をキャンセル
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.pitch = 1.4; // 少し高めの声でキャラっぽく
        utterance.rate = 1.1;  // 少し早口
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    }, [isSupported]);

    return { speak, isSupported };
};
