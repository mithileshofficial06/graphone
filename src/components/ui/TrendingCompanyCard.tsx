'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Company } from '@/types';
import { cn, getFallbackLogoUrl } from '@/lib/utils';
import { getCategoryLogoColor, getCategoryTagColor } from '@/lib/categoryColors';
import CategoryTag from './CategoryTag';

interface TrendingCompanyCardProps {
  company: Company;
  rank: number;
}

function formatValuation(val: number): string {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

function getRankBadgeStyles(rank: number): { container: string; dot: string; label: string } {
  switch (rank) {
    case 1:
      return {
        container: 'bg-amber-50 text-amber-700 border-amber-200/60 shadow-sm shadow-amber-100/50',
        dot: 'bg-amber-500 animate-pulse',
        label: 'Gold #1',
      };
    case 2:
      return {
        container: 'bg-slate-100 text-slate-700 border-slate-200/60',
        dot: 'bg-slate-400',
        label: 'Silver #2',
      };
    case 3:
      return {
        container: 'bg-orange-50 text-orange-700 border-orange-200/60',
        dot: 'bg-orange-400',
        label: 'Bronze #3',
      };
    default:
      return {
        container: 'bg-slate-50 text-slate-500 border-slate-200/40',
        dot: 'bg-slate-300',
        label: `#${rank}`,
      };
  }
}

function getCategoryHoverGlow(category: string): string {
  const map: Record<string, string> = {
    'AI Agents': 'hover:border-purple-200 hover:shadow-purple-500/[0.04]',
    'AI Coding': 'hover:border-blue-200 hover:shadow-blue-500/[0.04]',
    'AI Search': 'hover:border-emerald-200 hover:shadow-emerald-500/[0.04]',
    'AI Video': 'hover:border-pink-200 hover:shadow-pink-500/[0.04]',
    'AI Voice': 'hover:border-orange-200 hover:shadow-orange-500/[0.04]',
    'AI Infrastructure': 'hover:border-slate-300 hover:shadow-slate-500/[0.04]',
    'Healthcare AI': 'hover:border-red-200 hover:shadow-red-500/[0.04]',
    'Robotics': 'hover:border-amber-200 hover:shadow-amber-500/[0.04]',
  };
  return map[category] ?? 'hover:border-red-200 hover:shadow-red-500/[0.04]';
}

function CompanyLogo({ company }: { company: Company }) {
  const letter = company.name.charAt(0).toUpperCase();
  const logoUrl = getFallbackLogoUrl(company.logo_url);
  const [imgFailed, setImgFailed] = useState(false);

  if (logoUrl && !imgFailed) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm shadow-slate-100 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 flex-shrink-0">
        <img
          src={logoUrl}
          alt={`${company.name} logo`}
          className="w-full h-full object-contain"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-300',
        getCategoryLogoColor(company.category)
      )}
    >
      {letter}
    </div>
  );
}

export default function TrendingCompanyCard({ company, rank }: TrendingCompanyCardProps) {
  const badge = getRankBadgeStyles(rank);
  const glowClass = getCategoryHoverGlow(company.category);

  return (
    <Link href={`/companies/${company.slug}`} className="block h-full group">
      <article
        className={cn(
          'flex flex-col h-full min-h-[280px] bg-white border border-slate-100 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl',
          glowClass
        )}
      >
        {/* Top Header Row */}
        <div className="flex justify-between items-center gap-3">
          <CompanyLogo company={company} />
          <span
            className={cn(
              'inline-flex items-center gap-1.5 border text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-colors duration-300',
              badge.container
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', badge.dot)} />
            {badge.label}
          </span>
        </div>

        {/* Title & Tagline */}
        <div className="mt-5 flex-1 flex flex-col justify-start">
          <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-red-500 transition-colors duration-200">
            {company.name}
          </h3>
          <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">
            {company.tagline || company.description}
          </p>
        </div>

        {/* Footer Metrics Row */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-50">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
              Valuation
            </span>
            <span className="text-sm font-bold text-slate-800">
              {company.valuation != null && company.valuation > 0
                ? formatValuation(company.valuation)
                : 'Private'}
            </span>
          </div>
          <CategoryTag category={company.category} />
        </div>
      </article>
    </Link>
  );
}

