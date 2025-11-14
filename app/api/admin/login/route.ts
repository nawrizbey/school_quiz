import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', username);

    // Query teachers table
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.log('Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: 'Database error: ' + error.message,
        details: 'Teachers jadvali mavjud emasmi? SQL schema ishga tushirilganmi?'
      });
    }

    if (!data) {
      console.log('User not found:', username);
      return NextResponse.json({ success: false, error: 'User not found in database' });
    }

    console.log('User found:', data.username, data.role);

    // Simple password verification for demo
    // In production, use proper password hashing with pgcrypto
    const validPasswords: { [key: string]: string } = {
      'superadmin': 'admin123',
      'matematika': 'math123',
      'biologiya': 'bio123',
      'ingliz': 'eng123',
      'umumiy': 'general123',
      'zakovat': 'logic123',
    };

    const isValid = validPasswords[username] === password;

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid password' });
    }

    // Return teacher data (without password)
    return NextResponse.json({
      success: true,
      teacher: {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        subject: data.subject,
        role: data.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Server error' });
  }
}
