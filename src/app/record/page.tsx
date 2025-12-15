'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';

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
    view: 'weekly' | 'monthly';
    data: ScreenTimeDataPoint[];
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, selectedChildId } = useAuth();
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<number | null>(null);
    const [visionData, setVisionData] = useState<VisionData[]>([]);
    const [distanceData, setDistanceData] = useState<DistanceData | null>(null);
    const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData | null>(null);
    const [visionPeriod, setVisionPeriod] = useState<'weekly' | 'monthly'>('weekly');
    const [screenTimeView, setScreenTimeView] = useState<'weekly' | 'monthly'>('weekly');
    const [loading, setLoading] = useState(true);

    const API_BASE = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1`;

    // 初期データ読み込み
    useEffect(() => {
        fetchChildren();
    }, []);

    // 子供が選択されたらデータを取得
    useEffect(() => {
        if (selectedChild) {
            fetchChildDashboardData();
        }
    }, [selectedChild, visionPeriod, screenTimeView]);

    const fetchChildren = async () => {
        if (!user) return;

        try {
            const parentId = user.parent_id;
            const res = await fetch(`${API_BASE}/dashboard/parent/${parentId}`);
            if (res.ok) {
                const data = await res.json();
                // Map backend response to frontend interface
                // Backend: DashboardParentResponse -> children_data: [{child: {...}, ...}]
                const mappedChildren: Child[] = data.children_data.map((item: any) => ({
                    child_id: item.child.child_id,
                    child_name: item.child.name,
                    birth_date: '' // Not currently in backend response but needed for type
                }));

                setChildren(mappedChildren);
                if (mappedChildren.length > 0) {
                    setSelectedChild(mappedChildren[0].child_id);
                }
            } else {
                console.error('Failed to fetch children', res.status);
            }
        } catch (error) {
            console.error('子供データの取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    // Integrated fetch function to get all dashboard data for selected child
    const fetchChildDashboardData = async () => {
        if (!selectedChild) return;

        try {
            const res = await fetch(`${API_BASE}/dashboard/child/${selectedChild}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();

                // 1. Vision Data (EyeTest)
                if (data.recent_eye_tests && data.recent_eye_tests.length > 0) {
                    // Transform backend EyeTest to frontend VisionData
                    // Backend: { check_date: string, left_eye: string, right_eye: string, test_distance_cm: int }
                    const mappedVisionData: VisionData[] = data.recent_eye_tests.map((test: any) => ({
                        test_date: test.check_date,
                        right_30cm: test.test_distance_cm === 30 ? parseFloat(test.right_eye) || null : null,
                        left_30cm: test.test_distance_cm === 30 ? parseFloat(test.left_eye) || null : null,
                        right_3m: test.test_distance_cm === 300 ? parseFloat(test.right_eye) || null : null,
                        left_3m: test.test_distance_cm === 300 ? parseFloat(test.left_eye) || null : null
                    }));
                    setVisionData(mappedVisionData);
                } else {
                    setVisionData([]);
                }

                // 2. Distance Data (DistanceCheck)
                if (data.recent_distance_checks && data.recent_distance_checks.length > 0) {
                    const latest = data.recent_distance_checks[0];
                    setDistanceData({
                        distance_cm: latest.avg_distance_cm,
                        check_date: latest.check_date,
                        status: latest.avg_distance_cm < 30 ? 'too_close' : 'appropriate' // Simple logic
                    });
                } else {
                    setDistanceData({
                        distance_cm: 0,
                        check_date: new Date().toISOString(),
                        status: 'no_data'
                    });
                }

                // 3. Screen Time - Aggregate by date
                if (data.recent_screentime && data.recent_screentime.length > 0) {
                    // Group by date and sum total_minutes
                    const dailyTotals: { [key: string]: number } = {};

                    data.recent_screentime.forEach((st: any) => {
                        const dateKey = new Date(st.start_time).toISOString().split('T')[0]; // YYYY-MM-DD
                        const mins = st.total_minutes || 0;

                        if (dailyTotals[dateKey]) {
                            dailyTotals[dateKey] += mins;
                        } else {
                            dailyTotals[dateKey] = mins;
                        }
                    });

                    // Convert to array with status
                    const mappedScreenTime: ScreenTimeDataPoint[] = Object.entries(dailyTotals).map(([dateKey, totalMins]) => {
                        let status: 'appropriate' | 'moderate' | 'too_long' = 'appropriate';
                        if (totalMins > 120) status = 'too_long';
                        else if (totalMins > 60) status = 'moderate';

                        return {
                            date: dateKey,
                            total_minutes: totalMins,
                            status: status
                        };
                    });

                    setScreenTimeData({
                        view: screenTimeView,
                        data: mappedScreenTime
                    });
                } else {
                    setScreenTimeData({
                        view: screenTimeView,
                        data: []
                    });
                }
            }
        } catch (error) {
            console.error('ダッシュボードデータの取得エラー:', error);
        }
    };

    const fetchVisionData = async () => {
        // Consolidated into fetchChildDashboardData
    };

    const fetchDistanceData = async () => {
        // Consolidated into fetchChildDashboardData
    };

    const fetchScreenTimeData = async () => {
        // Consolidated into fetchChildDashboardData
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
                                    className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedChild === child.child_id
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
                                onClick={() => setVisionPeriod('weekly')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${visionPeriod === 'weekly'
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                style={visionPeriod === 'weekly' ? { backgroundColor: '#00A0E9' } : {}}
                            >
                                週別
                            </button>
                            <button
                                onClick={() => setVisionPeriod('monthly')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${visionPeriod === 'monthly'
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                style={visionPeriod === 'monthly' ? { backgroundColor: '#00A0E9' } : {}}
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

                                        // グループ化: 同じ日付のデータを1つのオブジェクトにまとめる
                                        const groupedData: { [key: string]: any } = {};

                                        visionData
                                            .slice() // Create a copy
                                            .reverse() // Process Oldest -> Newest so Newest wins
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

                                                // データを距離別に分ける
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
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        stroke="#6B7280"
                                    />
                                    <YAxis
                                        domain={[0, 2.0]}
                                        ticks={[0, 0.5, 1.0, 1.5, 2.0]}
                                        tick={{ fontSize: 12 }}
                                        stroke="#6B7280"
                                        label={{ value: '視力', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="右目30cm"
                                        stroke="#FF6B6B"
                                        strokeWidth={2}
                                        dot={{ fill: '#FF6B6B', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        strokeDasharray="5 5"
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="左目30cm"
                                        stroke="#4ECDC4"
                                        strokeWidth={2}
                                        dot={{ fill: '#4ECDC4', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        strokeDasharray="5 5"
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="右目3m"
                                        stroke="#FF6B6B"
                                        strokeWidth={2}
                                        dot={{ fill: '#FF6B6B', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="linear"
                                        dataKey="左目3m"
                                        stroke="#4ECDC4"
                                        strokeWidth={2}
                                        dot={{ fill: '#4ECDC4', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
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
                                onClick={() => setScreenTimeView('weekly')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${screenTimeView === 'weekly'
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                style={screenTimeView === 'weekly' ? { backgroundColor: '#00A0E9' } : {}}
                            >
                                週別
                            </button>
                            <button
                                onClick={() => setScreenTimeView('monthly')}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${screenTimeView === 'monthly'
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                style={screenTimeView === 'monthly' ? { backgroundColor: '#00A0E9' } : {}}
                            >
                                月別
                            </button>
                        </div>
                    </div>
                    <div className="h-64">
                        {screenTimeData?.data.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center text-gray-400">
                                <div>
                                    <p className="text-lg mb-2">まだデータがありません</p>
                                    <p className="text-sm">スマホタイマーを使ってみましょう!</p>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={(() => {
                                        const now = new Date();
                                        const daysToShow = screenTimeView === 'weekly' ? 7 : 30;
                                        const startDate = new Date(now);
                                        startDate.setDate(now.getDate() - (daysToShow - 1));

                                        return screenTimeData?.data
                                            .filter(item => new Date(item.date) >= startDate)
                                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                            .map((item) => ({
                                                date: new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
                                                使用時間: item.total_minutes,
                                                status: item.status,
                                            })) || [];
                                    })()}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        stroke="#6B7280"
                                    />
                                    <YAxis
                                        domain={[0, 'auto']}
                                        tick={{ fontSize: 12 }}
                                        stroke="#6B7280"
                                        label={{ value: '分', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value: any) => [`${value}分`, '使用時間']}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                                    />
                                    <Bar
                                        dataKey="使用時間"
                                        radius={[8, 8, 0, 0]}
                                        fill="#00A0E9"
                                        shape={(props: any) => {
                                            const { x, y, width, height, payload } = props;
                                            let fillColor = '#4CAF50'; // appropriate
                                            if (payload.status === 'moderate') fillColor = '#FFD83B';
                                            if (payload.status === 'too_long') fillColor = '#FF6B6B';
                                            return (
                                                <rect
                                                    x={x}
                                                    y={y}
                                                    width={width}
                                                    height={height}
                                                    fill={fillColor}
                                                    rx={8}
                                                    ry={8}
                                                />
                                            );
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
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
