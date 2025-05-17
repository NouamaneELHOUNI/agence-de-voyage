"use client"

import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import useClientStore from "@/store/clientStore"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, UserRound, Phone, Mail, MapPin, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const clientFormSchema = z.object({
    name: z.string().min(2, {
        message: "يجب أن يحتوي الاسم على حرفين على الأقل.",
    }),
    email: z.string().email({
        message: "يرجى إدخال عنوان بريد إلكتروني صالح.",
    }),
    phone: z.string().min(10, {
        message: "يجب أن يحتوي رقم الهاتف على 10 أرقام على الأقل.",
    }),
    address: z.string().optional(),
    notes: z.string().max(500, {
        message: "يجب ألا تزيد الملاحظات عن 500 حرف.",
    }).optional(),
})

export default function AddClientPage() {
    const navigate = useNavigate()
    const { createClient, loading } = useClientStore()
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            notes: "",
        },
    })

    async function onSubmit(data) {
        const result = await createClient(data)
        if (result.success) {
            toast({
                title: "تم إنشاء العميل بنجاح",
                description: "تمت إضافة العميل الجديد إلى قائمتك",
                variant: "success",
            })
            navigate("/clients")
        } else {
            toast({
                title: "فشل في إنشاء العميل",
                description: result.error || "حدث خطأ أثناء محاولة إنشاء العميل",
                variant: "destructive",
            })
        }
    }

    const formFields = [
        {
            name: "name",
            label: "الاسم الكامل",
            placeholder: "أدخل الاسم الكامل للعميل",
            icon: <UserRound className="h-4 w-4" />
        },
        {
            name: "email",
            label: "البريد الإلكتروني",
            placeholder: "أدخل البريد الإلكتروني للعميل",
            icon: <Mail className="h-4 w-4" />
        },
        {
            name: "phone",
            label: "رقم الهاتف",
            placeholder: "أدخل رقم هاتف العميل",
            icon: <Phone className="h-4 w-4" />
        },
        {
            name: "address",
            label: "العنوان",
            placeholder: "أدخل عنوان العميل",
            isTextArea: true,
            icon: <MapPin className="h-4 w-4" />
        },
        {
            name: "notes",
            label: "ملاحظات",
            placeholder: "إضافة أي ملاحظات إضافية حول العميل",
            description: "ملاحظات اختيارية حول العميل. الحد الأقصى 500 حرف.",
            isTextArea: true,
            icon: <FileText className="h-4 w-4" />
        },
    ]

    const formVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="container mx-auto py-6 space-y-6 rtl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-4 rtl:space-x-reverse"
            >
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="p-0"
                >
                    <ArrowLeft className="h-4 w-4 ml-2" />
                    رجوع
                </Button>
                <h1 className="text-2xl font-bold">إضافة عميل جديد</h1>
            </motion.div>

            <Card className="border shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center">
                        <UserRound className="ml-2 h-5 w-5 text-primary" />
                        معلومات العميل
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <motion.div
                                className="space-y-6"
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {formFields.map((field) => (
                                    <motion.div key={field.name} variants={fieldVariants}>
                                        <FormField
                                            control={form.control}
                                            name={field.name}
                                            render={({ field: formField }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center">
                                                        {field.icon}
                                                        <span className="mr-1">{field.label}</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        {field.isTextArea ? (
                                                            <Textarea
                                                                placeholder={field.placeholder}
                                                                className="resize-none"
                                                                {...formField}
                                                            />
                                                        ) : (
                                                            <Input
                                                                placeholder={field.placeholder}
                                                                {...formField}
                                                            />
                                                        )}
                                                    </FormControl>
                                                    {field.description && (
                                                        <FormDescription>
                                                            {field.description}
                                                        </FormDescription>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                ))}

                                <motion.div
                                    variants={fieldVariants}
                                    className="flex justify-end space-x-4 rtl:space-x-reverse pt-4"
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate(-1)}
                                    >
                                        إلغاء
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                    >
                                        <Save className="ml-2 h-4 w-4" />
                                        {loading ? "جاري الإنشاء..." : "إنشاء عميل"}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
} 