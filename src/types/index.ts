export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  bgClass?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  fabricDetails: string;
  fitCare: string;
  price: number;
  originalPrice: number;
  category: 'women' | 'men' | 'accessories';
  tag: 'New' | 'Bestseller' | 'Limited Edition' | 'Pure Linen' | 'Mulberry Silk' | 'Organic Cotton';
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  isFeatured: boolean;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  reviews: Review[];
  sku: string;
  bgCard: string;
}

export interface CartItem {
  id: string; // `${productId}-${size}-${color}`
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: ShippingDetails;
  paymentMethod: 'upi' | 'card' | 'cod';
  subtotal: number;
  shippingFee: number;
  discount: number;
  discountCode?: string;
  total: number;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  joinedDate: string;
}

export type ActiveView = 'home' | 'product-detail' | 'checkout' | 'order-confirmation' | 'my-orders';
