'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Companies' },
  { href: '/products', label: 'Products' },
  { href: '/investors', label: 'Investors' },
  { href: '/funding', label: 'Funding' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/news', label: 'News' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 border-b border-slate-200 backdrop-blur-sm">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">G</span>
            </div>
            <span className="text-lg font-semibold text-slate-900">GraphOne</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition-colors duration-200',
                  link.label === 'Companies'
                    ? 'text-red-500 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, investors..."
                className="w-full pl-10 pr-12 py-2 text-sm bg-slate-100 border-0 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-sm">
                /
              </kbd>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm text-slate-700 font-medium hover:text-slate-900 transition-colors">
              Log In
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Sign Up
            </button>
          </div>

          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 bg-white overflow-hidden"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-4 py-2.5 text-sm rounded-lg transition-colors',
                    link.label === 'Companies'
                      ? 'text-red-500 font-semibold bg-red-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-200 space-y-2">
                <button className="w-full py-2.5 text-sm text-slate-700 font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
                  Log In
                </button>
                <button className="w-full py-2.5 text-sm bg-red-500 text-white font-medium rounded-lg hover:bg-red-600">
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
