import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export function LoginForm() {
    return (
        <div className={cn("flex flex-col gap-6")} dir="rtl">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold mb-2">مرحبًا بعودتك</h1>
                                <p className="text-balance text-muted-foreground">
                                    قم بتسجيل الدخول إلى حسابك
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">كلمة المرور</Label>

                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                تسجيل الدخول
                            </Button>
                            <div className="text-center text-sm">
                                <Link
                                    to="/forget-password"
                                    className="ml-auto text-sm underline-offset-2 hover:underline"
                                >
                                    هل نسيت كلمة المرور؟
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <p className="flex justify-center items-center h-full text-7xl font-bold animate-pulse">قريباً</p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                بالاستمرار، أنت توافق على <Link to="#">شروط الخدمة</Link> و <Link to="#">سياسة الخصوصية</Link>.
            </div>
        </div>
    )
}
