'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Quiz, Result } from '@/lib/supabase';
import translations from '@/lib/translations.kk';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface QuizStats {
  quiz: Quiz;
  results: Result[];
  avgScore: number;
  avgTime: number;
  totalAttempts: number;
}

export default function Statistics() {
  const [stats, setStats] = useState<QuizStats[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is logged in as super admin
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    const role = localStorage.getItem('teacherRole');
    if (isLoggedIn !== 'true' || role !== 'super_admin') {
      window.location.href = '/admin';
      return;
    }
    setIsAuthorized(true);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (quizzesError) throw quizzesError;

      const statsData: QuizStats[] = [];

      for (const quiz of quizzes || []) {
        const { data: results, error: resultsError } = await supabase
          .from('results')
          .select('*')
          .eq('quiz_id', quiz.id)
          .order('score', { ascending: false })
          .order('time_taken', { ascending: true });

        if (resultsError) throw resultsError;

        const avgScore = results && results.length > 0
          ? results.reduce((sum, r) => sum + r.score, 0) / results.length
          : 0;

        const avgTime = results && results.length > 0
          ? results.reduce((sum, r) => sum + r.time_taken, 0) / results.length
          : 0;

        statsData.push({
          quiz,
          results: results || [],
          avgScore,
          avgTime,
          totalAttempts: results?.length || 0,
        });
      }

      setStats(statsData);
      if (statsData.length > 0) {
        setSelectedQuiz(statsData[0].quiz.id);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const selectedStats = stats.find(s => s.quiz.id === selectedQuiz);
    if (!selectedStats || selectedStats.results.length === 0) {
      alert(translations.statistics.noData);
      return;
    }

    const headers = [translations.statistics.name, translations.statistics.class, translations.statistics.score, 'Total', translations.statistics.percentage, translations.statistics.time, translations.statistics.date];
    const rows = selectedStats.results.map(r => [
      r.student_name,
      r.class_number.toString(),
      r.score.toString(),
      r.total_questions.toString(),
      `${Math.round((r.score / r.total_questions) * 100)}%`,
      r.time_taken.toString(),
      new Date(r.created_at).toLocaleString('uz-UZ'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedStats.quiz.title}_statistics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">{translations.common.loading}</div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{translations.statistics.title}</h1>
          <p className="text-gray-600 mb-6">{translations.statistics.noStatsYet}</p>
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all"
          >
            {translations.common.home}
          </Link>
        </div>
      </div>
    );
  }

  const selectedStats = stats.find(s => s.quiz.id === selectedQuiz);

  // Prepare chart data
  const scoreDistribution = selectedStats?.results.reduce((acc: any, r) => {
    const percentage = Math.round((r.score / r.total_questions) * 100);
    const range = percentage >= 90 ? '90-100%' :
                  percentage >= 80 ? '80-89%' :
                  percentage >= 70 ? '70-79%' :
                  percentage >= 60 ? '60-69%' : '0-59%';
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {}) || {};

  const scoreChartData = Object.entries(scoreDistribution).map(([range, count]) => ({
    range,
    count,
  }));

  const timeChartData = selectedStats?.results
    .slice(0, 10)
    .reverse()
    .map((r, index) => ({
      name: `${index + 1}`,
      time: Math.round(r.time_taken / 60),
    })) || [];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{translations.statistics.title}</h1>
              <p className="text-gray-600 mt-1">{translations.statistics.subtitle}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all"
              >
                {translations.statistics.exportCSV}
              </button>
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all inline-block text-center"
              >
                {translations.common.home}
              </Link>
            </div>
          </div>
        </div>

        {/* Quiz Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {translations.statistics.selectQuiz}
          </label>
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
          >
            {stats.map((s) => (
              <option key={s.quiz.id} value={s.quiz.id}>
                {s.quiz.title} ({s.totalAttempts} {translations.statistics.attempts})
              </option>
            ))}
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold">{selectedStats?.totalAttempts || 0}</div>
            <div className="text-purple-100">{translations.statistics.totalAttempts}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold">
              {selectedStats ? Math.round(selectedStats.avgScore * 10) / 10 : 0} / {selectedStats?.results[0]?.total_questions || 0}
            </div>
            <div className="text-blue-100">{translations.statistics.averageScore}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-4xl mb-2">⏱</div>
            <div className="text-3xl font-bold">
              {selectedStats ? Math.round(selectedStats.avgTime / 60) : 0} {translations.time.minutes}
            </div>
            <div className="text-green-100">{translations.statistics.averageTime}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{translations.statistics.scoreDistribution}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Time Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{translations.statistics.lastTestTimes}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Results Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{translations.statistics.recentResults}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700">{translations.statistics.name}</th>
                  <th className="text-center py-3 px-4 text-gray-700">{translations.statistics.class}</th>
                  <th className="text-center py-3 px-4 text-gray-700">{translations.statistics.score}</th>
                  <th className="text-center py-3 px-4 text-gray-700">{translations.statistics.percentage}</th>
                  <th className="text-center py-3 px-4 text-gray-700">{translations.statistics.time}</th>
                  <th className="text-left py-3 px-4 text-gray-700">{translations.statistics.date}</th>
                </tr>
              </thead>
              <tbody>
                {selectedStats?.results.slice(0, 20).map((result) => {
                  const percentage = Math.round((result.score / result.total_questions) * 100);
                  return (
                    <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{result.student_name}</td>
                      <td className="text-center py-3 px-4 text-gray-800">{result.class_number}</td>
                      <td className="text-center py-3 px-4 text-gray-800">
                        {result.score} / {result.total_questions}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          percentage >= 90 ? 'bg-green-100 text-green-800' :
                          percentage >= 70 ? 'bg-blue-100 text-blue-800' :
                          percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-800">
                        {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(result.created_at).toLocaleString('uz-UZ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
