'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSound } from './useSound';

export const useBGM = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const isPlayingRef = useRef(false);
    const nextNoteTimeRef = useRef(0);
    const timerIDRef = useRef<number | null>(null);
    const { soundEnabled } = useSound(); // グローバル設定を利用

    // 明るく楽しいメロディ (C Major: ドレミファソラシド)
    // C6, D6, E6, F6, G6, A6, B6, C7 (higher pitch)
    const melody = [1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00, 1975.53, 2093.00];
    const currentNoteIndexRef = useRef(0);

    const scheduleNote = useCallback((beatNumber: number, time: number) => {
        if (!audioContextRef.current) return;

        const osc = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // 音色設定: Triangle波で明るく優しい音に
        osc.type = 'triangle';

        // 音程: ランダムに選んで楽しい感じに
        // ここでは簡単なアルペジオ風にする
        const note = melody[Math.floor(Math.random() * melody.length)];

        osc.frequency.value = note;

        // エンベロープ（ふわっと鳴る）
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.02, time + 0.05); // Softer, slightly faster attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.7); // Shorter release for brighter sound

        osc.start(time);
        osc.stop(time + 1.0);
    }, []);

    const scheduler = useCallback(() => {
        if (!audioContextRef.current) return;

        // 0.1秒先までスケジュール
        while (nextNoteTimeRef.current < audioContextRef.current.currentTime + 0.1) {
            scheduleNote(currentNoteIndexRef.current, nextNoteTimeRef.current);
            // テンポ: 少しゆったりめ (0.4秒間隔)
            nextNoteTimeRef.current += 0.4;
            currentNoteIndexRef.current++;
        }

        if (isPlayingRef.current) {
            timerIDRef.current = window.setTimeout(scheduler, 25);
        }
    }, [scheduleNote]);

    const startAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    const playBGM = useCallback(() => {
        startAudioContext();
        if (isPlayingRef.current) return;

        isPlayingRef.current = true;
        currentNoteIndexRef.current = 0;
        // 現在時刻より少し先から開始しないと音が詰まることがある
        if (audioContextRef.current) {
            nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
        }
        scheduler();
    }, [scheduler, startAudioContext]);

    const stopBGM = useCallback(() => {
        isPlayingRef.current = false;
        if (timerIDRef.current) {
            clearTimeout(timerIDRef.current);
            timerIDRef.current = null;
        }
    }, []);

    // soundEnabledの変更を監視して再生/停止を切り替え
    useEffect(() => {
        if (soundEnabled) {
            // 自動再生を試みる（ブラウザにブロックされる可能性はある）
            const attemptPlay = async () => {
                try {
                    // AudioContextの初期化だけはしておく
                    startAudioContext();
                    playBGM();
                } catch (e) {
                    console.log("BGM autoplay prevented:", e);
                }
            };
            attemptPlay();
        } else {
            stopBGM();
        }
    }, [soundEnabled, playBGM, stopBGM, startAudioContext]);

    // クリーンアップ
    useEffect(() => {
        return () => {
            stopBGM();
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(console.error);
                audioContextRef.current = null;
            }
        };
    }, [stopBGM]);

    return { playBGM, stopBGM };
};
