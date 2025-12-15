'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, Child, ChildCreate, ChildUpdate } from '../../types/settings';
import ChildSelector from '@/components/settings/ChildSelector';
import SettingsToggle from '@/components/settings/SettingsToggle';
import ChildForm from '@/components/settings/ChildForm';
import { useAuth } from '@/context/AuthContext';

import api from '@/utils/axios';

export default function SettingsPage() {
    const router = useRouter();
    const { user, logout, selectChild, selectedChildId } = useAuth();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [showChildForm, setShowChildForm] = useState(false);
    const [isEditingChild, setIsEditingChild] = useState(false);

    useEffect(() => {
        if (user?.parent_id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        if (!user?.parent_id) return;

        setLoading(true);
        try {
            // 1. Fetch Settings
            const { data: settingsData } = await api.get(`/settings/${user.parent_id}`);
            setSettings(settingsData);

            // 2. Fetch Children
            const { data: childrenData } = await api.get(`/child/all/${user.parent_id}`);
            setChildrenList(childrenData);

        } catch (e) {
            console.error("Failed to fetch settings data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleChildSelect = async (childId: number) => {
        if (!settings || !user?.parent_id) return;
        // Update AuthContext (which now persists to backend)
        await selectChild(childId);
        // Update local settings state for UI consistency if needed, though ChildSelector should use selectedChildId
        setSettings({ ...settings, child_id: childId });
    };

    const handleVoiceToggle = async (enabled: boolean) => {
        if (!settings || !user?.parent_id) return;
        // Optimistic update
        setSettings({ ...settings, voice_enabled: enabled });

        try {
            await api.put(`/settings/${user.parent_id}`, { voice_enabled: enabled });
            // No need to setSettings from response if optimistic update worked, but safer to do so or ignore
        } catch (e) {
            // Revert on error
            setSettings({ ...settings, voice_enabled: !enabled });
            console.error(e);
        }
    };

    const handleChildSubmit = async (data: ChildCreate | ChildUpdate) => {
        try {
            let res;
            if (isEditingChild && settings?.child_id) {
                // Update
                res = await api.put(`/child/${settings.child_id}`, data);
            } else {
                // Create
                res = await api.post('/child/add', data);
            }

            if (res.status === 200) {
                setShowChildForm(false);
                setIsEditingChild(false);
                fetchData(); // Refresh all
            }
        } catch (e) { console.error(e); }
    };

    const handleBack = () => {
        router.push('/home');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-merelax-primary">Loading...</div>;

    return (
        <main className="min-h-screen bg-bg-main pb-20 safe-area-inset-bottom">
            {/* Header */}
            <header className="px-4 py-4 flex items-center bg-white shadow-sm sticky top-0 z-10">
                <button onClick={handleBack} className="flex items-center text-gray-500 font-bold">
                    <span className="text-xl mr-1">←</span>
                    もどる
                </button>
                <h1 className="flex-1 text-center text-lg font-bold text-gray-800 pr-16">⚙️ せってい</h1>
            </header>

            <div className="p-4 space-y-6 max-w-lg mx-auto">

                {/* Child Selection Section */}
                <section>
                    {!showChildForm ? (
                        <div className="space-y-4">
                            <ChildSelector
                                childrenList={childrenList}
                                selectedChildId={selectedChildId ?? settings?.child_id}
                                onSelect={handleChildSelect}
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setShowChildForm(true); setIsEditingChild(false); }}
                                    className="flex-1 py-3 bg-white border-2 border-dashed border-merelax-primary text-merelax-primary rounded-xl font-bold hover:bg-blue-50 transition-colors"
                                >
                                    ➕ あたらしい お子さま
                                </button>

                                {settings?.child_id && (
                                    <button
                                        onClick={() => { setShowChildForm(true); setIsEditingChild(true); }}
                                        className="px-4 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        ✏️
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        user?.parent_id && (
                            <ChildForm
                                isEditing={isEditingChild}
                                initialData={isEditingChild ? childrenList.find(c => c.child_id === settings?.child_id) : undefined}
                                onSubmit={handleChildSubmit}
                                onCancel={() => setShowChildForm(false)}
                                parentId={user.parent_id}
                            />
                        )
                    )}
                </section>

                <hr className="border-gray-200" />

                {/* Settings Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-500 ml-1">アプリのせってい</h2>

                    <SettingsToggle
                        label="おとを だす"
                        enabled={settings?.voice_enabled ?? true}
                        onToggle={handleVoiceToggle}
                    />
                </section>

                {/* Save/Confirm Button (Actually saving happens immediately on change but user likes confirmation button) */}
                <div className="pt-8 space-y-3">
                    <button
                        onClick={handleBack}
                        className="w-full py-4 bg-merelax-primary text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
                    >
                        💾 けってい
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            if (confirm('ログアウトしますか？')) {
                                logout();
                            }
                        }}
                        className="w-full py-4 bg-white border-2 border-red-300 text-red-600 text-lg font-bold rounded-2xl hover:bg-red-50 active:scale-95 transition-all"
                    >
                        🚪 ログアウト
                    </button>
                </div>

            </div>
        </main>
    );
}
