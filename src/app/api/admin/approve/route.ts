import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminId, requestEmail } = body;

    // 1. Find the Super Admin (The oldest admin account)
    const { data: allAdmins } = await supabase
      .from('Student')
      .select('email')
      .eq('role', 'admin')
      .eq('status', 'Active')
      .order('createdAt', { ascending: true })
      .limit(1);

    const superAdminEmail = allAdmins?.[0]?.email;

    // 2. Check if the requester is the Super Admin
    if (requestEmail !== superAdminEmail) {
      return NextResponse.json(
        { message: 'Unauthorized. Only the Super Admin can approve admins.' }, 
        { status: 403 }
      );
    }

    // 3. Approve the admin
    const { error } = await supabase
      .from('Student')
      .update({ status: 'Active' })
      .eq('id', adminId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: 'Admin approved successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("❌ APPROVE ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}