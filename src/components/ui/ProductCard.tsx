'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ProductWithRelations } from '@/types';

interface ProductCardProps {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="surface-card p-5 card-hover cursor-pointer h-full group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground tracking-tight group-hover:text-indigo-300 transition-colors">
                {product.name}
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <p className="text-sm text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="px-2 py-0.5 bg-violet-500/10 text-violet-300 text-xs rounded-md border border-violet-500/20">
                {product.category}
              </span>
              {product.company && (
                <span className="text-xs text-zinc-600">
                  by {product.company.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center min-w-[48px] px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <span className="text-sm font-semibold text-foreground font-mono">
              {product.upvotes}
            </span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider">votes</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
