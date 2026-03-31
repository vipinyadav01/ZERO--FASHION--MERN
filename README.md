# 🛍️ ZERO FASHION - Premium E-Commerce Platform

<div align="center">

![ZERO FASHION](https://img.shields.io/badge/ZERO%20FASHION-Premium%20E--Commerce-000000?style=for-the-badge&logo=react&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-zerofashion.vercel.app-4285F4?style=for-the-badge)](https://zerofashion.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

## 🚀 Overview

**ZERO FASHION** is a modern, full-stack e-commerce platform built with the MERN stack, featuring a sleek customer-facing website, powerful admin dashboard, and comprehensive backend API. Designed for scalability, performance, and exceptional user experience.

### ✨ Key Highlights

- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 💳 **Multiple Payment Gateways** - Stripe, Razorpay, and Cash on Delivery
- 📱 **Progressive Web App** - Mobile-optimized with PWA capabilities
- 🖼️ **Cloud Storage** - Cloudinary integration for image management
- 📊 **Analytics Dashboard** - Real-time business insights for admins
- 🛒 **Advanced E-commerce** - Cart, wishlist, order tracking, and more

---

## 🏗️ Architecture

### Frontend Applications
```
📱 Customer App (React + Vite)
├── 🏠 Homepage with hero sections
├── 🛍️ Product browsing & search
├── 🛒 Shopping cart & checkout
├── 👤 User profiles & authentication
├── 📦 Order tracking & history
├── ❤️ Wishlist management
└── 📱 PWA capabilities

⚡ Admin Dashboard (React + Vite)
├── 📊 Real-time analytics
├── 👥 User management
├── 📦 Product management
├── 🛒 Order processing
├── 📈 Business insights
└── 🎨 Modern admin UI
```

### Backend Services
```
🔧 API Server (Node.js + Express)
├── 🔐 JWT Authentication
├── 👤 User management
├── 🛍️ Product catalog
├── 🛒 Shopping cart
├── 💰 Payment processing
├── 📦 Order management
├── 🖼️ Image upload (Cloudinary)
└── 📊 Analytics endpoints
```

---

## 🛠️ Tech Stack

### Frontend
<div align="center">

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react) | 18.3.1 | UI Library |
| ![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat&logo=vite) | 5.4.1 | Build Tool |
| ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=flat&logo=tailwindcss) | 3.4.17 | CSS Framework |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.18.2-FF0055?style=flat&logo=framer) | 11.18.2 | Animations |
| ![Axios](https://img.shields.io/badge/Axios-1.7.7-5A29E4?style=flat&logo=axios) | 1.7.7 | HTTP Client |

</div>

### Backend
<div align="center">

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js) | 18+ | Runtime |
| ![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=flat&logo=express) | 4.21.2 | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-8.12.2-47A248?style=flat&logo=mongodb) | 8.12.2 | Database |
| ![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=flat&logo=jsonwebtokens) | 9.0.2 | Authentication |
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-2.6.0-3448C5?style=flat&logo=cloudinary) | 2.6.0 | Media Storage |

</div>

### Payment Integration
<div align="center">

