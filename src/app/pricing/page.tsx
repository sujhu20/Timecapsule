"use client";

import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  popular?: boolean;
}

export default function PricingPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const tiers: PricingTier[] = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for individuals just getting started.",
      features: [
        "Create up to 3 time capsules",
        "Text and image content",
        "1 year storage duration",
        "Standard encryption",
        "Email delivery"
      ],
      buttonText: "Get Started",
      buttonHref: isLoggedIn ? "/capsules/create" : "/signup"
    },
    {
      name: "Premium",
      price: "$4.99/mo",
      description: "Ideal for preserving important memories.",
      features: [
        "Create unlimited time capsules",
        "All content types including video",
        "10 years storage duration",
        "Enhanced encryption",
        "Advanced delivery options",
        "Priority support"
      ],
      buttonText: isLoggedIn ? "Create Capsule" : "Start Free Trial",
      buttonHref: isLoggedIn ? "/capsules/create" : "/signup",
      popular: true
    },
    {
      name: "Legacy",
      price: "$99/year",
      description: "For creating a lasting legacy across generations.",
      features: [
        "Create unlimited time capsules",
        "All content types including AR/VR",
        "50+ years storage guarantee",
        "Military-grade encryption",
        "Blockchain verification",
        "Family accounts (up to 5 users)",
        "Concierge support"
      ],
      buttonText: "Contact Sales",
      buttonHref: "/contact"
    }
  ];

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the plan that's right for you and start preserving your memories for the future.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`border rounded-xl overflow-hidden ${tier.popular
                ? 'border-blue-200 dark:border-blue-800 ring-1 ring-blue-500'
                : 'border-slate-200 dark:border-slate-700'
              }`}
          >
            {tier.popular && (
              <div className="bg-blue-500 py-1 text-white text-xs font-medium text-center">
                MOST POPULAR
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.price !== "Free" && (
                  <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">
                    {tier.price.includes("/year") ? "/year" : "/month"}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{tier.description}</p>

              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href={tier.buttonHref}
                  className={`block w-full py-2 px-4 rounded-md text-center text-sm font-medium ${tier.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                    } transition-colors`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">How long can you store my capsules?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Our Legacy plan includes a 50+ year storage guarantee, backed by our sustainability fund and long-term storage infrastructure.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Can I cancel my subscription?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Yes, you can cancel your subscription at any time. Your capsules will remain accessible until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Is my data secure?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All data is encrypted using industry-standard encryption. Premium and Legacy plans include enhanced security features.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Do you offer refunds?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We offer a 30-day money-back guarantee for all paid plans if you're not completely satisfied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 