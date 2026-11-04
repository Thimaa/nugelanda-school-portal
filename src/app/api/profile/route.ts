import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; 
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) return NextResponse.json({ message: 'Email is required' }, { status: 400 });

    // 1. Get the main student
    const { data: student, error } = await supabase
      .from('Student')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // 2. Get the siblings linked to this student
    // The exact column name in your Sibling table is 'studentId'
    const { data: siblings } = await supabase
      .from('Sibling')
      .select('*')
      .eq('studentId', student.id);

    // 3. Format the data safely
    const formattedStudent = {
      ...student,
      photoUrl: student.photourl || student.photoUrl || null,
      birthday: student.birthday || null,
      gender: student.gender || null,
      fatherMobile: student.fathermobile || student.fatherMobile || null,
      motherMobile: student.mothermobile || student.motherMobile || null,
      admissionNumber: student.admissionnumber || student.admissionNumber,
      
      // Make sure the siblings array is returned
      siblings: (siblings || []).map(sib => ({
        ...sib,
        admissionNumber: sib.admissionnumber || sib.admissionNumber
      })), 
    };

    return NextResponse.json(formattedStudent);
  } catch (error: any) {
    console.error("❌ PROFILE FETCH ERROR:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}