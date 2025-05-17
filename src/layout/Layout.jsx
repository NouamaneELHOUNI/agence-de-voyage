import { AppSidebar } from "./components/sideBar"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { Header } from './components/header'
import { 
    Home, 
    Users, 
    Building2, 
    Briefcase, 
    Package, 
    Hotel, 
    Plane, 
    Settings,
    LogOut
} from "lucide-react"

import { Outlet } from "react-router-dom"

// Navigation items structure for sidebar (in Arabic)
const sidebarItems = [
    // Main Dashboard
    {
        title: "لوحة القيادة",
        url: "/",
        icon: Home,
        isActive: true,
        category: "الرئيسية"
    },
    
    // User Management
    {
        title: "المستخدمين",
        url: "/users",
        icon: Users,
        category: "إدارة المستخدمين",
        items: [
            {
                title: "جميع المستخدمين",
                url: "/users",
            },
            {
                title: "إضافة مستخدم",
                url: "/users/add",
            }
        ]
    },
    
    // Clients Management
    {
        title: "العملاء",
        url: "/clients",
        icon: Users,
        category: "إدارة العملاء",
        items: [
            {
                title: "جميع العملاء",
                url: "/clients/all",
            },
            {
                title: "إضافة عميل",
                url: "/clients/add",
            }
        ]
    },
    
    // Agency Management
    {
        title: "الوكالات",
        url: "/agencies",
        icon: Building2,
        category: "إدارة الوكالات",
        items: [
            {
                title: "جميع الوكالات",
                url: "/agencies/all",
            },
            {
                title: "إضافة وكالة",
                url: "/agencies/add",
            }
        ]
    },
    
    // Services Management
    {
        title: "الخدمات",
        url: "/services",
        icon: Briefcase,
        category: "إدارة المحتوى",
        items: [
            {
                title: "جميع الخدمات",
                url: "/services/all",
            },
            {
                title: "إضافة خدمة",
                url: "/services/add",
            }
        ]
    },
    
    // Packages Management
    {
        title: "الباقات",
        url: "/packages",
        icon: Package,
        category: "إدارة المحتوى",
        items: [
            {
                title: "جميع الباقات",
                url: "/packages/all",
            },
            {
                title: "إضافة باقة",
                url: "/packages/add",
            }
        ]
    },
    
    // Hotels Management
    {
        title: "الفنادق",
        url: "/hotels",
        icon: Hotel,
        category: "إدارة السفر",
        items: [
            {
                title: "جميع الفنادق",
                url: "/hotels/all",
            },
            {
                title: "إضافة فندق",
                url: "/hotels/add",
            }
        ]
    },
    
    // Flights Management
    {
        title: "الرحلات الجوية",
        url: "/flights",
        icon: Plane,
        category: "إدارة السفر",
        items: [
            {
                title: "جميع الرحلات",
                url: "/flights/all",
            },
            {
                title: "إضافة رحلة",
                url: "/flights/add",
            }
        ]
    }
]

// Footer items for the sidebar
const footerItems = [
    {
        title: "الإعدادات",
        url: "/settings",
        icon: Settings
    },
    {
        title: "تسجيل الخروج",
        url: "/logout",
        icon: LogOut
    }
]

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar items={sidebarItems} footerItems={footerItems} />
            <SidebarInset>
                <div className="flex flex-col min-h-full p-4">
                    <Header />
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
