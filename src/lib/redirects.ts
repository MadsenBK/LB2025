// src/utils/redirects.ts
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export async function handleUserRedirect(user: any, navigate: ReturnType<typeof useNavigate>) {
  const role = user?.user_metadata?.role;
  // This logic is currently duplicated in AuthCallback and login
  const { data: orgData, error: orgError } = await supabase
    .from("organization_members")
    .select("organization_id, organizations(company_name)")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (orgError) {
    console.error("Error fetching organization:", orgError.message);
    navigate("/error", { replace: true });
    return;
  }

  // Your existing redirect logic
  if ((role === "org_admin" || role === "org_staff") && !orgData) {
    navigate(role === "org_admin" ? "/organization-setup" : "/setup_error", { replace: true });
  } else if (role === "org_admin" && orgData) {
    navigate("/oa_dashboard", { replace: true });
  } else if (role === "org_staff" && orgData) {
    navigate("/os_dashboard", { replace: true });
  } else if (role === "sys_admin") {
    navigate("/sa_dashboard", { replace: true });
  } else {
    navigate("/error", { replace: true });
  }
}