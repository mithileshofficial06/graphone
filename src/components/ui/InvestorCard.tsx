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
      <div className="h-full p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-base',
              getCategoryLogoColor(sector)
            )}
          >
            {firstLetter}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-red-500 transition-colors">
                {investor.name}
              </h3>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {investor.type}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
              <Building2 className="w-3.5 h-3.5" />
              <span>{investor.portfolio_count} companies</span>
            </div>

            {investor.stage_focus && investor.stage_focus.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {investor.stage_focus.slice(0, 3).map((stage) => (
                  <span
                    key={stage}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                  >
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
