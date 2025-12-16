'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { logExercise } from '@/lib/api';
import SoundToggle from '@/components/merelax/SoundToggle';

import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/context/AuthContext';

export default function JumpPage() {
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(0);
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [showCharacter, setShowCharacter] = useState(false);
    const { playSuccessSound, playSound } = useSound();

    const { selectedChildId } = useAuth();

    const handleComplete = async () => {
        if (!selectedChildId) return;

        try {
            // ボイスを最優先で再生
            playSound('/sounds/owarimerelax.wav');

            // ファンファーレは少し遅らせる
            setTimeout(() => {
                playSuccessSound();
            }, 1000);


            const today = new Date().toISOString().split('T')[0];

            // ログ送信にタイムアウトを設定 (3秒で強制終了)
            const logPromise = logExercise(selectedChildId, {
                exercise_id: 3,
                exercise_date: today,
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Log timeout')), 3000));
            const response: any = await Promise.race([logPromise, timeoutPromise]);

            setMessage(response.message);
        } catch (error) {
            setMessage('すごい！ たくさん みつけたね！');
            console.error("Logging error or timeout:", error);
        } finally {
            setIsCompleted(true);
            setTimeout(() => {
                router.push('/merelax');
            }, 3000);
        }
    };

    // 最新のhandleCompleteを保持するRef
    const handleCompleteRef = useRef(handleComplete);
    useEffect(() => {
        handleCompleteRef.current = handleComplete;
    }, [handleComplete]);

    // 終了タイマー (40秒固定)
    useEffect(() => {
        if (!isStarted || isCompleted) return;
        const timer = setTimeout(() => {
            handleCompleteRef.current();
        }, 40000);
        return () => clearTimeout(timer);
    }, [isStarted, isCompleted]);

    // ゲームループ
    useEffect(() => {
        if (!isStarted || isCompleted) return;

        // 前回の位置（象限管理用: 0=左上, 1=右上, 2=左下, 3=右下）
        let prevQuadrant = -1;

        // キャラクタ出現ループ
        const interval = setInterval(() => {
            // 4分割のエリアからランダムに選ぶ（同じエリアに連続して出ないようにする）
            let quadrant = Math.floor(Math.random() * 4);
            if (quadrant === prevQuadrant) {
                quadrant = (quadrant + 1) % 4;
            }
            prevQuadrant = quadrant;

            // エリア内のランダムな位置オフセット (10% ~ 40%)
            // quadrant 0: T:10-40, L:10-40
            // quadrant 1: T:10-40, L:60-90
            // quadrant 2: T:60-90, L:10-40
            // quadrant 3: T:60-90, L:60-90

            let baseTop = (quadrant >= 2) ? 50 : 0;
            let baseLeft = (quadrant % 2 === 1) ? 50 : 0;

            const top = `${baseTop + Math.random() * 30 + 10}%`;
            const left = `${baseLeft + Math.random() * 30 + 10}%`;

            setPosition({ top, left });
            setShowCharacter(true);

            // 1秒後に消える
            setTimeout(() => {
                setShowCharacter(false);
            }, 1200);

        }, 1500);

        return () => {
            clearInterval(interval);
        };
    }, [isStarted, isCompleted]);



    if (!isStarted) {
        return (
            <div className="min-h-screen bg-[#2c3e50] flex items-center justify-center p-4">
                <div className="bg-[#34495e] p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8 border-4 border-white/20">
                    <h2 className="text-3xl font-bold text-white drop-shadow-glow">あっち こっち</h2>
                    <p className="text-xl text-gray-300">
                        キャラクターが いろんなところに<br />
                        でてくるよ！<br />
                        キョロキョロ さがしてね！
                    </p>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full py-6 bg-[#2ECC71] hover:bg-[#27ae60] text-white rounded-2xl font-bold text-2xl shadow-lg transition-transform active:scale-95"
                    >
                        はじめる
                    </button>
                    <button onClick={() => router.back()} className="text-gray-400 underline">もどる</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2c3e50] relative overflow-hidden">
            <header className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
                <button onClick={() => router.back()} className="text-2xl text-white bg-white/10 backdrop-blur-sm rounded-full w-12 h-12 hover:bg-white/20 transition">✕</button>
                <SoundToggle className="text-white bg-white/10 hover:bg-white/20" />
            </header>

            <AnimatePresence>
                {showCharacter && (
                    <motion.div
                        className="absolute w-24 h-24 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ top: position.top, left: position.left }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img
                            src="/images/character/character_surprised.png"
                            alt="Character"
                            className="w-full h-full object-contain drop-shadow-lg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {isCompleted && (
                <motion.div
                    key="modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ y: 50 }}
                        animate={{ y: 0 }}
                        className="bg-[#1a1f2e] p-8 rounded-3xl shadow-2xl text-center border border-white/10"
                    >
                        <div className="text-6xl mb-4">👀✨</div>
                        <div className="text-2xl font-bold text-white">
                            {message}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
