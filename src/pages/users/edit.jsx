"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserForm from "@/components/users/UserForm"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import useUserStore from "@/store/userStore"

export default function EditUserPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const { fetchUser, updateUser, currentUser, loading } = useUserStore()

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

    // Set document title
    useEffect(() => {
        document.title = "تعديل بيانات المستخدم | وكالة السفر";
    }, []);

    const handleSubmit = async (data) => {
        setIsLoading(true)
        try {
            const result = await updateUser(id, data)
            
            if (result.success) {
                toast({
                    title: "تم تحديث البيانات",
                    description: "تم تحديث بيانات المستخدم بنجاح",
                    variant: "success",
                })
                
                navigate("/users")
            } else {
                toast({
                    title: "حدث خطأ",
                    description: result.error || "حدث خطأ أثناء تحديث بيانات المستخدم",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error updating user:", error)
            toast({
                title: "حدث خطأ",
                description: "حدث خطأ غير متوقع أثناء تحديث بيانات المستخدم",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

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
                    title={`تعديل بيانات المستخدم: ${currentUser?.first_name} ${currentUser?.last_name || ""}`}
                    description="قم بتعديل معلومات المستخدم"
                    actions={
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/users")}
                            className="gap-2"
                        >
                            <ArrowRight className="h-4 w-4" />
                            العودة إلى قائمة المستخدمين
                        </Button>
                    }
                />
                
                <UserForm 
                    userId={id} 
                    user={currentUser}
                    onSubmit={handleSubmit} 
                    isLoading={isLoading}
                />
            </div>
        </>
    )
} 