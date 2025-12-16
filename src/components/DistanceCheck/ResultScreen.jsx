'use client';

import React, { useState } from 'react';

export default function ResultScreen({ distance, onRetry, onSave }) {
    const [saving, setSaving] = useState(false);

    let status = 'normal';
    let msg = 'よくできました！';
    let subMsg = 'ばっちりです！いつもこのきょりでスマホをみよう！';
    let colorClass = 'text-green-600';
    let imgSrc = '/images/character/character_happy.png';

    if (distance < 20) {
        status = 'danger';
        msg = 'ちかすぎるよ！';
        subMsg = 'めがつかれちゃうよ。はなれてみよう！';
        colorClass = 'text-red-600';
        imgSrc = '/images/character/character_surprised.png';
    } else if (distance < 30) {
        status = 'warning';
        msg = 'ちゅうい！';
        subMsg = 'もう少しはなれてみようね！';
        colorClass = 'text-yellow-600';
        imgSrc = '/images/character/character_normal.png';
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/api/distance-check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    child_id: 1,
                    distance_cm: distance,
                    alert_flag: distance < 20
                })
            });

            if (!response.ok) {
                throw new Error('Save failed');
            }

            await response.json();
            onSave();
        } catch (error) {
            console.error(error);
            alert('申し訳ありません。保存に失敗しました。');
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between h-full py-6 text-center w-full animate-fade-in relative z-10">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-40 h-40 mb-4 relative mx-auto">
                    <img src={imgSrc} alt="Result Character" className="w-full h-full object-contain drop-shadow-xl" />
                </div>
                <h2 className={`text-4xl font-bold mb-2 ${colorClass}`}>
                    {distance} cm
                </h2>
                <div className="text-xl font-bold mb-2">{msg}</div>
                <p className="text-gray-600 px-4">{subMsg}</p>
            </div>

            <div className="w-full flex flex-col gap-3 px-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`btn btn-lg w-full text-white rounded-xl shadow-md bg-blue-500 hover:bg-blue-600 border-none ${saving ? 'loading' : ''}`}
                >
                    {saving ? 'ほぞんしています...' : 'けっかをほぞんする'}
                </button>
                <button
                    onClick={onRetry}
                    disabled={saving}
                    className="btn btn-lg w-full text-white rounded-xl shadow-md bg-blue-500 hover:bg-blue-600 border-none"
                >
                    もういちどはかる
                </button>
            </div>
        </div>
    );
}
