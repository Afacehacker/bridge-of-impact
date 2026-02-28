# Bridge of Impact Initiative 🌍

A production-ready NGO fundraising web application for Nigeria.

## 🚀 Quick Start

### 1. Server Setup
- Go to `server` directory
- Install dependencies: `npm install`
- Configure `.env` with your MongoDB URI and Paystack Secret Key.
- Seed the database: `node utils/seed.js`
- Start server: `npm start` (or `npm run dev` for nodemon)

### 2. Client Setup
- Go to `client` directory
- Install dependencies: `npm install`
- Configure `.env` with your `VITE_API_URL` and `VITE_PAYSTACK_PUBLIC_KEY`.
- Start dev server: `npm run dev`

## 🔐 Admin Credentials (after seeding)
- **Email**: `admin@bridgeofimpact.org`
- **Password**: `password123`

## 💳 Payment Integration
The app uses **Paystack**. Ensure you have your keys from the [Paystack Dashboard](https://dashboard.paystack.com/).

## 🏗️ Tech Stack
- **Frontend**: React, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, JWT.
- **Payment**: Paystack API integration (Webhooks & Initialize).

## 🌍 Features
- **Landing Page**: Emotional hero section, how it works, and real-time transparency stats.
- **Impact Cases**: Browsable and filterable medical/crisis cases.
- **Donation Flow**: Integrated Paystack popup for NGN payments.
- **Admin Dashboard**: Secure management of cases, donations, and analytics.
- **Security**: JWT protected admin routes, password hashing, and payment verification.

---
Built with ❤️ for Bridge of Impact Initiative, Nigeria.
