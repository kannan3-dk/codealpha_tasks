import React, { useState } from 'react';
import { X, Package, Calendar, ChevronDown, ChevronUp, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';

interface OrdersHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onStartShopping: () => void;
}

export const OrdersHistoryModal: React.FC<OrdersHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onStartShopping,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F2B25]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#C9D9CE] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#D9E5DC] flex items-center justify-between bg-[#F6F8F4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E1ECE4] flex items-center justify-center text-[#3F6B52]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#1F3A2D]">My Orders</h2>
              <p className="text-xs text-[#4A5A52]">
                {orders.length} {orders.length === 1 ? 'simulated order' : 'simulated orders'} stored locally
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4A5A52] hover:bg-[#E1ECE4]"
            aria-label="Close orders"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;
              return (
                <div
                  key={order.orderId}
                  className="bg-[#FFFFFF] border border-[#D9E5DC] rounded-2xl p-5 transition-all hover:border-[#3F6B52]/60 shadow-xs"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D9E5DC]">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg font-semibold text-[#1F2B25]">
                        #{order.orderId}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E1ECE4] text-[#2B5240]">
                        <CheckCircle2 className="w-3 h-3 text-[#3F6B52]" />
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#4A5A52]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Order Summary Row */}
                  <div className="py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="text-[#4A5A52]">Estimated Delivery</p>
                      <p className="font-semibold text-sm text-[#1F2B25] mt-0.5">
                        {order.estimatedDelivery}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#4A5A52]">Items</p>
                      <p className="font-semibold text-sm text-[#1F2B25] mt-0.5">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} pcs
                      </p>
                    </div>

                    <div>
                      <p className="text-[#4A5A52]">Payment Method</p>
                      <p className="font-semibold text-sm text-[#1F2B25] mt-0.5 uppercase">
                        {order.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#4A5A52]">Total Paid</p>
                      <p className="font-serif font-bold text-base text-[#1F3A2D] mt-0.5 tabular-nums">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(order.orderId)}
                      className="px-3.5 py-1.5 bg-[#F6F8F4] text-[#1F3A2D] rounded-full font-medium hover:bg-[#E1ECE4] transition-colors flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Receipt'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expandable Order Details */}
                  {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-[#D9E5DC] space-y-3 animate-in fade-in duration-150">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5A52]">
                        Order Manifest
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F8F4] text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-9 h-11 object-cover rounded-lg shrink-0 border border-[#D9E5DC]"
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-[#1F2B25] truncate">{item.product.name}</p>
                                <p className="text-[#4A5A52]">
                                  {item.size} / {item.color} · Qty {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-[#1F2B25] tabular-nums shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-[#F6F8F4] rounded-xl text-xs space-y-1 text-[#4A5A52]">
                        <p>
                          <strong>Shipped to:</strong> {order.customer.fullName}, {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.postalCode}
                        </p>
                        <p>
                          <strong>Contact Phone:</strong> {order.customer.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Empty Orders State */
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#E1ECE4] flex items-center justify-center text-[#3F6B52] mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1F2B25]">No orders placed yet</h3>
              <p className="text-sm text-[#4A5A52] mt-1.5 max-w-sm">
                When you place a simulated order through our checkout, it will be stored and viewable right here in your order history.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onStartShopping();
                }}
                className="mt-6 px-6 py-2.5 bg-[#3F6B52] text-white rounded-full text-sm font-medium hover:bg-[#2F523E] transition-all"
              >
                Browse Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
