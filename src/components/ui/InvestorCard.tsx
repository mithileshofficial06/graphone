'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Investor } from '@/types';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestorCardProps {
  investor: Investor;
}

const logoGradients = [
  'from-indigo-500 to-violet-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
];

function getLogoGradient(letter: string): string {
  return logoGradients[letter.charCodeAt(0) % logoGradients.length];
}

export default function InvestorCard({ investor }: InvestorCardProps) {
  const firstLetter = investor.name.charAt(0).toUpperCase();

  return (
    <Link href={`/investors/${investor.slug}`}>
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
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate tracking-tight">
                {investor.name}
              </h3>
              <span className="px-2 py-0.5 bg-white/[0.06] text-zinc-400 text-xs rounded-md border border-white/[0.06]">
                {investor.type}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-sm text-zinc-500">
              <Building2 className="w-3.5 h-3.5" />
              <span>{investor.portfolio_count} companies</span>
            </div>

            {investor.stage_focus && investor.stage_focus.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {investor.stage_focus.slice(0, 3).map((stage) => (
                  <span
                    key={stage}
                    className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-xs rounded-md border border-indigo-500/20"
                  >
                    {stage}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
