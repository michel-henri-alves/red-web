import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, User, KeyRound, LogOut } from "lucide-react";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    return (
        <header className="relative h-16 bg-[rgba(98,70,234)] text-white flex items-center justify-end px-6 shadow">

            <img src="/m4_white.png" alt="M4"
                className="absolute left-1/2 transform -translate-x-1/2 h-12 w-auto" />

            <div className="relative">

                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 hover:text-gray-200 cursor-pointer"
                >
                    <User size={18} />
                    <ChevronDown size={16} />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded shadow-lg">

                        <div className="px-4 py-2 text-sm border-b font-semibold">
                            {user?.name}
                        </div>

                        <button
                            onClick={() => {
                                setOpen(false);
                                navigate("/change-password");
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                            <KeyRound size={16} />
                            Alterar senha
                        </button>

                        <button
                            onClick={() => {
                                setOpen(false);
                                logout();
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                    </div>
                )}

            </div>

        </header>
    );
}
