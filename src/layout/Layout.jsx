import { AppSidebar } from "./components/sideBar"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { Header } from './components/header'

import { Outlet } from "react-router-dom"

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-full">
                    <Header />
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
