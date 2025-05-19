import * as React from "react"
import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { ChevronRight } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarMenuAction,
    SidebarFooter,
} from "@/components/ui/sidebar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/authStore"
import { Link } from "react-router-dom"

export function AppSidebar({ items, footerItems, ...props }) {
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const logout = useAuthStore(state => state.logout);

    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
        const category = item.category || "عام";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const handleLogout = async () => {
        await logout();
        setLogoutDialogOpen(false);
    };

    const handleItemClick = (item) => {
        if (item.url === "/logout") {
            setLogoutDialogOpen(true);
            return false; // Prevent navigation
        }
        return true; // Allow navigation for other items
    };

    return (
        <>
            <Sidebar
                variant="floating"
                side="right"      // RTL layout for Arabic
                className="px-2"
                dir="rtl"         // Set RTL direction for Arabic
                {...props}>
                <SidebarHeader className="px-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link to="/dashboard">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <GalleryVerticalEnd className="size-4" />
                                    </div>
                                    <div className="flex gap-0.5 leading-none justify-center items-center gap-2">
                                        <span className="font-semibold text-lg">وكالة السفر</span>
                                        <span className="">v1.0.0</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    {/* Render items grouped by category */}
                    {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                        <SidebarGroup key={category}>
                            <SidebarGroupLabel>{category}</SidebarGroupLabel>
                            <SidebarMenu>
                                {categoryItems.map((item) => (
                                    <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild tooltip={item.title}>
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {item.items?.length ? (
                                                <>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                            <ChevronRight />
                                                            <span className="sr-only">Toggle</span>
                                                        </SidebarMenuAction>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.items?.map((subItem) => (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton asChild>
                                                                        <Link to={subItem.url}>
                                                                            <span>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </>
                                            ) : null}
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                {/* Footer with settings and logout */}
                {footerItems && (
                    <SidebarFooter>
                        <SidebarMenu>
                            {footerItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild={item.url !== "/logout"}
                                        tooltip={item.title}
                                        onClick={item.url === "/logout" ? () => setLogoutDialogOpen(true) : undefined}
                                        className={item.url === "/logout" ? "bg-red-500  hover:bg-red-600 active:bg-red-600 text-white rounded-lg" : ""}
                                    >
                                        {item.url !== "/logout" ? (
                                            <Link to={item.url} className="w-full flex items-center justify-center gap-2 p-3 mb-2">
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        ) : (
                                        <p className="w-full flex items-center justify-center gap-2 text-white  p-3">
                                            {/* تسجيل الخروج */}
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span></p>

                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarFooter>
                )}
            </Sidebar>

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
    )
}