'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Landmark, Calendar, Search, TrendingUp, Sparkles, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCategoryLogoColor } from '@/lib/categoryColors';
import { getFallbackLogoUrl, cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

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
  investors: {
    name: string;
    slug: string;
  } | null;
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
          id,
          round_type,
          amount,
          announced_date,
          valuation,
          companies:company_id (name, slug, logo_url, category),
          investors:lead_investor_id (name, slug)
        `)
        .order('announced_date', { ascending: false });

      if (sbError) throw sbError;
      setRounds((data as any) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load funding history');
    } finally {
      setLoading(false);
    }
  };

  const filteredRounds = rounds.filter(r => 
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
    <div className="min-h-screen bg-[#f4f0e8] py-12">
      <div className="section-container">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="section-label mb-4 justify-center">
            <DollarSign className="w-3.5 h-3.5" strokeWidth={3} />
            AI DEALS & FUNDING TRACKER
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
            RECENT AI <span className="gradient-text">VENTURE DEALS</span>
          </h1>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            Monitor real-time funding announcements, valuations, and lead VCs
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#ffe500] border-[3px] border-black shadow-[4px_4px_0_#000] p-6 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 block mb-1">Total Venture Deals Tracker</span>
            <span className="text-3xl font-black">{rounds.length} Announcements</span>
          </div>
          <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-6 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Cumulative Capital Tracked</span>
            <span className="text-3xl font-black text-[#0066ff]">{formatMoney(totalRaised)}</span>
          </div>
          <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-6 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Peak Single Investment</span>
            <span className="text-3xl font-black text-[#ff3b30]">{formatMoney(largestRound)}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-[3px] border-black shadow-[6px_6px_0_#000] p-4 mb-8">
          <div className="flex border-[3px] border-black bg-white">
            <span className="p-3 text-slate-500 flex items-center justify-center">
              <Search className="w-4 h-4" strokeWidth={3} />
            </span>
            <input
              type="text"
              placeholder="Filter deals by company, round, or lead VC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 outline-none font-bold uppercase text-xs tracking-wider"
            />
          </div>
        </div>

        {/* Table/List */}
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFundingRounds} />
        ) : filteredRounds.length === 0 ? (
          <div className="text-center py-20 bg-white border-[3px] border-black shadow-[6px_6px_0_#000]">
            <DollarSign className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-black uppercase tracking-wider">No Deals Recorded</h3>
            <p className="text-xs text-slate-500 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="bg-white border-[3px] border-black shadow-[6px_6px_0_#000] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b-[3px] border-black">
                    <th className="p-4 text-xs font-black uppercase tracking-wider">Company</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider">Round Stage</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider">Capital Raised</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider">Implied Valuation</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider">Lead Investor</th>
                    <th className="p-4 text-xs font-black uppercase tracking-wider">Close Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[2px] divide-slate-200">
                  {filteredRounds.map((round) => {
                    const logoUrl = getFallbackLogoUrl(round.companies?.logo_url);
                    const letter = round.companies?.name.charAt(0).toUpperCase();
                    return (
                      <tr key={round.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <Link href={`/companies/${round.companies?.slug}`} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                              {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <div className={cn("w-full h-full rounded-md flex items-center justify-center font-bold text-xs", getCategoryLogoColor(round.companies?.category))}>
                                  {letter}
                                </div>
                              )}
                            </div>
                            <span className="font-bold text-sm text-slate-800 group-hover:text-red-500 transition-colors">
                              {round.companies?.name}
                            </span>
                          </Link>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 border-[2px] border-black text-[10px] font-black uppercase tracking-wider bg-white rounded-full">
                            {round.round_type}
                          </span>
                        </td>
                        <td className="p-4 font-black text-sm text-slate-800">
                          {formatMoney(round.amount)}
                        </td>
                        <td className="p-4 font-bold text-sm text-slate-600">
                          {round.valuation ? formatMoney(round.valuation) : 'Private'}
                        </td>
                        <td className="p-4">
                          {round.investors ? (
                            <Link href={`/investors/${round.investors.slug}`} className="text-xs font-black uppercase tracking-wider text-slate-800 hover:text-red-500 transition-colors">
                              {round.investors.name}
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Undisclosed</span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-bold text-slate-500">
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
