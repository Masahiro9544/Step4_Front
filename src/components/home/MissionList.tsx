export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { DailyMission } from '@/types/home';
import { motion } from 'framer-motion';

interface MissionListProps {
    missions: DailyMission[];
}

export default function MissionList({ missions }: MissionListProps) {
    return (
        <div className="w-full px-4 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">きょうのミッション</h2>
            <div className="grid gap-3">
                {missions.map((mission, index) => (
                    <Link href={mission.link} key={mission.mission_id} className="block">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-4 rounded-xl shadow-sm border-2 transition-colors ${mission.status === 'completed'
                                    ? 'bg-merelax-success/10 border-merelax-success'
                                    : 'bg-white border-gray-200 hover:border-merelax-primary'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${mission.status === 'completed' ? 'bg-merelax-success text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {mission.status === 'completed' ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-current"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{mission.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        {mission.status === 'completed' ? '完了！' : 'やってみよう！'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-merelax-primary">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
