import { useAuth } from "../../context/AuthContext";
import { useDashboardData } from "../../lib/useDashboardData";
import '../../dist/output.css';
import LoginBtn from '../../components/layouts/login_btn';
import WelcomeMessage from "../../components/dashboard/WelcomeMessage";

import { Card, CardContent } from "../../components/dashboard/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


const Dashboard = () => {
  const { user } = useAuth();
  const { firstName, organizationName, loading, error } = useDashboardData();

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="mb-8">You must be logged in to view this page</p>
        <LoginBtn />
      </div>
    );
  }

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
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

