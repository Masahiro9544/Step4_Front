import React from 'react';
import { LastResults } from '@/types/home';

interface ResultSummaryProps {
    results: LastResults;
}

export default function ResultSummary({ results }: ResultSummaryProps) {
    return (
        <div className="w-full px-4 mb-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">前のけっか</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex divide-x divide-gray-100">
                    <div className="flex-1 text-center px-2">
                        <p className="text-xs text-gray-400 mb-1">視力 (右/左)</p>
                        <p className="text-2xl font-bold text-merelax-primary">
                            {results.right_eye || '-'} / {results.left_eye || '-'}
                        </p>
                    </div>
                    <div className="flex-1 text-center px-2">
                        <p className="text-xs text-gray-400 mb-1">平均距離</p>
                        <p className="text-2xl font-bold text-merelax-distance">
                            {results.avg_distance_cm ? `${Math.round(results.avg_distance_cm)}cm` : '-'}
                        </p>
                    </div>
                    <div className="flex-1 text-center px-2">
                        <p className="text-xs text-gray-400 mb-1">姿勢スコア</p>
                        <p className="text-2xl font-bold text-merelax-accent">
                            {results.posture_score || '-'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
