# Jurnal PKL SMK

Sistem pencatatan dan pemantauan jurnal PKL untuk siswa SMK.

## Teknologi
- Next.js App Router
- TailwindCSS + shadcn/ui
- PostgreSQL (via Docker)
- Prisma ORM
- NextAuth.js

## Setup Lokal
1. Clone repo
2. Jalankan `npm install`
3. Buat `.env` dari `.env.example`
4. Jalankan:
```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
