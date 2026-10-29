import React from 'react';
import { ArrowRight, Leaf, Shield, Award } from 'lucide-react';

interface AboutSectionProps {
  onStartShopping: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onStartShopping }) => {
  return (
    <section
      id="about"
      className="max-w-[1240px] mx-auto px-6 lg:px-8 py-10 sm:py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
    >
      {/* Left Visual Area */}
      <div className="flex-1 w-full max-w-lg lg:max-w-none h-[360px] sm:h-[400px] rounded-[40px] overflow-hidden bg-[#CFE0D3] relative flex items-end p-6 border border-[#C9D9CE]/60 shadow-xs">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80"
          alt="AuraCloth Brand Editorial"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        <div className="relative z-10 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-full text-xs font-semibold text-[#2B5240] shadow-sm">
          Atelier Craftsmanship · Founded in 2024
        </div>
      </div>

      {/* Right Story Description */}
      <div className="flex-1 max-w-xl flex flex-col gap-5">
        <span className="text-xs uppercase tracking-widest text-[#3F6B52] font-semibold">
          Our Philosophy
        </span>

        <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[44px] text-[#1F3A2D] leading-[1.1]">
          Luxury should feel easy.
        </h2>

        <p className="text-[#4A5A52] text-base sm:text-lg leading-relaxed">
          AuraCloth brings the tactile depth and architectural silhouette of bespoke atelier fashion
          into daily wardrobes—without inflated brand markups or transient trend cycles.
        </p>

        <p className="text-[#4A5A52] text-sm sm:text-base leading-relaxed">
          We work exclusively with certified European flax mills, cruelty-free silk cultivators, and
          recycled extrafine merino spinners. Every piece is constructed with double-folded French
          seams, reinforced button shanks, and breathable natural linings designed to endure for seasons
          to come.
        </p>

        {/* Value Badges */}
        <div className="grid grid-cols-3 gap-3 py-2 border-y border-[#D9E5DC] text-xs text-[#1F2B25]">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#3F6B52] shrink-0" />
            <span className="font-medium">100% Organic Fibers</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#3F6B52] shrink-0" />
            <span className="font-medium">Direct-to-Consumer</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#3F6B52] shrink-0" />
            <span className="font-medium">Heirloom Quality</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onStartShopping}
            className="self-start inline-flex items-center gap-2 min-h-[48px] px-8 bg-[#3F6B52] text-[#FFFFFF] rounded-full font-medium text-base hover:bg-[#2F523E] transition-all shadow-sm active:scale-95"
          >
            <span>Start shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
