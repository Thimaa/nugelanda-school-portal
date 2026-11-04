import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch ALL students (we will filter out admins in JS to avoid casing issues)
    const { data: students, error } = await supabase
      .from('Student')
      .select('*');

    if (error) throw error;

    // Filter out admins and map the data safely
    const formattedStudents = students
      .filter(s => s.role?.toLowerCase() !== 'admin')
      .map(student => ({
        ...student,
        totalFee: student.totalfee || student.totalFee || 15000,
        paidAmount: student.paidamount || student.paidAmount || 0,
        familyId: student.familyid || student.familyId || student.id,
        role: student.role?.toLowerCase()
      }));

    // --- FIX STATS: Count each family only ONCE ---
    const uniqueFamilies = new Map();
    let totalCollected = 0;
    let totalPending = 0;

    formattedStudents.forEach(student => {
      if (!uniqueFamilies.has(student.familyId)) {
        uniqueFamilies.set(student.familyId, true);
        totalCollected += student.paidAmount;
        totalPending += (student.totalFee - student.paidAmount);
      }
    });

    return NextResponse.json({
      students: formattedStudents,
      stats: { 
        totalCollected, 
        totalPending, 
        totalStudents: uniqueFamilies.size 
      }
    });

  } catch (error: any) {
    console.error("❌ FEES ERROR:", error);
    return NextResponse.json({ message: 'Error fetching fees data' }, { status: 500 });
  }
}

// ... (Keep the POST function exactly the same as before)