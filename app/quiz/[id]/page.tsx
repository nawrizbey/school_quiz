'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, CLASSES } from '@/lib/supabase';
import type { Quiz, Question } from '@/lib/supabase';
import translations, { t } from '@/lib/translations.kk';

// Deterministic shuffle based on seed (student name + quiz id)
function seededShuffle<T>(array: T[], seed: string): T[] {
  const arr = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }

  const random = () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    // Ensure j is within bounds
    if (j >= 0 && j < arr.length) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

interface ShuffledQuestion extends Question {
  shuffledOptions: string[];
  optionMapping: number[]; // Maps shuffled index to original index
}

export default function TakeQuiz({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [classNumber, setClassNumber] = useState<number>(4);
  const [showNameInput, setShowNameInput] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState<Date | null>(null);
  const [timeUntilStart, setTimeUntilStart] = useState<number>(0);
  const [testHasStarted, setTestHasStarted] = useState(false);
  const [waitingForStart, setWaitingForStart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadQuiz();
  }, [resolvedParams.id]);

  // Countdown timer before test starts
  useEffect(() => {
    if (!scheduledStartTime || testHasStarted) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = scheduledStartTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTestHasStarted(true);
        setTimeUntilStart(0);

        // If student is waiting, auto-start the test
        if (waitingForStart && studentName && !started) {
          startTest();
        }
      } else {
        setTimeUntilStart(Math.ceil(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledStartTime, testHasStarted, waitingForStart, studentName, started]);

  // Quiz timer (counts down remaining time)
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const loadQuiz = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (quizError) throw quizError;

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', resolvedParams.id)
        .order('order', { ascending: true });

      if (questionsError) throw questionsError;

      setQuiz(quizData);

      // Calculate scheduled start time
      const startTime = calculateScheduledStartTime(quizData.scheduled_day, quizData.scheduled_time);
      setScheduledStartTime(startTime);

      const now = new Date();
      const hasStarted = now >= startTime;
      setTestHasStarted(hasStarted);

      // Don't shuffle yet - will shuffle when student enters name
      const initialQuestions = questionsData?.map(q => {
        return {
          ...q,
          shuffledOptions: q.options || [],
          optionMapping: (q.options || []).map((_option: string, i: number) => i)
        };
      }) || [];

      setQuestions(initialQuestions);

      setAnswers(new Array(questionsData?.length || 0).fill(-1));
    } catch (error) {
      alert(translations.quizTaking.testNotFound);
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  };

  const calculateScheduledStartTime = (scheduledDay: number, scheduledTime: string): Date => {
    const now = new Date();

    // Parse scheduled time (HH:MM:SS or HH:MM)
    const [hours, minutes] = scheduledTime.split(':').map(Number);

    // Set to today's scheduled time
    const result = new Date(now);
    result.setHours(hours, minutes, 0, 0);

    return result;
  };

  const isTestWindowClosed = (quiz: Quiz) => {
    if (!quiz) return false;

    const now = new Date();
    const [hours, minutes] = quiz.scheduled_time.split(':').map(Number);

    const startTime = new Date(now);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setSeconds(endTime.getSeconds() + quiz.time_limit);

    return now > endTime;
  };

  const handleStart = async () => {
    if (!studentName.trim()) {
      alert(translations.quizTaking.enterYourName);
      return;
    }

    // Check if test window has closed
    if (quiz && isTestWindowClosed(quiz)) {
      alert(translations.quizTaking.testWindowClosed);
      router.push('/quiz');
      return;
    }

    // Check if test has started
    if (!testHasStarted) {
      setWaitingForStart(true);
      setShowNameInput(false);
      return;
    }

    // Check if student already took this quiz
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('results')
        .select('id')
        .eq('quiz_id', resolvedParams.id)
        .eq('student_name', studentName.trim())
        .eq('class_number', classNumber)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        alert(translations.quizTaking.alreadyTaken);
        setLoading(false);
        return;
      }

      startTest();
    } catch (error) {
      alert(translations.quizTaking.errorOccurred);
      setLoading(false);
    }
  };

  const startTest = () => {
    // Check if test window has closed
    if (quiz && isTestWindowClosed(quiz)) {
      alert(translations.quizTaking.testWindowClosed);
      router.push('/quiz');
      setLoading(false);
      return;
    }

    // Shuffle options for this student
    const seed = `${studentName}-${resolvedParams.id}`;
    const shuffledQuestions = questions.map(q => {
      const indices = q.options.map((_option: string, i: number) => i);
      const shuffledIndices = seededShuffle(indices, seed + q.id);

      const shuffled = {
        ...q,
        shuffledOptions: shuffledIndices.map(i => q.options[i]),
        optionMapping: shuffledIndices
      };

      return shuffled;
    });

    setQuestions(shuffledQuestions);

    // Calculate remaining time based on elapsed time
    if (scheduledStartTime && quiz) {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - scheduledStartTime.getTime()) / 1000);
      const remainingTime = Math.max(0, quiz.time_limit - elapsedSeconds);

      if (remainingTime === 0) {
        alert(translations.quizTaking.testWindowClosed);
        router.push('/quiz');
        return;
      }

      setTimeLeft(remainingTime);
    }

    setShowNameInput(false);
    setWaitingForStart(false);
    setStarted(true);
    setLoading(false);
  };

  const selectAnswer = (shuffledIndex: number) => {
    // Convert shuffled index back to original index before storing
    const question = questions[currentQuestion];
    const originalIndex = question.optionMapping[shuffledIndex];

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = originalIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // Calculate score using original indices
      let score = 0;
      questions.forEach((q, index) => {
        if (answers[index] === q.correct_option) {
          score++;
        }
      });

      const timeTaken = quiz!.time_limit - timeLeft;

      // Save result
      const { data: resultData, error } = await supabase.from('results').insert({
        quiz_id: resolvedParams.id,
        student_name: studentName,
        class_number: classNumber,
        score,
        total_questions: questions.length,
        time_taken: timeTaken,
        answers: answers,
      }).select().single();

      if (error) throw error;

      // Redirect to results with result ID
      router.push(`/quiz/${resolvedParams.id}/result?resultId=${resultData.id}`);
    } catch (error) {
      alert(translations.quizTaking.errorOccurred);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-2xl text-white">{translations.common.loading}</div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-2xl text-white">{translations.quizTaking.testNotFound}</div>
      </div>
    );
  }

  // Waiting for test to start screen
  if (waitingForStart && !testHasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">⏰</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
          <p className="text-gray-600 mb-6">{t('quizTaking.hello', { name: studentName })}</p>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">{translations.quizTaking.timeUntilStart}</p>
            <div className="text-5xl font-bold text-yellow-600">
              {formatCountdown(timeUntilStart)}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm text-gray-700">
              <p>📝 {translations.quizList.questions}: {questions.length}</p>
              <p>⏱ {translations.quizList.timeLimit}: {Math.floor(quiz.time_limit / 60)} {translations.quizList.minutes}</p>
              <p>👥 {translations.quizTaking.allStudentsStartTogether}</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm">{translations.quizTaking.testWillAutoStart}</p>
        </div>
      </div>
    );
  }

  // Name input screen
  if (showNameInput) {
    const isWindowClosed = quiz && isTestWindowClosed(quiz);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600 mb-6">{quiz.description}</p>
          )}

          {isWindowClosed && (
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-6">
              <p className="text-red-700 font-semibold">❌ {translations.quizTaking.testTimeClosed}</p>
              <p className="text-sm text-red-600 mt-1">
                {t('quizTaking.testClosedDescription', { time: quiz.scheduled_time.slice(0, 5), minutes: Math.floor(quiz.time_limit / 60).toString() })}
              </p>
            </div>
          )}

          {!testHasStarted && !isWindowClosed && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 mb-1">⏰ {translations.quizTaking.timeUntilStart}</p>
              <div className="text-3xl font-bold text-yellow-600">
                {formatCountdown(timeUntilStart)}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-gray-700">
              <p>📝 {translations.quizList.questions}: {questions.length}</p>
              <p>⏱ {translations.quizList.timeLimit}: {Math.floor(quiz.time_limit / 60)} {translations.quizList.minutes}</p>
              {testHasStarted && !isWindowClosed && scheduledStartTime && (
                <p className="text-yellow-600 font-semibold">⚠️ {translations.quizTaking.testHasStarted}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.quizTaking.enterNameLabel}
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                placeholder={translations.quizTaking.enterNamePlaceholder}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.quizTaking.selectClassLabel}
              </label>
              <select
                value={classNumber}
                onChange={(e) => setClassNumber(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {t('quizTaking.classNumber', { number: cls.toString() })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isWindowClosed}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all ${
              isWindowClosed
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isWindowClosed ? translations.quizTaking.testClosedButton : testHasStarted ? translations.quizTaking.startTest : translations.quizTaking.readyToWait}
          </button>

          <button
            onClick={() => router.push('/quiz')}
            className="w-full mt-3 text-gray-600 hover:text-gray-800 underline"
          >
            {translations.common.back}
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Find which shuffled option corresponds to the selected original answer
  const selectedShuffledIndex = answers[currentQuestion] !== -1
    ? question?.optionMapping?.findIndex(orig => orig === answers[currentQuestion])
    : -1;

  // Safety check
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-2xl text-white">{translations.common.error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">{studentName} ({t('quizTaking.classNumber', { number: classNumber.toString() })})</span>
            <span className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500">
              {t('quizTaking.questionNumber', { current: (currentQuestion + 1).toString(), total: questions.length.toString() })}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {question.question_text}
            </h2>
            {question.question_image_url && (
              <img
                src={question.question_image_url}
                alt="Question"
                className="mt-4 max-w-full max-h-64 rounded-lg border shadow-sm"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>

          <div className="space-y-3">
            {(() => {
              const displayOptions = question.shuffledOptions && question.shuffledOptions.length > 0
                ? question.shuffledOptions
                : question.options;

              if (!displayOptions || displayOptions.length === 0) {
                return (
                  <div className="text-red-600">
                    {translations.common.error}
                  </div>
                );
              }

              return displayOptions.map((option, shuffledIndex) => {
                const originalIndex = question.optionMapping ? question.optionMapping[shuffledIndex] : shuffledIndex;
                const optionImage = question.option_images ? question.option_images[originalIndex?.toString()] : null;

                return (
                  <button
                    key={shuffledIndex}
                    onClick={() => selectAnswer(shuffledIndex)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedShuffledIndex === shuffledIndex
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          selectedShuffledIndex === shuffledIndex
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedShuffledIndex === shuffledIndex && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-800 block">{option}</span>
                        {optionImage && (
                          <img
                            src={optionImage}
                            alt={`Option ${shuffledIndex + 1}`}
                            className="mt-2 max-w-full max-h-32 rounded border"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              });
            })()}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← {translations.common.back}
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || answers.includes(-1)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? translations.quizTaking.saving : translations.quizTaking.finishTest}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                {translations.common.next} →
              </button>
            )}
          </div>

          {answers.includes(-1) && currentQuestion === questions.length - 1 && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {translations.quizTaking.answerAllQuestions}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
