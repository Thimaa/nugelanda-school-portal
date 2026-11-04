import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 1. DELETE: Remove a student, save to archive, and record the reason
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Extract the reason from the request body
    const body = await req.json().catch(() => ({}));
    const reason = body.reason || 'No reason provided';

    // 1. Fetch the student details before deleting
    const { data: student, error: fetchError } = await supabase
      .from('Student')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !student) throw new Error("Student not found");

    // 2. Insert into DeletedStudent table
    const { error: archiveError } = await supabase
      .from('DeletedStudent')
      .insert([{
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        // Handle both camelCase and lowercase column names
        admissionNumber: student.admissionnumber || student.admissionNumber,
        deleteReason: reason,
      }]);

    if (archiveError) throw new Error(`Archive failed: ${archiveError.message}`);

    // 3. Delete from Student table
    const { error: deleteError } = await supabase
      .from('Student')
      .delete()
      .eq('id', id);

    if (deleteError) throw new Error(deleteError.message);

    // 4. Delete sibling links associated with the student
    await supabase.from('Sibling').delete().eq('studentId', id);

    return NextResponse.json({ message: 'Student deleted and archived successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("❌ DELETE ERROR:", error);
    return NextResponse.json({ message: error.message || 'Failed to delete student' }, { status: 500 });
  }
}

// 2. PUT: Update a student's details
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Update the student in the database
    const { data, error } = await supabase
      .from('Student')
      .update({
        name: body.name,
        email: body.email,
        class: body.class,
        age: parseInt(body.age) || 0,
        // Handle both camelCase and lowercase forms for safety
        admissionnumber: body.admissionNumber || body.admissionnumber, 
        gender: body.gender,
        birthday: body.birthday,
        fathername: body.fatherName || body.fathername,
        mothername: body.motherName || body.mothername,
        fathermobile: body.fatherMobile || body.fathermobile,
        mothermobile: body.motherMobile || body.mothermobile,
        school: body.school,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: 'Student updated successfully', student: data }, { status: 200 });
  } catch (error: any) {
    console.error("❌ UPDATE ERROR:", error);
    return NextResponse.json({ message: error.message || 'Failed to update student' }, { status: 500 });
  }
}