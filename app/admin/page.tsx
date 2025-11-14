'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import translations from '@/lib/translations.kk';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    const role = localStorage.getItem('teacherRole');
    if (isLoggedIn === 'true') {
      if (role === 'super_admin') {
        router.push('/admin/super-dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.teacher) {
        // Save teacher info to localStorage
        localStorage.setItem('teacherLoggedIn', 'true');
        localStorage.setItem('teacherId', data.teacher.id);
        localStorage.setItem('teacherUsername', data.teacher.username);
        localStorage.setItem('teacherFullName', data.teacher.full_name);
        localStorage.setItem('teacherSubject', data.teacher.subject || '');
        localStorage.setItem('teacherRole', data.teacher.role);

        // Redirect based on role
        if (data.teacher.role === 'super_admin') {
          router.push('/admin/super-dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        setError(translations.adminLogin.loginError);
      }
    } catch (err) {
      setError(translations.errors.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{translations.adminLogin.title}</h1>
        <p className="text-center text-gray-600 mb-6">{translations.adminLogin.subtitle}</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translations.adminLogin.usernameLabel}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translations.adminLogin.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? translations.common.loading : translations.adminLogin.loginButton}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-600 space-y-2">
          <p className="font-semibold">{translations.adminLogin.accounts}</p>
          <div className="grid grid-cols-2 gap-2 text-left bg-gray-50 p-3 rounded">
            <div><strong>{translations.adminLogin.superAdmin}:</strong><br/>superadmin / admin123</div>
            <div><strong>{translations.subjects.matematika}:</strong><br/>matematika / math123</div>
            <div><strong>{translations.subjects.biologiya}:</strong><br/>biologiya / bio123</div>
            <div><strong>{translations.subjects.ingliz_tili}:</strong><br/>ingliz / eng123</div>
            <div><strong>{translations.subjects.umumiy_fanlar}:</strong><br/>umumiy / general123</div>
            <div><strong>{translations.subjects.zakovat}:</strong><br/>zakovat / logic123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
