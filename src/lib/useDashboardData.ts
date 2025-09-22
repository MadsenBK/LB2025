// src/hooks/useDashboardData.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

type ProfileNameOnly = {
  first_name: string;
};

type OrgMemberOrgRow = {
  organization_id: string;
  organizations: {
    company_name: string;
  } | null;
};

export const useDashboardData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch profile (first name)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single() as { data: ProfileNameOnly | null, error: any };

        if (profileError) throw profileError;
        setFirstName(profileData?.first_name || "User");

        // Fetch org membership
        const { data: orgData, error: orgError } = await supabase
          .from("organization_members")
          .select("organization_id, organizations(company_name)")
          .eq("profile_id", user.id)
          .maybeSingle() as { data: OrgMemberOrgRow | null, error: any };

        if (orgError) throw orgError;

        if (user.user_metadata.role === "org_admin" && !orgData) {
          navigate("/organization-setup", { replace: true });
          return;
        } else if (user.user_metadata.role === "org_staff" && !orgData) {
          navigate("/contactorgadmin", { replace: true });
          return;
        }
        setOrganizationName(orgData?.organizations?.company_name || "Unknown Organization");

      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  return { firstName, organizationName, loading, error };
};