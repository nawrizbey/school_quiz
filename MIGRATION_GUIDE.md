# 🔄 Yangilanish qo'llanmasi

Loyiha yangilandi: **Maktab haftalik test tizimi**

## ✅ Nima o'zgardi?

### 1. Database o'zgarishlari
- ❌ Eski: `admin_users` jadvali
- ✅ Yangi: `teachers` jadvali (subject, role bilan)
- ✅ `quizzes` ga qo'shildi: subject, scheduled_day, scheduled_time, author_name
- ✅ `results` ga qo'shildi: class_number (eski: user_name -> student_name)

### 2. Authentication o'zgarishlari
- ❌ Eski: 1 ta admin (username: admin)
- ✅ Yangi: 6 ta account:
  - **Super Admin**: superadmin / admin123
  - **Matematika**: matematika / math123
  - **Biologiya**: biologiya / bio123
  - **Ingliz tili**: ingliz / eng123
  - **Umumiy fanlar**: umumiy / general123
  - **Zakovat**: zakovat / logic123

### 3. Dashboard'lar
- ❌ Eski: 1 ta admin dashboard
- ✅ Yangi:
  - `/admin/dashboard` - Teacher dashboard (faqat o'z fanini ko'radi)
  - `/admin/super-dashboard` - Super admin dashboard (barchani ko'radi)

## 🚀 Yangilashni qo'llash

### Qadamlar:

1. **Supabase'da eski database'ni o'chirish (agar test ma'lumotlari bo'lsa)**
   - Supabase > SQL Editor
   - Quyidagi kodni ishga tushiring:

```sql
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
```

2. **Yangi schema'ni o'rnatish**
   - `supabase-schema.sql` faylini oching
   - Butun kodni nusxalang
   - Supabase SQL Editor'da ishga tushiring

3. **Loyihani pull qilish (agar GitHub'dan bo'lsa)**
   ```bash
   git pull origin main
   ```

4. **Paketlarni yangilash (agar zarur bo'lsa)**
   ```bash
   npm install
   ```

5. **Build qilish**
   ```bash
   npm run build
   ```

6. **Vercel'da yangilash (agar deploy qilingan bo'lsa)**
   - Vercel avtomatik yangilaydi (git push qilganingizdan keyin)
   - Yoki Vercel dashboard'da "Redeploy" tugmasini bosing

## 📝 TODO: Qolgan sahifalar

Quyidagi sahifalar hali to'liq yangilanmagan. Men asosiy strukturani yaratdim, lekin har bir sahifani to'liq yangilash kerak:

### 1. `/admin/create-quiz/page.tsx` - YANGILASH KERAK ✏️

Qo'shilishi kerak:
- Subject dropdown (faqat o'qituvchining fanini ko'rsatish)
- Scheduled day dropdown (avtomatik subject'ga qarab belgilanadi)
- Scheduled time input (default: 21:00)
- Author name (avtomatik localStorage'dan olinadi)

### 2. `/quiz/page.tsx` - YANGILASH KERAK ✏️

Qo'shilishi kerak:
- Faqat bugungi kunning testini ko'rsatish
- Agar bugun test kuni bo'lmasa: "Bugun test yo'q" xabari
- Agar hali soat 21:00 bo'lmasa: "Test soat 21:00 da boshlanadi" xabari

### 3. `/quiz/[id]/page.tsx` - YANGILASH KERAK ✏️

Qo'shilishi kerak:
- Class number input (7, 8, 9, 10, 11 dropdown)
- Student name va familya input

### 4. `/stats/page.tsx` - YANGILASH KERAK ✏️

Qo'shilishi kerak:
- Subject filter
- Class filter
- Teacher name ko'rsatish

## 🛠 Tez yangilash (agar vaqt bo'lsa)

Men asosiy strukturani yaratdim. Qolgan sahifalarni yangilash uchun:

1. Supabase schema yangilangan ✅
2. TypeScript types yangilangan ✅
3. Login API yangilangan ✅
4. Teacher dashboard yangilangan ✅
5. Super admin dashboard yangilangan ✅

Qolganlari (TODO):
- [ ] Create quiz formasi - subject va schedule qo'shish
- [ ] Quiz list - bugungi kunning testini filter qilish
- [ ] Quiz topshirish - class_number qo'shish
- [ ] Stats - subject va class filter

## 📞 Yordam kerakmi?

Agar yuqoridagi sahifalarni yangilashda yordam kerak bo'lsa, menga ayting:
- Qaysi sahifani yangilash kerak?
- Qanday o'zgarishlar kerak?

Men har bir sahifani alohida-alohida yangilayman.

---

**Asosiy struktura tayyor!** 🎉

Yangi login ma'lumotlar bilan kirish mumkin:
- superadmin / admin123
- matematika / math123
- va h.k.
