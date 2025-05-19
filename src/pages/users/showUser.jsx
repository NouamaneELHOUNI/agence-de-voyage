import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Clock,
    Edit,
    Globe,
    Mail,
    MapPin,
    Phone,
    Trash2,
    User,
    UserCircle,
    FileText,
    UserCog,
} from "lucide-react";
import useUsersStore from "@/store/usersStore";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function ShowUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { currentUser, loading, error, fetchUser, deleteUser } = useUsersStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchUser(id);
    }, [id, fetchUser]);

    const handleDelete = async () => {
        const result = await deleteUser(id);
        if (result.success) {
            toast({
                title: "تم الحذف بنجاح",
                description: "تم حذف المستخدم بنجاح",
            });
            navigate("/dashboard/users");
        } else {
            toast({
                variant: "destructive",
                title: "خطأ في الحذف",
                description: result.error || "حدث خطأ أثناء حذف المستخدم",
            });
        }
        setIsDeleteDialogOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return format(date, "yyyy-MM-dd");
        } catch (error) {
            return dateString;
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
            case "نشط":
                return <Badge className="bg-green-500">نشط</Badge>;
            case "inactive":
            case "غير نشط":
                return <Badge variant="outline">غير نشط</Badge>;
            case "suspended":
            case "معلق":
                return <Badge variant="destructive">معلق</Badge>;
            case "pending":
            case "قيد الانتظار":
                return <Badge variant="secondary">قيد الانتظار</Badge>;
            default:
                return <Badge variant="outline">{status || "غير محدد"}</Badge>;
        }
    };

    const getRoleBadge = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
            case "مدير":
                return <Badge className="bg-blue-500">مدير</Badge>;
            case "manager":
            case "مشرف":
                return <Badge className="bg-purple-500">مشرف</Badge>;
            case "agent":
            case "وكيل":
                return <Badge className="bg-orange-500">وكيل</Badge>;
            case "user":
            case "مستخدم":
                return <Badge>مستخدم</Badge>;
            default:
                return <Badge variant="outline">{role || "غير محدد"}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-9 w-48" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40 mb-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <div key={index} className="flex items-center">
                                        <Skeleton className="h-5 w-5 mr-2" />
                                        <Skeleton className="h-5 w-64" />
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40 mb-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <div key={index} className="flex items-center">
                                        <Skeleton className="h-5 w-5 mr-2" />
                                        <Skeleton className="h-5 w-64" />
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">تفاصيل المستخدم</h1>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/users")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة إلى قائمة المستخدمين
                    </Button>
                </div>
                <Card className="bg-destructive/10 text-destructive">
                    <CardContent className="pt-6">
                        <p>{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">تفاصيل المستخدم</h1>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/users")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة إلى قائمة المستخدمين
                    </Button>
                </div>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">لم يتم العثور على المستخدم</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">تفاصيل المستخدم</h1>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/users")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة إلى قائمة المستخدمين
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to={`/dashboard/users/edit/${id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل المستخدم
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف المستخدم
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Avatar Card */}
                {currentUser.avatar && (
                    <Card className="md:col-span-2 flex justify-center py-6">
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/20">
                                <img
                                    src={currentUser.avatar}
                                    alt={`${currentUser.first_name} ${currentUser.last_name}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/128?text=User";
                                    }}
                                />
                            </div>
                            <h2 className="text-2xl font-bold">{`${currentUser.first_name} ${currentUser.last_name}`}</h2>
                            <div className="mt-2 flex justify-center space-x-2">
                                {getRoleBadge(currentUser.userRole)}
                                {getStatusBadge(currentUser.accountStatus)}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>المعلومات الأساسية</CardTitle>
                        <CardDescription>التفاصيل الشخصية للمستخدم</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <UserCircle className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">الاسم الكامل:</span>
                            <span>{`${currentUser.first_name} ${currentUser.last_name}` || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">اسم المستخدم:</span>
                            <span>{currentUser.username || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">البريد الإلكتروني:</span>
                            <span dir="ltr">{currentUser.userEmail || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">رقم الهاتف:</span>
                            <span dir="ltr">{currentUser.userTel || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">رقم الهوية:</span>
                            <span dir="ltr">{currentUser.idNumber || "-"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>معلومات الحساب</CardTitle>
                        <CardDescription>معلومات الصلاحية والحالة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <UserCog className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">الصلاحية:</span>
                            <span className="mr-2">{getRoleBadge(currentUser.userRole)}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">الحالة:</span>
                            <span className="mr-2">{getStatusBadge(currentUser.accountStatus)}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">الوكالة / المدينة:</span>
                            <span>{currentUser.city_agency || "-"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Creation Information */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>معلومات الإنشاء والتحديث</CardTitle>
                        <CardDescription>تواريخ إنشاء وتحديث بيانات المستخدم</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-primary" />
                                <span className="font-semibold ml-2">تاريخ الإنشاء:</span>
                                <span dir="ltr">
                                    {currentUser.createdAt
                                        ? formatDate(currentUser.createdAt)
                                        : "-"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-primary" />
                                <span className="font-semibold ml-2">تاريخ التحديث:</span>
                                <span dir="ltr">
                                    {currentUser.updatedAt
                                        ? formatDate(currentUser.updatedAt)
                                        : "-"}
                                </span>
                            </div>
                            {currentUser.created_by && (
                                <div className="flex items-center">
                                    <User className="h-5 w-5 mr-2 text-primary" />
                                    <span className="font-semibold ml-2">تم الإنشاء بواسطة:</span>
                                    <span>
                                        {currentUser.created_by.displayName ||
                                            currentUser.created_by.email ||
                                            "-"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في حذف المستخدم:{" "}
                            <span className="font-bold text-foreground">
                                {`${currentUser.first_name} ${currentUser.last_name}`}
                            </span>
                            ؟ هذا الإجراء لا يمكن التراجع عنه.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            حذف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 