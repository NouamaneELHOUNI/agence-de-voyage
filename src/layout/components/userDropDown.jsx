import { User, Settings, LogOut, ChevronDown, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function UserDropDown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 bg-card rounded-xl px-3 py-2 shadow-sm hover:bg-muted">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-foreground">جون...</p>
                        <p className="text-xs text-muted-foreground">مشرف</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-right w-48" dir="rtl">
                <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">جون دو</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
                <DropdownMenuItem asChild>
                    <a href="/profile" className="flex items-center">
                        <User className="h-4 w-4 ml-2 text-muted-foreground" />
                        ملفك الشخصي
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="/client" className="flex items-center">
                        <Users className="h-4 w-4 ml-2 text-muted-foreground" />
                        العملاء
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="/settings" className="flex items-center">
                        <Settings className="h-4 w-4 ml-2 text-muted-foreground" />
                        الإعدادات
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {/* handle logout */ }} className="text-destructive">
                    <LogOut className="h-4 w-4 ml-2 text-destructive" />
                    تسجيل الخروج
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserDropDown;