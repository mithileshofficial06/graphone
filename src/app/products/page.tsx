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
        <aside className="hidden lg:block w-60 border-r-[3px] border-black min-h-[calc(100vh-4rem)] sticky top-16 bg-[#f4f0e8]">
          <nav className="p-5 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-xs font-black uppercase tracking-wider border-[3px] border-black transition-all duration-100',
                    link.active
                      ? 'bg-[#ffe500] shadow-[3px_3px_0_#0a0a0a]'
                      : 'bg-white shadow-[2px_2px_0_#0a0a0a] hover:bg-[#ffe500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#0a0a0a]'
                  )}
                >
                  <Icon className="w-4 h-4" strokeWidth={3} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t-[3px] border-black space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black uppercase tracking-wider bg-[#0066ff] text-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#0a0a0a] transition-all duration-100">
                <Plus className="w-4 h-4" strokeWidth={3} />
                Submit Startup
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black uppercase tracking-wider bg-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] hover:bg-[#ffe500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#0a0a0a] transition-all duration-100">
                <Plus className="w-4 h-4" strokeWidth={3} />
                Submit Product
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <motion.div
              initial={{ opacity: 0, x: 8, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className="section-label mb-3">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={3} />
                PRODUCT DIRECTORY
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3 leading-[0.95]">
                THE GLOBAL INTELLIGENCE LAYER FOR{' '}
                <span className="gradient-text">AI</span>
              </h1>
              <p className="text-muted font-bold text-sm mb-8 uppercase tracking-wider">
                DISCOVER THE BEST AI PRODUCTS, TOOLS, AND APPLICATIONS
              </p>

              <div className="flex border-[3px] border-black shadow-[4px_4px_0_#0a0a0a] bg-white mb-6">
                <input
                  type="text"
                  placeholder="SEARCH AI PRODUCTS..."
                  className="flex-1 px-4 py-3 bg-white font-bold uppercase text-xs tracking-wider placeholder:text-neutral-500 focus:outline-none"
                />
                <button className="btn-primary border-0 border-l-[3px] border-black shadow-none px-5">
                  <Search className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                  POPULAR:
                </span>
                {mostSearched.map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white border-[3px] border-black shadow-[2px_2px_0_#0a0a0a] hover:bg-[#ffe500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#0a0a0a] transition-all duration-100"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 8, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="surface-card p-8 mb-8 bg-[#ffe500] card-hover"
            >
              <span className="inline-block section-label mb-4 bg-black text-[#ffe500] border-black shadow-[3px_3px_0_#0a0a0a]">
                COLLECTION OF THE WEEK
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                TOP AI CODING ASSISTANTS
              </h2>
              <p className="text-sm font-bold mb-5 uppercase tracking-wide opacity-80">
                THE BEST AI TOOLS TO SUPERCHARGE YOUR DEVELOPMENT WORKFLOW
              </p>
              <button className="btn-secondary text-sm">
                EXPLORE COLLECTION
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
            </motion.div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-[3px] border-black transition-all duration-100',
                    activeCategory === category
                      ? 'bg-black text-white shadow-[4px_4px_0_#ffe500]'
                      : 'bg-white shadow-[3px_3px_0_#0a0a0a] hover:bg-[#ffe500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#0a0a0a]'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mb-10">
              <h2 className="section-title text-xl md:text-2xl mb-4">POPULAR RIGHT NOW</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {products.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex-shrink-0 w-28 text-center group"
                  >
                    <div className="w-28 h-28 bg-white border-[3px] border-black shadow-[4px_4px_0_#0a0a0a] mb-2 flex items-center justify-center group-hover:bg-[#0066ff] group-hover:text-white group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0_#0a0a0a] transition-all duration-100">
                      <span className="font-black text-3xl">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-[10px] font-black uppercase truncate">
                      {product.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 gap-4">
                <h2 className="section-title text-xl md:text-2xl">ALL PRODUCTS</h2>
                <select className="input-field w-auto py-2 px-3 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#0a0a0a]">
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
                      initial={{ opacity: 0, x: 4, y: 4 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      className="surface-card p-5 card-hover bg-white"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-0.5 min-w-[52px] px-2 py-2 bg-[#f4f0e8] border-[3px] border-black shadow-[2px_2px_0_#0a0a0a]">
                          <button className="p-1 hover:text-[#ff3b30] transition-colors text-muted">
                            <Heart className="w-4 h-4" strokeWidth={3} />
                          </button>
                          <span className="text-xs font-black font-mono">
                            {product.upvotes}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link
                                href={`/products/${product.slug}`}
                                className="text-base font-black uppercase tracking-tight hover:text-[#0066ff] underline decoration-2 underline-offset-2"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm font-medium mt-1 leading-snug opacity-80">
                                {product.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                <span className="brutal-tag bg-[#0066ff] text-white">
                                  {product.category}
                                </span>
                                {product.company && (
                                  <span className="text-xs font-bold text-muted uppercase">
                                    BY {product.company.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-black text-muted flex-shrink-0">
                              <MessageSquare className="w-3.5 h-3.5" strokeWidth={3} />
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

        <aside className="hidden xl:block w-72 border-l-[3px] border-black p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-[#f4f0e8]">
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">
              PRODUCT OF THE DAY
            </h3>
            <div className="surface-card p-5 bg-[#ffe500] card-hover">
              <div className="w-14 h-14 bg-black text-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] mb-3 flex items-center justify-center">
                <span className="font-black text-xl">C</span>
              </div>
              <h4 className="font-black uppercase text-sm mb-1.5 tracking-tight">ChatGPT Plus</h4>
              <p className="text-xs font-medium mb-4 leading-snug opacity-80">
                Advanced AI assistant with faster response times
              </p>
              <button className="w-full btn-primary text-xs py-2">
                LEARN MORE
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest mb-3">
              TRENDING SEARCHES
            </h3>
            <div className="space-y-1">
              {['AI coding', 'Image generation', 'Voice cloning', 'Video editing', 'Text to speech'].map(
                (search) => (
                  <button
                    key={search}
                    className="w-full text-left px-3 py-2 text-xs font-black uppercase tracking-wider bg-white border-[3px] border-black shadow-[2px_2px_0_#0a0a0a] hover:bg-[#ffe500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#0a0a0a] transition-all duration-100"
                  >
                    {search}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="surface-card p-5 bg-white">
            <h3 className="font-black uppercase text-xs mb-1.5 tracking-tight">
              WEEKLY AI DIGEST
            </h3>
            <p className="text-xs font-medium mb-4 leading-snug opacity-80">
              Get the best AI products delivered to your inbox
            </p>
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="input-field text-xs mb-2 font-bold uppercase"
            />
            <button className="w-full btn-primary text-xs py-2">
              SUBSCRIBE
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
