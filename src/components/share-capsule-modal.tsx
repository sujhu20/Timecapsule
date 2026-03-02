'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Mail, Link as LinkIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShareCapsuleModalProps {
    capsuleId: string;
    capsuleTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ShareCapsuleModal({ capsuleId, capsuleTitle, isOpen, onClose }: ShareCapsuleModalProps) {
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);

    const shareUrl = `${window.location.origin}/capsules/${capsuleId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const shareViaEmail = async () => {
        if (!email) {
            toast.error('Please enter an email address');
            return;
        }

        setSending(true);
        try {
            const response = await fetch('/api/capsules/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    capsuleId,
                    email,
                    shareUrl,
                }),
            });

            if (response.ok) {
                toast.success('Invitation sent successfully!');
                setEmail('');
                onClose();
            } else {
                toast.error('Failed to send invitation');
            }
        } catch (error) {
            toast.error('Failed to send invitation');
        } finally {
            setSending(false);
        }
    };

    const shareOnSocial = (platform: 'twitter' | 'facebook' | 'linkedin') => {
        const text = `Check out my time capsule: ${capsuleTitle}`;
        let url = '';

        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                break;
        }

        window.open(url, '_blank', 'width=600,height=400');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Share Capsule</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Capsule Title */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Share "{capsuleTitle}" with others
                </p>

                {/* Copy Link */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Share Link
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Email Invitation */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Send via Email
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="friend@example.com"
                            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <button
                            onClick={shareViaEmail}
                            disabled={sending}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>

                {/* Social Media */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Share on Social Media
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => shareOnSocial('twitter')}
                            className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium"
                        >
                            Twitter
                        </button>
                        <button
                            onClick={() => shareOnSocial('facebook')}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Facebook
                        </button>
                        <button
                            onClick={() => shareOnSocial('linkedin')}
                            className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                        >
                            LinkedIn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
