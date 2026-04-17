# Kulture - Multivendor E-commerce Platform

## Overview
Kulture is an urban streetwear and contemporary fashion e-commerce platform designed to scale into a robust multivendor marketplace. While initially acting as a centralized storefront, the underlying architecture supports multiple independent sellers managing their own product catalogs, with a single central admin overseeing the entire ecosystem.

## Core Features & Vision

### 1. Unified Storefront
- All products, regardless of the seller, are displayed in a unified catalog on the main storefront (`/*`).
- Buyers do not see "Store X" or "Store Y", but rather experience a single cohesive brand.
- Product browsing is open to everyone, but Checkout requires a valid authenticated session.

### 2. Multi-Tier Role System
The platform operates on a three-tier role-based access control (RBAC) system:

#### **User (Buyer)**
- **Access**: Main storefront (`/*`), Cart (`/cart`), User Profile (`/profile`).
- **Capabilities**: Can browse products, add to cart, and checkout. Has a standard user dashboard for tracking their own orders.

#### **Seller (Vendor)**
- **Access**: Seller Dashboard (`/seller/*`).
- **Capabilities**: 
  - Manage their onboarding profile (Name, Shop Name, Categories, Payout Preferences).
  - Create, read, update, and delete (CRUD) their own products.
  - Track sales and earnings for their specific items.
- **Restrictions**: Cannot access the admin panel. Cannot affect other sellers' products.

#### **Admin (Superuser)**
- **Access**: Admin Dashboard (`/admin/*`) and all other areas.
- **Capabilities**:
  - Full override permissions over the entire platform.
  - Can view all shops, users, and transactions.
  - Can delete uploaded products, ban users/sellers, and approve seller onboarding.
  - Acts as the central financial hub: all payments route to the Admin, who then manages scheduled payouts to Sellers based on their preferences (weekly, bi-weekly, monthly).

### 3. Payment & Payout Architecture
- **Centralized Checkout**: Customers pay through a unified checkout process. Funds are securely routed to the Admin's central processor account.
- **Ledger System**: The database tracks which products belong to which seller, maintaining a ledger of pending payouts on the seller's dashboard.
- **Payouts**: The Admin handles disbursements to sellers based on agreed-upon schedules.

---

## Technical Stack & Roadmap

### Authentication & Authorization
- **Provider**: [Better-Auth](https://better-auth.com/)
- **Methods**: Google OAuth, Email/Password.
- **Protections**: Middleware-based route protection isolating `/seller`, `/admin`, `/cart`, and `/checkout`.

### Database
- **Provider**: PostgreSQL (Neon Serverless Postgres)
- **Rationale**: A relational database is highly recommended for multivendor e-commerce due to complex relationships (Users -> Orders <- Products -> Sellers) and strict transactional requirements.

### Phase 1: Foundation (Current)
- [ ] Set up Better Auth with Google & Email/Password.
- [ ] Establish Database Schema for Users (Admin, Seller, Buyer roles).
- [ ] Implement Next.js Middleware for role-based route protection (`/seller`, `/admin`, authenticated user routes).
- [ ] Draft fundamental Seller Onboarding model.
