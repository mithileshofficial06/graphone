'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Calendar, Users, Twitter, Linkedin, Github } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import CategoryTag from '@/components/ui/CategoryTag';
import ProductCard from '@/components/ui/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { CompanyWithRelations } from '@/types';

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [company, setCompany] = useState<CompanyWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompany();
  }, [slug]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/companies/${slug}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || data.error);
      }

      setCompany(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchCompany} />;
  if (!company) return <ErrorState message="Company not found" />;

  // Mock ownership data for chart
  const ownershipData = [
    { name: 'Microsoft', value: 49, color: '#00A4EF' },
    { name: 'Employees', value: 18, color: '#F43F5E' },
    { name: 'Founders', value: 12, color: '#8B5CF6' },
    { name: 'Other Investors', value: 21, color: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to companies
        </Link>

        {/* Company Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-3xl">
                {company.name.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {company.name}
                  </h1>
                  <p className="text-xl text-gray-600">{company.tagline}</p>
                </div>
                {company.website_url && (
                  <a
                    href={company.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>

              <p className="text-gray-700 mb-4">{company.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {company.founded_year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {company.founded_year}</span>
                  </div>
                )}
                {company.headquarters && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{company.headquarters}</span>
                  </div>
                )}
                {company.employee_count && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{company.employee_count} employees</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <CategoryTag category={company.category} />
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded">
                  {company.stage}
                </span>
                {company.is_unicorn && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded">
                    🦄 Unicorn
                  </span>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Twitter className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Linkedin className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Github className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Funding Timeline */}
        {company.funding_rounds && company.funding_rounds.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Timeline</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Round
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Lead Investor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {company.funding_rounds.map((round: any) => (
                    <tr key={round.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {round.round_type}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(round.announced_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        ${(round.amount / 1e6).toFixed(0)}M
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {round.lead_investor?.name || 'Undisclosed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ownership Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ownership Structure</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ownershipData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ownershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Founders & Leadership */}
        {company.founders && company.founders.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Founders & Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.founders.map((founder) => (
                <div key={founder.id} className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {founder.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{founder.name}</h3>
                    <p className="text-sm text-gray-600">{founder.title}</p>
                    {founder.bio && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {founder.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {company.products && company.products.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, company: company }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Investors */}
        {company.investors && company.investors.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Investors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {company.investors.map((investor) => (
                <Link
                  key={investor.id}
                  href={`/investors/${investor.slug}`}
                  className="text-center p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {investor.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {investor.name}
                  </p>
                  <p className="text-xs text-gray-500">{investor.type}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* News */}
        {company.news && company.news.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent News</h2>
            <div className="space-y-4">
              {company.news.slice(0, 5).map((article: any) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
