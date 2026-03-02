"use client";

import { Shield, Lock, Key, Server, UserCheck, History } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "All capsule contents are encrypted before being stored, ensuring that only authorized recipients can access the data."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Blockchain Verification",
      description: "Optional blockchain integration provides an immutable record of your capsule's creation and contents."
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Secure Access Control",
      description: "Multi-factor authentication and role-based access control ensure only authorized users can access their capsules."
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Redundant Storage",
      description: "Your data is stored across multiple secure locations to ensure availability and prevent loss."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Privacy Controls",
      description: "Granular privacy settings let you control exactly who can access your capsules and when."
    },
    {
      icon: <History className="w-6 h-6" />,
      title: "Audit Logging",
      description: "Comprehensive audit trails track all access attempts and changes to your capsules."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Security First, Always
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Your memories deserve the highest level of protection. Learn how we keep your time capsules safe and secure.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <div className="text-green-600 dark:text-green-400">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Security Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Our Security Commitment</h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-400">
            <p>
              At Timecapsul, we take the security of your memories seriously. Our platform is built with multiple layers of security to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Regular security audits and penetration testing</li>
              <li>Compliance with industry security standards</li>
              <li>24/7 infrastructure monitoring</li>
              <li>Automatic threat detection and prevention</li>
              <li>Regular security updates and patches</li>
            </ul>
            <p className="mt-4">
              We continuously update our security measures to stay ahead of potential threats and ensure your memories remain safe for generations to come.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Secure Your Memories?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Join thousands of users who trust us with their most precious memories.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
} 