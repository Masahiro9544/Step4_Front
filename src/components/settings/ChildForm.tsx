export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { ChildCreate, ChildUpdate, Child } from '@/types/settings';

interface ChildFormProps {
    initialData?: Child;
    onSubmit: (data: ChildCreate | ChildUpdate) => void;
    onCancel: () => void;
    isEditing: boolean;
}

export default function ChildForm({ initialData, onSubmit, onCancel, isEditing }: ChildFormProps) {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [age, setAge] = useState<string>('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setGrade(initialData.grade || '');
            setAge(initialData.age?.toString() || '');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ageNum = age ? parseInt(age) : undefined;

        // For prototype, assuming parent_id is 1
        const formData = isEditing
            ? { name, grade, age: ageNum }
            : { parent_id: 1, name, grade, age: ageNum };

        onSubmit(formData);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 animate-fade-in-down">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
                {isEditing ? '✏️ じょうほうを へんこう' : '➕ あたらしい お子さま'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">おなまえ</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-merelax-primary"
                        placeholder="例：はると"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-500 mb-1">がくねん</label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-merelax-primary"
                        >
                            <option value="">えらぶ</option>
                            <option value="未就学">未就学</option>
                            <option value="小1">小1</option>
                            <option value="小2">小2</option>
                            <option value="小3">小3</option>
                            <option value="小4">小4</option>
                            <option value="小5">小5</option>
                            <option value="小6">小6</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-500 mb-1">ねんれい</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-merelax-primary"
                            placeholder="7"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-500 font-bold bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 text-white font-bold bg-merelax-primary rounded-full hover:bg-blue-600 shadow-md transition-all active:scale-95"
                    >
                        {isEditing ? 'こうしん' : 'とうろく'}
                    </button>
                </div>
            </form>
        </div>
    );
}
