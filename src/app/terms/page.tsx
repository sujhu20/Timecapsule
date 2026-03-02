"use client";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Service</h1>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using Timecapsul ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily access and use the Service for personal, non-commercial purposes, subject to the following conditions:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>You must not modify or copy the materials</li>
                <li>You must not use the materials for any commercial purpose</li>
                <li>You must not attempt to decompile or reverse engineer any software</li>
                <li>You must not remove any copyright or proprietary notations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="mb-4">
                As a user of the Service, you agree to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not share your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not upload any illegal or prohibited content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Content Guidelines</h2>
              <p className="mb-4">
                You are responsible for all content you upload to the Service. Prohibited content includes:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Illegal or unauthorized content</li>
                <li>Malicious software or code</li>
                <li>Spam or unsolicited promotional materials</li>
                <li>Content that violates others' rights</li>
                <li>Harmful or offensive content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Service Modifications</h2>
              <p className="mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Modify or discontinue the Service at any time</li>
                <li>Change features or functionality</li>
                <li>Update service features and terms</li>
                <li>Modify these Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="mb-4">
                Timecapsul shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
              <p className="mb-4">
                These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p className="mb-4">
                For any questions regarding these Terms of Service, please contact us at:
              </p>
              <ul className="list-none mb-4 space-y-2">
                <li>Email: legal@timecapsul.com</li>
                <li>Address: [Your Company Address]</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Acknowledgment</h2>
              <p className="mb-4">
                By using Timecapsul, you acknowledge that you have read these Terms of Service and agree to be bound by them.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 