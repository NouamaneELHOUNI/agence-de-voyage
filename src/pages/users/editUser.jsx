import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import useUsersStore from "@/store/usersStore";
import { Skeleton } from "@/components/ui/skeleton";

// Define validation schema for user form (same as addUser but without requiring password)
const userFormSchema = z.object({
    first_name: z.string().min(2, {
        message: "يجب أن يحتوي الاسم الأول على حرفين على الأقل",
    }),
    last_name: z.string().min(2, {
        message: "يجب أن يحتوي الاسم الأخير على حرفين على الأقل",
    }),
    idNumber: z.string().optional(),
    username: z.string().min(3, {
        message: "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل",
    }),
    userEmail: z.string().email({
        message: "يرجى إدخال بريد إلكتروني صحيح",
    }),
    password: z.string().optional(), // Password is optional during edit
    userTel: z.string().min(8, {
        message: "يجب أن يحتوي رقم الهاتف على 8 أرقام على الأقل",
    }),
    userRole: z.enum(["مدير", "مشرف", "وكيل", "مستخدم"], {
        required_error: "يرجى اختيار صلاحية المستخدم",
    }),
    accountStatus: z.enum(["نشط", "غير نشط", "معلق", "قيد الانتظار"], {
        required_error: "يرجى اختيار حالة الحساب",
    }),
    city_agency: z.string().min(2, {
        message: "يرجى إدخال اسم الوكالة أو المدينة",
    }),
    avatar: z.string().optional(),
});

export default function EditUser() {
    const { id } = useParams();
    const { updateUser, fetchUser, currentUser, loading } = useUsersStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            idNumber: "",
            username: "",
            userEmail: "",
            password: "",
            userTel: "",
            userRole: "مستخدم",
            accountStatus: "نشط",
            city_agency: "",
            avatar: "",
        },
    });

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser(id);
        };
        loadUser();
    }, [id, fetchUser]);

    useEffect(() => {
        if (currentUser) {
            form.reset({
                first_name: currentUser.first_name || "",
                last_name: currentUser.last_name || "",
                idNumber: currentUser.idNumber || "",
                username: currentUser.username || "",
                userEmail: currentUser.userEmail || "",
                password: "", // Don't populate password field for security
                userTel: currentUser.userTel || "",
                userRole: currentUser.userRole || "مستخدم",
                accountStatus: currentUser.accountStatus || "نشط",
                city_agency: currentUser.city_agency || "",
                avatar: currentUser.avatar || "",
            });
        }
    }, [currentUser, form]);

    async function onSubmit(data) {
        setIsSubmitting(true);
        try {
            // If password is empty, remove it from the data to avoid overwriting with empty string
            const userData = { ...data };
            if (!userData.password) {
                delete userData.password;
            }

            const result = await updateUser(id, userData);

            if (result.success) {
                toast({
                    title: "تم التحديث بنجاح",
                    description: "تم تحديث بيانات المستخدم بنجاح",
                });
                navigate("/dashboard/users");
            } else {
                toast({
                    variant: "destructive",
                    title: "خطأ في التحديث",
                    description: result.error || "حدث خطأ أثناء تحديث بيانات المستخدم",
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
                variant: "destructive",
                title: "خطأ في التحديث",
                description: "حدث خطأ غير متوقع أثناء تحديث بيانات المستخدم",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-72" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Array(10)
                                    .fill(0)
                                    .map((_, index) => (
                                        <div key={index} className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ))}
                            </div>
                            <div className="flex justify-end">
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">تعديل بيانات المستخدم</h1>
                <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/users")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    العودة إلى قائمة المستخدمين
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>معلومات المستخدم</CardTitle>
                    <CardDescription>تعديل معلومات المستخدم الأساسية</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم الأول</FormLabel>
                                            <FormControl>
                                                <Input dir="rtl" placeholder="الاسم الأول" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Last Name */}
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم الأخير</FormLabel>
                                            <FormControl>
                                                <Input dir="rtl" placeholder="الاسم الأخير" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* ID Number */}
                                <FormField
                                    control={form.control}
                                    name="idNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رقم الهوية</FormLabel>
                                            <FormControl>
                                                <Input dir="ltr" placeholder="رقم الهوية" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اسم المستخدم</FormLabel>
                                            <FormControl>
                                                <Input dir="ltr" placeholder="اسم المستخدم" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="userEmail"
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

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كلمة المرور</FormLabel>
                                            <FormControl>
                                                <Input
                                                    dir="ltr"
                                                    type="password"
                                                    placeholder="تركه فارغاً للاحتفاظ بكلمة المرور الحالية"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                اتركه فارغاً للاحتفاظ بكلمة المرور الحالية
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone */}
                                <FormField
                                    control={form.control}
                                    name="userTel"
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

                                {/* User Role */}
                                <FormField
                                    control={form.control}
                                    name="userRole"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الصلاحية</FormLabel>
                                            <Select
                                                dir="rtl"
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر صلاحية المستخدم" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="مدير">مدير</SelectItem>
                                                    <SelectItem value="مشرف">مشرف</SelectItem>
                                                    <SelectItem value="وكيل">وكيل</SelectItem>
                                                    <SelectItem value="مستخدم">مستخدم</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Account Status */}
                                <FormField
                                    control={form.control}
                                    name="accountStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>حالة الحساب</FormLabel>
                                            <Select
                                                dir="rtl"
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر حالة الحساب" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="نشط">نشط</SelectItem>
                                                    <SelectItem value="غير نشط">غير نشط</SelectItem>
                                                    <SelectItem value="معلق">معلق</SelectItem>
                                                    <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* City/Agency */}
                                <FormField
                                    control={form.control}
                                    name="city_agency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الوكالة / المدينة</FormLabel>
                                            <FormControl>
                                                <Input
                                                    dir="rtl"
                                                    placeholder="اسم الوكالة أو المدينة"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Avatar URL */}
                                <FormField
                                    control={form.control}
                                    name="avatar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>رابط الصورة الرمزية</FormLabel>
                                            <FormControl>
                                                <Input
                                                    dir="ltr"
                                                    placeholder="https://example.com/avatar.jpg"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                رابط للصورة الرمزية للمستخدم (اختياري)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    تحديث البيانات
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
} 