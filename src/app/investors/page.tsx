'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  Bot,
  Globe2,
  Sprout,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
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
  gradient: string;
}[] = [
  {
    title: 'Investors Backing AI Agents',
    description: 'VCs leading the autonomous AI revolution',
    icon: Bot,
    gradient: 'from-indigo-600 to-violet-700',
  },
  {
    title: 'Indian AI Startups',
    description: 'Investors funding Indian AI ecosystem',
    icon: Globe2,
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    title: 'Top Seed Investors',
    description: 'Early-stage AI investors with strong track records',
    icon: Sprout,
    gradient: 'from-amber-600 to-orange-700',
  },
  {
    title: 'Operator Angels',
    description: 'AI founders turned investors',
    icon: Users,
    gradient: 'from-rose-600 to-pink-700',
  },
];

const investorTypes = [
  { name: 'Seed Investors', count: 145, stage: 'Seed' },
  { name: 'Series A', count: 98, stage: 'Series A' },
  { name: 'Angel Investors', count: 267, stage: 'Angel' },
  { name: 'Corporate Venture', count: 52, stage: 'Corporate' },
  { name: 'Late Stage', count: 78, stage: 'Growth' },
  { name: 'Family Offices', count: 34, stage: 'All' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

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

      if (data.error) {
        throw new Error(data.error);
      }

      setMostActiveInvestors(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investors');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchMostActiveInvestors} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden hero-grid">
        <div className="hero-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="section-container py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="section-label mb-6 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              Investor Intelligence
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Discover Investors Building{' '}
              <span className="gradient-text">the AI Economy</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track 6,000+ AI investors, their portfolios, and investment strategies
            </p>

            <div className="max-w-xl mx-auto mb-8">
              <div className="flex gap-2 p-1.5 surface-card rounded-xl">
                <input
                  type="text"
                  placeholder="Search investors by name, thesis, or focus..."
                  className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-zinc-600 focus:outline-none text-sm"
                />
                <button className="btn-primary px-5 py-3 rounded-lg">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {['AI Infrastructure', 'Series A', 'Healthcare AI', 'Enterprise AI', 'Robotics'].map(
                (term) => (
                  <button
                    key={term}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.08] rounded-full hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Investors */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending
              </div>
              <h2 className="section-title">Trending Investors</h2>
            </div>
            <Link
              href="/investors/all"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mostActiveInvestors.slice(0, 6).map((investor, index) => (
                <motion.div
                  key={investor.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="surface-card p-6 card-hover relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {investor.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground tracking-tight truncate">
                          {investor.name}
                        </h3>
                        <span className="text-xs text-zinc-500">{investor.type}</span>
                      </div>
                    </div>

                    {investor.stage_focus && investor.stage_focus.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {investor.stage_focus.slice(0, 3).map((stage) => (
                          <span
                            key={stage}
                            className="px-2 py-0.5 bg-white/[0.06] text-zinc-400 text-xs rounded-md border border-white/[0.06]"
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/investors/${investor.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View portfolio
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 border-t border-white/[0.06] bg-zinc-950/50">
        <div className="section-container">
          <h2 className="section-title mb-10">Investor Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {investorCollections.map((collection, index) => {
              const Icon = collection.icon;
              return (
                <motion.div
                  key={collection.title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link
                    href={`/investors/collection/${collection.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="surface-card overflow-hidden card-hover block group"
                  >
                    <div
                      className={cn(
                        'h-32 flex items-center justify-center bg-gradient-to-br',
                        collection.gradient
                      )}
                    >
                      <Icon className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground mb-1 tracking-tight group-hover:text-indigo-300 transition-colors">
                        {collection.title}
                      </h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        {collection.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Type */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="section-container">
          <h2 className="section-title mb-10">Browse by Investor Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {investorTypes.map((type, index) => (
              <motion.div
                key={type.name}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  href={`/investors?type=${encodeURIComponent(type.stage)}`}
                  className="surface-card p-5 card-hover block group"
                >
                  <h3 className="font-semibold text-foreground mb-1 tracking-tight group-hover:text-indigo-300 transition-colors">
                    {type.name}
                  </h3>
                  <p className="text-sm text-zinc-600">{type.count} investors</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Active */}
      <section className="py-20 border-t border-white/[0.06] bg-zinc-950/50">
        <div className="section-container">
          <h2 className="section-title mb-10">Most Active Investors</h2>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mostActiveInvestors.slice(0, 10).map((investor) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-950/80 to-violet-950/80 p-10 md:p-14 text-center"
          >
            <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Get Weekly Investor Insights
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                Track new funds, portfolio updates, and investment trends in AI
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field flex-1 bg-white/[0.06] border-white/[0.1]"
                />
                <button className="btn-primary px-6 py-3 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
