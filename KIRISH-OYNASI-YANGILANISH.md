# Kirish Oynasi va Takroriy Topshirishni Oldini Olish

## 📋 Qanday muammo hal qilindi?

**Muammo:** O'quvchilar test natijalarini ko'rgandan keyin qaytadan testga kirib, takroriy topshirishlari mumkin edi.

**Yechim:** Kirish oynasi (Entry Window) tizimi va database-level himoya qo'shildi.

---

## ✨ Yangi funksiyalar

### 1. **Kirish Oynasi (Entry Window)**
- O'qituvchi test yaratganida **kirish oynasi** vaqtini belgilaydi (default: 3 daqiqa)
- Misol: Test soat 21:00 da boshlanadi, kirish oynasi 3 daqiqa
  - **21:00 - 21:03:** O'quvchilar kirishi mumkin
  - **21:03 dan keyin:** Yangi o'quvchilar kira olmaydi
  - **21:00 - 21:03 ichida kirganlar:** O'z to'liq vaqti bilan ishlaydi (masalan, 20 daqiqa)

### 2. **Har bir o'quvchi to'liq vaqt oladi**
- Eski tizim: Kech kirgan o'quvchi kamroq vaqt olardi
- **Yangi tizim:** Kirish oynasi ichida kirgan barcha o'quvchilar **to'liq vaqt** oladi

### 3. **Takroriy topshirishni oldini olish**
- Database-da UNIQUE constraint qo'shildi
- Bir o'quvchi bir xil testni faqat **1 marta** topshirishi mumkin
- Agar qayta topshirmoqchi bo'lsa, xatolik ko'rsatiladi

---

## 🗄️ O'zgarishlar

### Fayl o'zgarishlari:

| Fayl | O'zgarish |
|------|-----------|
| `add-entry-window-and-unique-constraint.sql` | ✅ Yangi (database migration) |
| `lib/supabase.ts` | ✅ Quiz va Result turlariga `entry_window` va `started_at` qo'shildi |
| `app/quiz/[id]/page.tsx` | ✅ Kirish oynasi logikasi, to'liq vaqt berish |
| `app/admin/create-quiz/page.tsx` | ✅ Kirish oynasi input qo'shildi |
| `app/admin/edit-quiz/[id]/page.tsx` | ✅ Kirish oynasi input qo'shildi |

---

## 📦 Database o'zgarishlari

### Yangi ustunlar:

**quizzes jadvali:**
```sql
entry_window INTEGER DEFAULT 180  -- sekundlarda (3 daqiqa)
```

**results jadvali:**
```sql
started_at TIMESTAMP WITH TIME ZONE  -- o'quvchi qachon boshlagan
```

### Yangi constraint:
```sql
CONSTRAINT unique_student_quiz
UNIQUE (quiz_id, student_name, class_number)
```

Bu constraint bir o'quvchining bir xil testni ikki marta topshirishini to'xtatadi.

---

## 🚀 Qanday ishlatish

### 1. Database Migration (MUHIM!)

Supabase SQL Editor'ga kiring va quyidagi faylni ishga tushiring:

```bash
add-entry-window-and-unique-constraint.sql
```

Bu fayl:
- ✅ `entry_window` ustunini qo'shadi
- ✅ `started_at` ustunini qo'shadi
- ✅ UNIQUE constraint qo'shadi
- ✅ Eski takroriy ma'lumotlarni tozalaydi

### 2. Yangi test yaratish

1. Admin paneliga kiring
2. "Test yaratish" tugmasini bosing
3. Yangi maydonni ko'rasiz: **"Kirish oynasi (daqiqa)"**
4. Default qiymat: **3 daqiqa**
5. Testni saqlang

### 3. Test qanday ishlaydi?

**Misol:**
- Test vaqti: 21:00
- Kirish oynasi: 3 daqiqa
- Test davomiyligi: 20 daqiqa

**Timeline:**
```
21:00:00 - Test boshlanadi
21:00:00 - 21:03:00 → Kirish oynasi (yangi o'quvchilar kirishi mumkin)
21:03:00 → Kirish oynasi yopildi (yangi o'quvchilar kira olmaydi)
21:00:00 - 21:23:00 → Test davom etadi (oldin kirganlar ishlaydi)
21:23:00 → Test butunlay tugadi
```

