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

const investorCollections: {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    title: 'Investors Backing AI Agents',
    description: 'VCs leading the autonomous AI revolution',
    icon: Bot,
    accent: 'bg-[#0066ff] text-white',
  },
  {
    title: 'Indian AI Startups',
    description: 'Investors funding Indian AI ecosystem',
    icon: Globe2,
    accent: 'bg-[#ffe500]',
  },
  {
    title: 'Top Seed Investors',
    description: 'Early-stage AI investors with strong track records',
    icon: Sprout,
    accent: 'bg-[#ff3b30] text-white',
  },
  {
    title: 'Operator Angels',
    description: 'AI founders turned investors',
    icon: Users,
    accent: 'bg-black text-white',
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
  hidden: { opacity: 0, x: 4, y: 4 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' as const },
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
      <section className="relative overflow-hidden hero-grid bg-white border-b-[3px] border-black">
        <div className="section-container py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, x: 8, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="section-label mb-6 justify-center">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={3} />
              INVESTOR INTELLIGENCE
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 leading-[0.95]">
              DISCOVER INVESTORS BUILDING{' '}
              <span className="gradient-text block sm:inline">THE AI ECONOMY</span>
            </h1>
            <p className="text-base md:text-lg text-muted font-bold mb-10 max-w-2xl mx-auto leading-snug uppercase tracking-wide">
              6,000+ AI INVESTORS · PORTFOLIOS · INVESTMENT STRATEGIES
            </p>

            <div className="max-w-xl mx-auto mb-8">
              <div className="flex border-[3px] border-black shadow-[6px_6px_0_#0a0a0a] bg-white">
                <input
                  type="text"
                  placeholder="SEARCH INVESTORS..."
                  className="flex-1 px-4 py-3 bg-white font-bold uppercase text-xs tracking-wider placeholder:text-neutral-500 focus:outline-none"
                />
                <button className="btn-primary border-0 shadow-none px-6">
                  <Search className="w-4 h-4" strokeWidth={3} />
                  SEARCH
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {['AI Infrastructure', 'Series A', 'Healthcare AI', 'Enterprise AI', 'Robotics'].map(
                (term) => (
                  <button
                    key={term}
                    className="px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] hover:bg-[#ffe500] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#0a0a0a] transition-all duration-100"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-b-[3px] border-black bg-[#f4f0e8]">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <div className="section-label mb-3">
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
                TRENDING
              </div>
              <h2 className="section-title">TRENDING INVESTORS</h2>
            </div>
            <Link href="/investors/all" className="link-brutal hidden sm:inline-flex items-center gap-1">
              VIEW ALL
              <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mostActiveInvestors.slice(0, 6).map((investor) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 border-b-[3px] border-black bg-[#ffe500]">
        <div className="section-container">
          <div className="mb-10">
            <div className="section-label mb-3 bg-black text-[#ffe500] border-black shadow-[3px_3px_0_#0a0a0a]">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={3} />
              COLLECTIONS
            </div>
            <h2 className="section-title">INVESTOR COLLECTIONS</h2>
          </div>

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
                    className="surface-card overflow-hidden card-hover block group bg-white"
                  >
                    <div
                      className={`h-32 flex items-center justify-center border-b-[3px] border-black ${collection.accent}`}
                    >
                      <Icon className="w-10 h-10" strokeWidth={3} />
                    </div>
                    <div className="p-5">
                      <h3 className="font-black uppercase text-xs mb-2 tracking-tight group-hover:text-[#0066ff]">
                        {collection.title}
                      </h3>
                      <p className="text-sm font-medium leading-snug opacity-80">
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

      <section className="py-16 border-b-[3px] border-black">
        <div className="section-container">
          <div className="mb-10">
            <h2 className="section-title">BROWSE BY INVESTOR TYPE</h2>
            <p className="text-muted font-bold text-sm mt-2 uppercase tracking-wider">
              FILTER BY STAGE & TYPE
            </p>
          </div>

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
                  className="surface-card p-5 card-hover block group bg-[#f4f0e8]"
                >
                  <h3 className="font-black uppercase text-xs mb-1 tracking-tight group-hover:text-[#ff3b30]">
                    {type.name}
                  </h3>
                  <p className="text-xs font-bold text-muted">{type.count} INVESTORS</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b-[3px] border-black bg-white">
        <div className="section-container">
          <div className="mb-10">
            <div className="section-label mb-3">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
              ACTIVITY
            </div>
            <h2 className="section-title">MOST ACTIVE INVESTORS</h2>
          </div>

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

      <section className="py-16 border-b-[3px] border-black bg-[#0066ff]">
        <div className="section-container">
          <div className="border-[3px] border-black bg-white p-10 md:p-14 text-center shadow-[8px_8px_0_#0a0a0a]">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-3">
              GET WEEKLY INVESTOR INSIGHTS
            </h2>
            <p className="text-muted font-bold text-sm mb-8 max-w-lg mx-auto uppercase tracking-wide">
              TRACK NEW FUNDS, PORTFOLIO UPDATES, AND INVESTMENT TRENDS IN AI
            </p>
            <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border-[3px] border-black shadow-[4px_4px_0_#0a0a0a]">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="input-field flex-1 border-0 shadow-none font-bold uppercase text-xs"
              />
              <button className="btn-primary border-0 border-l-[3px] border-black shadow-none whitespace-nowrap">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
