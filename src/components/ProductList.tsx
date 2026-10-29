import React, { useMemo } from 'react';
import { SlidersHorizontal, X, Search, Sparkles } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  inStockOnly: boolean;
  onInStockToggle: () => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  cart: CartItem[];
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onInStockToggle,
  onViewProduct,
  onAddToCart,
  cart,
}) => {
  const categories = [
    { id: 'all', label: 'All Pieces' },
    { id: 'women', label: 'Women' },
    { id: 'men', label: 'Men' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'bestsellers', label: 'Bestsellers' },
  ];

  // Filtering and Sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory === 'bestsellers') {
      result = result.filter((p) => p.tag === 'Bestseller');
    } else if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter (name, subtitle, description, fabric)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabricDetails.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // In-stock only filter
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  const cartProductIds = useMemo(() => {
    return new Set(cart.map((item) => item.product.id));
  }, [cart]);

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '' || inStockOnly;

  return (
    <section id="shop" className="max-w-[1240px] mx-auto px-6 lg:px-8 py-8 sm:py-14">
      {/* Section Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[44px] text-[#1F3A2D] leading-tight">
            New arrivals
          </h2>
          <p className="text-[#4A5A52] text-base mt-1">
            Log in, add what you love, and check out when you are ready.
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 text-sm text-[#4A5A52]">
          <span>Showing</span>
          <span className="font-semibold text-[#1F2B25]">{filteredProducts.length}</span>
          <span>{filteredProducts.length === 1 ? 'piece' : 'pieces'}</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#E1ECE4]/60 rounded-full border border-[#C9D9CE]/60">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#3F6B52] text-[#FFFFFF] shadow-2xs'
                      : 'text-[#1F3A2D] hover:bg-[#FFFFFF]/70'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Sort & In-stock toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* In-stock toggle */}
            <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1F2B25] cursor-pointer select-none px-3 py-2 bg-white rounded-full border border-[#C9D9CE]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={onInStockToggle}
                className="w-4 h-4 accent-[#3F6B52] rounded"
              />
              <span>In-stock only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[#C9D9CE] text-xs sm:text-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#4A5A52]" />
              <label htmlFor="sort-select" className="sr-only">Sort products</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent outline-none font-medium text-[#1F2B25] cursor-pointer pr-1"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar (if any) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#4A5A52]">
            <span>Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C9D9CE] text-[#1F2B25]">
                Category: <strong className="capitalize">{selectedCategory}</strong>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-red-500"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C9D9CE] text-[#1F2B25]">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:text-red-500"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C9D9CE] text-[#1F2B25]">
                In Stock Only
                <button
                  onClick={onInStockToggle}
                  className="hover:text-red-500"
                  aria-label="Remove in-stock filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
                if (inStockOnly) onInStockToggle();
              }}
              className="text-xs font-medium text-[#3F6B52] underline underline-offset-2 hover:text-[#1F3A2D] ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onViewDetails={onViewProduct}
              onAddToCart={onAddToCart}
              isInCart={cartProductIds.has(p.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty Search / Filter State */
        <div className="py-20 px-6 text-center bg-white rounded-[32px] border border-[#D9E5DC] max-w-md mx-auto my-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#E1ECE4] flex items-center justify-center text-[#3F6B52] mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1F2B25]">No matching pieces</h3>
          <p className="text-sm text-[#4A5A52] mt-2 max-w-xs">
            We couldn&apos;t find any garments matching your current filters. Try relaxing your search terms or view our complete catalog.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
              if (inStockOnly) onInStockToggle();
            }}
            className="mt-6 px-6 py-2.5 bg-[#3F6B52] text-white rounded-full text-sm font-medium hover:bg-[#2F523E] transition-colors"
          >
            Reset all filters
          </button>
        </div>
      )}
    </section>
  );
};
