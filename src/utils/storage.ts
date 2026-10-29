import { CartItem, Order, UserProfile } from '../types';

const STORAGE_KEYS = {
  CART: 'auracloth_cart_v1',
  ORDERS: 'auracloth_orders_v1',
  USER: 'auracloth_user_v1',
  APPLIED_COUPON: 'auracloth_coupon_v1',
};

// Default sample demo user
export const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_demo_7721',
  fullName: 'Elena Vance',
  email: 'elena@auracloth.com',
  phone: '+91 98765 43210',
  joinedDate: '2025-11-14',
};

/**
 * Cart storage helpers
 */
export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse stored cart:', err);
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
}

export function clearStoredCart(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CART);
  } catch (err) {
    console.warn('Failed to clear cart storage:', err);
  }
}

/**
 * Orders storage helpers
 */
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse stored orders:', err);
    return [];
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage:', err);
  }
}

export function addStoredOrder(order: Order): void {
  const currentOrders = getStoredOrders();
  const updated = [order, ...currentOrders];
  saveStoredOrders(updated);
}

/**
 * User session storage helpers
 */
export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse user session:', err);
    return null;
  }
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user session:', err);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (err) {
    console.warn('Failed to clear user session:', err);
  }
}

/**
 * Applied promo code persistence
 */
export function getStoredCoupon(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.APPLIED_COUPON);
  } catch {
    return null;
  }
}

export function saveStoredCoupon(code: string | null): void {
  try {
    if (code) {
      localStorage.setItem(STORAGE_KEYS.APPLIED_COUPON, code);
    } else {
      localStorage.removeItem(STORAGE_KEYS.APPLIED_COUPON);
    }
  } catch {
    // ignore
  }
}
