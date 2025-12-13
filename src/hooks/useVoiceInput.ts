export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction } from './useVisionTest';

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

export const useVoiceInput = (onAnswer: (dir: Direction | 'start') => void, isPaused: boolean) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // 意図した状態（ユーザーが停止ボタンを押すまでtrue）
    const isActiveRef = useRef(false);
    const isPausedRef = useRef(isPaused);
    const onAnswerRef = useRef(onAnswer);

    useEffect(() => {
        onAnswerRef.current = onAnswer;
    }, [onAnswer]);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('このブラウザは音声認識に対応していません');
            return;
        }

        const recognitionInstance = new SpeechRecognition();

        recognitionInstance.lang = 'ja-JP';
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.maxAlternatives = 5;

        recognitionInstance.onstart = () => {
            console.log('音声認識開始');
            setIsListening(true);
            setError(null);
        };

        recognitionInstance.onend = () => {
            console.log('音声認識終了');
            setIsListening(false);

            // 自動再起動：ユーザーが意図的に停止していない限り再起動する
            setTimeout(() => {
                if (isActiveRef.current) {
                    console.log('自動再起動を試みます...');
                    try {
                        recognitionInstance.start();
                    } catch (e) {
                        console.log('再起動失敗:', e);
                    }
                }
            }, 300);
        };

        recognitionInstance.onerror = (event: any) => {
            console.error('音声認識エラー:', event.error);
            if (event.error === 'no-speech' || event.error === 'aborted') return;
            setError(`音声認識エラー: ${event.error}`);
            setIsListening(false);
        };

        recognitionInstance.onresult = (event: any) => {
            if (isPausedRef.current) return;

            const last = event.results.length - 1;
            const result = event.results[last];
            if (!result.isFinal) return;

            let bestTranscript = '';
            let bestConfidence = 0;

            for (let i = 0; i < result.length; i++) {
                const alternative = result[i];
                if (alternative.confidence > bestConfidence) {
                    bestConfidence = alternative.confidence;
                    bestTranscript = alternative.transcript;
                }
            }

            const transcript = bestTranscript.trim().toLowerCase();
            console.log(`音声入力: "${transcript}" (信頼度: ${bestConfidence})`);

            const normalized = transcript.replace(/\s+/g, '').toLowerCase();

            // 上
            if (normalized.match(/上|うえ|ウエ|上へ|うえへ|↑/)) {
                onAnswerRef.current('up');
            }
            // 下
            else if (normalized.match(/下|した|シタ|下へ|したへ|↓/)) {
                onAnswerRef.current('down');
            }
            // 左
            else if (normalized.match(/左|ひだり|ヒダリ|左へ|ひだりへ|←/)) {
                onAnswerRef.current('left');
            }
            // 右
            else if (normalized.match(/右|みぎ|ミギ|右へ|みぎへ|→/)) {
                onAnswerRef.current('right');
            }
            // スタート
            else if (normalized.match(/ok|オーケー|オッケー|はい|スタート|はじめ|準備|いいよ/)) {
                (onAnswerRef.current as any)('start');
            }
        };

        recognitionRef.current = recognitionInstance;

        return () => {
            isActiveRef.current = false; // アンマウント時は停止
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.abort();
            }
        };
    }, []);

    const startListening = useCallback(() => {
        isActiveRef.current = true; // 意図的開始
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error('音声認識開始エラー:', e);
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        isActiveRef.current = false; // 意図的停止
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const toggleListening = useCallback(() => {
        if (isActiveRef.current) {
            stopListening();
        } else {
            startListening();
        }
    }, [startListening, stopListening]);

    return { isListening, error, startListening, stopListening, toggleListening };
};
