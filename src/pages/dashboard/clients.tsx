// src/pages/dashboard/Clients.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { Card, CardContent } from "../../components/dashboard/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useDashboardData } from "../../lib/useDashboardData";
import CsvUpload from "../../components/dashboard/CsvUpload"; // ✅ Import new component

type Client = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  notes: string | null;
  organization_id: string;
};

type ClientFormData = {
  full_name: string;
  email: string;
  phone_number: string;
  notes: string;
};

export default function ClientsPage() {
  const { user } = useAuth();
  const { organizationName, firstName, loading: dashboardLoading } = useDashboardData();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false); // ✅ New state for CSV modal
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    full_name: "",
    email: "",
    phone_number: "",
    notes: "",
  });

  const fetchClients = async () => {
    if (!user) return;
    setLoading(true);
    const { data: orgData, error: orgError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (orgError || !orgData) {
      setError(orgError?.message || "Could not fetch organization ID.");
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("clients")
      .select("*")
      .eq("organization_id", orgData.organization_id);
    
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setCurrentClient(client);
      setFormData({
        full_name: client.full_name,
        email: client.email,
        phone_number: client.phone_number,
        notes: client.notes || "",
      });
    } else {
      setCurrentClient(null);
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentClient(null);
    setFormData({
      full_name: "",
      email: "",
      phone_number: "",
      notes: "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: orgData, error: orgError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (orgError || !orgData) {
        throw new Error(orgError?.message || "Could not fetch organization ID.");
      }

      if (currentClient) {
        const { error } = await supabase
          .from("clients")
          .update(formData)
          .eq("id", currentClient.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("clients")
          .insert([{ ...formData, organization_id: orgData.organization_id }]);
        if (error) throw error;
      }

      handleCloseModal();
      await fetchClients();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the client.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      setLoading(true);
      setError(null);
      try {
        const { error } = await supabase
          .from("clients")
          .delete()
          .eq("id", clientId);
        if (error) throw error;
        setClients(clients.filter(client => client.id !== clientId));
      } catch (err: any) {
        setError(err.message || "An error occurred while deleting the client.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (dashboardLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <div className="p-6 text-center mt-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {firstName}!</h1>
        <p className="">You are viewing the dashboard for {organizationName || "Organization not set"}.</p>
      </div>

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Clients</h2>
          <div className="flex gap-2">
            <Button onClick={() => setIsCsvModalOpen(true)} className="bg-accent-steel hover:bg-accent-steel-dark text-white rounded-xl px-4 py-2">
              Upload from CSV
            </Button>
            <Button onClick={() => handleOpenModal()} className="bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-xl px-4 py-2">
              Add New Client
            </Button>
          </div>
        </div>
        
        {loading ? (
          <p>Loading clients...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-darkmode-panel rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{client.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button onClick={() => handleOpenModal(client)} className="text-primary-light hover:text-primary-DEFAULT" variant="secondary">
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(client.id)} className="text-red-400 hover:text-red-600 ml-4" variant="secondary">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal for adding/editing a client */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-darkmode-panel p-6">
            <h2 className="text-xl font-bold mb-4">{currentClient ? "Edit Client" : "Add New Client"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block mb-1">Full Name</label>
                <Input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Phone Number</label>
                <Input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-xl text-black"
                ></textarea>
              </div>
              {error && <p className="text-red-400">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" onClick={handleCloseModal} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Client"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      
      {/* ✅ Render the CsvUpload modal */}
      {isCsvModalOpen && (
        <CsvUpload 
          onUploadSuccess={fetchClients} 
          onClose={() => setIsCsvModalOpen(false)} 
        />
      )}
    </div>
  );
}