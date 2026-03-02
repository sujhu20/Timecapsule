import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, method = 'GET', payload } = body;
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Supabase URL not configured' },
        { status: 500 }
      );
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase API key not configured' },
        { status: 500 }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}${path}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    };

    const options: RequestInit = {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    };

    console.log(`Proxying request to Supabase: ${method} ${url}`);
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(`Supabase proxy error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Supabase returned ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Supabase proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Supabase proxy is running' });
} 