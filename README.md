# 🏨 StayDirect – Zero-commission hotel booking platform

<p align="center">
  <img src="./public/og-image.png" alt="StayDirect - Direct bookings for hotels" width="700" />
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-✨-blue?style=flat-square" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Stack-Next.js%20·%20Prisma%20·%20Stripe-000?style=flat-square" /></a>
  <a href="#getting-started"><img src="https://img.shields.io/badge/Setup-⚡-brightgreen?style=flat-square" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" /></a>
</p>

---

## 💡 The Problem

Hotels lose **15–30% commission** to platforms like Booking.com and Expedia.
Many small and medium hotels want **direct bookings**, but lack the tools to build and manage a professional booking system.

---

## ✅ The Solution

**StayDirect** is a modern **multi-tenant SaaS platform** that enables hotels to:

* Create their own booking website instantly
* Accept direct reservations with **zero commission**
* Manage rooms, pricing, and bookings in one dashboard

---

## ✨ Features

### 🏨 For Hotel Owners

| Feature         | Description                                               |
| --------------- | --------------------------------------------------------- |
| Hotel Profile   | Add hotel details, location, images, and contact info     |
| Room Management | Create and manage rooms with pricing, capacity, amenities |
| Booking Engine  | Real-time availability with no double bookings            |
| Payments        | Secure payments via Stripe (no commission, only fees)     |
| Dashboard       | Manage bookings, rooms, and hotel data                    |
| Custom Domain   | Use your own domain (e.g., `book.yourhotel.com`)          |
| Mobile Ready    | Fully responsive booking experience                       |

### 🧳 For Guests

* Browse rooms with images and details
* Check real-time availability
* Book instantly with secure checkout
* Receive email confirmations
* Smooth mobile-friendly experience

---

## 📸 Screenshots

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Booking Page

![Booking](./screenshots/booking.png)

---

## 🛠️ Tech Stack

| Area       | Technology                   |
| ---------- | ---------------------------- |
| Framework  | Next.js 15 (App Router)      |
| Language   | TypeScript                   |
| Styling    | Tailwind CSS + shadcn/ui     |
| Database   | PostgreSQL (Neon)            |
| ORM        | Prisma                       |
| Auth       | Better-Auth (Email + Google) |
| Payments   | Stripe                       |
| Uploads    | UploadThing                  |
| Email      | Nodemailer (Gmail SMTP)      |
| Deployment | Vercel                       |

---

## 🏗️ Architecture

* Multi-tenant SaaS using dynamic routing (`[hotelSlug]`)
* Server Actions for secure backend logic
* Prisma ORM for type-safe database queries
* Stripe integration with webhook handling
* UploadThing for scalable file uploads
* Modular component-based frontend (Next.js)

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL database (recommended: Neon)
* Stripe account
* Google OAuth credentials
* Gmail account (for emails)

---

### 1. Clone Repository

```bash
git clone https://github.com/musthak582/staydirect.git
cd staydirect
npm install
```

---

### 2. Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgresql://..."

BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

GMAIL_EMAIL="your@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

---

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🧪 Testing

```bash
npm run test
npm run test:e2e
```

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🧠 What I Learned

* Built a full-stack SaaS using Next.js App Router
* Designed a multi-tenant architecture
* Implemented secure authentication and authorization
* Integrated Stripe payments and webhook flows
* Built scalable file upload system
* Managed relational data using Prisma ORM

---

## 🗺️ Roadmap

### ✅ Completed

* Authentication (Email + Google)
* Hotel & room management
* Booking engine
* Stripe payments
* Public booking websites
* Email notifications

### 🚧 In Progress

* Analytics dashboard
* Reviews system
* Seasonal pricing

### 🔮 Future

* Mobile app (iOS/Android)
* SMS/WhatsApp notifications
* Multi-language support
* Team/staff roles

---

## 🤝 Contributing

⚠️ This is currently a personal SaaS project.
Feel free to open issues or suggest improvements.

---

## 📄 License

MIT © StayDirect

---

## 🌐 Links

* GitHub: https://github.com/musthak582/staydirect
* Email: [hello@staydirect.com](mailto:hello@staydirect.com)

---

<p align="center">
  Built with ❤️ to empower independent hotels.
</p>
