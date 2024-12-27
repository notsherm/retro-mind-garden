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
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          // No active session found
          console.log("No active session found");
          throw new Error("No active session");
        }
        
        // Verify session is valid by making a test request
        const { error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        setSession(session);
      } catch (error: any) {
        console.error("Session initialization error:", error);
        // Clear session and local storage on error
        setSession(null);
        await supabase.auth.signOut();
        localStorage.clear();
        
        toast({
          title: "Session Error",
          description: "Your session has expired. Please sign in again.",
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
      
      if (_event === 'SIGNED_OUT' || _event === 'USER_DELETED') {
        // Clear all storage on sign out
        localStorage.clear();
        setSession(null);
        toast({
          title: "Signed Out",
          description: "You have been signed out successfully",
          duration: 3000,
        });
      } else if (_event === 'SIGNED_IN') {
        setSession(session);
        toast({
          title: "Signed In",
          description: "Welcome back!",
          duration: 3000,
        });
      } else if (_event === 'TOKEN_REFRESHED') {
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