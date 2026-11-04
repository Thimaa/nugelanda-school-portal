import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Fetch all students
    const { data: students, error: studentError } = await supabase
      .from('Student')
      .select('*')
      .eq('role', 'student');

    if (studentError) throw studentError;

    // 2. Fetch all teachers
    const { data: teachers } = await supabase
      .from('Student')
      .select('*')
      .eq('role', 'teacher');

    // 3. Calculate Total Fees Collected (Check both camelCase and lowercase columns)
    const totalFeesCollected = (students || []).reduce((sum, s) => {
      const paid = s.paidAmount || s.paidamount || 0;
      return sum + Number(paid);
    }, 0);

    // 4. Get the 5 most recent students
    const recentStudents = [...(students || [])]
      .sort((a, b) => new Date(b.createdat || b.createdAt).getTime() - new Date(a.createdat || a.createdAt).getTime())
      .slice(0, 5);

    // Mock Data for Charts
    const attendanceData = [85, 92, 78, 95, 88, 90, 96];
    const classDistribution = {
      'Grade 10': (students || []).filter(s => s.class?.startsWith('10')).length,
      'Grade 11': (students || []).filter(s => s.class?.startsWith('11')).length,
      'Grade 12': (students || []).filter(s => s.class?.startsWith('12')).length,
    };

    return NextResponse.json({
      totalStudents: students?.length || 0,
      totalTeachers: teachers?.length || 0,
      totalFeesCollected: totalFeesCollected,
      recentStudents,
      attendanceData,
      classDistribution
    });

  } catch (error: any) {
    console.error("❌ ADMIN STATS ERROR:", error);
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
  }
}