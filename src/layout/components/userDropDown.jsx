import { User, Settings, LogOut, ChevronDown, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import useAuthStore from "@/store/authStore"
import useUserStore from "@/store/userStore"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";

function UserDropDown() {
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { profile, fetchUserProfile, } = useUserStore()
    const { user, logout } = useAuthStore()

    useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                setIsLoading(true);
                await fetchUserProfile();
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [user, fetchUserProfile])

    const handleLogout = async () => {
        await logout();
        setLogoutDialogOpen(false);
    };

    const userName = profile?.name || user?.displayName || "جون دو";
    const userEmail = profile?.email || user?.email || "john.doe@example.com";
    const userPosition = profile?.position || "مشرف";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 bg-card rounded-xl px-3 py-2 shadow-sm hover:bg-muted">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {isLoading ? (
                                <Skeleton className="h-5 w-5" />
                            ) : (
                                <User className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                        <div className="hidden sm:block text-left">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-4 w-16 mb-1" />
                                    <Skeleton className="h-3 w-12" />
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-foreground text-right">{userName.slice(0, 3)}...</p>
                                    <p className="text-xs text-muted-foreground text-right">{userPosition.slice(0, 3)}...</p>
                                </>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-right w-48" dir="rtl">
                    <div className="px-4 py-3 border-b border-border">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-28" />
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-foreground">{userName}</p>
                                <p className="text-xs text-muted-foreground">{userEmail}</p>
                            </>
                        )}
                    </div>
                    <DropdownMenuItem asChild>
                        <Link to="/dashboard/settings" className="flex items-center">
                            <User className="h-4 w-4 ml-2 text-muted-foreground" />
                            ملفك الشخصي
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/dashboard/settings" className="flex items-center">
                            <Settings className="h-4 w-4 ml-2 text-muted-foreground" />
                            الإعدادات
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)} className="text-destructive">
                        <LogOut className="h-4 w-4 ml-2 text-destructive" />
                        تسجيل الخروج
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} size="lg">
                <DialogContent dir="rtl" className="[&>button]:left-4 [&>button]:right-auto">
                    <DialogHeader className='mt-2'>
                        <DialogTitle className="text-center md:text-right">تأكيد تسجيل الخروج</DialogTitle>
                        <DialogDescription className="text-center md:text-right">
                            هل أنت متأكد أنك تريد تسجيل الخروج من النظام؟
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            تسجيل الخروج
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default UserDropDown;