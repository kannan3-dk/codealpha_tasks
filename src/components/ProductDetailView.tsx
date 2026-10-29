import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Check,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  X,
} from 'lucide-react';
import { Product, Review } from '../types';
import { formatPrice, getDiscountPercentage, formatDate } from '../utils/formatters';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: string, quantity: number) => void;
  onViewProduct: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onBuyNow,
  onViewProduct,
  onAddReview,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  const discount = getDiscountPercentage(product.price, product.originalPrice);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= product.stockQuantity) {
      setQuantity(next);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    onAddReview(product.id, {
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      verified: true,
    });

    setReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  return (
    <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Breadcrumb & Back Button */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#4A5A52] mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-medium text-[#1F3A2D] hover:text-[#3F6B52] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
        <span aria-hidden="true">/</span>
        <span className="capitalize">{product.category}</span>
        <span aria-hidden="true">/</span>
        <span className="text-[#1F2B25] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Large Image */}
          <div
            style={{ backgroundColor: product.bgCard }}
            className="relative aspect-4/3 sm:aspect-1/1 w-full rounded-[32px] overflow-hidden border border-[#D9E5DC] shadow-xs"
          >
            {product.images[selectedImageIndex] ? (
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.name} gallery image ${selectedImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-[#2B5240]/40">
                {product.name}
              </div>
            )}

            {/* Tag Badge */}
            <span className="absolute top-5 left-5 px-3.5 py-1.5 bg-white/95 backdrop-blur-xs text-[#2B5240] rounded-full text-xs font-semibold shadow-xs">
              {product.tag}
            </span>
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#3F6B52] ring-2 ring-[#3F6B52]/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Purchase Module (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            {/* Rating summary */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating) ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1F2B25]">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-[#4A5A52]">
                ({product.reviewCount} customer reviews)
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1F3A2D] leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-[#4A5A52] mt-1.5 leading-relaxed">{product.subtitle}</p>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-serif text-3xl font-semibold text-[#1F2B25] tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-[#4A5A52]/70 line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E1ECE4] text-[#2B5240]">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#4A5A52] mt-0.5">Inclusive of all duties and standard taxes.</p>
          </div>

          <hr className="border-[#D9E5DC]" />

          {/* Color Selector */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2.5">
              <span className="text-[#4A5A52]">Color:</span>
              <span className="font-medium text-[#1F2B25]">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`relative p-1 rounded-full border-2 transition-all ${
                    selectedColor === c.name ? 'border-[#3F6B52] scale-105' : 'border-transparent'
                  }`}
                  title={c.name}
                >
                  <span
                    style={{ backgroundColor: c.hex }}
                    className="block w-7 h-7 rounded-full border border-black/10 shadow-2xs"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2.5">
              <span className="text-[#4A5A52]">Select Size:</span>
              <span className="font-medium text-[#1F2B25]">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[48px] h-11 px-4 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#1F3A2D] text-[#FFFFFF] shadow-2xs'
                        : 'bg-white border border-[#C9D9CE] text-[#1F2B25] hover:border-[#3F6B52]'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Stock Availability */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#4A5A52] mb-1.5">Quantity</span>
              <div className="flex items-center bg-white border border-[#C9D9CE] rounded-full p-1">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-[#F6F8F4] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-9 text-center text-sm font-medium tabular-nums">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockQuantity}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-[#F6F8F4] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="text-right">
              {product.stockQuantity <= 5 ? (
                <p className="text-xs font-semibold text-[#B91C1C] flex items-center gap-1 justify-end">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Only {product.stockQuantity} pieces left
                </p>
              ) : (
                <p className="text-xs font-semibold text-[#2B5240] flex items-center gap-1 justify-end">
                  <Check className="w-3.5 h-3.5 text-[#3F6B52]" />
                  In Stock · Ready to dispatch
                </p>
              )}
              <p className="text-[11px] text-[#4A5A52] mt-0.5">SKU: {product.sku}</p>
            </div>
          </div>

          {/* Action CTAs: Add to Cart and Buy Now */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
              className="w-full min-h-[52px] bg-[#3F6B52] text-[#FFFFFF] rounded-full font-medium text-base hover:bg-[#2F523E] transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Add to Cart · {formatPrice(product.price * quantity)}</span>
            </button>
            <button
              onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
              className="w-full min-h-[52px] bg-[#1F3A2D] text-[#FFFFFF] rounded-full font-medium text-base hover:bg-[#13231B] transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Buy Now (Instant Checkout)</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#FFFFFF] border border-[#D9E5DC] rounded-2xl p-4 flex flex-col gap-3 text-xs text-[#4A5A52]">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#3F6B52] shrink-0" />
              <span>Free express shipping on all orders above ₹2,999.</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-[#3F6B52] shrink-0" />
              <span>14-day hassle-free door returns and size exchanges.</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#3F6B52] shrink-0" />
              <span>Certified authentic sustainable textiles & European flax.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Fabric & Care, Customer Reviews */}
      <div className="mt-16 pt-8 border-t border-[#D9E5DC]">
        {/* Tab Headers */}
        <div className="flex items-center gap-6 border-b border-[#D9E5DC] pb-3 text-sm font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'details' ? 'text-[#1F3A2D] font-semibold' : 'text-[#4A5A52] hover:text-[#1F2B25]'
            }`}
          >
            Product Story & Fit
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F6B52]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'care' ? 'text-[#1F3A2D] font-semibold' : 'text-[#4A5A52] hover:text-[#1F2B25]'
            }`}
          >
            Fabric & Sustainable Care
            {activeTab === 'care' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F6B52]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'reviews' ? 'text-[#1F3A2D] font-semibold' : 'text-[#4A5A52] hover:text-[#1F2B25]'
            }`}
          >
            Verified Reviews ({product.reviews.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3F6B52]" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'details' && (
            <div className="max-w-2xl text-[#1F2B25] text-base leading-relaxed space-y-4">
              <p>{product.description}</p>
              <div className="pt-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#4A5A52] mb-1">
                  Fit & Measurements
                </h4>
                <p className="text-sm text-[#4A5A52]">{product.fitCare}</p>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="max-w-2xl space-y-4 text-sm text-[#1F2B25]">
              <div>
                <h4 className="font-semibold text-base text-[#1F3A2D] mb-1">Material Composition</h4>
                <p className="text-[#4A5A52] leading-relaxed">{product.fabricDetails}</p>
              </div>
              <div className="pt-2">
                <h4 className="font-semibold text-base text-[#1F3A2D] mb-1">Care & Longevity</h4>
                <p className="text-[#4A5A52] leading-relaxed">{product.fitCare}</p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D9E5DC]">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-[#1F3A2D]">Client Feedback</h3>
                  <p className="text-xs text-[#4A5A52]">
                    Average {product.rating} out of 5 based on verified member purchases
                  </p>
                </div>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-5 py-2.5 bg-white border border-[#C9D9CE] rounded-full text-xs font-semibold text-[#1F3A2D] hover:bg-[#E1ECE4] transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white rounded-2xl border border-[#D9E5DC] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#4A5A52]">{formatDate(rev.date)}</span>
                    </div>
                    <p className="text-sm text-[#1F2B25] leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="font-semibold text-[#1F3A2D]">{rev.author}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#3F6B52] bg-[#E1ECE4] px-2 py-0.5 rounded-full font-medium">
                          <Check className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#D9E5DC]">
          <h2 className="font-serif text-3xl font-medium text-[#1F3A2D] mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onViewDetails={onViewProduct}
                onAddToCart={(p, s, c) => onAddToCart(p, s, c, 1)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Submission Modal Dialog */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F2B25]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#D9E5DC] space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-medium text-[#1F3A2D]">Leave a Review</h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#E1ECE4] flex items-center justify-center text-[#1F3A2D] hover:bg-[#CFE0D3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A5A52] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanya M."
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#C9D9CE] rounded-xl text-sm outline-none focus:border-[#3F6B52]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5A52] mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating
                            ? 'text-amber-500 fill-current'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#4A5A52] ml-2">{newReviewRating} stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5A52] mb-1">Your Review</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your thoughts on the fabric, tailoring, and fit..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#C9D9CE] rounded-xl text-sm outline-none focus:border-[#3F6B52] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-[#4A5A52] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3F6B52] text-white rounded-full text-sm font-medium hover:bg-[#2F523E]"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
