import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "./components/profileForm"
import { AccountForm } from "./components/accountForm"
import { NotificationsForm } from "./components/notificationsForm"
import { AppearanceForm } from "./components/appearanceForm"

export default function SettingsPage() {
    return (
        <div className="space-y-6 p-8" >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
                <p className="text-muted-foreground">قم بإدارة إعدادات حسابك وقم بتعيين تفضيلاتك.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4" dir="rtl">
                <TabsList>
                    <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
                    <TabsTrigger value="account">الحساب</TabsTrigger>
                    <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
                    <TabsTrigger value="appearance">المظهر</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>الملف الشخصي</CardTitle>
                            <CardDescription>قم بإدارة معلومات ملفك الشخصي العامة.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>الحساب</CardTitle>
                            <CardDescription>قم بتحديث إعدادات حسابك وتفضيلات الأمان.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AccountForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>الإشعارات</CardTitle>
                            <CardDescription>قم بتكوين كيفية تلقي الإشعارات.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NotificationsForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>المظهر</CardTitle>
                            <CardDescription>خصص مظهر ولوحة التحكم.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AppearanceForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
