import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const date = searchParams.get('date');

    if (!className || !date) {
      return NextResponse.json({ message: 'Class and Date are required' }, { status: 400 });
    }

    // 1. Get ALL students (We filter in JS to avoid strict database casing issues)
    const { data: allStudents, error: studentError } = await supabase
      .from('Student')
      .select('*');

    if (studentError) throw studentError;

    // 2. Filter students by class and role manually
    const filteredStudents = allStudents.filter(s => {
      const studentClass = (s.class || '').replace(/\s+/g, '').toUpperCase(); // e.g. "10-A"
      const targetClass = className.replace(/\s+/g, '').toUpperCase();
      const isStudent = (s.role || '').toLowerCase() === 'student';
      
      return studentClass === targetClass && isStudent;
    });

    // 3. Get existing attendance for this date
    const { data: attendance } = await supabase
      .from('Attendance')
      .select('*')
      .eq('date', date)
      .in('studentId', filteredStudents.map(s => s.id));

    // 4. Merge attendance data with students
    const studentsWithAttendance = filteredStudents.map(student => {
      const record = attendance?.find(a => a.studentId === student.id);
      return {
        ...student,
        status: record ? record.status : 'Present', 
        attendanceId: record ? record.id : null
      };
    });

    return NextResponse.json(studentsWithAttendance);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ... (Keep the POST function exactly the same)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attendanceData, date } = body;

    if (!attendanceData || !date) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    const recordsToUpsert = attendanceData.map((record: any) => ({
      studentId: record.studentId,
      date: date,
      status: record.status
    }));

    const { error } = await supabase
      .from('Attendance')
      .upsert(recordsToUpsert, { onConflict: 'studentId, date' });

    if (error) throw error;

    return NextResponse.json({ message: 'Attendance saved successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("❌ ATTENDANCE ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}