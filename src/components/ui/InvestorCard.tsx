'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { Investor } from '@/types';
import { cn } from '@/lib/utils';
import { getCategoryLogoColor } from '@/lib/categoryColors';

interface InvestorCardProps {
  investor: Investor;
}

export default function InvestorCard({ investor }: InvestorCardProps) {
  const firstLetter = investor.name.charAt(0).toUpperCase();
  const sector = investor.sector_focus?.[0] ?? 'AI Infrastructure';

  return (
    <Link href={`/investors/${investor.slug}`} className="block h-full group">
      <div className="h-full p-5 surface-card card-hover">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-base',
              getCategoryLogoColor(sector)
            )}
          >
            {firstLetter}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 truncate group-hover:text-rose-600 transition-colors">
                {investor.name}
              </h3>
              <span className="tag-pill">{investor.type}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
              <Building2 className="w-3.5 h-3.5" />
              <span>{investor.portfolio_count} companies</span>
            </div>

            {investor.stage_focus && investor.stage_focus.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {investor.stage_focus.slice(0, 3).map((stage) => (
                  <span key={stage} className="tag-pill">
                    {stage}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
