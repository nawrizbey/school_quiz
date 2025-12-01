# Quiz App - Mektep Test Tizimi

Qoraqalpoq tilinde mektep o'quvchilari uchun test topshirish va boshqarish tizimi. O'qituvchilar test yaratadi, o'quvchilar topshiradi, natijalar avtomatik hisoblanadi.

**Status:** ✅ PRODUCTION - Live va ishlayapti!
**Til:** Qoraqalpoq tili
**Stack:** Next.js 15 + TypeScript + Tailwind CSS + Supabase
**GitHub:** https://github.com/nawrizbey/school_quiz

## 🚀 Asosiy Xususiyatlar

### O'quvchilar uchun:
- ✅ **Vaqt bilan boshlanadi** - Testlar belgilangan vaqtda avtomatik ochiladi
- ✅ **Countdown timer** - Erta kirganlar kutib turadi
- ✅ **Variantlar aralashadi** - Har bir o'quvchi uchun farqli tartib (deterministik)
- ✅ **Bir marta topshirish** - Qayta topshirishga yo'l qo'yilmaydi
- ✅ **Test oynasi** - Faqat belgilangan vaqt oralig'ida kirish mumkin
- ✅ **To'g'ri/noto'g'ri javoblar** - Natijada rangli ko'rsatiladi
- ✅ **Mobile-friendly** - To'liq ekranda ochiladi

### O'qituvchilar uchun:
- ✅ **Fan bo'yicha panel** - Har bir o'qituvchi faqat o'z fanidagi testlarni ko'radi
- ✅ **Test yaratish** - Ko'p tanlovli savollar (4 ta variant)
- ✅ **Testlarni o'chirish** - O'z testlarini boshqarish
- ✅ **Vaqt sozlash** - Test boshlanish vaqti (HH:MM)

### Super Admin uchun:
- ✅ **Barcha testlar** - Hamma fanlarni ko'rish va boshqarish
- ✅ **Fan bo'yicha filter** - Testlarni fan bo'yicha saralash
- ✅ **Test linkini nusxalash** - Gruhga jo'natish uchun
- ✅ **Statistika** - To'liq natijalar tahlili
- ✅ **CSV export** - Natijalarni yuklab olish
- ✅ **Grafik va jadvallar** - Ball taqsimoti, vaqt tahlili

## 🛠 Texnologiyalar

- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Deployment**: Vercel

## 📦 O'rnatish

### 1. Loyihani klonlash

```bash
git clone <your-repo-url>
cd Quiz
```

### 2. Paketlarni o'rnatish

```bash
npm install
```

### 3. Supabase sozlash

