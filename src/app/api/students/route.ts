import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Fetch all students
    const { data: students, error: studentError } = await supabase
      .from('Student')
      .select('*')
      .eq('role', 'student');

    if (studentError) {
      console.error("❌ SUPABASE STUDENT ERROR:", studentError);
      throw new Error(studentError.message);
    }

    // 2. Fetch siblings
    const { data: siblings, error: sibError } = await supabase
      .from('Sibling')
      .select('*');

    if (sibError) {
      console.error("❌ SUPABASE SIBLING ERROR:", sibError);
      throw new Error(sibError.message);
    }

    // 3. Format the data to guarantee the frontend gets exactly what it needs
    const formattedStudents = students.map(student => {
      // Find siblings for this student (handling both casing formats)
      const studentSiblings = siblings.filter(sib => 
        sib.studentId === student.id || sib.studentid === student.id
      );
      
      return {
        ...student,
        // Force standard camelCase keys for the frontend UI
        admissionNumber: student.admissionnumber || student.admissionNumber || 'N/A',
        photoUrl: student.photourl || student.photoUrl || null,
        fatherName: student.fathername || student.fatherName || 'N/A',
        motherName: student.mothername || student.motherName || 'N/A',
        fatherMobile: student.fathermobile || student.fatherMobile || 'N/A',
        motherMobile: student.mothermobile || student.motherMobile || 'N/A',
        siblings: studentSiblings
      };
    });

    return NextResponse.json(formattedStudents);

  } catch (error: any) {
    console.error("❌ FETCH STUDENTS ERROR:", error);
    return NextResponse.json({ message: error.message || 'Database error' }, { status: 500 });
  }
}