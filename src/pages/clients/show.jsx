"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ClientDetails from "@/components/clients/ClientDetails"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Edit } from "lucide-react"
import useClientStore from "@/store/clientStore"

export default function ClientDetailsPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const { fetchClient, currentClient, loading } = useClientStore()

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

    // Set document title when client data is loaded
    useEffect(() => {
        if (currentClient) {
            document.title = `${currentClient.clients_name || "بيانات العميل"} | وكالة السفر`;
        }
    }, [currentClient]);

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
                    title={`بيانات العميل: ${currentClient?.clients_name || ""}`}
                    description={
                        currentClient?.is_deleted 
                            ? "هذا العميل محذوف ويمكن استعادته" 
                            : "عرض كافة بيانات ومعلومات العميل"
                    }
                    actions={
                        <div className="flex gap-2">
                            {!currentClient?.is_deleted && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => navigate(`/clients/edit/${id}`)}
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    تعديل البيانات
                                </Button>
                            )}
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/clients")}
                                className="gap-2"
                            >
                                <ArrowRight className="h-4 w-4" />
                                العودة إلى قائمة العملاء
                            </Button>
                        </div>
                    }
                />
                
                <ClientDetails 
                    clientId={id} 
                    onEdit={() => navigate(`/clients/edit/${id}`)}
                    onClose={() => navigate("/clients")}
                />
            </div>
        </>
    )
} 