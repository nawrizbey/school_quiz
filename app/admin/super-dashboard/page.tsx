'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, SUBJECTS } from '@/lib/supabase';
import type { Quiz, Teacher } from '@/lib/supabase';
import translations from '@/lib/translations.kk';

export default function SuperAdminDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    const role = localStorage.getItem('teacherRole');

    if (isLoggedIn !== 'true' || role !== 'super_admin') {
      router.push('/admin');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // Load all quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (quizzesError) throw quizzesError;
      setQuizzes(quizzesData || []);

      // Load all teachers
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*')
        .order('full_name', { ascending: true });

      if (teachersError) throw teachersError;
      setTeachers(teachersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
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
      loadData();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert(translations.errors.tryAgain);
    }
  };

  const copyQuizLink = (quizId: string) => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert(translations.teacherDashboard.linkCopied.replace('{link}', link));
    }).catch(() => {
      alert('Link: ' + link);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">{translations.common.loading}</div>
      </div>
    );
  }

  const filteredQuizzes = selectedSubject === 'all'
    ? quizzes
    : quizzes.filter(q => q.subject === selectedSubject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{translations.superAdminDashboard.title}</h1>
              <p className="text-gray-600 mt-1">{translations.superAdminDashboard.subtitle}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all"
            >
              {translations.common.logout}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 text-white rounded-xl p-6">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold">{quizzes.length}</div>
            <div>{translations.superAdminDashboard.totalTests}</div>
          </div>
          <div className="bg-green-500 text-white rounded-xl p-6">
            <div className="text-4xl mb-2">👨‍🏫</div>
            <div className="text-3xl font-bold">{teachers.filter(t => t.role === 'teacher').length}</div>
            <div>{translations.superAdminDashboard.teachers}</div>
          </div>
          <div className="bg-purple-500 text-white rounded-xl p-6">
            <div className="text-4xl mb-2">📖</div>
            <div className="text-3xl font-bold">{SUBJECTS.length}</div>
            <div>{translations.superAdminDashboard.subjects}</div>
          </div>
          <Link
            href="/stats"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 transition-all"
          >
            <div className="text-4xl mb-2">📊</div>
            <div className="text-xl font-bold">{translations.statistics.title}</div>
            <div>{translations.superAdminDashboard.viewStats} →</div>
          </Link>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedSubject === 'all'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {translations.superAdminDashboard.allTests} ({quizzes.length})
            </button>
            {SUBJECTS.map((subject) => {
              const count = quizzes.filter(q => q.subject === subject.value).length;
              return (
                <button
                  key={subject.value}
                  onClick={() => setSelectedSubject(subject.value)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedSubject === subject.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {subject.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Quizzes List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{translations.superAdminDashboard.allQuizzes}</h2>

          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">{translations.teacherDashboard.noTests}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => {
                const subjectLabel = SUBJECTS.find(s => s.value === quiz.subject)?.label || quiz.subject;
                return (
                  <div
                    key={quiz.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {subjectLabel}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                        <p className="text-gray-600 mt-1">{quiz.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                          <span>⏱ {Math.floor(quiz.time_limit / 60)} {translations.time.minutes}</span>
                          <span>📅 {Object.values(translations.days)[quiz.scheduled_day]}</span>
                          <span>🕘 {quiz.scheduled_time.slice(0, 5)}</span>
                          <span>✍️ {quiz.author_name}</span>
                          <span>📆 {new Date(quiz.created_at).toLocaleDateString('uz-UZ')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-col">
                        <button
                          onClick={() => router.push(`/admin/edit-quiz/${quiz.id}`)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                        >
                          {translations.teacherDashboard.edit}
                        </button>
                        <button
                          onClick={() => copyQuizLink(quiz.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                        >
                          {translations.teacherDashboard.copyLink}
                        </button>
                        <button
                          onClick={() => deleteQuiz(quiz.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                        >
                          {translations.teacherDashboard.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
