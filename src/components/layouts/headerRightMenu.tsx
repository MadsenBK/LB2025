import { useAuth } from "../../context/AuthContext";
import LoginBtn from './login_btn'
import { LogOut, Settings } from "lucide-react";
import { Button } from "../ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
        <div>
            {user ? (
                    <div className="flex gap-4 items-center">
                        <Settings className="cursor-pointer" />
                        <Button onClick={logout} className="bg-[#FFB347] text-black hover:bg-[#a87b1a] hover:text-black rounded-xl px-4 py-2 flex items-center gap-2">
                            <LogOut size={18} /> Logout
                        </Button>
                    </div>
            ) : (
                    <div className="flex flex-row space-x-5">
                        <a href="/login" className="inline-block py-3 px-6 rounded-lg font-bold 
                            transition duration-300 ease-in-out 
                            bg-yellow-600 text-white 
                            hover:bg-[#E8B83D] hover:text-[#1A2434]">
                            Subscribe
                        </a>
                        <LoginBtn />
                    </div>
            )}
        </div>

  );
}
