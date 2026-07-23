# Library Web App

Frontend aplikasi perpustakaan (peminjaman buku online) — dibuat dengan React + TypeScript + Vite. Backend REST API terpisah (Node.js), diakses lewat `VITE_API_URL`.

## Fitur

**User**
- Login / register
- Browse buku: home, kategori, halaman penulis, pencarian (search overlay)
- Detail buku, cart, checkout, dan riwayat peminjaman (loans)
- Review buku: buat, edit, dan hapus review
- Profile: lihat & update data diri, statistik peminjaman

**Admin**
- Kelola buku (CRUD), lihat daftar user, kelola daftar peminjaman (tandai dikembalikan)

Routing membedakan tiga tingkat akses: halaman publik, halaman yang butuh login (`ProtectedRoute`), dan halaman admin (`AdminRoute`) — lihat [src/App.tsx](src/App.tsx).

## Menjalankan Proyek

```bash
npm install
```

Buat file `.env` di root proyek berisi URL backend:

```
VITE_API_URL=https://your-backend-host/api
```

Lalu jalankan dev server:

```bash
npm run dev
```

Script yang tersedia:

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan dev server (Vite) |
| `npm run build` | Type-check (`tsc -b`) lalu build production |
| `npm run lint` | Menjalankan ESLint |
| `npm run preview` | Preview hasil build production |

## Struktur Folder

```
src/
├── app/            # Redux store + typed hooks (useAppDispatch/useAppSelector)
├── components/
│   ├── admin/      # Komponen khusus halaman admin
│   ├── common/     # Komponen reusable lintas halaman (card, detail, dsb.)
│   ├── layouts/    # Layout shell (UserLayout, AdminLayout, dst.)
│   ├── sections/   # Blok komponen spesifik per halaman (home, checkout, book-detail, dst.)
│   ├── shared/     # Navbar, Footer, ProtectedRoute/AdminRoute, SearchOverlay
│   └── ui/         # Primitive UI (button, dialog, select, dst. — shadcn-based)
├── features/       # State & data hook per domain fitur: auth, ui (slice Redux), cart, checkout, profile, reviews (hook query/mutation)
├── hooks/          # Custom hook generic/UI-only, lintas domain (useImageError, useInView)
├── lib/
│   ├── api/        # Semua pemanggilan REST API, dikelompokkan per resource
│   ├── queryKeys.ts  # Query key TanStack Query yang tersentralisasi
│   └── ...         # axios instance, utils, category icons, dst.
├── pages/
│   ├── user/       # Halaman untuk pengguna umum
│   └── admin/      # Halaman untuk admin
└── types/          # Tipe data bersama (Book, User, Loan, Review, dst.)
```

## Stack

- React 19 + TypeScript + Vite
- TanStack Query untuk server state (fetching, caching, mutation)
- Redux Toolkit untuk auth/UI state
- React Router untuk routing
- Tailwind CSS + Radix UI (shadcn) untuk styling & komponen UI
