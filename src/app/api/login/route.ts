import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Find the user by email
    const { data: student, error } = await supabase
      .from('Student')
      .select('*')
      .eq('email', body.email)
      .single();

    // 2. Check if user exists and password matches
    if (error || !student || student.password !== body.password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // --- NEW LOGIC: Block pending admins ---
    if (student.role === 'admin' && student.status === 'Pending') {
      return NextResponse.json({ 
        message: 'Your admin account is pending approval by the Super Admin.' 
      }, { status: 403 });
    }
    // ---------------------------------------

    // 3. Return success and the user's details
    return NextResponse.json({ 
      message: 'Login successful', 
      role: student.role,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        // Handle both camelCase and lowercase for the admission number
        admissionNumber: student.admissionnumber || student.admissionNumber
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ LOGIN ERROR:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}