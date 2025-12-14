'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import StartScreen from '../../components/DistanceCheck/StartScreen';
import ResultScreen from '../../components/DistanceCheck/ResultScreen';
// CloudBackground removed as per previous request

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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">

            <h1 className="text-2xl font-bold mb-6 text-center text-blue-800 relative z-10 px-6 py-2">
                スマホ画面距離チェッカー
            </h1>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6 relative min-h-[500px] flex flex-col items-center z-10 border border-gray-100 ring-1 ring-gray-100">
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
    );
}
