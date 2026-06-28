'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Heart, MessageSquare, Home, Building2, TrendingUp, Briefcase, Newspaper, Plus } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { ProductWithRelations } from '@/types';

const categories = ['All', 'Chat', 'Code', 'Agents', 'Image', 'Video', 'Voice', 'Productivity', 'More'];

const mostSearched = ['ChatGPT', 'Claude', 'Midjourney', 'Cursor', 'Perplexity'];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = activeCategory === 'All'
        ? '/api/products?sort=popular&limit=20'
        : `/api/products?category=${encodeURIComponent(activeCategory)}&sort=popular&limit=20`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchProducts} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
          <nav className="p-6 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Building2 className="w-5 h-5" />
              <span>AI Startups</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium"
            >
              <TrendingUp className="w-5 h-5" />
              <span>AI Products</span>
            </Link>
            <Link
              href="/investors"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Briefcase className="w-5 h-5" />
              <span>Investors</span>
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/news"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Newspaper className="w-5 h-5" />
              <span>News</span>
            </Link>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium">
                <Plus className="w-5 h-5" />
                <span>Submit Startup</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium mt-1">
                <Plus className="w-5 h-5" />
                <span>Submit Product</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                The Global Intelligence Layer for AI
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover the best AI products, tools, and applications
              </p>

              {/* Search */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Search AI products..."
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center gap-2">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Most Searched */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Most searched:</span>
                {mostSearched.map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full hover:border-red-500 hover:text-red-500 text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection of the Week */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  Collection of the Week
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Top AI Coding Assistants</h2>
              <p className="text-white text-opacity-90 mb-4">
                The best AI tools to supercharge your development workflow
              </p>
              <button className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-medium">
                Explore Collection →
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Popular Right Now */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Right Now</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {products.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex-shrink-0 w-32 text-center"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-4xl">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Product List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option>Most upvoted</option>
                  <option>Newest</option>
                  <option>Most discussed</option>
                </select>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          <button className="p-2 hover:bg-red-50 rounded-lg">
                            <Heart className="w-6 h-6 text-red-500" />
                          </button>
                          <span className="text-sm font-semibold text-gray-900">
                            {product.upvotes}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                href={`/products/${product.slug}`}
                                className="text-xl font-semibold text-gray-900 hover:text-red-500"
                              >
                                {product.name}
                              </Link>
                              <p className="text-gray-600 mt-1">{product.description}</p>
                              <div className="flex items-center gap-3 mt-3">
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                                  {product.category}
                                </span>
                                {product.company && (
                                  <span className="text-sm text-gray-500">
                                    by {product.company.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{Math.floor(Math.random() * 50) + 10}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 bg-white border-l border-gray-200 p-6 sticky top-16 h-screen overflow-y-auto">
          {/* Product of the Day */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Product of the Day</h3>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">ChatGPT Plus</h4>
              <p className="text-sm text-gray-600 mb-3">
                Advanced AI assistant with faster response times
              </p>
              <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm">
                Learn More
              </button>
            </div>
          </div>

          {/* Trending Searches */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Searches</h3>
            <div className="space-y-2">
              {['AI coding', 'Image generation', 'Voice cloning', 'Video editing', 'Text to speech'].map((search) => (
                <button
                  key={search}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <h3 className="font-bold mb-2">Weekly AI Digest</h3>
            <p className="text-sm text-gray-300 mb-4">
              Get the best AI products delivered to your inbox
            </p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm mb-2"
            />
            <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm">
              Subscribe
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
