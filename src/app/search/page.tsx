'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Building2, Briefcase, TrendingUp, Home } from 'lucide-react';
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

function ResultCard({
  href,
  logo,
  title,
  badge,
  description,
}: {
  href: string;
  logo: React.ReactNode;
  title: string;
  badge: string;
  description?: string | null;
}) {
  return (
    <Link href={href} className="surface-card card-hover p-5 flex items-start gap-4 group">
      {logo}
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
          {title}
        </h3>
        <span className="tag-pill mt-1.5">{badge}</span>
        {description && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{description}</p>
        )}
      </div>
    </Link>
  );
}

function LogoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
      {children}
    </div>
  );
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
    if (query.trim()) fetchResults(query);
    else setResults(null);
  }, [query]);

  const fetchResults = async (q: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.data || { companies: [], investors: [], products: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
  };

  const totalResults = results
    ? results.companies.length + results.products.length + results.investors.length
    : 0;

  const tabs = ['all', 'companies', 'products', 'investors'] as const;
  const counts = results
    ? {
        all: totalResults,
        companies: results.companies.length,
        products: results.products.length,
        investors: results.investors.length,
      }
    : null;

  return (
    <div className="page-shell">
      <div className="section-container">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="link-accent flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-slate-700">Search</span>
        </div>

        <div className="mb-10 text-center max-w-3xl mx-auto">
          <p className="section-label mb-3 justify-center">
            <Search className="w-3.5 h-3.5" />
            Search the AI ecosystem
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            {query ? (
              <>
                Results for <span className="gradient-text">&quot;{query}&quot;</span>
              </>
            ) : (
              <>Search <span className="gradient-text">AI companies</span></>
            )}
          </h1>

          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto gradient-border flex items-center px-2 py-2 shadow-lg shadow-slate-900/[0.04]">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search startups, investors, products..."
              className="flex-1 px-3 py-2.5 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchResults(query)} />
        ) : !query.trim() ? (
          <div className="empty-state">
            <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">Type a query above</h3>
            <p className="text-sm text-slate-500 mt-2">Search across companies, investors, and products.</p>
          </div>
        ) : results ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn('filter-pill capitalize', activeTab === tab && 'filter-pill-active')}
                >
                  {tab} ({counts?.[tab] ?? 0})
                </button>
              ))}
            </div>

            {totalResults === 0 ? (
              <div className="empty-state">
                <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">No results found</h3>
                <p className="text-sm text-slate-500 mt-2">No matches for &quot;{query}&quot;.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {(activeTab === 'all' || activeTab === 'companies') && results.companies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Building2 className="w-5 h-5 text-rose-500" />
                      <h2 className="section-title text-xl">Startups ({results.companies.length})</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.companies.map((comp) => {
                        const logoUrl = getFallbackLogoUrl(comp.logo_url);
                        return (
                          <ResultCard
                            key={comp.id}
                            href={`/companies/${comp.slug}`}
                            title={comp.name}
                            badge={comp.category}
                            description={comp.tagline || comp.description}
                            logo={
                              <LogoBox>
                                {logoUrl ? (
                                  <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                                ) : (
                                  <div className={cn('w-full h-full rounded-lg flex items-center justify-center font-bold text-sm', getCategoryLogoColor(comp.category))}>
                                    {comp.name.charAt(0)}
                                  </div>
                                )}
                              </LogoBox>
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-rose-500" />
                      <h2 className="section-title text-xl">Products ({results.products.length})</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.products.map((prod) => {
                        const logoUrl = getFallbackLogoUrl(prod.company?.logo_url);
                        return (
                          <ResultCard
                            key={prod.id}
                            href={`/companies/${prod.company?.slug}`}
                            title={prod.name}
                            badge={prod.category}
                            description={prod.description}
                            logo={
                              <LogoBox>
                                {logoUrl ? (
                                  <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                                ) : (
                                  <div className="w-full h-full rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                    {prod.name.charAt(0)}
                                  </div>
                                )}
                              </LogoBox>
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'investors') && results.investors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Briefcase className="w-5 h-5 text-rose-500" />
                      <h2 className="section-title text-xl">Investors ({results.investors.length})</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.investors.map((investor) => {
                        const logoUrl = getFallbackLogoUrl(investor.logo_url);
                        return (
                          <ResultCard
                            key={investor.id}
                            href={`/investors/${investor.slug}`}
                            title={investor.name}
                            badge={investor.type}
                            description={investor.investment_thesis}
                            logo={
                              <LogoBox>
                                {logoUrl ? (
                                  <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                                ) : (
                                  <div className="w-full h-full rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                                    {investor.name.charAt(0)}
                                  </div>
                                )}
                              </LogoBox>
                            }
                          />
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
    <Suspense fallback={<LoadingSpinner />}>
      <SearchResultsContent />
    </Suspense>
  );
}
