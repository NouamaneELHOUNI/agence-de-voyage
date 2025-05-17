import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import useClientStore from "@/store/clientStore";

export default function ClientDetails({ clientId, onEdit, onClose }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const { currentClient, loading, fetchClient, softDeleteClient, restoreClient } = useClientStore();

  useEffect(() => {
    if (clientId) {
      fetchClient(clientId);
    }
  }, [clientId, fetchClient]);

  const handleDelete = async () => {
    await softDeleteClient(clientId);
    setDeleteDialogOpen(false);
    if (onClose) onClose();
  };

  const handleRestore = async () => {
    await restoreClient(clientId);
    setRestoreDialogOpen(false);
    if (onClose) onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto" dir="rtl">
        <CardContent className="text-center py-10">
          جاري تحميل بيانات العميل...
        </CardContent>
      </Card>
    );
  }

  if (!currentClient) {
    return (
      <Card className="w-full max-w-4xl mx-auto" dir="rtl">
        <CardContent className="text-center py-10">
          لم يتم العثور على بيانات لهذا العميل
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto" dir="rtl">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{currentClient.clients_name || "عميل بدون اسم"}</CardTitle>
              <CardDescription className="mt-1">
                {currentClient.clients_tel}
                {currentClient.clients_email ? ` • ${currentClient.clients_email}` : ""}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {currentClient.is_deleted ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary-500"
                  onClick={() => setRestoreDialogOpen(true)}
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  استعادة
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit && onEdit(clientId)}
                  >
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </>
              )}
            </div>
          </div>
          {/* Status Badge */}
          <div className="mt-4">
            <Badge variant={currentClient.is_deleted ? "destructive" : 
                  (currentClient.clients_status === "active" ? "success" : 
                  (currentClient.clients_status === "inactive" ? "secondary" : "outline"))}>
              {currentClient.is_deleted 
                ? "محذوف" 
                : currentClient.clients_status === "active" 
                  ? "نشط" 
                  : currentClient.clients_status === "inactive" 
                    ? "غير نشط" 
                    : currentClient.clients_status || "غير محدد"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoItem label="الاسم" value={currentClient.clients_name} />
            <InfoItem label="رقم الهاتف" value={currentClient.clients_tel} />
            <InfoItem label="البريد الإلكتروني" value={currentClient.clients_email} />
            <InfoItem label="الجنس" value={currentClient.clients_sex} />
            <InfoItem label="رقم جواز السفر" value={currentClient.clients_passport} />
            <InfoItem label="رقم البطاقة الوطنية" value={currentClient.clients_cin} />
            <InfoItem label="المدينة" value={currentClient.clients_city} />
            <InfoItem label="البلد" value={currentClient.clients_country} />
            <InfoItem label="تاريخ الميلاد" value={formatDate(currentClient.clients_dob)} />
          </div>

          {currentClient.clients_adresse && (
            <>
              <Separator className="my-4" />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">العنوان</h3>
                <p className="text-muted-foreground">
                  {currentClient.clients_adresse}
                </p>
              </div>
            </>
          )}

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem 
              label="تاريخ الإنشاء" 
              value={formatDate(currentClient.date_created)} 
              tooltip="تاريخ إضافة العميل للنظام" 
            />
            <InfoItem 
              label="آخر تحديث" 
              value={formatDate(currentClient.date_updated)} 
              tooltip="تاريخ آخر تحديث لبيانات العميل" 
            />
            {currentClient.date_deleted && (
              <InfoItem 
                label="تاريخ الحذف" 
                value={formatDate(currentClient.date_deleted)} 
                tooltip="تاريخ حذف العميل" 
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="text-right">
          <DialogHeader>
            <DialogTitle>تأكيد حذف العميل</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف العميل "{currentClient.clients_name}"؟ يمكنك استعادته لاحقاً من قائمة العملاء المحذوفين.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent className="text-right">
          <DialogHeader>
            <DialogTitle>تأكيد استعادة العميل</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في استعادة العميل "{currentClient.clients_name}" إلى قائمة العملاء النشطين؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="default" onClick={handleRestore}>
              استعادة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

function InfoItem({ label, value, tooltip }) {
  const content = (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || "غير محدد"}</p>
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
} 