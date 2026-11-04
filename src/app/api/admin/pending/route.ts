import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Student')
      .select('id, name, email')
      .eq('role', 'admin')
      .eq('status', 'Pending');

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}