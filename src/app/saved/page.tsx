'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Building2, TrendingUp, Users } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface SavedCompany {
  id: string;
  created_at: string;
  company: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    logo_url: string;
    category: string;
    stage: string;
    valuation: number;
    is_unicorn: boolean;
    growth_score: number;
  };
}

interface SavedInvestor {
  id: string;
  created_at: string;
  investor: {
    id: string;
    slug: string;
    name: string;
    type: string;
    logo_url: string;
    stage_focus: string[];
    sector_focus: string[];
    portfolio_count: number;
    aum: number;
  };
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([]);
  const [savedInvestors, setSavedInvestors] = useState<SavedInvestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'companies' | 'investors'>('companies');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSavedItems();
    } else if (status === 'unauthenticated') {
      window.location.href = '/api/auth/signin';
    }
  }, [status]);

  const fetchSavedItems = async () => {
    try {
      const [companiesRes, investorsRes] = await Promise.all([
        fetch('/api/saved/companies'),
        fetch('/api/saved/investors'),
      ]);

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        setSavedCompanies(companiesData.data || []);
      }

      if (investorsRes.ok) {
        const investorsData = await investorsRes.json();
        setSavedInvestors(investorsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching saved items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Saved Items</h1>
          </div>
          <p className="text-gray-600">
            Companies and investors you're tracking
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'companies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>Companies ({savedCompanies.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('investors')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'investors'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Investors ({savedInvestors.length})</span>
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'companies' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCompanies.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No saved companies yet</p>
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                >
                  Explore companies →
                </Link>
              </div>
            ) : (
              savedCompanies.map((item) => (
                <Link
                  key={item.id}
                  href={`/companies/${item.company.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={item.company.logo_url}
                      alt={item.company.name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {item.company.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.company.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">
                      {item.company.category}
                    </span>
                    {item.company.is_unicorn && (
                      <span className="text-yellow-600">🦄</span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.company.stage}</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">
                        {item.company.growth_score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedInvestors.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No saved investors yet</p>
                <Link
                  href="/investors"
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                >
                  Explore investors →
                </Link>
              </div>
            ) : (
              savedInvestors.map((item) => (
                <Link
                  key={item.id}
                  href={`/investors/${item.investor.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={item.investor.logo_url}
                      alt={item.investor.name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {item.investor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.investor.type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Portfolio</span>
                      <span className="font-medium text-gray-900">
                        {item.investor.portfolio_count} companies
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">AUM</span>
                      <span className="font-medium text-gray-900">
                        ${(item.investor.aum / 1000000000).toFixed(1)}B
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {item.investor.sector_focus.slice(0, 2).map((sector) => (
                        <span
                          key={sector}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
