
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./integrations/supabase/client";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Staff from "@/pages/Staff";
import Reports from "@/pages/Reports";
import Payroll from "@/pages/Payroll";
import { useToast } from "./hooks/use-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-fitness-background" />;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      try {
        const sessionResult = await supabase.auth.getSession();
        const userEmail = sessionResult.data.session?.user?.email;
        
        if (!userEmail || !isMounted) return;

        const { data: employees, error } = await supabase
          .from('employees')
          .select('is_admin')
          .eq('email', userEmail);

        if (isMounted) {
          if (error) {
            console.error('Error checking admin status:', error);
            toast({
              title: "Error",
              description: "Failed to verify admin access",
              variant: "destructive",
            });
            setIsAdmin(false);
          } else {
            // Check if any employee was found with admin access
            const isAdminUser = employees && employees.length > 0 && employees[0]?.is_admin;
            setIsAdmin(!!isAdminUser);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error in checkAdminStatus:', error);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    checkAdminStatus();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  if (loading) {
    return <div className="min-h-screen bg-fitness-background" />;
  }

  if (!isAdmin) {
    toast({
      title: "Access Denied",
      description: "You need admin privileges to access this page",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <Staff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Settings />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <Payroll />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
