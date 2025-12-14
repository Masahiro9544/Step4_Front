'use client';

import React from 'react';

export default function StartScreen({ onStart }) {
    return (
        <div className="flex flex-col items-center justify-between h-full py-8 text-center animate-fade-in relative z-10 w-full">
            <div className="mb-6 w-full flex flex-col items-center">

                {/* Chat Bubble - Moved ABOVE character */}
                <div className="mb-[-10px] animate-bounce-slow z-20 relative">
                    <div className="chat chat-center">
                        <div className="chat-bubble chat-bubble-primary text-lg font-bold shadow-md bg-white text-blue-800 border-2 border-blue-200">
                            スマホとかおのきょりを<br />チェックするよ！
                        </div>
                    </div>
                </div>

                {/* Character Image */}
                <div className="w-48 h-48 mx-auto mb-4 relative z-10">
                    <img
                        src="/images/character/character_happy.png"
                        alt="Character"
                        className="w-full h-full object-contain drop-shadow-xl"
                    />
                </div>

                <p className="text-gray-600 font-bold text-lg mt-2 bg-white/80 inline-block px-4 py-2 rounded-full shadow-sm backdrop-blur-sm border border-gray-100">
                    スマホにお顔を向けてね
                </p>
            </div>

            <button
                onClick={onStart}
                className="btn btn-primary btn-lg w-full max-w-xs text-xl rounded-full shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-blue-400 to-blue-600 border-none text-white ring-4 ring-blue-100"
            >
                そくていかいし
            </button>
        </div>
    );
}
