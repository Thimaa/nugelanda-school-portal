import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // 1. Find the student by email
    const { data: student, error: studentError } = await supabase
      .from('Student')
      .select('*')
      .eq('email', email)
      .single();

    if (studentError || !student) {
      console.error("❌ Student not found for email:", email);
      throw new Error("Student not found");
    }

    // 2. Get family ID (handling both camelCase and lowercase)
    const familyId = student.familyId || student.familyid;

    // 3. If they have a family, fetch the family's fee data
    if (familyId) {
      const { data: familyMembers } = await supabase
        .from('Student')
        .select('*')
        .eq('familyId', familyId);

      if (familyMembers && familyMembers.length > 0) {
        // Since we update all members at once, any member will have the correct data
        const mainMember = familyMembers[0];
        const totalFee = mainMember.totalFee || mainMember.totalfee || 15000;
        const paidAmount = mainMember.paidAmount || mainMember.paidamount || 0;
        
        return NextResponse.json({
          totalFee,
          paidAmount,
          balance: totalFee - paidAmount,
          status: (totalFee - paidAmount) <= 0 ? 'Paid' : 'Pending',
          familyMembersCount: familyMembers.length
        });
      }
    }

    // 4. Fallback for single students (no family)
    const totalFee = student.totalFee || student.totalfee || 15000;
    const paidAmount = student.paidAmount || student.paidamount || 0;

    return NextResponse.json({
      totalFee,
      paidAmount,
      balance: totalFee - paidAmount,
      status: (totalFee - paidAmount) <= 0 ? 'Paid' : 'Pending',
      familyMembersCount: 1
    });

  } catch (error: any) {
    console.error("❌ STUDENT FEES ERROR:", error);
    return NextResponse.json({ message: error.message || 'Error fetching fees' }, { status: 500 });
  }
}