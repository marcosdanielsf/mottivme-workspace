import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const locationId = searchParams.get('locationId');
  
  if (!userId || !locationId) {
    return NextResponse.json(
      { error: 'Missing userId or locationId' },
      { status: 400 }
    );
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('ghl_user_id', userId)
    .eq('ghl_location_id', locationId)
    .order('created_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Manual transaction creation
  const { data, error } = await supabase
    .from('transactions')
    .insert(body)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}