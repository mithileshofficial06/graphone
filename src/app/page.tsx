'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Sparkles, Zap } from 'lucide-react';
import CompanyCard from '@/components/ui/CompanyCard';
import CategoryTag from '@/components/ui/CategoryTag';
import TrendingBadge from '@/components/ui/TrendingBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Company } from '@/types';

const categories = [
  'AI Agents',
  'AI Coding',
  'AI Search',
  'AI Video',
  'AI Voice',
  'AI Infrastructure',
  'More',
];

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Discover the world's most
              <br />
              <span className="text-red-500">innovative AI companies</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Track 50,000+ AI companies, $100B+ in funding, and the investors building the AI economy
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search companies, investors, products..."
                  className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                />
                <button className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-red-500 hover:text-red-500 text-sm font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Companies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h2 className="text-3xl font-bold text-gray-900">Trending AI Companies</h2>
            </div>
            <Link
              href="/companies"
              className="text-red-500 hover:text-red-600 font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCompanies.slice(0, 6).map((company, index) => (
                <div key={company.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <TrendingBadge rank={index + 1} />
                    </div>
                  )}
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fastest Growing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">Fastest Growing AI Companies</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingCompanies.slice(0, 6).map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 text-center truncate">
                  {company.name}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {company.growth_score.toFixed(0)}% growth
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Emerging Startups Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h2 className="text-3xl font-bold text-gray-900">Emerging AI Startups to Watch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCompanies.slice(0, 4).map((company, index) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="group"
              >
                <div className={`p-6 rounded-lg h-full ${getGradientClass(index)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <span className="font-bold text-xl">{company.name.charAt(0)}</span>
                    </div>
                    <CategoryTag category={company.category} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{company.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{company.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'AI Agents', count: 12, icon: '🤖' },
              { name: 'AI Coding', count: 18, icon: '💻' },
              { name: 'AI Search', count: 8, icon: '🔍' },
              { name: 'AI Video', count: 15, icon: '🎥' },
              { name: 'AI Voice', count: 10, icon: '🎙️' },
              { name: 'AI Infrastructure', count: 22, icon: '🏗️' },
              { name: 'Healthcare AI', count: 14, icon: '🏥' },
              { name: 'Robotics', count: 9, icon: '🦾' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/companies?category=${encodeURIComponent(category.name)}`}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-500">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} companies</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Unicorns Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">AI Unicorns 🦄</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingCompanies.filter(c => c.is_unicorn).slice(0, 10).map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <p className="font-semibold text-white mb-1">{company.name}</p>
                <p className="text-xs text-gray-400">
                  ${company.valuation ? (company.valuation / 1e9).toFixed(1) : '0'}B valuation
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Frontier Labs Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Frontier AI Labs</h2>
          <p className="text-gray-400 mb-8">Leading AI research organizations pushing the boundaries</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['OpenAI', 'Anthropic', 'DeepMind', 'Meta AI', 'Mistral AI', 'Cohere'].map((lab) => (
              <div
                key={lab}
                className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="font-bold text-xl">{lab.charAt(0)}</span>
                </div>
                <p className="text-sm font-semibold text-white text-center">{lab}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated on the AI Economy
          </h2>
          <p className="text-red-100 mb-8">
            Get weekly insights on AI startups, funding rounds, and market trends
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-red-500 rounded-lg hover:bg-gray-100 font-semibold">
              Subscribe
            </button>
          </div>

          <p className="text-red-100 text-sm mt-4">
            Join 50,000+ AI enthusiasts and investors
          </p>
        </div>
      </section>
    </div>
  );
}

function getGradientClass(index: number): string {
  const gradients = [
    'bg-gradient-to-br from-purple-50 to-purple-100',
    'bg-gradient-to-br from-blue-50 to-blue-100',
    'bg-gradient-to-br from-green-50 to-green-100',
    'bg-gradient-to-br from-pink-50 to-pink-100',
  ];
  return gradients[index % gradients.length];
}
