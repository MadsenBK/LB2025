import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import '../../dist/output.css';
import LoginBtn from '../../components/layouts/login_btn';
import WelcomeMessage from "../../components/dashboard/WelcomeMessage";

import { Card, CardContent } from "../../components/dashboard/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


type ProfileNameOnly = {
  first_name: string;
};

type OrgMemberOrgRow = {
  organization_id: string;
  organizations: {
    company_name: string;
  } | null;
};


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      // Fetch profile (first name)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .single() as { data: ProfileNameOnly | null, error: any };

        

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else {
        setFirstName(profileData?.first_name || "User");
      }

      // Fetch org membership
      const { data: orgData, error: orgError } = await supabase
        .from("organization_members")
        .select("organization_id, organizations(company_name)")
        .eq("profile_id", user.id)
        .maybeSingle() as { data: OrgMemberOrgRow, error: any };

      if (orgError) {
        console.error("Error fetching organization:", orgError.message);
        return;
      }

      if (user.role === "org_admin" && !orgData) {
        // Safety net → redirect if no org
        navigate("/organization-setup", { replace: true });
        return;
      } else if (user.role === "org_staff" && !orgData) {
        navigate("/contactorgadmin", { replace: true });
        return;
      }

      setOrganizationName(orgData.organizations?.company_name || "Unknown Organization");
    };

    fetchUserProfile();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="mb-8">You must be logged in to view this page</p>
        <LoginBtn />
      </div>
    );
  }

  const data = [
    { name: "Reviews", value: 14 },
    { name: "Reminders", value: 9 },
    { name: "Connections", value: 22 },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
  
      {/* Welcome message */}
      <div className="p-6">
        <WelcomeMessage firstName={firstName} organizationName={organizationName} />
      </div>


      {/* Content */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <Card className="col-span-1 bg-gray-800 rounded-2xl shadow">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-8">Quick Actions</h2>
            <Button className="w-full bg-[#3A6EA5] text-white rounded-xl hover:bg-[#26517d]">
              Add New Review Reminder
            </Button>
            <Button className="w-full bg-[#3A6EA5] text-white rounded-xl hover:bg-[#26517d]">
              Invite a Connection
            </Button>
          </CardContent>
        </Card>

        {/* Center Panel */}
        <Card className="col-span-2 bg-gray-800 rounded-2xl shadow">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-8">Engagement Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b36a7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom Panel */}
        <Card className="col-span-3 h-42 bg-gray-800 rounded-2xl shadow">
          <CardContent className="p-6 pt-8 space-y-4">
            <h2 className="text-xl font-semibold mb-8">Search Local Businesses</h2>
            <div className="flex gap-2">
              <Input placeholder="Search by name or location..." className="rounded-xl border-[#9C9C9C]" />
              <Button className="bg-[#3A6EA5] text-white rounded-xl hover:bg-[#26517d]">Search</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

