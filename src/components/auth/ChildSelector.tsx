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
                className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 max-h-[90vh] flex flex-col"
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

                <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2" style={{ maxHeight: 'calc(90vh - 220px)' }}>
                    {children.map((child) => (
                        <motion.button
                            key={child.child_id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectChild(child.child_id)}
                            className="p-5 rounded-2xl font-bold text-lg transition-all text-white"
                            style={{
                                background: 'linear-gradient(135deg, #4DC4FF 0%, #00A0E9 100%)',
                                boxShadow: '0 4px 15px rgba(0, 160, 233, 0.3)'
                            }}
                        >
                            <div className="flex flex-col items-center text-center">
                                <span className="mb-1">{child.name}</span>
                                {child.grade && (
                                    <span className="text-sm opacity-90">{child.grade}</span>
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
