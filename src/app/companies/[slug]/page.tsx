'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Crown,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import CategoryTag from '@/components/ui/CategoryTag';
import ProductCard from '@/components/ui/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { CompanyWithRelations } from '@/types';
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

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

  const ownershipData = [
    { name: 'Microsoft', value: 49, color: CHART_COLORS[0] },
    { name: 'Employees', value: 18, color: CHART_COLORS[1] },
    { name: 'Founders', value: 12, color: CHART_COLORS[2] },
    { name: 'Other Investors', value: 21, color: CHART_COLORS[3] },
  ];

  return (
    <div className="min-h-screen">
      <div className="section-container py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to companies
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="surface-card p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-3xl">
                {company.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    {company.name}
                  </h1>
                  <p className="text-lg text-zinc-500">{company.tagline}</p>
                </div>
                {company.website_url && (
                  <a
                    href={company.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>

              <p className="text-zinc-400 mb-5 leading-relaxed">{company.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-4">
                {company.founded_year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Founded {company.founded_year}</span>
                  </div>
                )}
                {company.headquarters && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{company.headquarters}</span>
                  </div>
                )}
                {company.employee_count && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{company.employee_count} employees</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <CategoryTag category={company.category} />
                <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20">
                  {company.stage}
                </span>
                {company.is_unicorn && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 text-amber-300 text-xs rounded-md border border-amber-500/20">
                    <Crown className="w-3 h-3" />
                    Unicorn
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {company.funding_rounds && company.funding_rounds.length > 0 && (
          <Section title="Funding Timeline">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    {['Round', 'Date', 'Amount', 'Lead Investor'].map((col) => (
                      <th
                        key={col}
                        className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {company.funding_rounds.map((round: { id: string; round_type: string; announced_date: string; amount: number; lead_investor?: { name: string } }) => (
                    <tr key={round.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-foreground text-sm">
                        {round.round_type}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-sm">
                        {new Date(round.announced_date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-foreground text-sm font-mono">
                        ${(round.amount / 1e6).toFixed(0)}M
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-sm">
                        {round.lead_investor?.name || 'Undisclosed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        <Section title="Ownership Structure">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ownershipData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="transparent"
                >
                  {ownershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {company.founders && company.founders.length > 0 && (
          <Section title="Founders & Leadership">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.founders.map((founder) => (
                <div key={founder.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <span className="text-foreground font-semibold text-lg">
                      {founder.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground tracking-tight">{founder.name}</h3>
                    <p className="text-sm text-zinc-500">{founder.title}</p>
                    {founder.bio && (
                      <p className="text-sm text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                        {founder.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {company.products && company.products.length > 0 && (
          <Section title="Products">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, company: company }}
                />
              ))}
            </div>
          </Section>
        )}

        {company.investors && company.investors.length > 0 && (
          <Section title="Investors">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {company.investors.map((investor) => (
                <Link
                  key={investor.id}
                  href={`/investors/${investor.slug}`}
                  className="surface-card p-4 card-hover text-center group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/[0.08] mx-auto mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-foreground font-semibold">
                      {investor.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {investor.name}
                  </p>
                  <p className="text-xs text-zinc-600">{investor.type}</p>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {company.news && company.news.length > 0 && (
          <Section title="Recent News">
            <div className="space-y-3">
              {company.news.slice(0, 5).map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all group"
                >
                  <h3 className="font-medium text-foreground mb-1 group-hover:text-indigo-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-2 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <span>{article.source}</span>
                    <span className="text-zinc-700">·</span>
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="surface-card p-6 md:p-8 mb-6"
    >
      <h2 className="text-xl font-bold tracking-tight mb-6">{title}</h2>
      {children}
    </motion.div>
  );
}
