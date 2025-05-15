import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import LogoutDialog from "@/components/ui/LogoutDialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";


export default function Dashboard() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setDialogOpen(false);
        await logout();
        navigate("/login");
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
            <Link to="/setting">
                <Button>
                    setting
                </Button>
                </Link>
                <Button
                    className="px-4 py-2 rounded bg-destructive text-white font-bold hover:bg-destructive/80"
                    onClick={() => setDialogOpen(true)}
                >
                    تسجيل الخروج
                </Button>
            <LogoutDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
}