'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Bot, Globe2, Sprout, Users, ArrowRight, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import InvestorCard from '@/components/ui/InvestorCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Investor } from '@/types';
import { cn } from '@/lib/utils';

const investorCollections: {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  { title: 'Investors Backing AI Agents', description: 'VCs leading the autonomous AI revolution', icon: Bot, accent: 'from-blue-500 to-indigo-500' },
  { title: 'Indian AI Startups', description: 'Investors funding Indian AI ecosystem', icon: Globe2, accent: 'from-emerald-500 to-teal-500' },
  { title: 'Top Seed Investors', description: 'Early-stage AI investors with strong track records', icon: Sprout, accent: 'from-rose-500 to-orange-500' },
  { title: 'Operator Angels', description: 'AI founders turned investors', icon: Users, accent: 'from-purple-500 to-pink-500' },
];

const investorTypes = [
  { name: 'Seed Investors', count: 145, stage: 'Seed' },
  { name: 'Series A', count: 98, stage: 'Series A' },
  { name: 'Angel Investors', count: 267, stage: 'Angel' },
  { name: 'Corporate Venture', count: 52, stage: 'Corporate' },
  { name: 'Late Stage', count: 78, stage: 'Growth' },
  { name: 'Family Offices', count: 34, stage: 'All' },
];

export default function InvestorsPage() {
  const [mostActiveInvestors, setMostActiveInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMostActiveInvestors();
  }, []);

  const fetchMostActiveInvestors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/investors/most-active');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMostActiveInvestors(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investors');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={fetchMostActiveInvestors} />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <section className="relative overflow-hidden hero-mesh border-b border-slate-200/60">
        <div className="section-container py-16 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="section-label mb-4 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              Investor Intelligence
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-5 leading-tight">
              Discover investors building{' '}
              <span className="gradient-text">the AI economy</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
              6,000+ AI investors · portfolios · investment strategies
            </p>

            <div className="max-w-xl mx-auto mb-8 gradient-border flex items-center px-2 py-2 shadow-lg shadow-slate-900/[0.04]">
              <input
                type="text"
                placeholder="Search investors..."
                className="flex-1 px-3 py-2.5 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button className="btn-primary">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {['AI Infrastructure', 'Series A', 'Healthcare AI', 'Enterprise AI', 'Robotics'].map((term) => (
                <button key={term} className="filter-pill">{term}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="section-label mb-2">Trending</p>
              <h2 className="section-title">Trending Investors</h2>
            </div>
            <Link href="/investors" className="link-accent hidden sm:inline-flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mostActiveInvestors.slice(0, 6).map((investor) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 bg-slate-50/80 border-y border-slate-200/60">
        <div className="section-container">
          <p className="section-label mb-2">Collections</p>
          <h2 className="section-title mb-8">Investor Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {investorCollections.map((collection, index) => {
              const Icon = collection.icon;
              return (
                <motion.div
                  key={collection.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={`/investors/collection/${collection.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="surface-card card-hover overflow-hidden block group"
                  >
                    <div className={cn('h-28 flex items-center justify-center bg-gradient-to-br text-white', collection.accent)}>
                      <Icon className="w-9 h-9" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors mb-1.5">
                        {collection.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-snug">{collection.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by type */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <h2 className="section-title mb-2">Browse by Investor Type</h2>
          <p className="text-sm text-slate-500 mb-8">Filter by stage and type</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investorTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  href={`/investors?type=${encodeURIComponent(type.stage)}`}
                  className="surface-card card-hover p-5 block group"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors mb-1">
                    {type.name}
                  </h3>
                  <p className="text-sm text-slate-500">{type.count} investors</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Most active */}
      <section className="py-16 bg-slate-50/80 border-t border-slate-200/60">
        <div className="section-container">
          <p className="section-label mb-2">Activity</p>
          <h2 className="section-title mb-8">Most Active Investors</h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mostActiveInvestors.slice(0, 10).map((investor) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="surface-card p-10 md:p-14 text-center max-w-2xl mx-auto bg-gradient-to-br from-rose-50/50 via-white to-orange-50/30">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Get weekly investor insights
            </h2>
            <p className="text-slate-500 mb-8">
              Track new funds, portfolio updates, and investment trends in AI
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Your email" className="input-field flex-1" />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
