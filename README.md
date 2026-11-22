# Yesly — Wedding Planning Platform (Client)

Yesly is a wedding planning marketplace where couples discover curated wedding services,
request bookings, and vendors publish their ateliers and manage inquiries. Admins review
listings, manage users and monitor premium transactions.

This repository is the **Next.js client**. The Express + MongoDB API lives in the
[yesly-server-site](https://github.com/Mith9n/yesly-server-site) repository.

## Important Features

- Editorial marketplace UI built from the existing Yesly Stitch design system
  (Playfair Display + Plus Jakarta Sans, ivory/charcoal/champagne palette).
- Home page with cinematic hero video, six database-driven featured services, wedding
  categories, "Why Choose Yesly", how it works, testimonials and vendor CTA.
- Browse services with backend search (name/category/location), category filtering,
  price sorting, pagination, loading, empty and error states.
- Vendor guild directory (`/vendors`, MongoDB-aggregated vendor profiles) and the editorial
  wedding shop (`/shop`).
- Service details with image gallery, vendor profile and booking request form.
- Better Auth email/password + optional Google sign in, customer/vendor role selection,
  password rules, toast feedback and role-based redirects.
- Role-protected dashboards with sidebar navigation:
  - **Vendor** — overview metrics, service CRUD with ImgBB image upload, approval status,
    availability toggle, booking accept/reject, subscription plans and profile settings.
  - **Customer** — overview metrics, my bookings, cancel pending requests, profile settings.
  - **Admin** — platform metrics, user search/filter/block, service approval and
    moderation, read-only transaction ledger.
- Stripe Checkout redirect for the Premium plan with dedicated success and cancel pages.
- Framer Motion reveal animations on home sections.
- Responsive layouts, skeleton loaders and accessible components throughout.

## Technology Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (Yesly design tokens)
- Better Auth (MongoDB adapter, role additional fields, blocking hooks)
- Express.js + MongoDB REST API
  ([yesly-server-site](https://github.com/Mith9n/yesly-server-site))
- Stripe Checkout, ImgBB image hosting
- Framer Motion, Sonner toasts

## Project Structure

```text
src/
├── app/
│   ├── (site)/            # Public pages: home, browse, details, auth, payment
│   ├── dashboard/         # Role-protected dashboards
│   ├── api/auth/[...all]/ # Better Auth route handler
│   ├── api/platform-session/  # Exchanges the Better Auth cookie for an API JWT
│   └── api/checkout_sessions/ # Creates the Stripe Checkout session
├── components/            # Site, dashboard, auth, services, payments, UI
└── lib/                   # API client, auth config, types, constants
```

The Yesly Stitch design system is implemented directly in `src/` as design tokens
(`app/globals.css`) and components; keep new UI inside that system.

## Installation

```bash
npm install
```

## Environment Variables

Create `.env` (never commit it):

```env
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:password@cluster/...
AUTH_DB_NAME=YESLY-Databse

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-only: used by the /api/checkout_sessions route handler
STRIPE_SECRET_KEY=sk_test_...

# Optional Google sign in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## How to Run Locally

1. Start the API from `yesly-server-site`:
   ```bash
   npm install
   npm run dev
   ```
2. Start the client:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

Optional demo catalog (six approved services):

```bash
cd yesly-server-site && npm run seed:demo
```

Create the first admin securely from the server repository:

```bash
cd yesly-server-site
npm run seed:admin -- your-registered-email@example.com
```

Register the account through `/sign-up` first, then promote it. Admin accounts can never be
created through public registration.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # production server
npm run lint    # eslint
```

## Notes on Optional Integrations

- **Stripe** — the `/api/checkout_sessions` route handler creates the Checkout Session with
  the server-only `STRIPE_SECRET_KEY`; the Express `POST /api/payments/webhook` confirms it. If
  `STRIPE_SECRET_KEY` is missing the upgrade button surfaces a clear message; the webhook
  secret lives only on the API host. Premium is activated only by a verified webhook.
- **ImgBB** — service and profile images upload through the server to ImgBB. Without
  `IMGBB_API_KEY` uploads return a clear error; image URLs can still be added manually.
- **Google** — the button is always visible; without Google credentials Better Auth returns
  an error which is shown as a toast/banner.

## Live Website

- Client — https://yesly-client-site.vercel.app
- API — https://yesly-server-site.vercel.app (health check: `/api/health`)

## Repositories

- Client — https://github.com/Mith9n/yesly-client-site
- Server — https://github.com/Mith9n/yesly-server-site

## Deployment Checklist

- Set `NEXT_PUBLIC_API_URL` to the deployed API URL and `BETTER_AUTH_URL` /
  `NEXT_PUBLIC_APP_URL` to the deployed site URL.
- Keep the client and API session exchange in place: the client proxies the
  Better Auth cookie to the API because the deployed apps use separate origins.
- Configure the API `CLIENT_URL` with the deployed client origin (CORS + credentials).
- Add the Stripe webhook endpoint (`/api/payments/webhook`) and secret on the API host, and
  set `STRIPE_SECRET_KEY` on the client host for `/api/checkout_sessions`.
- Verify sessions persist across reloads and dashboards remain role protected.
