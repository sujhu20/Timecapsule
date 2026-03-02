"use client";

import { Clock, Lock, Share2, Gift, Shield, Sparkles } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time-Based Delivery",
      description: "Schedule your capsules to be delivered at specific dates in the future, perfect for special occasions or milestone celebrations."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Storage",
      description: "Your memories are encrypted and stored securely, ensuring that only intended recipients can access them at the right time."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Flexible Sharing",
      description: "Choose between private, public, or specific recipient options for your time capsules."
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Multiple Content Types",
      description: "Include text, images, videos, and audio in your time capsules to create rich, multimedia memories."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Blockchain Security",
      description: "Optional blockchain verification ensures the authenticity and immutability of your time capsules."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AR Experience",
      description: "Create augmented reality experiences that can be unlocked at specific locations or times."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Features that Make Us Special
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Discover how Timecapsul helps you preserve and share your precious memories with future generations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <div className="text-blue-600 dark:text-blue-400">
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

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Create Your First Time Capsule?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Join thousands of users who trust us with their precious memories.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
} 