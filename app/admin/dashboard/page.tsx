'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, SUBJECTS } from '@/lib/supabase';
import type { Quiz, Subject } from '@/lib/supabase';
import translations from '@/lib/translations.kk';

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherFullName, setTeacherFullName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState<Subject | ''>('');
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    const role = localStorage.getItem('teacherRole');

    if (isLoggedIn !== 'true') {
      router.push('/admin');
      return;
    }

    // Super admin ga super-dashboard'ga yo'naltirish
    if (role === 'super_admin') {
      router.push('/admin/super-dashboard');
      return;
    }

    const fullName = localStorage.getItem('teacherFullName') || '';
    const subject = localStorage.getItem('teacherSubject') as Subject | '';

    setTeacherFullName(fullName);
    setTeacherSubject(subject);

    loadQuizzes(subject);
  }, [router]);

  const loadQuizzes = async (subject: Subject | '') => {
    if (!subject) {
      setLoading(false);
      return;
    }

    try {
      const teacherId = localStorage.getItem('teacherId');
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('subject', subject)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/admin');
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm(translations.teacherDashboard.confirmDelete)) return;

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadQuizzes(teacherSubject);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert(translations.errors.tryAgain);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">{translations.common.loading}</div>
      </div>
    );
  }

  const subjectLabel = SUBJECTS.find(s => s.value === teacherSubject)?.label || teacherSubject;
  const scheduledDay = SUBJECTS.find(s => s.value === teacherSubject)?.day || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{translations.teacherDashboard.title}</h1>
              <p className="text-gray-600 mt-1">{teacherFullName}</p>
              <p className="text-sm text-gray-500 mt-1">{subjectLabel}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all"
            >
              {translations.common.logout}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link
            href="/admin/create-quiz"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all shadow-lg"
          >
            {translations.teacherDashboard.createNewTest}
          </Link>
          <Link
            href="/stats"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all shadow-lg"
          >
            {translations.teacherDashboard.statistics}
          </Link>
          <Link
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all shadow-lg"
          >
            {translations.common.home}
          </Link>
        </div>

        {/* Quizzes List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{translations.teacherDashboard.myTests}</h2>

          {quizzes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">{translations.teacherDashboard.noTests}</p>
              <Link
                href="/admin/create-quiz"
                className="inline-block mt-4 text-blue-500 hover:text-blue-600 underline"
              >
                {translations.teacherDashboard.createFirstTest}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                      <p className="text-gray-600 mt-1">{quiz.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>⏱ {Math.floor(quiz.time_limit / 60)} {translations.time.minutes}</span>
                        <span>📅 {Object.values(translations.days)[quiz.scheduled_day]}</span>
                        <span>🕘 {quiz.scheduled_time.slice(0, 5)}</span>
                        <span>✍️ {quiz.author_name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        {translations.teacherDashboard.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
