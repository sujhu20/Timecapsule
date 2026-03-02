import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession();
    
    // Log session info in development
    if (process.env.NODE_ENV === 'development') {
      console.log('User Session API:', { 
        hasUser: !!session?.user,
        hasId: !!(session?.user?.id || session?.user?.sub)
      });
    }
    
    // Handle not authenticated case
    if (!session?.user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('User Session API: No session, using mock data in development');
        // In development, provide a mock session
        return NextResponse.json({
          user: {
            id: '254067f1-ddd6-4376-bbad-35a75f5df44d',
            name: 'Mock User',
            email: 'mock@example.com'
          }
        });
      }
      
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Handle missing ID case
    if (!session.user.id && !session.user.sub) {
      if (process.env.NODE_ENV === 'development') {
        console.log('User Session API: No user ID in session, adding mock ID in development');
        // In development, add the mock ID to the session
        return NextResponse.json({
          ...session,
          user: {
            ...session.user,
            id: '254067f1-ddd6-4376-bbad-35a75f5df44d',
            sub: '254067f1-ddd6-4376-bbad-35a75f5df44d'
          }
        });
      }
      
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }
    
    // Return the session
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error in session API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 