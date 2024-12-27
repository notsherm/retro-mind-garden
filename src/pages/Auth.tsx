import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-terminal-black flex items-center justify-center p-4">
      <div className="w-full max-w-md terminal-window">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-terminal-green mb-2">RESTRICTED ACCESS</h1>
          <p className="text-terminal-gray">AUTHORIZATION REQUIRED</p>
        </div>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4AF626',
                  brandAccent: '#3AD617',
                  inputBackground: 'transparent',
                  inputText: '#4AF626',
                  inputBorder: '#4AF626',
                  inputBorderFocus: '#4AF626',
                  inputBorderHover: '#3AD617',
                  defaultButtonBackground: '#4AF626',
                  defaultButtonBackgroundHover: '#3AD617',
                  defaultButtonBorder: '#4AF626',
                  defaultButtonText: '#1A1F2C',
                },
              },
            },
            className: {
              container: 'terminal-window',
              label: 'text-terminal-green',
              button: 'retro-button',
              input: 'retro-input',
            },
          }}
          providers={[]}
          view="sign_in"
        />
      </div>
    </div>
  );
};

export default Auth;