import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('title, subject, description, author_name, time_limit, scheduled_time')
      .eq('id', resolvedParams.id)
      .single();

    if (!quiz) {
      return {
        title: 'Test tabılmadı - Mektep Test Tizimi',
        description: 'Mektep o\'qıwshıları ushın onlayn test platforması',
      };
    }

    // Get number of questions
    const { count: questionCount } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_id', resolvedParams.id);

    const subjects: { [key: string]: string } = {
      'matematika': 'Matematika',
      'biologiya': 'Biologiya',
      'ingliz_tili': 'Ingliz tili',
      'umumiy_fanlar': 'Umumiy fanlar',
      'zakovat': 'Zakovat hám logika'
    };

    const subjectLabel = subjects[quiz.subject] || quiz.subject;
    const timeInMinutes = Math.floor(quiz.time_limit / 60);
    const startTime = quiz.scheduled_time.slice(0, 5); // HH:MM
    const questionsText = questionCount ? `${questionCount} soraw` : '';

    const title = `${quiz.title} - ${subjectLabel}`;

    // Rich description with all details
    const descriptionParts = [
      `📚 Pán: ${subjectLabel}`,
      `✍️ Avtor: ${quiz.author_name}`,
      questionsText ? `📝 ${questionsText}` : '',
      `⏱ Waqıt: ${timeInMinutes} minut`,
      `🕐 Baslanıw: ${startTime}`,
    ].filter(Boolean);

    const description = descriptionParts.join('\n');

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: title,
        description: description,
      },
    };
  } catch (error) {
    return {
      title: 'Test - Mektep Test Tizimi',
      description: 'Mektep o\'qıwshıları ushın onlayn test platforması',
    };
  }
}

export default function QuizLayout({ children }: Props) {
  return children;
}
