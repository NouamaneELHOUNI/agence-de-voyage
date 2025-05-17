"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ClientForm from "@/components/clients/ClientForm"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import useClientStore from "@/store/clientStore"

export default function AddClientPage() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { createClient, fetchClients } = useClientStore()

    // Set document title
    useEffect(() => {
        document.title = "إضافة عميل جديد | وكالة السفر";
    }, []);

    const handleSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const result = await createClient(data)
            
            if (result.success) {
                toast({
                    title: "تم إضافة العميل",
                    description: "تمت إضافة العميل بنجاح",
                    variant: "success",
                })
                
                // Ensure clients are refreshed before navigation
                await fetchClients(20, true)
                
                // Delay navigation slightly to ensure state updates
                setTimeout(() => {
                    navigate("/clients")
                }, 300)
            } else {
                toast({
                    title: "حدث خطأ",
                    description: result.error || "حدث خطأ أثناء إضافة العميل",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error creating client:", error)
            toast({
                title: "حدث خطأ",
                description: "حدث خطأ غير متوقع أثناء إضافة العميل",
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
                    title="إضافة عميل جديد"
                    description="قم بإضافة معلومات العميل الجديد"
                    actions={
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/clients")}
                            className="gap-2"
                        >
                            <ArrowRight className="h-4 w-4" />
                            العودة إلى قائمة العملاء
                        </Button>
                    }
                />
                
                <ClientForm onSuccess={() => navigate("/clients")} />
            </div>
        </>
    )
} 