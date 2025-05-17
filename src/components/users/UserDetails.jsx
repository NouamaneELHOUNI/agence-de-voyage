import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { USER_ROLES, ACCOUNT_STATUS } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from "@/store/authStore";

export default function UserDetails({ user, onEdit, isLoading }) {
  const { user: currentUser } = useAuthStore();
  const currentUserRole = currentUser?.role || "";

  // Helper to check if current user can edit this user
  const canEditUser = () => {
    if (!user || !currentUser) return false;
    
    // Admins can edit anyone
    if (currentUserRole === USER_ROLES.ADMIN) return true;
    
    // Managers can edit agents and regular users, but not admins or other managers
    if (currentUserRole === USER_ROLES.MANAGER) {
      return ![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(user.userRole);
    }
    
    // All others can't edit users
    return false;
  };

  // Format date string
  const formatDate = (dateObj) => {
    if (!dateObj) return "غير محدد";
    return new Date(dateObj).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Get account status display name
  const getStatusDisplayName = (status) => {
    switch (status) {
      case ACCOUNT_STATUS.ACTIVE:
        return "نشط";
      case ACCOUNT_STATUS.INACTIVE:
        return "غير نشط";
      case ACCOUNT_STATUS.SUSPENDED:
        return "معلق";
      case ACCOUNT_STATUS.PENDING:
        return "قيد المراجعة";
      default:
        return status || "غير محدد";
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

  // Get email status badge variant
  const getEmailStatusVariant = (status) => {
    switch (status) {
      case "verified":
        return "success";
      case "unverified":
        return "warning";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  // Return no user state
  if (!user) {
    return (
      <div className="text-center py-8">
        <p>لم يتم العثور على بيانات المستخدم</p>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const getInitials = () => {
    const firstInitial = user.first_name?.[0] || "";
    const lastInitial = user.last_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4 flex justify-between flex-row items-start">
        <div>
          <CardTitle className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant={getStatusVariant(user.accountStatus)}>
              {getStatusDisplayName(user.accountStatus)}
            </Badge>
            <Badge variant="outline">
              {getRoleDisplayName(user.userRole)}
            </Badge>
            <Badge variant={getEmailStatusVariant(user.email_status)}>
              {user.email_status === "verified" ? "بريد مؤكد" : 
               user.email_status === "unverified" ? "بريد غير مؤكد" : 
               "بريد قيد التأكيد"}
            </Badge>
            {user.is_deleted_u && (
              <Badge variant="destructive">محذوف</Badge>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
            ) : null}
            <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">اسم المستخدم</h3>
            <p className="text-base font-medium">{user.username || "غير محدد"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">البريد الإلكتروني</h3>
            <p className="text-base font-medium">{user.userEmail || "غير محدد"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">رقم الهاتف</h3>
            <p className="text-base font-medium">{user.userTel || "غير محدد"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">دور المستخدم</h3>
            <p className="text-base font-medium">{getRoleDisplayName(user.userRole)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">تاريخ الإنشاء</h3>
            <p className="text-base font-medium">{formatDate(user.date_created)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">آخر تحديث</h3>
            <p className="text-base font-medium">{formatDate(user.date_updated)}</p>
          </div>

          {user.date_deleted && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">تاريخ الحذف</h3>
              <p className="text-base font-medium">{formatDate(user.date_deleted)}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">معرّف المستخدم</h3>
            <p className="text-base font-medium font-mono">{user.uid || "غير محدد"}</p>
          </div>
        </div>

        {canEditUser() && (
          <div className="pt-4 mt-2">
            <Button onClick={onEdit} className="gap-2" variant="outline">
              <Edit className="h-4 w-4" />
              تعديل بيانات المستخدم
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 