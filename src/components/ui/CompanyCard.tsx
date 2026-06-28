'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Company } from '@/types';
import { cn } from '@/lib/utils';
import { getCategoryLogoColor } from '@/lib/categoryColors';
import CategoryTag from './CategoryTag';
import TrendingBadge from './TrendingBadge';

interface CompanyCardProps {
  company: Company;
  variant?: 'default' | 'featured' | 'compact';
  rank?: number;
}

function formatValuation(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  return `${val}`;
}

function formatViews(count: number): string {
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M views`;
  if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K views`;
  return `${count} views`;
}

function CompanyLogo({ company, size = 'md' }: { company: Company; size?: 'sm' | 'md' | 'lg' }) {
  const letter = company.name.charAt(0).toUpperCase();
  const sizeClass = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-12 h-12 text-lg',
  }[size];

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0 font-semibold',
        sizeClass,
        getCategoryLogoColor(company.category)
      )}
    >
      {letter}
    </div>
  );
}

export default function CompanyCard({ company, variant = 'default', rank }: CompanyCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/companies/${company.slug}`} className="block h-full group">
        <div className="relative h-full min-h-[220px] bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {rank !== undefined && (
            <div className="absolute top-4 right-4 z-10">
              <TrendingBadge rank={rank} />
            </div>
          )}
          <div className="relative h-full flex flex-col justify-end p-5">
            <div className="mb-3">
              <CompanyLogo company={company} size="lg" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-1">{company.name}</h3>
            <p className="text-sm text-gray-300 line-clamp-2 mb-3">
              {company.tagline || company.description}
            </p>
            <CategoryTag category={company.category} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/companies/${company.slug}`} className="block group">
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CompanyLogo company={company} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-red-500 transition-colors">
              {company.name}
            </h3>
            <CategoryTag category={company.category} className="mt-1" />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatViews(company.view_count)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/companies/${company.slug}`} className="block h-full group">
      <div className="h-full p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start gap-4">
          <CompanyLogo company={company} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-red-500 transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {company.tagline || company.description}
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <CategoryTag category={company.category} />
              {company.valuation && (
                <span className="text-xs text-gray-500 font-medium">
                  ${formatValuation(company.valuation)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
