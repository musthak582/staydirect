# 🏨 StayDirect – Zero‑commission booking websites for hotels

<p align="center">
  <img src="public/og-image.png" alt="StayDirect - Direct bookings for hotels" width="600" />
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-✨-blue?style=flat-square" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Stack-Next.js%20·%20Prisma%20·%20Stripe-000?style=flat-square" /></a>
  <a href="https://staydirect.com"><img src="https://img.shields.io/badge/Live-demo-emerald?style=flat-square" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" /></a>
</p>

---

## 💡 **The problem**

Hotels lose **15–30% commission** to major booking platforms (Booking.com, Expedia, etc.). Many small hotels want **direct bookings** but lack the technical knowledge to build a professional booking website.

## ✅ **The solution**

**StayDirect** allows hotels to **create their own booking website instantly**, manage rooms, track reservations, and accept payments — all without paying any commission.

---

## ✨ **Features**

### For hotel owners
| Feature | Description |
|--------|-------------|
| 🏨 **Hotel profile** | Set up your hotel details, location, description, and contact info |
| 🛏️ **Room management** | Add/edit rooms with photos, pricing, capacity, and amenities |
| 📅 **Booking engine** | Real-time availability, prevent double bookings, instant confirmations |
| 💳 **Payments** | Accept deposits/full payments via Stripe – only pay transaction fees |
| 📊 **Analytics** | Track revenue, occupancy rates, and booking trends |
| 📱 **Mobile‑friendly** | Your booking site works perfectly on all devices |
| 🔗 **Custom domain** | Use your own domain (e.g., `book.yourhotel.com`) |

### For guests
- Browse rooms with photos and descriptions
- Check real‑time availability
- Book instantly with secure payment
- Receive email confirmations
- Leave reviews after their stay

---

## 🚀 **Live demo**

👉 **[staydirect.com/demo](https://staydirect.com/demo)** (hotel owner dashboard)  
👉 **[grand-hotel.staydirect.com](https://grand-hotel.staydirect.com)** (example public booking site)

---

## 🛠️ **Tech stack**

| Area | Technology |
|------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS + [shadcn/ui](https://ui.shadcn.com/) |
| **Database** | PostgreSQL (via [Neon](https://neon.tech/)) |
| **ORM** | [Prisma](https://prisma.io/) |
| **Auth** | [Better‑Auth](https://better-auth.com/) (email + Google) |
| **Payments** | [Stripe](https://stripe.com/) |
| **Uploads** | [UploadThing](https://uploadthing.com/) |
| **Email** | Nodemailer + Gmail SMTP |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📦 **Project structure**

```
app/
├── (auth)                 # Sign‑in, sign‑up, password reset
├── (dashboard)            # Hotel owner dashboard
│   ├── dashboard/
│   │   ├── hotel/         # Hotel profile
│   │   ├── rooms/         # Room management
│   │   ├── bookings/      # Bookings overview
│   │   └── ...
├── (site)                 # Public hotel websites
│   └── [hotelSlug]/       # Dynamic hotel sites
├── api/                   # API routes (UploadThing, webhooks)
├── actions/               # Server actions (data mutations)
├── components/            # Reusable UI components
├── lib/                   # Utilities, auth, db client
└── types/                 # Global TypeScript types
```

---

## 🚦 **Getting started**

### Prerequisites
- Node.js 20+
- PostgreSQL database (I recommend [Neon](https://neon.tech/))
- Stripe account
- Google OAuth credentials
- Gmail account (for email)

### 1. Clone & install

```bash
git clone https://github.com/yourusername/staydirect.git
cd staydirect
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Email (for verification, password reset)
GMAIL_EMAIL="your@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# UploadThing
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Set up database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) ✨

---

## 🧪 **Running tests**

```bash
npm run test        # unit tests
npm run test:e2e    # end‑to‑end tests (Playwright)
```

---

## 🏗️ **Building for production**

```bash
npm run build
npm start
```

---

## 🗺️ **Roadmap**

### ✅ Completed (MVP)
- [x] Authentication (email + Google)
- [x] Hotel profile management
- [x] Room CRUD with image upload
- [x] Booking engine with availability
- [x] Stripe payment integration
- [x] Public hotel website generator
- [x] Booking management dashboard
- [x] Email notifications (confirmation, password reset)

### 🚧 In progress
- [ ] Analytics dashboard (revenue, occupancy)
- [ ] Review system
- [ ] Seasonal pricing
- [ ] Channel manager (sync with OTAs)

### 🔮 Future
- [ ] Mobile app (iOS/Android)
- [ ] WhatsApp/SMS notifications
- [ ] Multi‑language support
- [ ] Team management (multiple staff)

---

## 🤝 **Contributing**

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 **License**

MIT © [StayDirect](https://staydirect.com)

---

## 🙏 **Acknowledgements**

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Better‑Auth](https://better-auth.com/) for the auth system
- [Vercel](https://vercel.com/) for hosting
- [Neon](https://neon.tech/) for serverless Postgres
- All the hoteliers who provided feedback during development

---

<p align="center">
  Built with ❤️ for independent hotels everywhere.
</p>
<p align="center">
  <a href="https://staydirect.com">staydirect.com</a> ·
  <a href="mailto:hello@staydirect.com">hello@staydirect.com</a> ·
  <a href="https://twitter.com/staydirect">@staydirect</a>
</p>