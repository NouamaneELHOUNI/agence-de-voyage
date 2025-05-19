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
        url: "/dashboard/users",
        icon: Users,
        category: "إدارة المستخدمين",
        items: [
            {
                title: "جميع المستخدمين",
                url: "/dashboard/users",
            },
            {
                title: "إضافة مستخدم",
                url: "/dashboard/users/add",
            }
        ]
    },
    
    // Clients Management
    {
        title: "العملاء",
        url: "/dashboard/clients",
        icon: Users,
        category: "إدارة العملاء",
        items: [
            {
                title: "جميع العملاء",
                url: "/dashboard/clients",
            },
            {
                title: "إضافة عميل",
                url: "/dashboard/clients/add",
            }
        ]
    },
    
    // Agency Management
    {
        title: "الوكالات",
        url: "/dashboard/agencies",
        icon: Building2,
        category: "إدارة الوكالات",
        items: [
            {
                title: "جميع الوكالات",
                url: "/dashboard/agencies",
            },
            {
                title: "إضافة وكالة",
                url: "/dashboard/agencies/add",
            }
        ]
    },
    
    // Services Management
    {
        title: "الخدمات",
        url: "/dashboard/services",
        icon: Briefcase,
        category: "إدارة المحتوى",
        items: [
            {
                title: "جميع الخدمات",
                url: "/dashboard/services",
            },
            {
                title: "إضافة خدمة",
                url: "/dashboard/services/add",
            }
        ]
    },
    
    // Packages Management
    {
        title: "الباقات",
        url: "/dashboard/packages",
        icon: Package,
        category: "إدارة المحتوى",
        items: [
            {
                title: "جميع الباقات",
                url: "/dashboard/packages",
            },
            {
                title: "إضافة باقة",
                url: "/dashboard/packages/add",
            }
        ]
    },
    
    // Hotels Management
    {
        title: "الفنادق",
        url: "/dashboard/hotels",
        icon: Hotel,
        category: "إدارة السفر",
        items: [
            {
                title: "جميع الفنادق",
                url: "/dashboard/hotels",
            },
            {
                title: "إضافة فندق",
                url: "/dashboard/hotels/add",
            }
        ]
    },
    
    // Flights Management
    {
        title: "الرحلات الجوية",
        url: "/dashboard/flights",
        icon: Plane,
        category: "إدارة السفر",
        items: [
            {
                title: "جميع الرحلات",
                url: "/dashboard/flights",
            },
            {
                title: "إضافة رحلة",
                url: "/dashboard/flights/add",
            }
        ]
    }
]

// Footer items for the sidebar
const footerItems = [
    {
        title: "الإعدادات",
        url: "/dashboard/settings",
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