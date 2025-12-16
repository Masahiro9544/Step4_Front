'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { getExerciseStats } from '@/lib/api';
import { ExerciseStats } from '@/types/exercise';
import StatsHeader from '@/components/merelax/StatsHeader';
import TodayProgress from '@/components/merelax/TodayProgress';
import ExerciseButton from '@/components/merelax/ExerciseButton';
import SoundToggle from '@/components/merelax/SoundToggle';
import CharacterGreeting from '@/components/merelax/CharacterGreeting';
import Footer from '@/components/Footer';

import { useBGM } from '@/hooks/useBGM';
import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/context/AuthContext';

const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), {
    ssr: false,
});

export default function MerelaxPage() {
    const router = useRouter();
    const [stats, setStats] = useState<ExerciseStats | null>(null);
    const [loading, setLoading] = useState(true);


    const { playBGM, stopBGM } = useBGM();
    const { soundEnabled, playSound } = useSound();
    const { selectedChildId } = useAuth();

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
            // speak("こんにちは！ きょうも めを たいせつに しようね");
        } else {
            stopBGM();
        }
    }, [soundEnabled, loading, playBGM, stopBGM]);

    const fetchStats = async () => {
        if (!selectedChildId) {
            setLoading(false);
            return;
        }

        try {
            const data = await getExerciseStats(selectedChildId);
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
        <div className="min-h-screen bg-[#E0F2F7] pb-32 relative font-sans text-[#0093D0]" onClick={() => {
            // ユーザーアクションをトリガーにBGM開始（ブロック回避）
            if (soundEnabled) playBGM();
        }}>
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md mx-auto p-4 space-y-2">
                {/* Header Section */}
                <header className="flex justify-between items-center z-50 mb-0">
                    <div className="flex items-center gap-2">
                        <CharacterGreeting />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Image
                                src="/images/character/merelaxtop.png"
                                alt="MeRelax Logo"
                                width={280}
                                height={100}
                                className="object-contain"
                            />
                        </motion.div>
                    </div>
                </header>

                {/* Main Card Container */}
                <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6 border-4 border-[#0093D0]">
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


                    <p className="text-gray-700 text-lg font-bold text-center border-t border-gray-100 pt-4">
                        メニューを えらんでね
                    </p>

                    {/* 機能ボタン - 順番にポヨンと出現 */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ExerciseButton
                                title="めを まもる おやくそく"
                                subtitle="めを まもる ほうほう"
                                color="bg-[#4A90E2] text-white"
                                onClick={() => {
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
                                title="とおくを みよう"
                                subtitle="そらや そとを みよう"
                                color="bg-[#81D4FA] text-[#005b82]"
                                completed={stats?.today_completed.includes('distance_view')}
                                onClick={() => {
                                    playSound('/sounds/tokuwomiyo.wav');
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
                                subtitle="パチパチ しよう"
                                color="bg-[#FF6B9D] text-white"
                                completed={stats?.today_completed.includes('blink')}
                                onClick={() => {
                                    playSound('/sounds/mabataki.wav');
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
                                title="めの たいそう"
                                subtitle="ぐるぐる うごかそう"
                                color="bg-[#F5A623] text-white"
                                completed={stats?.today_completed.includes('eye_tracking')}
                                onClick={() => {
                                    playSound('/sounds/menotaiso.wav');
                                    router.push('/merelax/eye-tracking');
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
            {/* Sound Toggle (Fixed Position, moved up for Footer) */}
            <SoundToggle className="fixed bottom-32 right-4 z-50" />
            <Footer activeTab="merelax" />
        </div>
    );
}
