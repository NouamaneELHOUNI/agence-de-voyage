import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import useUsersStore from "@/store/usersStore"
import { Search, Plus, UserX, Edit, Eye, Trash2, UserCheck } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function Users() {
    const { users, loading, error, fetchUsers, deleteUser } = useUsersStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchUsers(10, true)
    }, [fetchUsers])

    const handleLoadMore = async () => {
        if (!loading && !isLoadingMore) {
            setIsLoadingMore(true)
            await fetchUsers(10)
            setIsLoadingMore(false)
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const openDeleteDialog = (user) => {
        setUserToDelete(user)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteUser = async () => {
        if (userToDelete) {
            const result = await deleteUser(userToDelete.id)

            if (result.success) {
                toast({
                    title: "تم الحذف بنجاح",
                    description: "تم حذف المستخدم بنجاح",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "خطأ في الحذف",
                    description: result.error || "حدث خطأ أثناء حذف المستخدم",
                })
            }
            setIsDeleteDialogOpen(false)
            setUserToDelete(null)
        }
    }

    const filteredUsers = users.filter((user) => {
        if (!searchTerm) return true
        const search = searchTerm.toLowerCase()
        return (
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(search) ||
            user.username?.toLowerCase().includes(search) ||
            user.userEmail?.toLowerCase().includes(search) ||
            user.userTel?.includes(search) ||
            user.city_agency?.toLowerCase().includes(search) ||
            user.userRole?.toLowerCase().includes(search)
        )
    })

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
            case "نشط":
                return <Badge className="bg-green-500">نشط</Badge>
            case "inactive":
            case "غير نشط":
                return <Badge variant="outline">غير نشط</Badge>
            case "suspended":
            case "معلق":
                return <Badge variant="destructive">معلق</Badge>
            case "pending":
            case "قيد الانتظار":
                return <Badge variant="secondary">قيد الانتظار</Badge>
            default:
                return <Badge variant="outline">{status || "غير محدد"}</Badge>
        }
    }

    const getRoleBadge = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
            case "مدير":
                return <Badge className="bg-blue-500">مدير</Badge>
            case "manager":
            case "مشرف":
                return <Badge className="bg-purple-500">مشرف</Badge>
            case "agent":
            case "وكيل":
                return <Badge className="bg-orange-500">وكيل</Badge>
            case "user":
            case "مستخدم":
                return <Badge>مستخدم</Badge>
            default:
                return <Badge variant="outline">{role || "غير محدد"}</Badge>
        }
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">المستخدمين</h1>
                <Button asChild>
                    <Link to="/dashboard/users/add">
                        <Plus className="w-4 h-4 mr-2" /> إضافة مستخدم
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>قائمة المستخدمين</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="البحث عن المستخدمين..."
                                className="pl-10 text-right"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <div className="rounded-md border">
                        <Table dir="rtl">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">الاسم</TableHead>
                                    <TableHead className="text-right">اسم المستخدم</TableHead>
                                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                    <TableHead className="text-right">الصلاحية</TableHead>
                                    <TableHead className="text-right">الوكالة</TableHead>
                                    <TableHead className="text-right">الحالة</TableHead>
                                    <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(5)
                                        .fill(0)
                                        .map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                                <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                                            </TableRow>
                                        ))
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-32">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <UserX size={48} className="mb-2" />
                                                <p>لا يوجد مستخدمين متاحين</p>
                                                {searchTerm && (
                                                    <p className="text-sm">
                                                        لا توجد نتائج لـ "{searchTerm}"
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {`${user.first_name} ${user.last_name}` || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {user.username || "-"}
                                            </TableCell>
                                            <TableCell dir="ltr" className="text-right">
                                                {user.userEmail || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(user.userRole)}
                                            </TableCell>
                                            <TableCell>{user.city_agency || "-"}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(user.accountStatus)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu dir="rtl">
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <span className="sr-only">فتح القائمة</span>
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                            </svg>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/dashboard/users/${user.id}`}>
                                                                <Eye className="ml-2 h-4 w-4" />
                                                                عرض التفاصيل
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/dashboard/users/edit/${user.id}`}>
                                                                <Edit className="ml-2 h-4 w-4" />
                                                                تعديل
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => openDeleteDialog(user)}
                                                        >
                                                            <Trash2 className="ml-2 h-4 w-4" />
                                                            حذف
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {users.length > 0 && !loading && !searchTerm && (
                        <div className="mt-4 flex justify-center">
                            <Button
                                variant="outline"
                                onClick={handleLoadMore}
                                disabled={isLoadingMore || loading}
                            >
                                {isLoadingMore ? "جاري التحميل..." : "تحميل المزيد"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في حذف المستخدم:{" "}
                            <span className="font-bold text-foreground">
                                {userToDelete ? `${userToDelete.first_name} ${userToDelete.last_name}` : ""}
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
                            onClick={handleDeleteUser}
                        >
                            حذف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
} 