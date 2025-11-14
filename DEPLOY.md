# 🚀 Deploy qilish qo'llanmasi

Bu qo'llanma Quiz App'ni Supabase + Vercel'ga deploy qilish bo'yicha batafsil ko'rsatmalar beradi.

## 1️⃣ Supabase sozlash (5 daqiqa)

### 1.1 Supabase account yaratish

1. [supabase.com](https://supabase.com) saytiga kiring
2. "Start your project" tugmasini bosing
3. GitHub yoki email bilan ro'yxatdan o'ting (BEPUL!)

### 1.2 Yangi loyiha yaratish

1. Dashboard'da "New Project" tugmasini bosing
2. Quyidagilarni to'ldiring:
   - **Name**: Quiz App (yoki istalgan nom)
   - **Database Password**: Kuchli parol yarating (saqlab qo'ying!)
   - **Region**: Eng yaqin mintaqa (masalan, Singapore)
   - **Pricing Plan**: Free plan (tushunarli!)
3. "Create new project" tugmasini bosing
4. 2-3 daqiqa kutasiz (database yaratilmoqda)

### 1.3 Database schema o'rnatish

1. Loyiha tayyor bo'lgach, chap menuda **"SQL Editor"** ni bosing
2. "New query" tugmasini bosing
3. Loyihangizdagi `supabase-schema.sql` faylini oching
4. Faylning butun kodini nusxalang (Ctrl+A, Ctrl+C)
5. SQL Editor'ga joylashtiring (Ctrl+V)
6. **"Run"** tugmasini bosing (yoki F5)
7. "Success" xabari chiqishi kerak ✅

### 1.4 API kalitlarini olish

1. Chap menuda **"Project Settings"** (pastki qism, tishliroq icon)
2. **"API"** bo'limiga o'ting
3. Quyidagilarni nusxalab oling:
   - **Project URL**: `https://xxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (uzun kalit)

⚠️ MUHIM: Bu kalitlarni saqlab qo'ying! Keyinroq kerak bo'ladi.

---

## 2️⃣ Vercel'ga deploy qilish (3 daqiqa)

### 2.1 GitHub'ga yuklash

Agar loyihangiz hali GitHub'da bo'lmasa:

```bash
git init
git add .
git commit -m "Initial commit - Quiz App"
git branch -M main
git remote add origin https://github.com/username/quiz-app.git
git push -u origin main
```

### 2.2 Vercel account yaratish

1. [vercel.com](https://vercel.com) saytiga kiring
2. "Sign Up" tugmasini bosing
3. **GitHub bilan kirish** (tavsiya etiladi)
4. Vercel'ga GitHub ruxsati bering

### 2.3 Loyihani import qilish

1. Dashboard'da **"Add New Project"** tugmasini bosing
2. **"Import Git Repository"** ni tanlang
3. Quiz loyihasini qidiring va **"Import"** ni bosing
4. Sozlamalar:
   - **Framework Preset**: Next.js (avtomatik aniqlandi)
   - **Root Directory**: `./` (o'zgartirmang)
   - **Build Command**: `npm run build` (avtomatik)
   - **Output Directory**: `.next` (avtomatik)

### 2.4 Environment Variables qo'shish

⚠️ ENG MUHIM QADAM!

1. "Environment Variables" bo'limini oching
2. Quyidagi 2 ta o'zgaruvchini qo'shing:

   **Birinchi o'zgaruvchi:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Supabase'dan olgan URL (masalan: `https://xxxxxxxxx.supabase.co`)
   - Environments: Barchasini belgilang (Production, Preview, Development)

   **Ikkinchi o'zgaruvchi:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Supabase'dan olgan anon key (masalan: `eyJhbGc...`)
   - Environments: Barchasini belgilang

3. Environment Variables qo'shilganligini tekshiring

### 2.5 Deploy qilish

1. **"Deploy"** tugmasini bosing
2. 1-2 daqiqa kutasiz (build va deploy jarayoni)
3. "Congratulations!" xabari chiqadi 🎉
4. Saytingizning URL'ini oling: `https://your-app.vercel.app`

---

## 3️⃣ Test qilish va ishlatish

### 3.1 Saytni ochish

1. Vercel'dan olgan URL'ni brauzerda oching
2. Bosh sahifa ochilishi kerak

### 3.2 Admin panelga kirish

1. "Admin panel" tugmasini bosing
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. Kirish muvaffaqiyatli bo'lishi kerak

### 3.3 Birinchi quiz yaratish

1. Admin dashboard'da "Yangi quiz yaratish" tugmasini bosing
2. Quyidagilarni to'ldiring:
   - **Quiz nomi**: JavaScript Asoslari
   - **Tavsif**: JavaScript haqida asosiy savollar
   - **Vaqt limiti**: 10 daqiqa
3. Savollar qo'shing (kamida 5-10 ta)
4. "Quiz yaratish" tugmasini bosing

### 3.4 Test topshirish

1. Bosh sahifaga o'ting
2. "Test topshirish" tugmasini bosing
3. Yaratgan quizingizni tanlang
4. Ismingizni kiriting va testni boshlang
5. Barcha savollarga javob bering
6. Natijani ko'ring

### 3.5 Statistikani ko'rish

1. "Statistika" tugmasini bosing
2. Grafiklar va jadvallar ko'rinishi kerak
3. "CSV export" tugmasi bilan natijalarni yuklab olish mumkin

---

## 4️⃣ Qo'shimcha sozlamalar (ixtiyoriy)

### 4.1 Admin parolini o'zgartirish

⚠️ MUHIM: Production'da admin parolini o'zgartiring!

1. Supabase dashboard'ga o'ting
2. "SQL Editor" > "New query"
3. Quyidagi kodni ishga tushiring:

```sql
-- Yangi parolni o'rnatish (masalan: MySecurePass123!)
UPDATE admin_users
SET password_hash = crypt('MySecurePass123!', gen_salt('bf'))
WHERE username = 'admin';
```

4. Endi yangi parol bilan kirishingiz mumkin

### 4.2 Custom domain qo'shish (ixtiyoriy)

1. Vercel dashboard'da loyihangizni oching
2. "Settings" > "Domains"
3. O'zingizning domeningizni qo'shing (masalan: quiz.mydomain.com)
4. DNS sozlamalarini o'zgartiring (Vercel ko'rsatmalarini bajaring)
5. 5-10 daqiqadan keyin domen ishlay boshlaydi

### 4.3 Analytics qo'shish (ixtiyoriy)

Vercel avtomatik analytics beradi:

1. Vercel dashboard > "Analytics"
2. Realtime visitors va page views ko'ring
3. BEPUL!

---

## 5️⃣ Tez-tez beriladigan savollar (FAQ)

### ❓ Sayt ishlamayapti, nima qilish kerak?

1. Environment variables to'g'ri sozlanganligini tekshiring
2. Vercel dashboard'da "Deployments" > "Functions" loglarini ko'ring
3. Supabase dashboard'da "Logs" ni ko'ring

### ❓ "Supabase environment variables are not set" xatosi

Environment variables Vercel'da to'g'ri qo'shilganligini tekshiring:
- Vercel > Settings > Environment Variables
- Ikkala kalit ham to'g'ri nusxalangan
- Har uchala environment (Production, Preview, Development) belgilangan

### ❓ Admin panelga kirish ishlamayapti

1. Supabase'da `admin_users` jadvalidagi ma'lumotlarni tekshiring:
   ```sql
   SELECT * FROM admin_users;
   ```
2. Agar bo'sh bo'lsa, schema qaytadan ishga tushiring
3. Parolni qayta o'rnating (4.1 qarang)

### ❓ Statistika bo'sh ko'rinmoqda

Bu normal - hali testlar topshirilmagan. Biror test topshiring va statistika paydo bo'ladi.

### ❓ Narxi qancha?

- **Supabase Free tier**: 500 MB database, 2 GB bandwidth/oy (BEPUL!)
- **Vercel Free tier**: 100 GB bandwidth/oy (BEPUL!)
- Ko'p trafik bo'lsa, keyinroq upgrade qilish mumkin

---

## 6️⃣ Keyingi qadamlar

✅ Sayt ishlayapti
✅ Testlar yaratish mumkin
✅ Statistika ishlaydi

Endi:

1. 📱 **Guruhda ulashing** - Statistikadan screenshot olib, guruhda ulashing
2. 🎨 **Customizlashtiring** - Ranglar va dizaynni o'zgartiring
3. 📊 **Ko'proq test yarating** - Turli mavzularda testlar yarating
4. 🔒 **Parolni o'zgartiring** - Admin parolini yangilang

---

## 🆘 Yordam kerak bo'lsa

Muammo yuz bersa:

1. README.md faylini o'qing
2. Vercel va Supabase loglarini tekshiring
3. GitHub Issues'da savol bering

**Muvaffaqiyat tilaymiz!** 🎉

---

**Made with ❤️ by Claude**
