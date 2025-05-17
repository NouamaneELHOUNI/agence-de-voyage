import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  RefreshCw,
  Edit,
  Eye,
  Search,
  UserPlus,
  X,
  Loader2,
} from "lucide-react";
import { USER_ROLES, ACCOUNT_STATUS } from "@/store/userStore";
import useAuthStore from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersTable({
  users,
  deletedUsers,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRestore,
  onSearch,
  onClearSearch,
  onAddUser,
  searchQuery,
  setSearchQuery,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const { user: currentUser } = useAuthStore();
  const currentUserRole = currentUser?.role || "";

  // Format date string
  const formatDate = (dateObj) => {
    if (!dateObj) return "غير محدد";
    return new Date(dateObj).toLocaleDateString("ar-SA");
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "مدير النظام";
      case USER_ROLES.MANAGER:
        return "مدير";
      case USER_ROLES.AGENT:
        return "وكيل";
      case USER_ROLES.USER:
        return "مستخدم عادي";
      default:
        return role || "غير محدد";
    }
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case ACCOUNT_STATUS.ACTIVE:
        return "success";
      case ACCOUNT_STATUS.INACTIVE:
        return "secondary";
      case ACCOUNT_STATUS.SUSPENDED:
        return "destructive";
      case ACCOUNT_STATUS.PENDING:
        return "warning";
      default:
        return "outline";
    }
  };

  // Check if current user can delete/edit a specific user
  const canModifyUser = (userToModify) => {
    if (!userToModify || !currentUser) return false;
    
    // Admins can modify anyone except themselves for delete
    if (currentUserRole === USER_ROLES.ADMIN) {
      return userToModify.uid !== currentUser.uid; // Can't delete/modify self
    }
    
    // Managers can only modify agents and regular users
    if (currentUserRole === USER_ROLES.MANAGER) {
      return ![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(userToModify.userRole);
    }
    
    // Others can't modify users
    return false;
  };

  // Handle delete button click
  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    await onDelete(selectedUserId);
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  // Handle restore button click
  const handleRestore = (userId) => {
    setSelectedUserId(userId);
    setRestoreDialogOpen(true);
  };

  // Confirm restore action
  const confirmRestore = async () => {
    await onRestore(selectedUserId);
    setRestoreDialogOpen(false);
    setSelectedUserId(null);
  };

  // Generate initials for avatar fallback
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.[0] || "";
    const lastInitial = lastName?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن مستخدم بالاسم، البريد الإلكتروني، أو اسم المستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={onClearSearch}
                  className="absolute left-3 top-2.5"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              بحث
            </Button>
          </form>
          
          <div className="mr-4 flex-shrink-0">
            <Button onClick={onAddUser} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>إضافة مستخدم جديد</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} dir="rtl">
          <TabsList className="mb-4">
            <TabsTrigger value="active">المستخدمون النشطون ({users?.length || 0})</TabsTrigger>
            <TabsTrigger value="deleted">المستخدمون المحذوفون ({deletedUsers?.length || 0})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">جاري تحميل بيانات المستخدمين...</p>
              </div>
            ) : users?.length === 0 ? (
              <div className="text-center py-16 border rounded-md">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-1">لا يوجد مستخدمين</h3>
                <p className="text-muted-foreground mb-4">لم يتم العثور على أي مستخدمين. قم بإضافة مستخدمين جدد للبدء.</p>
                <Button onClick={onAddUser}>
                  إضافة مستخدم جديد
                </Button>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead className="hidden md:table-cell">رقم الهاتف</TableHead>
                      <TableHead className="hidden md:table-cell">الدور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="hidden md:table-cell">تاريخ الإنشاء</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                              ) : null}
                              <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{user.username || "غير محدد"}</TableCell>
                        <TableCell dir="ltr" className="hidden sm:table-cell text-right">{user.userEmail || "غير محدد"}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.userTel || "غير محدد"}</TableCell>
                        <TableCell className="hidden md:table-cell">{getRoleDisplayName(user.userRole)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(user.accountStatus)}>
                            {user.accountStatus || "غير محدد"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(user.date_created)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="عرض بيانات المستخدم"
                              onClick={() => onView(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canModifyUser(user) && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="تعديل بيانات المستخدم"
                                  onClick={() => onEdit(user.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="حذف المستخدم"
                                  onClick={() => handleDelete(user.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deleted">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">جاري تحميل بيانات المستخدمين المحذوفين...</p>
              </div>
            ) : deletedUsers?.length === 0 ? (
              <div className="text-center py-12 border rounded-md">
                <h3 className="text-lg font-medium mb-1">لا يوجد مستخدمين محذوفين</h3>
                <p className="text-muted-foreground">لم يتم العثور على أي مستخدمين محذوفين.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead className="hidden md:table-cell">الدور</TableHead>
                      <TableHead className="hidden md:table-cell">تاريخ الحذف</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                              ) : null}
                              <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{user.username || "غير محدد"}</TableCell>
                        <TableCell dir="ltr" className="text-right">{user.userEmail || "غير محدد"}</TableCell>
                        <TableCell className="hidden md:table-cell">{getRoleDisplayName(user.userRole)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(user.date_deleted)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="عرض بيانات المستخدم"
                              onClick={() => onView(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canModifyUser(user) && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="استعادة المستخدم"
                                onClick={() => handleRestore(user.id)}
                                className="text-primary"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد حذف المستخدم</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ يمكنك استعادته لاحقاً من قائمة المستخدمين المحذوفين.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد استعادة المستخدم</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في استعادة هذا المستخدم إلى قائمة المستخدمين النشطين؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)} disabled={isLoading}>
              إلغاء
            </Button>
            <Button variant="default" onClick={confirmRestore} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              استعادة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 