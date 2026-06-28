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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CompanyCard from '@/components/ui/CompanyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { getCategoryIconColor, getCategoryLogoColor } from '@/lib/categoryColors';
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

const emergingGradients = [
  'bg-gradient-to-br from-purple-500 to-purple-700',
  'bg-gradient-to-br from-blue-500 to-blue-700',
  'bg-gradient-to-br from-orange-400 to-orange-600',
  'bg-gradient-to-br from-yellow-400 to-yellow-600',
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as const },
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

  const featured = trendingCompanies.slice(0, 3);
  const listItems = trendingCompanies.slice(3, 5);
  const unicorns = trendingCompanies.filter((c) => c.is_unicorn).slice(0, 10);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden hero-dot-grid bg-white">
        <div className="section-container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-full mb-6">
              AI Companies
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Discover the world&apos;s most innovative AI companies
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl">
              Track 50,000+ AI companies, $100B+ in funding, and the investors building the AI economy
            </p>

            <div className="flex max-w-xl mb-8 border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-red-400 transition-colors">
              <input
                type="text"
                placeholder="Search companies, investors, products..."
                className="flex-1 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white"
              />
              <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 transition-colors">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-full hover:border-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-full mb-3">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
              <h2 className="text-2xl font-semibold text-gray-900">Trending AI Companies</h2>
            </div>
            <Link
              href="/companies"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map((company, index) => (
                  <motion.div
                    key={company.id}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <CompanyCard company={company} variant="featured" rank={index + 1} />
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {listItems.map((company, index) => (
                  <motion.div
                    key={company.id}
                    custom={index + 3}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <CompanyCard company={company} variant="compact" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Fastest Growing */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="section-container">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-full mb-3">
              <Zap className="w-3 h-3" />
              Growth
            </span>
            <h2 className="text-2xl font-semibold text-gray-900">Fastest growing</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {trendingCompanies.slice(0, 8).map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="flex-shrink-0 w-40 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-center"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-semibold text-lg',
                    getCategoryLogoColor(company.category)
                  )}
                >
                  {company.name.charAt(0)}
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{company.name}</p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  +{company.growth_score.toFixed(0)}%
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Emerging Startups */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-full mb-3">
              <Sparkles className="w-3 h-3" />
              Emerging
            </span>
            <h2 className="text-2xl font-semibold text-gray-900">Startups to watch</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCompanies.slice(0, 4).map((company, index) => (
              <motion.div
                key={company.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link href={`/companies/${company.slug}`} className="block h-full group">
                  <div
                    className={cn(
                      'h-full p-6 rounded-xl text-white shadow-sm hover:shadow-md transition-shadow duration-200',
                      emergingGradients[index % emergingGradients.length]
                    )}
                  >
                    <div
                      className={cn(
                        'w-11 h-11 rounded-full mb-4 flex items-center justify-center font-semibold text-lg bg-white/20 text-white'
                      )}
                    >
                      {company.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-white mb-2">{company.name}</h3>
                    <p className="text-sm text-white/80 line-clamp-2">{company.tagline}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Browse by category</h2>
            <p className="text-sm text-gray-500 mt-1">Explore the AI landscape by sector</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {browseCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/companies?category=${encodeURIComponent(category.name)}`}
                  className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 group"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                      getCategoryIconColor(category.name)
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5 group-hover:text-red-500 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">{category.count} companies</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Unicorns */}
      <section className="py-16 bg-gray-900 border-t border-gray-800">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">AI Unicorns</h2>
              <p className="text-sm text-gray-400 mt-0.5">Companies valued at $1B+</p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {unicorns.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="flex-shrink-0 w-36 p-5 bg-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors text-center"
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center font-semibold text-xl',
                    getCategoryLogoColor(company.category)
                  )}
                >
                  {company.name.charAt(0)}
                </div>
                <p className="font-semibold text-white text-sm truncate">{company.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ${company.valuation ? (company.valuation / 1e9).toFixed(1) : '0'}B
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="section-container">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Stay updated on the AI economy
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Weekly insights on startups, funding, and market trends
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-400 transition-colors"
              />
              <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">50,000+ subscribers</p>
          </div>
        </div>
      </section>
    </div>
  );
}
