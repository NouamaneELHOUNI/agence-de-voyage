import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowRight, ShieldX, AlertTriangle } from "lucide-react";

export default function Forbidden403() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl mx-auto" dir="rtl">
                {/* Animated 403 Number */}
                <div className="relative mb-8">
                    <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 animate-pulse">
                        403
                    </div>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-red-100 dark:text-gray-800 -z-10 transform translate-x-1 translate-y-1">
                        403
                    </div>
                </div>

                {/* Main Card */}
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
                    <CardContent className="p-8 md:p-12">
                        {/* Shield Icon with Animation */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <ShieldX className="w-16 h-16 text-red-500 animate-bounce" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            غير مصرح لك بالوصول
                        </h1>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                            نعتذر، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.
                            <br className="hidden md:block" />
                            يرجى التواصل مع المشرف للحصول على الصلاحيات المطلوبة.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button asChild size="lg" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <Link to="/dashboard" className="flex items-center gap-2">
                                    <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    العودة للرئيسية
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" size="lg" className="border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                                <Link to="/login" className="flex items-center gap-2">
                                    تسجيل الدخول
                                </Link>
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>تحتاج صلاحيات إضافية؟</strong>
                                <br />
                                تواصل مع مدير النظام لطلب الصلاحيات المطلوبة أو تحقق من بيانات تسجيل الدخول.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 dark:bg-red-800 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-5 w-16 h-16 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>
        </div>
    );
}