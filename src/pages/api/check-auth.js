import { getServerSession } from "next-auth/next";
import { authOptions } from "../../app/api/auth/[...nextauth]/options";
import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    // Get the session
    const session = await getServerSession(req, res, authOptions);
    
    // Check the session
    if (!session) {
      return res.status(401).json({ 
        authenticated: false, 
        error: "Not authenticated", 
        session: null 
      });
    }
    
    // Get user IDs
    const userId = session.user.id;
    const userSub = session.user.sub;
    
    // Check the database for capsules with this user's ID
    const { data: capsulesWithId, error: idError } = await supabase
      .from('capsules')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .limit(5);
    
    let capsulesWithSub = [];
    if (userSub && userSub !== userId) {
      const { data: subData, error: subError } = await supabase
        .from('capsules')
        .select('id, title, created_at')
        .eq('user_id', userSub)
        .limit(5);
      
      if (!subError) {
        capsulesWithSub = subData;
      }
    }
    
    // Check for all capsules
    const { data: allCapsules, error: allError } = await supabase
      .from('capsules')
      .select('id, title, user_id')
      .limit(10);
    
    // Return information about the session and capsules
    return res.status(200).json({
      authenticated: true,
      session: {
        user: {
          ...session.user,
          id: userId,
          sub: userSub,
        },
        expires: session.expires
      },
      capsules: {
        withUserId: capsulesWithId || [],
        withUserSub: capsulesWithSub || [],
        all: allCapsules || []
      }
    });
  } catch (error) {
    console.error("Error in check-auth API:", error);
    return res.status(500).json({ error: "An error occurred checking authentication" });
  }
} 