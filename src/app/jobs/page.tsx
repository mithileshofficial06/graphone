'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Building2, Search, ArrowUpRight, DollarSign } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  category: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  tags: string[];
}

const mockJobs: Job[] = [
  { id: '1', title: 'Staff Research Scientist (AGI Models)', company: 'OpenAI', logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', category: 'AI Research', location: 'San Francisco, CA', type: 'Full-time', salary: '$350,000 - $500,000 + Equity', posted: '1 day ago', tags: ['GPT-5', 'LLMs', 'Reinforcement Learning'] },
  { id: '2', title: 'ML Engineer - Model Alignment', company: 'OpenAI', logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', category: 'Engineering', location: 'San Francisco, CA (Hybrid)', type: 'Full-time', salary: '$280,000 - $420,000', posted: '2 days ago', tags: ['RLHF', 'Fine-tuning', 'Python'] },
  { id: '3', title: 'Senior Research Scientist - Interpretability', company: 'Anthropic', logo: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128', category: 'AI Research', location: 'San Francisco, CA', type: 'Full-time', salary: '$320,000 - $460,000', posted: '3 days ago', tags: ['Claude', 'Mechanistic Interpretability', 'PyTorch'] },
  { id: '4', title: 'Founding AI Engineer - Code Synthesis', company: 'Cursor (Anysphere)', logo: 'https://www.google.com/s2/favicons?domain=cursor.sh&sz=128', category: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', salary: '$220,000 - $350,000 + 1.0% Equity', posted: '4 hours ago', tags: ['VS Code', 'LLMs', 'Typescript', 'Rust'] },
  { id: '5', title: 'Next.js Framework Architect', company: 'Vercel', logo: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128', category: 'Engineering', location: 'Remote (US/Europe)', type: 'Full-time', salary: '$200,000 - $280,000', posted: '5 days ago', tags: ['React', 'Next.js', 'Vercel AI SDK'] },
  { id: '6', title: 'Senior Search Infrastructure Engineer', company: 'Perplexity AI', logo: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128', category: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', salary: '$250,000 - $380,000', posted: '1 week ago', tags: ['Vector Search', 'Information Retrieval', 'C++'] },
  { id: '7', title: 'Lead Product Designer (AI Search UI)', company: 'Perplexity AI', logo: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128', category: 'Product & Design', location: 'San Francisco, CA', type: 'Full-time', salary: '$180,000 - $260,000', posted: '4 days ago', tags: ['UI/UX', 'Figma', 'AI Interfaces'] },
  { id: '8', title: 'AI DevRel Advocate', company: 'Anthropic', logo: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128', category: 'Product & Design', location: 'San Francisco, CA', type: 'Full-time', salary: '$160,000 - $240,000', posted: '6 days ago', tags: ['Developer Relations', 'APIs', 'Claude API'] },
];

const categories = ['All', 'Engineering', 'AI Research', 'Product & Design'];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredJobs = mockJobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCat === 'All' || job.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-shell">
      <div className="section-container">
        <PageHeader
          label="AI Careers"
          icon={Briefcase}
          title={
            <>
              Build the future of <span className="gradient-text">intelligence</span>
            </>
          }
          description="Direct roles with the world's leading AI frontier labs and infrastructure players"
        />

        <div className="filter-panel mb-8 flex flex-col gap-6">
          <div className="search-input-wrap">
            <span className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search jobs by title, company, or tech stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={cn('filter-pill', selectedCat === cat && 'filter-pill-active')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">No careers listed</h3>
              <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="surface-card card-hover p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 flex-shrink-0">
                    <img src={job.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 leading-snug">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1 text-rose-600 font-medium">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.map((tag) => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <span className="tag-pill">{job.category}</span>
                  <button className="btn-primary text-sm">
                    Apply
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
