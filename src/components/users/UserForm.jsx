import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2 } from "lucide-react";
import { USER_ROLES, ACCOUNT_STATUS } from "@/store/userStore";
import useAuthStore from "@/store/authStore";

// Form validation schema
const userSchema = z.object({
  username: z.string().min(3, { message: "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل" }),
  first_name: z.string().min(2, { message: "يجب أن يحتوي الاسم الأول على حرفين على الأقل" }),
  last_name: z.string().min(2, { message: "يجب أن يحتوي الاسم الأخير على حرفين على الأقل" }),
  userEmail: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  userTel: z.string().min(8, { message: "يجب أن يحتوي رقم الهاتف على 8 أرقام على الأقل" }).optional().or(z.literal("")),
  userRole: z.string().default(USER_ROLES.USER),
  accountStatus: z.string().default(ACCOUNT_STATUS.ACTIVE),
  password: z.string().min(6, { message: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل" }).optional(),
  email_status: z.string().default("verified"),
});

export default function UserForm({ userId, onSubmit, user, isLoading }) {
  const [submitting, setSubmitting] = useState(false);
  const { user: currentUser } = useAuthStore();
  const currentUserRole = currentUser?.role || "";
  
  // Set form validation schema and defaults
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      userEmail: "",
      userTel: "",
      userRole: USER_ROLES.USER,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      password: userId ? undefined : "", // Only required for new users
      email_status: "verified",
    },
  });

  // Fill form with user data if editing
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        userEmail: user.userEmail || "",
        userTel: user.userTel || "",
        userRole: user.userRole || USER_ROLES.USER,
        accountStatus: user.accountStatus || ACCOUNT_STATUS.ACTIVE,
        email_status: user.email_status || "verified",
      });
    }
  }, [user, form]);

  // Handle form submission
  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  // Check if the current user has permission to assign a role
  const canAssignRole = (role) => {
    if (currentUserRole === USER_ROLES.ADMIN) return true;
    if (currentUserRole === USER_ROLES.MANAGER && role !== USER_ROLES.ADMIN) return true;
    return role === USER_ROLES.USER || role === USER_ROLES.AGENT;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {userId ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأول *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الاسم الأول" {...field} />
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
                    <FormLabel>الاسم الأخير *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الاسم الأخير" {...field} />
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
                    <FormLabel>اسم المستخدم *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم المستخدم" {...field} />
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
                    <FormLabel>البريد الإلكتروني *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل البريد الإلكتروني" {...field} />
                    </FormControl>
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
                      <Input placeholder="أدخل رقم الهاتف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password (only for new users) */}
              {!userId && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="كلمة المرور" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* User Role */}
              <FormField
                control={form.control}
                name="userRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>دور المستخدم</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر دور المستخدم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {canAssignRole(USER_ROLES.ADMIN) && (
                          <SelectItem value={USER_ROLES.ADMIN}>مدير النظام</SelectItem>
                        )}
                        {canAssignRole(USER_ROLES.MANAGER) && (
                          <SelectItem value={USER_ROLES.MANAGER}>مدير</SelectItem>
                        )}
                        {canAssignRole(USER_ROLES.AGENT) && (
                          <SelectItem value={USER_ROLES.AGENT}>وكيل</SelectItem>
                        )}
                        <SelectItem value={USER_ROLES.USER}>مستخدم عادي</SelectItem>
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
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة الحساب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ACCOUNT_STATUS.ACTIVE}>نشط</SelectItem>
                        <SelectItem value={ACCOUNT_STATUS.INACTIVE}>غير نشط</SelectItem>
                        <SelectItem value={ACCOUNT_STATUS.SUSPENDED}>معلق</SelectItem>
                        <SelectItem value={ACCOUNT_STATUS.PENDING}>قيد المراجعة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Status */}
              <FormField
                control={form.control}
                name="email_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حالة البريد الإلكتروني</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة البريد الإلكتروني" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="verified">مؤكد</SelectItem>
                        <SelectItem value="unverified">غير مؤكد</SelectItem>
                        <SelectItem value="pending">قيد التأكيد</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="submit"
              disabled={submitting || isLoading}
            >
              {(submitting || isLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {userId ? "تحديث المستخدم" : "إضافة المستخدم"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 