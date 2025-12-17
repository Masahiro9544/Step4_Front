'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import LandoltC from '@/components/LandoltC';
import { useVisionTest, Direction } from '@/hooks/useVisionTest';
import { saveResult, saveEyeTest } from '@/lib/rfp-api';
import { useAuth } from '@/context/AuthContext';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useVoiceGuidance } from '@/hooks/useVoiceGuidance';
import { useSound } from '@/hooks/useSound';
import VisionTestCharacter from '@/components/VisionTestCharacter';

function TestContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Use state to track distance, initialized from searchParams but robust to client updates
    const [distance, setDistance] = useState<'30cm' | '3m'>((searchParams.get('distance') as '30cm' | '3m') || '30cm');
    const { selectedChildId } = useAuth();

    // Robust check for query parameter on client-side mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const dist = params.get('distance') as '30cm' | '3m';
            if (dist && (dist === '30cm' || dist === '3m') && dist !== distance) {
                console.log('Updated distance from window.location:', dist);
                setDistance(dist);
            }
        }
    }, [searchParams, distance]);

    const { state, currentDirection, calculateSizePx, answer, startRightEye, nextTest, undo, togglePause, canUndo } = useVisionTest(distance);
    const [showResult, setShowResult] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isSetup, setIsSetup] = useState(true); // Setup phase state
    const [hasStarted, setHasStarted] = useState(false); // New: Explicit user start state

    const { speak, voiceCount, cancel } = useVoiceGuidance();
    const { playSound, stopAll: stopSound } = useSound();

    // Ref to control guide sequence cancellation and mount status
    const stopGuideRef = useRef(false);
    const isMounted = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            stopSound();
            cancel();
            stopGuideRef.current = true;
        };
    }, [stopSound, cancel]);

    const handleQuit = useCallback(() => {
        if (window.confirm('チェックをちゅうだんして、ホームにもどりますか？')) {
            try {
                stopGuideRef.current = true;
                stopSound();
                cancel();
            } catch (e) {
                console.error('Error during cleanup:', e);
            }
            // Use router.push for SPA navigation (keeps login state)
            router.push('/');
        }
    }, [stopSound, cancel, router]);

    const startTest = useCallback(() => {
        stopGuideRef.current = true; // Stop any ongoing guide sequence
        stopSound(); // Stop any guide audio

        if (isMounted.current) {
            setIsSetup(false);
            nextTest();
            // speak('いくよ、あなが あいている ほうこうを おしえて！'); // Removed TTS
        }
    }, [nextTest, speak, stopSound]);

    const handleAnswer = useCallback((dir: Direction | 'start') => {
        if (dir === 'start') {
            if (isSetup && hasStarted) {
                startTest();
            }
            return;
        }

        if (isSetup) return;

        // Feedback Logic
        const isCorrect = dir === currentDirection;
        if (isCorrect) {
            cancel();
            // speak('せいかい！'); // Removed TTS
        } else {
            cancel();
            // speak('もういっかい！'); // Removed TTS
        }

        playSound('/sounds/koreha.wav'); // Question the next symbol
        answer(dir);
    }, [speak, answer, isSetup, startTest, hasStarted, currentDirection, cancel, playSound]);

    const { isListening, startListening, toggleListening, error } = useVoiceInput(handleAnswer, state.isPaused);

    // Initial setup with Interactive Guide
    const handleStartClick = () => {
        stopSound();

        setHasStarted(true);
        cancel();
        startListening();

        // Reset cancellation ref for new session
        stopGuideRef.current = false;

        // Interactive Guide Sequence (Initial Start)
        const guide = async () => {
            const pause = (ms: number) => new Promise(r => setTimeout(r, ms));

            if (stopGuideRef.current || !isMounted.current) return;

            if (distance === '30cm') {
                playSound('/sounds/shiryoku30cm.wav');
            } else {
                playSound('/sounds/shiryoku3m.wav');
            }
            await pause(12000); // Wait for distance voice (approx 11s)

            if (stopGuideRef.current || !isMounted.current) return;

            // Restored migimekarahidarime.wav here
            console.log('Playing migimekarahidarime.wav');
            playSound('/sounds/migimekarahidarime.wav');
            await pause(6000); // Wait for eye instruction (approx 5s)

            if (stopGuideRef.current || !isMounted.current) return;

            // speak('じゅんびができたら、はじめます。オーケー、といってください'); // Removed TTS
        };

        guide();
    };

    const [results, setResults] = useState<{ right?: number; left?: number }>({});

    // Voice Guidance Updates for Left First
    useEffect(() => {
        if (state.isFinished && isMounted.current) {
            if (state.eye === 'left') {
                // speak('つぎは ひだりめを かくしてね'); // Removed TTS
            } else {
                // speak('おつかれさま！'); // Removed TTS
            }
        }
    }, [state.isFinished, state.eye, speak]);

    const handleNextEye = () => {
        if (state.result !== null) {
            setResults(prev => ({ ...prev, left: state.result! }));
        }
        // Start Right Eye
        startRightEye();

        // speak('いくよ、あなが あいている ほうこうを おしえて！'); // Removed TTS
    };

    const handleFinish = async () => {
        playSound('/sounds/otukare.wav');
        let finalRightResult = state.result;
        let finalLeft = results.left;

        if (finalRightResult !== null) {
            setResults(prev => ({ ...prev, right: finalRightResult! }));
        }

        // Save accumulated results
        if (selectedChildId) {
            await saveEyeTest(selectedChildId, finalLeft, finalRightResult ?? undefined, distance);
        } else {
            console.error("No child selected");
            // Fallback or early return? For MVP, maybe fallback to 1 or alert
            await saveEyeTest(1, finalLeft, finalRightResult ?? undefined, distance);
        }

        setSaved(true);
        setShowResult(true);
    };

    const formatResult = (val?: number) => {
        if (!val) return '-';
        if (val === 0.1) return '0.5未満';
        return val.toFixed(1);
    };

    if (showResult) {
        const leftVal = results.left ?? 0;
        const rightVal = results.right ?? 0;
        const minVal = Math.min(leftVal, rightVal);

        let Suggestion = null;

        if (minVal >= 1.0) {
            // No specific suggestion
        } else if (minVal >= 0.7) {
            Suggestion = (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-sm rounded-r-lg">
                    <h3 className="font-bold text-lg text-yellow-700 mb-1">目のお医者さんでチェックしよう</h3>
                    <p className="text-gray-700 leading-relaxed">
                        少し見えにくいかも。目のお医者さんでみてもらうと安心だよ。<br />
                        必要ならZoffでも視力チェックができます。
                    </p>
                </div>
            );
        } else {
            // 0.6 or lower (includes 0.5, 0.1)
            Suggestion = (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-left text-sm rounded-r-lg">
                    <h3 className="font-bold text-lg text-red-700 mb-1">早めにチェックしよう</h3>
                    <p className="text-gray-700 leading-relaxed">
                        見えづらいかもしれません。早めに目のお医者さんでみてもらってね。<br />
                        必要ならZoffでも視力チェックができます。
                    </p>
                </div>
            );
        }

        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#E0F2F7] p-4 font-sans text-[#0093D0]">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border-4 border-[#0093D0]">
                    <h2 className="text-3xl font-bold">おつかれさま！</h2>
                    <p className="text-xl text-gray-700">チェックが おわりました</p>

                    <div className="bg-blue-50 p-6 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center text-2xl border-b pb-2 border-blue-100">
                            <span className="font-bold">みぎめ</span>
                            <span className="font-bold text-[#0093D0]">{formatResult(results.right)}</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl">
                            <span className="font-bold">ひだりめ</span>
                            <span className="font-bold text-[#0093D0]">{formatResult(results.left)}</span>
                        </div>
                    </div>

                    {Suggestion}

                    <div className="mt-6 text-left border-t pt-4">
                        <h3 className="font-bold text-gray-500 text-sm">たいせつなおしらせ</h3>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                            このけんさは簡単なチェックです。正しい視力は目のお医者さんで調べてもらってね。
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            router.push('/home');
                        }}
                        className="w-full py-4 bg-[#0093D0] hover:bg-[#007bb5] text-white rounded-2xl font-bold text-xl shadow-md transition-transform active:scale-95"
                    >
                        トップへ もどる
                    </button>
                </div>
            </main>
        );
    }

    if (state.isFinished) {
        if (state.eye === 'left') {
            return (
                <main className="flex min-h-screen flex-col items-center justify-center bg-[#E0F2F7] p-4 font-sans text-[#0093D0]">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border-4 border-[#0093D0]">
                        <h2 className="text-2xl font-bold">ひだりめ けんさ しゅうりょう！</h2>
                        <p className="text-lg text-gray-700">つぎは <strong>みぎめ</strong>を かくして、<br />ひだりめで やってみよう</p>
                        <button
                            onClick={handleNextEye}
                            className="w-full py-4 bg-[#0093D0] hover:bg-[#007bb5] text-white rounded-2xl font-bold text-xl shadow-md transition-transform active:scale-95"
                        >
                            みぎめを はじめる
                        </button>
                    </div>
                </main>
            );
        } else {
            return (
                <main className="flex min-h-screen flex-col items-center justify-center bg-[#E0F2F7] p-4 font-sans text-[#0093D0]">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border-4 border-[#0093D0]">
                        <h2 className="text-2xl font-bold">みぎめ けんさ しゅうりょう！</h2>
                        <p className="text-lg text-gray-700">これで おしまいです</p>
                        <button
                            onClick={handleFinish}
                            className="w-full py-4 bg-[#0093D0] hover:bg-[#007bb5] text-white rounded-2xl font-bold text-xl shadow-md transition-transform active:scale-95"
                        >
                            けっかを ほぞんする
                        </button>
                    </div>
                </main>
            );
        }
    }

    // FIRST SCREEN: Explicit Start Button (Bypasses Autoplay Block)
    if (!hasStarted) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#E0F2F7] p-4 font-sans text-[#0093D0]">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8 border-4 border-[#0093D0]">
                    <h2 className="text-3xl font-bold">しりょくチェック</h2>
                    <p className="text-xl text-gray-700">
                        「こえ」か「ボタン」をつかいます。<br />
                        しずかな ばしょで やってね。
                    </p>
                    <button
                        onClick={handleStartClick}
                        className="w-full py-6 bg-[#0093D0] hover:bg-[#007bb5] text-white rounded-2xl font-bold text-2xl shadow-lg transition-transform active:scale-95"
                    >
                        はじめる
                    </button>
                </div>
            </main>
        );
    }

    // SETUP SCREEN (After Click)
    if (isSetup) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#E0F2F7] p-4 font-sans text-[#0093D0] relative">
                {/* Debug Indicator */}
                <div className="absolute top-2 left-2 text-xs bg-black/10 p-1 rounded">
                    Mic: {isListening ? 'ON' : 'OFF'} | Voices: {voiceCount}
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-8 border-4 border-[#0093D0]">
                    <h2 className="text-3xl font-bold">じゅんび</h2>

                    <div className="space-y-4 text-xl text-gray-700 text-left pl-4">
                        <div className="flex items-start gap-3">
                            <span className="bg-[#0093D0] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">1</span>
                            <p>がめんから <strong>{distance}</strong> はなれてね</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="bg-[#0093D0] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">2</span>
                            <p><strong>ひだりめ</strong>を かくしてね<br />(みぎめの けんさだよ)</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="bg-[#0093D0] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">3</span>
                            <p>じゅんびができたら<br /><strong>「オーケー」</strong>と いってね<br /><span className="text-sm text-gray-500">（ボタンでも スタートできるよ）</span></p>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col items-center gap-4">
                        <div className={`text-2xl font-bold ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                            {isListening ? 'きいています...' : 'マイクじゅんびちゅう'}
                        </div>
                        {error && (
                            <div className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={() => {
                                startTest();
                            }}
                            className="w-full py-4 bg-[#0093D0] hover:bg-[#007bb5] text-white rounded-2xl font-bold text-xl shadow-md transition-transform active:scale-95"
                        >
                            こえ か ボタンで スタート
                        </button>
                    </div>
                </div>
            </main>
        );
    }





    const currentLevel = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2][state.currentLevelIndex];
    const sizePx = calculateSizePx(currentLevel);

    return (
        <main className="flex flex-col min-h-[100dvh] items-center bg-[#E0F2F7] font-sans justify-between pb-4 overflow-y-auto">
            {/* Header & Character Group */}
            <div className="w-full flex flex-col items-center shrink-0">
                {/* Header - Compact */}
                <div className="w-full px-4 py-2 flex justify-between items-center text-[#0093D0] z-10 relative">
                    <button
                        onClick={handleQuit}
                        className="bg-white text-[#0093D0] px-4 py-2 rounded-full font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-sm absolute left-4"
                    >
                        × やめる
                    </button>

                    <span className="font-bold text-3xl mx-auto">
                        {state.eye === 'right' ? 'みぎめ' : 'ひだりめ'}
                    </span>

                    <div className="flex items-center gap-2 absolute right-4">
                        {isListening && <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full animate-pulse">おんせいON</span>}
                        <span className="text-sm font-bold bg-white px-3 py-1 rounded-full shadow-sm">
                            {distance}
                        </span>
                    </div>
                </div>

                {/* Character Guide - Compact area */}
                <div className="mt-4 shrink-0 z-10 text-center">
                    <Image
                        src="/images/character/shiryokucheck.jpeg"
                        alt="Guide Character"
                        width={150}
                        height={150}
                        className="rounded-3xl border-4 border-white shadow-md mx-auto"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* C Display Area - Flexible Width but ensure spacing */}
            {/* Added pb-20 to prevent overlap with absolute buttons of the control panel */}
            <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center min-h-0 px-4 py-2 pb-20 mx-auto gap-4">
                <div className="text-[#0093D0] font-bold text-xl tracking-wider shrink-0 mt-2">
                    ここをみてね
                </div>
                {/* Responsive container */}
                <div className="relative w-full aspect-square max-w-[280px] bg-white rounded-[3rem] border-[12px] border-[#0093D0] flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
                    {state.isPaused ? (
                        <div className="text-2xl font-bold text-gray-400">いちじていし</div>
                    ) : (
                        <LandoltC size={sizePx} direction={currentDirection} />
                    )}
                </div>

                {state.isRetrying && !state.isPaused && (
                    <div className="mt-2 text-[#0093D0] font-bold text-xl animate-bounce bg-white px-6 py-2 rounded-full shadow-lg border-2 border-[#0093D0] z-20">
                        もういっかい！
                    </div>
                )}
            </div>

            {/* Controls - Smaller width as requested */}
            <div className="w-full max-w-[280px] p-4 bg-white rounded-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] relative shrink-0 z-10 mx-auto mb-4">
                {/* Support Buttons */}
                <div className="absolute -top-12 right-0 flex gap-2">
                    <button
                        onClick={toggleListening}
                        className={`p-2 rounded-full shadow-md transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-500 hover:text-[#0093D0]'}`}
                        title={isListening ? "音声入力OFF" : "音声入力ON"}
                    >
                        {isListening ? '🎤' : '🎤'}
                    </button>
                    <button
                        onClick={togglePause}
                        className="bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-[#0093D0] transition-colors"
                        title="一時停止"
                    >
                        {state.isPaused ? '▶' : '⏸'}
                    </button>
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`bg-white p-2 rounded-full shadow-md transition-colors ${!canUndo ? 'text-gray-300' : 'text-gray-500 hover:text-[#0093D0]'}`}
                        title="ひとつ戻る"
                    >
                        ↩
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="col-start-2">
                        <button onClick={() => handleAnswer('up')} className="w-full aspect-[4/3] bg-[#E0F2F7] hover:bg-[#B3E5FC] text-[#0093D0] rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center text-2xl font-bold">
                            ↑
                        </button>
                    </div>
                    <div className="col-start-1 row-start-2">
                        <button onClick={() => handleAnswer('left')} className="w-full aspect-[4/3] bg-[#E0F2F7] hover:bg-[#B3E5FC] text-[#0093D0] rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center text-2xl font-bold">
                            ←
                        </button>
                    </div>
                    <div className="col-start-2 row-start-2 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            ●
                        </div>
                    </div>
                    <div className="col-start-3 row-start-2">
                        <button onClick={() => handleAnswer('right')} className="w-full aspect-[4/3] bg-[#E0F2F7] hover:bg-[#B3E5FC] text-[#0093D0] rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center text-2xl font-bold">
                            →
                        </button>
                    </div>
                    <div className="col-start-2 row-start-3">
                        <button onClick={() => handleAnswer('down')} className="w-full aspect-[4/3] bg-[#E0F2F7] hover:bg-[#B3E5FC] text-[#0093D0] rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center text-2xl font-bold">
                            ↓
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function TestPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TestContent />
        </Suspense>
    );
}
