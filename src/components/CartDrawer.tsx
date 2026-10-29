import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice, validatePromoCode, PromoResult } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string | null) => void;
  onStartShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onStartShopping,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Promo calculation
  let discountAmount = 0;
  let hasFreeShippingCoupon = false;

  if (appliedPromo) {
    const promoCheck: PromoResult = validatePromoCode(appliedPromo, subtotal);
    if (promoCheck.valid) {
      if (promoCheck.discountPercentage) {
        discountAmount = Math.round((subtotal * promoCheck.discountPercentage) / 100);
      }
      if (promoCheck.freeShipping) {
        hasFreeShippingCoupon = true;
      }
    }
  }

  // Shipping rule: Free above ₹2,999, otherwise ₹199 (unless coupon applied)
  const freeShippingThreshold = 2999;
  const standardShippingFee = 199;
  const isFreeShipping = subtotal >= freeShippingThreshold || hasFreeShippingCoupon;
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : standardShippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const res = validatePromoCode(promoInput, subtotal);
    if (!res.valid) {
      setPromoError(res.message);
      return;
    }
    onApplyPromo(res.code);
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setPromoError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#1F2B25]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] shadow-2xl flex flex-col justify-between border-l border-[#C9D9CE] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#D9E5DC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#3F6B52]" />
              <h2 className="font-serif text-2xl font-medium text-[#1F3A2D]">Shopping Bag</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E1ECE4] text-[#2B5240] text-xs font-semibold">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F6F8F4] flex items-center justify-center text-[#4A5A52] hover:text-[#1F2B25] hover:bg-[#E1ECE4] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-[#F6F8F4] border-b border-[#D9E5DC]">
              {isFreeShipping ? (
                <div className="flex items-center gap-2 text-xs font-medium text-[#2B5240]">
                  <Sparkles className="w-3.5 h-3.5 text-[#3F6B52]" />
                  <span>Congratulations! You qualify for Free Express Shipping.</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-xs text-[#4A5A52] mb-1.5">
                    <span>
                      Add <strong className="text-[#1F2B25]">{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>Free Delivery</strong>
                    </span>
                    <span className="tabular-nums font-semibold">{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#D9E5DC] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${freeShippingProgress}%` }}
                      className="h-full bg-[#3F6B52] transition-all duration-300"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-[#F6F8F4]/60 border border-[#D9E5DC] transition-all"
                >
                  {/* Thumbnail */}
                  <div
                    style={{ backgroundColor: item.product.bgCard }}
                    className="w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-[#D9E5DC] relative"
                  >
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        Aura
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#1F2B25] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#4A5A52]/60 hover:text-red-500 p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#4A5A52] mt-0.5">
                        Size: {item.size} · Color: {item.color}
                      </p>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-white border border-[#C9D9CE] rounded-full">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-[#4A5A52] hover:text-[#1F2B25]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity}
                          className="w-7 h-7 flex items-center justify-center text-xs text-[#4A5A52] hover:text-[#1F2B25] disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#1F2B25] tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Cart State */
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#E1ECE4] flex items-center justify-center text-[#3F6B52] mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1F2B25]">Your bag is empty</h3>
                <p className="text-sm text-[#4A5A52] mt-1.5 max-w-xs">
                  Discover our quiet luxury collection and choose timeless garments made to last.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onStartShopping();
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#3F6B52] text-white rounded-full text-sm font-medium hover:bg-[#2F523E] transition-all shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            )}

            {/* Clear Cart Trigger */}
            {cart.length > 0 && (
              <div className="pt-2 text-right">
                {showClearConfirm ? (
                  <div className="inline-flex items-center gap-2 p-2 bg-red-50 rounded-xl border border-red-200 text-xs">
                    <span className="text-red-700">Clear all items?</span>
                    <button
                      onClick={() => {
                        onClearCart();
                        setShowClearConfirm(false);
                      }}
                      className="px-2.5 py-1 bg-red-600 text-white rounded-md font-medium"
                    >
                      Yes, clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1 text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-xs text-[#4A5A52] hover:text-red-600 transition-colors underline"
                  >
                    Clear shopping bag
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#D9E5DC] bg-[#FFFFFF] space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#E1ECE4] border border-[#C9D9CE] rounded-xl text-xs text-[#2B5240]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#3F6B52]" />
                      <span>
                        Promo applied: <strong>{appliedPromo}</strong>
                      </span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. AURA10)"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError('');
                        }}
                        className="w-full px-3.5 py-2 border border-[#C9D9CE] rounded-xl text-xs outline-none focus:border-[#3F6B52] uppercase placeholder:normal-case"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!promoInput.trim()}
                      className="px-4 py-2 bg-[#1F3A2D] text-white rounded-xl text-xs font-medium disabled:opacity-40"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
                {!appliedPromo && !promoError && (
                  <p className="text-[11px] text-[#4A5A52] mt-1">
                    Demo tip: Use <strong>AURA10</strong> for 10% off or <strong>FREESHIP</strong>.
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#4A5A52]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#1F2B25] tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#3F6B52]">
                    <span>Discount Applied</span>
                    <span className="font-semibold tabular-nums">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="tabular-nums font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-[#3F6B52]">Free</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[#1F2B25] pt-2 border-t border-[#D9E5DC]">
                  <span className="font-serif">Final Total</span>
                  <span className="font-serif tabular-nums text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full min-h-[50px] bg-[#3F6B52] text-white rounded-full font-medium text-sm hover:bg-[#2F523E] transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#4A5A52]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3F6B52]" />
                  <span>Simulated frontend order processing · No card charge</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
