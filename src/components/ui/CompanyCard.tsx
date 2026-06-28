'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Company } from '@/types';
import CategoryTag from './CategoryTag';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const firstLetter = company.name.charAt(0).toUpperCase();
  const logoColor = getLogoColor(firstLetter);

  return (
    <Link href={`/companies/${company.slug}`}>
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
            <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {company.tagline || company.description}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <CategoryTag category={company.category} />
              {company.valuation && (
                <span className="text-xs text-gray-500">
                  ${formatValuation(company.valuation)} raised
                </span>
              )}
            </div>
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

function formatValuation(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  return `${val}`;
}
