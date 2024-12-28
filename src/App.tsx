import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Auth from "./pages/Auth";
import Index from "./pages/Index";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        if (currentSession) {
          // Verify session is valid by making a test request
          const { error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.error("User verification error:", userError);
            throw userError;
          }
          setSession(currentSession);
        } else {
          console.log("No active session found");
          setSession(null);
        }
      } catch (error: any) {
        console.error("Session initialization error:", error);
        // Clear session and local storage on error
        setSession(null);
        await supabase.auth.signOut();
        localStorage.clear();
        
        toast({
          title: "Session Error",
          description: "Please sign in to continue.",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event);
      
      if (_event === 'SIGNED_OUT') {
        // Clear all storage on sign out
        localStorage.clear();
        setSession(null);
        toast({
          title: "Signed Out",
          description: "You have been signed out successfully",
          duration: 3000,
        });
      } else if (_event === 'SIGNED_IN' && session) {
        setSession(session);
        toast({
          title: "Signed In",
          description: "Welcome back!",
          duration: 3000,
        });
      } else if (_event === 'TOKEN_REFRESHED' && session) {
        setSession(session);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-black flex items-center justify-center">
        <div className="text-terminal-green">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={session ? <Index /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/auth" 
          element={!session ? <Auth /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;