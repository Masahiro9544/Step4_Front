'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';

// Types ported from Record page
interface VisionData {
    test_date: string;
    right_30cm: number | null;
    left_30cm: number | null;
    right_3m: number | null;
    left_3m: number | null;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, selectedChildId } = useAuth();
    const [visionData, setVisionData] = useState<VisionData[]>([]);
    const [visionPeriod, setVisionPeriod] = useState<'weekly' | 'monthly'>('weekly');
    const [loading, setLoading] = useState(true);
    const [latestResult, setLatestResult] = useState<VisionData | null>(null);

    const API_BASE = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1`;

    useEffect(() => {
        if (selectedChildId) {
            fetchChildDashboardData();
        } else if (user && !selectedChildId) {
            // If authenticated but no child selected, try to select one or stop loading
            setLoading(false);
        }
    }, [selectedChildId]);

    const fetchChildDashboardData = async () => {
        if (!selectedChildId) return;

        try {
            const res = await fetch(`${API_BASE}/dashboard/child/${selectedChildId}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();

                // Vision Data Transformation
                if (data.recent_eye_tests && data.recent_eye_tests.length > 0) {
                    const mappedVisionData: VisionData[] = data.recent_eye_tests.map((test: any) => ({
                        test_date: test.check_date,
                        right_30cm: test.test_distance_cm === 30 ? parseFloat(test.right_eye) || null : null,
                        left_30cm: test.test_distance_cm === 30 ? parseFloat(test.left_eye) || null : null,
                        right_3m: test.test_distance_cm === 300 ? parseFloat(test.right_eye) || null : null,
                        left_3m: test.test_distance_cm === 300 ? parseFloat(test.left_eye) || null : null
                    }));
                    setVisionData(mappedVisionData);

                    // Assuming API returns sorted desc, the first one is usually latest, 
                    // BUT dashboard API returns 'recent_eye_tests' which are usually latest 5.
                    // We can take the first one if sorted by date desc.
                    // Let's rely on finding the one with the most recent date.
                    if (mappedVisionData.length > 0) {
                        const sorted = [...mappedVisionData].sort((a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime());
                        setLatestResult(sorted[0]);
                    }
                } else {
                    setVisionData([]);
                    setLatestResult(null);
                }
            }
        } catch (error) {
            console.error('ダッシュボードデータの取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper for Recommendation
    const getRecommendation = (result: VisionData | null) => {
        if (!result) return { title: 'データを計測しましょう', text: 'まだ視力チェックのデータがありません。まずはチェックを行ってみましょう！', color: 'text-gray-500', bg: 'bg-gray-50' };

        // Logic: Check if any eye is below 0.7 (B rank threshold roughly)
        // We consider both 3m and 30cm if available
        const values = [result.right_3m, result.left_3m, result.right_30cm, result.left_30cm].filter(v => v !== null) as number[];

        if (values.length === 0) return { title: 'データ不足', text: '有効な視力データがありません。', color: 'text-gray-500', bg: 'bg-gray-50' };

        const minVal = Math.min(...values);

        if (minVal >= 1.0) {
            return {
                title: '素晴らしい状態です！',
                text: '両目ともよく見えています！この調子で目を大切にする習慣を続けましょう。',
                color: 'text-green-600',
                bg: 'bg-green-50'
            };
        } else if (minVal >= 0.7) {
            return {
                title: '目のお医者さんでチェックしよう',
                text: '少し見えにくいかも。目のお医者さんでみてもらうと安心だよ。必要ならZoffでも視力チェックができます。',
                color: 'text-yellow-700',
                bg: 'bg-yellow-50'
            };
        } else {
            return {
                title: 'いますぐ 目のお医者さんで 視力検査を 受けよう',
                text: '見えづらいかもしれません。早めに目のお医者さんでみてもらってね。Zoffでも視力検査が受けられるよ！',
                color: 'text-red-700',
                bg: 'bg-red-50'
            };
        }
    };

    const recommendation = getRecommendation(latestResult);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F9FB] flex items-center justify-center">
                <div className="animate-bounce text-[#00A0E9] text-2xl font-bold">●</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20" style={{ backgroundColor: '#F6F9FB' }}>
            <header className="px-6 py-6 flex items-center bg-white shadow-md rounded-b-3xl sticky top-0 z-10">
                <Link href="/home" className="flex items-center font-bold text-gray-600 hover:text-gray-800 transition-colors">
                    <span className="text-2xl mr-2">←</span>
                    <span className="text-lg">もどる</span>
                </Link>
                <h1 className="flex-1 text-center text-3xl font-bold pr-20 leading-tight" style={{ color: '#00A0E9' }}>
                    記録
                </h1>
            </header>

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* 視力チェックグラフ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-md p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold" style={{ color: '#00A0E9' }}>👁️ 視力チェック結果の推移</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setVisionPeriod('weekly')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${visionPeriod === 'weekly'
                                    ? 'bg-[#00A0E9] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                週別
                            </button>
                            <button
                                onClick={() => setVisionPeriod('monthly')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${visionPeriod === 'monthly'
                                    ? 'bg-[#00A0E9] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                月別
                            </button>
                        </div>
                    </div>

                    <div className="h-64">
                        {visionData.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center text-gray-400">
                                <div>
                                    <p className="text-lg mb-2">まだデータがありません</p>
                                    <p className="text-sm">視力チェックを始めましょう!</p>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={(() => {
                                        const now = new Date();
                                        const daysToShow = visionPeriod === 'weekly' ? 7 : 30;
                                        const startDate = new Date(now);
                                        startDate.setDate(now.getDate() - (daysToShow - 1));

                                        const groupedData: { [key: string]: any } = {};

                                        visionData
                                            .slice()
                                            .reverse()
                                            .filter(item => new Date(item.test_date) >= startDate)
                                            .forEach((item) => {
                                                const dateKey = new Date(item.test_date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });

                                                if (!groupedData[dateKey]) {
                                                    groupedData[dateKey] = {
                                                        date: dateKey,
                                                        右目30cm: null,
                                                        左目30cm: null,
                                                        右目3m: null,
                                                        左目3m: null
                                                    };
                                                }
                                                if (item.right_30cm !== null) groupedData[dateKey].右目30cm = item.right_30cm;
                                                if (item.left_30cm !== null) groupedData[dateKey].左目30cm = item.left_30cm;
                                                if (item.right_3m !== null) groupedData[dateKey].右目3m = item.right_3m;
                                                if (item.left_3m !== null) groupedData[dateKey].左目3m = item.left_3m;
                                            });

                                        return Object.values(groupedData)
                                            .sort((a, b) => {
                                                const dateA = a.date.split('/').map((n: string) => parseInt(n));
                                                const dateB = b.date.split('/').map((n: string) => parseInt(n));
                                                if (dateA[0] !== dateB[0]) return dateA[0] - dateB[0];
                                                return dateA[1] - dateB[1];
                                            });
                                    })()}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
                                    <YAxis
                                        domain={[0, 2.0]}
                                        ticks={[0, 0.5, 1.0, 1.5, 2.0]}
                                        tick={{ fontSize: 12 }}
                                        stroke="#6B7280"
                                        label={{ value: '視力', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', fontSize: '12px' }}
                                        formatter={(value: number) => value <= 0.1 ? ['0.5未満', ''] : [value, '']}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Line type="linear" dataKey="右目30cm" stroke="#FF6B6B" strokeWidth={2} dot={{ fill: '#FF6B6B', r: 4 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
                                    <Line type="linear" dataKey="左目30cm" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: '#4ECDC4', r: 4 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
                                    <Line type="linear" dataKey="右目3m" stroke="#FF6B6B" strokeWidth={2} dot={{ fill: '#FF6B6B', r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="linear" dataKey="左目3m" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: '#4ECDC4', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* リコメンドセクション */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-2xl shadow-md p-6 ${recommendation.bg}`}
                >
                    <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-200 pb-2 flex items-center gap-2">
                        <span>📝</span> 最新の視力チェックの結果より
                    </h2>

                    <div className="flex flex-col gap-2">
                        <h3 className={`text-lg font-bold ${recommendation.color}`}>
                            {recommendation.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {recommendation.text}
                        </p>
                    </div>
                </motion.div>

                {/* Link to Full Record Page */}
                <div className="flex justify-center mt-4">
                    <Link href="/record" className="text-[#00A0E9] font-bold underline hover:text-[#007bb5]">
                        詳細な記録を見る（スマホ時間など）
                    </Link>
                </div>
            </div>

        </main>
    );
}
