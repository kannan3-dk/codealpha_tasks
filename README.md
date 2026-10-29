# AuraCloth — Quiet Luxury E-commerce Website

A complete, professional, responsive, and fully interactive frontend-only e-commerce website for **AuraCloth** ("Quiet luxury, within reach."). Built faithfully around the provided reference design specification, brand palette, typography, and layout language.

---

## 1. Features Overview

### A. Home & Product Listing
- **Brand Identity & Typography**: Refined Cormorant Garamond display serif paired with clean Jost body typography.
- **Top Navigation Bar**: Brand wordmark, category navigation, live search input, customer account status/dropdown, and live cart item count badge.
- **Campaign Hero Section**: Authentic layout featuring the brand slogan ("Quiet luxury, within reach."), CTA actions, and visual editorial cards.
- **Curated Collections**: One-click filtering by Women, Men, and Accessories with custom color schemes (`#CFE0D3`, `#3F6B52`, `#E1ECE4`).
- **Product Discovery & Filtering**: Real-time search across product titles, descriptions, and materials; category segmentation; in-stock toggle; and sorting by Price (Low/High), Customer Rating, and Alphabetical.
- **Product Cards**: Responsive cards with high-fidelity imagery, fallback visual containers, price, discount tags, rating stars, and one-click quick add.

### B. Product Details View (PDP)
- Dynamic population from selected product data.
- Interactive multi-image gallery with thumbnail switcher.
- Pricing with original price and discount percentage tags.
- Fabric composition, fit, and sustainable care specifications.
- Interactive variant selectors for Size (XS, S, M, L, XL) and Color (live swatches).
- Quantity stepper with stock limit enforcement.
- "Add to Cart" and "Buy Now" (instant checkout redirect) buttons.
- Customer reviews list with verified buyer badges.
- Interactive "Write a Review" simulation that instantly appends feedback to the product.
- "You May Also Like" related product recommendations.

### C. Interactive Shopping Bag / Cart Drawer
- Slide-over drawer with itemized line items, sizes, colors, and unit prices.
- Live quantity increment/decrement controls and item deletion.
- "Clear Cart" with safety confirmation dialog.
- Free shipping progress bar (Free shipping above ₹2,999).
- Demo coupon code system with real-time validation:
  - `AURA10`: 10% discount
  - `QUIETLUXURY20`: 20% discount on orders above ₹3,000
  - `FREESHIP`: 100% off shipping fees
- Persisted to browser `localStorage` (`auracloth_cart_v1`).

### D. Checkout & Order Simulation
- Customer shipping details with real-time field validation (Full Name, Email, Phone, Address, City, State, PIN).
- Demo payment methods (Simulated UPI / QR Code, Simulated Credit/Debit Card, Cash on Delivery).
- Order summary with itemized prices, applied coupon discounts, and final payable amount.
- Generation of unique order ID (e.g., `AC-2026-78412`).
- Order snapshot saved to `localStorage` (`auracloth_orders_v1`).
- Professional order confirmation receipt with print/save support and "View My Orders".
- Order History ("My Orders") modal accessible from header to review past simulated orders.

### E. User Authentication Simulation
- Login and registration modal with toggle.
- One-click "Quick Sign In as Elena Vance" for instant testing.
- Password match validation, email format checking, and show/hide password toggle.
- "Remember Me" option and simulated password reset flow.
- Header updates dynamically with user initials, name, and account management dropdown.

---

## 2. Technology Stack

- **Framework**: React 19 SPA (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom brand color variables (`#F6F8F4`, `#3F6B52`, `#1F3A2D`, `#E1ECE4`, `#CFE0D3`, `#C9D9CE`)
- **Typography**: Google Fonts (*Cormorant Garamond* & *Jost*)
- **Icons**: Lucide React
- **State & Storage**: React Hooks (`useState`, `useEffect`, `useMemo`) + Browser `localStorage`

---

## 3. Project File Organization

```
project/
├── index.html                   # HTML entry point with fonts & metadata
├── metadata.json                # Project metadata configuration
├── package.json                 # Dependencies and build scripts
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root application orchestrator
│   ├── index.css                # Global CSS & Tailwind theme tokens
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for Product, Cart, Order, User
│   ├── data/
│   │   └── products.ts          # 16-item product catalog with specs & reviews
│   ├── utils/
│   │   ├── formatters.ts        # Currency (₹), date, and coupon validators
│   │   └── storage.ts           # LocalStorage persistence helpers
│   └── components/
│       ├── Header.tsx           # Brand header, search, nav, cart badge, auth
│       ├── Hero.tsx             # Quiet luxury campaign hero banner
│       ├── CollectionsSection.tsx # Women, Men, Accessories cards
│       ├── ProductList.tsx      # Filterable, sortable product catalog grid
│       ├── ProductCard.tsx      # Individual product card component
│       ├── ProductDetailView.tsx # Product detail view with gallery & reviews
│       ├── CartDrawer.tsx       # Slide-over cart drawer with calculations
│       ├── CheckoutModal.tsx    # Multi-step checkout simulation & validation
│       ├── OrderConfirmationModal.tsx # Printable order confirmation receipt
│       ├── OrdersHistoryModal.tsx # My Orders history viewer
│       ├── AuthModal.tsx        # Registration and demo sign-in modal
│       ├── HowItWorksSection.tsx # 3-step shopping guide section
│       ├── AboutSection.tsx     # Brand philosophy & craftsmanship story
│       ├── NewsletterSection.tsx # Email newsletter subscription
│       ├── Footer.tsx           # Site footer & copyright
│       └── Toast.tsx            # Global interactive toast feedback
└── README.md
```

---

## 4. How to Run Locally

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` (or the port specified in terminal).
5. Build for production:
   ```bash
   npm run build
   ```

---

## 5. Customization Guide

### Modifying Brand Colors & Styling
Brand colors are defined in `src/index.css`:
- Canvas Background: `#F6F8F4`
- Primary Brand Accent: `#3F6B52` (Forest Sage)
- Primary Dark Text: `#1F3A2D` (Deep Pine Charcoal)
- Light Accents: `#E1ECE4` and `#CFE0D3`

### Adding or Editing Products
Open `src/data/products.ts` and add or modify entries in the `PRODUCTS` array. Each product supports:
- `name`, `subtitle`, `description`, `fabricDetails`, `fitCare`
- `price`, `originalPrice` (for discount calculation)
- `category` (`women` | `men` | `accessories`)
- `tag` (`New` | `Bestseller` | `Limited Edition` | etc.)
- `images` (array of image URLs with automatic fallback)
- `colors` (array of color objects with hex codes)
- `sizes` (array of available sizes)
- `stockQuantity` (enforces max orderable quantity)

---

## 6. Simulation Scope & Future Backend Integration

| Feature | Current Frontend Implementation | Required Backend in Production |
| :--- | :--- | :--- |
| **Product Data** | Centralized local JavaScript data (`src/data/products.ts`) | PostgreSQL / REST or GraphQL API |
| **Cart Persistence** | Browser `localStorage` (`auracloth_cart_v1`) | Server-side cart session or database sync |
| **User Accounts** | Simulated frontend session & local profile | OAuth 2.0 / JWT / bcrypt hashed password store |
| **Checkout & Payments** | Simulated UPI, test card, and COD | Payment Gateway (Stripe, Razorpay, etc.) |
| **Order Placement** | Client-side order ID generator & `localStorage` | Server order processing, webhook & inventory sync |
| **Customer Reviews** | Appended to React component state | Moderated database review pipeline |
| **Order Notifications** | Client-side confirmation view & receipt printing | Transactional Email / SMS API (SendGrid, Twilio) |
