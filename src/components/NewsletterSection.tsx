import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

interface NewsletterSectionProps {
  onSubscribed: (email: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onSubscribed }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    onSubscribed(email.trim());
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section className="max-w-[1240px] mx-auto px-6 lg:px-8 pb-14 sm:pb-20">
      <div className="p-8 sm:p-14 bg-[#3F6B52] rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
        {/* Left Copy */}
        <div className="flex-1 max-w-md space-y-2 text-center lg:text-left">
          <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#FFFFFF] leading-tight">
            Join the AuraCloth list
          </h2>
          <p className="text-[#E8F1EA] text-base leading-relaxed">
            Curated seasonal drops and exclusive member benefits, straight to your inbox.
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-auto flex-1 max-w-lg">
          {subscribed ? (
            <div className="flex items-center justify-center lg:justify-start gap-2.5 p-4 bg-white/10 rounded-full text-white text-sm font-medium">
              <Check className="w-5 h-5 text-emerald-300" />
              <span>You have been subscribed! Welcome to the AuraCloth community.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <label htmlFor="nl-email-input" className="sr-only">
                  Email address
                </label>
                <input
                  id="nl-email-input"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[52px] pl-6 pr-4 bg-white text-[#1F2B25] rounded-full text-base outline-none placeholder:text-[#4A5A52]/60 shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="min-h-[52px] px-8 bg-[#1F3A2D] text-white rounded-full text-base font-medium hover:bg-[#15271F] transition-colors shrink-0 shadow-xs"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
