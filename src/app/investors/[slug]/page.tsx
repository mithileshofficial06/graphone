'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { InvestorWithRelations } from '@/types';

export default function InvestorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [investor, setInvestor] = useState<InvestorWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestor();
  }, [slug]);

  const fetchInvestor = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/investors/${slug}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || data.error);
      }

      setInvestor(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchInvestor} />;
  if (!investor) return <ErrorState message="Investor not found" />;

  // Mock portfolio concentration data
  const portfolioData = [
    { name: 'AI Infrastructure', value: 35, color: '#6366F1' },
    { name: 'AI Agents', value: 22, color: '#8B5CF6' },
    { name: 'Healthcare AI', value: 18, color: '#EC4899' },
    { name: 'Enterprise AI', value: 15, color: '#10B981' },
    { name: 'Other', value: 10, color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/investors"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to investors
        </Link>

        {/* Investor Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-3xl">
                {investor.name.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {investor.name}
                  </h1>
                  <p className="text-xl text-gray-600">{investor.investment_thesis}</p>
                </div>
                <button className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium">
                  Follow Investor
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                  {investor.type}
                </span>
                {investor.aum && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>${(investor.aum / 1e9).toFixed(1)}B AUM</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{investor.portfolio_count} portfolio companies</span>
                </div>
              </div>

              {/* Stage Focus Tags */}
              {investor.stage_focus && investor.stage_focus.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {investor.stage_focus.map((stage) => (
                    <span
                      key={stage}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Deals last 90 days</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Lead investments</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Most active stage</p>
              <p className="text-2xl font-bold text-gray-900">Series A</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Top partner</p>
              <p className="text-2xl font-bold text-gray-900">Sarah Chen</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Top focus area</p>
              <p className="text-2xl font-bold text-gray-900">AI Infrastructure</p>
            </div>
          </div>
        </div>

        {/* Investment Thesis */}
        {investor.sector_focus && investor.sector_focus.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Investment Thesis</h2>
            <p className="text-gray-700 mb-6">{investor.investment_thesis}</p>

            <div className="flex flex-wrap gap-2">
              {investor.sector_focus.map((sector) => (
                <span
                  key={sector}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Concentration Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Concentration</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Investments */}
        {investor.recent_investments && investor.recent_investments.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Investments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investor.recent_investments.slice(0, 6).map((investment: any) => (
                <div
                  key={investment.id}
                  className="bg-gray-900 text-white p-6 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-xl">
                        {investment.company?.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {investment.company?.name || 'Company'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                        <span>{investment.company?.category}</span>
                        <span>•</span>
                        <span>{investment.company?.stage}</span>
                      </div>
                      {investment.funding_round && (
                        <p className="text-sm text-gray-400">
                          ${(investment.funding_round.amount / 1e6).toFixed(0)}M •{' '}
                          {investment.funding_round.round_type}
                        </p>
                      )}
                      {investment.investment_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(investment.investment_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investment Velocity Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Velocity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Year
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Q1
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Q2
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Q3
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Q4
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year: '2024', q1: 12, q2: 15, q3: 18, q4: 0 },
                  { year: '2023', q1: 14, q2: 16, q3: 13, q4: 11 },
                  { year: '2022', q1: 10, q2: 12, q3: 14, q4: 15 },
                ].map((row) => (
                  <tr key={row.year} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{row.year}</td>
                    <td className="py-3 px-4 text-gray-600">{row.q1}</td>
                    <td className="py-3 px-4 text-gray-600">{row.q2}</td>
                    <td className="py-3 px-4 text-gray-600">{row.q3}</td>
                    <td className="py-3 px-4 text-gray-600">{row.q4 || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {row.q1 + row.q2 + row.q3 + row.q4}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Follow-on Strength Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow-on Strength</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-4xl font-bold text-green-600 mb-2">82%</p>
              <p className="text-sm text-gray-600">Raised Next Round</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-4xl font-bold text-blue-600 mb-2">14 months</p>
              <p className="text-sm text-gray-600">Avg Time to Next Round</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <p className="text-4xl font-bold text-purple-600 mb-2">3.2x</p>
              <p className="text-sm text-gray-600">Avg Valuation Multiple</p>
            </div>
          </div>
        </div>

        {/* Co-investor Network */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Co-investor Network</h2>
          <p className="text-gray-600 mb-6">
            Investors who frequently co-invest with {investor.name}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Sequoia', 'Accel', 'Lightspeed', 'GV', 'Index', 'Founders Fund'].map((co) => (
              <div
                key={co}
                className="text-center p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">{co.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{co}</p>
                <p className="text-xs text-gray-500">12 deals</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
