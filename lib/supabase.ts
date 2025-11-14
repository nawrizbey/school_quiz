import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn('⚠️ Supabase environment variables are not set. Please configure .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Subject = 'matematika' | 'biologiya' | 'ingliz_tili' | 'umumiy_fanlar' | 'zakovat';
export type Role = 'super_admin' | 'teacher';

export interface Teacher {
  id: string;
  username: string;
  full_name: string;
  subject: Subject | null;
  role: Role;
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  time_limit: number; // in seconds
  scheduled_day: number; // 1-5 (dushanba-juma)
  scheduled_time: string; // '21:00:00'
  author_name: string;
  teacher_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  order: number;
  question_image_url?: string | null;
  option_images?: Record<string, string> | null; // {"0": "url", "1": "url", ...}
}

export interface Result {
  id: string;
  quiz_id: string;
  student_name: string;
  class_number: number; // 4, 5, 6
  score: number;
  total_questions: number;
  time_taken: number; // in seconds
  answers?: number[];
  created_at: string;
}

// Helper constants
export const SUBJECTS: { value: Subject; label: string; day: number }[] = [
  { value: 'matematika', label: 'Matematika', day: 1 },
  { value: 'biologiya', label: 'Biologiya', day: 2 },
  { value: 'ingliz_tili', label: 'Ingliz tili', day: 3 },
  { value: 'umumiy_fanlar', label: 'Umumiy fanlar', day: 4 },
  { value: 'zakovat', label: 'Zakovat va logika', day: 5 },
];

export const DAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
];

export const CLASSES = [4, 5, 6];
