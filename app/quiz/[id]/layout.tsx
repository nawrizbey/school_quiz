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
      .select('title, subject, description')
      .eq('id', resolvedParams.id)
      .single();

    if (!quiz) {
      return {
        title: 'Test tabılmadı - Mektep Test Tizimi',
        description: 'Mektep o\'qıwshıları ushın onlayn test platforması',
      };
    }

    const subjects: { [key: string]: string } = {
      'matematika': 'Matematika',
      'biologiya': 'Biologiya',
      'ingliz_tili': 'Ingliz tili',
      'umumiy_fanlar': 'Umumiy fanlar',
      'zakovat': 'Zakovat hám logika'
    };

    const subjectLabel = subjects[quiz.subject] || quiz.subject;
    const title = `${quiz.title} - ${subjectLabel}`;
    const description = quiz.description || `${subjectLabel} páninen test. Mektep o'qıwshıları ushın onlayn test.`;

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
