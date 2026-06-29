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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import TrendingCompanyCard from '@/components/ui/TrendingCompanyCard';
import CategoryTag from '@/components/ui/CategoryTag';
import { getCategoryIconColor } from '@/lib/categoryColors';
import { Company } from '@/types';
import { cn, getFallbackLogoUrl } from '@/lib/utils';
import InfiniteScroll from '@/components/ui/InfiniteScroll';

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

const logoColors: Record<string, string> = {
  'AI Agents': 'bg-purple-100 text-purple-700',
  'AI Coding': 'bg-blue-100 text-blue-700',
  'AI Search': 'bg-emerald-100 text-emerald-700',
  'AI Video': 'bg-pink-100 text-pink-700',
  'AI Voice': 'bg-orange-100 text-orange-700',
  'AI Infrastructure': 'bg-slate-100 text-slate-700',
  'Healthcare AI': 'bg-red-100 text-red-700',
  'Robotics': 'bg-yellow-100 text-yellow-700',
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

  const unicorns = trendingCompanies.filter((c) => c.is_unicorn).slice(0, 10);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white pt-20 pb-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center"
          >
            <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-full mb-6">
              🤖 AI COMPANIES
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight text-center mt-4">
              Discover the world&apos;s most<br />
              innovative <span className="text-red-500">AI companies</span>
            </h1>
            <p className="text-xl text-slate-500 text-center mt-4 max-w-2xl mx-auto">
              Track 50,000+ AI companies, $100B+ in funding, and the investors building the AI economy
            </p>

            {/* Stats Row */}
            <div className="flex gap-12 justify-center mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">50K+</div>
                <div className="text-sm text-slate-500">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">$100B+</div>
                <div className="text-sm text-slate-500">Funding</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">6K+</div>
                <div className="text-sm text-slate-500">Investors</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full mt-10 max-w-2xl mx-auto flex items-center border-2 border-slate-200 rounded-2xl px-4 py-3 focus-within:border-red-400 shadow-sm bg-white">
              <input
                type="text"
                placeholder="Search companies, investors, products..."
                className="flex-1 outline-none text-slate-800 text-base placeholder:text-slate-400 bg-white"
              />
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-medium ml-2 transition-colors">
                Search
              </button>
            </div>

            {/* Category Pills Row */}
            <div className="mt-6 flex gap-2 justify-center flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  className="border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 hover:border-red-400 hover:text-red-500 cursor-pointer transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                Trending
              </p>
              <h2 className="text-2xl font-semibold text-gray-900">
                Trending AI Companies
              </h2>
            </div>
            <Link
              href="/companies"
              className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors flex-shrink-0"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {trendingCompanies.slice(0, 5).map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <TrendingCompanyCard company={company} rank={index + 1} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fastest Growing */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="section-container">
          <div className="mb-8">
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
              GROWTH
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Fastest Growing</h2>
          </div>

          <InfiniteScroll speed={30} pauseOnHover className="mt-6">
            {trendingCompanies.slice(0, 12).map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="flex-shrink-0 min-w-[180px] bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer"
              >
                {getFallbackLogoUrl(company.logo_url) ? (
                  <div className="relative w-12 h-12 mx-auto mb-3">
                    <img 
                      src={getFallbackLogoUrl(company.logo_url) || ''} 
                      alt={`${company.name} logo`} 
                      className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-100 p-1.5 mx-auto relative z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById(`growth-fallback-${company.id}`);
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div 
                      id={`growth-fallback-${company.id}`}
                      className={cn(
                        'absolute inset-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg hidden mx-auto',
                        logoColors[company.category] || 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {company.name.charAt(0)}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center font-bold text-lg',
                      logoColors[company.category] || 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {company.name.charAt(0)}
                  </div>
                )}
                <p className="text-sm font-semibold text-slate-900 truncate">{company.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{company.category}</p>
                <div className="mt-3">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                    +{company.growth_score.toFixed(0)}%
                  </span>
                </div>
              </Link>
            ))}
          </InfiniteScroll>
        </div>
      </section>

      {/* Emerging Startups */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="section-container">
          <div className="mb-8">
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
              EMERGING
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Startups to Watch</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCompanies.slice(0, 4).map((company, index) => {
              const gradients = [
                'from-purple-600 to-purple-900',
                'from-blue-600 to-blue-900',
                'from-orange-500 to-red-700',
                'from-slate-700 to-slate-900',
              ];
              const gradient = gradients[index % gradients.length];
              return (
                <motion.div
                  key={company.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/companies/${company.slug}`} className="block h-full cursor-pointer">
                    <div className={cn(
                      "h-full p-6 rounded-2xl text-white shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br flex flex-col justify-between min-h-[220px]",
                      gradient
                    )}>
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            {company.category}
                          </span>
                          {getFallbackLogoUrl(company.logo_url) ? (
                            <div className="relative w-10 h-10">
                              <img 
                                src={getFallbackLogoUrl(company.logo_url) || ''} 
                                alt={`${company.name} logo`} 
                                className="w-10 h-10 rounded-lg object-contain bg-white p-1 relative z-10"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = document.getElementById(`emerging-fallback-${company.id}`);
                                  if (fallback) fallback.classList.remove('hidden');
                                }}
                              />
                              <div 
                                id={`emerging-fallback-${company.id}`}
                                className="absolute inset-0 w-10 h-10 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm hidden"
                              >
                                {company.name.charAt(0)}
                              </div>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm">
                              {company.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">{company.name}</h3>
                        <p className="text-white/70 text-sm mt-1 line-clamp-2">
                          {company.tagline || company.description}
                        </p>
                      </div>
                      <div className="text-white/60 text-xs mt-6 flex items-center gap-2">
                        <span>Founded {company.founded_year || 'N/A'}</span>
                        <span>•</span>
                        <span>{company.employee_count || '0'} employees</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="section-container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Browse by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Explore the AI landscape by sector</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {browseCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/companies?category=${encodeURIComponent(category.name)}`}
                    className="block p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all cursor-pointer group"
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                        getCategoryIconColor(category.name)
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-red-500 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{category.count} companies</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Unicorns */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🦄</span>
            <div>
              <h2 className="text-2xl font-bold text-white">AI UNICORNS</h2>
              <p className="text-sm text-slate-400 mt-1">Companies valued at $1B+</p>
            </div>
          </div>

          <InfiniteScroll speed={35} direction="right" pauseOnHover className="mt-6">
            {unicorns.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="flex-shrink-0 w-40 p-4 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-colors text-center cursor-pointer"
              >
                {getFallbackLogoUrl(company.logo_url) ? (
                  <div className="relative w-12 h-12 mx-auto mb-3">
                    <img 
                      src={getFallbackLogoUrl(company.logo_url) || ''} 
                      alt={`${company.name} logo`} 
                      className="w-12 h-12 rounded-xl object-contain bg-white p-1.5 mx-auto relative z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById(`unicorn-fallback-${company.id}`);
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div 
                      id={`unicorn-fallback-${company.id}`}
                      className={cn(
                        'absolute inset-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg hidden mx-auto',
                        logoColors[company.category] || 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {company.name.charAt(0)}
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center font-bold text-lg',
                      logoColors[company.category] || 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {company.name.charAt(0)}
                  </div>
                )}
                <p className="font-semibold text-white text-sm truncate">{company.name}</p>
                <p className="text-slate-400 text-xs mt-1">
                  ${company.valuation ? (company.valuation / 1e9).toFixed(1) : '0'}B
                </p>
              </Link>
            ))}
          </InfiniteScroll>
        </div>
      </section>

      {/* Frontier Labs */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="section-container">
          <div className="mb-8">
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
              FRONTIER
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Leading AI Research Labs</h2>
            <p className="text-sm text-slate-500 mt-1">Pushing the boundaries of AI capabilities</p>
          </div>

          <InfiniteScroll speed={32} pauseOnHover className="mt-6">
            {trendingCompanies
              .filter((c) => ['AI Agents', 'AI Infrastructure'].includes(c.category))
              .slice(0, 10)
              .map((company) => (
              <Link
                key={`frontier-${company.id}`}
                href={`/companies/${company.slug}`}
                className="flex-shrink-0 w-64 p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-red-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {getFallbackLogoUrl(company.logo_url) ? (
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <img 
                        src={getFallbackLogoUrl(company.logo_url) || ''} 
                        alt={`${company.name} logo`} 
                        className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-200 p-2 relative z-10"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = document.getElementById(`frontier-fallback-${company.id}`);
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                      <div 
                        id={`frontier-fallback-${company.id}`}
                        className={cn(
                          'absolute inset-0 w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg hidden',
                          logoColors[company.category] || 'bg-slate-100 text-slate-700'
                        )}
                      >
                        {company.name.charAt(0)}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0',
                        logoColors[company.category] || 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {company.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 group-hover:text-red-500 transition-colors truncate">
                      {company.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {company.tagline || company.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-slate-400">{company.stage}</span>
                      {company.is_unicorn && <span className="text-xs">🦄</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </InfiniteScroll>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="section-container">
          <div className="bg-white rounded-3xl p-12 max-w-2xl mx-auto shadow-sm border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 text-center">
              Stay updated on the AI economy
            </h2>
            <p className="text-slate-500 text-center mt-2">
              Weekly insights on startups, funding, and market trends
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors"
              />
              <button className="bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-slate-500 text-sm text-center mt-4">50,000+ subscribers</p>
          </div>
        </div>
      </section>
    </div>
  );
}
