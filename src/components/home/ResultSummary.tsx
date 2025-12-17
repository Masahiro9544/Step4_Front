import React from 'react';
import { LastResults } from '@/types/home';

interface ResultSummaryProps {
    results: LastResults;
}

export default function ResultSummary({ results }: ResultSummaryProps) {
    // 視力データをフォーマットする関数
    const formatVision = (vision: string | null | undefined): React.ReactNode => {
        if (!vision) return '-';
        const visionValue = parseFloat(vision);
        if (visionValue <= 0.1) {
            return (
                <>
                    0.5<span className="text-base">みまん</span>
                </>
            );
        }
        return vision;
    };

    return (
        <div className="w-full px-4 mb-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">前のけっか</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex divide-x divide-gray-100">
                    <div className="flex-1 text-center px-2">
                        <div className="text-xs text-gray-400 mb-1">
                            <div>しりょく</div>
                            <div>（みぎ/ひだり）</div>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-2xl font-bold text-merelax-primary">
                                {formatVision(results.right_eye)}
                            </p>
                            <p className="text-2xl font-bold text-merelax-primary">
                                {formatVision(results.left_eye)}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 text-center px-2">
                        <div className="text-xs text-gray-400 mb-1">
                            <div>スマホとの</div>
                            <div>きょり</div>
                        </div>
                        <p className="text-2xl font-bold text-merelax-distance">
                            {results.avg_distance_cm ? `${Math.round(results.avg_distance_cm)}cm` : '-'}
                        </p>
                    </div>
                    <div className="flex-1 text-center px-2">
                        <div className="text-xs text-gray-400 mb-1">
                            <div>スマホ</div>
                            <div>じかん</div>
                        </div>
                        <p className="text-2xl font-bold text-merelax-accent">
                            {results.total_screentime_minutes ? `${results.total_screentime_minutes}分` : '-'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
