# Schola — Student Planner (Next.js)

Konversi dari `schola_student_planner.html` ke **Next.js 14 (App Router) + TypeScript + Tailwind CSS 3**.

## Menjalankan

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Struktur

```
app/
  layout.tsx            font Poppins (next/font), metadata, <html lang="id">
  page.tsx              render <PlannerApp />
  globals.css           Tailwind + scrollbar, grid 12 kolom, tooltip sidebar
context/
  PlannerContext.tsx    SELURUH state & aksi (tugas, jadwal, kalender, pengingat, profil, fokus, toast, modal)
lib/
  types.ts  constants.ts  data.ts (data demo)  utils.ts (warna dinamis, countdown, prune riwayat)
  icons.ts  styles.ts
components/
  PlannerApp.tsx        gate client-only (hindari hydration mismatch dari Date.now)
  layout/               AppShell, Sidebar, MobileHeader, Header, FloatingAddButton, FocusPanel (Pomodoro)
  pages/                DashboardPage, TasksPage, SchedulePage, CalendarPage, RemindersPage, ProfilePage
  modals/               8 modal (hanya di-mount saat aktif → form otomatis reset)
  ui/                   Modal, Field, ColorField, ModalActions, Toast
```

## Catatan konversi

- `innerHTML` + template string → komponen React; `onclick="..."` → handler React; `lucide.createIcons()` → `lucide-react`.
- Variabel global JS → satu `PlannerContext` (`usePlanner()`).
- Tailwind CDN → Tailwind terpasang; `shadow-xs/2xs`, `backdrop-blur-xs`, `scale-98`, opacity `/8` & `/12`, animasi `pop` & `pulse-slow` didaftarkan di `tailwind.config.ts`.
- Perbaikan kecil: tag penutup tombol filter pada halaman Tugas yang hilang di HTML asli; tombol Pomodoro "Mulai" setelah sesi selesai kini mereset ke 25:00.
- Tanggal "hari ini" (Kamis, 19 Nov 2026) masih konstan di `lib/constants.ts`, sama seperti desain asli.
- Data masih in-memory (reset saat refresh), sama seperti versi HTML.
