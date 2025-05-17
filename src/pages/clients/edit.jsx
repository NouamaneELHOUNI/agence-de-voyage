"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ClientForm from "@/components/clients/ClientForm"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import useClientStore from "@/store/clientStore"

export default function EditClientPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const { fetchClient, updateClient, currentClient, loading } = useClientStore()

    useEffect(() => {
        const loadClient = async () => {
            setIsLoading(true)
            try {
                const result = await fetchClient(id)
                if (!result.success) {
                    toast({
                        title: "خطأ في تحميل البيانات",
                        description: "لم يتم العثور على بيانات العميل",
                        variant: "destructive",
                    })
                    navigate("/clients")
                }
            } finally {
                setIsLoading(false)
            }
        }

        loadClient()
    }, [id, fetchClient, navigate, toast])

    // Set document title
    useEffect(() => {
        document.title = "تعديل بيانات العميل | وكالة السفر";
    }, []);

    const handleSubmit = async (data) => {
        try {
            const result = await updateClient(id, data)
            
            if (result.success) {
                toast({
                    title: "تم تحديث البيانات",
                    description: "تم تحديث بيانات العميل بنجاح",
                    variant: "success",
                })
                
                navigate("/clients")
            } else {
                toast({
                    title: "حدث خطأ",
                    description: result.error || "حدث خطأ أثناء تحديث بيانات العميل",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error updating client:", error)
            toast({
                title: "حدث خطأ",
                description: "حدث خطأ غير متوقع أثناء تحديث بيانات العميل",
                variant: "destructive",
            })
        }
    }

    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]" dir="rtl">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">جاري تحميل بيانات العميل...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container mx-auto py-6 space-y-6" dir="rtl">
                <PageHeader 
                    title={`تعديل بيانات العميل: ${currentClient?.clients_name || ""}`}
                    description="قم بتعديل معلومات العميل"
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
                
                <ClientForm 
                    clientId={id} 
                    onSuccess={() => navigate("/clients")} 
                />
            </div>
        </>
    )
} 