import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, Package, LogOut, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  user: UserProfile | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenOrders: () => void;
  onSelectCategory?: (category: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  user,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onOpenOrders,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#F6F8F4]/95 backdrop-blur-md border-b border-[#D9E5DC]/80 transition-all">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => {
              onNavigateHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left font-serif text-[30px] lg:text-[34px] font-semibold tracking-[0.5px] text-[#1F3A2D] hover:opacity-90 transition-opacity"
          >
            AuraCloth
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[16px] font-medium text-[#1F2B25]">
          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              onSelectCategory?.('all');
              const el = document.getElementById('shop');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#3F6B52] transition-colors py-1"
          >
            Shop
          </a>
          <a
            href="#collections"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              const el = document.getElementById('collections');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#3F6B52] transition-colors py-1"
          >
            Collections
          </a>
          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              const el = document.getElementById('how');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#3F6B52] transition-colors py-1"
          >
            How it works
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#3F6B52] transition-colors py-1"
          >
            About
          </a>
          <button
            onClick={onOpenOrders}
            className="hover:text-[#3F6B52] transition-colors py-1 font-medium flex items-center gap-1.5"
          >
            <Package className="w-4 h-4 text-[#3F6B52]" />
            <span>My Orders</span>
          </button>
        </nav>

        {/* Right Actions: Search, Account, Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Search Toggle / Input */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-[#FFFFFF] border border-[#C9D9CE] rounded-full px-3 py-1.5 shadow-sm transition-all animate-in fade-in duration-200">
                <Search className="w-4 h-4 text-[#4A5A52] shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search linen, dresses..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-32 sm:w-48 text-sm bg-transparent outline-none text-[#1F2B25] placeholder:text-[#4A5A52]/60"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    if (searchQuery) onSearchChange('');
                  }}
                  className="p-0.5 text-[#4A5A52] hover:text-[#1F2B25]"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#C9D9CE] text-[#1F3A2D] hover:bg-[#E1ECE4]/50 transition-colors"
                aria-label="Open product search"
                title="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Account Button / Dropdown */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 min-h-[44px] px-3.5 sm:px-4 py-2 bg-[#FFFFFF] border border-[#C9D9CE] text-[#1F3A2D] rounded-full text-sm font-medium hover:bg-[#E1ECE4]/40 transition-colors shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E1ECE4] flex items-center justify-center text-xs font-semibold text-[#1F3A2D]">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#4A5A52]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#FFFFFF] border border-[#C9D9CE] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-[#D9E5DC]">
                      <p className="text-xs text-[#4A5A52]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#1F3A2D] truncate">{user.fullName}</p>
                      <p className="text-xs text-[#4A5A52] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#1F2B25] hover:bg-[#F6F8F4] flex items-center gap-2 transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#3F6B52]" />
                      <span>Order History</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#B91C1C] hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-[#D9E5DC]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 min-h-[44px] px-4 py-2 border border-[#C9D9CE] bg-[#FFFFFF] text-[#1F3A2D] rounded-full text-sm font-medium hover:bg-[#E1ECE4]/40 transition-colors shadow-xs"
              >
                <User className="w-4 h-4 text-[#1F3A2D]" />
                <span className="hidden sm:inline">Log in</span>
              </button>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label={`Open shopping cart containing ${cartCount} items`}
            className="flex items-center gap-2 min-h-[44px] px-4 sm:px-5 py-2 bg-[#3F6B52] text-[#FFFFFF] rounded-full text-sm font-medium hover:bg-[#2F523E] transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Cart ({cartCount})</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#C9D9CE] text-[#1F3A2D]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#C9D9CE] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile search bar */}
          <div className="flex items-center bg-[#F6F8F4] border border-[#C9D9CE] rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-[#4A5A52] shrink-0 mr-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-sm bg-transparent outline-none text-[#1F2B25]"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="p-1">
                <X className="w-3.5 h-3.5 text-[#4A5A52]" />
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-3 text-base font-medium text-[#1F2B25] pt-2">
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigateHome();
                onSelectCategory?.('all');
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2 px-3 rounded-xl hover:bg-[#F6F8F4] transition-colors"
            >
              Shop All Products
            </a>
            <a
              href="#collections"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigateHome();
                document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2 px-3 rounded-xl hover:bg-[#F6F8F4] transition-colors"
            >
              Curated Collections
            </a>
            <a
              href="#how"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigateHome();
                document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2 px-3 rounded-xl hover:bg-[#F6F8F4] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigateHome();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2 px-3 rounded-xl hover:bg-[#F6F8F4] transition-colors"
            >
              Brand Story
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrders();
              }}
              className="w-full text-left py-2 px-3 rounded-xl hover:bg-[#F6F8F4] transition-colors flex items-center justify-between"
            >
              <span>My Orders</span>
              <Package className="w-4 h-4 text-[#3F6B52]" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
