import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 1. GET: Fetch the list of students (one per family) and stats
export async function GET() {
  try {
    const { data: students, error } = await supabase
      .from('Student')
      .select('*')
      .eq('role', 'student');

    if (error) throw error;

    // Sort by createdAt to ensure the main student (oldest) is the first one in the family
    const sortedStudents = students.sort((a, b) => 
      new Date(a.createdAt || a.createdat).getTime() - new Date(b.createdAt || b.createdat).getTime()
    );

    const formattedStudents: any[] = [];
    const processedFamilies = new Set(); 
    const familyStats = new Map(); 

    sortedStudents.forEach(student => {
      // Use exact column name 'familyId', fallback to student's own ID if they don't have a family
      const familyId = student.familyId || student.id;
      
      // Use exact column names 'totalFee' and 'paidAmount'
      const fee = student.totalFee !== undefined ? student.totalFee : 15000;
      const paid = student.paidAmount !== undefined ? student.paidAmount : 0;

      // If we haven't added this family to the list yet, add it now
      if (!processedFamilies.has(familyId)) {
        processedFamilies.add(familyId);
        familyStats.set(familyId, { totalFee: fee, paidAmount: paid });
        
        formattedStudents.push({
          ...student,
          totalFee: fee,
          paidAmount: paid,
          familyId: familyId
        });
      }
    });

    // Calculate Stats based on unique families
    let totalCollected = 0;
    let totalPending = 0;

    familyStats.forEach((stats) => {
      totalCollected += stats.paidAmount;
      totalPending += (stats.totalFee - stats.paidAmount);
    });

    return NextResponse.json({
      students: formattedStudents,
      stats: { 
        totalCollected, 
        totalPending, 
        totalStudents: processedFamilies.size 
      }
    });

  } catch (error: any) {
    console.error("❌ FEES ERROR:", error);
    return NextResponse.json({ message: 'Error fetching fees data' }, { status: 500 });
  }
}

// 2. POST: Record a payment for the entire family
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, amountPaid } = body;

    if (!studentId) return NextResponse.json({ message: 'Student ID is missing' }, { status: 400 });

    // 1. Fetch the student using exact column names
    const { data: student, error: fetchError } = await supabase
      .from('Student')
      .select('id, familyId, paidAmount') 
      .eq('id', studentId)
      .single();

    if (fetchError || !student) {
      console.error("❌ DB FETCH ERROR:", fetchError);
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const familyId = student.familyId;
    const currentPaid = student.paidAmount || 0;
    const newPaidAmount = currentPaid + Number(amountPaid);

    // 2. Update the main student
    const { error: updateError } = await supabase
      .from('Student')
      .update({ paidAmount: newPaidAmount })
      .eq('id', studentId);

    if (updateError) {
      console.error("❌ DB UPDATE ERROR:", updateError);
      throw new Error(updateError.message);
    }

    // 3. FAMILY LOGIC: Update all other students with the same familyId
    if (familyId) {
      const { data: familyMembers } = await supabase
        .from('Student')
        .select('id, paidAmount')
        .eq('familyId', familyId)
        .neq('id', studentId); 

      if (familyMembers && familyMembers.length > 0) {
        for (const member of familyMembers) {
          const memberCurrentPaid = member.paidAmount || 0;
          const memberNewPaid = memberCurrentPaid + Number(amountPaid);
          
          await supabase
            .from('Student')
            .update({ paidAmount: memberNewPaid })
            .eq('id', member.id);
        }
      }
    }

    return NextResponse.json({ message: 'Payment recorded successfully for family' }, { status: 200 });

  } catch (error: any) {
    console.error("❌ PAYMENT ERROR:", error);
    return NextResponse.json({ message: error.message || 'Failed to record payment' }, { status: 500 });
  }
}