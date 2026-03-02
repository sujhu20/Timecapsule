'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Clock, Package, Calendar } from 'lucide-react';

interface UserStats {
    totalCapsules: number;
    lockedCapsules: number;
    unlockedCapsules: number;
    nextUnlock?: {
        title: string;
        date: string;
        daysUntil: number;
    };
}

interface StatsCardProps {
    stats: UserStats | null;
    loading: boolean;
}

export function UserStatsCard({ stats, loading }: StatsCardProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Capsules */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100 text-sm font-medium">Total Capsules</span>
                    <Package className="w-5 h-5 text-blue-100" />
                </div>
                <div className="text-3xl font-bold">{stats.totalCapsules}</div>
            </div>

            {/* Locked Capsules */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-100 text-sm font-medium">Locked</span>
                    <Clock className="w-5 h-5 text-amber-100" />
                </div>
                <div className="text-3xl font-bold">{stats.lockedCapsules}</div>
            </div>

            {/* Unlocked Capsules */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-green-100 text-sm font-medium">Unlocked</span>
                    <TrendingUp className="w-5 h-5 text-green-100" />
                </div>
                <div className="text-3xl font-bold">{stats.unlockedCapsules}</div>
            </div>

            {/* Next Unlock */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-100 text-sm font-medium">Next Unlock</span>
                    <Calendar className="w-5 h-5 text-purple-100" />
                </div>
                {stats.nextUnlock ? (
                    <>
                        <div className="text-3xl font-bold">{stats.nextUnlock.daysUntil}</div>
                        <div className="text-purple-100 text-xs mt-1">days</div>
                    </>
                ) : (
                    <div className="text-lg font-medium">None</div>
                )}
            </div>
        </div>
    );
}
