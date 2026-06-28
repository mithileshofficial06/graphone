'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Heart,
  MessageSquare,
  Home,
  Building2,
  TrendingUp,
  Briefcase,
  Newspaper,
  Plus,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { ProductWithRelations } from '@/types';
import { cn } from '@/lib/utils';

const categories = ['All', 'Chat', 'Code', 'Agents', 'Image', 'Video', 'Voice', 'Productivity', 'More'];
const mostSearched = ['ChatGPT', 'Claude', 'Midjourney', 'Cursor', 'Perplexity'];

const sidebarLinks = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/', icon: Building2, label: 'AI Startups' },
  { href: '/products', icon: TrendingUp, label: 'AI Products', active: true },
  { href: '/investors', icon: Briefcase, label: 'Investors' },
  { href: '/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/news', icon: Newspaper, label: 'News' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const url =
        activeCategory === 'All'
          ? '/api/products?sort=popular&limit=20'
          : `/api/products?category=${encodeURIComponent(activeCategory)}&sort=popular&limit=20`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchProducts} />;
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-60 border-r border-white/[0.06] min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-5 space-y-0.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors',
                    link.active
                      ? 'bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20'
                      : 'text-zinc-500 hover:text-foreground hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-0.5">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors font-medium">
                <Plus className="w-4 h-4" />
                Submit Startup
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors font-medium">
                <Plus className="w-4 h-4" />
                Submit Product
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="section-label mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Product Directory
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                The Global Intelligence Layer for AI
              </h1>
              <p className="text-zinc-500 mb-8 leading-relaxed">
                Discover the best AI products, tools, and applications
              </p>

              <div className="flex gap-2 p-1.5 surface-card rounded-xl mb-6">
                <input
                  type="text"
                  placeholder="Search AI products..."
                  className="flex-1 px-4 py-2.5 bg-transparent text-foreground placeholder:text-zinc-600 focus:outline-none text-sm"
                />
                <button className="btn-primary px-4 py-2.5 rounded-lg">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-600 uppercase tracking-wider">Popular:</span>
                {mostSearched.map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1 text-xs font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.08] rounded-full hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Collection of the Week */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-950/60 to-violet-950/60 p-8 mb-8"
            >
              <div className="hero-glow top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-40" />
              <div className="relative">
                <span className="inline-block px-3 py-1 bg-white/[0.08] border border-white/[0.1] rounded-full text-xs font-medium text-indigo-300 mb-3">
                  Collection of the Week
                </span>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  Top AI Coding Assistants
                </h2>
                <p className="text-zinc-400 mb-5 text-sm leading-relaxed">
                  The best AI tools to supercharge your development workflow
                </p>
                <button className="btn-secondary text-sm">
                  Explore Collection
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Category Tabs */}
            <div className="flex gap-1.5 mb-8 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                    activeCategory === category
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      : 'text-zinc-500 hover:text-foreground bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1]'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Popular Right Now */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold tracking-tight mb-4">Popular Right Now</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {products.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex-shrink-0 w-28 text-center group"
                  >
                    <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/[0.08] mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="text-foreground font-bold text-3xl">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">
                      {product.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Product List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold tracking-tight">All Products</h2>
                <select className="px-3 py-2 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-zinc-400 focus:outline-none focus:border-indigo-500/50">
                  <option>Most upvoted</option>
                  <option>Newest</option>
                  <option>Most discussed</option>
                </select>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-3">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      className="surface-card p-5 card-hover"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-0.5 min-w-[52px] px-2 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <button className="p-1 hover:text-rose-400 transition-colors text-zinc-500">
                            <Heart className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-semibold text-foreground font-mono">
                            {product.upvotes}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link
                                href={`/products/${product.slug}`}
                                className="text-base font-semibold text-foreground hover:text-indigo-300 transition-colors tracking-tight"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                                {product.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                <span className="px-2 py-0.5 bg-violet-500/10 text-violet-300 text-xs rounded-md border border-violet-500/20">
                                  {product.category}
                                </span>
                                {product.company && (
                                  <span className="text-xs text-zinc-600">
                                    by {product.company.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-zinc-600 flex-shrink-0">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-72 border-l border-white/[0.06] p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">
              Product of the Day
            </h3>
            <div className="surface-card p-5 border-amber-500/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 mb-3 flex items-center justify-center">
                <span className="text-foreground font-bold text-xl">C</span>
              </div>
              <h4 className="font-semibold text-foreground mb-1.5 tracking-tight">ChatGPT Plus</h4>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                Advanced AI assistant with faster response times
              </p>
              <button className="w-full btn-primary text-xs py-2">
                Learn More
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-tight">
              Trending Searches
            </h3>
            <div className="space-y-0.5">
              {['AI coding', 'Image generation', 'Voice cloning', 'Video editing', 'Text to speech'].map(
                (search) => (
                  <button
                    key={search}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-500 hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors"
                  >
                    {search}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="surface-card p-5 bg-gradient-to-br from-indigo-950/40 to-violet-950/40">
            <h3 className="font-semibold text-sm mb-1.5 tracking-tight">Weekly AI Digest</h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Get the best AI products delivered to your inbox
            </p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] focus:outline-none focus:border-indigo-500/50 text-xs mb-2 text-foreground placeholder:text-zinc-600"
            />
            <button className="w-full btn-primary text-xs py-2">
              Subscribe
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
