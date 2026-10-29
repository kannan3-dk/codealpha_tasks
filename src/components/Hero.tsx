import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onShopClick: () => void;
  onHowItWorksClick: () => void;
  onProductClick: (product: Product) => void;
  featuredProduct?: Product;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onHowItWorksClick,
  onProductClick,
  featuredProduct,
}) => {
  return (
    <section
      id="top"
      className="max-w-[1240px] mx-auto px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-14"
    >
      {/* Left Column: Headlines & Call to Actions */}
      <div className="flex-1 max-w-xl flex flex-col gap-5 sm:gap-6">
        <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 bg-[#E1ECE4] text-[#2B5240] rounded-full text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Affordable luxury fashion</span>
        </span>

        <h1 className="font-serif font-medium text-5xl sm:text-6xl lg:text-[76px] leading-[1.04] tracking-[-0.5px] text-[#1F3A2D] text-balance">
          Quiet luxury, within reach.
        </h1>

        <p className="text-[#4A5A52] text-lg sm:text-[19px] leading-relaxed max-w-[480px]">
          Thoughtfully made pieces with a premium feel and a price that makes sense. Sign in, fill your
          cart, and check out in minutes.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onShopClick}
            className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-[#3F6B52] text-[#FFFFFF] rounded-full font-medium text-base hover:bg-[#2F523E] transition-all shadow-sm active:scale-95"
          >
            <span>Shop the collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onHowItWorksClick}
            className="inline-flex items-center justify-center min-h-[52px] px-7 bg-[#FFFFFF] text-[#1F3A2D] border border-[#C9D9CE] rounded-full font-medium text-base hover:bg-[#E1ECE4]/40 transition-colors shadow-2xs"
          >
            How it works
          </button>
        </div>

        {/* Quiet Trust Points */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#D9E5DC]">
          <div>
            <p className="text-sm font-semibold text-[#1F3A2D]">100% Normandy</p>
            <p className="text-xs text-[#4A5A52]">Flax & Merino</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1F3A2D]">Free Express</p>
            <p className="text-xs text-[#4A5A52]">On orders over ₹2,999</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1F3A2D]">Easy Returns</p>
            <p className="text-xs text-[#4A5A52]">14-day home pickup</p>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Hero Grid (Matching Reference Aesthetic) */}
      <div className="flex-1 w-full max-w-lg lg:max-w-none grid grid-cols-2 gap-4 h-[380px] sm:h-[430px] lg:h-[460px]">
        {/* Large Left Card */}
        <div
          onClick={() => featuredProduct && onProductClick(featuredProduct)}
          className="relative h-full rounded-[32px] overflow-hidden bg-[#CFE0D3] p-5 flex flex-col justify-between group cursor-pointer border border-[#C9D9CE]/60 transition-transform hover:-translate-y-1 shadow-sm"
        >
          <img
            src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80"
            alt="Linen Overshirt preview"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="relative z-10 self-start">
            <span className="px-3.5 py-1.5 bg-[#FFFFFF]/90 backdrop-blur-xs text-[#2B5240] rounded-full text-xs font-medium shadow-2xs">
              Linen Capsule
            </span>
          </div>
          <div className="relative z-10 bg-gradient-to-t from-[#1F2B25]/80 via-[#1F2B25]/40 to-transparent -mx-5 -mb-5 p-5 pt-8 rounded-b-[32px] text-white">
            <p className="font-serif text-2xl font-medium leading-tight text-white">Linen Overshirt</p>
            <p className="text-xs text-white/80 mt-1">₹3,490 · Normandy Flax</p>
          </div>
        </div>

        {/* Right Stack Cards */}
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 relative rounded-[32px] overflow-hidden bg-[#E1ECE4] p-4 flex flex-col justify-end group cursor-pointer border border-[#C9D9CE]/60 transition-transform hover:-translate-y-0.5">
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80"
              alt="Silk Wrap Dress"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="relative z-10 bg-gradient-to-t from-[#1F2B25]/80 to-transparent -mx-4 -mb-4 p-4 pt-6 rounded-b-[32px] text-white">
              <span className="text-xs uppercase tracking-wider text-white/75 font-medium">Bestseller</span>
              <p className="font-serif text-lg font-medium text-white leading-tight">Silk-Blend Wrap Dress</p>
            </div>
          </div>

          <div
            onClick={onShopClick}
            className="flex-1 relative rounded-[32px] overflow-hidden bg-[#3F6B52] p-5 flex flex-col justify-between text-white group cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <div className="self-end w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#3F6B52] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-[#CFE0D3] font-medium tracking-wide">SPRING / SUMMER</span>
              <p className="font-serif text-2xl font-medium leading-tight mt-0.5">The New Classics</p>
              <p className="text-xs text-white/80 mt-1">16 mindful silhouettes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
