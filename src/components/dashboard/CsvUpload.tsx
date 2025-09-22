// src/components/dashboard/CsvUpload.tsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../ui/button";
import { Card, CardContent } from "./card";

type CsvUploadProps = {
  onUploadSuccess: () => void;
  onClose: () => void;
};

export default function CsvUpload({ onUploadSuccess, onClose }: CsvUploadProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!user) {
      setError("User is not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        const requiredHeaders = ["full_name", "email", "phone_number"];
        
        // Basic header validation
        const hasAllHeaders = requiredHeaders.every(header => headers.includes(header));
        if (!hasAllHeaders) {
          throw new Error(`CSV file must contain the following headers: ${requiredHeaders.join(", ")}`);
        }
        
        const clientsToInsert = [];
        const { data: orgData, error: orgError } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (orgError || !orgData) {
          throw new Error(orgError?.message || "Could not fetch organization ID.");
        }

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length === headers.length) {
            const client: any = { organization_id: orgData.organization_id };
            headers.forEach((header, index) => {
              client[header] = values[index];
            });
            clientsToInsert.push(client);
          }
        }
        
        // Insert data into the database
        const { error: insertError } = await supabase.from("clients").insert(clientsToInsert);
        if (insertError) throw insertError;

        onUploadSuccess();
        onClose();

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-darkmode-panel text-white">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Upload Clients from CSV</h2>
          <p className="text-sm mb-4">Please upload a CSV file with the following headers: `full_name`, `email`, `phone_number`, `notes` (optional).</p>
          <form className="space-y-4">
            <div>
              <label className="block mb-2">Select a CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full text-sm text-neutral-gray
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-accent-steel file:text-white
                           hover:file:bg-accent-steel-dark"
              />
            </div>
            {error && <p className="text-red-400">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="button" onClick={handleUpload} disabled={loading || !file}>
                {loading ? "Uploading..." : "Upload File"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}