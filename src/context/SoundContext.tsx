'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/utils/axios';

type SoundContextType = {
    soundEnabled: boolean;
    toggleSound: () => void;
    setSound: (enabled: boolean) => void;
    registerAudio: (audio: HTMLAudioElement) => void;
    stopAll: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [soundEnabled, setSoundEnabledState] = useState(true);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // クライアントサイドでのみ実行
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('merelax_sound_enabled');
            if (saved !== null) {
                setSoundEnabledState(saved === 'true');
            }
        }

        // アンマウント時(リロード等)に停止
        return () => stopAll();
    }, []);

    // ユーザーログイン時にDB設定を同期
    const { user } = useAuth();
    useEffect(() => {
        const syncSettings = async () => {
            if (!user?.parent_id) return;
            try {
                // SettingsAPIは /api/settings/... (v1ではない) なので baseURL を上書き
                const { data } = await api.get(`/settings/${user.parent_id}`, {
                    baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`
                });
                if (data && typeof data.voice_enabled === 'boolean') {
                    setSoundEnabledState(data.voice_enabled);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('merelax_sound_enabled', String(data.voice_enabled));
                    }
                }
            } catch (e) {
                console.error('Failed to sync global sound settings', e);
            }
        };
        syncSettings();
    }, [user?.parent_id]);

    const setSound = (enabled: boolean) => {
        setSoundEnabledState(enabled);
        if (typeof window !== 'undefined') {
            localStorage.setItem('merelax_sound_enabled', String(enabled));
        }
        if (!enabled) {
            stopAll();
        }
    };

    const toggleSound = () => {
        setSound(!soundEnabled);
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
        <SoundContext.Provider value={{ soundEnabled, toggleSound, setSound, registerAudio, stopAll }}>
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
