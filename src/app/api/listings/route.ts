import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { INITIAL_LISTINGS } from '@/lib/mock-data';
import type { Database } from '@/lib/supabase/database.types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campusId = searchParams.get('campus_id');
  const semester = searchParams.get('semester');

  if (!isSupabaseConfigured()) {
    // Return mock data when Supabase credentials haven't been configured yet
    let results = INITIAL_LISTINGS;
    if (campusId) results = results.filter((l) => l.campusId === campusId);
    if (semester && semester !== 'ALL') {
      const semNum = parseInt(semester, 10);
      results = results.filter((l) => l.relevantSemesters?.includes(semNum));
    }
    return NextResponse.json({ data: results, source: 'local-store' });
  }

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('listings').select('*, profiles(*)');
    if (campusId) query = query.eq('campus_id', campusId);
    if (semester && semester !== 'ALL') {
      query = query.contains('relevant_semesters', [parseInt(semester, 10)]);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data, source: 'supabase' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, fallback: INITIAL_LISTINGS }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: { id: `list-${Date.now()}`, ...body },
        source: 'local-store',
      });
    }

    const supabase = await createServerSupabaseClient();
    const insertPayload = body as Database['public']['Tables']['listings']['Insert'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('listings') as any)
      .insert([insertPayload])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data, source: 'supabase' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