| Service | Purpose | Features |
|---------|---------|----------|
| ![Stripe](https://img.shields.io/badge/Stripe-17.2.1-008CDD?style=flat&logo=stripe) | Card Payments | Secure, International |
| ![Razorpay](https://img.shields.io/badge/Razorpay-2.9.4-0C2451?style=flat&logo=razorpay) | Digital Payments | UPI, Cards, Wallets |
| 💵 **Cash on Delivery** | COD Orders | Traditional Payment |

</div>

---

## 🎯 Features

### 🛍️ Customer Experience

<details>
<summary><b>🏠 Homepage & Navigation</b></summary>

- **Hero Section** with dynamic image carousel
- **Product Categories** with beautiful grid layouts
- **Search & Filtering** with real-time results
- **Responsive Navigation** with mobile-first design
- **Newsletter Subscription** for marketing

</details>

<details>
<summary><b>🛒 Shopping & Cart</b></summary>

- **Product Catalog** with detailed views
- **Advanced Filtering** by category, price, size
- **Shopping Cart** with quantity management
- **Wishlist** to save favorite items
- **Guest Checkout** option available

</details>

<details>
<summary><b>💳 Checkout & Payments</b></summary>

- **Multiple Payment Options**:
  - 💳 Stripe (International cards)
  - 🇮🇳 Razorpay (UPI, Cards, Wallets)
  - 💵 Cash on Delivery
- **Secure Checkout** with payment verification
- **Order Confirmation** with email notifications

</details>

<details>
<summary><b>👤 User Management</b></summary>

- **Authentication** with email/password
- **Profile Management** with image upload
- **Order History** with detailed tracking
- **Address Management** for multiple locations
- **Account Settings** with password change

</details>

### 🔧 Admin Dashboard

<details>
<summary><b>📊 Analytics & Insights</b></summary>

- **Real-time Metrics**:
  - 💰 Revenue tracking
  - 📦 Order statistics
  - 👥 Customer analytics
  - 📈 Growth percentages
- **Interactive Charts** with data visualization
- **Business Intelligence** with actionable insights

</details>

<details>
<summary><b>📦 Product Management</b></summary>

- **Product CRUD** operations
- **Image Upload** with Cloudinary
- **Inventory Tracking** with stock levels
- **Category Management** with hierarchies
- **Bulk Operations** for efficiency

</details>

<details>
<summary><b>🛒 Order Processing</b></summary>

- **Order Management** with status updates
- **Payment Verification** and tracking
- **Shipping Integration** with providers
- **Customer Communication** tools
- **Refund Processing** for returns

</details>

<details>
<summary><b>👥 User Administration</b></summary>

- **User Management** with role assignments
- **Customer Support** tools
- **Activity Monitoring** and logs
- **Permission Management** for security

</details>

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

```bash
node --version  # v18+ required
npm --version   # v8+ required
git --version   # Latest recommended
```

### 1️⃣ Clone Repository

```bash
# Clone the repository
git clone https://github.com/vipinyadav01/zerofashion.git
cd zerofashion
```

### 2️⃣ Environment Setup

<details>
<summary><b>Backend Configuration</b></summary>

Create `.env` file in the `backend` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/zero-fashion

# JWT Configuration  
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Credentials
ADMIN_EMAIL=admin@zerofashion.vercel.app
ADMIN_PASSWORD=your_admin_password

# Cloudinary Configuration (Required for images)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

# Payment Gateway Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

</details>

<details>
<summary><b>Frontend Configuration</b></summary>

Create `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_BACKEND_URL=http://localhost:4000

# Payment Gateway Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Create `.env` file in the `admin` directory:

```env
# API Configuration  
VITE_BACKEND_URL=http://localhost:4000
```

</details>

### 3️⃣ Installation & Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install

# Install admin dependencies
cd ../admin  
npm install
```

### 4️⃣ Database Setup

```bash
# Start MongoDB service (if running locally)
# For Windows
net start MongoDB

# For macOS/Linux
sudo systemctl start mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in backend/.env accordingly
```

### 5️⃣ Run the Application

```bash
# Terminal 1: Start Backend Server
cd backend
npm run server

# Terminal 2: Start Frontend (Customer App)
cd frontend  
npm run dev

# Terminal 3: Start Admin Dashboard
cd admin
npm run dev
```

### 6️⃣ Access Applications

| Application | URL | Purpose |
|-------------|-----|---------|
| 🛍️ **Customer App** | http://localhost:5173 | Shopping website |
| ⚡ **Admin Dashboard** | http://localhost:5174 | Management panel |
| 🔧 **API Server** | http://localhost:4000 | Backend services |

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

```http
POST   /api/user/register          # User registration
POST   /api/user/login             # User login  
POST   /api/user/admin/login       # Admin login
GET    /api/user/profile           # Get user profile
POST   /api/user/update            # Update profile (with image)
```

### 🛍️ Product Endpoints

```http
GET    /api/product/list           # Get all products
POST   /api/product/add            # Add new product (Admin)
POST   /api/product/remove         # Remove product (Admin)
GET    /api/product/:id            # Get single product
```

### 🛒 Cart & Order Endpoints

```http
POST   /api/cart/add               # Add to cart
POST   /api/cart/update            # Update cart quantity
POST   /api/cart/get               # Get user cart
POST   /api/order/place            # Place order (COD)
POST   /api/order/stripe           # Place order (Stripe)
POST   /api/order/razorpay         # Place order (Razorpay)
GET    /api/order/userOrders       # Get user orders
POST   /api/order/cancel           # Cancel order
```

### 👥 Admin Endpoints

```http
GET    /api/user/all               # Get all users (Admin)
POST   /api/user/admin-update      # Update user (Admin)
POST   /api/user/delete            # Delete user (Admin)
GET    /api/order/list             # Get all orders (Admin)
POST   /api/order/status           # Update order status (Admin)
```

---

## 🎨 UI/UX Features

### 🎭 Animations & Interactions

- **Framer Motion** powered smooth animations
- **Hover Effects** on interactive elements  
- **Loading States** with skeleton screens
- **Micro-interactions** for better UX
- **Page Transitions** between routes

### 📱 Responsive Design

- **Mobile-First** approach for all screens
- **Adaptive Layouts** from 320px to 4K
- **Touch-Friendly** interfaces on mobile
- **Progressive Enhancement** for features

### 🎨 Design System

- **Consistent Typography** with custom fonts
- **Color Palette** optimized for accessibility
- **Component Library** with reusable elements
- **Design Tokens** for maintainable styling

---

## 🔒 Security Features

### 🛡️ Authentication Security

- **JWT Tokens** with expiration
- **Password Hashing** with bcrypt
- **Role-Based Access** control
- **Token Refresh** mechanism

### 🔐 Data Protection

- **Input Validation** on all endpoints
- **SQL Injection** prevention
- **XSS Protection** with sanitization  
- **CORS Configuration** for API access

### 💳 Payment Security

- **PCI Compliance** through payment providers
- **Secure Checkout** with HTTPS
- **Payment Verification** with webhooks
- **Sensitive Data** never stored locally

---

## 📈 Performance Optimizations

### ⚡ Frontend Optimizations

- **Code Splitting** with React.lazy()
- **Image Optimization** with Cloudinary
- **Bundle Optimization** with Vite
- **Caching Strategies** for API calls

### 🚀 Backend Optimizations

- **Database Indexing** for fast queries
- **Response Caching** for static data
- **Request Rate Limiting** for security
- **Error Handling** with meaningful messages

---

## 🧪 Testing & Quality

### 🔍 Code Quality

```bash
# Linting
npm run lint

# Type checking (if using TypeScript)
npm run type-check

# Build verification
npm run build
```

### 🧪 Testing Strategy

- **Unit Tests** for utility functions
- **Integration Tests** for API endpoints  
- **E2E Tests** for critical user flows
- **Performance Tests** for optimization

---

## 🚀 Deployment

### 🌐 Frontend Deployment (Vercel)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### 🔧 Backend Deployment (Railway/Heroku)

```bash
# Set environment variables
# Deploy using platform-specific commands
# Configure domain and SSL
```

### ⚙️ Environment Variables for Production

Update all `.env` files with production values:
- Database URLs (MongoDB Atlas)
- API endpoints (production domains)  
- Payment gateway keys (live keys)
- Cloudinary credentials (production account)

---

## 🤝 Contributing

### 📋 Development Workflow

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### 📝 Contribution Guidelines

- Follow **existing code style** and conventions
- Add **tests** for new features
- Update **documentation** as needed
- Ensure **responsive design** compatibility
- Test across **multiple browsers**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### 🛠️ Built With Love Using

- [React](https://reactjs.org/) - The library for web interfaces
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Fast, minimalist web framework
- [MongoDB](https://www.mongodb.com/) - Document database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Cloudinary](https://cloudinary.com/) - Media management platform

### 💝 Special Thanks

- **Open Source Community** for amazing tools and libraries
- **Vercel** for hosting and deployment platform
- **Stripe & Razorpay** for payment processing solutions

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

[![GitHub Stars](https://img.shields.io/github/stars/vipinyadav01/zerofashion?style=social)](https://github.com/vipinyadav01/zerofashion/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/vipinyadav01/zerofashion?style=social)](https://github.com/vipinyadav01/zerofashion/network/members)

---

**[⬆ Back to Top](#-zero-fashion---premium-e-commerce-platform)**

</div>

