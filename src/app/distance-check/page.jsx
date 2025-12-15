'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import StartScreen from '../../components/DistanceCheck/StartScreen';
import ResultScreen from '../../components/DistanceCheck/ResultScreen';

// Dynamically import MeasuringScreen to prevent SSR issues with face-api.js
const MeasuringScreen = dynamic(
    () => import('../../components/DistanceCheck/MeasuringScreen'),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center p-8 text-blue-600">
                <p className="loading loading-spinner loading-lg mb-2"></p>
                <p>カメラをじゅんびしています...</p>
            </div>
        )
    }
);

export default function DistanceCheckPage() {
    const [step, setStep] = useState('start'); // start, measuring, result
    const [distanceResult, setDistanceResult] = useState(null);

    const handleStart = () => {
        setStep('measuring');
    };

    const handleMeasurementComplete = (distance) => {
        setDistanceResult(distance);
        setStep('result');
    };

    const handleRetry = () => {
        setStep('measuring');
        setDistanceResult(null);
    };

    const handleSaveComplete = () => {
        alert('保存しました！ダッシュボードへ移動します（仮）');
    };

    return (
        <main className="min-h-screen pb-20 safe-area-inset-bottom" style={{ backgroundColor: '#F6F9FB' }}>
            <header className="px-6 py-6 flex items-center bg-white shadow-md rounded-b-3xl sticky top-0 z-10">
                <Link href="/" className="flex items-center font-bold text-gray-600 hover:text-gray-800 transition-colors">
                    <span className="text-2xl mr-2">←</span>
                    <span className="text-lg">もどる</span>
                </Link>
                <h1 className="flex-1 text-center text-3xl font-bold pr-20 leading-tight" style={{ color: '#00A0E9' }}>
                    📏 スマホ画面距離チェッカー
                </h1>
            </header>

            <div className="p-4 flex flex-col items-center gap-8">
                <div className="w-full max-w-md">
                    {step === 'start' && <StartScreen onStart={handleStart} />}
                    {step === 'measuring' && <MeasuringScreen onComplete={handleMeasurementComplete} />}
                    {step === 'result' && (
                        <ResultScreen
                            distance={distanceResult}
                            onRetry={handleRetry}
                            onSave={handleSaveComplete}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
