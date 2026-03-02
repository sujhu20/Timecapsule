"use client";

import Link from "next/link";
import { useState, useCallback, memo } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

// Using memo to prevent unnecessary re-renders
export const Navigation = memo(function Navigation() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Using useCallback to memoize the click handler
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Using useCallback to memoize the close handler
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(prev => !prev);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo - smaller size */}
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TimeCapsule
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link href="/" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/explore" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Community
                </Link>
                <Link href="/dashboard" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  My Capsules
                </Link>
                <Link href="/write-to-self" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Write to Self
                </Link>
                <Link href="/capsules/create" className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create
                </Link>
              </>
            )}
          </nav>

          {/* Authentication Links */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-10 border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                      <p className="font-medium text-sm">{session?.user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session?.user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signin" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - optimized */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span
                className={`absolute block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 transition-all duration-300 ease-out ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`}
              ></span>
              <span
                className={`absolute block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
              ></span>
              <span
                className={`absolute block h-0.5 w-5 bg-slate-700 dark:bg-slate-300 transition-all duration-300 ease-out ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu - with CSS transition for smooth animation */}
        <div
          className={`fixed inset-0 z-40 ${isMenuOpen ? "block" : "hidden"}`}
        >
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          ></div>

          {/* Menu panel */}
          <div
            className={`absolute top-14 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg transform transition-all duration-300 ease-in-out ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
              }`}
          >
            <div className="py-3 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <div className="flex flex-col space-y-3">
                {isAuthenticated && (
                  <>
                    <Link
                      href="/"
                      className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      Home
                    </Link>
                    <Link
                      href="/explore"
                      className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      Community
                    </Link>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      My Capsules
                    </Link>
                    <Link
                      href="/write-to-self"
                      className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      Write to Self
                    </Link>
                    <Link
                      href="/capsules/create"
                      className="mx-4 my-1 py-2.5 text-sm bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-center"
                      onClick={closeMenu}
                    >
                      Create Capsule
                    </Link>
                  </>
                )}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-1 flex flex-col space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 flex items-center space-x-3">
                        {session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{session?.user?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session?.user?.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                        onClick={closeMenu}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="mx-4 my-1 px-4 py-2.5 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-left flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                        onClick={closeMenu}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="mx-4 my-1 py-2.5 text-sm bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-center"
                        onClick={closeMenu}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Create",
    href: "/capsules/create",
  },
  {
    title: "Capsules",
    href: "/capsules",
  },
  {
    title: "Browse",
    href: "/explore",
  },
];