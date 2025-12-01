'use client';

import { use, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Result, Quiz, Question } from '@/lib/supabase';
import translations from '@/lib/translations.kk';

export default function QuizResult({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultId = searchParams.get('resultId');

  const [result, setResult] = useState<Result | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      loadResultData();
    }
  }, [resultId]);

  // Prevent back button navigation
  useEffect(() => {
    // Push a new state to prevent going back
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // Push state again to block back navigation
      window.history.pushState(null, '', window.location.href);
      alert(translations.quizResult.cannotGoBack || "Siz artqa qaytıp bılmaysız. Nátiyje kórildı.");
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Prevent page reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const loadResultData = async () => {
    try {
      // Load result
      const { data: resultData, error: resultError } = await supabase
        .from('results')
        .select('*')
        .eq('id', resultId)
        .single();

      if (resultError) throw resultError;
      setResult(resultData);

      // Load quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (quizError) throw quizError;
      setQuiz(quizData);

      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', resolvedParams.id)
        .order('order', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
    } catch (error) {
      // Error loading result
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-2xl text-white">{translations.common.loading}</div>
      </div>
    );
  }

  if (!result || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-2xl text-white">{translations.quizResult.resultNotFound}</div>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.total_questions) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} ${translations.time.minutes} ${secs} ${translations.time.seconds}`;
  };

  const getEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🎉';
    if (percentage >= 50) return '👍';
    return '📚';
  };

  const getMessage = () => {
    if (percentage >= 90) return translations.quizResult.excellent;
    if (percentage >= 70) return translations.quizResult.good;
    if (percentage >= 50) return translations.quizResult.notBad;
    return translations.quizResult.needImprovement;
  };

  const userAnswers = result.answers as number[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="text-8xl mb-4">{getEmoji()}</div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {translations.quizResult.testCompleted}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              {getMessage()}
            </p>

            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                  className="text-purple-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-800">{percentage}%</div>
                  <div className="text-gray-600">{result.score}/{result.total_questions}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{translations.quizResult.correctAnswers}</span>
                <span className="font-bold text-green-600">{result.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{translations.quizResult.incorrectAnswers}</span>
                <span className="font-bold text-red-600">{result.total_questions - result.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{translations.quizResult.timeTaken}</span>
                <span className="font-bold text-gray-800">{formatTime(result.time_taken)}</span>
              </div>
            </div>

            {/* Info Message - No Navigation Allowed */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
              <p className="text-yellow-800 font-semibold text-center">
                ℹ️ {translations.quizResult.testFinished || "Test tamamlandı. Nátiyje kórildi."}
              </p>
              <p className="text-yellow-700 text-sm text-center mt-2">
                {translations.quizResult.closeTab || "Endi sayt betın jabıwıńız múmkin."}
              </p>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{translations.quizResult.yourAnswers}</h2>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct_option;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-xl p-6 ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {translations.quizList.questions} {index + 1}: {question.question_text}
                      </h3>

                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = question.correct_option === optIndex;

                          let bgColor = '';
                          let textColor = 'text-gray-700';
                          let icon = '';

                          if (isCorrectAnswer) {
                            bgColor = 'bg-green-200';
                            textColor = 'text-green-900';
                            icon = '✓ ';
                          } else if (isUserAnswer && !isCorrect) {
                            bgColor = 'bg-red-200';
                            textColor = 'text-red-900';
                            icon = '✗ ';
                          } else {
                            bgColor = 'bg-gray-100';
                          }

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg ${bgColor} ${textColor}`}
                            >
                              {icon}{option}
                              {isCorrectAnswer && (
                                <span className="ml-2 text-xs font-semibold">({translations.quizResult.correctAnswer})</span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="ml-2 text-xs font-semibold">({translations.quizResult.yourAnswer})</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
