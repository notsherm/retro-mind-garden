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
        setSession(session);
      } catch (error: any) {
        console.error("Session initialization error:", error);
        // Clear session on error
        setSession(null);
        toast({
          title: "Session Error",
          description: "Please sign in again",
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
      setSession(session);
      
      if (!session) {
        // Clear any cached data or state when session ends
        setLoading(false);
        toast({
          title: "Session Ended",
          description: "Please sign in again to continue",
          duration: 3000,
        });
      }
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