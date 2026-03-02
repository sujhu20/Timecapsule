import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <AlertTriangle className="w-20 h-20 mx-auto text-amber-500" />
                </div>

                <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
                    404
                </h1>

                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    Page Not Found
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        View Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
