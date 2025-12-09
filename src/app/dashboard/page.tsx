'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ダッシュボード用の型定義
interface Child {
    child_id: number;
    child_name: string;
    birth_date?: string;
}

interface VisionData {
    test_date: string;
    right_30cm: number | null;
    left_30cm: number | null;
    right_3m: number | null;
    left_3m: number | null;
}

interface DistanceData {
    distance_cm: number;
    check_date: string;
    status: 'appropriate' | 'too_close' | 'no_data';
}

interface ScreenTimeDataPoint {
    date: string;
    total_minutes: number;
    status: 'appropriate' | 'moderate' | 'too_long';
}

interface ScreenTimeData {
    view: 'daily' | 'weekly';
    data: ScreenTimeDataPoint[];
}

export default function DashboardPage() {
    const router = useRouter();
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<number | null>(null);
    const [visionData, setVisionData] = useState<VisionData[]>([]);
    const [distanceData, setDistanceData] = useState<DistanceData | null>(null);
    const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData | null>(null);
    const [visionPeriod, setVisionPeriod] = useState<'3months' | '1year'>('3months');
    const [screenTimeView, setScreenTimeView] = useState<'daily' | 'weekly'>('daily');
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://localhost:8000/api/v1';

    // 初期データ読み込み
    useEffect(() => {
        fetchChildren();
    }, []);

    // 子供が選択されたらデータを取得
    useEffect(() => {
        if (selectedChild) {
            fetchVisionData();
            fetchDistanceData();
            fetchScreenTimeData();
        }
    }, [selectedChild, visionPeriod, screenTimeView]);

    const fetchChildren = async () => {
        try {
            // TODO: 実際のAPIエンドポイントに接続
            // const res = await fetch(`${API_BASE}/dashboard/children`);
            // if (res.ok) {
            //     const data = await res.json();
            //     setChildren(data.children);
            //     if (data.children.length > 0) {
            //         setSelectedChild(data.children[0].child_id);
            //     }
            // }

            // 仮データ
            const mockChildren: Child[] = [
                { child_id: 1, child_name: '太郎', birth_date: '2015-04-01' },
            ];
            setChildren(mockChildren);
            setSelectedChild(mockChildren[0].child_id);
        } catch (error) {
            console.error('子供データの取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVisionData = async () => {
        try {
            // TODO: 実際のAPIエンドポイントに接続
            // const res = await fetch(`${API_BASE}/dashboard/vision-trend?child_id=${selectedChild}&period=${visionPeriod}`);
            // if (res.ok) {
            //     const data = await res.json();
            //     setVisionData(data.data);
            // }

            // 仮データ
            setVisionData([]);
        } catch (error) {
            console.error('視力データの取得エラー:', error);
        }
    };

    const fetchDistanceData = async () => {
        try {
            // TODO: 実際のAPIエンドポイントに接続
            // const res = await fetch(`${API_BASE}/dashboard/latest-distance?child_id=${selectedChild}`);
            // if (res.ok) {
            //     const data = await res.json();
            //     setDistanceData(data);
            // }

            // 仮データ
            setDistanceData({
                distance_cm: 0,
                check_date: new Date().toISOString(),
                status: 'no_data'
            });
        } catch (error) {
            console.error('距離データの取得エラー:', error);
        }
    };

    const fetchScreenTimeData = async () => {
        try {
            // TODO: 実際のAPIエンドポイントに接続
            // const res = await fetch(`${API_BASE}/dashboard/screen-time?child_id=${selectedChild}&view=${screenTimeView}`);
            // if (res.ok) {
            //     const data = await res.json();
            //     setScreenTimeData(data);
            // }

            // 仮データ
            setScreenTimeData({
                view: screenTimeView,
                data: []
            });
        } catch (error) {
            console.error('スクリーンタイムデータの取得エラー:', error);
        }
    };

    const getDistanceStatusColor = (status: string) => {
        switch (status) {
            case 'appropriate': return '#4CAF50';
            case 'too_close': return '#FFD83B';
            case 'no_data': return '#999';
            default: return '#999';
        }
    };

    const getDistanceStatusText = (status: string) => {
        switch (status) {
            case 'appropriate': return '適正な距離です';
            case 'too_close': return '近すぎます';
            case 'no_data': return 'データがありません';
            default: return 'データがありません';
        }
    };

    const getScreenTimeColor = (status: string) => {
        switch (status) {
            case 'appropriate': return '#4CAF50';
            case 'moderate': return '#FFD83B';
            case 'too_long': return '#FF6B6B';
            default: return '#999';
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
        <main className="min-h-screen pb-20" style={{ backgroundColor: '#F6F9FB' }}>
            {/* ヘッダー */}
            <header className="px-6 py-6 flex items-center bg-white shadow-md rounded-b-3xl sticky top-0 z-10">
                <Link href="/home" className="flex items-center font-bold text-gray-600 hover:text-gray-800 transition-colors">
                    <span className="text-2xl mr-2">←</span>
                    <span className="text-lg">もどる</span>
                </Link>
                <h1 className="flex-1 text-center text-3xl font-bold pr-20 leading-tight" style={{ color: '#00A0E9' }}>
                    📊 ダッシュボード
                </h1>
            </header>

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* 子供選択エリア */}
                {children.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-md p-6"
                    >
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#00A0E9' }}>お子さまを選択</h2>
                        <div className="flex gap-3">
                            {children.map((child) => (
                                <button
                                    key={child.child_id}
                                    onClick={() => setSelectedChild(child.child_id)}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                        selectedChild === child.child_id
                                            ? 'text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    style={selectedChild === child.child_id ? { backgroundColor: '#00A0E9' } : {}}
                                >
                                    {child.child_name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 視力チェック結果の推移 */}
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
                                onClick={() => setVisionPeriod('3months')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                    visionPeriod === '3months'
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                style={visionPeriod === '3months' ? { backgroundColor: '#00A0E9' } : {}}
                            >
                                3ヶ月
                            </button>
                            <button
                                onClick={() => setVisionPeriod('1year')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                    visionPeriod === '1year'
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                style={visionPeriod === '1year' ? { backgroundColor: '#00A0E9' } : {}}
                            >
                                1年
                            </button>
                        </div>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        {visionData.length === 0 ? (
                            <div className="text-center">
                                <p className="text-lg mb-2">まだデータがありません</p>
                                <p className="text-sm">視力チェックを始めましょう!</p>
                            </div>
                        ) : (
                            <p>グラフ表示エリア（Chart.js等で実装予定）</p>
                        )}
                    </div>
                </motion.div>

                {/* 画面からの距離計測 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-md p-6"
                >
                    <h2 className="text-xl font-bold mb-4" style={{ color: '#00A0E9' }}>📏 画面からの距離</h2>
                    <div
                        className="rounded-xl p-8 text-center"
                        style={{ backgroundColor: getDistanceStatusColor(distanceData?.status || 'no_data') + '20' }}
                    >
                        {distanceData?.status === 'no_data' ? (
                            <div>
                                <p className="text-4xl font-bold text-gray-400 mb-2">--</p>
                                <p className="text-sm text-gray-500">データがありません</p>
                                <p className="text-sm text-gray-500 mt-2">距離チェックを始めましょう!</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-5xl font-bold mb-2" style={{ color: getDistanceStatusColor(distanceData?.status || 'no_data') }}>
                                    {distanceData?.distance_cm} cm
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    最終測定: {distanceData?.check_date ? new Date(distanceData.check_date).toLocaleString('ja-JP') : '--'}
                                </p>
                                <p className="text-lg font-bold" style={{ color: getDistanceStatusColor(distanceData?.status || 'no_data') }}>
                                    {getDistanceStatusText(distanceData?.status || 'no_data')}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* スマホ使用時間 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-md p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold" style={{ color: '#00A0E9' }}>⏱️ スマホ使用時間</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setScreenTimeView('daily')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                    screenTimeView === 'daily'
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                style={screenTimeView === 'daily' ? { backgroundColor: '#00A0E9' } : {}}
                            >
                                日別
                            </button>
                            <button
                                onClick={() => setScreenTimeView('weekly')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                    screenTimeView === 'weekly'
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                style={screenTimeView === 'weekly' ? { backgroundColor: '#00A0E9' } : {}}
                            >
                                週別
                            </button>
                        </div>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        {screenTimeData?.data.length === 0 ? (
                            <div className="text-center">
                                <p className="text-lg mb-2">まだデータがありません</p>
                                <p className="text-sm">スマホタイマーを使ってみましょう!</p>
                            </div>
                        ) : (
                            <p>グラフ表示エリア（Chart.js等で実装予定）</p>
                        )}
                    </div>
                </motion.div>

                {/* 使用時間の目安 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6"
                >
                    <h3 className="text-lg font-bold mb-3" style={{ color: '#00A0E9' }}>💡 使用時間の目安</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
                            <span className="text-sm font-bold">60分以下:</span>
                            <span className="text-sm text-gray-600">適切な使用時間</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFD83B' }}></div>
                            <span className="text-sm font-bold">61〜120分:</span>
                            <span className="text-sm text-gray-600">やや長め</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
                            <span className="text-sm font-bold">121分以上:</span>
                            <span className="text-sm text-gray-600">長すぎます</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
