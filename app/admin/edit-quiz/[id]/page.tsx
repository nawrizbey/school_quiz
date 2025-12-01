'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, SUBJECTS, DAYS } from '@/lib/supabase';
import type { Subject } from '@/lib/supabase';
import translations from '@/lib/translations.kk';
import ImageUpload from '@/components/ImageUpload';

interface QuestionData {
  id?: string;
  question_text: string;
  options: string[];
  correct_option: number;
  question_image_url?: string;
  option_images?: Record<string, string>;
}

export default function EditQuiz({ params }: { params: Promise<{ id: string }> }) {
  const [quizId, setQuizId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(10); // minutes
  const [subject, setSubject] = useState<Subject | ''>('');
  const [scheduledDay, setScheduledDay] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('21:00');
  const [authorName, setAuthorName] = useState('');
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    const role = localStorage.getItem('teacherRole');

    if (isLoggedIn !== 'true' || role !== 'super_admin') {
      router.push('/admin');
      return;
    }

    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setQuizId(id);

      // Load quiz data
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (quizError) throw quizError;

      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id)
        .order('order', { ascending: true });

      if (questionsError) throw questionsError;

      // Set state
      setTitle(quizData.title);
      setDescription(quizData.description || '');
      setTimeLimit(Math.floor(quizData.time_limit / 60)); // convert from seconds
      setSubject(quizData.subject);
      setScheduledDay(quizData.scheduled_day);
      setScheduledTime(quizData.scheduled_time.slice(0, 5)); // HH:MM
      setAuthorName(quizData.author_name);
      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert(translations.errors.notFound);
      router.push('/admin/super-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (questions.length >= 15) {
      alert(translations.createQuiz.maxQuestionsReached || 'Maksimal 15 ta savol qo\'shish mumkin');
      return;
    }
    setQuestions([
      ...questions,
      { question_text: '', options: ['', '', '', ''], correct_option: 0, question_image_url: '', option_images: {} },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      alert(translations.createQuiz.addAtLeastOneQuestion);
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'question_text') {
      newQuestions[index].question_text = value;
    } else if (field === 'correct_option') {
      newQuestions[index].correct_option = value;
    } else if (field === 'question_image_url') {
      newQuestions[index].question_image_url = value;
    }
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const updateOptionImage = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].option_images) {
      newQuestions[questionIndex].option_images = {};
    }
    if (value.trim()) {
      newQuestions[questionIndex].option_images![optionIndex.toString()] = value;
    } else {
      delete newQuestions[questionIndex].option_images![optionIndex.toString()];
    }
    setQuestions(newQuestions);
  };

  const handleSubjectChange = (newSubject: Subject) => {
    setSubject(newSubject);
    const subjectInfo = SUBJECTS.find(s => s.value === newSubject);
    if (subjectInfo) {
      setScheduledDay(subjectInfo.day);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double-submit
    if (saving) {
      return; // Already saving, ignore
    }

    setSaving(true);

    try {
      // Validate
      if (!title.trim()) {
        alert(translations.createQuiz.fillAllFields);
        setSaving(false);
        return;
      }

      if (!subject) {
        alert(translations.createQuiz.fillAllFields);
        setSaving(false);
        return;
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question_text.trim()) {
          alert(translations.createQuiz.fillAllFields);
          setSaving(false);
          return;
        }
        if (q.options.some(opt => !opt.trim())) {
          alert(translations.createQuiz.questionMustHave4Options);
          setSaving(false);
          return;
        }
      }

      // Update quiz
      const { data: updateData, error: quizError } = await supabase
        .from('quizzes')
        .update({
          title,
          description,
          subject,
          time_limit: timeLimit * 60, // convert to seconds
          scheduled_day: scheduledDay,
          scheduled_time: scheduledTime + ':00',
          author_name: authorName,
        })
        .eq('id', quizId)
        .select();

      if (quizError) {
        console.error('Quiz update error:', quizError);
        alert(`Test yangilanmadi! Xato: ${quizError.message}\n\nIltimos, Supabase'da fix-quiz-update-policies.sql faylini ishga tushiring.`);
        throw quizError;
      }

      console.log('Quiz updated successfully:', updateData);

      // Delete old questions
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('quiz_id', quizId);

      if (deleteError) {
        console.error('Questions delete error:', deleteError);
        alert(`Eski savollar o'chirilmadi! Xato: ${deleteError.message}`);
        throw deleteError;
      }

      console.log('Old questions deleted successfully');

      // Insert new questions
      const questionsToInsert = questions.map((q, index) => ({
        quiz_id: quizId,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
        order: index,
        question_image_url: q.question_image_url || null,
        option_images: q.option_images && Object.keys(q.option_images).length > 0 ? q.option_images : null,
      }));

      const { data: insertedQuestions, error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();

      if (questionsError) {
        console.error('Questions insert error:', questionsError);
        alert(`Yangi savollar saqlanmadi! Xato: ${questionsError.message}`);
        throw questionsError;
      }

      console.log('New questions inserted successfully:', insertedQuestions);

      alert('✅ Test muvaffaqiyatli o\'zgartirildi!');
      router.push('/admin/super-dashboard');
    } catch (error: any) {
      console.error('Error updating quiz:', error);
      alert(`❌ Test o'zgartirishda xatolik yuz berdi!\n\nXato: ${error.message || 'Unknown error'}\n\nIltimos, browser console'ni tekshiring.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">{translations.common.loading}</div>
      </div>
    );
  }

  const subjectLabel = SUBJECTS.find(s => s.value === subject)?.label || '';
  const dayLabel = scheduledDay > 0 && scheduledDay <= 5 ? DAYS[scheduledDay] : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Testı ózgertiw</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              ← {translations.common.back}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.createQuiz.testTitleLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  placeholder={translations.createQuiz.testTitlePlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.createQuiz.descriptionLabel}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  placeholder={translations.createQuiz.descriptionPlaceholder}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.createQuiz.subjectLabel}
                </label>
                <select
                  value={subject}
                  onChange={(e) => handleSubjectChange(e.target.value as Subject)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  required
                >
                  <option value="">{translations.createQuiz.selectSubject}</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label} ({DAYS[s.day]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.createQuiz.timeLimitLabel}
                  </label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.createQuiz.scheduledTimeLabel}
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {translations.createQuiz.authorNameLabel}
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  placeholder={translations.createQuiz.authorNameLabel}
                  required
                />
              </div>

              {subject && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    📅 {dayLabel}<br/>
                    🕘 {scheduledTime}<br/>
                    ✍️ {authorName}
                  </p>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{translations.createQuiz.questionsSection}</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
                >
                  {translations.createQuiz.addQuestion}
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-800">{translations.createQuiz.questionLabel.replace('{number}', (qIndex + 1).toString())}</h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          {translations.createQuiz.removeQuestion}
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <textarea
                        value={question.question_text}
                        onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                        placeholder={translations.createQuiz.questionTextPlaceholder}
                        rows={2}
                        required
                      />

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Soraw súwreti (ixtiyariy)
                        </label>
                        <ImageUpload
                          currentImageUrl={question.question_image_url}
                          onImageUploaded={(url) => updateQuestion(qIndex, 'question_image_url', url)}
                          placeholder="Súwret URL yamasa júklew ushın 📷 basıń"
                          maxSizeMB={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {translations.createQuiz.correctAnswerLabel}
                        </label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="space-y-1">
                            <div className="flex gap-2 items-center">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.correct_option === oIndex}
                                onChange={() => updateQuestion(qIndex, 'correct_option', oIndex)}
                                className="w-4 h-4 text-purple-500"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                                placeholder={translations.createQuiz.optionPlaceholder}
                                required
                              />
                            </div>
                            <div className="ml-6 mt-1">
                              <ImageUpload
                                currentImageUrl={question.option_images?.[oIndex.toString()]}
                                onImageUploaded={(url) => updateOptionImage(qIndex, oIndex, url)}
                                placeholder={`${String.fromCharCode(65 + oIndex)}-variant súwreti (ixtiyariy)`}
                                maxSizeMB={3}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saqlanmaqta...' : 'Ózgerislerdi saqlaw'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold transition-all"
              >
                {translations.common.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
