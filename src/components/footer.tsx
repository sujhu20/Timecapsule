'use client';

import Link from "next/link";
import { memo } from "react";

export const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <Link href="/" className="inline-block">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TimeCapsule
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              © {currentYear} TimeCapsule
            </p>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <Link href="/cookies" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});