**O'quvchi 21:00 da kirdi:**
- Boshlanish vaqti: 21:00
- Test tugash vaqti: 21:20 (to'liq 20 daqiqa)

**O'quvchi 21:02 da kirdi:**
- Boshlanish vaqti: 21:02
- Test tugash vaqti: 21:22 (to'liq 20 daqiqa) ✅

**O'quvchi 21:04 da kirmoqchi bo'ldi:**
- ❌ Kira olmaydi! "Kirish vaqti tugadi" xabari chiqadi

---

## 🔐 Xavfsizlik

### Database-level himoya:
```sql
UNIQUE (quiz_id, student_name, class_number)
```

Agar o'quvchi qayta topshirmoqchi bo'lsa:
```
Error: duplicate key value violates unique constraint "unique_student_quiz"
```

### Foydalanuvchi uchun xabar:
```
"Siz bu testni allaqachon topshirgansiz!"
```

---

## 📊 Eski testlar uchun

**Eski testlar (entry_window yo'q):**
- Default qiymat: **180 sekund (3 daqiqa)** avtomatik qo'llaniladi
- Hech narsa buzilmaydi
- Barcha eski testlar yangi tizim bilan ishlaydi

**Eski takroriy natijalar:**
- Migration script avtomatik tozalaydi
- Har bir o'quvchining eng oxirgi natijasi saqlanadi

---

## 🧪 Test qilish

### 1. Database migration

```sql
-- Supabase SQL Editor'da:
SELECT * FROM quizzes LIMIT 1;
-- entry_window ustuni borligini tekshiring
```

### 2. Yangi test yaratish

1. Admin → Create Quiz
2. "Kirish oynasi" maydonini ko'ring
3. 3 daqiqa qoldiring
4. Test yarating

### 3. Test topshirish

**Scenario 1: Normal kirish**
- Test 21:00 da boshlanadi
- 21:01 da kirish
- ✅ To'liq vaqt beriladi

**Scenario 2: Kech kirish**
- Test 21:00 da boshlanadi
- 21:04 da kirish (kirish oynasi yopilgan)
- ❌ "Kirish vaqti tugadi" xabari

**Scenario 3: Takroriy topshirish**
- Birinchi marta topshirish ✅
- Ikkinchi marta topshirmoqchi bo'lish ❌
- "Siz bu testni allaqachon topshirgansiz!"

---

## 🐛 Muammolar va yechimlar

### Muammo 1: "entry_window column does not exist"
**Yechim:** Database migration ishga tushmagan. `add-entry-window-and-unique-constraint.sql` faylini ishga tushiring.

### Muammo 2: "unique constraint violated"
**Yechim:** O'quvchi allaqachon test topshirgan. Bu normal xatti-harakat.

### Muammo 3: Eski testlar ishlamayapti
**Yechim:** Eski testlar avtomatik ravishda 3 daqiqa kirish oynasi oladi. Agar o'zgartirish kerak bo'lsa, "Edit Quiz" orqali tahrirlang.

---

## 📝 Qo'shimcha ma'lumotlar

### Kirish oynasini o'zgartirish:
- Min: 1 daqiqa
- Max: 30 daqiqa
- Default: 3 daqiqa

### Test davomiyligi:
- Min: 1 daqiqa
- Max: 120 daqiqa

### To'liq test vaqti:
```
Umumiy vaqt = Kirish oynasi + Test davomiyligi
```

Misol: 3 daqiqa kirish + 20 daqiqa test = 23 daqiqa umumiy vaqt

---

## ✅ Tekshirish ro'yxati

- [ ] Database migration ishga tushirildi
- [ ] Yangi test yaratish ishlayapti
- [ ] Kirish oynasi input ko'rinadi
- [ ] O'quvchi to'liq vaqt oladi
- [ ] Kech kirganlar bloklanadi
- [ ] Takroriy topshirish bloklanadi
- [ ] Eski testlar ishlayapti

---

## 🎉 Yakunlash

Endi sizning test tizimingiz:
- ✅ Kirish oynasi bilan ishlaydi
- ✅ Har bir o'quvchi to'liq vaqt oladi
- ✅ Takroriy topshirishni to'xtatadi
- ✅ Database-level himoyalangan
- ✅ Production uchun tayyor

**Savollar bo'lsa, yozing!** 🚀
