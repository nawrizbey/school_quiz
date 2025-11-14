# 📁 Loyiha strukturasi

Quiz App loyihasining to'liq strukturasi va har bir faylning vazifasi.

```
Quiz/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Asosiy layout (metadata, font)
│   ├── page.tsx                 # Bosh sahifa (/) - asosiy menyu
│   ├── globals.css              # Global CSS, Tailwind
│   │
│   ├── admin/                   # Admin panel
│   │   ├── page.tsx            # Admin login (/admin)
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Admin dashboard - quizlarni boshqarish
│   │   └── create-quiz/
│   │       └── page.tsx        # Quiz yaratish sahifasi
│   │
│   ├── api/                     # API routes
│   │   └── admin/
│   │       └── login/
│   │           └── route.ts    # Admin login API
│   │
│   ├── quiz/                    # Test topshirish
│   │   ├── page.tsx            # Testlar ro'yxati (/quiz)
│   │   └── [id]/               # Dynamic route
│   │       ├── page.tsx        # Test topshirish (/quiz/[id])
│   │       └── result/
│   │           └── page.tsx    # Natijalar sahifasi
│   │
│   └── stats/                   # Statistika
│       └── page.tsx            # Statistika dashboard (/stats)
│
├── lib/                         # Utility funksiyalar
│   └── supabase.ts             # Supabase client va type definitions
│
├── public/                      # Static fayllar
│   └── (bo'sh - kerak bo'lsa qo'shing)
│
├── .env.local                   # Environment variables (gitignore)
├── .env.example                 # Env variables namunasi
├── .gitignore                   # Git ignore qoidalari
│
├── next.config.ts               # Next.js konfiguratsiyasi
├── tailwind.config.ts           # Tailwind CSS konfiguratsiyasi
├── postcss.config.mjs           # PostCSS konfiguratsiyasi
├── tsconfig.json                # TypeScript konfiguratsiyasi
├── package.json                 # Dependencies va scripts
│
├── supabase-schema.sql          # Database schema (Supabase'da ishga tushirish)
├── vercel.json                  # Vercel deploy konfiguratsiyasi
│
├── README.md                    # Asosiy qo'llanma
├── DEPLOY.md                    # Deploy qilish qo'llanmasi
├── QUICKSTART.md                # Tez boshlash qo'llanmasi
└── PROJECT_STRUCTURE.md         # Bu fayl
```

---

## 📄 Fayllarning batafsil tavsifi

### App Router sahifalari

#### `app/page.tsx` - Bosh sahifa
- Asosiy navigatsiya menyu
- 3 ta tugma: Test topshirish, Admin panel, Statistika
- Gradient background, mobile-friendly

#### `app/admin/page.tsx` - Admin login
- Login forma (username, password)
- localStorage bilan authentication
- Kirish muvaffaqiyatli bo'lsa dashboard'ga yo'naltiradi

#### `app/admin/dashboard/page.tsx` - Admin dashboard
- Barcha quizlar ro'yxati
- Quiz yaratish, tahrirlash, o'chirish
- Statistika va bosh sahifaga linklar

