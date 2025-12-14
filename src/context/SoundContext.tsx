'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SoundContextType = {
    soundEnabled: boolean;
    toggleSound: () => void;
    registerAudio: (audio: HTMLAudioElement) => void;
    stopAll: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // クライアントサイドでのみ実行
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('merelax_sound_enabled');
            if (saved !== null) {
                setSoundEnabled(saved === 'true');
            }
        }

        // アンマウント時(リロード等)に停止
        return () => stopAll();
    }, []);

    const toggleSound = () => {
        setSoundEnabled(prev => {
            const newValue = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('merelax_sound_enabled', String(newValue));
            }
            if (!newValue) {
                stopAll();
            }
            return newValue;
        });
    };

    const registerAudio = (audio: HTMLAudioElement) => {
        // 前の音を止める（単一音源ポリシーの場合）
        // stopAll(); // 必要ならここでも止めるが、SE重ねたい場合もあるので今回は止めない
        audioRef.current = audio;

        // 再生終了したら参照を消す
        audio.onended = () => {
            if (audioRef.current === audio) {
                audioRef.current = null;
            }
        };
    };

    const stopAll = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    return (
        <SoundContext.Provider value={{ soundEnabled, toggleSound, registerAudio, stopAll }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSoundContext() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSoundContext must be used within a SoundProvider');
    }
    return context;
}
