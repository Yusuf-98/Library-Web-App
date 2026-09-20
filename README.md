# Booky — Library Web App

A web app for borrowing books online: browse the catalogue, add books to a cart, check out with a borrow date and duration, and track loans and reviews. Admins manage books, users and loan returns from a separate dashboard.

Built with React, TypeScript and Vite against a separate REST API. The interface is aimed at an Indonesian audience, so a few labels (for example the phone number field) are in Indonesian.

**Live demo:** https://library-web-by-yusuf.vercel.app/

To try the reader flow (cart, checkout, loans, reviews), create an account on the Register page. The admin dashboard needs a privileged account, so it is shown in the screenshots below instead.

<p align="center">
  <img src="docs/screenshots/home-hero.png" alt="Booky home page with hero banner and book categories" width="820">
</p>

## Features

**Readers**
- Register and log in
- Browse the catalogue by category, author or search, with category and rating filters
- Book detail page with stock, rating, reviews and related books
- Cart and checkout: pick a borrow date and a 3, 5 or 10 day duration; the return date is calculated for you
- "My Loans" list filtered by status (All, Active, Returned, Overdue)
- Write, edit and delete reviews; manage your profile

**Admins**
- Book management: add, edit, preview and delete books with cover upload
- User list and search
- Loan list with status filters and a "Mark Returned" action

Access is split into three levels in [src/App.tsx](src/App.tsx): public pages, pages that need a login (`ProtectedRoute`) and admin-only pages (`AdminRoute`).

## Screenshots

| | |
| --- | --- |
| ![Home recommendations](docs/screenshots/home-recommendations.png) | ![Book list with filters](docs/screenshots/book-list-filters.png) |
| **Home** — recommendations with "Load More" | **Book list** — category and rating filters |
| ![Book detail](docs/screenshots/book-detail.png) | ![Reviews and related books](docs/screenshots/book-reviews-related.png) |
| **Book detail** — stock, rating, add to cart or borrow | **Reviews and related books** |
| ![Checkout](docs/screenshots/checkout.png) | ![My loans](docs/screenshots/my-loans.png) |
| **Checkout** — borrow date, duration and computed return date | **My loans** — filter by status |
| ![My reviews](docs/screenshots/my-reviews.png) | ![Register](docs/screenshots/register.png) |
| **My reviews** | **Register** |

### Admin dashboard

| | |
| --- | --- |
| ![Admin book list](docs/screenshots/admin-books.png) | ![Admin loan list](docs/screenshots/admin-loans.png) |
| **Books** — preview, edit, delete | **Loans** — mark as returned |

![Admin user list](docs/screenshots/admin-users.png)

*Personal details of the users in this list are pixelated.*

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack Query** for server state (fetching, caching, mutations)
- **Redux Toolkit** for auth and UI state
- **React Router** for routing, with route-level code splitting
- **Tailwind CSS v4** + **Radix UI** (shadcn/ui) for styling and accessible primitives
- **Axios** for the API client

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 8).

```bash
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to the base URL of the backend API, then start the dev server:

```bash
npm run dev
```

The dev server runs on port 5173 and fails fast if that port is taken. Set the `PORT` environment variable to use another one.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Project structure

```
src/
├── app/            # Redux store and typed hooks
├── components/
│   ├── admin/      # Admin-only components
│   ├── common/     # Reusable cards and detail views
│   ├── layouts/    # Layout shells (user, admin, account)
│   ├── sections/   # Page-specific blocks (home, checkout, book detail, ...)
│   ├── shared/     # Navbar, footer, route guards, search overlay
│   └── ui/         # UI primitives (shadcn/ui on Radix)
├── features/       # Per-domain state and data hooks: auth, ui, cart, checkout, profile, reviews
├── hooks/          # Generic hooks (useImageError, useInView)
├── lib/
│   ├── api/        # REST calls grouped by resource
│   ├── queryKeys.ts  # Centralised TanStack Query keys
│   └── ...         # Axios instance, utils, category icons
├── pages/
│   ├── user/       # Reader pages
│   └── admin/      # Admin pages
└── types/          # Shared types (Book, User, Loan, Review, ...)
```

## Deployment

Deployed on Vercel. [vercel.json](vercel.json) rewrites every path to `index.html` so direct links and page refreshes work with client-side routing. Set `VITE_API_URL` in the Vercel project's environment variables.
