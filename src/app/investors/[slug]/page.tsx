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

const CHART_COLORS = ['#0066ff', '#ff3b30', '#ffe500', '#0a0a0a', '#525252'];

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
          className="link-brutal inline-flex items-center gap-2 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={3} />
          BACK TO INVESTORS
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="surface-card p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-black text-white border-[3px] border-black shadow-[4px_4px_0_#0a0a0a] flex items-center justify-center flex-shrink-0">
              <span className="font-black text-3xl">
                {investor.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
                    {investor.name}
                  </h1>
                  <p className="text-lg text-muted font-bold uppercase tracking-wide">{investor.investment_thesis}</p>
                </div>
                <button className="btn-secondary text-sm flex-shrink-0">
                  FOLLOW INVESTOR
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted font-bold uppercase tracking-wide mb-4">
                <span className="brutal-tag bg-[#0066ff] text-white">
                  {investor.type}
                </span>
                {investor.aum && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
                    <span className="font-mono">${(investor.aum / 1e9).toFixed(1)}B AUM</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" strokeWidth={3} />
                  <span>{investor.portfolio_count} portfolio companies</span>
                </div>
              </div>

              {investor.stage_focus && investor.stage_focus.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {investor.stage_focus.map((stage) => (
                    <span
                      key={stage}
                      className="brutal-tag"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t-[3px] border-black">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-muted mb-1 uppercase tracking-wider font-black">{stat.label}</p>
                <p className="text-xl font-black text-foreground tracking-tight uppercase">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {investor.sector_focus && investor.sector_focus.length > 0 && (
          <Section title="Investment Thesis">
            <p className="text-muted mb-6 leading-relaxed font-medium">{investor.investment_thesis}</p>
            <div className="flex flex-wrap gap-2">
              {investor.sector_focus.map((sector) => (
                <span
                  key={sector}
                  className="brutal-tag bg-[#ff3b30] text-white"
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
                  fill="#0066ff"
                  dataKey="value"
                  stroke="#0a0a0a"
                  strokeWidth={2}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: '#525252', fontSize: 12, fontWeight: 700 }} />
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
                  className="p-5 surface-card bg-[#f4f0e8] card-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-black text-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] flex items-center justify-center flex-shrink-0">
                      <span className="font-black text-lg">
                        {item.company?.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black uppercase text-foreground tracking-tight mb-1 text-sm">
                        {item.company?.name || 'Company'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted font-bold uppercase mb-2">
                        <span>{item.company?.category}</span>
                        <span>·</span>
                        <span>{item.company?.stage}</span>
                      </div>
                      {item.funding_round && (
                        <p className="text-sm text-muted font-mono font-black">
                          ${(item.funding_round.amount / 1e6).toFixed(0)}M ·{' '}
                          {item.funding_round.round_type}
                        </p>
                      )}
                      {item.investment_date && (
                        <p className="text-xs text-muted font-bold mt-1 uppercase">
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
                <tr className="border-b-[3px] border-black">
                  {['Year', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'].map((col) => (
                    <th
                      key={col}
                      className="text-left py-3 px-4 text-xs font-black text-muted uppercase tracking-wider"
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
                  <tr key={row.year} className="border-b-[2px] border-black/10 hover:bg-[#ffe500]/20 transition-colors">
                    <td className="py-3.5 px-4 font-black text-foreground text-sm">{row.year}</td>
                    <td className="py-3.5 px-4 text-muted text-sm font-mono font-bold">{row.q1}</td>
                    <td className="py-3.5 px-4 text-muted text-sm font-mono font-bold">{row.q2}</td>
                    <td className="py-3.5 px-4 text-muted text-sm font-mono font-bold">{row.q3}</td>
                    <td className="py-3.5 px-4 text-muted text-sm font-mono font-bold">{row.q4 || '—'}</td>
                    <td className="py-3.5 px-4 font-black text-foreground text-sm font-mono">
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
            <div className="text-center p-6 surface-card bg-[#ffe500]">
              <p className="text-3xl font-black text-foreground mb-1 tracking-tight font-mono">82%</p>
              <p className="text-sm text-muted font-bold uppercase">Raised Next Round</p>
            </div>
            <div className="text-center p-6 surface-card bg-[#0066ff] text-white">
              <p className="text-3xl font-black mb-1 tracking-tight font-mono">14 months</p>
              <p className="text-sm font-bold uppercase opacity-80">Avg Time to Next Round</p>
            </div>
            <div className="text-center p-6 surface-card bg-[#ff3b30] text-white">
              <p className="text-3xl font-black mb-1 tracking-tight font-mono">3.2x</p>
              <p className="text-sm font-bold uppercase opacity-80">Avg Valuation Multiple</p>
            </div>
          </div>
        </Section>

        <Section title="Co-investor Network">
          <p className="text-muted mb-6 text-sm font-bold uppercase tracking-wide">
            Investors who frequently co-invest with {investor.name}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Sequoia', 'Accel', 'Lightspeed', 'GV', 'Index', 'Founders Fund'].map((co) => (
              <div
                key={co}
                className="surface-card p-4 card-hover text-center group cursor-default bg-white"
              >
                <div className="w-11 h-11 bg-black text-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] mx-auto mb-2 flex items-center justify-center group-hover:bg-[#ffe500] group-hover:text-black transition-colors">
                  <span className="font-black">{co.charAt(0)}</span>
                </div>
                <p className="text-sm font-black uppercase text-foreground truncate">{co}</p>
                <p className="text-xs text-muted font-mono font-bold">12 deals</p>
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
      <h2 className="text-xl font-black uppercase tracking-tight mb-6">{title}</h2>
      {children}
    </motion.div>
  );
}
