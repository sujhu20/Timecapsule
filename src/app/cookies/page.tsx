"use client";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Cookie Policy</h1>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>To keep you signed in</li>
                <li>To remember your preferences</li>
                <li>To understand how you use our website</li>
                <li>To improve our service</li>
                <li>To provide personalized content</li>
                <li>To ensure the security of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium mb-2">3.1 Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>

              <h3 className="text-xl font-medium mb-2">3.2 Performance Cookies</h3>
              <p className="mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>

              <h3 className="text-xl font-medium mb-2">3.3 Functionality Cookies</h3>
              <p className="mb-4">
                These cookies enable the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced features.
              </p>

              <h3 className="text-xl font-medium mb-2">3.4 Targeting Cookies</h3>
              <p className="mb-4">
                These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads on other sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Cookie Management</h2>
              <p className="mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Browser settings: You can modify your browser settings to accept or reject cookies</li>
                <li>Our cookie preferences tool: Use our cookie settings to customize your preferences</li>
                <li>Third-party tools: Various tools are available to help manage cookies</li>
              </ul>
              <p className="mb-4">
                Please note that blocking some types of cookies may impact your experience on our website and the services we offer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
              <p className="mb-4">
                We use services from these third parties that may set cookies:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Google Analytics (analytics)</li>
                <li>Supabase (authentication)</li>
                <li>Social media platforms (sharing functionality)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
              <p className="mb-4">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will become effective when we post the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <ul className="list-none mb-4 space-y-2">
                <li>Email: privacy@timecapsul.com</li>
                <li>Address: [Your Company Address]</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 