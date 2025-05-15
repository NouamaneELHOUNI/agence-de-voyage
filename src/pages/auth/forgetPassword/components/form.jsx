import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Fingerprint, Mail } from 'lucide-react'
import { Card } from "@/components/ui/card"

function ForgetPasswordForm() {
    return (
        <Card dir="rtl" className="flex flex-col items-start justify-center p-4">
            <div className='text-center w-full flex flex-col jutify-center items-center'>
                <Fingerprint className='w-12 h-12 border rounded-xl p-2' />
                <h2 className="text-4xl font-bold p-2">نسيت كلمة المرور؟</h2>
                <p className='p-2 text-gray-600'>
                    لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
                </p>
            </div>

            <div className='w-full max-w-md mx-auto'>
                <form onSubmit={() => { }} className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className='pr-4'>البريد الإلكتروني</Label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="email"
                                type="email"
                                className="pr-10"
                                placeholder="أدخل بريدك الإلكتروني"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                    // disabled={isLoading}
                    >
                        {/* {isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'} */}
                    </Button>

                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium hover:underline">
                            العودة إلى تسجيل الدخول
                        </Link>
                    </div>
                </form>
            </div>
        </Card>
    )
}

export default ForgetPasswordForm