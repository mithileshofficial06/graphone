'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Investor } from '@/types';
import { Building2 } from 'lucide-react';

interface InvestorCardProps {
  investor: Investor;
}

export default function InvestorCard({ investor }: InvestorCardProps) {
  const firstLetter = investor.name.charAt(0).toUpperCase();
  const logoColor = getLogoColor(firstLetter);

  return (
    <Link href={`/investors/${investor.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg cursor-pointer"
      >
        <div className="flex items-start space-x-4">
          {/* Logo */}
          <div
            className={`w-12 h-12 ${logoColor} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white font-bold text-xl">{firstLetter}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{investor.name}</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                {investor.type}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{investor.portfolio_count} companies</span>
              </div>
            </div>

            {investor.stage_focus && investor.stage_focus.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {investor.stage_focus.slice(0, 3).map((stage) => (
                  <span
                    key={stage}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
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

function getLogoColor(letter: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];
  const index = letter.charCodeAt(0) % colors.length;
  return colors[index];
}
