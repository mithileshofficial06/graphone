'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Search, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

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
      const { data, error: sbError } = await supabase.from('news_articles').select('*').order('published_at', { ascending: false });
      if (sbError) throw sbError;
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags || [])));

  const filteredArticles = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.source.toLowerCase().includes(search.toLowerCase());
    const matchTag = !selectedTag || (a.tags && a.tags.includes(selectedTag));
    return matchSearch && matchTag;
  });

  return (
    <div className="page-shell">
      <div className="section-container">
        <PageHeader
          label="AI News"
          icon={Newspaper}
          title={
            <>
              Latest in <span className="gradient-text">artificial intelligence</span>
            </>
          }
          description="Venture funding, product releases, research breakouts, and industry news"
        />

        <div className="filter-panel mb-8 flex flex-col gap-6">
          <div className="search-input-wrap">
            <span className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search news by title, summary, or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={cn('filter-pill', selectedTag === null && 'filter-pill-active')}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn('filter-pill', selectedTag === tag && 'filter-pill-active')}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchNews} />
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <Newspaper className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No stories match</h3>
            <p className="text-sm text-slate-500 mt-2">Try adjusting your keyword or tag filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card card-hover p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center gap-3 mb-4">
                    <span className="tag-pill">{article.source}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2.5 line-clamp-3">{article.summary}</p>
                </div>
                <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1">
                    {article.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
