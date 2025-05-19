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
    Calendar,
} from "lucide-react";
import useClientStore from "@/store/clientStore";
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

export default function ShowClient() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { currentClient, loading, error, fetchClient, deleteClient } = useClientStore();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchClient(id);
    }, [id, fetchClient]);

    const handleDelete = async () => {
        const result = await deleteClient(id);
        if (result.success) {
            toast({
                title: "تم الحذف بنجاح",
                description: "تم حذف العميل بنجاح",
            });
            navigate("/dashboard/clients");
        } else {
            toast({
                variant: "destructive",
                title: "خطأ في الحذف",
                description: result.error || "حدث خطأ أثناء حذف العميل",
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
            case "pending":
            case "قيد الانتظار":
                return <Badge variant="secondary">قيد الانتظار</Badge>;
            default:
                return <Badge variant="outline">{status || "غير محدد"}</Badge>;
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
                    <h1 className="text-3xl font-bold">تفاصيل العميل</h1>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/clients")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة إلى قائمة العملاء
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

    if (!currentClient) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">تفاصيل العميل</h1>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/clients")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة إلى قائمة العملاء
                    </Button>
                </div>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">لم يتم العثور على العميل</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">تفاصيل العميل</h1>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/clients")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة إلى قائمة العملاء
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to={`/dashboard/clients/edit/${id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل العميل
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف العميل
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>معلومات العميل الأساسية</CardTitle>
                        <CardDescription>التفاصيل الشخصية للعميل</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <UserCircle className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">الاسم:</span>
                            <span>{currentClient.clients_name || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">البريد الإلكتروني:</span>
                            <span dir="ltr">{currentClient.clients_email || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">رقم الهاتف:</span>
                            <span dir="ltr">{currentClient.clients_tel || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">الجنس:</span>
                            <span>{currentClient.clients_sex || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">تاريخ الميلاد:</span>
                            <span dir="ltr">{formatDate(currentClient.clients_dob) || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">الحالة:</span>
                            {getStatusBadge(currentClient.clients_status)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>معلومات إضافية</CardTitle>
                        <CardDescription>معلومات العنوان والوثائق</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">العنوان:</span>
                            <span>{currentClient.clients_adresse || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">المدينة:</span>
                            <span>{currentClient.clients_city || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <Globe className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">البلد:</span>
                            <span>{currentClient.clients_country || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">رقم جواز السفر:</span>
                            <span dir="ltr">{currentClient.clients_passport || "-"}</span>
                        </div>
                        <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-semibold ml-2">رقم البطاقة الوطنية:</span>
                            <span dir="ltr">{currentClient.clients_cin || "-"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>معلومات الإنشاء والتحديث</CardTitle>
                        <CardDescription>تواريخ إنشاء وتحديث بيانات العميل</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-primary" />
                                <span className="font-semibold ml-2">تاريخ الإنشاء:</span>
                                <span dir="ltr">
                                    {currentClient.createdAt
                                        ? formatDate(currentClient.createdAt)
                                        : "-"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-primary" />
                                <span className="font-semibold ml-2">تاريخ التحديث:</span>
                                <span dir="ltr">
                                    {currentClient.updatedAt
                                        ? formatDate(currentClient.updatedAt)
                                        : "-"}
                                </span>
                            </div>
                            {currentClient.created_by && (
                                <div className="flex items-center">
                                    <User className="h-5 w-5 mr-2 text-primary" />
                                    <span className="font-semibold ml-2">تم الإنشاء بواسطة:</span>
                                    <span>
                                        {currentClient.created_by.displayName ||
                                            currentClient.created_by.email ||
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
                            هل أنت متأكد من رغبتك في حذف العميل:{" "}
                            <span className="font-bold text-foreground">
                                {currentClient.clients_name}
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