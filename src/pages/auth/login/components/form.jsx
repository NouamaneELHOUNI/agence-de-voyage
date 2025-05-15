import { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import useAuthStore from "@/store/authStore"

export function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])\.[a-zA-Z]{2,}$/;

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: false,
            password: false,
        };
        let errorMessage = "";

        if (!formData.email.trim() || !formData.password.trim()) {
            if (!formData.email.trim() && !formData.password.trim()) {
                errorMessage = "يرجى ملء جميع الحقول";
            } else if (!formData.email.trim()) {
                errorMessage = "يرجى إدخال البريد الإلكتروني";
            } else {
                errorMessage = "يرجى إدخال كلمة المرور";
            }
            newErrors.email = !formData.email.trim();
            newErrors.password = !formData.password.trim();
            isValid = false;
        } else if (!emailRegex.test(formData.email.trim())) {
            errorMessage = "يرجى إدخال بريد إلكتروني صحيح";
            newErrors.email = true;
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const success = await login(formData.email, formData.password, rememberMe);
            if (success) {
                navigate("/dashboard");
            }
        } catch (error) {
            // No toast
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: false,
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            <div className={cn("flex flex-col gap-6")} dir="rtl">
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold mb-2">مرحبًا بعودتك</h1>
                                    <p className="text-balance text-muted-foreground">
                                        قم بتسجيل الدخول إلى حسابك
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">البريد الإلكتروني</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`pr-10 ${errors.email ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500" : ""}`}
                                            placeholder="أدخل بريدك الإلكتروني"
                                            autoComplete="username"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">كلمة المرور</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`pr-10 ${errors.password ? "border-red-500 focus:border-red-500 focus-visible:ring-red-500" : ""}`}
                                            placeholder="أدخل كلمة المرور"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 space-x-reverse gap-2">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={setRememberMe}
                                            disabled={isLoading}
                                        />
                                        <Label htmlFor="remember" className="leading-none">
                                            تذكرني
                                        </Label>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                                </Button>
                                <Link
                                    to="/forget-password"
                                    className="font-medium hover:underline text-sm text-center text-muted-foreground"
                                >
                                    هل نسيت كلمة المرور؟
                                </Link>
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
        </>
    )
}
