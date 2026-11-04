import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) return NextResponse.json({ message: 'Email is required' }, { status: 400 });

    // 1. Find the student
    const { data: student, error: studentError } = await supabase
      .from('Student')
      .select('*')
      .eq('email', email)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // 2. Get family ID
    const familyId = student.familyId;

    // 3. Fetch family data
    if (familyId) {
      const { data: familyMembers } = await supabase
        .from('Student')
        .select('*')
        .eq('familyId', familyId);

      if (familyMembers && familyMembers.length > 0) {
        // Find the member with the highest paid amount (to prevent sync issues)
        const bestMember = familyMembers.reduce((prev, current) => {
          const prevPaid = prev.paidAmount || 0;
          const currPaid = current.paidAmount || 0;
          return (prevPaid > currPaid) ? prev : current;
        });

        const totalFee = bestMember.totalFee !== undefined ? bestMember.totalFee : 15000;
        const paidAmount = bestMember.paidAmount !== undefined ? bestMember.paidAmount : 0;
        
        return NextResponse.json({
          totalFee,
          paidAmount,
          balance: totalFee - paidAmount,
          status: (totalFee - paidAmount) <= 0 ? 'Paid' : 'Pending',
          familyMembersCount: familyMembers.length,
          // THIS IS THE CRUCIAL ADDITION FOR THE MODAL
          familyMembers: familyMembers.map(m => ({
            name: m.name,
            admissionNumber: m.admissionnumber || m.admissionNumber,
            class: m.class
          }))
        });
      }
    }

    // Fallback for single students
    const totalFee = student.totalFee !== undefined ? student.totalFee : 15000;
    const paidAmount = student.paidAmount !== undefined ? student.paidAmount : 0;

    return NextResponse.json({
      totalFee,
      paidAmount,
      balance: totalFee - paidAmount,
      status: (totalFee - paidAmount) <= 0 ? 'Paid' : 'Pending',
      familyMembersCount: 1,
      familyMembers: [{
        name: student.name,
        admissionNumber: student.admissionnumber || student.admissionNumber,
        class: student.class
      }]
    });

  } catch (error: any) {
    console.error("❌ STUDENT FEES ERROR:", error);
    return NextResponse.json({ message: error.message || 'Error fetching fees' }, { status: 500 });
  }
}