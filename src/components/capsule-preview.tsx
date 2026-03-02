'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, Calendar, FileText } from 'lucide-react';

interface CapsulePreviewProps {
    capsule: {
        id: string;
        title: string;
        unlockTime: string;
        isLocked: boolean;
        preview?: string;
    };
}

export function CapsulePreview({ capsule }: CapsulePreviewProps) {
    const [showPreview, setShowPreview] = useState(false);
    const unlockDate = new Date(capsule.unlockTime);
    const now = new Date();
    const daysUntilUnlock = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (!capsule.isLocked) {
        return null; // No preview needed for unlocked capsules
    }

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-900">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{capsule.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Locked until {unlockDate.toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900 rounded-lg transition-colors"
                >
                    {showPreview ? (
                        <EyeOff className="w-5 h-5 text-amber-600" />
                    ) : (
                        <Eye className="w-5 h-5 text-amber-600" />
                    )}
                </button>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-white dark:bg-slate-800 rounded-lg">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {daysUntilUnlock > 0 ? (
                        <>
                            <span className="text-amber-600 font-bold">{daysUntilUnlock}</span> days until unlock
                        </>
                    ) : (
                        <span className="text-green-600 font-bold">Ready to unlock!</span>
                    )}
                </span>
            </div>

            {/* Preview Content */}
            {showPreview && (
                <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-900">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Preview (First 100 characters)
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        {capsule.preview || 'No preview available'}...
                    </p>
                    <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-900">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            🔒 Full content will be revealed on {unlockDate.toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="h-2 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                        style={{
                            width: `${Math.min(100, Math.max(0, ((now.getTime() - new Date(capsule.unlockTime).getTime() + (daysUntilUnlock * 24 * 60 * 60 * 1000)) / (daysUntilUnlock * 24 * 60 * 60 * 1000)) * 100))}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
