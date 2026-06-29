'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowUpRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import ProductCard from '@/components/ui/ProductCard';
import PageHeader from '@/components/layout/PageHeader';
import { ProductWithRelations } from '@/types';
import { cn } from '@/lib/utils';

const categories = ['All', 'Chat', 'Code', 'Agents', 'Image', 'Video', 'Voice', 'Productivity', 'More'];
const mostSearched = ['ChatGPT', 'Claude', 'Midjourney', 'Cursor', 'Perplexity'];

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
      if (data.error) throw new Error(data.error);
      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={fetchProducts} />;

  return (
    <div className="page-shell">
      <div className="section-container max-w-5xl">
        <PageHeader
          label="Product Directory"
          icon={Sparkles}
          title={
            <>
              Discover the best <span className="gradient-text">AI products</span>
            </>
          }
          description="Tools, applications, and platforms powering the AI economy"
        />

        <div className="gradient-border flex items-center px-2 py-2 shadow-lg shadow-slate-900/[0.04] mb-6">
          <input
            type="text"
            placeholder="Search AI products..."
            className="flex-1 px-3 py-2.5 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
          />
          <button className="btn-primary px-4">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Popular:</span>
          {mostSearched.map((term) => (
            <button key={term} className="filter-pill">{term}</button>
          ))}
        </div>

        {/* Featured collection */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card p-8 mb-10 bg-gradient-to-br from-rose-50/60 via-white to-orange-50/40 card-hover"
        >
          <p className="section-label mb-3">Collection of the week</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Top AI Coding Assistants</h2>
          <p className="text-sm text-slate-500 mb-5">The best AI tools to supercharge your development workflow</p>
          <button className="btn-secondary text-sm">
            Explore collection
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn('filter-pill whitespace-nowrap', activeCategory === category && 'filter-pill-active')}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Popular strip */}
        <div className="mb-10">
          <h2 className="section-title text-xl mb-4">Popular right now</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex-shrink-0 w-24 text-center group"
              >
                <div className="w-24 h-24 surface-card card-hover mb-2 flex items-center justify-center group-hover:border-rose-200">
                  <span className="font-bold text-2xl text-slate-700 group-hover:text-rose-600 transition-colors">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 truncate">{product.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* All products */}
        <div>
          <div className="flex items-center justify-between mb-6 gap-4">
            <h2 className="section-title text-xl">All products</h2>
            <select className="input-field w-auto py-2 px-3 text-sm cursor-pointer">
              <option>Most upvoted</option>
              <option>Newest</option>
              <option>Most discussed</option>
            </select>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
