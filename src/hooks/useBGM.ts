'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export const useBGM = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const isPlayingRef = useRef(false);
    const nextNoteTimeRef = useRef(0);
    const timerIDRef = useRef<number | null>(null);

    // オルゴール風の簡単なメロディ (ドレミ...)
    // C4, E4, G4, B4, C5 ...
    const melody = [261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63];
    const currentNoteIndexRef = useRef(0);

    const scheduleNote = useCallback((beatNumber: number, time: number) => {
        if (!audioContextRef.current) return;

        const osc = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // 音色設定: Sine波でオルゴールっぽく
        osc.type = 'sine';

        // 音程
        const note = melody[beatNumber % melody.length];
        // ランダムに少しゆらぎを与える
        const frequency = note + (Math.random() * 2 - 1);
        osc.frequency.value = frequency;

        // エンベロープ（音の減衰）
        gainNode.gain.setValueAtTime(0.05, time); // 音量控えめ
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1.5);

        osc.start(time);
        osc.stop(time + 1.5);
    }, []);

    const scheduler = useCallback(() => {
        if (!audioContextRef.current) return;

        // 0.1秒先までスケジュール
        while (nextNoteTimeRef.current < audioContextRef.current.currentTime + 0.1) {
            scheduleNote(currentNoteIndexRef.current, nextNoteTimeRef.current);
            // テンポ: 0.5秒間隔
            nextNoteTimeRef.current += 0.5;
            currentNoteIndexRef.current++;
        }

        if (isPlayingRef.current) {
            timerIDRef.current = window.setTimeout(scheduler, 25);
        }
    }, [scheduleNote]);

    const playBGM = useCallback(() => {
        if (isPlayingRef.current) return;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        isPlayingRef.current = true;
        currentNoteIndexRef.current = 0;
        nextNoteTimeRef.current = audioContextRef.current.currentTime;
        scheduler();
    }, [scheduler]);

    const stopBGM = useCallback(() => {
        isPlayingRef.current = false;
        if (timerIDRef.current) {
            clearTimeout(timerIDRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            stopBGM();
        };
    }, [stopBGM]);

    return { playBGM, stopBGM };
};
