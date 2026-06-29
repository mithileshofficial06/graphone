'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Calendar, Search, ArrowUpRight, Sparkles, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  tags: string[];
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (sbError) throw sbError;
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || [])));

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.summary.toLowerCase().includes(search.toLowerCase()) ||
                        a.source.toLowerCase().includes(search.toLowerCase());
    const matchTag = !selectedTag || (a.tags && a.tags.includes(selectedTag));
    return matchSearch && matchTag;
  });

  return (
    <div className="min-h-screen bg-[#f4f0e8] py-12">
      <div className="section-container">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="section-label mb-4 justify-center">
            <Newspaper className="w-3.5 h-3.5" strokeWidth={3} />
            AI NEWS AGGREGATOR
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
            LATEST IN <span className="gradient-text">ARTIFICIAL INTELLIGENCE</span>
          </h1>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            Venture funding, product releases, research breakouts, and business restructuring
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border-[3px] border-black shadow-[6px_6px_0_#000] p-6 mb-8 flex flex-col gap-6">
          <div className="flex border-[3px] border-black bg-white">
            <span className="p-3 text-slate-500 flex items-center justify-center">
              <Search className="w-4 h-4" strokeWidth={3} />
            </span>
            <input
              type="text"
              placeholder="Search news stories by title, summary, or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 outline-none font-bold uppercase text-xs tracking-wider"
            />
          </div>

          {allTags.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Filter by Tag</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-[3px] border-black transition-all duration-100 ${
                    selectedTag === null
                      ? 'bg-[#ffe500] shadow-[2px_2px_0_#000] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-[3px] border-black transition-all duration-100 ${
                      selectedTag === tag
                        ? 'bg-[#ffe500] shadow-[2px_2px_0_#000] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchNews} />
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white border-[3px] border-black shadow-[6px_6px_0_#000]">
            <Newspaper className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-black uppercase tracking-wider">No Stories Match</h3>
            <p className="text-xs text-slate-500 mt-2">Try adjusting your keyword or tag filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6 rounded-2xl flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-center gap-3 mb-4">
                    <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-black uppercase tracking-wider text-slate-700">
                      {article.source}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900 group-hover:text-red-500 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2.5">
                    {article.summary}
                  </p>
                </div>

                <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1">
                    {article.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-wider text-[#0066ff] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={3} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
