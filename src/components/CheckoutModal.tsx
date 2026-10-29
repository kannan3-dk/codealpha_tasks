import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CartItem, ShippingDetails, Order, UserProfile } from '../types';
import { formatPrice, validatePromoCode } from '../utils/formatters';
import { savePurchasesToSupabase } from '../utils/supabasePurchases';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: UserProfile | null;
  appliedPromo: string | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  appliedPromo,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '42 Heritage Lane, Green Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({});

  if (!isOpen) return null;

  // Totals calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  let hasFreeShippingCoupon = false;

  if (appliedPromo) {
    const promoCheck = validatePromoCode(appliedPromo, subtotal);
    if (promoCheck.valid) {
      if (promoCheck.discountPercentage) {
        discountAmount = Math.round((subtotal * promoCheck.discountPercentage) / 100);
      }
      if (promoCheck.freeShipping) {
        hasFreeShippingCoupon = true;
      }
    }
  }

  const freeShippingThreshold = 2999;
  const isFreeShipping = subtotal >= freeShippingThreshold || hasFreeShippingCoupon;
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 199;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingDetails, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State is required.';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'PIN/Postal code is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    const orderId = `AC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Compute estimated delivery date (4 business days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newOrder: Order = {
      orderId,
      createdAt: new Date().toISOString(),
      items: [...cart],
      customer: { ...formData },
      paymentMethod,
      subtotal,
      discount: discountAmount,
      discountCode: appliedPromo || undefined,
      shippingFee,
      total,
      status: 'Confirmed',
      estimatedDelivery,
    };

    // Save customer purchase information to Supabase
    await savePurchasesToSupabase(orderId, cart, formData, paymentMethod);

    setIsSubmitting(false);
    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F2B25]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#C9D9CE] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#D9E5DC] flex items-center justify-between bg-[#F6F8F4]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 text-[#4A5A52] hover:text-[#1F2B25] rounded-full"
              aria-label="Back to store"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#1F3A2D]">Simulated Checkout</h2>
              <p className="text-xs text-[#4A5A52]">Secure frontend order demonstration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4A5A52] hover:bg-[#E1ECE4]"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form (7 cols) */}
          <form id="checkout-form" onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Demo Notice Banner */}
            <div className="p-3.5 bg-[#E1ECE4] border border-[#C9D9CE] rounded-2xl flex items-start gap-2.5 text-xs text-[#2B5240]">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#3F6B52]" />
              <div>
                <strong>Demonstration Mode:</strong> No actual payment, card charge, or shipping will take
                place. Enter sample contact information to test order generation.
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#1F3A2D] flex items-center gap-2">
                <span>1. Shipping & Contact Information</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A5A52] mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanya Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-[#C9D9CE] focus:border-[#3F6B52]'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A5A52] mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sanya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                        errors.email ? 'border-red-500 bg-red-50/30' : 'border-[#C9D9CE] focus:border-[#3F6B52]'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A5A52] mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                        errors.phone ? 'border-red-500 bg-red-50/30' : 'border-[#C9D9CE] focus:border-[#3F6B52]'
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A5A52] mb-1">
                    Street Address & Apartment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apartment, suite, building, street"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      errors.address ? 'border-red-500 bg-red-50/30' : 'border-[#C9D9CE] focus:border-[#3F6B52]'
                    }`}
                  />
                  {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A5A52] mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C9D9CE] rounded-xl text-sm outline-none focus:border-[#3F6B52]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4A5A52] mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C9D9CE] rounded-xl text-sm outline-none focus:border-[#3F6B52]"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-[#4A5A52] mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C9D9CE] rounded-xl text-sm outline-none focus:border-[#3F6B52]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 pt-2 border-t border-[#D9E5DC]">
              <h3 className="font-serif text-xl font-medium text-[#1F3A2D]">
                2. Select Simulated Payment Option
              </h3>

              <div className="space-y-2.5">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#3F6B52] bg-[#E1ECE4]/40 shadow-xs'
                      : 'border-[#C9D9CE] hover:bg-[#F6F8F4]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 accent-[#3F6B52]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#3F6B52]" />
                      <span className="text-sm font-semibold text-[#1F2B25]">
                        Simulated UPI / QR Code
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#3F6B52] bg-[#E1ECE4] px-1.5 py-0.5 rounded">
                        Fastest
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5A52] mt-0.5">
                      Instant demo simulation for GPay, PhonePe, or BHIM UPI.
                    </p>
                  </div>
                </label>

                {/* Card Option */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#3F6B52] bg-[#E1ECE4]/40 shadow-xs'
                      : 'border-[#C9D9CE] hover:bg-[#F6F8F4]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 accent-[#3F6B52]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#3F6B52]" />
                      <span className="text-sm font-semibold text-[#1F2B25]">
                        Simulated Credit / Debit Card
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5A52] mt-0.5">
                      Test card pre-configured. Never enter real financial credentials.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#3F6B52] bg-[#E1ECE4]/40 shadow-xs'
                      : 'border-[#C9D9CE] hover:bg-[#F6F8F4]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#3F6B52]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#3F6B52]" />
                      <span className="text-sm font-semibold text-[#1F2B25]">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5A52] mt-0.5">
                      Simulate paying with cash or UPI at the doorstep upon arrival.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </form>

          {/* Right Order Summary (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#F6F8F4] p-5 rounded-2xl border border-[#D9E5DC]">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#1F3A2D] pb-2 border-b border-[#D9E5DC]">
                Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List Mini */}
              <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-12 object-cover rounded-lg shrink-0 border border-[#D9E5DC]"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-[#1F2B25] truncate">{item.product.name}</p>
                        <p className="text-[#4A5A52]">
                          Qty: {item.quantity} · {item.size} / {item.color}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#1F2B25] tabular-nums shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-3 border-t border-[#D9E5DC] space-y-1.5 text-xs text-[#4A5A52]">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-medium text-[#1F2B25] tabular-nums">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#3F6B52]">
                    <span>Coupon Discount</span>
                    <span className="font-medium tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="font-medium tabular-nums">
                    {shippingFee === 0 ? <span className="text-[#3F6B52]">Free</span> : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[#1F2B25] pt-2 border-t border-[#D9E5DC]">
                  <span className="font-serif">Final Payable</span>
                  <span className="font-serif tabular-nums text-xl text-[#1F3A2D]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-6 space-y-2.5">
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full min-h-[52px] bg-[#3F6B52] text-white rounded-full font-medium text-base hover:bg-[#2F523E] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Order...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white/90" />
                    <span>Place Order · {formatPrice(total)}</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-[#4A5A52]">
                By placing this simulated order, a test order confirmation receipt will be generated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
