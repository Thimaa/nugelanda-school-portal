import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Check if email exists
    const { data: existing } = await supabase
      .from('Student')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const studentId = crypto.randomUUID();
    // Generate a unique Family ID for fee sharing
    const familyId = crypto.randomUUID();

    // 2. Insert main student (or admin)
    const { data: student, error: studentError } = await supabase
      .from('Student')
      .insert([
        {
          id: studentId,
          name: body.name,
          email: body.email,
          password: body.password,
          age: body.age || 0,
          class: body.class || 'Admin',
          admissionNumber: body.admissionNumber,
          school: body.school || 'Head Office',
          fatherName: body.fatherName || 'N/A',
          motherName: body.motherName || 'N/A',
          role: body.role,
          birthday: body.birthday || null,
          gender: body.gender || null,
          fatherMobile: body.fatherMobile || null,
          motherMobile: body.motherMobile || null,
          photoUrl: body.photoUrl || null,
          familyId: familyId, // <-- Assign Family ID
          status: body.role === 'admin' ? 'Pending' : 'Active', // <-- Admin Approval Logic
        }
      ])
      .select()
      .single();

    if (studentError) throw new Error(studentError.message);

    // 3. Handle Siblings
    if (body.siblings && body.siblings.length > 0) {
      for (const sib of body.siblings) {
        
        // A. Create the Sibling Link for the main student's profile
        const { error: linkError } = await supabase.from('Sibling').insert([
          {
            id: crypto.randomUUID(),
            name: sib.name,
            admissionNumber: sib.admissionNumber,
            studentId: student.id // <-- THIS IS THE CRUCIAL LINK
          }
        ]);

        if (linkError) {
          console.error("Error linking sibling:", linkError);
        }

        // B. Create a real Student account for the sibling
        const sibEmail = `${sib.admissionNumber}@school.com`; 
        const sibId = crypto.randomUUID();
        
        // Check if sibling already exists to avoid duplicates
        const { data: existingSib } = await supabase
          .from('Student')
          .select('id')
          .eq('admissionNumber', sib.admissionNumber)
          .single();

        if (!existingSib) {
          await supabase.from('Student').insert([
            {
              id: sibId,
              name: sib.name,
              email: sibEmail,
              password: '123456', 
              age: parseInt(sib.age) || body.age || 0,
              class: sib.class || body.class,
              admissionNumber: sib.admissionNumber,
              school: body.school,
              fatherName: body.fatherName,
              motherName: body.motherName,
              role: 'student',
              photoUrl: body.photoUrl,
              birthday: sib.birthday || null,
              gender: sib.gender || null,
              familyId: familyId, // <-- Assign the SAME Family ID for fees
              status: 'Active',
            }
          ]);
        }
      }
    }

    return NextResponse.json({ message: 'Registered successfully', id: student.id }, { status: 201 });
  } catch (error: any) {
    console.error("❌ REGISTER ERROR:", error);
    return NextResponse.json({ message: error.message || 'Database error' }, { status: 500 });
  }
}