// Fixed syntax error
import { useCallback, useRef } from 'react';

export const useSound = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const stopSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    }, []);

    const playSound = useCallback((fileName: string) => {
        // 既存の音声を停止
        stopSound();

        // 現在はローカルのpublicフォルダを参照
        const baseUrl = '/sounds';
        const url = `${baseUrl}/${fileName}`;
        console.log(`Attempting to play sound: ${url}`);

        const audio = new Audio(url);
        audioRef.current = audio;

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`Successfully started playing: ${url}`);
            }).catch(error => {
                console.error(`Error playing sound (${url}):`, error);
                if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
                    // console.log('Audio playback was prevented or interrupted:', error);
                }
            });
        }

        // 再生終了時にrefをクリア
        audio.onended = () => {
            if (audioRef.current === audio) {
                audioRef.current = null;
            }
        };
    }, [stopSound]);

    return { playSound, stopSound };
};
