import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowRight, ServerCrash, RefreshCw } from "lucide-react";

export default function ServerError500() {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl mx-auto" dir="rtl">
                {/* Animated 500 Number */}
                <div className="relative mb-8">
                    <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 animate-pulse">
                        500
                    </div>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-purple-100 dark:text-gray-800 -z-10 transform translate-x-1 translate-y-1">
                        500
                    </div>
                </div>

                {/* Main Card */}
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
                    <CardContent className="p-8 md:p-12">
                        {/* Server Icon with Animation */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <ServerCrash className="w-16 h-16 text-purple-500 animate-bounce" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            خطأ في الخادم
                        </h1>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                            نعتذر، حدث خطأ غير متوقع في النظام.
                            <br className="hidden md:block" />
                            فريقنا التقني يعمل على حل المشكلة، يرجى المحاولة مرة أخرى بعد قليل.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button 
                                onClick={handleRefresh}
                                size="lg" 
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300 ml-2" />
                                إعادة المحاولة
                            </Button>
                            
                            <Button asChild variant="outline" size="lg" className="border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                                <Link to="/dashboard" className="flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    العودة للرئيسية
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                                <strong>المشكلة مستمرة؟</strong>
                                <br />
                                إذا استمر ظهور هذا الخطأ، يرجى تسجيل بلاغ لدى الدعم التقني مع تفاصيل ما كنت تحاول القيام به.
                            </p>
                        </div>

                        {/* Error Code Info */}
                        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                            رمز الخطأ: 500 | وقت الحدوث: {new Date().toLocaleString('ar-SA')}
                        </div>
                    </CardContent>
                </Card>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-5 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>
        </div>
    );
}