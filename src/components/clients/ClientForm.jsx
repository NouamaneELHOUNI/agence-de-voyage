import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import useClientStore from "@/store/clientStore";

// Form validation schema
const clientSchema = z.object({
  clients_name: z.string().min(2, { message: "يجب أن يحتوي الاسم على حرفين على الأقل" }),
  clients_tel: z.string().min(8, { message: "يجب أن يحتوي رقم الهاتف على 8 أرقام على الأقل" }),
  clients_email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }).optional().or(z.literal("")),
  clients_adresse: z.string().optional(),
  clients_status: z.string().default("active"),
  clients_passport: z.string().optional(),
  clients_cin: z.string().optional(),
  clients_sex: z.string().default("ذكر"),
  clients_dob: z.date().optional().nullable(),
  clients_city: z.string().optional(),
  clients_country: z.string().optional(),
});

export default function ClientForm({ clientId, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createClient, updateClient, fetchClient, currentClient, loading } = useClientStore();
  
  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      clients_name: "",
      clients_tel: "",
      clients_email: "",
      clients_adresse: "",
      clients_status: "active",
      clients_passport: "",
      clients_cin: "",
      clients_sex: "ذكر", // Default value for gender
      clients_dob: null,
      clients_city: "",
      clients_country: "",
    },
  });

  useEffect(() => {
    const loadClient = async () => {
      if (clientId) {
        await fetchClient(clientId);
      }
    };
    
    loadClient();
  }, [clientId, fetchClient]);
  
  useEffect(() => {
    if (currentClient && clientId) {
      form.reset({
        clients_name: currentClient.clients_name || "",
        clients_tel: currentClient.clients_tel || "",
        clients_email: currentClient.clients_email || "",
        clients_adresse: currentClient.clients_adresse || "",
        clients_status: currentClient.clients_status || "active",
        clients_passport: currentClient.clients_passport || "",
        clients_cin: currentClient.clients_cin || "",
        clients_sex: currentClient.clients_sex || "ذكر",
        clients_dob: currentClient.clients_dob ? new Date(currentClient.clients_dob) : null,
        clients_city: currentClient.clients_city || "",
        clients_country: currentClient.clients_country || "",
      });
    }
  }, [currentClient, clientId, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (clientId) {
        await updateClient(clientId, data);
      } else {
        await createClient(data);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle>
          {clientId ? "تعديل معلومات العميل" : "إضافة عميل جديد"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name */}
              <FormField
                control={form.control}
                name="clients_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم العميل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="clients_tel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رقم الهاتف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="clients_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل البريد الإلكتروني" {...field} />
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
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة العميل" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="pending">معلق</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender/Sex */}
              <FormField
                control={form.control}
                name="clients_sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجنس</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ذكر">ذكر</SelectItem>
                        <SelectItem value="أنثى">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
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
                            variant="outline"
                            className={`w-full text-right font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ar })
                            ) : (
                              <span>اختر تاريخ</span>
                            )}
                            <CalendarIcon className="mr-auto h-4 w-4" />
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
                          locale={ar}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passport Number */}
              <FormField
                control={form.control}
                name="clients_passport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم جواز السفر</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رقم جواز السفر" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CIN Number (National ID) */}
              <FormField
                control={form.control}
                name="clients_cin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم البطاقة الوطنية</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل رقم البطاقة الوطنية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="clients_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المدينة</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل المدينة" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="clients_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البلد</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل البلد" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address - Full Width */}
            <FormField
              control={form.control}
              name="clients_adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل عنوان العميل" 
                      {...field} 
                      className="min-h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => onSuccess?.()}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : clientId ? (
                  "حفظ التغييرات"
                ) : (
                  "إضافة العميل"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 