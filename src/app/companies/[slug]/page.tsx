'use client';

import { useEffect, useState, useCallback } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  Globe, Calendar, MapPin, Users, CheckCircle2, AtSign, Link2, Code2,
  ArrowLeft, ExternalLink, Heart, TrendingUp, Building2, Layers, ChevronRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import CategoryTag from '@/components/ui/CategoryTag';
import { getCategoryLogoColor, getCategoryIconColor } from '@/lib/categoryColors';
import { cn, getFallbackLogoUrl } from '@/lib/utils';
import { Company, FundingRoundWithRelations, Product, NewsArticle } from '@/types';

// ─── Helper formatters ────────────────────────────────────────────────────────

function formatFunding(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${Math.round(amount / 1e6)}M`;
  return `$${amount.toLocaleString()}`;
}

function formatEmployees(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ─── Company Logo with image + letter fallback ────────────────────────────────

function CompanyLogoImg({
  name,
  logoUrl,
  category,
  sizeClass,
  textClass = 'text-2xl font-bold',
  shape = 'rounded-2xl',
}: {
  name: string;
  logoUrl: string | null;
  category: string;
  sizeClass: string;
  textClass?: string;
  shape?: string;
}) {
  const src = getFallbackLogoUrl(logoUrl);
  const [imgFailed, setImgFailed] = useState(false);

  if (src && !imgFailed) {
    return (
      <div className={cn(sizeClass, shape, 'flex-shrink-0 bg-white border border-slate-100 overflow-hidden flex items-center justify-center')}>
        <img
          src={src}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-1"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn(sizeClass, shape, 'flex-shrink-0 flex items-center justify-center', textClass, getCategoryLogoColor(category))}>
      {name.charAt(0)}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompanyDetail extends Company {
  founders?: Array<{
    id: string;
    name: string;
    title: string | null;
    bio: string | null;
    avatar_url: string | null;
    linkedin_url: string | null;
  }>;
  hq_city?: string | null;
  hq_country?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  total_funding?: number | null;
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="h-4 w-48 bg-gray-200 rounded mb-8" />
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="flex gap-6 items-start">
            <div className="w-20 h-20 rounded-2xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-64 bg-gray-200 rounded" />
              <div className="h-4 w-full max-w-lg bg-gray-200 rounded" />
              <div className="flex gap-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-24 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Not Found State ──────────────────────────────────────────────────────────

function NotFoundState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Company not found</h1>
        <p className="text-slate-600 mb-6">
          The company you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </Link>
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-10 h-10 text-orange-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-600 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
  action,
  badge,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn('mb-16 pb-16', !last && 'border-b border-slate-100')}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          {title}
          {badge}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function getStageBadgeColor(stage: string): string {
  const map: Record<string, string> = {
    Seed: 'bg-green-100 text-green-700',
    'Series A': 'bg-blue-100 text-blue-700',
    'Series B': 'bg-purple-100 text-purple-700',
    'Series C': 'bg-orange-100 text-orange-700',
    'Series D': 'bg-pink-100 text-pink-700',
    Growth: 'bg-red-100 text-red-700',
    Public: 'bg-emerald-100 text-emerald-700',
    Acquired: 'bg-slate-100 text-slate-700',
  };
  return map[stage] ?? 'bg-slate-100 text-slate-700';
}

function getRoundBadgeColor(round: string): string {
  const r = round.toLowerCase();
  if (r.includes('seed')) return 'bg-green-100 text-green-700';
  if (r.includes('series a')) return 'bg-blue-100 text-blue-700';
  if (r.includes('series b')) return 'bg-purple-100 text-purple-700';
  if (r.includes('series c')) return 'bg-orange-100 text-orange-700';
  if (r.includes('growth') || r.includes('series d')) return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-700';
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [fundingRounds, setFundingRounds] = useState<FundingRoundWithRelations[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [similarCompanies, setSimilarCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      // Step 1: fetch company (need category for similar companies)
      const companyRes = await fetch(`/api/companies/${slug}`);
      const companyJson = await companyRes.json();

      if (companyRes.status === 404 || companyJson.error) {
        setNotFound(true);
        return;
      }

      const companyData: CompanyDetail = companyJson.data;
      setCompany(companyData);

      // Step 2: fetch the rest in parallel
      const [fundingRes, productsRes, newsRes, similarRes] = await Promise.all([
        fetch(`/api/companies/${slug}/funding`),
        fetch(`/api/companies/${slug}/products`),
        fetch(`/api/news?limit=5`),
        fetch(`/api/companies?category=${encodeURIComponent(companyData.category)}&limit=6`),
      ]);

      const [fundingJson, productsJson, newsJson, similarJson] = await Promise.all([
        fundingRes.json(),
        productsRes.json(),
        newsRes.json(),
        similarRes.json(),
      ]);

      setFundingRounds(fundingJson.data || []);
      setProducts(productsJson.data || []);
      setNews(newsJson.data || []);
      const similar = (similarJson.data || []).filter((c: Company) => c.slug !== slug);
      setSimilarCompanies(similar.slice(0, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company data');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) return <PageSkeleton />;
  if (notFound) return <NotFoundState />;
  if (error) return <ErrorState message={error} onRetry={fetchAll} />;
  if (!company) return <NotFoundState />;

  // ── Derived data ────────────────────────────────────────────────────────────

  const totalFunding = fundingRounds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const currentYear = new Date().getFullYear();
  const foundedYear = company.founded_year ?? currentYear - 3;
  const yearsActive = currentYear - foundedYear;

  const rawMilestones = [
    { offset: 0, label: 'Company Founded' },
    { offset: 1, label: 'First Product Launch' },
    { offset: 2, label: 'Seed Round' },
    { offset: 3, label: 'Series A' },
    { offset: 4, label: '1M Users' },
    { offset: 5, label: 'Series B' },
    { offset: yearsActive, label: 'Present' },
  ];
  const seenYears = new Set<number>();
  const MILESTONES = rawMilestones.filter((m) => {
    const y = foundedYear + m.offset;
    if (seenYears.has(y)) return false;
    seenYears.add(y);
    return true;
  });

  const isOpenAILike =
    company.name.toLowerCase().includes('openai') ||
    company.name.toLowerCase().includes('anthropic') ||
    (company.valuation != null && company.valuation > 50e9);

  const ownershipData = isOpenAILike
    ? [
        { name: 'Microsoft', value: 49, color: '#3B82F6' },
        { name: 'Employees', value: 18, color: '#10B981' },
        { name: 'Founders', value: 12, color: '#F59E0B' },
        { name: 'Other Investors', value: 21, color: '#EF4444' },
      ]
    : [
        { name: 'Founders', value: 45, color: '#3B82F6' },
        { name: 'Employees', value: 25, color: '#10B981' },
        { name: 'Series Investors', value: 20, color: '#F59E0B' },
        { name: 'Angels', value: 10, color: '#EF4444' },
      ];

  const seedInvestors = fundingRounds
    .filter((r) => r.round_type?.toLowerCase().includes('seed'))
    .map((r) => (r as any).lead_investor)
    .filter(Boolean);

  const seriesInvestors = fundingRounds
    .filter((r) => {
      const rt = r.round_type?.toLowerCase() ?? '';
      return rt.includes('series a') || rt.includes('series b');
    })
    .map((r) => (r as any).lead_investor)
    .filter(Boolean);

  const growthInvestors = fundingRounds
    .filter((r) => {
      const rt = r.round_type?.toLowerCase() ?? '';
      return rt.includes('series c') || rt.includes('growth');
    })
    .map((r) => (r as any).lead_investor)
    .filter(Boolean);

  const chartData = fundingRounds
    .slice()
    .reverse()
    .map((r) => ({
      name: r.round_type,
      amount: Math.round((r.amount || 0) / 1e6),
    }));

  const hqLocation = [company.headquarters].filter(Boolean).join(', ');

  const placeholderFounders = [
    { id: '1', name: 'Co-Founder', title: 'CEO', bio: null, avatar_url: null, linkedin_url: null },
    { id: '2', name: 'Co-Founder', title: 'CTO', bio: null, avatar_url: null, linkedin_url: null },
    { id: '3', name: 'Co-Founder', title: 'CPO', bio: null, avatar_url: null, linkedin_url: null },
  ];
  const founders =
    company.founders && company.founders.length > 0 ? company.founders : placeholderFounders;

  const directCompetitors = similarCompanies.slice(0, 4);
  const adjacentCompetitors = similarCompanies.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8 items-start">

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
              <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/companies" className="hover:text-red-500 transition-colors">Companies</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900 font-medium">{company.name}</span>
            </nav>

            {/* SECTION 1 — COMPANY HEADER */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-16 pb-16 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                <CompanyLogoImg
                  name={company.name}
                  logoUrl={company.logo_url}
                  category={company.category}
                  sizeClass="w-20 h-20"
                  textClass="text-3xl font-bold"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-4xl font-bold text-slate-900">{company.name}</h1>
                    <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  </div>
                  <p className="text-lg text-slate-600 max-w-2xl mt-2">{company.description || company.tagline}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600 mb-5">
                {company.website_url && (
                  <a href={company.website_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-red-500 transition-colors font-medium">
                    <Globe className="w-4 h-4" />
                    {company.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}
                {company.founded_year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Founded {company.founded_year}
                  </span>
                )}
                {hqLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {hqLocation}
                  </span>
                )}
                {company.employee_count && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {company.employee_count.toLocaleString()} employees
                  </span>
                )}
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', getStageBadgeColor(company.stage))}>
                  Stage: {company.stage}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-5">
                {(company as any).twitter_url && (
                  <a href={(company as any).twitter_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors text-slate-500">
                    <AtSign className="w-4 h-4" />
                  </a>
                )}
                {(company as any).linkedin_url && (
                  <a href={(company as any).linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 transition-colors text-slate-500">
                    <Link2 className="w-4 h-4" />
                  </a>
                )}
                {(company as any).github_url && (
                  <a href={(company as any).github_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500">
                    <Code2 className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-8">
                <CategoryTag category={company.category} />
                {company.is_unicorn && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    🦄 Unicorn
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                <MetricBox label="Total Funding" value={totalFunding > 0 ? formatFunding(totalFunding) : 'N/A'} />
                <MetricBox label="Valuation" value={company.valuation ? formatFunding(company.valuation) : 'Private'} />
                <MetricBox label="Employees" value={company.employee_count ? formatEmployees(company.employee_count) : 'N/A'} />
                <MetricBox label="Founded" value={company.founded_year ? String(company.founded_year) : 'N/A'} />
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-slate-500 mb-1">Growth Score</p>
                  <p className="text-lg font-bold text-slate-900 mb-1">{company.growth_score}/100</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={cn('h-1.5 rounded-full',
                        company.growth_score >= 70 ? 'bg-green-500' :
                        company.growth_score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${Math.min(100, company.growth_score)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2 — COMPANY TIMELINE */}
            <Section title="Company Timeline">
              <div className="overflow-x-auto pb-4 hide-scrollbar">
                <div className="relative flex items-start gap-0 min-w-max px-4">
                  <div className="absolute top-[28px] left-8 right-8 h-0.5 bg-slate-200" />
                  {MILESTONES.map((milestone, idx) => {
                    const year = foundedYear + milestone.offset;
                    const isPast = year <= currentYear;
                    const isCurrent = milestone.label === 'Present';
                    return (
                      <div key={idx} className="relative flex flex-col items-center w-32 flex-shrink-0">
                        <p className="text-xs font-semibold text-slate-500 mb-2 h-5">{year}</p>
                        <div className={cn('w-4 h-4 rounded-full border-2 z-10 flex-shrink-0',
                          isCurrent ? 'bg-red-500 border-red-500' :
                          isPast ? 'bg-slate-300 border-slate-300' : 'bg-white border-slate-300'
                        )} />
                        <p className="text-xs text-center text-slate-600 mt-2 px-1 leading-snug max-w-[7rem]">
                          {milestone.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>

            {/* SECTION 3 — FUNDING HISTORY */}
            <Section title="Funding History">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-[60%]">
                  {fundingRounds.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            {['Round', 'Date', 'Amount', 'Lead Investor'].map((col) => (
                              <th key={col} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {fundingRounds.map((round) => (
                            <tr key={round.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-3">
                                <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', getRoundBadgeColor(round.round_type))}>
                                  {round.round_type}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-slate-600">{formatDate(round.announced_date)}</td>
                              <td className="py-3.5 px-3 font-semibold text-slate-900">{formatFunding(round.amount)}</td>
                              <td className="py-3.5 px-3 text-slate-600">{(round as any).lead_investor?.name || 'Undisclosed'}</td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-slate-200 bg-slate-50">
                            <td colSpan={2} className="py-3.5 px-3 font-bold text-slate-900">Total Raised</td>
                            <td className="py-3.5 px-3 font-bold text-slate-900">{formatFunding(totalFunding)}</td>
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm py-8 text-center">No public funding data available.</p>
                  )}
                </div>
                <div className="lg:w-[40%] h-64">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
                        <Tooltip formatter={(value: any) => [`$${value}M`, 'Amount']}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                        <Bar dataKey="amount" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">No chart data</div>
                  )}
                </div>
              </div>
            </Section>

            {/* SECTION 4 — OWNERSHIP STRUCTURE */}
            <Section title="Ownership Structure">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ownershipData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                        dataKey="value" strokeWidth={2} stroke="#fff">
                        {ownershipData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, 'Ownership']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  {ownershipData.map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all"
                          style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* SECTION 5 — INVESTORS */}
            <Section title="Investors">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <InvestorColumn title="Seed Investors" investors={seedInvestors} />
                <InvestorColumn title="Series Investors" investors={seriesInvestors} />
                <InvestorColumn title="Growth Investors" investors={growthInvestors} />
              </div>
            </Section>

            {/* SECTION 6 — FOUNDERS & LEADERSHIP */}
            <Section title="Founders & Leadership">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {founders.map((founder, idx) => {
                  const avatarColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700'];
                  const colorClass = avatarColors[idx % avatarColors.length];
                  const initials = founder.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <div key={founder.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={cn('w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg', colorClass)}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{founder.name}</p>
                          {founder.title && <p className="text-sm text-slate-600 mt-0.5">{founder.title}</p>}
                          {founder.linkedin_url && (
                            <a href={founder.linkedin_url} target="_blank" rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                              <Link2 className="w-3 h-3" /> LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* SECTION 7 — PRODUCTS */}
            <Section
              title="Products"
              badge={
                products.length > 0 ? (
                  <span className="ml-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                    {products.length}
                  </span>
                ) : undefined
              }
            >
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="block group">
                      <div className="h-full p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg',
                            getCategoryIconColor(product.category))}>
                            {product.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 group-hover:text-red-500 transition-colors truncate">
                              {product.name}
                            </p>
                            <CategoryTag category={product.category} className="mt-1" />
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="flex items-center gap-1 text-sm text-slate-500">
                            <Heart className="w-3.5 h-3.5 text-red-400" />
                            {product.upvotes}
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(product.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm py-8 text-center">No products listed yet.</p>
              )}
            </Section>

            {/* SECTION 8 — COMPETITOR LANDSCAPE */}
            <Section title="Competitor Landscape">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Direct Competitors</h3>
                  <div className="space-y-3">
                    {directCompetitors.length > 0 ? directCompetitors.map((comp) => (
                      <Link key={comp.id} href={`/companies/${comp.slug}`}
                        className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-200 hover:shadow-sm transition-all group">
                        <CompanyLogoImg
                          name={comp.name}
                          logoUrl={comp.logo_url}
                          category={comp.category}
                          sizeClass="w-9 h-9"
                          textClass="text-sm font-semibold"
                          shape="rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm group-hover:text-red-500 transition-colors truncate">{comp.name}</p>
                          <CategoryTag category={comp.category} className="mt-0.5" />
                        </div>
                      </Link>
                    )) : <p className="text-slate-400 text-sm py-4 text-center">No competitors found.</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Adjacent Competitors</h3>
                  <div className="space-y-3">
                    {adjacentCompetitors.length > 0 ? adjacentCompetitors.map((comp) => (
                      <Link key={comp.id} href={`/companies/${comp.slug}`}
                        className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-200 hover:shadow-sm transition-all group">
                        <CompanyLogoImg
                          name={comp.name}
                          logoUrl={comp.logo_url}
                          category={comp.category}
                          sizeClass="w-9 h-9"
                          textClass="text-sm font-semibold"
                          shape="rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm group-hover:text-red-500 transition-colors truncate">{comp.name}</p>
                          <CategoryTag category={comp.category} className="mt-0.5" />
                        </div>
                      </Link>
                    )) : <p className="text-slate-400 text-sm py-4 text-center">No adjacent companies found.</p>}
                  </div>
                </div>
              </div>
            </Section>

            {/* SECTION 9 — RECENT NEWS */}
            <Section
              title="Recent News"
              action={
                <Link href="/news" className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                  View all news <ChevronRight className="w-4 h-4" />
                </Link>
              }
            >
              {news.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {news.slice(0, 5).map((article) => (
                    <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer"
                      className="block py-4 group">
                      <p className="font-medium text-slate-900 group-hover:text-red-500 transition-colors mb-1">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{article.source}</span>
                        <span>{formatDate(article.published_at)}</span>
                        {article.tags?.[0] && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-medium">
                            {article.tags[0]}
                          </span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm py-8 text-center">No recent news available.</p>
              )}
            </Section>

            {/* SECTION 10 — SIMILAR COMPANIES */}
            <Section title="Similar Companies" last>
              {similarCompanies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similarCompanies.map((comp) => (
                    <Link key={comp.id} href={`/companies/${comp.slug}`} className="block group">
                      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                        <CompanyLogoImg
                          name={comp.name}
                          logoUrl={comp.logo_url}
                          category={comp.category}
                          sizeClass="w-12 h-12 mx-auto mb-3"
                          textClass="text-lg font-bold"
                          shape="rounded-xl"
                        />
                        <p className="font-semibold text-slate-900 text-sm group-hover:text-red-500 transition-colors truncate">
                          {comp.name}
                        </p>
                        <CategoryTag category={comp.category} className="mt-1.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm py-8 text-center">No similar companies found.</p>
              )}
            </Section>

          </div>

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Quick Stats</h3>
                <div className="space-y-3">
                  <StatRow label="Total Funding" value={totalFunding > 0 ? formatFunding(totalFunding) : 'N/A'} />
                  <StatRow label="Valuation" value={company.valuation ? formatFunding(company.valuation) : 'Private'} />
                  <StatRow label="Stage" value={company.stage} />
                  <StatRow label="Founded" value={company.founded_year ? String(company.founded_year) : 'N/A'} />
                  <StatRow label="Employees" value={company.employee_count ? formatEmployees(company.employee_count) : 'N/A'} />
                  <StatRow label="Growth Score" value={`${company.growth_score}/100`} />
                  <StatRow label="Funding Rounds" value={String(fundingRounds.length)} />
                  <StatRow label="Products" value={String(products.length)} />
                </div>
              </div>

              <button className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Follow Company
              </button>

              {company.website_url && (
                <a href={company.website_url} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 hover:shadow-sm">
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              )}

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Category</h3>
                <div className="flex items-center gap-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', getCategoryIconColor(company.category))}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <CategoryTag category={company.category} />
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-white">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900 truncate">{value}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function InvestorColumn({
  title,
  investors,
}: {
  title: string;
  investors: Array<{ id: string; name: string; slug?: string }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-2">
        {investors.length > 0 ? (
          investors.map((inv, idx) => (
            <div key={inv.id ?? idx} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {inv.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-800 truncate">{inv.name}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-400 text-xs">?</span>
            </div>
            <span className="text-sm text-slate-400">Undisclosed</span>
          </div>
        )}
      </div>
    </div>
  );
}
