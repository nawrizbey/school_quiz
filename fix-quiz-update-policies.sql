-- Fix RLS policies for quiz editing
-- Run this in Supabase SQL Editor

-- Allow public to INSERT quizzes (for teachers to create)
CREATE POLICY IF NOT EXISTS "Public can insert quizzes"
ON quizzes FOR INSERT
WITH CHECK (true);

-- Allow public to UPDATE quizzes (for teachers/super admin to edit)
CREATE POLICY IF NOT EXISTS "Public can update quizzes"
ON quizzes FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public to DELETE quizzes (for teachers/super admin)
CREATE POLICY IF NOT EXISTS "Public can delete quizzes"
ON quizzes FOR DELETE
USING (true);

-- Allow public to INSERT questions (for creating/editing quizzes)
CREATE POLICY IF NOT EXISTS "Public can insert questions"
ON questions FOR INSERT
WITH CHECK (true);

-- Allow public to UPDATE questions (for editing quizzes)
CREATE POLICY IF NOT EXISTS "Public can update questions"
ON questions FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public to DELETE questions (for editing quizzes)
CREATE POLICY IF NOT EXISTS "Public can delete questions"
ON questions FOR DELETE
USING (true);

-- Allow public to read teachers (for login)
CREATE POLICY IF NOT EXISTS "Public can read teachers"
ON teachers FOR SELECT
USING (true);
