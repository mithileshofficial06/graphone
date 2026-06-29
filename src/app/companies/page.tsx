'use client';

import { useEffect, useState } from 'react';
import { Search, Building2, TrendingUp, Sparkles, Filter } from 'lucide-react';
import CompanyCard from '@/components/ui/CompanyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Company } from '@/types';

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
      if (selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (selectedStage !== 'All') {
        url += `&stage=${encodeURIComponent(selectedStage)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCompanies(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.tagline && c.tagline.toLowerCase().includes(search.toLowerCase())) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f0e8] py-12">
      <div className="section-container">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="section-label mb-4 justify-center">
            <Building2 className="w-3.5 h-3.5" strokeWidth={3} />
            AI COMPANY DIRECTORY
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
            DISCOVER THE LEADING <span className="gradient-text">AI STARTUPS</span>
          </h1>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            Track valuations, funding stages, employee metrics, and growth scores
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white border-[3px] border-black shadow-[6px_6px_0_#000] p-6 mb-8 flex flex-col gap-6">
          
          {/* Top row: Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex border-[3px] border-black bg-white">
              <span className="p-3 text-slate-500 flex items-center justify-center">
                <Search className="w-4 h-4" strokeWidth={3} />
              </span>
              <input
                type="text"
                placeholder="Search companies by name or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2.5 outline-none font-bold uppercase text-xs tracking-wider"
              />
            </div>
            
            <div className="flex border-[3px] border-black bg-white">
              <span className="p-3 text-xs font-black uppercase bg-[#ffe500] border-r-[3px] border-black flex items-center">
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white font-bold uppercase text-xs tracking-widest focus:outline-none cursor-pointer"
              >
                <option value="trending">Growth Score</option>
                <option value="funded">Valuation</option>
                <option value="new">Date Added</option>
              </select>
            </div>
          </div>

          {/* Categories Pill Row */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-[3px] border-black transition-all duration-100 ${
                    selectedCategory === cat
                      ? 'bg-[#ffe500] shadow-[2px_2px_0_#000] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stages Row */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Funding Stage</span>
            <div className="flex flex-wrap gap-2">
              {stages.map(stg => (
                <button
                  key={stg}
                  onClick={() => setSelectedStage(stg)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-[3px] border-black transition-all duration-100 ${
                    selectedStage === stg
                      ? 'bg-[#ff3b30] text-white shadow-[2px_2px_0_#000] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCompanies} />
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-white border-[3px] border-black shadow-[6px_6px_0_#000]">
            <Building2 className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-black uppercase tracking-wider">No Startups Found</h3>
            <p className="text-xs text-slate-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCompanies.map((company, idx) => (
              <div key={company.id} className="border-[3px] border-black shadow-[4px_4px_0_#000] bg-white rounded-xl overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000] transition-all">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
