export const dynamic = 'force-dynamic';

import React from 'react';
import { Child } from '@/types/settings';

interface ChildSelectorProps {
    childrenList: Child[];
    selectedChildId: number | null | undefined;
    onSelect: (childId: number) => void;
}

export default function ChildSelector({ childrenList, selectedChildId, onSelect }: ChildSelectorProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-gray-500 mb-2 ml-1">お子さまを えらぶ</label>
            <div className="relative">
                <select
                    value={selectedChildId || ''}
                    onChange={(e) => onSelect(Number(e.target.value))}
                    className="w-full appearance-none bg-white border-2 border-primary-100 text-gray-800 font-bold py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-merelax-primary transition-colors"
                >
                    <option value="" disabled>だれがつかいますか？</option>
                    {childrenList.map((child) => (
                        <option key={child.child_id} value={child.child_id}>
                            {child.name} {child.grade ? `(${child.grade})` : ''}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
