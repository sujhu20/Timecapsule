'use client';

import { useState } from 'react';
import { Download, FileJson, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Capsule {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    unlockTime: string;
    isLocked: boolean;
}

interface ExportDataButtonProps {
    capsules: Capsule[];
    userId: string;
}

export function ExportDataButton({ capsules, userId }: ExportDataButtonProps) {
    const [exporting, setExporting] = useState(false);

    const exportAsJSON = () => {
        setExporting(true);
        try {
            const exportData = {
                exportDate: new Date().toISOString(),
                userId,
                totalCapsules: capsules.length,
                capsules: capsules.map(capsule => ({
                    id: capsule.id,
                    title: capsule.title,
                    content: capsule.content,
                    createdAt: capsule.createdAt,
                    unlockTime: capsule.unlockTime,
                    status: capsule.isLocked ? 'locked' : 'unlocked',
                })),
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `timecapsul-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Data exported successfully!');
        } catch (error) {
            toast.error('Failed to export data');
        } finally {
            setExporting(false);
        }
    };

    const exportAsCSV = () => {
        setExporting(true);
        try {
            const headers = ['ID', 'Title', 'Content', 'Created At', 'Unlock Time', 'Status'];
            const rows = capsules.map(capsule => [
                capsule.id,
                `"${capsule.title.replace(/"/g, '""')}"`,
                `"${capsule.content.replace(/"/g, '""')}"`,
                capsule.createdAt,
                capsule.unlockTime,
                capsule.isLocked ? 'Locked' : 'Unlocked',
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(',')),
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `timecapsul-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Data exported as CSV!');
        } catch (error) {
            toast.error('Failed to export CSV');
        } finally {
            setExporting(false);
        }
    };

    const exportAsTXT = () => {
        setExporting(true);
        try {
            const textContent = [
                '='.repeat(60),
                'TIMECAPSUL DATA EXPORT',
                `Export Date: ${new Date().toLocaleString()}`,
                `Total Capsules: ${capsules.length}`,
                '='.repeat(60),
                '',
                ...capsules.map((capsule, index) => [
                    `\n[Capsule ${index + 1}]`,
                    `-`.repeat(60),
                    `Title: ${capsule.title}`,
                    `Created: ${new Date(capsule.createdAt).toLocaleString()}`,
                    `Unlock Time: ${new Date(capsule.unlockTime).toLocaleString()}`,
                    `Status: ${capsule.isLocked ? 'Locked' : 'Unlocked'}`,
                    `\nContent:\n${capsule.content}`,
                    `-`.repeat(60),
                ].join('\n')),
            ].join('\n');

            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `timecapsul-export-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Data exported as text file!');
        } catch (error) {
            toast.error('Failed to export text file');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="relative inline-block">
            <button
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                onClick={() => {
                    const menu = document.getElementById('export-menu');
                    menu?.classList.toggle('hidden');
                }}
                disabled={exporting}
            >
                {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                Export Data
            </button>

            <div
                id="export-menu"
                className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10"
            >
                <button
                    onClick={exportAsJSON}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 rounded-t-lg"
                >
                    <FileJson className="w-4 h-4" />
                    Export as JSON
                </button>
                <button
                    onClick={exportAsCSV}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Export as CSV
                </button>
                <button
                    onClick={exportAsTXT}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 rounded-b-lg"
                >
                    <FileText className="w-4 h-4" />
                    Export as TXT
                </button>
            </div>
        </div>
    );
}
