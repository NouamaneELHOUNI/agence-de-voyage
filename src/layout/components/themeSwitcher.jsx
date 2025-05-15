import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-card shadow-sm hover:bg-muted"
                    aria-label="تغيير السمة"
                >
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : theme === "light" ? <Sun className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-right" dir="rtl">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4 ml-2" />
                    فاتح
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 ml-2" />
                    داكن
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="h-4 w-4 ml-2" />
                    النظام
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ThemeSwitcher;