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
const CHART_COLORS = ['#0066ff', '#ff3b30', '#ffe500', '#0a0a0a'];

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
          className="link-brutal inline-flex items-center gap-2 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={3} />
          BACK TO COMPANIES
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
                {company.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
                    {company.name}
                  </h1>
                  <p className="text-lg text-muted font-bold uppercase tracking-wide">{company.tagline}</p>
                </div>
                {company.website_url && (
                  <a
                    href={company.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={3} />
                    VISIT WEBSITE
                  </a>
                )}
              </div>

              <p className="text-muted mb-5 leading-relaxed font-medium">{company.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted font-bold uppercase tracking-wide mb-4">
                {company.founded_year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={3} />
                    <span>Founded {company.founded_year}</span>
                  </div>
                )}
                {company.headquarters && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={3} />
                    <span>{company.headquarters}</span>
                  </div>
                )}
                {company.employee_count && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" strokeWidth={3} />
                    <span>{company.employee_count} employees</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <CategoryTag category={company.category} />
                <span className="brutal-tag bg-[#0066ff] text-white">
                  {company.stage}
                </span>
                {company.is_unicorn && (
                  <span className="brutal-tag bg-[#ffe500] inline-flex items-center gap-1.5">
                    <Crown className="w-3 h-3" strokeWidth={3} />
                    UNICORN
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
                  <tr className="border-b-[3px] border-black">
                    {['Round', 'Date', 'Amount', 'Lead Investor'].map((col) => (
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
                  {company.funding_rounds.map((round: { id: string; round_type: string; announced_date: string; amount: number; lead_investor?: { name: string } }) => (
                    <tr key={round.id} className="border-b-[2px] border-black/10 hover:bg-[#ffe500]/20 transition-colors">
                      <td className="py-3.5 px-4 font-black text-foreground text-sm uppercase">
                        {round.round_type}
                      </td>
                      <td className="py-3.5 px-4 text-muted text-sm font-bold">
                        {new Date(round.announced_date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-foreground text-sm font-mono font-black">
                        ${(round.amount / 1e6).toFixed(0)}M
                      </td>
                      <td className="py-3.5 px-4 text-muted text-sm font-bold">
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
                  fill="#0066ff"
                  dataKey="value"
                  stroke="#0a0a0a"
                  strokeWidth={2}
                >
                  {ownershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: '#525252', fontSize: 12, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {company.founders && company.founders.length > 0 && (
          <Section title="Founders & Leadership">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.founders.map((founder) => (
                <div key={founder.id} className="flex items-start gap-4 p-4 surface-card bg-[#f4f0e8]">
                  <div className="w-14 h-14 bg-black text-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] flex items-center justify-center flex-shrink-0">
                    <span className="font-black text-lg">
                      {founder.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-foreground tracking-tight">{founder.name}</h3>
                    <p className="text-sm text-muted font-bold uppercase">{founder.title}</p>
                    {founder.bio && (
                      <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed font-medium">
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
                  className="surface-card p-4 card-hover text-center group bg-white"
                >
                  <div className="w-11 h-11 bg-[#0066ff] text-white border-[3px] border-black shadow-[3px_3px_0_#0a0a0a] mx-auto mb-2 flex items-center justify-center group-hover:bg-[#ffe500] group-hover:text-black transition-colors">
                    <span className="font-black">
                      {investor.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-black uppercase text-foreground truncate">
                    {investor.name}
                  </p>
                  <p className="text-xs text-muted font-bold uppercase">{investor.type}</p>
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
                  className="block p-4 surface-card card-hover bg-white group"
                >
                  <h3 className="font-black uppercase text-foreground mb-1 group-hover:text-[#0066ff] transition-colors text-sm">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted mb-2 line-clamp-2 font-medium">{article.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-muted font-bold uppercase">
                    <span>{article.source}</span>
                    <span>·</span>
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
      <h2 className="text-xl font-black uppercase tracking-tight mb-6">{title}</h2>
      {children}
    </motion.div>
  );
}
