'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { logExercise } from '@/lib/api';
import SoundToggle from '@/components/merelax/SoundToggle';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import CharacterBlink from '@/components/merelax/CharacterBlink';
import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/context/AuthContext';

export default function BlinkPage() {
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [message, setMessage] = useState('');
    const [characterBlinking, setCharacterBlinking] = useState(false);
    const { playSuccessSound, playSound } = useSound();
    const { speak } = useTextToSpeech();
    const { selectedChildId } = useAuth();

    // リズムガイド音声
    useEffect(() => {
        if (!isStarted || isCompleted) return;

        // 40秒後に終了
        const finishTimer = setTimeout(() => {
            handleComplete();
        }, 40000);

        let innerTimer: NodeJS.Timeout;

        // 0s: start (intro sound)
        // delayed start loop
        const loop = () => {
            playSound('/sounds/metojiru.wav');
            setCharacterBlinking(true);
            innerTimer = setTimeout(() => {
                playSound('/sounds/mehiraku.wav');
                setCharacterBlinking(false);
            }, 800); // 0.8秒間目を閉じる
        };

        // 初回 (イントロ待機後に開始)
        const timer1 = setTimeout(loop, 2000);
        // ループ (2秒ごと)
        const interval = setInterval(loop, 2000);

        return () => {
            clearTimeout(finishTimer);
            clearTimeout(timer1);
            clearInterval(interval);
            clearTimeout(innerTimer);
        };
    }, [isStarted, isCompleted, speak, playSound]);

    const handleComplete = async () => {
        if (!selectedChildId) return;

        try {
            // 成功音SE
            playSuccessSound();
            playSound('/sounds/owarimerelax.wav');
            speak("すごい！ めが スッキリ したね");

            const today = new Date().toISOString().split('T')[0];
            const response = await logExercise(selectedChildId, {
                exercise_id: 2, // blink
                exercise_date: today,
            });

            setMessage(response.message);
            setIsCompleted(true);

            setTimeout(() => {
                router.push('/merelax');
            }, 2000);
        } catch (error) {
            setMessage('エラーが発生しました');
            console.error(error);
        }
    };

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-merelax-blink/10 flex items-center justify-center p-4">
                <div className="bg-white/80 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8 border-4 border-merelax-blink">
                    <h2 className="text-3xl font-bold text-merelax-blink">まばたき</h2>

                    <div className="space-y-4 text-xl text-gray-700 text-left">
                        <p>
                            こえに あわせて<br />
                            <strong>パチパチ</strong> まばたきを<br />
                            してみよう。
                        </p>
                        <p className="text-sm text-gray-500">
                            ※ おとが なるよ
                        </p>
                    </div>

                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full py-6 bg-merelax-blink hover:bg-merelax-blink/80 text-white rounded-2xl font-bold text-2xl shadow-lg transition-transform active:scale-95"
                    >
                        はじめる
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="text-gray-400 font-bold hover:text-gray-600 underline"
                    >
                        もどる
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-merelax-blink/10 relative flex flex-col overflow-hidden">
            {/* 背景の装飾 */}
            <motion.div
                className="absolute -top-20 -right-20 w-80 h-80 bg-merelax-blink/20 rounded-full blur-3xl z-0"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute top-1/2 -left-20 w-60 h-60 bg-yellow-200/30 rounded-full blur-3xl z-0"
                animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <header className="p-4 flex justify-between items-center z-10">
                <button onClick={() => router.back()} className="text-2xl text-gray-600 bg-white/50 backdrop-blur-sm rounded-full w-12 h-12 hover:bg-white/80 transition">✕</button>
                <SoundToggle className="text-gray-600 bg-white/50 hover:bg-white/80" />
            </header>

            <div className="flex-1 container mx-auto p-6 text-center flex flex-col justify-center items-center max-w-lg z-10">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold mb-8 text-merelax-blink"
                >
                    まばたき
                </motion.h1>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8 w-full border border-white"
                >
                    <p className="text-xl mb-8 font-bold text-gray-700">めめめちゃんの マネを してね！</p>

                    {/* キャラクター画像 (ユーザー提供 + AI生成差分) */}
                    <div className="flex justify-center items-center mb-8 relative h-64">
                        <CharacterBlink isBlinking={characterBlinking} />

                        {/* セリフの吹き出し */}
                        <motion.div
                            className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-xl rounded-bl-none shadow-md text-sm font-bold text-merelax-blink z-10"
                            animate={{ y: [0, -5, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.8] }}
                        >
                            パチパチ！
                        </motion.div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                        {/* リズムガイドバー */}
                        <motion.div
                            className="bg-merelax-blink h-2.5 rounded-full"
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <p className="text-sm text-gray-400">バーに あわせて やってみよう</p>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComplete}
                    className="bg-merelax-blink text-white text-2xl font-bold px-12 py-5 rounded-full shadow-lg border-4 border-white/50"
                >
                    できたよ！
                </motion.button>

                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotate: -20 }}
                            animate={{ scale: 1.2, rotate: 0 }}
                            transition={{ type: "spring" }}
                            className="bg-white p-8 rounded-3xl shadow-2xl text-center"
                        >
                            <div className="text-6xl mb-4">👀✨</div>
                            <div className="text-2xl font-bold text-merelax-success">
                                {message}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
