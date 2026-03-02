"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HowItWorksPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">How TimeCapsule Works</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A simple process to preserve your memories for future delivery.
        </p>
      </div>

      <div className="space-y-16">
        {/* Step 1 */}
        <section className="relative">
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-100 dark:bg-blue-900/30"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="md:w-5/12 relative md:pr-8 md:text-right order-2 md:order-1">
              <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-semibold">1. Create Your Capsule</h2>
                <p>
                  Start by choosing what type of content you want to include in your time capsule.
                  Add text messages, photos, videos, audio recordings, or documents that you want
                  to preserve.
                </p>
                <p>
                  Make your capsule personal and meaningful. Share stories, advice, reflections,
                  or messages to your future self or loved ones.
                </p>
              </div>
            </div>

            <div className="z-10 rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
              1
            </div>

            <div className="md:w-5/12 relative md:pl-8 order-1 md:order-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-100 dark:border-slate-700">
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Content Creation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our intuitive editor makes it easy to create rich, multimedia time capsules with text, photos, videos, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="relative">
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="md:w-5/12 relative md:pl-8 order-2">
              <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-semibold">2. Set Delivery Conditions</h2>
                <p>
                  Choose when and how your capsule will be delivered. You can select a specific date,
                  attach conditions like a location or event, or even set up recurring deliveries.
                </p>
                <p>
                  Designate recipients for your capsule or keep it private for your future self.
                  Add custom messages for each recipient if you wish.
                </p>
              </div>
            </div>

            <div className="z-10 rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
              2
            </div>

            <div className="md:w-5/12 relative md:pr-8 md:text-right order-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-100 dark:border-slate-700">
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Flexible Scheduling</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  From specific dates to conditional triggers, our platform offers multiple ways to schedule your capsule's delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="relative">
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="md:w-5/12 relative md:pr-8 md:text-right order-2 md:order-1">
              <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-semibold">3. Secure and Store</h2>
                <p>
                  Your time capsule is encrypted using state-of-the-art encryption algorithms, ensuring
                  that your content remains private and secure until its scheduled delivery date.
                </p>
                <p>
                  Premium plans include additional security features like blockchain verification
                  and multi-region redundant storage to ensure your capsules withstand the test of time.
                </p>
              </div>
            </div>

            <div className="z-10 rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
              3
            </div>

            <div className="md:w-5/12 relative md:pl-8 order-1 md:order-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-100 dark:border-slate-700">
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Advanced Security</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  End-to-end encryption and robust security measures keep your memories safe until they're ready to be delivered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="relative">
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="md:w-5/12 relative md:pl-8 order-2">
              <div className="prose dark:prose-invert">
                <h2 className="text-2xl font-semibold">4. Delivery to Recipients</h2>
                <p>
                  When the delivery conditions are met, TimeCapsule notifies the recipients
                  with instructions on how to access your capsule.
                </p>
                <p>
                  Recipients receive a unique access link and, if you've set it up, a security code.
                  They can then view your time capsule on any device with internet access.
                </p>
              </div>
            </div>

            <div className="z-10 rounded-full bg-blue-500 text-white w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
              4
            </div>

            <div className="md:w-5/12 relative md:pr-8 md:text-right order-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-100 dark:border-slate-700">
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Reliable Delivery</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Multiple notification channels ensure your capsules are delivered reliably, exactly when you intended.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-8 text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">Ready to Create Your First Time Capsule?</h2>
          <p className="mb-6 text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            Start preserving your memories today. It takes just a few minutes to create your first time capsule.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={isLoggedIn ? "/capsules/create" : "/signup"}
              className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              {isLoggedIn ? "Create Your Capsule" : "Get Started For Free"}
            </Link>
            <Link
              href="/explore"
              className="px-5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Explore Examples
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 