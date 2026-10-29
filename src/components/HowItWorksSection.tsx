import React from 'react';

interface HowItWorksSectionProps {
  onLoginClick: () => void;
  onBrowseClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onLoginClick,
  onBrowseClick,
}) => {
  const steps = [
    {
      n: '1',
      title: 'Log in',
      text: 'Create an account or sign in to keep your cart and orders in one place.',
      actionLabel: 'Sign in / Join',
      action: onLoginClick,
    },
    {
      n: '2',
      title: 'Add to cart',
      text: 'Browse the collections and save your favourite pieces to your cart.',
      actionLabel: 'Browse items',
      action: onBrowseClick,
    },
    {
      n: '3',
      title: 'Check out',
      text: 'Review your order, simulate checkout securely and we take care of the rest.',
      actionLabel: 'Learn more',
      action: onBrowseClick,
    },
  ];

  return (
    <section id="how" className="max-w-[1240px] mx-auto px-6 lg:px-8 py-8 sm:py-14">
      <div className="p-8 sm:p-14 bg-[#E1ECE4] rounded-[40px] flex flex-col gap-10 border border-[#C9D9CE]/50 shadow-2xs">
        <div>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[44px] text-[#1F3A2D] leading-tight">
            Simple from start to finish
          </h2>
          <p className="text-[#4A5A52] text-base mt-1">
            Intuitive, transparent, and built with quiet luxury refinement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex flex-col justify-between gap-5 p-7 bg-[#FFFFFF] rounded-[28px] border border-[#D9E5DC] shadow-xs"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#3F6B52] text-[#FFFFFF] font-serif font-semibold text-lg">
                  {s.n}
                </span>
                <h3 className="text-xl sm:text-[21px] font-medium text-[#1F3A2D]">
                  {s.title}
                </h3>
                <p className="text-[#4A5A52] text-[15px] leading-relaxed">
                  {s.text}
                </p>
              </div>

              <button
                onClick={s.action}
                className="self-start text-xs font-semibold text-[#3F6B52] hover:text-[#1F2B25] underline underline-offset-4 transition-colors"
              >
                {s.actionLabel} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
