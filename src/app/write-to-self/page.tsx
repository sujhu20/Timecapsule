"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, Send, Sparkles } from "lucide-react";
import { createCapsule } from "@/app/actions/create-capsule";
import { toast } from "sonner";

const prompts = [
    "What is your biggest worry right now, and will it matter in a year?",
    "What is one thing you hope to achieve by this time next year?",
    "Write a letter to yourself about how much you've grown.",
    "What is a memory from today that you want to keep forever?",
    "If you could give your future self one piece of advice, what would it be?"
];

export default function WriteToSelfPage() {
    const [content, setContent] = useState("");
    const [unlockDate, setUnlockDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activePrompt, setActivePrompt] = useState(prompts[0]);
    const router = useRouter();

    const handleShufflePrompt = () => {
        const currentIndex = prompts.indexOf(activePrompt);
        const nextIndex = (currentIndex + 1) % prompts.length;
        setActivePrompt(prompts[nextIndex]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !unlockDate) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Auto-generate title based on date
            const title = `Letter to Self - ${new Date().toLocaleDateString()}`;

            const result = await createCapsule({
                title,
                content,
                unlockTime: unlockDate,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Letter sent to your future self!");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate default date (1 year from now) to simplify
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() + 1);
    const minDate = new Date().toISOString().slice(0, 16); // format for datetime-local

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Write to Your Future Self
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                        Take a moment to reflect. Send a message of hope, advice, or memory to the person you are becoming.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10 border border-indigo-100 dark:border-indigo-900">
                    <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-100 dark:border-indigo-800 relative">
                        <button
                            onClick={handleShufflePrompt}
                            className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800 p-2 rounded-lg transition-colors text-sm flex items-center gap-1"
                        >
                            <Sparkles className="w-4 h-4" />
                            New Prompt
                        </button>
                        <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-2">
                            Reflection Prompt
                        </h3>
                        <p className="text-xl font-medium text-slate-800 dark:text-slate-200 italic">
                            "{activePrompt}"
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Your Letter
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-64 p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none leading-relaxed text-lg"
                                placeholder="Dear Future Me..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                When should this arrive?
                            </label>
                            <div className="relative max-w-xs">
                                <input
                                    type="datetime-local"
                                    value={unlockDate}
                                    min={minDate}
                                    onChange={(e) => setUnlockDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 pl-12"
                                    required
                                />
                                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                "Sending..."
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send to Future Self
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
