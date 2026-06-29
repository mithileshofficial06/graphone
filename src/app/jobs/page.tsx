'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Building2, Search, ArrowUpRight, DollarSign, Calendar, Sparkles } from 'lucide-react';
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
  {
    id: '1',
    title: 'Staff Research Scientist (AGI Models)',
    company: 'OpenAI',
    logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
    category: 'AI Research',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$350,000 - $500,000 + Equity',
    posted: '1 day ago',
    tags: ['GPT-5', 'LLMs', 'Reinforcement Learning'],
  },
  {
    id: '2',
    title: 'ML Engineer - Model Alignment',
    company: 'OpenAI',
    logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
    category: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    salary: '$280,000 - $420,000',
    posted: '2 days ago',
    tags: ['RLHF', 'Fine-tuning', 'Python'],
  },
  {
    id: '3',
    title: 'Senior Research Scientist - Interpretability',
    company: 'Anthropic',
    logo: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128',
    category: 'AI Research',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$320,000 - $460,000',
    posted: '3 days ago',
    tags: ['Claude', 'Mechanistic Interpretability', 'PyTorch'],
  },
  {
    id: '4',
    title: 'Founding AI Engineer - Code Synthesis',
    company: 'Cursor (Anysphere)',
    logo: 'https://www.google.com/s2/favicons?domain=cursor.sh&sz=128',
    category: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$220,000 - $350,000 + 1.0% Equity',
    posted: '4 hours ago',
    tags: ['VS Code', 'LLMs', 'Typescript', 'Rust'],
  },
  {
    id: '5',
    title: 'Next.js Framework Architect',
    company: 'Vercel',
    logo: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128',
    category: 'Engineering',
    location: 'Remote (US/Europe)',
    type: 'Full-time',
    salary: '$200,000 - $280,000',
    posted: '5 days ago',
    tags: ['React', 'Next.js', 'Vercel AI SDK'],
  },
  {
    id: '6',
    title: 'Senior Search Infrastructure Engineer',
    company: 'Perplexity AI',
    logo: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128',
    category: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$250,000 - $380,000',
    posted: '1 week ago',
    tags: ['Vector Search', 'Information Retrieval', 'C++'],
  },
  {
    id: '7',
    title: 'Lead Product Designer (AI Search UI)',
    company: 'Perplexity AI',
    logo: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128',
    category: 'Product & Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$180,000 - $260,000',
    posted: '4 days ago',
    tags: ['UI/UX', 'Figma', 'AI Interfaces'],
  },
  {
    id: '8',
    title: 'AI DevRel Advocate',
    company: 'Anthropic',
    logo: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128',
    category: 'Product & Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$160,000 - $240,000',
    posted: '6 days ago',
    tags: ['Developer Relations', 'APIs', 'Claude API'],
  },
];

const categories = ['All', 'Engineering', 'AI Research', 'Product & Design'];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredJobs = mockJobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                        job.company.toLowerCase().includes(search.toLowerCase()) ||
                        job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCat === 'All' || job.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#f4f0e8] py-12">
      <div className="section-container">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="section-label mb-4 justify-center">
            <Briefcase className="w-3.5 h-3.5" strokeWidth={3} />
            AI CAREERS BOARD
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
            BUILD THE FUTURE OF <span className="gradient-text">INTELLIGENCE</span>
          </h1>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            Direct roles with the worlds leading AI frontier labs and infrastructure players
          </p>
        </div>

        {/* Filtering */}
        <div className="bg-white border-[3px] border-black shadow-[6px_6px_0_#000] p-6 mb-8 flex flex-col gap-6">
          <div className="flex border-[3px] border-black bg-white">
            <span className="p-3 text-slate-500 flex items-center justify-center">
              <Search className="w-4 h-4" strokeWidth={3} />
            </span>
            <input
              type="text"
              placeholder="Search jobs by title, company, or tech stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 outline-none font-bold uppercase text-xs tracking-wider"
            />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-[3px] border-black transition-all duration-100",
                    selectedCat === cat
                      ? "bg-[#ffe500] shadow-[2px_2px_0_#000] translate-x-[-1px] translate-y-[-1px]"
                      : "bg-white hover:bg-slate-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white border-[3px] border-black shadow-[6px_6px_0_#000]">
              <Briefcase className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-wider">No Careers Listed</h3>
              <p className="text-xs text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left: Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border-[2px] border-black flex items-center justify-center p-1.5 flex-shrink-0 shadow-[2px_2px_0_#000]">
                    <img src={job.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-snug">{job.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mt-1 uppercase">
                      <span className="flex items-center gap-1 text-[#0066ff]">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#ff3b30]">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salary}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Apply */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t-[2px] md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Category</span>
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-wider rounded text-slate-700">
                      {job.category}
                    </span>
                  </div>
                  
                  <button className="btn-primary flex items-center gap-1 text-xs">
                    APPLY NOW
                    <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
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
