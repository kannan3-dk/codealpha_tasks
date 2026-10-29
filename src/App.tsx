import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, Review } from './types';
import { PRODUCTS } from './data/products';
import {
  getStoredCart,
  saveStoredCart,
  clearStoredCart,
  getStoredOrders,
  addStoredOrder,
  getStoredUser,
  saveStoredUser,
  clearStoredUser,
  getStoredCoupon,
  saveStoredCoupon,
} from './utils/storage';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CollectionsSection } from './components/CollectionsSection';
import { ProductList } from './components/ProductList';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrdersHistoryModal } from './components/OrdersHistoryModal';
import { AuthModal } from './components/AuthModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutSection } from './components/AboutSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Products state (allows appending dynamic client-side reviews)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Active View ('home' | 'product-detail')
  const [activeView, setActiveView] = useState<'home' | 'product-detail'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Persistent States
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => getStoredCoupon());

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Modal Visibility States
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Cart to localStorage whenever changed
  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  // Sync Applied Promo to localStorage
  useEffect(() => {
    saveStoredCoupon(appliedPromo);
  }, [appliedPromo]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string = 'M',
    color: string = product.colors[0]?.name || 'Standard',
    quantity: number = 1
  ) => {
    const lineItemId = `${product.id}-${size}-${color}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === lineItemId);

      if (existingIndex > -1) {
        // Line item exists: update quantity safely respecting stock limit
        const updated = [...prevCart];
        const currentQty = updated[existingIndex].quantity;
        const newQty = Math.min(product.stockQuantity, currentQty + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        // Add new line item
        const newItem: CartItem = {
          id: lineItemId,
          product,
          size,
          color,
          quantity: Math.min(product.stockQuantity, quantity),
          price: product.price,
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added ${product.name} (${size}) to your bag.`, 'success');
  };

  const handleBuyNow = (
    product: Product,
    size: string = 'M',
    color: string = product.colors[0]?.name || 'Standard',
    quantity: number = 1
  ) => {
    handleAddToCart(product, size, color, quantity);
    setIsCheckoutModalOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === itemId) {
          const clampedQty = Math.min(item.product.stockQuantity, newQty);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    const itemToRemove = cart.find((i) => i.id === itemId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    if (itemToRemove) {
      showToast(`Removed ${itemToRemove.product.name} from your bag.`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    clearStoredCart();
    showToast('Your shopping bag has been cleared.', 'info');
  };

  // Checkout & Order Placement
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      return;
    }
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    // Add to stored orders
    addStoredOrder(order);
    setOrders((prev) => [order, ...prev]);

    // Clear cart and promo
    setCart([]);
    clearStoredCart();
    setAppliedPromo(null);

    // Show confirmation modal
    setIsCheckoutModalOpen(false);
    setConfirmedOrder(order);
    showToast(`Order #${order.orderId} placed successfully!`, 'success');
  };

  // Auth operations
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    saveStoredUser(loggedInUser);
    showToast(`Welcome, ${loggedInUser.fullName}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    clearStoredUser();
    showToast('You have signed out.', 'info');
  };

  // View navigation
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveView('home');
    setSelectedProduct(null);
  };

  // Dynamic reviews
  const handleAddReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString(),
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const avgRating =
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Math.round(avgRating * 10) / 10,
          };
        }
        return p;
      })
    );

    // Also update selected product if currently viewing
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => {
        if (!prev) return null;
        const updatedReviews = [newReview, ...prev.reviews];
        const avgRating =
          updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
        return {
          ...prev,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: Math.round(avgRating * 10) / 10,
        };
      });
    }

    showToast('Your customer review has been published!', 'success');
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F4] text-[#1F2B25] font-sans antialiased selection:bg-[#3F6B52] selection:text-white">
      {/* 1. Primary Top Navigation Header */}
      <Header
        cartCount={totalCartItems}
        user={user}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onNavigateHome={handleNavigateHome}
      />

      {/* 2. Main Content Routing */}
      <main className="flex-1">
        {activeView === 'product-detail' && selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onBack={handleNavigateHome}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onViewProduct={handleViewProduct}
            onAddReview={handleAddReview}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onShopClick={() => {
                const el = document.getElementById('shop');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onHowItWorksClick={() => {
                const el = document.getElementById('how');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onProductClick={handleViewProduct}
              featuredProduct={products[0]}
            />

            {/* Curated Collections Section */}
            <CollectionsSection
              onSelectCollection={(cat) => {
                setSelectedCategory(cat);
              }}
            />

            {/* Product Catalog Listing with Search & Filters */}
            <ProductList
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              inStockOnly={inStockOnly}
              onInStockToggle={() => setInStockOnly(!inStockOnly)}
              onViewProduct={handleViewProduct}
              onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1)}
              cart={cart}
            />

            {/* Simple How It Works Section */}
            <HowItWorksSection
              onLoginClick={() => setIsAuthModalOpen(true)}
              onBrowseClick={() => {
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Brand Story / About Section */}
            <AboutSection
              onStartShopping={() => {
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Newsletter Subscription Section */}
            <NewsletterSection
              onSubscribed={(email) => {
                showToast(`Welcome! A 10% welcome coupon code was sent to ${email}.`, 'success');
              }}
            />
          </>
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      {/* 4. Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        appliedPromo={appliedPromo}
        onApplyPromo={(code) => {
          setAppliedPromo(code);
          if (code) showToast(`Coupon ${code} applied!`, 'success');
          else showToast('Coupon removed.', 'info');
        }}
        onStartShopping={() => {
          handleNavigateHome();
          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 5. Checkout Simulation Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        user={user}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 6. Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewOrders={() => {
          setConfirmedOrder(null);
          setIsOrdersModalOpen(true);
        }}
      />

      {/* 7. Orders History Modal */}
      <OrdersHistoryModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
        onStartShopping={() => {
          handleNavigateHome();
          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 8. User Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 9. Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
