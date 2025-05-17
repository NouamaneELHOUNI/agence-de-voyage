import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Trash2, 
  RefreshCw, 
  Edit, 
  Eye, 
  Search, 
  UserPlus, 
  X 
} from "lucide-react";
import useClientStore from "@/store/clientStore";

export default function ClientsTable() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  
  const { 
    clients, 
    deletedClients, 
    loading, 
    error,
    fetchClients,
    fetchDeletedClients,
    softDeleteClient,
    restoreClient,
    searchClients
  } = useClientStore();

  useEffect(() => {
    fetchClients(10, true);
    fetchDeletedClients(10, true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      fetchClients(10, true);
      fetchDeletedClients(10, true);
      return;
    }
    searchClients(searchQuery, true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchClients(10, true);
    fetchDeletedClients(10, true);
  };

  const handleSoftDelete = async (clientId) => {
    setSelectedClientId(clientId);
    setDeleteDialogOpen(true);
  };

  const confirmSoftDelete = async () => {
    await softDeleteClient(selectedClientId);
    setDeleteDialogOpen(false);
    setSelectedClientId(null);
  };

  const handleRestore = async (clientId) => {
    setSelectedClientId(clientId);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = async () => {
    await restoreClient(selectedClientId);
    setRestoreDialogOpen(false);
    setSelectedClientId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  return (
    <div className="w-full" dir="rtl">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">العملاء</CardTitle>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>إضافة عميل جديد</span>
            </Button>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن عميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={handleClearSearch}
                  className="absolute left-3 top-2.5"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button type="submit">بحث</Button>
          </form>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">العملاء النشطون</TabsTrigger>
              <TabsTrigger value="deleted">العملاء المحذوفون</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {loading ? (
                <div className="text-center py-4">جاري التحميل...</div>
              ) : clients.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  لا يوجد عملاء
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>رقم الهاتف</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>المدينة</TableHead>
                        <TableHead>البلد</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإنشاء</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            {client.clients_name || "غير محدد"}
                          </TableCell>
                          <TableCell>{client.clients_tel || "غير محدد"}</TableCell>
                          <TableCell>{client.clients_email || "غير محدد"}</TableCell>
                          <TableCell>{client.clients_city || "غير محدد"}</TableCell>
                          <TableCell>{client.clients_country || "غير محدد"}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={client.clients_status === "active" ? "success" : "secondary"}
                            >
                              {client.clients_status === "active" ? "نشط" : client.clients_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(client.date_created)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" title="عرض">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="تعديل">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="حذف"
                                onClick={() => handleSoftDelete(client.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
              {loading ? (
                <div className="text-center py-4">جاري التحميل...</div>
              ) : deletedClients.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  لا يوجد عملاء محذوفين
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>رقم الهاتف</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>المدينة</TableHead>
                        <TableHead>تاريخ الحذف</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deletedClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            {client.clients_name || "غير محدد"}
                          </TableCell>
                          <TableCell>{client.clients_tel || "غير محدد"}</TableCell>
                          <TableCell>{client.clients_email || "غير محدد"}</TableCell>
                          <TableCell>{client.clients_city || "غير محدد"}</TableCell>
                          <TableCell>
                            {formatDate(client.date_deleted)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" title="عرض">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="استعادة"
                                onClick={() => handleRestore(client.id)}
                                className="text-primary"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
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
        </CardContent>
      </Card>

      {/* Soft Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="text-right">
          <DialogHeader>
            <DialogTitle>تأكيد حذف العميل</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا العميل؟ يمكنك استعادته لاحقاً من قائمة العملاء المحذوفين.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmSoftDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent className="text-right">
          <DialogHeader>
            <DialogTitle>تأكيد استعادة العميل</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في استعادة هذا العميل إلى قائمة العملاء النشطين؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="default" onClick={confirmRestore}>
              استعادة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 