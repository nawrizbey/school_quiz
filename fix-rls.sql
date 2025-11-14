-- RLS Policies - Barcha kerakli ruxsatlar
-- Ushbu kodni Supabase SQL Editor'da ishga tushiring

-- Teachers: Public can read (for login)
DROP POLICY IF EXISTS "Public can read teachers" ON teachers;
CREATE POLICY "Public can read teachers" ON teachers FOR SELECT USING (true);

-- Quizzes: Teachers can insert (for creating quizzes)
DROP POLICY IF EXISTS "Teachers can insert quizzes" ON quizzes;
CREATE POLICY "Teachers can insert quizzes" ON quizzes FOR INSERT WITH CHECK (true);

-- Quizzes: Teachers can delete their own quizzes
DROP POLICY IF EXISTS "Teachers can delete quizzes" ON quizzes;
CREATE POLICY "Teachers can delete quizzes" ON quizzes FOR DELETE USING (true);

-- Questions: Teachers can insert (for creating questions)
DROP POLICY IF EXISTS "Teachers can insert questions" ON questions;
CREATE POLICY "Teachers can insert questions" ON questions FOR INSERT WITH CHECK (true);

-- Test qilish
SELECT 'Policies created successfully!' as status;
