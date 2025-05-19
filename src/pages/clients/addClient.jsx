import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import useClientStore from "@/store/clientStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define validation schema for client form
const clientFormSchema = z.object({
    clients_name: z.string().min(3, {
        message: "يجب أن يحتوي اسم العميل على 3 أحرف على الأقل",
    }),
    clients_tel: z.string().min(8, {
        message: "يجب أن يحتوي رقم الهاتف على 8 أرقام على الأقل",
    }),
    clients_email: z.string().email({
        message: "يرجى إدخال بريد إلكتروني صحيح",
    }),
    clients_adresse: z.string().optional(),
    clients_status: z.enum(["نشط", "غير نشط", "قيد الانتظار"], {
        required_error: "يرجى اختيار حالة العميل",
    }),
    clients_passport: z.string().optional(),
    clients_cin: z.string().optional(),
    clients_sex: z.enum(["ذكر", "أنثى"], {
        required_error: "يرجى اختيار الجنس",
    }),
    clients_dob: z.date({
        required_error: "يرجى اختيار تاريخ الميلاد",
    }),
    clients_city: z.string().min(2, {
        message: "يرجى إدخال المدينة",
    }),
    clients_country: z.string().min(2, {
        message: "يرجى إدخال البلد",
    }),
});

export default function AddClient() {
    const { createClient } = useClientStore();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            clients_name: "",
            clients_tel: "",
            clients_email: "",
            clients_adresse: "",
            clients_status: "نشط",
            clients_passport: "",
            clients_cin: "",
            clients_sex: "ذكر",
            clients_city: "",
            clients_country: "",
        },
    });

    async function onSubmit(data) {
        setIsLoading(true);
        try {
            const result = await createClient(data);

            if (result.success) {
                toast({
                    title: "تمت الإضافة بنجاح",
                    description: "تمت إضافة العميل بنجاح",
                });
                navigate("/dashboard/clients");
            } else {
                toast({
                    variant: "destructive",
                    title: "خطأ في الإضافة",
                    description: result.error || "حدث خطأ أثناء إضافة العميل",
                });
            }
        } catch (error) {
            console.error("Error adding client:", error);
            toast({
                variant: "destructive",
                title: "خطأ في الإضافة",
                description: "حدث خطأ غير متوقع أثناء إضافة العميل",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">إضافة عميل جديد</h1>
                <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/clients")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    العودة إلى قائمة العملاء
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>معلومات العميل</CardTitle>
                    <CardDescription>أدخل معلومات العميل الأساسية</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Client Name */}
                                <FormField
                                    control={form.control}
                                    name="clients_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم الكامل</FormLabel>
                                            <FormControl>
                                                <Input dir="rtl" placeholder="أدخل اسم العميل" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client Email */}
                                <FormField
                                    control={form.control}
                                    name="clients_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>البريد الإلكتروني</FormLabel>
                                            <FormControl>
                                                <Input dir="ltr" placeholder="example@domain.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client Phone */}
                                <FormField
                                    control={form.control}
                                    name="clients_tel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رقم الهاتف</FormLabel>
                                            <FormControl>
                                                <Input
                                                    dir="ltr"
                                                    placeholder="+212 6XX XXXXXX"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client Status */}
                                <FormField
                                    control={form.control}
                                    name="clients_status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الحالة</FormLabel>
                                            <Select
                                                dir="rtl"
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر حالة العميل" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="نشط">نشط</SelectItem>
                                                    <SelectItem value="غير نشط">غير نشط</SelectItem>
                                                    <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client Sex */}
                                <FormField
                                    control={form.control}
                                    name="clients_sex"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>الجنس</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    dir="rtl"
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row space-x-4 space-x-reverse"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-x-reverse">
                                                        <FormControl>
                                                            <RadioGroupItem value="ذكر" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            ذكر
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-x-reverse">
                                                        <FormControl>
                                                            <RadioGroupItem value="أنثى" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            أنثى
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date of Birth */}
                                <FormField
                                    control={form.control}
                                    name="clients_dob"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>تاريخ الميلاد</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"
                                                                }`}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "yyyy-MM-dd")
                                                            ) : (
                                                                <span>اختر تاريخ الميلاد</span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client City */}
                                <FormField
                                    control={form.control}
                                    name="clients_city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المدينة</FormLabel>
                                            <FormControl>
                                                <Input dir="rtl" placeholder="المدينة" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client Country */}
                                <FormField
                                    control={form.control}
                                    name="clients_country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>البلد</FormLabel>
                                            <FormControl>
                                                <Input dir="rtl" placeholder="البلد" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client Passport */}
                                <FormField
                                    control={form.control}
                                    name="clients_passport"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رقم جواز السفر</FormLabel>
                                            <FormControl>
                                                <Input dir="ltr" placeholder="رقم جواز السفر" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Client CIN (National ID) */}
                                <FormField
                                    control={form.control}
                                    name="clients_cin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رقم البطاقة الوطنية</FormLabel>
                                            <FormControl>
                                                <Input
                                                    dir="ltr"
                                                    placeholder="رقم البطاقة الوطنية"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Client Address */}
                            <FormField
                                control={form.control}
                                name="clients_adresse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>العنوان</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                dir="rtl"
                                                placeholder="أدخل عنوان العميل الكامل"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    إضافة العميل
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
} 