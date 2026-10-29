import React from 'react';
import { CheckCircle2, Package, ArrowRight, Printer, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Order } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewOrders,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F2B25]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#C9D9CE] overflow-hidden">
        {/* Top Header with Checkmark */}
        <div className="p-8 text-center bg-[#E1ECE4] border-b border-[#D9E5DC]">
          <div className="w-16 h-16 rounded-full bg-[#3F6B52] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2B5240]">
            Demo Order Confirmed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1F3A2D] mt-1">
            Thank you, {order.customer.fullName.split(' ')[0]}!
          </h2>
          <p className="text-sm text-[#4A5A52] mt-1">
            Your simulated order <strong className="text-[#1F2B25]">#{order.orderId}</strong> has been successfully recorded in your browser.
          </p>
        </div>

        {/* Receipt Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F6F8F4] rounded-2xl text-xs">
            <div>
              <p className="text-[#4A5A52]">Order ID</p>
              <p className="font-semibold text-[#1F2B25] mt-0.5">{order.orderId}</p>
            </div>
            <div>
              <p className="text-[#4A5A52]">Order Date</p>
              <p className="font-semibold text-[#1F2B25] mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-[#4A5A52]">Est. Delivery</p>
              <p className="font-semibold text-[#3F6B52] mt-0.5">{order.estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-[#4A5A52]">Payment</p>
              <p className="font-semibold text-[#1F2B25] mt-0.5 uppercase">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Purchased Items */}
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1F3A2D] mb-3">Purchased Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFFFF] border border-[#D9E5DC] text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-xl border border-[#D9E5DC] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1F2B25] truncate">{item.product.name}</p>
                      <p className="text-[#4A5A52] mt-0.5">
                        Variant: {item.size} / {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-[#1F2B25] tabular-nums shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Billing Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#D9E5DC]">
              <div className="flex items-center gap-1.5 font-semibold text-[#1F2B25] mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#3F6B52]" />
                <span>Shipping Address</span>
              </div>
              <p className="text-[#1F2B25] font-medium">{order.customer.fullName}</p>
              <p className="text-[#4A5A52]">{order.customer.address}</p>
              <p className="text-[#4A5A52]">
                {order.customer.city}, {order.customer.state} - {order.customer.postalCode}
              </p>
              <p className="text-[#4A5A52] mt-1">{order.customer.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#D9E5DC] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#1F2B25] mb-2">
                <CreditCard className="w-3.5 h-3.5 text-[#3F6B52]" />
                <span>Payment Summary</span>
              </div>
              <div className="flex justify-between text-[#4A5A52]">
                <span>Subtotal:</span>
                <span className="tabular-nums font-medium text-[#1F2B25]">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#3F6B52]">
                  <span>Discount:</span>
                  <span className="tabular-nums font-medium">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#4A5A52]">
                <span>Shipping:</span>
                <span className="tabular-nums font-medium">
                  {order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1F2B25] pt-2 border-t border-[#D9E5DC]">
                <span>Total Paid:</span>
                <span className="tabular-nums font-serif text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F6F8F4] border-t border-[#D9E5DC] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-[#1F3A2D] bg-white border border-[#C9D9CE] rounded-full hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="px-5 py-2.5 text-xs font-semibold text-[#1F3A2D] bg-white border border-[#C9D9CE] rounded-full hover:bg-[#E1ECE4] transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#3F6B52] text-white rounded-full text-xs font-semibold hover:bg-[#2F523E] transition-colors flex items-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
