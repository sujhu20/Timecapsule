
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCapsule } from "@/app/actions/create-capsule";
import { useRouter } from "next/navigation";
import { CalendarIcon, Lock } from "lucide-react";

// Reusing the schema for client-side validation
const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    content: z.string().min(1, "Content is required"),
    unlockTime: z.string().refine((val) => {
        const date = new Date(val);
        return date > new Date();
    }, "Unlock time must be in the future"),
    recipientName: z.string().optional(),
    recipientEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCapsuleForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTrustee, setShowTrustee] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    // ... (onSubmit remains the same, it passes data which now includes new fields)
    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError(null);

        const result = await createCapsule(data);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            {/* Header ... */}
            <div className="flex items-center mb-6 space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Time Capsule</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Capsule Title
                    </label>
                    <input
                        {...register("title")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="e.g., My 30th Birthday"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Secret Message
                    </label>
                    <textarea
                        {...register("content")}
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Write something for the future..."
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Unlock Date & Time
                    </label>
                    <div className="relative">
                        <input
                            type="datetime-local"
                            {...register("unlockTime")}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all pl-12"
                        />
                        <CalendarIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                    {errors.unlockTime && (
                        <p className="mt-1 text-sm text-red-500">{errors.unlockTime.message}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        This capsule will remain encrypted and inaccessible until this date.
                    </p>
                </div>

                {/* Digital Trustee Section */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <button
                        type="button"
                        onClick={() => setShowTrustee(!showTrustee)}
                        className="flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline focus:outline-none"
                    >
                        {showTrustee ? "− Remove Digital Trustee" : "+ Add Digital Trustee (Optional)"}
                    </button>

                    {showTrustee && (
                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                Designate someone to receive this capsule when it unlocks.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Recipient Name
                                </label>
                                <input
                                    {...register("recipientName")}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Recipient Email
                                </label>
                                <input
                                    {...register("recipientEmail")}
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g., john@example.com"
                                />
                                {errors.recipientEmail && (
                                    <p className="mt-1 text-sm text-red-500">{errors.recipientEmail.message}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Sealing Capsule..." : "Bolt & Seal Capsule"}
                </button>
            </form>
        </div>
    );
}
