'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EyeTestResult } from '@/lib/rfp-api';

interface HistoryChartProps {
    data: EyeTestResult[];
}

export default function HistoryChart({ data }: HistoryChartProps) {
    const formattedData = data.slice().reverse().map(item => ({
        ...item,
        dateStr: new Date(item.check_date).toLocaleDateString('ja-JP'),
        right: item.right_eye,
        left: item.left_eye
    }));

    return (
        <div className="w-full h-64 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="dateStr" stroke="#888" fontSize={12} />
                    <YAxis domain={[0, 2.0]} stroke="#888" fontSize={12} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="right" stroke="#0093D0" strokeWidth={3} dot={{ r: 4, fill: '#0093D0' }} name="みぎ" />
                    <Line type="monotone" dataKey="left" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 4, fill: '#FF6B6B' }} name="ひだり" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
