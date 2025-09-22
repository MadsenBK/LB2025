import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from './supabaseClient';
import { useAuth } from "../context/AuthContext";
import { handleUserRedirect } from "./redirects";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data.session;
        const user = session?.user;

        if (!user) {
          navigate("/login", { replace: true });
          return;
        }
        
        // This logic is now handled in fetchUser() in AuthContext, 
        // but it's good as a fail-safe on initial signup
        const role = user.user_metadata?.role || "org_admin";
        if (!user.user_metadata?.role) {
          await supabase.auth.updateUser({ data: { ...user.user_metadata, role } });
          user.user_metadata = { ...user.user_metadata, role };
        }

        // Upsert profile
        const { firstName, lastName, phoneNumber } = user.user_metadata || {};
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            first_name: firstName || null,
            last_name: lastName || null,
            email: user.email,
            phone_number: phoneNumber || null,
            role,
          },
          { onConflict: "id" }
        );

        if (profileError) console.error("Profile upsert error:", profileError.message);
        
        setUser(user);

        // Fetch a complete user object to ensure the role is available
        const { data: { user: loggedInUser }, error: userError } = await supabase.auth.getUser();

        if (userError || !loggedInUser) {
          console.error("Failed to retrieve user after callback:", userError?.message);
          navigate("/error", { replace: true });
          return;
        }

        await handleUserRedirect(loggedInUser, navigate);
        
      } catch (err: any) {
        console.error("Auth callback failed:", err);
        alert(err.message || "An unknown error occurred.");
        navigate("/", { replace: true });
      }
    };

    handleAuth();
  }, [navigate, setUser]);

  return <p className="text-center mt-10">Processing authentication...</p>;
}