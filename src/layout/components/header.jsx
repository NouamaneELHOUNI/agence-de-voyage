import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import ThemeSwitcher from "./themeSwitcher"
import UserDropDown from "./userDropDown"
import { useLocation, Link } from "react-router-dom"
import { useMemo } from "react"
import { ChevronLeft } from "lucide-react"

// Map for English path segments to Arabic translations
const pathToArabicMap = {
    'dashboard': 'لوحة التحكم',
    'settings': 'الإعدادات',
    'profile': 'الملف الشخصي',
    'users': 'المستخدمين',
    'clients': 'العملاء',
    'hotels': 'الفنادق',
    'flights': 'الرحلات الجوية',
    'packages': 'الباقات',
    'services': 'الخدمات',
    'agencies': 'الوكالات',

    'add': 'إضافة',
    'edit': 'تعديل',
    'show': 'عرض',
    'view': 'عرض',
};

// Map for determining which paths should be navigatable
const navigatablePaths = {
    '/dashboard': true,
    '/dashboard/clients': true,
    '/dashboard/flights': true,
    '/dashboard/hotels': true,
    '/dashboard/packages': true,
    '/dashboard/services': true,
    '/dashboard/agencies': true,
    '/dashboard/settings': true,
};

export function Header() {
    const location = useLocation();

    const breadcrumbs = useMemo(() => {
        let pathnames = location.pathname.split('/').filter(x => x);

        // If we're at the root dashboard, return just dashboard
        if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
            return [{ path: '/dashboard', label: 'لوحة التحكم', isLast: true, isNavigatable: false }];
        }

        // Remove dashboard from pathnames to avoid duplication
        if (pathnames[0] === 'dashboard') {
            pathnames = pathnames.slice(1); // Fixed: Remove the first element (dashboard)
        }

        const result = [
            { path: '/dashboard', label: 'لوحة التحكم', isLast: false, isNavigatable: true }
        ];

        let currentPath = '/dashboard';

        pathnames.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === pathnames.length - 1;
            
            // Check if this path should be navigatable
            const isNavigatable = navigatablePaths[currentPath] || false;

            // Translate path segment to Arabic
            let label = pathToArabicMap[segment.toLowerCase()] || segment;

            // If no translation exists and it's not an ID, create a readable label
            if (label === segment) {
                // Check if it looks like an ID (contains numbers and letters mixed)
                const isId = /^[a-zA-Z0-9_-]+$/.test(segment) && segment.length > 10;
                
                if (isId) {
                    // For IDs, we'll show them as is or you can customize this
                    label = segment;
                } else {
                    // Replace hyphens with spaces
                    label = segment.replace(/-/g, ' ');
                    // Capitalize first letter
                    label = label.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1));
                }
            }

            result.push({ 
                path: currentPath, 
                label, 
                isLast, 
                isNavigatable: isNavigatable && !isLast // Last item is never navigatable
            });
        });

        return result;
    }, [location.pathname]);

    return (
        <header className="flex justify-between h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-12 bg-red-700" />

                <Breadcrumb dir="rtl">
                    <BreadcrumbList>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <BreadcrumbItem key={breadcrumb.path} className={index === 0 ? "hidden md:block" : ""}>
                                {index > 0 && (
                                    <BreadcrumbSeparator className="hidden md:block">
                                        <ChevronLeft className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                )}
                                {breadcrumb.isLast ? (
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                ) : breadcrumb.isNavigatable ? (
                                    <BreadcrumbLink as={Link} to={breadcrumb.path}>
                                        {breadcrumb.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="ml-2 flex items-center gap-2">
                <ThemeSwitcher />
                <UserDropDown />
            </div>
        </header>
    )
}