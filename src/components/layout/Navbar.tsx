'use client';

import Link from 'next/link';
import { Search, Menu, X, Bookmark, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target === document.body) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GraphOne</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Companies
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-gray-900 font-medium">
              Products
            </Link>
            <Link href="/investors" className="text-gray-700 hover:text-gray-900 font-medium">
              Investors
            </Link>
            <Link href="/funding" className="text-gray-700 hover:text-gray-900 font-medium">
              Funding
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-gray-900 font-medium">
              Jobs
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-gray-900 font-medium">
              News
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, investors, products..."
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <kbd className="absolute right-3 top-2.5 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                /
              </kbd>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                <Link
                  href="/saved"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Saved</span>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span>{session.user?.name?.split(' ')[0]}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn('github')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={() => signIn('github')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/"
              className="block text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Companies
            </Link>
            <Link
              href="/products"
              className="block text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/investors"
              className="block text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Investors
            </Link>
            <Link
              href="/funding"
              className="block text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Funding
            </Link>
            <Link
              href="/jobs"
              className="block text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              href="/news"
              className="block text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
            <div className="pt-3 border-t border-gray-200">
              {status === 'authenticated' ? (
                <>
                  <Link
                    href="/saved"
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Saved</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      signIn('github');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium mb-2"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      signIn('github');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
