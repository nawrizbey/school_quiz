-- Fix RLS policies for quiz editing
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Public can insert quizzes" ON quizzes;
DROP POLICY IF EXISTS "Public can update quizzes" ON quizzes;
DROP POLICY IF EXISTS "Public can delete quizzes" ON quizzes;
DROP POLICY IF EXISTS "Public can insert questions" ON questions;
DROP POLICY IF EXISTS "Public can update questions" ON questions;
DROP POLICY IF EXISTS "Public can delete questions" ON questions;
DROP POLICY IF EXISTS "Public can read teachers" ON teachers;

-- Allow public to INSERT quizzes (for teachers to create)
CREATE POLICY "Public can insert quizzes"
ON quizzes FOR INSERT
WITH CHECK (true);

-- Allow public to UPDATE quizzes (for teachers/super admin to edit)
CREATE POLICY "Public can update quizzes"
ON quizzes FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public to DELETE quizzes (for teachers/super admin)
CREATE POLICY "Public can delete quizzes"
ON quizzes FOR DELETE
USING (true);

-- Allow public to INSERT questions (for creating/editing quizzes)
CREATE POLICY "Public can insert questions"
ON questions FOR INSERT
WITH CHECK (true);

-- Allow public to UPDATE questions (for editing quizzes)
CREATE POLICY "Public can update questions"
ON questions FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public to DELETE questions (for editing quizzes)
CREATE POLICY "Public can delete questions"
ON questions FOR DELETE
USING (true);

-- Allow public to read teachers (for login)
CREATE POLICY "Public can read teachers"
ON teachers FOR SELECT
USING (true);
