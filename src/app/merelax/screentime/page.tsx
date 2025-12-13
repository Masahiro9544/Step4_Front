'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CharacterMessage from '@/components/home/CharacterMessage';
import TimerDisplay from '@/components/screentime/TimerDisplay';
import ControlButtons from '@/components/screentime/ControlButtons';
import { ScreenTimeStatus } from '@/types/screentime';

export default function ScreenTimePage() {
    const router = useRouter();
    const [status, setStatus] = useState<ScreenTimeStatus | null>(null);
    const [childId, setChildId] = useState<number>(1); // Default
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false); // 一時停止状態
    const [startTime, setStartTime] = useState<number | null>(null); // 開始時刻（タイムスタンプ）
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const syncRef = useRef<NodeJS.Timeout | null>(null);
    const isPausedRef = useRef(false); // isPausedの最新値を保持

    const API_BASE = `${process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000'}/api/v1`;

    // 1. Initialize: Get Child ID & Status
    useEffect(() => {
        async function init() {
            try {
                // Fetch Child ID from settings
                const settingsRes = await fetch(`${API_BASE}/settings/1`);
                let currentChildId = 1;
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    if (settings.child_id) currentChildId = settings.child_id;
                }
                setChildId(currentChildId);

                // Fetch initial status
                await fetchStatus(currentChildId);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        init();

        return () => clearTimers();
    }, []);

    // Page Visibility API: バックグラウンドから復帰したら同期
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && status?.is_active && !isPaused) {
                fetchStatus(childId);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [status?.is_active, isPaused, childId]);

    const clearTimers = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (syncRef.current) clearInterval(syncRef.current);
    };

    const fetchStatus = async (cId: number) => {
        try {
            const res = await fetch(`${API_BASE}/screentime/status?child_id=${cId}`);
            if (res.ok) {
                const data: ScreenTimeStatus = await res.json();
                setStatus(data);

                // Handle Timer Logic
                if (data.is_active) {
                    startLocalTimer(data.elapsed_seconds);
                    startSyncTimer(cId);
                } else {
                    clearTimers();
                }
            }
        } catch (e) { console.error(e); }
    };

    const startLocalTimer = (initialSeconds: number) => {
        if (timerRef.current) clearInterval(timerRef.current);

        // タイムスタンプベースの開始時刻を記録
        const now = Date.now();
        const calculatedStartTime = now - (initialSeconds * 1000);
        setStartTime(calculatedStartTime);

        // Update local state immediately
        setStatus(prev => prev ? { ...prev, elapsed_seconds: initialSeconds } : null);

        timerRef.current = setInterval(() => {
            if (isPausedRef.current) return; // 一時停止中はスキップ

            setStatus(prev => {
                if (!prev) return prev;

                // タイムスタンプベースで経過時間を計算（より正確）
                const currentTime = Date.now();
                const elapsedMs = currentTime - calculatedStartTime;
                const newSeconds = Math.floor(elapsedMs / 1000);

                // Alert level update
                let level = prev.alert_level;
                if (newSeconds > 1800) level = 2; // 30m
                else if (newSeconds > 600) level = 1; // 10m

                return { ...prev, elapsed_seconds: newSeconds, alert_level: level, is_active: true };
            });
        }, 1000);
    };

    const startSyncTimer = (cId: number) => {
        if (syncRef.current) clearInterval(syncRef.current);
        // Sync every 10 seconds
        syncRef.current = setInterval(() => {
            fetchStatus(cId);
        }, 10000);
    };

    const handleStart = async () => {
        if (isPaused) {
            // 一時停止から再開
            setIsPaused(false);
            isPausedRef.current = false;
            setStatus(prev => prev ? { ...prev, is_active: true } : null);
            if (status) {
                startLocalTimer(status.elapsed_seconds);
                startSyncTimer(childId);
            }
            return;
        }

        // 新規開始
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/screentime/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ child_id: childId })
            });
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
                setIsPaused(false);
                isPausedRef.current = false;
                startLocalTimer(0);
                startSyncTimer(childId);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handlePause = () => {
        // タイマーを一時停止
        setIsPaused(true);
        isPausedRef.current = true;
    };

    const handleReset = () => {
        // タイマーをリセット
        clearTimers();
        setIsPaused(false);
        isPausedRef.current = false;
        setStartTime(null);
        setStatus(prev => prev ? { ...prev, elapsed_seconds: 0, is_active: false, alert_level: 0 } : null);
    };

    const handleRecord = async () => {
        // 記録を保存
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/screentime/end`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ child_id: childId })
            });
            if (res.ok) {
                clearTimers();
                setIsPaused(false);
                isPausedRef.current = false;
                setStartTime(null);
                // 成功メッセージを表示（将来的にはモーダルなど）
                alert('きろくしました！');
                fetchStatus(childId);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (loading && !status) return <div className="min-h-screen flex items-center justify-center text-merelax-primary">Loading...</div>;

    return (
        <main className="min-h-screen pb-20 safe-area-inset-bottom" style={{ backgroundColor: '#F6F9FB' }}>
            <header className="px-6 py-6 flex items-center bg-white shadow-md rounded-b-3xl sticky top-0 z-10">
                <Link href="/" className="flex items-center font-bold text-gray-600 hover:text-gray-800 transition-colors">
                    <span className="text-2xl mr-2">←</span>
                    <span className="text-lg">もどる</span>
                </Link>
                <h1 className="flex-1 text-center text-3xl font-bold pr-20 leading-tight" style={{ color: '#00A0E9' }}>
                    ⏱️ スマホをつかったじかん
                </h1>
            </header>

            <div className="p-4 flex flex-col items-center gap-8">

                {/* Character */}
                <div className="w-full">
                    <CharacterMessage
                        message={status?.message || "いま どのくらい つかってるかな？"}
                    />
                </div>

                {/* Timer */}
                <TimerDisplay
                    seconds={status?.elapsed_seconds || 0}
                    alertLevel={status?.alert_level || 0}
                />

                {/* Controls */}
                <ControlButtons
                    isActive={status?.is_active || false}
                    isPaused={isPaused}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                    onRecord={handleRecord}
                    isLoading={loading}
                />

                {/* Info */}
                {!status?.is_active && !isPaused && (
                    <div className="p-6 rounded-2xl text-center font-bold text-xl" style={{ backgroundColor: '#E6F7FF', color: '#00A0E9' }}>
                        📊 きょうは まだ つかってないよ
                    </div>
                )}

                {isPaused && (
                    <div className="p-6 rounded-2xl text-center font-bold text-xl" style={{ backgroundColor: '#FFF9E6', color: '#FFA500' }}>
                        ⏸️ いったん おやすみちゅう
                    </div>
                )}

            </div>
        </main>
    );
}
