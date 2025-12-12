-- Test kirish oynasi va takroriy topshirishni oldini olish
-- Entry window va duplicate submission prevention
-- 2025-01-12

-- 1. Quizzes jadvaliga entry_window ustuni qo'shish (sekundlarda, default 180 = 3 daqiqa)
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS entry_window INTEGER DEFAULT 180;

COMMENT ON COLUMN quizzes.entry_window IS 'Testga kirib olish uchun vaqt (sekundlarda). Default 180 = 3 daqiqa';

-- 2. Results jadvaliga UNIQUE constraint qo'shish
-- Bir o'quvchi bir xil testni faqat bir marta topshira oladi
ALTER TABLE results
ADD CONSTRAINT unique_student_quiz
UNIQUE (quiz_id, student_name, class_number);

-- 3. Results jadvaliga started_at ustuni qo'shish (o'quvchi qachon boshlaganini bilish uchun)
ALTER TABLE results
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN results.started_at IS 'O\'quvchi testni qachon boshlagani';

-- 4. Mavjud ma'lumotlarni tozalash (agar takroriy ma'lumotlar bo'lsa)
-- DIQQAT: Bu faqat birinchi marta ishga tushirish uchun!
-- Agar production'da ishlatayotgan bo'lsangiz, avval backup oling!

-- Takroriy natijalarni topish va eng oxirgisini qoldirish
WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY quiz_id, student_name, class_number
      ORDER BY created_at DESC
    ) as rn
  FROM results
)
DELETE FROM results
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 5. Index qo'shish (tezroq ishlash uchun)
CREATE INDEX IF NOT EXISTS idx_results_student_quiz
ON results(quiz_id, student_name, class_number);

-- Muvaffaqiyatli! ✅
SELECT 'Entry window va unique constraint qo''shildi!' as message;
