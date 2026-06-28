'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  Sparkles,
  Zap,
  Bot,
  Code2,
  Video,
  Mic,
  Server,
  HeartPulse,
  Cpu,
  ArrowRight,
  Crown,
  FlaskConical,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CompanyCard from '@/components/ui/CompanyCard';
import CategoryTag from '@/components/ui/CategoryTag';
import TrendingBadge from '@/components/ui/TrendingBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Company } from '@/types';
import { cn } from '@/lib/utils';

const categories = [
  'AI Agents',
  'AI Coding',
  'AI Search',
  'AI Video',
  'AI Voice',
  'AI Infrastructure',
  'More',
];

const browseCategories: { name: string; count: number; icon: LucideIcon }[] = [
  { name: 'AI Agents', count: 12, icon: Bot },
  { name: 'AI Coding', count: 18, icon: Code2 },
  { name: 'AI Search', count: 8, icon: Search },
  { name: 'AI Video', count: 15, icon: Video },
  { name: 'AI Voice', count: 10, icon: Mic },
  { name: 'AI Infrastructure', count: 22, icon: Server },
  { name: 'Healthcare AI', count: 14, icon: HeartPulse },
  { name: 'Robotics', count: 9, icon: Cpu },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function HomePage() {
  const [trendingCompanies, setTrendingCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingCompanies();
  }, []);

  const fetchTrendingCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/companies/trending');
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTrendingCompanies(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchTrendingCompanies} />;
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
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="section-label mb-6 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              AI Intelligence Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Discover the world&apos;s most{' '}
              <span className="gradient-text">innovative AI companies</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track 50,000+ AI companies, $100B+ in funding, and the investors building the AI economy
            </p>

            <div className="max-w-xl mx-auto mb-8">
              <div className="flex gap-2 p-1.5 surface-card rounded-xl">
                <input
                  type="text"
                  placeholder="Search companies, investors, products..."
                  className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-zinc-600 focus:outline-none text-sm"
                />
                <button className="btn-primary px-5 py-3 rounded-lg">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.08] rounded-full hover:border-indigo-500/30 hover:text-indigo-300 transition-all duration-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Companies */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending
              </div>
              <h2 className="section-title">Trending AI Companies</h2>
            </div>
            <Link
              href="/companies"
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
              {trendingCompanies.slice(0, 6).map((company, index) => (
                <motion.div
                  key={company.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  className="relative"
                >
                  {index < 3 && (
                    <div className="absolute -top-2.5 right-3 z-10">
                      <TrendingBadge rank={index + 1} />
                    </div>
                  )}
                  <CompanyCard company={company} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fastest Growing */}
      <section className="py-20 border-t border-white/[0.06] bg-zinc-950/50">
        <div className="section-container">
          <div className="mb-10">
            <div className="section-label mb-2">
              <Zap className="w-3.5 h-3.5" />
              Growth
            </div>
            <h2 className="section-title">Fastest Growing AI Companies</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {trendingCompanies.slice(0, 6).map((company, index) => (
              <motion.div
                key={company.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  href={`/companies/${company.slug}`}
                  className="surface-card p-4 card-hover block text-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-105">
                    <span className="text-white font-semibold text-lg">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-emerald-400 mt-1 font-mono">
                    +{company.growth_score.toFixed(0)}%
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emerging Startups */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="section-container">
          <div className="mb-10">
            <div className="section-label mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Emerging
            </div>
            <h2 className="section-title">Emerging AI Startups to Watch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCompanies.slice(0, 4).map((company, index) => (
              <motion.div
                key={company.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link href={`/companies/${company.slug}`} className="group block h-full">
                  <div className={cn('surface-card p-6 h-full card-hover', getCardAccent(index))}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center">
                        <span className="font-semibold text-lg text-foreground">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                      <CategoryTag category={company.category} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                      {company.tagline}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-20 border-t border-white/[0.06] bg-zinc-950/50">
        <div className="section-container">
          <div className="mb-10">
            <h2 className="section-title">Browse by Category</h2>
            <p className="text-zinc-500 mt-2">Explore the AI landscape by sector</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {browseCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link
                    href={`/companies?category=${encodeURIComponent(category.name)}`}
                    className="surface-card p-5 card-hover block group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 tracking-tight group-hover:text-indigo-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-zinc-600">{category.count} companies</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Unicorns */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="section-title">AI Unicorns</h2>
              <p className="text-zinc-500 text-sm mt-1">Companies valued at $1B+</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {trendingCompanies.filter((c) => c.is_unicorn).slice(0, 10).map((company, index) => (
              <motion.div
                key={company.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  href={`/companies/${company.slug}`}
                  className="surface-card p-5 card-hover block text-center group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-violet-500/20 border border-white/[0.08] mx-auto mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-foreground font-semibold text-xl">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <p className="font-medium text-foreground mb-1 truncate">{company.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">
                    ${company.valuation ? (company.valuation / 1e9).toFixed(1) : '0'}B
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frontier Labs */}
      <section className="py-20 border-t border-white/[0.06] bg-zinc-950/50">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="section-title">Frontier AI Labs</h2>
              <p className="text-zinc-500 text-sm mt-1">
                Leading research organizations pushing the boundaries
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {['OpenAI', 'Anthropic', 'DeepMind', 'Meta AI', 'Mistral AI', 'Cohere'].map(
              (lab, index) => (
                <motion.div
                  key={lab}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="surface-card p-5 card-hover text-center group cursor-default">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] mx-auto mb-3 flex items-center justify-center group-hover:border-indigo-500/30 transition-colors">
                      <span className="font-semibold text-foreground">{lab.charAt(0)}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{lab}</p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-950/80 to-violet-950/80 p-10 md:p-14 text-center"
          >
            <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Stay Updated on the AI Economy
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                Get weekly insights on AI startups, funding rounds, and market trends
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
              <p className="text-zinc-600 text-sm mt-4">
                Join 50,000+ AI enthusiasts and investors
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function getCardAccent(index: number): string {
  const accents = [
    'border-l-2 border-l-violet-500/50',
    'border-l-2 border-l-blue-500/50',
    'border-l-2 border-l-emerald-500/50',
    'border-l-2 border-l-rose-500/50',
  ];
  return accents[index % accents.length];
}
