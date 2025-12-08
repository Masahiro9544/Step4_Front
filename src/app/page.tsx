'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import CharacterMessage from '@/components/home/CharacterMessage';
import ResultSummary from '@/components/home/ResultSummary';
import { getHomeData } from '@/lib/api';
import { HomeResponse } from '@/types/home';

export default function HomePage() {
    const router = useRouter();
    const [homeData, setHomeData] = useState<HomeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // TODO: 実際のchild_idはログイン情報から取得
    const childId = 1;

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            const data = await getHomeData(childId);
            setHomeData(data);
        } catch (error) {
            console.error('ホームデータの取得エラー:', error);
            // エラー時はデフォルトデータを設定
            setHomeData({
                missions: [
                    { mission_id: '1', title: 'しりょくチェック', status: 'pending', link: '/eyetest' },
                    { mission_id: '2', title: 'きょりチェック', status: 'pending', link: '/distancecheck' },
                    { mission_id: '3', title: 'まばたきゲーム', status: 'pending', link: '/blinkchallenge' },
                    { mission_id: '4', title: 'めのたいそう', status: 'pending', link: '/merelax' },
                ],
                last_results: {},
                character_message: 'きょうもげんきにがんばろう！'
            });
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
        <div className="min-h-screen relative flex flex-col pb-24" style={{ backgroundColor: '#F6F9FB' }}>
            <AnimatedBackground />

            <main className="relative z-10 flex-1 w-full max-w-md mx-auto">
                {/* ヘッダー */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white rounded-b-3xl shadow-md mb-6 relative"
                >
                    <h1 className="text-4xl font-bold text-center" style={{ color: '#00A0E9' }}>
                        めとれ
                    </h1>
                    <button
                        onClick={() => router.push('/settings')}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="設定"
                    >
                        <span className="text-2xl text-gray-400">⚙️</span>
                    </button>
                </motion.header>

                {/* キャラクターメッセージ */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <CharacterMessage message={homeData?.character_message || 'がんばろう！'} />
                </motion.div>

                {/* クイックアクションボタン */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full px-4 mb-6"
                >
                    <h2 className="text-3xl font-bold mb-5 ml-1" style={{ color: '#00A0E9' }}>目のげんきチェック</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/distance-check')}
                            className="text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95 min-h-[100px]"
                            style={{ backgroundColor: '#00A0E9' }}
                        >
                            <div className="text-4xl mb-2">📏</div>
                            <div className="text-xl font-bold">きょり</div>
                        </button>

                        <button
                            onClick={() => router.push('/screentime')}
                            className="text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95 min-h-[100px]"
                            style={{ backgroundColor: '#FFD83B', color: '#333' }}
                        >
                            <div className="text-4xl mb-2">⏱️</div>
                            <div className="text-xl font-bold">タイマー</div>
                        </button>

                        <button
                            onClick={() => router.push('/eyetest')}
                            className="text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95 min-h-[100px] col-span-2"
                            style={{ backgroundColor: '#FF9EC4' }}
                        >
                            <div className="text-4xl mb-2">👁️</div>
                            <div className="text-xl font-bold">しりょく</div>
                        </button>
                    </div>
                </motion.div>

                {/* 前回の結果 */}
                {homeData?.last_results && Object.keys(homeData.last_results).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <ResultSummary results={homeData.last_results} />
                    </motion.div>
                )}
            </main>

            {/* 下部ナビゲーションバー */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 z-50" style={{ borderColor: '#00A0E9' }}>
                <div className="max-w-md mx-auto px-4 py-4 flex justify-around items-center">
                    <button
                        onClick={() => router.push('/')}
                        className="flex flex-col items-center transition-colors min-w-[80px] min-h-[80px] justify-center"
                        style={{ color: '#00A0E9' }}
                    >
                        <span className="text-3xl mb-1">🏠</span>
                        <span className="text-base font-bold">ホーム</span>
                    </button>
                    <button
                        onClick={() => router.push('/merelax')}
                        className="flex flex-col items-center text-gray-400 transition-colors min-w-[80px] min-h-[80px] justify-center"
                        style={{ color: '#999' }}
                    >
                        <span className="text-3xl mb-1">💪</span>
                        <span className="text-base font-bold">たいそう</span>
                    </button>
                    <button
                        onClick={() => router.push('/screentime')}
                        className="flex flex-col items-center text-gray-400 transition-colors min-w-[80px] min-h-[80px] justify-center"
                        style={{ color: '#999' }}
                    >
                        <span className="text-3xl mb-1">📊</span>
                        <span className="text-base font-bold">きろく</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
