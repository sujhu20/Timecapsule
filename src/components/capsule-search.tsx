'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, Lock, Unlock } from 'lucide-react';

interface Capsule {
    id: string;
    title: string;
    createdAt: string;
    unlockTime: string;
    isLocked: boolean;
}

interface CapsuleSearchProps {
    capsules: Capsule[];
    onFilterChange: (filtered: Capsule[]) => void;
}

export function CapsuleSearch({ capsules, onFilterChange }: CapsuleSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'locked' | 'unlocked'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'unlock-date'>('newest');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        applyFilters(query, filterStatus, sortBy);
    };

    const handleFilterStatus = (status: 'all' | 'locked' | 'unlocked') => {
        setFilterStatus(status);
        applyFilters(searchQuery, status, sortBy);
    };

    const handleSort = (sort: 'newest' | 'oldest' | 'unlock-date') => {
        setSortBy(sort);
        applyFilters(searchQuery, filterStatus, sort);
    };

    const applyFilters = (
        query: string,
        status: 'all' | 'locked' | 'unlocked',
        sort: 'newest' | 'oldest' | 'unlock-date'
    ) => {
        let filtered = [...capsules];

        // Search filter
        if (query) {
            filtered = filtered.filter(capsule =>
                capsule.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Status filter
        if (status !== 'all') {
            filtered = filtered.filter(capsule =>
                status === 'locked' ? capsule.isLocked : !capsule.isLocked
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sort === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sort === 'oldest') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return new Date(a.unlockTime).getTime() - new Date(b.unlockTime).getTime();
            }
        });

        onFilterChange(filtered);
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search capsules by title..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Filter className="w-4 h-4 inline mr-1" />
                        All
                    </button>
                    <button
                        onClick={() => handleFilterStatus('locked')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'locked'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Lock className="w-4 h-4 inline mr-1" />
                        Locked
                    </button>
                    <button
                        onClick={() => handleFilterStatus('unlocked')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'unlocked'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Unlock className="w-4 h-4 inline mr-1" />
                        Unlocked
                    </button>
                </div>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value as any)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="unlock-date">By Unlock Date</option>
                </select>
            </div>

            {/* Results Count */}
            {searchQuery && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Found {capsules.length} capsule{capsules.length !== 1 ? 's' : ''}
                </p>
            )}
        </div>
    );
}
