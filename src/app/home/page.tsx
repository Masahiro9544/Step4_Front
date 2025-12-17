'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import CharacterMessage from '@/components/home/CharacterMessage';
import ResultSummary from '@/components/home/ResultSummary';
import ChildSelectorModal from '@/components/auth/ChildSelector';
import { getHomeData } from '@/lib/api';
import { HomeResponse } from '@/types/home';
import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/context/AuthContext';

const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), {
    ssr: false,
});

export default function HomePage() {
    const router = useRouter();
    const [homeData, setHomeData] = useState<HomeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    const { playSound } = useSound();
    const { selectedChildId, user, loading: authLoading } = useAuth();

    const hasPlayedWelcomeRef = React.useRef(false);

    useEffect(() => {
        // Play welcome audio on home mount (only once)
        if (!hasPlayedWelcomeRef.current) {
            playSound('/sounds/mememestarrt.wav');
            hasPlayedWelcomeRef.current = true;
        }

        fetchHomeData();
    }, [playSound, selectedChildId]);

    const fetchHomeData = async () => {
        if (!selectedChildId) {
            setLoading(false);
            return;
        }

        try {
            const data = await getHomeData(selectedChildId);
            setHomeData(data);
        } catch (error) {
            console.error('ホームデータの取得エラー:', error);
            // エラー時はデフォルトデータを設定
            setHomeData({
                missions: [
                    { mission_id: '1', title: 'しりょくチェック', status: 'pending', link: '/vision-home' },
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

    // Show loading while auth is being checked
    if (authLoading) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <div className="animate-bounce text-merelax-primary text-2xl font-bold">●</div>
            </div>
        );
    }

    // If auth is done loading but no user, redirect to login
    if (!authLoading && !user) {
        router.push('/');
        return null;
    }

    // Show loading while fetching home data
    if (loading && selectedChildId === null) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <div className="animate-bounce text-merelax-primary text-2xl font-bold">●</div>
            </div>
        );
    }

    return (
        <>
            <ChildSelectorModal />
            <div className="min-h-screen relative flex flex-col pb-24"
                style={{
                    background: 'linear-gradient(135deg, #E3F2FD 0%, #FFF3E0 50%, #FFF9C4 100%)',
                }}>
                {/* かわいい水玉と星のオーバーレイ */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* 水玉パターン */}
                    <div className="absolute inset-0 opacity-15"
                        style={{
                            backgroundImage: `radial-gradient(circle, #FF9EC4 12%, transparent 12%),
                                          radial-gradient(circle, #00A0E9 12%, transparent 12%),
                                          radial-gradient(circle, #FFD83B 12%, transparent 12%)`,
                            backgroundSize: '100px 100px, 140px 140px, 120px 120px',
                            backgroundPosition: '0 0, 50px 50px, 100px 25px'
                        }}>
                    </div>
                    {/* キラキラ星 */}
                    <div className="absolute top-20 left-10 text-4xl opacity-30">✨</div>
                    <div className="absolute top-40 right-8 text-3xl opacity-25">⭐</div>
                    <div className="absolute bottom-40 left-16 text-3xl opacity-20">💫</div>
                </div>

                <main className="relative z-10 flex-1 w-full max-w-md mx-auto">
                    {/* ヘッダー - かわいく改良 */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-b-[32px] mb-4 relative"
                        style={{
                            background: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 100%)',
                            boxShadow: '0 8px 20px rgba(0, 160, 233, 0.15), inset 0 2px 6px rgba(255, 255, 255, 0.8)',
                            border: '3px solid #00A0E9',
                            borderTop: 'none'
                        }}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <h1 className="text-5xl font-black tracking-wider" style={{
                                color: '#00A0E9',
                                textShadow: '2px 2px 0px #FFD83B, 4px 4px 0px rgba(0,0,0,0.1)'
                            }}>
                                めめめ
                            </h1>
                        </div>
                        <p className="text-center text-sm font-bold mt-2" style={{ color: '#FF9EC4' }}>
                            〜めをたいせつにしよう！〜
                        </p>
                        <motion.button
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.push('/settings')}
                            className="absolute top-4 right-4 p-3 rounded-full transition-colors"
                            style={{
                                background: 'linear-gradient(135deg, #FFE66D 0%, #FFD83B 100%)',
                                boxShadow: '0 3px 8px rgba(255, 216, 59, 0.3)'
                            }}
                            aria-label="設定"
                        >
                            <div className="relative w-8 h-8">
                                <Image src="/images/icon/cogwheel.png" alt="設定" fill className="object-contain" />
                            </div>
                        </motion.button>
                    </motion.header>

                    {/* キャラクターメッセージ - メイン */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <CharacterMessage
                            message={homeData?.character_message || 'きょうもたのしくめのけんこうをまもろう！'}
                            expression="happy"
                            animation="bounce"
                        />
                    </motion.div>

                    {/* クイックアクションボタン - ぷにぷにデザイン with キャラクター誘導 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full px-4 mb-6"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-3xl font-bold ml-1" style={{ color: '#00A0E9' }}>目のげんきチェック</h2>
                            {/* 小さいキャラクターアイコン */}
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                                className="relative w-12 h-12"
                            >
                                <Image
                                    src="/images/character/character_happy.png"
                                    alt="キャラクター"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {/* きょりボタン - Zoffブルー */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95, y: 2 }}
                                onClick={() => {
                                    setClickedButton('distance');
                                    setTimeout(() => router.push('/distance-check'), 300);
                                }}
                                className="relative rounded-[28px] p-7 transition-all min-h-[140px] flex flex-col items-center justify-center"
                                style={{
                                    background: 'linear-gradient(180deg, #4DC4FF 0%, #00A0E9 100%)',
                                    boxShadow: '0 6px 12px rgba(0, 160, 233, 0.2), inset 0 -3px 10px rgba(0, 0, 0, 0.1), inset 0 3px 10px rgba(255, 255, 255, 0.5)',
                                    color: '#FFFFFF',
                                }}
                            >
                                <div className="relative w-16 h-16 mb-2">
                                    <Image src="/images/icon/ruler.png" alt="きょり" fill className="object-contain drop-shadow-md" />
                                </div>
                                <div className="text-2xl font-extrabold tracking-wide">きょり</div>
                            </motion.button>

                            {/* タイマーボタン - ひまわり黄色 */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95, y: 2 }}
                                onClick={() => {
                                    setClickedButton('timer');
                                    setTimeout(() => router.push('/screentime'), 300);
                                }}
                                className="relative rounded-[28px] p-7 transition-all min-h-[140px] flex flex-col items-center justify-center"
                                style={{
                                    background: 'linear-gradient(180deg, #FFE66D 0%, #FFD83B 100%)',
                                    boxShadow: '0 6px 12px rgba(255, 216, 59, 0.2), inset 0 -3px 10px rgba(0, 0, 0, 0.1), inset 0 3px 10px rgba(255, 255, 255, 0.5)',
                                    color: '#333333',
                                }}
                            >
                                <div className="relative w-16 h-16 mb-2">
                                    <Image src="/images/icon/clock.png" alt="タイマー" fill className="object-contain drop-shadow-md" />
                                </div>
                                <div className="text-2xl font-extrabold tracking-wide">タイマー</div>
                            </motion.button>

                            {/* しりょくボタン - さくらピンク */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95, y: 2 }}
                                onClick={() => {
                                    setClickedButton('vision');
                                    setTimeout(() => router.push('/vision-home'), 300);
                                }}
                                className="relative rounded-[28px] p-8 transition-all min-h-[140px] col-span-2 flex flex-col items-center justify-center"
                                style={{
                                    background: 'linear-gradient(180deg, #FFB3D9 0%, #FF9EC4 100%)',
                                    boxShadow: '0 6px 12px rgba(255, 158, 196, 0.2), inset 0 -3px 10px rgba(0, 0, 0, 0.1), inset 0 3px 10px rgba(255, 255, 255, 0.5)',
                                    color: '#FFFFFF',
                                }}
                            >
                                <div className="relative w-16 h-16 mb-2">
                                    <Image src="/images/icon/search.png" alt="しりょく" fill className="object-contain drop-shadow-md" />
                                </div>
                                <div className="text-2xl font-extrabold tracking-wide">しりょく</div>
                            </motion.button>
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

                {/* 下部ナビゲーションバー - かわいく改良 */}
                <nav className="fixed bottom-0 left-0 right-0 z-50"
                    style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #E3F2FD 100%)',
                        borderTop: '4px solid #00A0E9',
                        boxShadow: '0 -4px 20px rgba(0, 160, 233, 0.15)'
                    }}>
                    <div className="max-w-md mx-auto px-4 py-3 flex justify-around items-center">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/home')}
                            className="flex flex-col items-center transition-all min-w-[85px] min-h-[75px] justify-center rounded-2xl p-2"
                            style={{
                                color: '#00A0E9',
                                background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)',
                                boxShadow: '0 3px 10px rgba(0, 160, 233, 0.2)'
                            }}
                        >
                            <div className="relative w-12 h-12 mb-1">
                                <Image src="/images/icon/house.png" alt="ホーム" fill className="object-contain" />
                            </div>
                            <span className="text-sm font-extrabold">ホーム</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/merelax')}
                            className="flex flex-col items-center transition-all min-w-[85px] min-h-[75px] justify-center rounded-2xl p-2"
                            style={{ color: '#999' }}
                        >
                            <div className="relative w-12 h-12 mb-1">
                                <Image src="/images/icon/eyes.png" alt="めリラ" fill className="object-contain" />
                            </div>
                            <span className="text-sm font-bold">めリラ</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/record')}
                            className="flex flex-col items-center transition-all min-w-[85px] min-h-[75px] justify-center rounded-2xl p-2"
                            style={{ color: '#999' }}
                        >
                            <div className="relative w-12 h-12 mb-1">
                                <Image src="/images/icon/statistics.png" alt="きろく" fill className="object-contain" />
                            </div>
                            <span className="text-sm font-bold">きろく</span>
                        </motion.button>
                    </div>
                </nav>
            </div>
        </>
    );
}

