"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Check, Moon, Sun } from "lucide-react"
import { useFont } from '@/hooks/useFont';


const appearanceFormSchema = z.object({
    theme: z.enum(["light", "dark", "system"], {
        required_error: "يرجى اختيار السمة.",
    }),
    fontSize: z.number().min(12).max(20),
    language: z.string({
        required_error: "يرجى اختيار اللغة.",
    }),
    animations: z.boolean().default(true),
    rtl: z.boolean().default(true),
})

const defaultValues = {
    theme: "system",
}



export function AppearanceForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { font, setFont, applyFont } = useFont();

    const [selectedFont, setSelectedFont] = useState(font);

    const handleFontChange = (newFont) => {
        setSelectedFont(newFont);
        setFont(newFont);
        applyFont(newFont);
    };
    const form = useForm({
        resolver: zodResolver(appearanceFormSchema),
        defaultValues,
    })

    function onSubmit(data) {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "تم تحديث إعدادات المظهر",
                description: "تم تحديث إعدادات المظهر الخاصة بك بنجاح.",
            })
            console.log(data)
        }, 1000)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" dir="rtl">
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>السمة</FormLabel>
                            <FormDescription>اختر سمة لوحة التحكم.</FormDescription>
                            <FormMessage />
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid max-w-md grid-cols-3 gap-4 pt-2"
                            >
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="light" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center py-1">
                                                <Sun className="h-4 w-4" />
                                                <span className="mr-1 text-xs">فاتح</span>
                                            </div>
                                        </div>
                                    </FormLabel>
                                </FormItem>
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="dark" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center py-1">
                                                <Moon className="h-4 w-4" />
                                                <span className="mr-1 text-xs">داكن</span>
                                            </div>
                                        </div>
                                    </FormLabel>
                                </FormItem>
                                <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="system" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center py-1">
                                                <Check className="h-4 w-4" />
                                                <span className="mr-1 text-xs">النظام</span>
                                            </div>
                                        </div>
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormItem>
                    )}
                />

                <Separator />
                <div className="space-y-5">
                    <Label className='text-lg font-medium'>الخط</Label>
                    <Select onValueChange={handleFontChange} defaultValue={selectedFont} dir='rtl'>
                        <SelectTrigger id="font" className="w-[180px] text-right [&>svg]:left-4 [&>svg]:right-auto">
                            <SelectValue placeholder="اختر الخط" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="system">النظام</SelectItem>
                            <SelectItem value="cairo">القاهرة</SelectItem>
                            <SelectItem value="tajawal">تجوال</SelectItem>
                            <SelectItem value="noto-kufi">نوتو كوفي</SelectItem>
                            <SelectItem value="ibm-arabic">IBM بلكس</SelectItem>
                            <SelectItem value="almarai">المراعي</SelectItem>
                            <SelectItem value="readex">ريدكس برو</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        اختر الخط الذي تريد استخدامه في لوحة التحكم.
                    </p>
                    <div className="mt-4 p-4 border rounded-lg">
                        <p className="text-lg mb-2 font-bold">معاينة الخط: {selectedFont}</p>
                        <p className="text-base">هذا النص يعرض لك كيف سيظهر الخط المختار في واجهة المستخدم.</p>
                        <p className="text-base">أهلا وسهلا بكم في لوحة تحكم وكالة السفر.</p>
                        <p className="text-base">1234567890</p>
                    </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "جاري الحفظ..." : "حفظ التفضيلات"}
                </Button>
            </form>
        </Form>
    )
}
