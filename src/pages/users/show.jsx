"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserDetails from "@/components/users/UserDetails"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Edit } from "lucide-react"
import useUserStore from "@/store/userStore"
import useAuthStore from "@/store/authStore"
import { USER_ROLES } from "@/store/userStore"

export default function UserDetailsPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const { fetchUser, currentUser, loading } = useUserStore()
    const { user: authUser } = useAuthStore()
    const currentUserRole = authUser?.role || ""

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true)
            try {
                const result = await fetchUser(id)
                if (!result.success) {
                    toast({
                        title: "خطأ في تحميل البيانات",
                        description: "لم يتم العثور على بيانات المستخدم",
                        variant: "destructive",
                    })
                    navigate("/users")
                }
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [id, fetchUser, navigate, toast])

    // Set document title when user data is loaded
    useEffect(() => {
        if (currentUser) {
            document.title = `${currentUser.first_name} ${currentUser.last_name} | وكالة السفر`;
        }
    }, [currentUser]);

    // Check if current user can edit this user
    const canEditUser = () => {
        if (!currentUser || !authUser) return false;
        
        // Admins can edit anyone
        if (currentUserRole === USER_ROLES.ADMIN) return true;
        
        // Managers can edit agents and regular users, but not admins or other managers
        if (currentUserRole === USER_ROLES.MANAGER) {
            return ![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(currentUser.userRole);
        }
        
        // All others can't edit users
        return false;
    };

    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]" dir="rtl">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">جاري تحميل بيانات المستخدم...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container mx-auto py-6 space-y-6" dir="rtl">
                <PageHeader 
                    title={`بيانات المستخدم: ${currentUser?.first_name} ${currentUser?.last_name || ""}`}
                    description={
                        currentUser?.is_deleted_u 
                            ? "هذا المستخدم محذوف ويمكن استعادته" 
                            : "عرض كافة بيانات ومعلومات المستخدم"
                    }
                    actions={
                        <div className="flex gap-2">
                            {canEditUser() && !currentUser?.is_deleted_u && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => navigate(`/users/edit/${id}`)}
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    تعديل البيانات
                                </Button>
                            )}
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/users")}
                                className="gap-2"
                            >
                                <ArrowRight className="h-4 w-4" />
                                العودة إلى قائمة المستخدمين
                            </Button>
                        </div>
                    }
                />
                
                <UserDetails 
                    user={currentUser} 
                    onEdit={() => navigate(`/users/edit/${id}`)}
                    isLoading={isLoading}
                />
            </div>
        </>
    )
} 