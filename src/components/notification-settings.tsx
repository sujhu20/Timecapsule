'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreferences {
    emailNotifications: boolean;
    unlockReminders: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
}

export function NotificationSettings() {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        emailNotifications: true,
        unlockReminders: true,
        weeklyDigest: false,
        marketingEmails: false,
    });
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Load preferences from API
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const response = await fetch('/api/user/notifications');
            if (response.ok) {
                const data = await response.json();
                setPreferences(data.preferences);
            }
        } catch (error) {
            // Use defaults if API fails
        }
    };

    const handleToggle = (key: keyof NotificationPreferences) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
        setHasChanges(true);
    };

    const savePreferences = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/user/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preferences }),
            });

            if (response.ok) {
                toast.success('Notification preferences saved!');
                setHasChanges(false);
            } else {
                toast.error('Failed to save preferences');
            }
        } catch (error) {
            toast.error('Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Notification Preferences
                </h2>
            </div>

            <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Receive email updates about your capsules
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggle('emailNotifications')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${preferences.emailNotifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.emailNotifications ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* Unlock Reminders */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Unlock Reminders</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Get notified when capsules are ready to unlock
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggle('unlockReminders')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${preferences.unlockReminders ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.unlockReminders ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* Weekly Digest */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Weekly Digest</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Receive a weekly summary of your capsules
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggle('weeklyDigest')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${preferences.weeklyDigest ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.weeklyDigest ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Marketing Emails</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Receive news and updates about Timecapsul
                        </p>
                    </div>
                    <button
                        onClick={() => handleToggle('marketingEmails')}
                        className={`relative w-12 h-6 rounded-full transition-colors ${preferences.marketingEmails ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.marketingEmails ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Save Button */}
            {hasChanges && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={savePreferences}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>Saving...</>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Save Preferences
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
