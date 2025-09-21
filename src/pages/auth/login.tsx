// src/pages/auth/login.tsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { LogIn } from "lucide-react";
import { handleUserRedirect } from "../../lib/redirects";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Perform the login attempt and get the complete user object from the return
    const { error: loginError, user: loggedInUser } = await login(email, password);

    if (loginError) {
      setError(loginError);
      return;
    }

    if (loggedInUser) {
      // ✅ The user object here is guaranteed to be complete
      await handleUserRedirect(loggedInUser, navigate);
    } else {
      // This should ideally never be reached if login was successful
      setError("An unknown error occurred during login.");
    }
  };

  return (
    <div className="flex items-center justify-center px-10 py-10 border-1 border-white rounded-lg shadow-2xl shadow-blue-400">
      <div className="w-full max-w-md rounded-xl">
        <h1 className="text-2xl font-bold mb-8">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded block bg-blue-50 text-black"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded block bg-white text-black"
            />
          </div>
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-[#FFB347] text-black hover:bg-[#a87b1a] hover:text-black rounded-xl px-4 py-2 flex items-center gap-2"
            >
              <LogIn size={18} /> Login
            </Button>
          </div>
        </form>
        <div className="flex justify-center pt-6">
          {error && <p style={{ color: "white" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}