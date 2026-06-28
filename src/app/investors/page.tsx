'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp } from 'lucide-react';
import InvestorCard from '@/components/ui/InvestorCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Investor } from '@/types';

const investorCollections = [
  {
    title: 'Investors Backing AI Agents',
    description: 'VCs leading the autonomous AI revolution',
    image: '🤖',
  },
  {
    title: 'Indian AI Startups',
    description: 'Investors funding India's AI ecosystem',
    image: '🇮🇳',
  },
  {
    title: 'Top Seed Investors',
    description: 'Early-stage AI investors with strong track records',
    image: '🌱',
  },
  {
    title: 'Operator Angels',
    description: 'AI founders turned investors',
    image: '👼',
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Discover Investors Building
              <br />
              <span className="text-red-500">the AI Economy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Track 6,000+ AI investors, their portfolios, and investment strategies
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search investors by name, thesis, or focus..."
                  className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                />
                <button className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2">
              {['AI Infrastructure', 'Series A', 'Healthcare AI', 'Enterprise AI', 'Robotics'].map((term) => (
                <button
                  key={term}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-red-500 hover:text-red-500 text-sm font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Investors Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h2 className="text-3xl font-bold text-gray-900">Trending Investors</h2>
            </div>
            <Link
              href="/investors/all"
              className="text-red-500 hover:text-red-600 font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostActiveInvestors.slice(0, 6).map((investor) => (
                <div
                  key={investor.id}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-lg"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">
                        {investor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{investor.name}</h3>
                      <span className="text-xs text-gray-300">{investor.type}</span>
                    </div>
                  </div>

                  {investor.stage_focus && investor.stage_focus.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {investor.stage_focus.slice(0, 3).map((stage) => (
                        <span
                          key={stage}
                          className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded"
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/investors/${investor.slug}`}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    View portfolio →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Investor Collections Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investor Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorCollections.map((collection) => (
              <Link
                key={collection.title}
                href={`/investors/collection/${collection.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="bg-gradient-to-br from-red-500 to-pink-500 h-40 flex items-center justify-center text-6xl">
                  {collection.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-500">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-gray-600">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Type Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Investor Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investorTypes.map((type) => (
              <Link
                key={type.name}
                href={`/investors?type=${encodeURIComponent(type.stage)}`}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-white transition-all group"
              >
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-500">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-500">{type.count} investors</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Active Investors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Most Active Investors</h2>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mostActiveInvestors.slice(0, 10).map((investor) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Weekly Investor Insights
          </h2>
          <p className="text-gray-400 mb-8">
            Track new funds, portfolio updates, and investment trends in AI
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
