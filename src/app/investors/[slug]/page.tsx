'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { InvestorWithRelations } from '@/types';
import { cn } from '@/lib/utils';
import { getCategoryLogoColor } from '@/lib/categoryColors';

function formatFunding(amount: number | null | undefined): string {
  if (amount == null || amount <= 0) return 'Undisclosed';
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${Math.round(amount / 1e6)}M`;
  return `$${amount.toLocaleString()}`;
}

function formatEmployees(count: number | null | undefined): string {
  if (count == null || count <= 0) return 'N/A';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const CHART_COLORS = ['#f43f5e', '#f97316', '#eab308', '#6366f1', '#94a3b8'];

export default function InvestorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [investor, setInvestor] = useState<InvestorWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchInvestor();
  }, [slug]);

  const fetchInvestor = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/investors/${slug}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || data.error);
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

  const portfolioData = [
    { name: 'AI Infrastructure', value: 35, color: CHART_COLORS[0] },
    { name: 'AI Agents', value: 22, color: CHART_COLORS[1] },
    { name: 'Healthcare AI', value: 18, color: CHART_COLORS[2] },
    { name: 'Enterprise AI', value: 15, color: CHART_COLORS[3] },
    { name: 'Other', value: 10, color: CHART_COLORS[4] },
  ];

  const stats = [
    { label: 'Deals last 90 days', value: '12' },
    { label: 'Lead investments', value: '45' },
    { label: 'Most active stage', value: 'Series A' },
    { label: 'Top partner', value: 'Sarah Chen' },
    { label: 'Top focus area', value: 'AI Infrastructure' },
  ];

  return (
    <div className="page-shell">
      <div className="section-container">
        <Link href="/investors" className="link-accent inline-flex items-center gap-2 mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to investors
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="surface-card p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-3xl', getCategoryLogoColor(investor.sector_focus?.[0] ?? 'AI Infrastructure'))}>
              {investor.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">{investor.name}</h1>
                  <p className="text-base text-slate-500">{investor.investment_thesis}</p>
                </div>
                <button className="btn-secondary text-sm flex-shrink-0">Follow investor</button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4">
                <span className="tag-pill-accent tag-pill">{investor.type}</span>
                {investor.aum && (
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    ${(investor.aum / 1e9).toFixed(1)}B AUM
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {investor.portfolio_count} portfolio companies
                </span>
              </div>
              {investor.stage_focus && investor.stage_focus.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {investor.stage_focus.map((stage) => (
                    <span key={stage} className="tag-pill">{stage}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-slate-100">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {investor.sector_focus && investor.sector_focus.length > 0 && (
          <Section title="Investment thesis">
            <p className="text-slate-500 mb-6 leading-relaxed">{investor.investment_thesis}</p>
            <div className="flex flex-wrap gap-2">
              {investor.sector_focus.map((sector) => (
                <span key={sector} className="tag-pill-accent tag-pill">{sector}</span>
              ))}
            </div>
          </Section>
        )}

        <Section title="Portfolio concentration">
          <div className="h-72">
            {mounted && typeof window !== 'undefined' ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={90}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: '#64748b', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 animate-pulse rounded-2xl" />
            )}          </div>
        </Section>

        {investor.recent_investments && investor.recent_investments.length > 0 && (
          <Section title="Recent investments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investor.recent_investments.slice(0, 6).map((investment) => {
                const item = investment as typeof investment & {
                  company?: { name?: string; category?: string; stage?: string };
                  funding_round?: { amount: number; round_type: string };
                };
                return (
                  <div key={item.id} className="surface-card card-hover p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg', getCategoryLogoColor(item.company?.category ?? 'AI Infrastructure'))}>
                        {item.company?.name?.charAt(0) || 'C'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1">{item.company?.name || 'Company'}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <span>{item.company?.category}</span>
                          <span>·</span>
                          <span>{item.company?.stage}</span>
                        </div>
                        {item.funding_round && (
                          <p className="text-sm text-slate-600 font-medium">
                            ${(item.funding_round.amount / 1e6).toFixed(0)}M · {item.funding_round.round_type}
                          </p>
                        )}
                        {item.investment_date && (
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(item.investment_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        <Section title="Investment velocity">
          <div className="overflow-x-auto data-table-wrap border-0 shadow-none">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['Year', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'].map((col) => (
                    <th key={col} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { year: '2024', q1: 12, q2: 15, q3: 18, q4: 0 },
                  { year: '2023', q1: 14, q2: 16, q3: 13, q4: 11 },
                  { year: '2022', q1: 10, q2: 12, q3: 14, q4: 15 },
                ].map((row) => (
                  <tr key={row.year} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">{row.year}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-sm">{row.q1}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-sm">{row.q2}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-sm">{row.q3}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-sm">{row.q4 || '—'}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">{row.q1 + row.q2 + row.q3 + row.q4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Follow-on strength">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card-accent stat-card text-center">
              <p className="text-3xl font-bold text-slate-900 mb-1">82%</p>
              <p className="text-sm text-slate-500">Raised next round</p>
            </div>
            <div className="stat-card text-center bg-gradient-to-br from-rose-50 to-orange-50 border-rose-100">
              <p className="text-3xl font-bold text-rose-600 mb-1">14 mo</p>
              <p className="text-sm text-slate-500">Avg time to next round</p>
            </div>
            <div className="stat-card text-center">
              <p className="text-3xl font-bold text-orange-600 mb-1">3.2x</p>
              <p className="text-sm text-slate-500">Avg valuation multiple</p>
            </div>
          </div>
        </Section>

        <Section title="Co-investor network">
          <p className="text-slate-500 mb-6 text-sm">Investors who frequently co-invest with {investor.name}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Sequoia', 'Accel', 'Lightspeed', 'GV', 'Index', 'Founders Fund'].map((co) => (
              <div key={co} className="surface-card card-hover p-4 text-center group cursor-default">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 mx-auto mb-2 flex items-center justify-center font-bold group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                  {co.charAt(0)}
                </div>
                <p className="text-sm font-semibold text-slate-900 truncate">{co}</p>
                <p className="text-xs text-slate-400">12 deals</p>
              </div>
            ))}
          </div>
        </Section>
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
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6 capitalize">{title}</h2>
      {children}
    </motion.div>
  );
}
