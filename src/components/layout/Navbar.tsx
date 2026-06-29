'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target === document.body) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    const handleScroll = () => setScrolled(window.scrollY > 8);

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/85 border-b border-slate-200/80 backdrop-blur-xl shadow-sm shadow-slate-900/[0.03]'
          : 'bg-white/60 border-b border-transparent backdrop-blur-md'
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-[4.25rem]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 flex items-center justify-center shadow-md shadow-rose-500/25 transition-transform duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-sm tracking-tight">G</span>
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Graph<span className="text-rose-500">One</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-3.5 py-2 text-sm rounded-lg transition-colors duration-200',
                  isActive(link.href)
                    ? 'text-rose-600 font-semibold bg-rose-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <form onSubmit={handleNavSearch} className="hidden lg:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-rose-400" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies, investors..."
                className="w-full pl-10 pr-12 py-2.5 text-sm bg-slate-100/80 border border-slate-200/60 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-500/10 transition-all duration-200"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm">
                /
              </kbd>
            </div>
          </form>

          <button
            className="md:hidden p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
            className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-4 py-2.5 text-sm rounded-xl transition-colors',
                    isActive(link.href)
                      ? 'text-rose-600 font-semibold bg-rose-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
