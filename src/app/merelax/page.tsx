'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getExerciseStats } from '@/lib/api';
import { ExerciseStats } from '@/types/exercise';
import StatsHeader from '@/components/merelax/StatsHeader';
import TodayProgress from '@/components/merelax/TodayProgress';
import ExerciseButton from '@/components/merelax/ExerciseButton';
import SoundToggle from '@/components/merelax/SoundToggle';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import CharacterGreeting from '@/components/merelax/CharacterGreeting';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useBGM } from '@/hooks/useBGM';
import { useSound } from '@/hooks/useSound';

export default function MerelaxPage() {
    const router = useRouter();
    const [stats, setStats] = useState<ExerciseStats | null>(null);
    const [loading, setLoading] = useState(true);

    const { speak } = useTextToSpeech();
    const { playBGM, stopBGM } = useBGM();
    const { soundEnabled } = useSound();

    // TODO: 実際のchild_idはログイン情報から取得
    const childId = 1;

    useEffect(() => {
        fetchStats();
        // コンポーネントアンマウント時にBGM停止
        return () => stopBGM();
    }, [stopBGM]);

    // サウンド有効時にBGM再生
    useEffect(() => {
        if (soundEnabled && !loading) {
            // ユーザーインタラクションなしでの自動再生はブラウザにブロックされる可能性があるため、
            // 本来は「スタート」ボタン等で開始するのがベストだが、
            // ここでは簡易的にロード完了後に再生試行する
            const playPromise = async () => {
                try {
                    playBGM();
                } catch (e) {
                    console.log("BGM autoplay blocked", e);
                }
            };
            playPromise();

            // 初回のみ挨拶
            speak("こんにちは！今日も目を大切にしようね");
        } else {
            stopBGM();
        }
    }, [soundEnabled, loading, playBGM, stopBGM, speak]);

    const fetchStats = async () => {
        try {
            const data = await getExerciseStats(childId);
            setStats(data);
        } catch (error) {
            console.error('統計情報の取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <div className="animate-bounce text-merelax-primary text-2xl font-bold">●</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-main pb-20 relative" onClick={() => {
            // ユーザーアクションをトリガーにBGM開始（ブロック回避）
            if (soundEnabled) playBGM();
        }}>
            <AnimatedBackground />


            <div className="relative z-10 w-full max-w-md mx-auto">
                <header className="p-4 flex justify-between items-center sticky top-0 z-50 bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-sm mb-4">
                    <div className="flex items-center gap-2">
                        <CharacterGreeting />
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-gray-800 drop-shadow-sm"
                        >
                            MeRelax
                        </motion.h1>
                    </div>
                    <SoundToggle />
                </header>
                {/* 統計情報 - ふわっと出現 */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {stats && <StatsHeader stats={stats} />}
                </motion.div>

                {/* 今日の達成状況 - 少し遅れて出現 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {stats && <TodayProgress completed={stats.today_completed} />}
                </motion.div>

                {/* 機能ボタン - 順番にポヨンと出現 */}
                <div className="p-4 space-y-4 mt-4">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ExerciseButton
                            title="20-20-20ルール"
                            subtitle="目を守る方法を知ろう"
                            color="bg-merelax-rule"
                            onClick={() => {
                                speak("20-20-20ルールを知ろう！");
                                router.push('/merelax/rule');
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ExerciseButton
                            title="遠くを見よう"
                            subtitle="空や外を見てみよう"
                            color="bg-merelax-distance"
                            completed={stats?.today_completed.includes('distance_view')}
                            onClick={() => {
                                speak("遠くを見にいこう！");
                                router.push('/merelax/distance-view');
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ExerciseButton
                            title="まばたき"
                            subtitle="パチパチしよう"
                            color="bg-merelax-blink"
                            completed={stats?.today_completed.includes('blink')}
                            onClick={() => {
                                speak("パチパチしにいこう！");
                                router.push('/merelax/blink');
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ExerciseButton
                            title="目の体操"
                            subtitle="ぐるぐる動かそう"
                            color="bg-merelax-tracking"
                            completed={stats?.today_completed.includes('eye_tracking')}
                            onClick={() => {
                                speak("目をぐるぐるしよう！");
                                router.push('/merelax/eye-tracking');
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6"
                    >
                        <button
                            onClick={() => router.push('/home')}
                            className="w-full text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95"
                            style={{ backgroundColor: '#00A0E9' }}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl">🏠</span>
                                <span className="text-xl font-bold">ホームに戻る</span>
                            </div>
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}