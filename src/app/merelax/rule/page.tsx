'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SoundToggle from '@/components/merelax/SoundToggle';
import { useSound } from '@/hooks/useSound';
import { logExercise } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// スライドデータ定義
const SLIDES = [
    {
        id: 1,
        image: '/images/character/20sugoisisei.jpeg',
        sound: '/sounds/20sugoikakkou.wav',
        text: 'すごい かっこうで\nみていないかな？\nこれは めに よくないよ'
    },
    {
        id: 2,
        image: '/images/character/20kyori.jpeg',
        sound: '/sounds/20menokhyori.wav',
        text: 'めから がめんを\n30センチ いじょう\nはなそう'
    },
    {
        id: 3,
        image: '/images/character/20kyukei.jpeg',
        sound: '/sounds/20kyukei.wav',
        text: '30ぷんに 1かい \nきゅうけい しよう'
    },
    {
        id: 4,
        image: '/images/character/20sotowomiru.jpeg',
        sound: '/sounds/20sotowomiru.wav',
        text: 'きゅうけいの ときに\nそとを みよう'
    },
    {
        id: 5,
        image: '/images/character/20sotodeasobu.jpeg',
        sound: '/sounds/20sotodeasobu.wav',
        text: 'おそとでも あそぼう\n（できれば 2じかん くらい）'
    },
    {
        id: 6,
        image: '/images/character/20sangrass.jpeg',
        sound: '/sounds/20sungrass.wav',
        text: 'ひざしが つよい ひは\nぼうしや サングラスで\nめを まもろう'
    }
];

export default function RulePage() {
    const router = useRouter();
    const { playSound, playSuccessSound } = useSound();
    const { selectedChildId } = useAuth();

    // 状態管理
    const [isStarted, setIsStarted] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // スライド切り替え管理
    useEffect(() => {
        if (!isStarted || isCompleted) return;

        const currentSlide = SLIDES[currentSlideIndex];

        // 音声再生 (1秒遅延)
        const audioTimer = setTimeout(() => {
            playSound(currentSlide.sound);
        }, 1000);

        // 次のスライドへの遷移タイマー
        // 音声遅延(1s) + 音声/読了(7s) = 8s
        const transitionTimer = setTimeout(() => {
            if (currentSlideIndex < SLIDES.length - 1) {
                setCurrentSlideIndex(prev => prev + 1);
            } else {
                handleComplete();
            }
        }, 8000);

        return () => {
            clearTimeout(audioTimer);
            clearTimeout(transitionTimer);
        };
    }, [isStarted, currentSlideIndex, isCompleted, playSound]);

    const handleComplete = async () => {
        setIsCompleted(true);
        playSuccessSound();
        playSound('/sounds/owarimerelax.wav');

        if (!selectedChildId) return;

        try {
            const today = new Date().toISOString().split('T')[0];
            // ID 4 for Rule (added to backend crud.py)
            await logExercise(selectedChildId, {
                exercise_id: 4,
                exercise_date: today,
            });
        } catch (error) {
            console.error('Failed to log rule completion:', error);
        }
    };

    const handleNext = () => {
        if (currentSlideIndex < SLIDES.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    // 開始前画面（ここでのクリックが自動再生のトリガー権限を得る）
    if (!isStarted) {
        return (
            <div className="min-h-screen bg-[#4A90E2] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8 border-4 border-white">
                    <h2 className="text-3xl font-bold text-[#4A90E2]">めを まもる ルール</h2>

                    <div className="space-y-4 text-xl text-gray-700">
                        <p>
                            めを わるくしないための<br />
                            だいじな おやくそくだよ。
                        </p>
                        <p>
                            いっしょに かくにんしよう！
                        </p>
                    </div>

                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full py-6 bg-[#F5A623] hover:bg-[#F59E0B] text-white rounded-2xl font-bold text-2xl shadow-lg transition-transform active:scale-95 border-b-4 border-[#D97706]"
                    >
                        はじめる
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="text-white/80 font-bold hover:text-white underline"
                    >
                        もどる
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#4A90E2] text-white relative flex flex-col items-center overflow-hidden">
            {/* ヘッダー */}
            <header className="w-full p-4 flex justify-between items-center z-10">
                <button onClick={() => router.back()} className="text-3xl p-2 opacity-80 hover:opacity-100">✕</button>
                <div className="flex gap-2">
                    {/* 進捗ドット */}
                    <div className="flex gap-1 bg-white/20 rounded-full px-3 py-1 items-center">
                        {SLIDES.map((s, i) => (
                            <div
                                key={s.id}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentSlideIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                    <SoundToggle />
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-4xl z-0">
                <AnimatePresence mode="wait">
                    {!isCompleted ? (
                        <motion.div
                            key={currentSlideIndex}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white rounded-3xl p-6 shadow-2xl text-center w-full max-w-lg border-4 border-white/50"
                        >
                            {/* 画像エリア */}
                            <div className="relative w-full aspect-[4/3] mb-6 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                                <Image
                                    src={SLIDES[currentSlideIndex].image}
                                    alt="Rule Illustration"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* テキストエリア */}
                            <motion.p
                                key={`text-${currentSlideIndex}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed whitespace-pre-wrap"
                            >
                                {SLIDES[currentSlideIndex].text}
                            </motion.p>

                            {/* 操作ボタン */}
                            <div className="mt-8 flex justify-between items-center px-4">
                                <button
                                    onClick={handleBack}
                                    disabled={currentSlideIndex === 0}
                                    className={`p-2 rounded-full hover:bg-gray-100 text-gray-400 ${currentSlideIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                                >
                                    ◀︎ もどる
                                </button>

                                <span className="text-sm font-bold text-gray-400">
                                    {currentSlideIndex + 1} / {SLIDES.length}
                                </span>

                                <button
                                    onClick={handleNext}
                                    className="p-2 rounded-full hover:bg-gray-100 text-[#4A90E2] font-bold"
                                >
                                    つぎへ ▶︎
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="complete"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full"
                        >
                            <div className="text-6xl mb-6">✨👀✨</div>
                            <h2 className="text-2xl font-bold text-[#4A90E2] mb-4">
                                ぜんぶ みてくれて<br />ありがとう！
                            </h2>
                            <p className="text-gray-600 mb-8 font-bold">
                                これで めを まもる<br />マスターだね！
                            </p>

                            <button
                                onClick={() => router.push('/merelax')}
                                className="w-full py-4 bg-[#4A90E2] hover:bg-[#357ABD] text-white rounded-xl font-bold text-xl shadow-lg transition"
                            >
                                トップへ もどる
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 自動再生バー */}
            {!isCompleted && isStarted && (
                <div className="absolute bottom-0 left-0 h-2 bg-white/30 w-full">
                    <motion.div
                        key={currentSlideIndex}
                        className="h-full bg-[#F5A623]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 8, ease: "linear" }}
                    />
                </div>
            )}
        </div>
    );
}
