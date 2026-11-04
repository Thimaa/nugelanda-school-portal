import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: deleted, error } = await supabase
      .from('DeletedStudent')
      .select('*')
      .order('deletedAt', { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(deleted);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}