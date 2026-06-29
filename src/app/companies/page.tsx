'use client';

import { useEffect, useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import CompanyCard from '@/components/ui/CompanyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import PageHeader from '@/components/layout/PageHeader';
import { Company } from '@/types';
import { cn } from '@/lib/utils';

const categories = ['All', 'AI Agents', 'AI Coding', 'AI Search', 'AI Video', 'AI Voice', 'AI Infrastructure', 'Healthcare AI', 'Robotics'];
const stages = ['All', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Growth', 'Public', 'Bootstrapped'];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [sortBy, setSortBy] = useState('trending');

  useEffect(() => {
    fetchCompanies();
  }, [selectedCategory, selectedStage, sortBy]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/companies?limit=40&sort=${sortBy}`;
      if (selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedStage !== 'All') url += `&stage=${encodeURIComponent(selectedStage)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCompanies(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.tagline && c.tagline.toLowerCase().includes(search.toLowerCase())) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-shell">
      <div className="section-container">
        <PageHeader
          label="AI Company Directory"
          icon={Building2}
          title={
            <>
              Discover the leading <span className="gradient-text">AI startups</span>
            </>
          }
          description="Track valuations, funding stages, employee metrics, and growth scores"
        />

        <div className="filter-panel mb-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 search-input-wrap">
              <span className="pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search companies by name or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="trending">Sort: Growth Score</option>
              <option value="funded">Sort: Valuation</option>
              <option value="new">Sort: Date Added</option>
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn('filter-pill', selectedCategory === cat && 'filter-pill-active')}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Funding Stage</span>
            <div className="flex flex-wrap gap-2">
              {stages.map((stg) => (
                <button
                  key={stg}
                  onClick={() => setSelectedStage(stg)}
                  className={cn('filter-pill', selectedStage === stg && 'filter-pill-active')}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCompanies} />
        ) : filteredCompanies.length === 0 ? (
          <div className="empty-state">
            <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No startups found</h3>
            <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
