import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Get Total Students
    const { count: studentCount, error: studentError } = await supabase
      .from('Student')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    if (studentError) throw studentError;

    // 2. Get Total Teachers (If you have them in the DB, otherwise it's 0)
    const { count: teacherCount } = await supabase
      .from('Student')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'teacher');

    // 3. Get Recent 5 Students
    const { data: recentStudents } = await supabase
      .from('Student')
      .select('id, name, class, admissionnumber, photourl')
      .eq('role', 'student')
      .order('createdAt', { ascending: false })
      .limit(5);

    // Return the real data
    return NextResponse.json({
      totalStudents: studentCount || 0,
      totalTeachers: teacherCount || 0,
      recentStudents: recentStudents || [],
    });

  } catch (error: any) {
    console.error("❌ ADMIN STATS ERROR:", error);
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
  }
}