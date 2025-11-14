# ⚡ Tez boshlash - 5 daqiqada

Loyihani mahalliy kompyuteringizda ishga tushirish uchun qisqa qo'llanma.

## 1. Tayyorgarlik

Quyidagilar o'rnatilgan bo'lishi kerak:
- Node.js (v18 yoki undan yuqori)
- npm yoki yarn

## 2. Paketlarni o'rnatish

```bash
npm install
```

## 3. Supabase sozlash

### Variant 1: Haqiqiy Supabase (tavsiya etiladi)

1. [supabase.com](https://supabase.com)da account oching (BEPUL)
2. Yangi loyiha yarating
3. SQL Editor'da `supabase-schema.sql` faylini ishga tushiring
4. Project Settings > API dan URL va Key oling
5. `.env.local` faylini yarating:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Variant 2: Test rejimida (tez)

`.env.local` fayli allaqachon mavjud, lekin faqat interfeys ishlaydi (database yo'q).

## 4. Ishga tushirish

```bash
npm run dev
```

Brauzerda oching: [http://localhost:3000](http://localhost:3000)

## 5. Login ma'lumotlari

**Admin panel:**
- Username: `admin`
- Password: `admin123`

## 6. Saytni test qilish

1. Bosh sahifa: [http://localhost:3000](http://localhost:3000)
2. Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
3. Test topshirish: [http://localhost:3000/quiz](http://localhost:3000/quiz)
4. Statistika: [http://localhost:3000/stats](http://localhost:3000/stats)

## 7. Keyingi qadamlar

- ✅ Admin panelga kiring va birinchi quizni yarating
- ✅ Test topshiring va natijani ko'ring
- ✅ Statistikani ko'ring va CSV export qiling
- ✅ Vercel'ga deploy qiling (DEPLOY.md faylini o'qing)

## 🆘 Muammolar

### Port band bo'lsa

Boshqa port ishlatish:

```bash
PORT=3001 npm run dev
```

### Build xatosi

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database xatosi

`.env.local` faylidagi Supabase ma'lumotlarini tekshiring.

---

**Muvaffaqiyat!** 🚀
