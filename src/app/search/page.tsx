'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Building2, Briefcase, TrendingUp, ArrowRight, Sparkles, Home } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Company, Investor, Product } from '@/types';
import { cn, getFallbackLogoUrl } from '@/lib/utils';
import { getCategoryLogoColor } from '@/lib/categoryColors';

interface SearchResults {
  companies: Company[];
  investors: Investor[];
  products: (Product & { company: { name: string; slug: string; logo_url: string | null } })[];
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'companies' | 'products' | 'investors'>('all');

  useEffect(() => {
    setInputVal(query);
    if (query.trim()) {
      fetchResults(query);
    } else {
      setResults(null);
    }
  }, [query]);

  const fetchResults = async (q: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      setResults(data.data || { companies: [], investors: [], products: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  const totalResults = results 
    ? results.companies.length + results.products.length + results.investors.length 
    : 0;

  return (
    <div className="min-h-screen bg-[#f4f0e8] py-12">
      <div className="section-container">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-500 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-slate-800">Search Results</span>
        </div>

        {/* Search Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="section-label mb-4 justify-center">
            <Search className="w-3.5 h-3.5" strokeWidth={3} />
            SEARCH THE AI ECOSYSTEM
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6 leading-none">
            SEARCH RESULTS FOR <span className="gradient-text">&quot;{query}&quot;</span>
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex border-[3px] border-black shadow-[6px_6px_0_#000] bg-white">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search startups, investors, products..."
              className="flex-1 px-4 py-3 bg-white font-bold uppercase text-xs tracking-wider placeholder:text-neutral-500 focus:outline-none"
            />
            <button type="submit" className="btn-primary border-0 shadow-none px-6">
              SEARCH
            </button>
          </form>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchResults(query)} />
        ) : !query.trim() ? (
          <div className="text-center py-20 bg-white border-[3px] border-black shadow-[6px_6px_0_#000]">
            <Search className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-black uppercase tracking-wider">Type a query above</h3>
            <p className="text-xs text-slate-500 mt-2">Enter keywords to search across companies, investors, and products.</p>
          </div>
        ) : results ? (
          <div>
            
            {/* Tab Controls */}
            <div className="flex flex-wrap gap-2 border-b-[3px] border-black pb-4 mb-8">
              {(['all', 'companies', 'products', 'investors'] as const).map((tab) => {
                const counts = {
                  all: totalResults,
                  companies: results.companies.length,
                  products: results.products.length,
                  investors: results.investors.length,
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 text-xs font-black uppercase tracking-wider border-[3px] border-black transition-all",
                      activeTab === tab
                        ? "bg-[#ffe500] shadow-[3px_3px_0_#000] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-white hover:bg-slate-50"
                    )}
                  >
                    {tab} ({counts[tab]})
                  </button>
                );
              })}
            </div>

            {totalResults === 0 ? (
              <div className="text-center py-20 bg-white border-[3px] border-black shadow-[6px_6px_0_#000]">
                <Search className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-wider">No Results Found</h3>
                <p className="text-xs text-slate-500 mt-2">No matching startups, investors, or products found for &quot;{query}&quot;.</p>
              </div>
            ) : (
              <div className="space-y-12">
                
                {/* 1. COMPANIES COLUMN */}
                {(activeTab === 'all' || activeTab === 'companies') && results.companies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Building2 className="w-5 h-5 text-red-500" strokeWidth={3} />
                      <h2 className="text-xl font-black uppercase tracking-wider">Startups ({results.companies.length})</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.companies.map((comp) => {
                        const logoUrl = getFallbackLogoUrl(comp.logo_url);
                        return (
                          <Link
                            key={comp.id}
                            href={`/companies/${comp.slug}`}
                            className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-5 rounded-2xl flex items-start gap-4 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white border-[2px] border-black overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 shadow-[2px_2px_0_#000]">
                              {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <div className={cn("w-full h-full rounded-lg flex items-center justify-center font-bold text-sm", getCategoryLogoColor(comp.category))}>
                                  {comp.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-black text-slate-900 group-hover:text-red-500 transition-colors leading-snug">{comp.name}</h3>
                              <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-200 rounded mt-1">
                                {comp.category}
                              </span>
                              <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2">
                                {comp.tagline || comp.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. PRODUCTS COLUMN */}
                {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-[#0066ff]" strokeWidth={3} />
                      <h2 className="text-xl font-black uppercase tracking-wider">Products ({results.products.length})</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.products.map((prod) => {
                        const logoUrl = getFallbackLogoUrl(prod.company?.logo_url);
                        return (
                          <Link
                            key={prod.id}
                            href={`/companies/${prod.company?.slug}`}
                            className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-5 rounded-2xl flex items-start gap-4 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white border-[2px] border-black overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 shadow-[2px_2px_0_#000]">
                              {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                  {prod.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-black text-slate-900 leading-snug">{prod.name}</h3>
                              <div className="flex gap-2 items-center mt-1 text-[10px] font-bold text-slate-500">
                                <span className="uppercase text-[#0066ff]">By {prod.company?.name}</span>
                                <span>•</span>
                                <span className="uppercase">{prod.category}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2">
                                {prod.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. INVESTORS COLUMN */}
                {(activeTab === 'all' || activeTab === 'investors') && results.investors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Briefcase className="w-5 h-5 text-amber-500" strokeWidth={3} />
                      <h2 className="text-xl font-black uppercase tracking-wider">Investors ({results.investors.length})</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.investors.map((investor) => {
                        const logoUrl = getFallbackLogoUrl(investor.logo_url);
                        return (
                          <Link
                            key={investor.id}
                            href={`/investors/${investor.slug}`}
                            className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-5 rounded-2xl flex items-start gap-4 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white border-[2px] border-black overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 shadow-[2px_2px_0_#000]">
                              {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                                  {investor.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-black text-slate-900 leading-snug">{investor.name}</h3>
                              <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-200 rounded mt-1">
                                {investor.type}
                              </span>
                              <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2">
                                {investor.investment_thesis}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
