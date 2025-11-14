-- Quiz App Database Schema - Maktab versiyasi
-- Ushbu SQL kodni Supabase SQL Editor'da ishga tushiring

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Teachers table (o'qituvchilar va super admin)
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    subject TEXT, -- matematika, biologiya, ingliz_tili, umumiy_fanlar, zakovat
    role TEXT NOT NULL DEFAULT 'teacher', -- teacher, super_admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes table (testlar)
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL, -- matematika, biologiya, ingliz_tili, umumiy_fanlar, zakovat
    time_limit INTEGER DEFAULT 600, -- seconds (default 10 min)
    scheduled_day INTEGER NOT NULL, -- 1=dushanba, 2=seshanba, 3=chorshanba, 4=payshanba, 5=juma
    scheduled_time TIME DEFAULT '21:00:00',
    author_name TEXT NOT NULL, -- o'qituvchining F.I.O.
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- array of options
    correct_option INTEGER NOT NULL, -- index of correct option (0-based)
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Results table (o'quvchilar natijalari)
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL, -- ism familiya
    class_number INTEGER NOT NULL, -- 7, 8, 9, 10, 11
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken INTEGER NOT NULL, -- seconds
    answers JSONB, -- array of user answers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_results_quiz_id ON results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject);
CREATE INDEX IF NOT EXISTS idx_quizzes_scheduled_day ON quizzes(scheduled_day);
CREATE INDEX IF NOT EXISTS idx_teachers_subject ON teachers(subject);

-- RLS (Row Level Security) policies
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Public read access for quizzes and questions
CREATE POLICY "Public can read quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Public can read questions" ON questions FOR SELECT USING (true);

-- Public can insert results
CREATE POLICY "Public can insert results" ON results FOR INSERT WITH CHECK (true);

-- Public can read results (for statistics)
CREATE POLICY "Public can read results" ON results FOR SELECT USING (true);

-- Insert default teachers (5 kafedra + 1 super admin)
-- IMPORTANT: Change passwords in production!

-- Super Admin
INSERT INTO teachers (username, password_hash, full_name, role)
VALUES ('superadmin', crypt('admin123', gen_salt('bf')), 'Super Administrator', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Matematika o'qituvchisi
INSERT INTO teachers (username, password_hash, full_name, subject, role)
VALUES ('matematika', crypt('math123', gen_salt('bf')), 'Matematika kafedra', 'matematika', 'teacher')
ON CONFLICT (username) DO NOTHING;

-- Biologiya o'qituvchisi
INSERT INTO teachers (username, password_hash, full_name, subject, role)
VALUES ('biologiya', crypt('bio123', gen_salt('bf')), 'Biologiya kafedra', 'biologiya', 'teacher')
ON CONFLICT (username) DO NOTHING;

-- Ingliz tili o'qituvchisi
INSERT INTO teachers (username, password_hash, full_name, subject, role)
VALUES ('ingliz', crypt('eng123', gen_salt('bf')), 'Ingliz tili kafedra', 'ingliz_tili', 'teacher')
ON CONFLICT (username) DO NOTHING;

-- Umumiy fanlar o'qituvchisi
INSERT INTO teachers (username, password_hash, full_name, subject, role)
VALUES ('umumiy', crypt('general123', gen_salt('bf')), 'Umumiy fanlar kafedra', 'umumiy_fanlar', 'teacher')
ON CONFLICT (username) DO NOTHING;

-- Zakovat/Logika o'qituvchisi
INSERT INTO teachers (username, password_hash, full_name, subject, role)
VALUES ('zakovat', crypt('logic123', gen_salt('bf')), 'Zakovat va logika kafedra', 'zakovat', 'teacher')
ON CONFLICT (username) DO NOTHING;