#### `app/admin/create-quiz/page.tsx` - Quiz yaratish
- Quiz ma'lumotlari (nom, tavsif, vaqt)
- Savollar va variantlar (ko'p tanlov)
- Dynamic savol qo'shish/o'chirish
- Validatsiya va Supabase'ga saqlash

#### `app/quiz/page.tsx` - Testlar ro'yxati
- Barcha mavjud testlarni ko'rsatadi
- Har bir test kartochkasi (nom, tavsif, vaqt)
- Test tanlash va boshlash

#### `app/quiz/[id]/page.tsx` - Test topshirish
- Ism kiritish ekrani
- Timer bilan test topshirish
- Savol-javob interfeysi
- Progress bar
- Navigate tugmalari (oldingi, keyingi)
- Natijani saqlash va result sahifasiga yo'naltirish

#### `app/quiz/[id]/result/page.tsx` - Natija
- Ball va foiz (donut chart)
- To'g'ri/noto'g'ri javoblar soni
- Sarflangan vaqt
- Emoji va motivatsion xabar
- Qayta topshirish va boshqa testlar linklari

#### `app/stats/page.tsx` - Statistika
- Test tanlash dropdown
- 3 ta asosiy statistika kartochkasi
- Ball taqsimoti (Bar chart)
- Vaqt tahlili (Line chart)
- So'nggi 20 ta natija (jadval)
- CSV export funksiyasi

### API Routes

#### `app/api/admin/login/route.ts`
- POST endpoint
- Username va parol tekshiradi
- Supabase'da admin_users jadvalidan so'raydi
- Success/failure javobini qaytaradi

### Library fayllar

#### `lib/supabase.ts`
- Supabase client yaratadi
- Environment variables'dan URL va Key oladi
- TypeScript interface'lar (Quiz, Question, Result)
- Placeholder values for build time

### Konfiguratsiya fayllari

#### `next.config.ts`
- Next.js asosiy sozlamalari
- React strict mode yoqilgan

#### `tailwind.config.ts`
- TailwindCSS sozlamalari
- Custom colors va theme

#### `tsconfig.json`
- TypeScript kompilyator sozlamalari
- Path aliases (@/*)

#### `package.json`
- Loyiha nomi va versiyasi
- Dependencies (Next.js, React, Supabase, Recharts)
- Scripts (dev, build, start)

### Database

#### `supabase-schema.sql`
- PostgreSQL schema
- 4 ta jadval: quizzes, questions, results, admin_users
- Indexlar va RLS policies
- Default admin user

---

## 🎨 Dizayn tizimi

### Ranglar

- **Primary**: Purple (#8b5cf6, #a855f7)
- **Secondary**: Blue (#3b82f6, #2563eb)
- **Success**: Green (#10b981, #059669)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444, #dc2626)

### Komponentlar

- **Kartochkalar**: `rounded-2xl shadow-lg p-6`
- **Tugmalar**: `rounded-lg px-6 py-3 font-semibold`
- **Input**: `rounded-lg px-4 py-3 border focus:ring-2`

### Mobile optimization

- Responsive grid (1 col mobile, 2-3 col desktop)
- Touch-friendly tugmalar (min 44px height)
- Full-width kartochkalar mobile'da
- Viewport settings (no zoom, no scroll)

---

## 🔄 Ma'lumotlar oqimi

### Quiz yaratish
1. Admin login qiladi
2. Create quiz sahifasiga o'tadi
3. Forma to'ldiriladi (client-side)
4. Submit tugmasi bosiladi
5. Supabase'ga `quizzes` insert
6. Har bir savol uchun `questions` insert
7. Dashboard'ga redirect

### Test topshirish
1. Foydalanuvchi test tanlaydi
2. Ismini kiritadi
3. Test boshlangan, timer start
4. Har bir savolga javob beriladi (state'da saqlanadi)
5. Submit bosiladi
6. Score hisoblanadi (client-side)
7. Supabase'ga `results` insert
8. Result sahifasiga redirect

### Statistika
1. Supabase'dan barcha quizlar olinadi
2. Har bir quiz uchun results olinadi
3. Client-side aggregate (avg, count, etc)
4. Recharts bilan grafiklar chiziladi
5. CSV export - client-side generation

---

## 🛠 Texnik tafsilotlar

### State management
- React useState (local state)
- localStorage (admin auth)
- No Redux/Zustand - oddiy loyiha

### Routing
- Next.js App Router
- Dynamic routes ([id])
- Server Components (static)
- Client Components ('use client')

### Styling
- TailwindCSS utility classes
- No custom CSS modules
- Responsive breakpoints (md, lg)

### Database
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Indexes for performance
- Foreign keys cascade delete

### Authentication
- Simple admin auth
- localStorage session
- No JWT/OAuth (oddiy loyiha)
- Password hashing (pgcrypto)

---

**Loyiha strukturasi tugallangan!** 📚
