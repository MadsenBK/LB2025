import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const OrganizationSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    street_adr: "",
    city: "",
    prov: "",
    postal_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("User is not authenticated.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert([{
          company_name: formData.company_name,
          industry: formData.industry,
          street_adr: formData.street_adr,
          city: formData.city,
          prov: formData.prov,
          postal_code: formData.postal_code,
          owner_id: user.id
        }])
        .select()
        .single();

      if (orgError) throw orgError;

      const { error: memberError } = await supabase
        .from("organization_members")
        .insert([{ organization_id: org.id, profile_id: user.id, role: "org_admin" }]);

      if (memberError) throw memberError;

      navigate("/oa_dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#c2d7eb4f] mt-15 mb-15 p-10 pt-8 pb-8 border-1 border-white rounded-lg shadow-2xl shadow-blue-400">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Set Up Your Organization</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Organization Name</label>
            <Input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Industry</label>
            <Input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block mb-1">Street Address</label>
            <Input
              type="text"
              name="street_adr"
              value={formData.street_adr}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block mb-1">City</label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block mb-1">Province</label>
            <Input
              type="text"
              name="prov"
              value={formData.prov}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block mb-1">Postal Code</label>
            <Input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
            />
          </div>

          {errorMsg && <p className="text-red-400">{errorMsg}</p>}

          {/* ✅ Corrected button centering */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-[#FFB347] text-black hover:bg-[#a87b1a] hover:text-black rounded-xl px-4 py-2 mt-3 flex flex-row justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSetup;