'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, Child, ChildCreate, ChildUpdate } from '@/types/settings';
import ChildSelector from '@/components/settings/ChildSelector';
import SettingsToggle from '@/components/settings/SettingsToggle';
import ChildForm from '@/components/settings/ChildForm';

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [showChildForm, setShowChildForm] = useState(false);
    const [isEditingChild, setIsEditingChild] = useState(false);

    // Mock Parent ID for prototype
    const PARENT_ID = 1;
    const API_BASE = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Settings
            const settingsRes = await fetch(`${API_BASE}/settings/${PARENT_ID}`);
            if (settingsRes.ok) {
                setSettings(await settingsRes.json());
            }

            // 2. Fetch Children
            const childrenRes = await fetch(`${API_BASE}/child/all/${PARENT_ID}`);
            if (childrenRes.ok) {
                setChildrenList(await childrenRes.json());
            }

        } catch (e) {
            console.error("Failed to fetch settings data", e);
            // Alert?
        } finally {
            setLoading(false);
        }
    };

    const handleChildSelect = async (childId: number) => {
        if (!settings) return;
        try {
            const res = await fetch(`${API_BASE}/settings/${PARENT_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ child_id: childId })
            });
            if (res.ok) {
                setSettings(await res.json());
            }
        } catch (e) { console.error(e); }
    };

    const handleVoiceToggle = async (enabled: boolean) => {
        if (!settings) return;
        // Optimistic update
        setSettings({ ...settings, voice_enabled: enabled });

        try {
            await fetch(`${API_BASE}/settings/${PARENT_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voice_enabled: enabled })
            });
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
                res = await fetch(`${API_BASE}/child/${settings.child_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // Create
                res = await fetch(`${API_BASE}/child/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (res.ok) {
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
                                selectedChildId={settings?.child_id}
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
                        <ChildForm
                            isEditing={isEditingChild}
                            initialData={isEditingChild ? childrenList.find(c => c.child_id === settings?.child_id) : undefined}
                            onSubmit={handleChildSubmit}
                            onCancel={() => setShowChildForm(false)}
                        />
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
                <div className="pt-8">
                    <button
                        onClick={handleBack}
                        className="w-full py-4 bg-merelax-primary text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
                    >
                        💾 けってい
                    </button>
                </div>

            </div>
        </main>
    );
}
