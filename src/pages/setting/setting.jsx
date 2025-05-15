import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { AccountForm } from "@/components/settings/account-form"
// import { NotificationsForm } from "@/components/settings/notifications-form"
// import { AppearanceForm } from "@/components/settings/appearance-form"
// import { ProfileForm } from "@/components/settings/profile-form"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and set your preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Manage your public profile information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <ProfileForm /> */}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>Update your account settings and security preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <AccountForm /> */}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Configure how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <NotificationsForm /> */}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize how the dashboard looks and feels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <AppearanceForm /> */}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
