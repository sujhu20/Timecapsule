import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    console.log('Registration attempt:', { name, email, passwordLength: password?.length });

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Use Supabase Auth to sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${process.env.NEXTAUTH_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Supabase Auth sign up error:', error);
      return NextResponse.json(
        { message: 'Error creating user', details: error.message },
        { status: 500 }
      );
    }

    console.log('User created successfully:', { userId: data.user?.id, emailConfirmed: !data.user?.email_confirmed_at });

    // Handle case where email verification is required
    if (data.user && !data.user.email_confirmed_at && data.user.confirmation_sent_at) {
      // Return 201 still, but with a message about email verification
      return NextResponse.json(
        {
          message: 'User created successfully. Please check your email to verify your account.',
          emailVerificationRequired: true,
          user: {
            id: data.user.id,
            name: data.user.user_metadata?.name,
            email: data.user.email,
          }
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: data.user?.id,
          name: data.user?.user_metadata?.name,
          email: data.user?.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 