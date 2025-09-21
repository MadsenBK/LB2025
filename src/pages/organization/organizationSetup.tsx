import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const OrganizationSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [company_name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [street_adr, setAdr] = useState("");
  const [city, setCity] = useState("");
  const [prov, setProv] = useState("");
  const [postalCode, setPC] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert([{
          company_name,
          industry,
          street_adr,
          city,
          prov,
          postal_code: postalCode,
          owner_id: user.id
        }])
        .select()
        .single();

      if (orgError) throw orgError;

      // 2. Link user as owner in organization_members (optional, but keeps consistency)
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Set Up Your Organization</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Organization Name</label>
          <input
            type="text"
            value={company_name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded text-white border border-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Industry</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 rounded text-white border border-white"
          />
        </div>

        <div>
          <label className="block mb-1">Street Address</label>
          <input
            type="text"
            value={street_adr}
            onChange={(e) => setAdr(e.target.value)}
            className="w-full px-3 py-2 rounded text-white border border-white"
          />
        </div>

        <div>
          <label className="block mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 rounded text-white border border-white"
          />
        </div>

        <div>
          <label className="block mb-1">Province</label>
          <input
            type="text"
            value={prov}
            onChange={(e) => setProv(e.target.value)}
            className="w-full px-3 py-2 rounded text-white border border-white"
          />
        </div>

        <div>
          <label className="block mb-1">Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPC(e.target.value)}
            className="w-full px-3 py-2 rounded text-white border border-white"
          />
        </div>

        {errorMsg && <p className="text-red-400">{errorMsg}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
};

export default OrganizationSetup;

