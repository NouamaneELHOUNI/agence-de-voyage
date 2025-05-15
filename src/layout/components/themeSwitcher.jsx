import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon, Monitor } from 'lucide-react'

function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const [isThemeOpen, setIsThemeOpen] = useState(false)
    return (
        <div>
            {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-card rounded-xl shadow-lg py-2 z-50 border border-border">
                    <button
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-muted ${theme === 'light' ? 'text-primary font-medium' : 'text-foreground'}`}
                        onClick={() => { setTheme('light'); setIsThemeOpen(false); }}
                    >
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                    </button>
                    <button
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-muted ${theme === 'dark' ? 'text-primary font-medium' : 'text-foreground'}`}
                        onClick={() => { setTheme('dark'); setIsThemeOpen(false); }}
                    >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                    </button>
                    <button
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-muted ${theme === 'system' ? 'text-primary font-medium' : 'text-foreground'}`}
                        onClick={() => { setTheme('system'); setIsThemeOpen(false); }}
                    >
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                    </button>
                </div>
            )}
        </div>
    )
}

export default ThemeSwitcher