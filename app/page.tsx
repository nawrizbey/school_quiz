import Link from 'next/link';
import translations from '@/lib/translations.kk';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{translations.home.title}</h1>
          <p className="text-gray-600">{translations.home.subtitle}</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/quiz"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {translations.home.takeQuiz}
          </Link>

          <Link
            href="/admin"
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {translations.home.forTeachers}
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          {translations.home.footer}
        </div>
      </div>
    </div>
  );
}
