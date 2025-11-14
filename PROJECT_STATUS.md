# Quiz App - Loyiha Holati va Rejalar

**Yaratilgan sana:** 2025-11-13
**Til:** Qoraqalpoq tili
**Stack:** Next.js 15 + TypeScript + Tailwind CSS + Supabase

---

## ✅ Bajarilgan Ishlar

### 1. Database va Backend
- [x] Supabase database yaratildi
- [x] 4 ta jadval: `teachers`, `quizzes`, `questions`, `results`
- [x] RLS (Row Level Security) policies sozlandi
- [x] 6 ta foydalanuvchi hisobi: 1 super admin + 5 ta o'qituvchi
- [x] Har bir o'qituvchi bitta fanga mas'ul (Matematika, Biologiya, Ingliz tili, Umumiy fanlar, Zakovat)

### 2. Frontend - O'quvchilar Uchun
- [x] **Bosh sahifa** - Test topshirish va Admin panel linklari
- [x] **Testlar ro'yxati** - 3 kategoriya:
  - 🔥 Mavjud testlar (yashil)
  - ⏰ Kutilayotgan testlar (ko'k) - countdown timer bilan
  - 📚 Tugagan testlar (kulrang)
- [x] **Test topshirish sahifasi**:
  - Ismni kiritish va sinf tanlash (4-6 sinf)
  - Test vaqti kelguncha countdown
  - Hammaga bir vaqtda boshlanadi
  - Kech kirganlar qolgan vaqt bilan ishlaydi
  - Variantlar har bir o'quvchi uchun aralashadi (deterministik)
  - Bir marta topshirish (duplicate prevention)
  - Test oynasi tugagandan keyin kirish mumkin emas
- [x] **Natijalar sahifasi**:
  - Ball va foiz
  - To'g'ri/noto'g'ri javoblar ko'rsatiladi (rangli)
  - Sarflangan vaqt
  - Boshqa testlarga o'tish

### 3. Frontend - Admin Panel
- [x] **Login sahifasi** - Role-based authentication
- [x] **O'qituvchi paneli**:
  - Faqat o'z fanidagi testlarni ko'radi
  - Test yaratish
  - Testlarni o'chirish
  - Statistikani ko'rish
- [x] **Super Admin paneli**:
  - Barcha testlarni ko'radi va boshqaradi
  - Fan bo'yicha filter
  - Test linkini nusxalash (gruhga jo'natish uchun)
  - Statistika
- [x] **Test yaratish sahifasi**:
  - Test nomi, tavsif, fan, vaqt chegarasi
  - Boshlanish vaqti (HH:MM)
  - Ko'p variantli savollar (4 ta variant)
  - Muallif nomi
- [x] **Statistika sahifasi**:
  - Faqat super admin ko'radi
  - O'rtacha ball va vaqt
  - Ball taqsimoti (grafik)
  - So'nggi 10 ta test vaqti (grafik)
  - Natijalar jadvali (top-20)
  - CSV export
  - Natijalar eng ko'p to'g'ri topganlarga, ball teng bo'lsa eng kam vaqt sarflaganlarga qarab saralanadi

### 4. Til va Matnlar
- [x] Barcha matnlar Qoraqalpoq tiliga o'girildi
- [x] `lib/translations.ts` - O'zbek tili (original)
- [x] `lib/translations.kk.ts` - Qoraqalpoq tili (ishlatilmoqda)
- [x] Barcha sahifalar tarjimalardan foydalanadi
- [x] Helper funksiya `t()` parametrlar bilan

### 5. Logika va Xususiyatlar
- [x] **Vaqt tizimi**:
  - Test belgilangan vaqtda boshlanadi (kun bilan bog'liq emas)
  - Countdown timer erta kirganlar uchun
  - Test oynasi = Boshlanish vaqti + Test davomiyligi
  - Kech kirganlar qolgan vaqt bilan ishlaydi
- [x] **Variantlarni aralash**:
  - Har bir o'quvchi uchun farqli tartib
  - Deterministik (bir xil o'quvchi har doim bir xil tartibni ko'radi)
  - Savollar hammaga bir xil
  - To'g'ri javoblar to'g'ri saqlanadi
- [x] **Bir marta topshirish**:
  - Database da tekshiriladi (quiz_id + student_name + class_number)
  - Qayta topshirishga yo'l qo'yilmaydi
- [x] **Test oynasi**:
  - Test faqat belgilangan vaqtdan boshlab, time_limit davomida ochiq
  - Vaqt tugagandan keyin kirish mumkin emas

### 6. Code Cleanup
- [x] Debug console.log larni olib tashlash boshlandi
- [x] Production uchun kod tozalandi

---

## 📝 Qolgan Ishlar

### Majburiy (Production uchun)
1. **Environment Variables**
   - `.env.local` faylni tekshirish
   - Production Supabase credentials ni Vercel ga qo'shish

2. **Deployment**
   - Vercel ga deploy qilish
   - Domain sozlash (agar kerak bo'lsa)
   - Production test qilish

3. **Final Testing**
   - End-to-end test (o'qituvchi → test yaratish → o'quvchi → test topshirish → statistika)
   - Barcha browserlar va mobil qurilmalarda test qilish
   - Performance check

### Ixtiyoriy (Kelajakda)
1. **Test tahrirlash**
   - Mavjud testni o'zgartirish imkoniyati

2. **Test nusxalash (Duplicate)**
   - Testni nusxalab yangi test yaratish

3. **PDF Export**
   - Natijalarni PDF formatda yuklab olish

4. **Bildirish tizimi**
   - Email yoki SMS orqali test boshlanishi haqida xabar

5. **Til almashish**
   - O'zbek va Qoraqalpoq o'rtasida almashish (settings)

---

## 🗄️ Database Struktura

### Tables

#### `teachers`
- `id` (UUID, PK)
- `username` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `full_name` (TEXT)
- `subject` (TEXT) - matematika, biologiya, ingliz_tili, umumiy_fanlar, zakovat
- `role` (TEXT) - 'teacher' yoki 'super_admin'
- `created_at` (TIMESTAMP)

**Default Accounts:**
- `superadmin` / `admin123` (Super Admin)
- `matematika` / `mat123` (Matematika)
- `biologiya` / `bio123` (Biologiya)
- `ingliz` / `eng123` (Ingliz tili)
- `umumiy` / `umumiy123` (Umumiy fanlar)
- `zakovat` / `zak123` (Zakovat va logika)

#### `quizzes`
- `id` (UUID, PK)
- `title` (TEXT)
- `description` (TEXT)
- `subject` (TEXT)
- `time_limit` (INTEGER) - soniyalarda
- `scheduled_day` (INTEGER) - 1-5 (Dushanba-Juma) - ISHLATILMAYDI
- `scheduled_time` (TIME) - HH:MM:SS
- `author_name` (TEXT)
- `teacher_id` (UUID, FK)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)

#### `questions`
- `id` (UUID, PK)
- `quiz_id` (UUID, FK)
- `question_text` (TEXT)
- `options` (TEXT[], 4 ta element)
- `correct_option` (INTEGER) - 0-3
- `order` (INTEGER)
- `created_at` (TIMESTAMP)

#### `results`
- `id` (UUID, PK)
- `quiz_id` (UUID, FK)
- `student_name` (TEXT)
- `class_number` (INTEGER) - 4, 5, 6
- `score` (INTEGER)
- `total_questions` (INTEGER)
- `time_taken` (INTEGER) - soniyalarda
- `answers` (JSONB) - [0, 2, 1, 3, ...] - original indices
- `created_at` (TIMESTAMP)

---

## 🔧 Texnik Detallar

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** React useState/useEffect

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** LocalStorage (teacherLoggedIn, teacherRole, teacherId, etc.)
- **API:** Supabase Client SDK

### Key Files
- `lib/translations.kk.ts` - Qoraqalpoq tarjimalari
- `lib/supabase.ts` - Database types va constants
- `app/page.tsx` - Bosh sahifa
- `app/quiz/page.tsx` - Testlar ro'yxati
- `app/quiz/[id]/page.tsx` - Test topshirish (600+ qator)
- `app/quiz/[id]/result/page.tsx` - Natijalar
- `app/admin/page.tsx` - Login
- `app/admin/dashboard/page.tsx` - O'qituvchi paneli
- `app/admin/super-dashboard/page.tsx` - Super Admin paneli
- `app/admin/create-quiz/page.tsx` - Test yaratish
- `app/stats/page.tsx` - Statistika

---

## 🚀 Deployment Qo'llanmasi

### 1. Vercel ga Deploy

```bash
# Git repository yaratish
git init
git add .
git commit -m "Initial commit - Quiz App"

# GitHub ga push qilish
git remote add origin <your-repo-url>
git push -u origin main

# Vercel ga bog'lash
# https://vercel.com/new dan import qiling
```

### 2. Environment Variables (Vercel)

Vercel Dashboard → Settings → Environment Variables ga qo'shing:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Build Settings

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

---

## 📋 Test Qilish Rejasi

### 1. O'qituvchi Flow
1. Login qiling (matematika / mat123)
2. "Jańa test jaratıw" bosing
3. Test ma'lumotlarini kiriting
4. 2-3 ta savol qo'shing
5. "Test jaratıw" bosing
6. Dashboard da ko'rinishini tekshiring

### 2. Super Admin Flow
1. Login qiling (superadmin / admin123)
2. Barcha testlarni ko'ring
3. Fan bo'yicha filter qiling
4. Test linkini nusxalang
5. Statistikani oching

### 3. O'quvchi Flow
1. Bosh sahifadan "Test tapsırıw" bosing
2. Mavjud testni tanlang
3. Ism va sinf kiriting
4. Testni boshlang
5. Barcha savollarga javob bering
6. Natijalarni ko'ring
7. To'g'ri/noto'g'ri javoblar rangli ko'rinishini tekshiring

### 4. Edge Cases
- [ ] Erta kirib countdown ko'rish
- [ ] Kech kirib qolgan vaqt bilan ishlash
- [ ] Test vaqti tugagandan keyin kirish mumkin emasligini tekshirish
- [ ] Qayta topshirishga yo'l qo'yilmasligini tekshirish
- [ ] Variantlar har xil tartibda ekanligini tekshirish
- [ ] Statistika faqat super admin ko'rishini tekshirish

---

## 🐛 Ma'lum Muammolar va Yechimlar

### 1. RLS Policy Error (PGRST116)
**Muammo:** Teachers table dan o'qib bo'lmadi
**Yechim:** Public SELECT policy qo'shildi

### 2. Test yaratish ishlamadi
**Muammo:** INSERT policies yo'q edi
**Yechim:** Quizzes va questions uchun INSERT policies qo'shildi

### 3. Variantlar ko'rinmadi (undefined)
**Muammo:** seededShuffle funksiyasi noto'g'ri ishladi
**Yechim:** Fisher-Yates shuffle algoritmi to'g'rilab, bounds checking qo'shildi

### 4. 23 soat 59 daqiqa countdown
**Muammo:** Kun tekshiruvi noto'g'ri ishladi
**Yechim:** Kun tekshiruvini olib tashlab, faqat vaqt bo'yicha tekshirish qilindi

---

## 📞 Keyingi Qadamlar

1. **Environment variables sozlash** (.env.local)
2. **Vercel ga deploy qilish**
3. **Production da test qilish**
4. **Domain sozlash** (agar kerak bo'lsa)
5. **Foydalanuvchilarga o'rgatish** (qo'llanma yoki video)

---

## 📚 Qo'shimcha Ma'lumotlar

### Foydali Linklar
- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Kod Strukturasi
```
D:\projects\Quiz\
├── app/
│   ├── page.tsx                      # Bosh sahifa
│   ├── quiz/
│   │   ├── page.tsx                  # Testlar ro'yxati
│   │   └── [id]/
│   │       ├── page.tsx              # Test topshirish (ASOSIY)
│   │       └── result/
│   │           └── page.tsx          # Natijalar
│   ├── admin/
│   │   ├── page.tsx                  # Login
│   │   ├── dashboard/
│   │   │   └── page.tsx              # O'qituvchi paneli
│   │   ├── super-dashboard/
│   │   │   └── page.tsx              # Super Admin paneli
│   │   └── create-quiz/
│   │       └── page.tsx              # Test yaratish
│   ├── stats/
│   │   └── page.tsx                  # Statistika
│   └── api/
│       └── admin/
│           └── login/
│               └── route.ts          # Login API
├── lib/
│   ├── supabase.ts                   # DB config
│   ├── translations.ts               # O'zbek (original)
│   └── translations.kk.ts            # Qoraqalpoq (current)
├── .env.local                        # Environment variables
└── PROJECT_STATUS.md                 # Ushbu fayl
```

---

**Oxirgi yangilanish:** 2025-11-13
**Status:** ✅ Development tugallandi, Deployment uchun tayyor
**Keyingi qadam:** Vercel ga deploy qilish
