'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';

export default function MeasuringScreen({ onComplete }) {
    const webcamRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(null);
    const [message, setMessage] = useState('カメラをじゅんびしています...');
    const [progress, setProgress] = useState(0);

    const distanceBuffer = useRef([]);
    const bufferSize = 10;
    const measurementCount = useRef(0);
    const maxMeasurements = 50;

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
        // "user" uses front camera.
    };

    useEffect(() => {
        const loadModels = async () => {
            try {
                setMessage('AIモデルを読み込んでいます...');
                const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
                ]);
                setLoading(false);
                setMessage('かおをカメラに向けてね！');
            } catch (err) {
                console.error("Model load error:", err);
                setMessage('エラーが発生しました。再読み込みしてください。');
            }
        };
        loadModels();
    }, []);

    const estimateDistance = (width) => {
        const K = 9000;
        return Math.round(K / width);
    };

    const handleVideoOnPlay = useCallback(() => {
        const interval = setInterval(async () => {
            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;

                const detections = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions()
                );

                if (detections.length > 0) {
                    const face = detections.reduce((prev, current) =>
                        (prev.box.width * prev.box.height > current.box.width * current.box.height) ? prev : current
                    );

                    const dist = estimateDistance(face.box.width);

                    distanceBuffer.current.push(dist);
                    if (distanceBuffer.current.length > bufferSize) {
                        distanceBuffer.current.shift();
                    }

                    const avgDist = Math.round(
                        distanceBuffer.current.reduce((a, b) => a + b, 0) / distanceBuffer.current.length
                    );

                    setDistance(avgDist);
                    setMessage('はかっています...');

                    measurementCount.current += 1;
                    setProgress((measurementCount.current / maxMeasurements) * 100);

                    if (measurementCount.current >= maxMeasurements) {
                        clearInterval(interval);
                        onComplete(avgDist);
                    }

                } else {
                    setMessage('かおが見つかりません...');
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    useEffect(() => {
        let cleanUp;
        if (!loading) {
            cleanUp = handleVideoOnPlay();
        }
        return () => {
            if (cleanUp) cleanUp();
        }
    }, [loading, handleVideoOnPlay]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-black relative rounded-xl overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20 text-white flex-col">
                    <span className="loading loading-spinner loading-lg mb-4"></span>
                    <p>{message}</p>
                </div>
            )}

            {!loading && (
                <div className="absolute top-4 left-0 right-0 z-10 text-center">
                    <div className="badge badge-lg badge-primary mb-2 shadow-md">{message}</div>
                    {distance && <div className="text-white text-xl font-bold drop-shadow-md">現在の推定: {distance} cm</div>}
                </div>
            )}

            {!loading && (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                    mirrored={true}
                />
            )}

            {!loading && progress > 0 && (
                <div className="absolute bottom-10 left-10 right-10 z-10">
                    <progress className="progress progress-success w-full h-4" value={progress} max="100"></progress>
                </div>
            )}
        </div>
    );
}
