'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Company } from '@/types';
import CategoryTag from './CategoryTag';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: Company;
}

const logoGradients = [
  'from-indigo-500 to-violet-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-fuchsia-500 to-purple-600',
];

function getLogoGradient(letter: string): string {
  return logoGradients[letter.charCodeAt(0) % logoGradients.length];
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const firstLetter = company.name.charAt(0).toUpperCase();

  return (
    <Link href={`/companies/${company.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="surface-card p-5 card-hover cursor-pointer h-full"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
              getLogoGradient(firstLetter)
            )}
          >
            <span className="text-white font-semibold text-lg">{firstLetter}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate tracking-tight">
              {company.name}
            </h3>
            <p className="text-sm text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
              {company.tagline || company.description}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <CategoryTag category={company.category} />
              {company.valuation && (
                <span className="text-xs text-zinc-600 font-mono">
                  ${formatValuation(company.valuation)}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function formatValuation(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  return `${val}`;
}
