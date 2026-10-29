import React from 'react';

interface FooterProps {
  onOpenOrders: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrders, onNavigateHome }) => {
  return (
    <footer className="border-t border-[#D9E5DC] bg-[#FFFFFF] mt-auto">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-10 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-6">
        {/* Brand */}
        <button
          onClick={() => {
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif text-[26px] font-semibold text-[#1F3A2D] hover:opacity-80 transition-opacity"
        >
          AuraCloth
        </button>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-[15px] text-[#4A5A52]">
          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#1F2B25] transition-colors"
          >
            Shop
          </a>
          <a
            href="#collections"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#1F2B25] transition-colors"
          >
            Collections
          </a>
          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#1F2B25] transition-colors"
          >
            How it works
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#1F2B25] transition-colors"
          >
            About
          </a>
          <button
            onClick={onOpenOrders}
            className="hover:text-[#1F2B25] transition-colors cursor-pointer"
          >
            Order History
          </button>
        </nav>

        {/* Copyright */}
        <span className="text-sm text-[#4A5A52]/80">
          © {new Date().getFullYear()} AuraCloth · All rights reserved.
        </span>
      </div>
    </footer>
  );
};