1. [Supabase](https://supabase.com) saytiga kiring va yangi loyiha yarating
2. SQL Editor'da `supabase-schema.sql` faylini ishga tushiring
3. Project Settings > API dan URL va anon key ni oling

### 4. Environment variables sozlash

`.env.example` faylini `.env.local` ga nusxalang va o'zgartirishlarni kiriting:

```bash
cp .env.example .env.local
```

`.env.local` faylini tahrirlang:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Ishga tushirish

```bash
npm run dev
```

Brauzerda ochiladi: [http://localhost:3000](http://localhost:3000)

## 🌐 Production Deployment

### ✅ DEPLOY QILINDI - 2025-11-14

**GitHub Repository:** https://github.com/nawrizbey/school_quiz
**Status:** Live va ishlayapti ✅

### Deployment Details:

1. **✅ Vercel'ga deploy qilindi**
   - Avtomatik GitHub integratsiyasi
   - Environment variables sozlandi
   - TypeScript strict mode enabled

2. **✅ Supabase database sozlandi**
   - PostgreSQL database
   - Row Level Security (RLS) policies
   - 6 ta default hisob

3. **✅ Production test qilindi**
   - Barcha funksiyalar ishlayapti
   - Mobile responsive
   - Performance optimized

## 👤 Admin Hisoblar

**6 ta default hisob:**

| Username | Parol | Rol | Fan |
|----------|-------|-----|-----|
| `superadmin` | `admin123` | Super Admin | Barcha fanlar |
| `matematika` | `mat123` | O'qituvchi | Matematika |
| `biologiya` | `bio123` | O'qituvchi | Biologiya |
| `ingliz` | `eng123` | O'qituvchi | Ingliz tili |
| `umumiy` | `umumiy123` | O'qituvchi | Umumiy fanlar |
| `zakovat` | `zak123` | O'qituvchi | Zakovat va logika |

⚠️ **MUHIM**: Production'da parollarni o'zgartiring!

### Kirish tartibi:
1. Bosh sahifadan "Mugalimler ushın" tugmasini bosing
2. Username va parolni kiriting
3. Super Admin bo'lsa - barcha testlarni ko'radi
4. O'qituvchi bo'lsa - faqat o'z fanidagi testlarni ko'radi

## 📱 Qanday ishlaydi?

### O'quvchi uchun:

1. **Bosh sahifa** (`/`) - "Test tapsırıw" tugmasini bosing
2. **Testlar ro'yxati** (`/quiz`) - 3 kategoriya:
   - 🔥 **Mavjud testlar** (yashil) - hozir topshirish mumkin
   - ⏰ **Kutilayotgan testlar** (ko'k) - countdown timer bilan
   - 📚 **Tugagan testlar** (kulrang) - kirish mumkin emas
3. **Test topshirish** (`/quiz/[id]`):
   - Ism va sinf (4-6) kiriting
   - Vaqt kelguncha kutib turing (countdown)
   - Test boshlanishi bilan hammaga bir vaqtda ochiladi
   - Variantlar har xil tartibda ko'rinadi
4. **Natija** (`/quiz/[id]/result`):
   - Ball va foiz
   - To'g'ri javoblar yashil, noto'g'ri javoblar qizil
   - Sarflangan vaqt

### O'qituvchi uchun:

1. **Login** (`/admin`) - Username va parol kiriting
2. **Dashboard** (`/admin/dashboard`):
   - Faqat o'z fanidagi testlarni ko'ring
   - "Jańa test jaratıw" tugmasini bosing
   - Testlarni o'chiring
3. **Test yaratish** (`/admin/create-quiz`):
   - Test nomi, fan, vaqt chegarasi
   - Boshlanish vaqti (HH:MM)
   - Savollar va javoblar (4 ta variant)
   - To'g'ri javobni belgilang

### Super Admin uchun:

1. **Login** (`/admin`) - `superadmin` / `admin123`
2. **Super Dashboard** (`/admin/super-dashboard`):
   - Barcha testlarni ko'ring
   - Fan bo'yicha filter qiling
   - Test linkini nusxalang (gruhga jo'natish uchun)
3. **Statistika** (`/stats`) - **Faqat super admin kiradi!**
   - O'rtacha ball va vaqt
   - Ball taqsimoti (grafik)
   - So'nggi testlar vaqti (grafik)
   - Top-20 natijalar (jadval)
   - CSV export

## 📊 Statistika (Faqat Super Admin)

⚠️ **Faqat super admin (`superadmin`) statistikani ko'ra oladi!**

Statistika sahifasida (`/stats`):
- **Umumiy ko'rsatkichlar** - Jami topshirganlar, o'rtacha ball, o'rtacha vaqt
- **Ball taqsimoti** - Bar chart (90-100%, 80-89%, 70-79%, va h.k.)
- **Vaqt tahlili** - Line chart (so'nggi 10 ta test vaqti)
- **Top-20 natijalar** - Jadval (eng ko'p to'g'ri topganlarga qarab)
- **CSV export** - Natijalarni Excel da ochish uchun
- **Saralash** - Avval eng ko'p to'g'ri topganlar, ball teng bo'lsa eng kam vaqt sarflaganlar

## 📂 Loyiha Strukturasi

```
D:\projects\Quiz\
├── app/
│   ├── page.tsx                      # Bosh sahifa
│   ├── quiz/
│   │   ├── page.tsx                  # Testlar ro'yxati
│   │   └── [id]/
│   │       ├── page.tsx              # Test topshirish (asosiy logika)
│   │       └── result/
│   │           └── page.tsx          # Natijalar sahifasi
│   ├── admin/
│   │   ├── page.tsx                  # Login sahifasi
│   │   ├── dashboard/
│   │   │   └── page.tsx              # O'qituvchi paneli
│   │   ├── super-dashboard/
│   │   │   └── page.tsx              # Super Admin paneli
│   │   └── create-quiz/
│   │       └── page.tsx              # Test yaratish sahifasi
│   ├── stats/
│   │   └── page.tsx                  # Statistika (faqat super admin)
│   └── api/
│       └── admin/
│           └── login/
│               └── route.ts          # Login API endpoint
├── lib/
│   ├── supabase.ts                   # Database config va types
│   ├── translations.ts               # O'zbek tarjimalari (original)
│   └── translations.kk.ts            # Qoraqalpoq tarjimalari (ishlatilmoqda)
├── supabase-schema.sql               # Database yaratish SQL
├── fix-rls.sql                       # RLS policies
├── .env.local                        # Environment variables
├── PROJECT_STATUS.md                 # Loyiha holati (Uzbek/Karakalpak)
└── README.md                         # Ushbu fayl
```

## ⚙️ Asosiy Texnik Detallar

### 1. Vaqt Tizimi
- **Test oynasi** = Boshlanish vaqti + Test davomiyligi
- Misol: 17:00 da boshlanadigan 20 daqiqalik test 17:20 gacha ochiq
- Erta kirganlar countdown timer bilan kutadi
- Kech kirganlar qolgan vaqt bilan ishlaydi
- Test oynasi tugagandan keyin kirish mumkin emas

### 2. Variantlarni Aralash (Seeded Shuffle)
- Har bir o'quvchi uchun variantlar farqli tartibda
- **Deterministik** - bir xil o'quvchi har doim bir xil tartibni ko'radi
- Savollar hammaga bir xil, faqat javob variantlari aralashadi
- Fisher-Yates shuffle algoritmi ishlatiladi
- Seed = quiz_id + student_name + class_number

### 3. Bir Marta Topshirish
- Database da tekshiriladi: `quiz_id + student_name + class_number`
- Agar bir marta topshirgan bo'lsa, qayta kirish mumkin emas
- Alert ko'rsatiladi: "Siz bul testke ańlap qatnasqansız"

### 4. Natijalarni Saralash
```sql
ORDER BY score DESC, time_taken ASC
```
- Avval eng ko'p to'g'ri topganlar
- Ball teng bo'lsa, eng kam vaqt sarflaganlar

### 5. Role-Based Access Control
- **super_admin** - Barcha testlar, statistika, linklar
- **teacher** - Faqat o'z fanidagi testlar
- **student** - Test topshirish, natijalarni ko'rish

## 🔒 Xavfsizlik

- ✅ Admin authentication (localStorage-based)
- ✅ Supabase Row Level Security (RLS) policies
- ✅ Environment variables (.env.local)
- ✅ Input validation
- ✅ Role-based authorization
- ✅ Duplicate submission prevention
- ⚠️ Production'da parollarni o'zgartiring!

## 🌐 Til (Qoraqalpoq)

Sayt to'liq **Qoraqalpoq tilida** ishlaydi:
- Barcha matnlar `lib/translations.kk.ts` faylida
- Helper funksiya `t()` dinamik matnlar uchun
- Misol: `t('quizList.timeRemaining', { time: '5' })` → "5 minut qaldı"
- Original O'zbek tarjimalar `lib/translations.ts` da saqlanadi (reference)

### Til o'zgartirish (agar kerak bo'lsa):
Barcha sahifalarda:
```typescript
import translations from '@/lib/translations.kk'; // Qoraqalpoq
// yoki
import translations from '@/lib/translations'; // O'zbek
```

## 🐛 Ma'lum Muammolar va Yechimlar

### ✅ Yechilgan Muammolar:

1. **RLS Policy Error (PGRST116)**
   - **Muammo:** Login ishlamadi, "result contains 0 rows"
   - **Yechim:** `fix-rls.sql` faylini ishga tushiring
   ```sql
   CREATE POLICY "Public can read teachers" ON teachers FOR SELECT USING (true);
   ```

2. **Test yaratish ishlamadi**
   - **Muammo:** INSERT permissions yo'q edi
   - **Yechim:** Quizzes va questions uchun INSERT policies qo'shildi

3. **Variantlar ko'rinmay qoldi (undefined)**
   - **Muammo:** seededShuffle funksiyasi noto'g'ri ishladi
   - **Yechim:** Fisher-Yates algoritmi to'g'rilab, bounds checking qo'shildi

4. **23 soat 59 daqiqa countdown**
   - **Muammo:** Kun tekshiruvi noto'g'ri ishladi
   - **Yechim:** Kun tekshiruvi olib tashlandi, faqat vaqt bo'yicha ishlaydi

5. **Test tahrirlash ishlamaydi (UPDATE/DELETE permissions)**
   - **Muammo:** Super admin test tahrirlash va vaqt o'zgartirish ishlamaydi
   - **Yechim:** `fix-quiz-update-policies.sql` faylini ishga tushiring
   ```sql
   -- Supabase SQL Editor'da ishga tushiring:
   -- fix-quiz-update-policies.sql
   ```

### Agar muammo yuz bersa:

1. **Login ishlamasa:**
   - Supabase database'ga `fix-rls.sql` faylini ishga tushiring
   - Browser console'da xatolarni tekshiring
   - `.env.local` faylni tekshiring

2. **Test yaratish yoki tahrirlash ishlamasa:**
   - Supabase database'ga `fix-quiz-update-policies.sql` faylini ishga tushiring
   - RLS policies to'g'ri sozlanganligini tekshiring
   - Console'da error message'ni o'qing
   - Barcha required fields to'ldirilganligini tekshiring

3. **Countdown noto'g'ri ko'rsatilsa:**
   - Browser vaqti to'g'ri sozlanganligini tekshiring
   - Test scheduled_time to'g'ri kiritilganligini tekshiring

4. **Boshqa muammolar:**
   - Environment variables to'g'ri sozlanganligini tekshiring
   - `npm run build` buyrug'ini ishga tushiring va xatolarni ko'ring
   - Browser console'da xatolarni tekshiring
   - `PROJECT_STATUS.md` faylini o'qing

## 📋 Keyingi Qadamlar

### ✅ Majburiy (Production uchun) - TUGALLANDI:
1. ✅ **Development tugallandi** - Barcha funksiyalar ishlaydi
2. ✅ **Environment Variables** - Vercel'da sozlandi
3. ✅ **Production Deployment** - Vercel'ga deploy qilindi
4. ✅ **Production Testing** - Live saytda test qilindi va ishlayapti
5. ⏳ **Parollarni o'zgartiring** - Default parollarni o'zgartiring (keyingi qadam)

### Ixtiyoriy (Kelajakda):
1. Test tahrirlash funksiyasi
2. Test nusxalash (duplicate) funksiyasi
3. PDF export (natijalarni PDF da yuklab olish)
4. Email/SMS bildirishnoma tizimi
5. Til almashish (O'zbek ↔ Qoraqalpoq)

## 📞 Qo'shimcha Ma'lumot

- **Batafsil dokumentatsiya:** `PROJECT_STATUS.md` faylini o'qing
- **Database struktura:** `supabase-schema.sql` faylini ko'ring
- **RLS policies (Login uchun):** `fix-rls.sql` faylini ishga tushiring
- **RLS policies (Test tahrirlash uchun):** `fix-quiz-update-policies.sql` faylini ishga tushiring
- **Tarjimalar:** `lib/translations.kk.ts` (Qoraqalpoq), `lib/translations.ts` (O'zbek)

## 📄 License

MIT

---

**Status:** ✅ PRODUCTION - Live va ishlayapti!
**Deploy sana:** 2025-11-14
**GitHub:** https://github.com/nawrizbey/school_quiz
**Til:** Qoraqalpoq tili
**Made with ❤️ using Next.js 15 + TypeScript + Supabase**
