"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UserForm from "@/components/users/UserForm"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import useUserStore from "@/store/userStore"

export default function AddUserPage() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { createUser, fetchUsers } = useUserStore()

    // Set document title
    useEffect(() => {
        document.title = "إضافة مستخدم جديد | وكالة السفر";
    }, []);

    const handleSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const result = await createUser(data)
            
            if (result.success) {
                toast({
                    title: "تم إضافة المستخدم",
                    description: "تمت إضافة المستخدم بنجاح",
                    variant: "success",
                })
                
                // Ensure users are refreshed before navigation
                await fetchUsers(20, true)
                
                // Delay navigation slightly to ensure state updates
                setTimeout(() => {
                    navigate("/users")
                }, 300)
            } else {
                toast({
                    title: "حدث خطأ",
                    description: result.error || "حدث خطأ أثناء إضافة المستخدم",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error creating user:", error)
            toast({
                title: "حدث خطأ",
                description: "حدث خطأ غير متوقع أثناء إضافة المستخدم",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="container mx-auto py-6 space-y-6" dir="rtl">
                <PageHeader 
                    title="إضافة مستخدم جديد"
                    description="قم بإضافة معلومات المستخدم الجديد"
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
                
                <UserForm onSubmit={handleSubmit} isLoading={isSubmitting} />
            </div>
        </>
    )
} 