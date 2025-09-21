// src/pages/auth/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from '../lib/supabaseClient';
import { useAuth } from "../context/AuthContext";
import { handleUserRedirect } from "./redirects"

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        handleUserRedirect(user, navigate);
      } catch (err) {
        console.error("Auth callback failed:", err);
        alert(err);
        navigate("/", { replace: true });
      }
    };

    handleAuth();
  }, [navigate, setUser]);

  return <p className="text-center mt-10">Processing authentication...</p>;
}
