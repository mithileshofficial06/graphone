'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCategoryLogoColor } from '@/lib/categoryColors';
import { getFallbackLogoUrl, cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import PageHeader from '@/components/layout/PageHeader';

interface FundingRound {
  id: string;
  round_type: string;
  amount: number;
  announced_date: string;
  valuation: number | null;
  companies: {
    name: string;
    slug: string;
    logo_url: string | null;
    category: string;
  };
  investors: { name: string; slug: string } | null;
}

export default function FundingPage() {
  const [rounds, setRounds] = useState<FundingRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFundingRounds();
  }, []);

  const fetchFundingRounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from('funding_rounds')
        .select(`
          id, round_type, amount, announced_date, valuation,
          companies:company_id (name, slug, logo_url, category),
          investors:lead_investor_id (name, slug)
        `)
        .order('announced_date', { ascending: false });
      if (sbError) throw sbError;
      setRounds((data as unknown as FundingRound[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load funding history');
    } finally {
      setLoading(false);
    }
  };

  const filteredRounds = rounds.filter(
    (r) =>
      r.companies?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.round_type.toLowerCase().includes(search.toLowerCase()) ||
      (r.investors?.name && r.investors.name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRaised = rounds.reduce((sum, r) => sum + (r.amount || 0), 0);
  const largestRound = rounds.reduce((max, r) => (r.amount > max ? r.amount : max), 0);

  const formatMoney = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="page-shell">
      <div className="section-container">
        <PageHeader
          label="AI Deals & Funding"
          icon={DollarSign}
          title={
            <>
              Recent AI <span className="gradient-text">venture deals</span>
            </>
          }
          description="Monitor funding announcements, valuations, and lead VCs"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="stat-card-accent stat-card">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total deals tracked</span>
            <span className="text-3xl font-bold text-slate-900">{rounds.length}</span>
          </div>
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Cumulative capital</span>
            <span className="text-3xl font-bold text-rose-600">{formatMoney(totalRaised)}</span>
          </div>
          <div className="stat-card">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Largest single round</span>
            <span className="text-3xl font-bold text-orange-600">{formatMoney(largestRound)}</span>
          </div>
        </div>

        <div className="filter-panel mb-8">
          <div className="search-input-wrap">
            <span className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Filter by company, round, or lead VC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFundingRounds} />
        ) : filteredRounds.length === 0 ? (
          <div className="empty-state">
            <DollarSign className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No deals recorded</h3>
            <p className="text-sm text-slate-500 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Company', 'Round', 'Raised', 'Valuation', 'Lead Investor', 'Date'].map((col) => (
                      <th key={col} className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRounds.map((round) => {
                    const logoUrl = getFallbackLogoUrl(round.companies?.logo_url);
                    const letter = round.companies?.name.charAt(0).toUpperCase();
                    return (
                      <tr key={round.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <Link href={`/companies/${round.companies?.slug}`} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                              {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <div className={cn('w-full h-full rounded-md flex items-center justify-center font-bold text-xs', getCategoryLogoColor(round.companies?.category))}>
                                  {letter}
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-sm text-slate-800 group-hover:text-rose-600 transition-colors">
                              {round.companies?.name}
                            </span>
                          </Link>
                        </td>
                        <td className="p-4">
                          <span className="tag-pill">{round.round_type}</span>
                        </td>
                        <td className="p-4 font-semibold text-sm text-slate-800">{formatMoney(round.amount)}</td>
                        <td className="p-4 text-sm text-slate-600">
                          {round.valuation ? formatMoney(round.valuation) : 'Private'}
                        </td>
                        <td className="p-4">
                          {round.investors ? (
                            <Link href={`/investors/${round.investors.slug}`} className="link-accent text-xs">
                              {round.investors.name}
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-400">Undisclosed</span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-slate-500">
                          {new Date(round.announced_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
