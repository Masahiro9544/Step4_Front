'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { logExercise } from '@/lib/api';
import SoundToggle from '@/components/merelax/SoundToggle';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSound } from '@/hooks/useSound';

export default function EyeTrackingPage() {
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(false);
    const [message, setMessage] = useState('');
    const { playSuccessSound } = useSound();
    const { speak } = useTextToSpeech();

    // TODO: 実際のchild_idはログイン情報から取得
    const childId = 1;

    // 応援ボイス
    useEffect(() => {
        if (isCompleted) return;
        const timer = setTimeout(() => {
            speak("その調子！ボールを目だけで追ってね");
        }, 3000);
        return () => clearTimeout(timer);
    }, [isCompleted, speak]);

    const handleComplete = async () => {
        try {
            // 成功音SE
            playSuccessSound();
            speak("素晴らしい集中力だね！");

            const today = new Date().toISOString().split('T')[0];
            const response = await logExercise(childId, {
                exercise_id: 3, // eye_tracking
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
        <div className="min-h-screen bg-[#0D1117] relative flex flex-col overflow-hidden">
            {/* 宇宙の背景 */}
            <div className="absolute inset-0 z-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: Math.random() * 1000, // 仮の範囲（実際はvwを使いたいがSSR回避のため固定値か%）
                            y: Math.random() * 800,
                            opacity: Math.random()
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                    />
                ))}
            </div>

            <header className="p-4 flex justify-between items-center z-10">
                <button onClick={() => router.back()} className="text-2xl text-white bg-white/10 backdrop-blur-sm rounded-full w-12 h-12 hover:bg-white/20 transition">✕</button>
                <SoundToggle className="text-white bg-white/10 hover:bg-white/20" />
            </header>

            <div className="flex-1 container mx-auto p-6 text-center flex flex-col justify-center items-center z-10">
                <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-glow">目の体操</h1>

                <p className="text-xl mb-6 font-bold text-gray-300">ロケットを目でおいかけてね<br /><span className="text-sm font-normal text-gray-500">（顔は動かさないでね）</span></p>

                <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                    {/* 軌道ガイド（薄く） */}
                    <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full"></div>

                    {/* 惑星（中心） */}
                    <div className="absolute w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-4xl">🌍</span>
                    </div>

                    {/* ロケットコンテナ（回転アニメーション） */}
                    <motion.div
                        className="absolute w-full h-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        {/* ロケット本体（外周に配置） */}
                        <div className="absolute top-1/2 -right-6 w-16 h-16 flex items-center justify-center transform -translate-y-1/2 rotate-90">
                            {/* キャラクター画像 (楽しそうに飛んでいる) */}
                            <img
                                src="/images/character/character_happy.png"
                                alt="Rocket Character"
                                className="w-full h-full object-contain"
                            />

                            {/* エンジン噴射パーティクル */}
                            <motion.div
                                className="absolute -bottom-4 left-1/2 w-2 h-6 bg-orange-500 rounded-full blur-sm"
                                animate={{ height: ["10px", "20px", "10px"], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 0.2, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold px-12 py-5 rounded-full shadow-lg border-2 border-white/20 hover:shadow-cyan-500/50"
                >
                    できたよ！
                </motion.button>

                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            className="bg-[#1a1f2e] p-8 rounded-3xl shadow-2xl text-center border border-white/10"
                        >
                            <div className="text-6xl mb-4">🪐💫</div>
                            <div className="text-2xl font-bold text-white">
                                {message}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
