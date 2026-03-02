'use client';

import { useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            toast.success('Thanks for subscribing!');
            setEmail('');

            // Reset success state after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div className="w-full max-w-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Stay Updated
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Subscribe to our newsletter for the latest updates and features.
            </p>

            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                        required
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`mt-2 w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 ${status === 'success'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Subscribing...
                        </>
                    ) : status === 'success' ? (
                        <>
                            <Check className="h-4 w-4" />
                            Subscribed
                        </>
                    ) : (
                        'Subscribe'
                    )}
                </button>
            </form>
        </div>
    );
}
