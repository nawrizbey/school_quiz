'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Result, Quiz } from '@/lib/supabase';

interface ResultWithQuiz extends Result {
  quiz_title?: string;
}

export default function DebugResults() {
  const [results, setResults] = useState<ResultWithQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllResults();
  }, []);

  const loadAllResults = async () => {
    try {
      // Barcha natijalarni yuklash
      const { data: allResults, error: resultsError } = await supabase
        .from('results')
        .select('*')
        .order('created_at', { ascending: false });

      if (resultsError) throw resultsError;

      // Har bir natija uchun test nomini yuklash
      const resultsWithQuiz: ResultWithQuiz[] = [];
      for (const result of allResults || []) {
        const { data: quiz } = await supabase
          .from('quizzes')
          .select('title, subject')
          .eq('id', result.quiz_id)
          .single();

        resultsWithQuiz.push({
          ...result,
          quiz_title: quiz?.title || 'Unknown',
        });
      }

      setResults(resultsWithQuiz);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Barcha Natijalarni Tekshirish
          </h1>
          <p className="text-gray-600">
            Jami natijalar: <strong>{results.length}</strong>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2">#</th>
                  <th className="text-left py-3 px-2">Test nomi</th>
                  <th className="text-left py-3 px-2">O'quvchi ismi</th>
                  <th className="text-center py-3 px-2">Sinf</th>
                  <th className="text-center py-3 px-2">Ball</th>
                  <th className="text-center py-3 px-2">Vaqt</th>
                  <th className="text-left py-3 px-2">Sana</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-2 text-gray-800">
                      {result.quiz_title}
                    </td>
                    <td className="py-3 px-2 text-gray-800 font-medium">
                      "{result.student_name}"
                      <div className="text-xs text-gray-500 mt-1">
                        Uzunlik: {result.student_name.length} belgi
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-gray-800">
                      {result.class_number}
                    </td>
                    <td className="text-center py-3 px-2 text-gray-800">
                      {result.score} / {result.total_questions}
                      <div className="text-xs text-gray-500">
                        ({Math.round((result.score / result.total_questions) * 100)}%)
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-gray-800">
                      {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(result.created_at).toLocaleString('uz-UZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Hech qanday natija topilmadi
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-800 mb-2">Diqqat:</h3>
          <p className="text-yellow-700 text-sm">
            Bu sahifa faqat tekshirish uchun. Agar biror natija ko'rinmasa, ismni diqqat bilan tekshiring.
            Ism ichida bo'sh joylar yoki maxsus belgilar bo'lishi mumkin.
          </p>
        </div>
      </div>
    </div>
  );
}
