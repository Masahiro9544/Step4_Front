'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEyeTests, EyeTestResult } from '@/lib/rfp-api';
import HistoryChart from '@/components/HistoryChart';

export default function DashboardPage() {
    const router = useRouter();
    const [results, setResults] = useState<EyeTestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'3m' | '30cm'>('3m');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getEyeTests();
            setResults(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredResults = results.filter(r => r.test_type === activeTab);

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#E0F2F7] p-4 font-sans text-[#0093D0]">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">きろく (ダッシュボード)</h1>
                    <button
                        onClick={() => router.push('/home')}
                        className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold hover:bg-gray-50"
                    >
                        トップへ
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white rounded-full shadow-md">
                    <button
                        onClick={() => setActiveTab('3m')}
                        className={`flex-1 py-3 rounded-full font-bold transition-all ${activeTab === '3m'
                                ? 'bg-[#0093D0] text-white shadow-sm'
                                : 'text-gray-400 hover:text-[#0093D0]'
                            }`}
                    >
                        3m (とおく)
                    </button>
                    <button
                        onClick={() => setActiveTab('30cm')}
                        className={`flex-1 py-3 rounded-full font-bold transition-all ${activeTab === '30cm'
                                ? 'bg-[#0093D0] text-white shadow-sm'
                                : 'text-gray-400 hover:text-[#0093D0]'
                            }`}
                    >
                        30cm (ちかく)
                    </button>
                </div>

                {/* Chart Section */}
                <div className="bg-white p-6 rounded-3xl shadow-lg space-y-4">
                    <h2 className="text-lg font-bold border-b pb-2">
                        {activeTab === '3m' ? '3m' : '30cm'} の しりょくの すいい
                    </h2>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">よみこみちゅう...</div>
                    ) : filteredResults.length > 0 ? (
                        <HistoryChart data={filteredResults} />
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">まだデータがありません</div>
                    )}
                </div>

                {/* List Section */}
                <div className="bg-white p-6 rounded-3xl shadow-lg space-y-4">
                    <h2 className="text-lg font-bold border-b pb-2">さいきんの きろく</h2>
                    <div className="space-y-3">
                        {loading ? (
                            <div>よみこみちゅう...</div>
                        ) : filteredResults.length > 0 ? (
                            filteredResults.slice(0, 5).map((r) => (
                                <div key={r.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">{new Date(r.check_date).toLocaleDateString('ja-JP')}</span>
                                        <span className="font-bold text-sm">みぎ: {r.right_eye?.toFixed(1) ?? '-'} / ひだり: {r.left_eye?.toFixed(1) ?? '-'}</span>
                                    </div>
                                    <div className="text-xl font-bold text-[#0093D0]">
                                        OK
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-4">まだデータがありません</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
