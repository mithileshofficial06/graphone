'use client';

import Link from 'next/link';
import { Company } from '@/types';
import { cn, getFallbackLogoUrl } from '@/lib/utils';
import { getCategoryLogoColor } from '@/lib/categoryColors';
import CategoryTag from './CategoryTag';
import TrendingBadge from './TrendingBadge';

interface TrendingCompanyCardProps {
  company: Company;
  rank: number;
}

function formatValuation(val: number): string {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val}`;
}

function CompanyLogo({ company }: { company: Company }) {
  const letter = company.name.charAt(0).toUpperCase();
  const logoUrl = getFallbackLogoUrl(company.logo_url);

  if (logoUrl) {
    return (
      <div className="relative w-12 h-12 flex-shrink-0">
        <img
          src={logoUrl}
          alt={`${company.name} logo`}
          className="w-12 h-12 rounded-xl object-contain bg-white p-1.5"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById(`trending-logo-${company.id}`);
            if (fallback) fallback.classList.remove('hidden');
          }}
        />
        <div
          id={`trending-logo-${company.id}`}
          className={cn(
            'hidden absolute inset-0 w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg',
            getCategoryLogoColor(company.category)
          )}
        >
          {letter}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg flex-shrink-0',
        getCategoryLogoColor(company.category)
      )}
    >
      {letter}
    </div>
  );
}

export default function TrendingCompanyCard({ company, rank }: TrendingCompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`} className="block h-full group">
      <article className="relative flex flex-col h-full min-h-[300px] bg-[#0F172A] rounded-2xl p-5 overflow-hidden transition-colors duration-200 hover:bg-[#1a2332]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

        <div className="relative flex justify-between items-start gap-2">
          <CompanyLogo company={company} />
          <TrendingBadge rank={rank} variant="dark" />
        </div>

        <div className="relative flex-1 min-h-[2rem]" />

        <div className="relative mt-auto">
          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-red-50 transition-colors">
            {company.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
            {company.tagline || company.description}
          </p>
          <div className="flex items-center justify-between gap-2 mt-4">
            <CategoryTag category={company.category} />
            {company.valuation != null && company.valuation > 0 && (
              <span className="text-sm font-semibold text-white flex-shrink-0">
                {formatValuation(company.valuation)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
