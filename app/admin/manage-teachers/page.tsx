'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Teacher } from '@/lib/supabase';
import translations from '@/lib/translations.kk';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    const role = localStorage.getItem('teacherRole');

    if (isLoggedIn !== 'true' || role !== 'super_admin') {
      router.push('/admin');
      return;
    }

    loadTeachers();
  }, [router]);

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
      alert('Mugalimlerdi júklewde qátelik júz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setNewUsername(teacher.username);
    setNewPassword('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewUsername('');
    setNewPassword('');
  };

  const handleSave = async (teacherId: string) => {
    if (saving) return;

    if (!newUsername.trim()) {
      alert('Login atın kirgiziń!');
      return;
    }

    setSaving(true);

    try {
      const updateData: any = {
        username: newUsername.trim(),
      };

      // Agar yangi parol kiritilgan bo'lsa
      if (newPassword.trim()) {
        // Parolni hash qilish uchun Supabase funktsiyasidan foydalanish
        const { error: passwordError } = await supabase.rpc('update_teacher_password', {
          teacher_id: teacherId,
          new_password: newPassword.trim()
        });

        if (passwordError) {
          console.error('Password update error:', passwordError);
          alert(`Paroldi ózgertiw múmkin bolmadı!\n\nXato: ${passwordError.message}\n\nIltimos, Supabase'da update_teacher_password funksiyasi yaratilganligini tekshiring.`);
          setSaving(false);
          return;
        }
      }

      // Username'ni yangilash
      const { error: usernameError } = await supabase
        .from('teachers')
        .update({ username: newUsername.trim() })
        .eq('id', teacherId);

      if (usernameError) throw usernameError;

      alert('✅ Muvaffaqiyatli ózgertirildi!');
      setEditingId(null);
      setNewUsername('');
      setNewPassword('');
      loadTeachers();
    } catch (error: any) {
      console.error('Error updating teacher:', error);
      alert(`❌ Ózgertiw múmkin bolmadı!\n\nXato: ${error.message}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Mugalimlerdi basqarıw</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              ← {translations.common.back}
            </button>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Eskertiw:</strong> Login hám paroldi ózgertkenińizden keyin, muǵállimler jańa maǵlıwmatlar menen kiriw kerek.
            </p>
          </div>

          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                {editingId === teacher.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tolıq atı
                      </label>
                      <input
                        type="text"
                        value={teacher.full_name}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Login (username) *
                      </label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800"
                        placeholder="matematika"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jańa parol (bos qaldırsańız ózgermeydi)
                      </label>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800"
                        placeholder="Jańa paroldi kirgiziń"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paroldi ózgertpes ushın bul maydondi bos qaldırıń
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(teacher.id)}
                        disabled={saving}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                      >
                        {saving ? 'Saqlanmaqta...' : '✓ Saqlaw'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                      >
                        ✗ Bes etiw
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{teacher.full_name}</h3>
                      <div className="flex gap-3 mt-1 text-sm text-gray-600">
                        <span>👤 {teacher.username}</span>
                        {teacher.subject && <span>📚 {teacher.subject}</span>}
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          teacher.role === 'super_admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {teacher.role === 'super_admin' ? 'Super Admin' : 'Mugalim'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      ✏️ Ózgertiw
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
