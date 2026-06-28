'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { ProductWithRelations } from '@/types';

interface ProductCardProps {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                {product.category}
              </span>
              {product.company && (
                <span className="text-xs text-gray-500">
                  by {product.company.name}
                </span>
              )}
            </div>
          </div>

          {/* Upvotes */}
          <div className="flex flex-col items-center ml-4">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="text-sm font-semibold text-gray-900 mt-1">
              {product.upvotes}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
