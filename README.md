# AuraCloth — Quiet Luxury E-commerce Website

> **Live Deployment:** [https://codealphatasks-vert.vercel.app/](https://codealphatasks-vert.vercel.app/)

A complete, production-grade e-commerce application for **AuraCloth** ("*Quiet luxury, within reach.*"), built with React 19, TypeScript, Tailwind CSS v4, and integrated with **Supabase** for user authentication and customer purchase tracking.

---

## 🌐 Live Demo

Visit the deployed website:
👉 **[https://codealphatasks-vert.vercel.app/](https://codealphatasks-vert.vercel.app/)**

---

## 📖 How the Website Works

AuraCloth delivers a seamless, high-end shopping experience inspired by minimalist European ateliers. The storefront allows customers to browse collections, inspect garment details, manage a persistent shopping bag, place orders, and review past purchases.

### 1. Storefront & Product Discovery
- **Hero Campaign:** Highlights the core brand message with editorial styling, value pillars, and direct entry points into the seasonal catalog.
- **Curated Collections:** Quick category navigation for **Women**, **Men**, and **Accessories** with custom brand color palettes (`#CFE0D3`, `#3F6B52`, `#E1ECE4`).
- **Live Search & Filtering:** Instant keyword search across product names, subtitles, fabrics, and categories, paired with an in-stock toggle and multi-option sorting (Price: Low to High, High to Low, Customer Rating, Alphabetical, and Featured).
- **Product Cards:** Display high-resolution imagery with fallback styling, fabric tags (`New`, `Bestseller`, `Pure Linen`), star ratings, discounted pricing in INR (`₹`), and a one-click quick add action.

### 2. Product Detail Page (PDP)
- Dynamic view populated directly from the product catalog.
- Multi-image gallery with thumbnail switcher.
- Variant selectors for **Size** (XS to XL) and **Color** with active visual swatches.
- Quantity selector with real-time stock ceiling enforcement.
- **Add to Cart** with toast confirmation and **Buy Now** (instant redirect to checkout).
- Garment story, fabric composition, and sustainable care guidelines.
- Customer reviews section with verified buyer badges and an interactive **Write a Review** form.

### 3. Shopping Bag & Cart Drawer
- Slide-over drawer displaying line items, variant specifics, unit prices, and quantity controls.
- Dynamic **Free Express Shipping** calculation with an interactive progress bar (Free shipping for orders over ₹2,999).
- Demo coupon code system (`AURA10` for 10% off, `QUIETLUXURY20` for 20% off orders above ₹3,000, `FREESHIP` for free shipping).
- Saved automatically in `localStorage` (`auracloth_cart_v1`) so the bag persists across browser reloads.

### 4. Checkout & Order Processing
- Multi-step customer details form (Full Name, Email, Phone, Address, City, State, PIN code) with inline validation.
- Selectable payment methods:
  - **Simulated UPI / QR Code** (GPay, PhonePe, BHIM)
  - **Simulated Credit / Debit Card** (pre-filled test card)
  - **Cash on Delivery (COD)**
- Upon placement:
  - Generates a unique order ID (e.g. `AC-2026-58291`).
  - Automatically records purchase details in **Supabase** (`purchases` table).
  - Clears the shopping bag and displays a printable order confirmation receipt.
  - Adds the order to the customer's **Order History** (`auracloth_orders_v1`).

---

## ⚡ Supabase Integration

The project integrates with Supabase for **Authentication** and **Customer Purchase Persistence**.

### 1. Client Configuration (`src/supabaseClient.js`)
The client is initialized using `@supabase/supabase-js` with URL normalization:

```javascript
import { createClient } from "@supabase/supabase-js";

// 1. Supabase Project URL (configured in .env or src/supabaseClient.js):
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";

// 2. Supabase Public Anon Key:
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

// Normalize URL to project root so auth and rest endpoints work smoothly
const rootUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, "");

export const supabase = createClient(rootUrl || SUPABASE_URL, SUPABASE_PUBLIC_KEY);
```

---

### 2. User Authentication (Sign In & Sign Up)

Both Sign In and Sign Up are wired directly to Supabase Auth:

- **Sign In (`src/components/SignIn.tsx`):**
  Uses `supabase.auth.signInWithPassword({ email, password })`. On success, saves the user profile in local session and redirects to the Home page (`/`). Displays error feedback directly below the form if credentials fail.
  
- **Sign Up (`src/components/SignUp.tsx`):**
  Uses `supabase.auth.signUp({ email, password, options: { data: { full_name, phone } } })`. On success, automatically registers the account, persists the session, and redirects to the Home page (`/`).

- **Quick Demo Sign In:**
  Provides an instant test login option as *Elena Vance* (`elena@auracloth.com`) for testing without filling out credentials.

---

### 3. Customer Purchase Storage (`purchases` Table)

Whenever a customer checks out, purchase information is automatically inserted into Supabase.

#### Data Stored for Each Purchased Item:
| Field | Column Name | Type | Description |
| :--- | :--- | :--- | :--- |
| **Product Name** | `product_name` | `TEXT` | Name of the purchased garment |
| **Product Price** | `product_price` | `NUMERIC` | Price per unit in INR |
| **Quantity** | `quantity_purchased` | `INTEGER` | Quantity ordered |
| **Customer Name** | `customer_name` | `TEXT` | Buyer's full name |
| **Email Address** | `email_address` | `TEXT` | Buyer's email |
| **Phone Number** | `phone_number` | `TEXT` | Contact phone number |
| **Delivery Address** | `delivery_address` | `TEXT` | Full shipping address with city, state & PIN |
| **Purchase Date & Time** | `purchase_date_time` | `TIMESTAMPTZ` | Timestamp when order was placed |
| **Order Status** | `order_status` | `TEXT` | Current status (`Confirmed`, `Processing`) |
| **Payment Status** | `payment_status` | `TEXT` | Payment status (`Paid (UPI)`, `Paid (Card)`, `Pending (Cash on Delivery)`) |
| **Order ID** | `order_id` | `TEXT` | Unique order identifier (e.g., `AC-2026-98421`) |

#### SQL Setup Guide for Supabase:
To configure the table in your Supabase project:
1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your project and navigate to the **SQL Editor**.
3. Run the following SQL script:

```sql
-- 1. Create the purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  quantity_purchased INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  email_address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  purchase_date_time TIMESTAMPTZ DEFAULT NOW(),
  order_status TEXT DEFAULT 'Confirmed',
  payment_status TEXT DEFAULT 'Paid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous and authenticated frontend users to insert purchase records
CREATE POLICY "Allow anonymous and authenticated inserts" 
ON purchases 
FOR INSERT 
WITH CHECK (true);

-- 4. Allow reading purchase records
CREATE POLICY "Allow read purchases" 
ON purchases 
FOR SELECT 
USING (true);
```

#### Code Implementation (`src/utils/supabasePurchases.ts`):
```typescript
import { supabase } from '../supabaseClient';
import { CartItem, ShippingDetails } from '../types';

export async function savePurchasesToSupabase(
  orderId: string,
  items: CartItem[],
  customer: ShippingDetails,
  paymentMethod: 'upi' | 'card' | 'cod'
) {
  const fullAddress = `${customer.address.trim()}, ${customer.city.trim()}, ${customer.state.trim()} - ${customer.postalCode.trim()}, ${customer.country.trim()}`;
  const now = new Date().toISOString();

  let paymentStatus = 'Paid';
  if (paymentMethod === 'cod') {
    paymentStatus = 'Pending (Cash on Delivery)';
  } else if (paymentMethod === 'upi') {
    paymentStatus = 'Paid (UPI)';
  } else if (paymentMethod === 'card') {
    paymentStatus = 'Paid (Card)';
  }

  const records = items.map((item) => ({
    order_id: orderId,
    product_name: item.product.name,
    product_price: item.price,
    quantity_purchased: item.quantity,
    customer_name: customer.fullName.trim(),
    email_address: customer.email.trim(),
    phone_number: customer.phone.trim(),
    delivery_address: fullAddress,
    purchase_date_time: now,
    order_status: 'Confirmed',
    payment_status: paymentStatus,
  }));

  const { data, error } = await supabase.from('purchases').insert(records);
  if (error) console.warn('Supabase insert notice:', error.message);
  return { success: !error };
}
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Backend as a Service:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Styling:** Tailwind CSS v4
- **Typography:** *Cormorant Garamond* (Display Serif) & *Jost* (Geometric Sans)
- **Icons:** Lucide React
- **Storage & State:** React Hooks + Browser `localStorage`
- **Hosting:** [Vercel](https://codealphatasks-vert.vercel.app/)

---

## 📁 Project Structure

```
project/
├── index.html                   # HTML entry point with fonts & metadata
├── metadata.json                # Project configuration
├── package.json                 # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── src/
│   ├── main.tsx                 # React DOM root
│   ├── App.tsx                  # Core application orchestrator
│   ├── supabaseClient.js        # Supabase client connection setup
│   ├── index.css                # Tailwind theme tokens & global styles
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Product, Cart, Order, User)
│   ├── data/
│   │   └── products.ts          # 16-item catalog with specs & pricing
│   ├── utils/
│   │   ├── formatters.ts        # Currency (₹), date, and coupon validators
│   │   ├── storage.ts           # LocalStorage persistence helpers
│   │   └── supabasePurchases.ts # Supabase customer purchase tracking helper
│   └── components/
│       ├── Header.tsx           # Navigation header, search, user dropdown & cart button
│       ├── Hero.tsx             # Brand campaign hero banner
│       ├── CollectionsSection.tsx # Category collection cards
│       ├── ProductList.tsx      # Filterable, sortable product catalog grid
│       ├── ProductCard.tsx      # Individual product display card
│       ├── ProductDetailView.tsx# Dedicated PDP with image gallery & reviews
│       ├── CartDrawer.tsx       # Shopping bag drawer with coupons & checkout CTA
│       ├── CheckoutModal.tsx    # Customer checkout form & Supabase purchase trigger
│       ├── OrderConfirmationModal.tsx # Printable order confirmation receipt
│       ├── OrdersHistoryModal.tsx # Customer order history viewer
│       ├── AuthModal.tsx        # Authentication dialog holding SignIn & SignUp
│       ├── SignIn.tsx           # Supabase sign-in form
│       ├── SignUp.tsx           # Supabase sign-up form
│       ├── HowItWorksSection.tsx# 3-step shopping guide
│       ├── AboutSection.tsx     # Brand philosophy & craftsmanship story
│       ├── NewsletterSection.tsx# Email subscription form
│       ├── Footer.tsx           # Site footer & copyright
│       └── Toast.tsx            # Floating toast notification system
└── README.md
```

---

## 💻 Running Locally

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Build for production:
   ```bash
   npm run build
   ```

---

## 🔗 Quick Links

- **Live Application:** [https://codealphatasks-vert.vercel.app/](https://codealphatasks-vert.vercel.app/)
- **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
