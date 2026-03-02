'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const cookieConsent = localStorage.getItem('timecapsul_cookie_consent');
        if (!cookieConsent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('timecapsul_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem('timecapsul_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0">
                        <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div className="flex-grow text-center md:text-left">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            We use cookies
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                            By clicking "Accept", you consent to our use of cookies.
                            <Link href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                                Read our Cookie Policy
                            </Link>.
                        </p>
                    </div>

                    <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
                        <button
                            onClick={declineCookies}
                            className="flex-1 md:flex-none px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Decline
                        </button>
                        <button
                            onClick={acceptCookies}
                            className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
