'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ProductWithRelations } from '@/types';
import { cn } from '@/lib/utils';
import { getCategoryLogoColor } from '@/lib/categoryColors';

interface ProductCardProps {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstLetter = product.name.charAt(0).toUpperCase();

  return (
    <Link href={`/products/${product.slug}`} className="block h-full group">
      <div className="h-full p-5 surface-card card-hover">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-base',
                getCategoryLogoColor(product.category)
              )}
            >
              {firstLetter}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                  {product.name}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mt-1">{product.description}</p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="tag-pill">{product.category}</span>
                {product.company && (
                  <span className="text-xs text-slate-500">by {product.company.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center min-w-[52px] px-2 py-2 bg-rose-50 border border-rose-100 rounded-xl">
            <span className="text-sm font-semibold text-rose-600">{product.upvotes}</span>
            <span className="text-[10px] font-medium text-rose-500">votes</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
