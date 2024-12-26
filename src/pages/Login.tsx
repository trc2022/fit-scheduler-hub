import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const redirectUrl = new URL(window.location.origin).toString().replace(/\/$/, '');

  return (
    <div className="min-h-screen bg-fitness-background flex items-center justify-center p-4 font-['Cousine']">
      <div className="w-full max-w-md">
        <div className="bg-fitness-card rounded-lg p-8">
          <h1 className="text-2xl font-bold text-fitness-text mb-2 text-center font-['Cousine'] tracking-wider tracking-wider">ScheduleFor</h1>
          <p className="text-fitness-text text-center mb-6 font-['Cousine'] text-sm">Sign in to your account or create a new one</p>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#15e7fb',
                    brandAccent: '#15e7fb',
                  },
                },
              },
              className: {
                container: 'auth-container font-[Cousine]',
                button: 'auth-button font-[Cousine]',
                anchor: 'auth-anchor font-[Cousine]',
                input: 'text-white font-[Cousine]',
              },
              style: {
                input: {
                  color: '#FFFFFF',
                  fontFamily: 'Cousine',
                },
              },
            }}
            providers={[]}
            redirectTo={redirectUrl}
            view="sign_up"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;