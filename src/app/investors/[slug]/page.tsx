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

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

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
    <div className="min-h-screen">
      <div className="section-container py-8 md:py-12">
        <Link
          href="/investors"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-foreground mb-8 transition-colors group"
        >
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-3xl">
                {investor.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    {investor.name}
                  </h1>
                  <p className="text-lg text-zinc-500">{investor.investment_thesis}</p>
                </div>
                <button className="btn-secondary text-sm flex-shrink-0 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
                  Follow Investor
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-4">
                <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-xs rounded-md border border-indigo-500/20 font-medium">
                  {investor.type}
                </span>
                {investor.aum && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-mono">${(investor.aum / 1e9).toFixed(1)}B AUM</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{investor.portfolio_count} portfolio companies</span>
                </div>
              </div>

              {investor.stage_focus && investor.stage_focus.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {investor.stage_focus.map((stage) => (
                    <span
                      key={stage}
                      className="px-2.5 py-0.5 bg-white/[0.06] text-zinc-400 text-xs rounded-md border border-white/[0.06]"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-white/[0.08]">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-zinc-600 mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-foreground tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {investor.sector_focus && investor.sector_focus.length > 0 && (
          <Section title="Investment Thesis">
            <p className="text-zinc-400 mb-6 leading-relaxed">{investor.investment_thesis}</p>
            <div className="flex flex-wrap gap-2">
              {investor.sector_focus.map((sector) => (
                <span
                  key={sector}
                  className="px-3 py-1.5 bg-violet-500/10 text-violet-300 text-sm rounded-lg border border-violet-500/20 font-medium"
                >
                  {sector}
                </span>
              ))}
            </div>
          </Section>
        )}

        <Section title="Portfolio Concentration">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
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
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {investor.recent_investments && investor.recent_investments.length > 0 && (
          <Section title="Recent Investments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {investor.recent_investments.slice(0, 6).map((investment) => {
                const item = investment as typeof investment & {
                  company?: { name?: string; category?: string; stage?: string };
                  funding_round?: { amount: number; round_type: string };
                };
                return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-white text-lg">
                        {item.company?.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground tracking-tight mb-1">
                        {item.company?.name || 'Company'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                        <span>{item.company?.category}</span>
                        <span className="text-zinc-700">·</span>
                        <span>{item.company?.stage}</span>
                      </div>
                      {item.funding_round && (
                        <p className="text-sm text-zinc-400 font-mono">
                          ${(item.funding_round.amount / 1e6).toFixed(0)}M ·{' '}
                          {item.funding_round.round_type}
                        </p>
                      )}
                      {item.investment_date && (
                        <p className="text-xs text-zinc-600 mt-1">
                          {new Date(item.investment_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </Section>
        )}

        <Section title="Investment Velocity">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {['Year', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'].map((col) => (
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
                {[
                  { year: '2024', q1: 12, q2: 15, q3: 18, q4: 0 },
                  { year: '2023', q1: 14, q2: 16, q3: 13, q4: 11 },
                  { year: '2022', q1: 10, q2: 12, q3: 14, q4: 15 },
                ].map((row) => (
                  <tr key={row.year} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground text-sm">{row.year}</td>
                    <td className="py-3.5 px-4 text-zinc-500 text-sm font-mono">{row.q1}</td>
                    <td className="py-3.5 px-4 text-zinc-500 text-sm font-mono">{row.q2}</td>
                    <td className="py-3.5 px-4 text-zinc-500 text-sm font-mono">{row.q3}</td>
                    <td className="py-3.5 px-4 text-zinc-500 text-sm font-mono">{row.q4 || '—'}</td>
                    <td className="py-3.5 px-4 font-semibold text-foreground text-sm font-mono">
                      {row.q1 + row.q2 + row.q3 + row.q4}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Follow-on Strength">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <p className="text-3xl font-bold text-emerald-400 mb-1 tracking-tight font-mono">82%</p>
              <p className="text-sm text-zinc-500">Raised Next Round</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-blue-500/5 border border-blue-500/15">
              <p className="text-3xl font-bold text-blue-400 mb-1 tracking-tight font-mono">14 months</p>
              <p className="text-sm text-zinc-500">Avg Time to Next Round</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-violet-500/5 border border-violet-500/15">
              <p className="text-3xl font-bold text-violet-400 mb-1 tracking-tight font-mono">3.2x</p>
              <p className="text-sm text-zinc-500">Avg Valuation Multiple</p>
            </div>
          </div>
        </Section>

        <Section title="Co-investor Network">
          <p className="text-zinc-500 mb-6 text-sm">
            Investors who frequently co-invest with {investor.name}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Sequoia', 'Accel', 'Lightspeed', 'GV', 'Index', 'Founders Fund'].map((co) => (
              <div
                key={co}
                className="surface-card p-4 card-hover text-center group cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-white/[0.08] mx-auto mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-foreground font-semibold">{co.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-foreground truncate">{co}</p>
                <p className="text-xs text-zinc-600 font-mono">12 deals</p>
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
      <h2 className="text-xl font-bold tracking-tight mb-6">{title}</h2>
      {children}
    </motion.div>
  );
}
