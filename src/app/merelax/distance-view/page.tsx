'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { logExercise } from '@/lib/api';
import SoundToggle from '@/components/merelax/SoundToggle';
import CloudBackground from '@/components/merelax/CloudBackground';
import { useSound } from '@/hooks/useSound';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import CharacterDistance from '@/components/merelax/CharacterDistance';
import { useAuth } from '@/context/AuthContext';

export default function DistanceViewPage() {
    const router = useRouter();
    const [timer, setTimer] = useState(20);
    const [isCompleted, setIsCompleted] = useState(false);
    const [message, setMessage] = useState('');
    const { playSuccessSound, playSound } = useSound();
    const { speak } = useTextToSpeech();
    const { selectedChildId } = useAuth();

    const [isStarted, setIsStarted] = useState(false);

    const handleComplete = useCallback(async () => {
        if (!selectedChildId) return;

        try {
            // 成功音SE
            playSuccessSound();
            playSound('/sounds/owarimerelax.wav');
            speak("よくやったね！");

            const today = new Date().toISOString().split('T')[0];
            const response = await logExercise(selectedChildId, {
                exercise_id: 1, // distance_view
                exercise_date: today,
            });

            setMessage(response.message);
            setIsCompleted(true);

            // 2秒後にトップページへ
            setTimeout(() => {
                router.push('/merelax');
            }, 2000);
        } catch (error) {
            setMessage('エラーが発生しました');
            console.error(error);
        }
    }, [childId, playSound, playSuccessSound, speak, router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isStarted && timer > 0 && !isCompleted) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    const next = prev - 1;
                    // カウントダウン音声 (5秒前、3,2,1)
                    if (next === 10) speak("あと10秒だよ");
                    if (next <= 5 && next > 0) speak(String(next));
                    if (next === 0) speak("おしまい！");
                    return next;
                });
            }, 1000);
        } else if (isStarted && timer === 0 && !isCompleted) {
            // 自動終了
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isStarted, timer, isCompleted, speak, handleComplete]);

    if (!isStarted) {
        return (
            <div className="min-h-screen bg-[#E0F2F7] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8 border-4 border-[#0093D0]">
                    <h2 className="text-3xl font-bold text-[#0093D0]">とおくを みよう</h2>

                    <div className="space-y-4 text-xl text-gray-700 text-left">
                        <p>
                            まどから<br />
                            <strong>とおくの くもや けしき</strong>を<br />
                            みてみよう。
                        </p>
                        <p className="text-sm text-gray-500">
                            ※ じゅんびができたら<br />
                            「はじめる」をおしてね
                        </p>
                    </div>

                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-200">
                        ⚠️ たいようは みないでね！
                    </div>

                    <button
                        onClick={() => {
                            setIsStarted(true);
                            playSound('/sounds/tokujissityu.wav');
                        }}
                        className="w-full py-6 bg-[#0093D0] hover:bg-[#007bb5] text-white rounded-2xl font-bold text-2xl shadow-lg transition-transform active:scale-95"
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
        <div className="min-h-screen relative flex flex-col overflow-hidden">
            {/* 背景 (雲のアート) */}
            <CloudBackground />

            {/* 浮遊する雲（装飾） */}
            <motion.div
                className="absolute top-20 left-10 text-white/60 z-0"
                animate={{ x: [0, 100], opacity: [0.8, 0.4] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            >
                <svg width="120" height="80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5,12c-0.2,0-0.3,0-0.5,0.1c-0.6-2.9-3.2-5.1-6.1-5.1c-2.7,0-5.1,1.8-5.9,4.4c-0.2,0-0.4-0.1-0.6-0.1C2.5,11.3,0.1,13.7,0.1,16.6 c0,3,2.4,5.4,5.4,5.4h13c2.5,0,4.5-2,4.5-4.5C23,14.5,21,12,18.5,12z" />
                </svg>
            </motion.div>

            <header className="p-4 flex justify-between items-center z-10 w-full">
                <button
                    onClick={() => router.back()}
                    className="bg-white/50 hover:bg-white/80 text-gray-700 font-bold py-2 px-4 rounded-full backdrop-blur-sm transition-all"
                >
                    ✕ やめる
                </button>
                <SoundToggle className="text-gray-600 bg-white/50 hover:bg-white/80" />
            </header>

            {/* メインコンテンツ - モバイル最適化レイアウト */}
            <div className="relative z-10 w-full flex-1 flex flex-col p-4 pointer-events-none">

                {/* 中央は空ける (景色用) */}
                <div className="flex-1"></div>

                {/* 完了ボタン (画面中央に大きく表示) */}
                {!isCompleted && timer === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleComplete}
                            className="bg-merelax-distance text-white text-2xl md:text-3xl font-bold px-12 py-6 rounded-full shadow-2xl border-4 border-white pointer-events-auto animate-pulse"
                        >
                            できた！
                        </motion.button>
                    </div>
                )}

                {/* HUD: 下部情報 (キャラと被らないようたぶん左寄せ) */}
                <div className="absolute bottom-10 left-4 right-4 flex justify-between items-end pb-4 md:pb-8 max-w-[calc(100%-160px)]">
                    {/* 左下: 情報まとめ (タイマーとテキストを一緒に) */}
                    <div className="flex flex-col-reverse md:flex-row items-start md:items-end gap-4 pointer-events-auto">

                        {/* タイマー表示 */}
                        <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    stroke="white"
                                    strokeWidth="8"
                                    fill="rgba(255, 255, 255, 0.2)"
                                />
                                <motion.circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    stroke="#A7F3D0"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray="282.7"
                                    strokeDashoffset={282.7 * (1 - timer / 20)}
                                    strokeLinecap="round"
                                    animate={{ strokeDashoffset: 282.7 * (1 - timer / 20) }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{timer}</span>
                            </div>
                        </div>

                        {/* 指示メッセージ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/40 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 mb-2 md:mb-0"
                        >
                            <h1 className="text-lg md:text-xl font-bold mb-1 text-gray-800 drop-shadow-sm">とおくを みよう</h1>
                            <p className="text-sm md:text-base font-bold text-gray-700 mb-1 leading-tight">まどの そとの けしきを みて！</p>
                            <div className="bg-red-500 text-white text-[10px] md:text-xs py-1 px-2 rounded-full inline-block font-bold shadow-sm whitespace-nowrap">
                                ⚠️ たいようは みないで
                            </div>
                        </motion.div>
                    </div>
                </div>

                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
                    >
                        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="text-8xl mb-4"
                            >
                                🎉
                            </motion.div>
                            <div className="text-2xl font-bold text-merelax-success">
                                {message}
                            </div>
                        </div>
                    </motion.div>
                )}


            </div>

            {/* キャラクター（一緒に外を見ている → 完了後喜ぶ） */}
            <CharacterDistance isCompleted={isCompleted} />
        </div>
    );
}
