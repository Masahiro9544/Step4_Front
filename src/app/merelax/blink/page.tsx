'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { logExercise } from '@/lib/api';
import SoundToggle from '@/components/merelax/SoundToggle';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import CharacterBlink from '@/components/merelax/CharacterBlink';
import { useSound } from '@/hooks/useSound';

export default function BlinkPage() {
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(false);
    const [message, setMessage] = useState('');
    const { playSuccessSound } = useSound();
    const { speak } = useTextToSpeech();

    // TODO: 実際のchild_idはログイン情報から取得
    const childId = 1;

    // リズムガイド音声
    useEffect(() => {
        if (isCompleted) return;

        // CSSアニメーション(4秒周期)に合わせて声を出す
        // 0s: start (開いている)
        // 0.2s: closing (閉じて)
        // 2.0s: opening (開けて)
        const loop = () => {
            speak("閉じて〜");
            setTimeout(() => {
                speak("パッ！");
            }, 2000);
        };

        // 初回
        const timer1 = setTimeout(loop, 100);
        // ループ
        const interval = setInterval(loop, 4000);

        return () => {
            clearTimeout(timer1);
            clearInterval(interval);
        };
    }, [isCompleted, speak]);

    const handleComplete = async () => {
        try {
            // 成功音SE
            playSuccessSound();
            speak("すごい！目がスッキリしたね");

            const today = new Date().toISOString().split('T')[0];
            const response = await logExercise(childId, {
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
                    <p className="text-xl mb-8 font-bold text-gray-700">パチパチくんのマネをしてね！</p>

                    {/* キャラクター画像 (ユーザー提供 + AI生成差分) */}
                    <div className="flex justify-center items-center mb-8 relative h-64">
                        <CharacterBlink />

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
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <p className="text-sm text-gray-400">バーに合わせてやってみよう</p>
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
