"use client"

import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useClientStore from "@/store/clientStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    ArrowLeft,
    Edit,
    Trash2,
    UserRound,
    Mail,
    Phone,
    MapPin,
    FileText,
    Calendar,
    Clock,
    AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function ShowClientPage() {
    const navigate = useNavigate()
    const { id: clientId } = useParams()
    const { currentClient, loading, error, fetchClient, deleteClient } = useClientStore()
    const { toast } = useToast()

    // Fetch client data
    useEffect(() => {
        fetchClient(clientId)
    }, [clientId, fetchClient])

    // Handle delete
    const handleDelete = async () => {
        if (window.confirm("هل أنت متأكد من حذف هذا العميل؟")) {
            const result = await deleteClient(clientId)
            if (result.success) {
                toast({
                    title: "تم حذف العميل بنجاح",
                    variant: "success",
                })
                navigate("/dashboard/clients")
            } else {
                toast({
                    title: "فشل في حذف العميل",
                    description: result.error || "حدث خطأ أثناء محاولة حذف العميل",
                    variant: "destructive",
                })
            }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    }

    if (error) {
        return (
            <div className="container mx-auto py-6 rtl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-destructive/15 text-destructive p-6 rounded-md text-center"
                >
                    <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">خطأ</h3>
                    <p>{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/clients")}
                        className="mt-4"
                    >
                        العودة إلى قائمة العملاء
                    </Button>
                </motion.div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto py-6 space-y-6 rtl">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="p-0"
                    >
                        <ArrowLeft className="h-4 w-4 ml-2" />
                        رجوع
                    </Button>
                    <Skeleton className="h-8 w-40" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-6 w-52" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-5 w-full" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!currentClient) {
        return (
            <div className="container mx-auto py-6 rtl">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-12"
                >
                    <UserRound className="h-16 w-16 mx-auto text-muted-foreground/60 mb-4" />
                    <h3 className="text-xl font-medium mb-2">لم يتم العثور على العميل</h3>
                    <p className="text-muted-foreground mb-6">العميل المطلوب غير موجود أو تم حذفه</p>
                    <Button onClick={() => navigate("/dashboard/clients")}>
                        العودة إلى قائمة العملاء
                    </Button>
                </motion.div>
            </div>
        )
    }

    const clientInfo = [
        {
            label: "الاسم الكامل",
            value: currentClient.name,
            icon: <UserRound className="h-4 w-4 text-primary" />
        },
        {
            label: "البريد الإلكتروني",
            value: currentClient.email,
            icon: <Mail className="h-4 w-4 text-primary" />
        },
        {
            label: "رقم الهاتف",
            value: currentClient.phone,
            icon: <Phone className="h-4 w-4 text-primary" />
        },
        {
            label: "العنوان",
            value: currentClient.address,
            icon: <MapPin className="h-4 w-4 text-primary" />,
            optional: true
        }
    ];

    const additionalInfo = [
        {
            label: "ملاحظات",
            value: currentClient.notes,
            icon: <FileText className="h-4 w-4 text-primary" />,
            optional: true,
            isTextBlock: true
        },
        {
            label: "تاريخ الإنشاء",
            value: new Date(currentClient.createdAt).toLocaleString('ar-SA'),
            icon: <Calendar className="h-4 w-4 text-primary" />
        },
        {
            label: "آخر تحديث",
            value: new Date(currentClient.updatedAt).toLocaleString('ar-SA'),
            icon: <Clock className="h-4 w-4 text-primary" />
        },
    ];

    return (
        <div className="container mx-auto py-6 space-y-6 rtl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="p-0"
                    >
                        <ArrowLeft className="h-4 w-4 ml-2" />
                        رجوع
                    </Button>
                    <h1 className="text-2xl font-bold">تفاصيل العميل</h1>
                    <Badge variant="outline" className="mr-2 bg-primary/10">
                        #{clientId.slice(-6)}
                    </Badge>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/clients/edit/${clientId}`)}
                        className="flex items-center"
                    >
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="flex items-center"
                    >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                    custom={0}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Card className="border shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserRound className="h-5 w-5 ml-2 text-primary" />
                                المعلومات الشخصية
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {clientInfo.map((item, index) => (
                                (!item.optional || (item.optional && item.value)) && (
                                    <div key={index} className="space-y-1">
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                            {item.icon}
                                            <span className="mr-1">{item.label}</span>
                                        </h3>
                                        <p className="mt-1 text-base">
                                            {item.value || "غير متوفر"}
                                        </p>
                                    </div>
                                )
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Card className="border shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="h-5 w-5 ml-2 text-primary" />
                                معلومات إضافية
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {additionalInfo.map((item, index) => (
                                (!item.optional || (item.optional && item.value)) ? (
                                    <div key={index} className="space-y-1">
                                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                            {item.icon}
                                            <span className="mr-1">{item.label}</span>
                                        </h3>
                                        {item.isTextBlock ? (
                                            <div className="mt-1 whitespace-pre-wrap bg-muted/50 p-3 rounded-md text-base">
                                                {item.value}
                                            </div>
                                        ) : (
                                            <p className="mt-1 text-base">{item.value}</p>
                                        )}
                                    </div>
                                ) : (
                                    index === 0 && (
                                        <div key="no-notes" className="text-muted-foreground flex items-center p-3 bg-muted/30 rounded-md">
                                            <FileText className="h-4 w-4 ml-2 opacity-70" />
                                            <span>لا توجد ملاحظات متاحة</span>
                                        </div>
                                    )
                                )
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div
                custom={2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-center"
            >
                <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/clients")}
                >
                    <ArrowLeft className="h-4 w-4 ml-2" />
                    العودة إلى القائمة
                </Button>
            </motion.div>
        </div>
    )
} 