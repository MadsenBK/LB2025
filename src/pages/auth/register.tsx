import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../components/ui/button";
import { LogIn } from "lucide-react";


export default function Register() {
  const navigate = useNavigate(); // ✅ from react-router-dom
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          phoneNumber: phoneNumber || null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`, // ✅ email confirmation redirect
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      alert("Check your email to confirm registration!");
      navigate("/"); // ✅ redirect to login after signup
    }
  }

  return (
    <div className="flex items-center justify-center bg-[#253b49] p-10 pt-16 pb-16 border-1 border-white rounded-lg shadow-2xl shadow-blue-400">
      <div className="w-full max-w-md rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-8">Register</h1>
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-3 gap-4">

              <div>
                <input 
                type="text" 
                name="firstName" 
                placeholder="First Name" required 
                className="w-full px-3 py-2 border rounded block bg-white text-black"/>
              </div>
              <div>
                <input 
                type="text" 
                name="lastName" 
                placeholder="Last Name" required 
                className="w-full px-3 py-2 border rounded block bg-white text-black"/>
              </div>
              <div>
                <input 
                type="email" 
                name="email" 
                placeholder="Email" required 
                className="w-full px-3 py-2 border rounded block bg-white text-black"/>
              </div>              
              <div>
                <input 
                type="text" 
                name="phoneNumber" 
                placeholder="Phone Number" 
                className="w-full px-3 py-2 border rounded block bg-white text-black"/>
              </div>

              <div>
                <input 
                type="password" 
                name="password" 
                placeholder="Password" required 
                className="w-full px-3 py-2 border rounded block bg-white text-black"/>
              </div>
              <div>
                <input 
                type="c_password" 
                name="c_password" 
                placeholder="Confirm Password" required 
                className="w-full px-3 py-2 border rounded block bg-white text-black"/>
              </div>
              

            </div>

            

            <div className="flex justify-center items-center pt-4">
              <Button 
                type="submit" 
                className="bg-[#FFB347] text-black hover:bg-[#a87b1a] hover:text-black rounded-xl px-4 py-2 flex items-center gap-2"
              >
                <LogIn size={18} /> {loading ? "Registering..." : "Register"}
              </Button>   
            </div>
          </form>
      </div>
    </div>
  );
}
