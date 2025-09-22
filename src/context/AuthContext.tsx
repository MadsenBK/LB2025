// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

type AuthContextType = {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  login: (email: string, password: string) => Promise<{ error: string | null; user?: any }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        // ✅ Fetch role from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        if (profileError) {
          console.error("Error fetching user role:", profileError);
        }

        const userRole = profileData?.role || "guest";

        // ✅ Merge role into user object
        currentUser.user_metadata = {
          ...currentUser.user_metadata,
          role: userRole,
        };
      }
      
      setUser(currentUser ?? null);
      return currentUser; // ✅ Return the user here
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error.message };
      }
      
      const loggedInUser = await fetchUser(); // ✅ Wait for the user data to be fully fetched
      return { error: null, user: loggedInUser }; // ✅ Return the full user object
    } catch (err: any) {
      console.error("Login error:", err);
      return { error: err.message || "Unknown error" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setLoading(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}