'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, SUBJECTS } from '@/lib/supabase';
import type { Quiz } from '@/lib/supabase';
import translations, { t } from '@/lib/translations.kk';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Get current time
    const now = new Date();
    setCurrentTime(now.toTimeString().slice(0, 5)); // HH:MM

    loadQuizzes();

    // Update time every minute
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 5));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      // Error loading quizzes
    } finally {
      setLoading(false);
    }
  };

  const isQuizAvailable = (quiz: Quiz) => {
    const now = new Date();
    const [schedHours, schedMinutes] = quiz.scheduled_time.split(':').map(Number);

    // Start time
    const startTime = new Date(now);
    startTime.setHours(schedHours, schedMinutes, 0, 0);

    // End time (start + time_limit)
    const endTime = new Date(startTime);
    endTime.setSeconds(endTime.getSeconds() + quiz.time_limit);

    // Check if current time is within the window
    return now >= startTime && now <= endTime;
  };

  const getQuizStatus = (quiz: Quiz) => {
    const now = new Date();
    const [schedHours, schedMinutes] = quiz.scheduled_time.split(':').map(Number);
    const scheduledTime = quiz.scheduled_time.slice(0, 5);

    // Start time
    const startTime = new Date(now);
    startTime.setHours(schedHours, schedMinutes, 0, 0);

    // End time (start + time_limit)
    const endTime = new Date(startTime);
    endTime.setSeconds(endTime.getSeconds() + quiz.time_limit);

    if (now >= startTime && now <= endTime) {
      return {
        available: true,
        message: translations.quizList.testAvailable,
        color: 'bg-green-100 text-green-700'
      };
    } else if (now > endTime) {
      return {
        available: false,
        message: translations.quizList.testClosed,
        color: 'bg-gray-100 text-gray-600'
      };
    } else {
      return {
        available: false,
        message: t('quizList.testStartsAt', { time: scheduledTime }),
        color: 'bg-blue-100 text-blue-700'
      };
    }
  };

  const getTimeUntil = (scheduledTime: string) => {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const scheduled = new Date(now);
    scheduled.setHours(hours, minutes, 0, 0);

    if (now >= scheduled) {
      return null; // Already started
    }

    const diff = scheduled.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursLeft > 0) {
      return t('quizList.timeRemaining', { time: `${hoursLeft} ${translations.time.hours} ${minutesLeft}` });
    }
    return t('quizList.timeRemaining', { time: minutesLeft.toString() });
  };

  const isQuizClosed = (quiz: Quiz) => {
    const now = new Date();
    const [schedHours, schedMinutes] = quiz.scheduled_time.split(':').map(Number);

    const startTime = new Date(now);
    startTime.setHours(schedHours, schedMinutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setSeconds(endTime.getSeconds() + quiz.time_limit);

    return now > endTime;
  };

  // Filter quizzes: available, upcoming, and closed
  const availableQuizzes = quizzes.filter(q => isQuizAvailable(q));
  const upcomingQuizzes = quizzes.filter(q => !isQuizAvailable(q) && !isQuizClosed(q));
  const closedQuizzes = quizzes.filter(q => isQuizClosed(q));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-2xl text-white">{translations.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{translations.quizList.title}</h1>
              <p className="text-gray-600 mt-1">{translations.quizList.currentTime}: {currentTime}</p>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              {translations.common.home}
            </Link>
          </div>

          {/* Available Quizzes */}
          {availableQuizzes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🔥 {translations.quizList.availableQuizzes}</h2>
              <div className="grid grid-cols-1 gap-4">
                {availableQuizzes.map((quiz) => {
                  const subjectInfo = SUBJECTS.find(s => s.value === quiz.subject);
                  const status = getQuizStatus(quiz);
                  return (
                    <Link
                      key={quiz.id}
                      href={`/quiz/${quiz.id}`}
                      className="block border-2 border-green-500 rounded-xl p-6 hover:border-green-600 hover:shadow-lg transition-all bg-green-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                              {subjectInfo?.label}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                              {status.message}
                            </span>
                          </div>
                          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                            {quiz.title}
                          </h3>
                          {quiz.description && (
                            <p className="text-gray-600 mb-3">{quiz.description}</p>
                          )}
                          <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                            <span>⏱ {Math.floor(quiz.time_limit / 60)} {translations.quizList.minutes}</span>
                            <span>🕘 {t('quizList.startedAt', { time: quiz.scheduled_time.slice(0, 5) })}</span>
                            <span>✍️ {quiz.author_name}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg">
                            {translations.quizList.startTest} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Quizzes */}
          {upcomingQuizzes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⏰ {translations.quizList.upcomingQuizzes}</h2>
              <div className="grid grid-cols-1 gap-4">
                {upcomingQuizzes.map((quiz) => {
                  const subjectInfo = SUBJECTS.find(s => s.value === quiz.subject);
                  const status = getQuizStatus(quiz);
                  const timeUntil = getTimeUntil(quiz.scheduled_time);
                  return (
                    <div
                      key={quiz.id}
                      className="border-2 border-blue-300 rounded-xl p-6 bg-blue-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              {subjectInfo?.label}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                              {status.message}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {quiz.title}
                          </h3>
                          {quiz.description && (
                            <p className="text-gray-600 mb-3">{quiz.description}</p>
                          )}
                          <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
                            <span>🕘 {t('quizList.testStartsAt', { time: quiz.scheduled_time.slice(0, 5) })}</span>
                            {timeUntil && (
                              <span className="font-semibold text-blue-700">⏳ {timeUntil}</span>
                            )}
                            <span>⏱ {Math.floor(quiz.time_limit / 60)} {translations.quizList.minutes}</span>
                            <span>✍️ {quiz.author_name}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-block bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                            {translations.quizList.waiting}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Closed Quizzes */}
          {closedQuizzes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 {translations.quizList.closedQuizzes}</h2>
              <div className="grid grid-cols-1 gap-4">
                {closedQuizzes.map((quiz) => {
                  const subjectInfo = SUBJECTS.find(s => s.value === quiz.subject);
                  const status = getQuizStatus(quiz);
                  return (
                    <div
                      key={quiz.id}
                      className="border-2 border-gray-300 rounded-xl p-6 bg-gray-50 opacity-60"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                              {subjectInfo?.label}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                              {status.message}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {quiz.title}
                          </h3>
                          {quiz.description && (
                            <p className="text-gray-600 mb-3">{quiz.description}</p>
                          )}
                          <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                            <span>🕘 {t('quizList.startedAt', { time: quiz.scheduled_time.slice(0, 5) })}</span>
                            <span>⏱ {Math.floor(quiz.time_limit / 60)} {translations.quizList.minutes}</span>
                            <span>✍️ {quiz.author_name}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-block bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                            {translations.quizList.closed}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Quizzes */}
          {quizzes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">{translations.quizList.noQuizzes}</p>
              <p className="mt-2">{translations.quizList.comeBackLater}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
