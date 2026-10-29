/**
 * Format currency in Indian Rupees (₹) with proper locale commas
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date string nicely
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export interface PromoResult {
  valid: boolean;
  code: string;
  discountPercentage?: number;
  freeShipping?: boolean;
  message: string;
}

export function validatePromoCode(rawCode: string, subtotal: number): PromoResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, code: '', message: 'Please enter a coupon code.' };
  }

  if (code === 'AURA10') {
    return {
      valid: true,
      code,
      discountPercentage: 10,
      message: '10% discount applied to your order!',
    };
  }

  if (code === 'QUIETLUXURY20') {
    if (subtotal < 3000) {
      return {
        valid: false,
        code,
        message: 'QUIETLUXURY20 requires a minimum subtotal of ₹3,000.',
      };
    }
    return {
      valid: true,
      code,
      discountPercentage: 20,
      message: '20% luxury discount applied!',
    };
  }

  if (code === 'FREESHIP') {
    return {
      valid: true,
      code,
      freeShipping: true,
      message: 'Free express shipping unlocked!',
    };
  }

  return {
    valid: false,
    code,
    message: 'Invalid promo code. Try AURA10 or QUIETLUXURY20.',
  };
}
