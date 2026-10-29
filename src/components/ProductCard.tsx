import React, { useState } from 'react';
import { Star, Check, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, getDiscountPercentage } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  isInCart = false,
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [justAdded, setJustAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const discount = getDiscountPercentage(product.price, product.originalPrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <article
      onClick={() => onViewDetails(product)}
      className="group flex flex-col gap-3.5 p-3 sm:p-3.5 pb-5 bg-[#FFFFFF] rounded-[28px] border border-[#D9E5DC] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Area */}
      <div
        style={{ backgroundColor: product.bgCard }}
        className="relative h-[280px] sm:h-[300px] rounded-[20px] overflow-hidden flex items-start justify-between p-3.5"
      >
        {imageLoaded && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageLoaded(false)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[#2B5240]/60">
            <span className="font-serif text-2xl font-medium text-[#1F3A2D]">{product.name}</span>
            <span className="text-xs mt-1 uppercase tracking-wider">{product.tag}</span>
          </div>
        )}

        {/* Tag Pill */}
        <span className="relative z-10 px-3 py-1 bg-[#FFFFFF]/95 backdrop-blur-xs text-[#2B5240] rounded-full text-xs font-semibold shadow-2xs">
          {product.tag}
        </span>

        {/* Stock Badge if low */}
        {product.stockQuantity <= 5 && (
          <span className="relative z-10 px-2.5 py-1 bg-[#FEE2E2]/90 backdrop-blur-xs text-[#991B1B] rounded-full text-[11px] font-semibold">
            Only {product.stockQuantity} left
          </span>
        )}

        {/* Quick View Floating Button on Hover */}
        <div className="absolute inset-0 bg-[#1F2B25]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-4 py-2 bg-white/95 text-[#1F2B25] rounded-full text-xs font-medium shadow-md flex items-center gap-1.5 hover:bg-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-2 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-[#4A5A52] mb-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-[#1F2B25]">{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
            <span className="text-slate-300">·</span>
            <span className="capitalize">{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-[17px] text-[#1F2B25] group-hover:text-[#3F6B52] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Subtitle preview */}
          <p className="text-xs text-[#4A5A52] line-clamp-1 mt-0.5">{product.subtitle}</p>
        </div>

        {/* Price & Discount */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-[17px] font-semibold text-[#1F2B25] tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-xs text-[#4A5A52]/70 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-[#3F6B52]">
                ({discount}% off)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Button matching Reference Styling */}
      <div className="px-2 pt-1">
        <button
          onClick={handleQuickAdd}
          style={{
            backgroundColor: justAdded || isInCart ? '#3F6B52' : '#FFFFFF',
            color: justAdded || isInCart ? '#FFFFFF' : '#3F6B52',
            borderColor: '#3F6B52',
          }}
          className="w-full min-h-[46px] border rounded-full text-[15px] font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-[#3F6B52] hover:text-white active:scale-98 shadow-xs"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Added to Cart ✓</span>
            </>
          ) : isInCart ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>In Cart · Add More</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to cart</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
