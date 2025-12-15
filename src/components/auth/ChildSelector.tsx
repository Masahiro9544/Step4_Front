'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ChildSelectorModal() {
    const { children, selectedChildId, selectChild } = useAuth();
    const router = useRouter();

    // If already selected or no children, don't show modal
    if (selectedChildId !== null || children.length === 0) {
        return null;
    }

    const handleSelectChild = (childId: number) => {
        selectChild(childId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full mx-4"
                style={{
                    boxShadow: '0 20px 60px rgba(0, 160, 233, 0.3)'
                }}
            >
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">👶</div>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: '#00A0E9' }}>
                        だれがつかいますか？
                    </h2>
                    <p className="text-gray-600">
                        お子さまを選んでください
                    </p>
                </div>

                <div className="space-y-3">
                    {children.map((child) => (
                        <motion.button
                            key={child.child_id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectChild(child.child_id)}
                            className="w-full p-5 rounded-2xl font-bold text-lg transition-all text-white"
                            style={{
                                background: 'linear-gradient(135deg, #4DC4FF 0%, #00A0E9 100%)',
                                boxShadow: '0 4px 15px rgba(0, 160, 233, 0.3)'
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <span>{child.name}</span>
                                {child.grade && (
                                    <span className="text-sm opacity-90">({child.grade})</span>
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
