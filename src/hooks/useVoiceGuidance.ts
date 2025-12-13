export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useState, useRef } from 'react';

export const useVoiceGuidance = () => {
    const [isReady, setIsReady] = useState(false);
    const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                voicesRef.current = voices;
                setIsReady(true);
                console.log('利用可能な音声:', voices.filter(v => v.lang.includes('ja')));
            }
        };

        // 初回読み込み
        loadVoices();

        // 音声リスト変更時のイベントリスナー
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        // iOS/Safariのための遅延読み込み
        setTimeout(loadVoices, 100);
    }, []);

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // ... (useEffect remains same) ...

    const cancel = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (typeof window === 'undefined') return;

        // Ensure voices are loaded
        if (voicesRef.current.length === 0) {
            voicesRef.current = window.speechSynthesis.getVoices();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        speechRef.current = utterance;
        utterance.lang = 'ja-JP';

        const jpVoice = voicesRef.current.find(v => v.lang === 'ja-JP')
            || voicesRef.current.find(v => v.lang.startsWith('ja'));

        if (jpVoice) {
            utterance.voice = jpVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => {
            speechRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    return { speak, cancel, isReady, voiceCount: voicesRef.current.length };
};
