import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CollectionsSectionProps {
  onSelectCollection: (category: 'all' | 'women' | 'men' | 'accessories') => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ onSelectCollection }) => {
  const collections = [
    {
      id: 'women',
      name: 'Women',
      note: 'Dresses, tops and tailoring',
      bg: '#CFE0D3',
      fg: '#1F3A2D',
      badge: '8 Styles',
      accentImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'men',
      name: 'Men',
      note: 'Shirts, knits and trousers',
      bg: '#3F6B52',
      fg: '#FFFFFF',
      badge: '6 Styles',
      accentImg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'accessories',
      name: 'Accessories',
      note: 'Finishing touches in leather & silk',
      bg: '#E1ECE4',
      fg: '#1F3A2D',
      badge: '4 Styles',
      accentImg: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="collections" className="max-w-[1240px] mx-auto px-6 lg:px-8 py-8 sm:py-14">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[44px] text-[#1F3A2D] leading-tight">
            Shop by collection
          </h2>
          <p className="text-[#4A5A52] text-base mt-1">Carefully edited capsules crafted for longevity.</p>
        </div>
        <button
          onClick={() => {
            onSelectCollection('all');
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-sm sm:text-base font-medium text-[#1F3A2D] hover:text-[#3F6B52] underline underline-offset-4 transition-colors"
        >
          View all pieces
        </button>
      </div>

      {/* Grid of 3 Collections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {collections.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              onSelectCollection(c.id as 'women' | 'men' | 'accessories');
              document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ backgroundColor: c.bg, color: c.fg }}
            className="group relative flex flex-col justify-between min-h-[300px] p-7 rounded-[32px] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-[#C9D9CE]/50 overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-center justify-between relative z-10">
              <span
                style={{
                  backgroundColor: c.fg === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                  color: c.fg === '#FFFFFF' ? '#FFFFFF' : c.fg,
                }}
                className="text-xs font-semibold px-3 py-1 rounded-full shadow-2xs backdrop-blur-xs"
              >
                {c.badge}
              </span>
              <div
                style={{
                  backgroundColor: c.fg === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                  color: c.fg === '#FFFFFF' ? '#FFFFFF' : c.fg,
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
              >
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom info */}
            <div className="relative z-10">
              <h3
                style={{ color: c.fg }}
                className="font-serif text-3xl sm:text-[34px] font-medium leading-tight tracking-tight"
              >
                {c.name}
              </h3>
              <p style={{ color: c.fg }} className="text-sm sm:text-[15px] opacity-90 mt-1">
                {c.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
