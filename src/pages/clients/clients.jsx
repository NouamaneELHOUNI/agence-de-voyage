"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Trash2,
    RefreshCw,
    Edit,
    Eye,
    Search,
    UserPlus,
    X,
    Loader2
} from "lucide-react"
import useClientStore from "@/store/clientStore"
import { PageHeader } from "@/components/page-header"

export default function ClientsPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("active")
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
    const [selectedClientId, setSelectedClientId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    
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
    } = useClientStore()

    // Set document title
    useEffect(() => {
        document.title = "إدارة العملاء | وكالة السفر";
    }, []);

    useEffect(() => {
        // Load clients on component mount
        const loadClients = async () => {
            setIsLoading(true)
            await fetchClients(20, true)
            await fetchDeletedClients(20, true)
            setIsLoading(false)
        }
        
        loadClients()
    }, [fetchClients, fetchDeletedClients])

    const handleSearch = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        
        if (searchQuery.trim() === "") {
            await fetchClients(20, true)
            await fetchDeletedClients(20, true)
        } else {
            await searchClients(searchQuery, true)
        }
        
        setIsLoading(false)
    }

    const handleClearSearch = async () => {
        setSearchQuery("")
        setIsLoading(true)
        await fetchClients(20, true)
        await fetchDeletedClients(20, true)
        setIsLoading(false)
    }

    const handleSoftDelete = (clientId) => {
        setSelectedClientId(clientId)
        setDeleteDialogOpen(true)
    }

    const confirmSoftDelete = async () => {
        setIsLoading(true)
        try {
            await softDeleteClient(selectedClientId)
            setDeleteDialogOpen(false)
        } finally {
            setIsLoading(false)
            setSelectedClientId(null)
        }
    }

    const handleRestore = (clientId) => {
        setSelectedClientId(clientId)
        setRestoreDialogOpen(true)
    }

    const confirmRestore = async () => {
        setIsLoading(true)
        try {
            await restoreClient(selectedClientId)
            setRestoreDialogOpen(false)
        } finally {
            setIsLoading(false)
            setSelectedClientId(null)
        }
    }

    const navigateToClientDetails = (clientId) => {
        navigate(`/clients/show/${clientId}`)
    }

    const navigateToEditClient = (clientId) => {
        navigate(`/clients/edit/${clientId}`)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "غير محدد"
        return new Date(dateString).toLocaleDateString("en-EN")
    }

    return (
        <>
            <div className="w-full space-y-4" dir="rtl">
                <PageHeader 
                    title="إدارة العملاء"
                    description="قائمة بجميع عملاء وكالة السفر الخاصة بك"
                    actions={
                        <Button 
                            onClick={() => navigate('/clients/add')} 
                            className="flex items-center gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>إضافة عميل جديد</span>
                        </Button>
                    }
                />
                
                <Card>
                    <CardHeader className="pb-2">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="البحث عن عميل بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                بحث
                            </Button>
                        </form>
                    </CardHeader>
                    
                    <CardContent>
                        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} dir="rtl">
                            <TabsList className="mb-4">
                                <TabsTrigger value="active">العملاء النشطون ({clients.length})</TabsTrigger>
                                <TabsTrigger value="deleted">العملاء المحذوفون ({deletedClients.length})</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="active">
                                {isLoading || loading ? (
                                    <div className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                                        <p className="text-muted-foreground">جاري تحميل بيانات العملاء...</p>
                                    </div>
                                ) : clients.length === 0 ? (
                                    <div className="text-center py-16 border rounded-md">
                                        <UserPlus className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                                        <h3 className="text-lg font-medium mb-1">لا يوجد عملاء</h3>
                                        <p className="text-muted-foreground mb-4">لم يتم العثور على أي عملاء. قم بإضافة عملاء جدد للبدء.</p>
                                        <Button onClick={() => navigate('/clients/add')}>
                                            إضافة عميل جديد
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="rounded-md border overflow-hidden">
                                        <Table dir="rtl">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>الاسم</TableHead>
                                                    <TableHead>رقم الهاتف</TableHead>
                                                    <TableHead>البريد الإلكتروني</TableHead>
                                                    <TableHead className="hidden md:table-cell">المدينة</TableHead>
                                                    <TableHead className="hidden md:table-cell">البلد</TableHead>
                                                    <TableHead>الحالة</TableHead>
                                                    <TableHead className="hidden md:table-cell">تاريخ الإنشاء</TableHead>
                                                    <TableHead>الإجراءات</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {clients.map((client) => (
                                                    <TableRow key={client.id}>
                                                        <TableCell className="font-medium">
                                                            {client.clients_name || "غير محدد"}
                                                        </TableCell>
                                                        <TableCell dir="ltr" className="text-right">{client.clients_tel || "غير محدد"}</TableCell>
                                                        <TableCell className="hidden sm:table-cell">{client.clients_email || "غير محدد"}</TableCell>
                                                        <TableCell className="hidden md:table-cell">{client.clients_city || "غير محدد"}</TableCell>
                                                        <TableCell className="hidden md:table-cell">{client.clients_country || "غير محدد"}</TableCell>
                                                        <TableCell>
                                                            <Badge 
                                                                variant={client.clients_status === "active" 
                                                                    ? "success" 
                                                                    : client.clients_status === "inactive" 
                                                                        ? "secondary" 
                                                                        : "outline"}
                                                            >
                                                                {client.clients_status === "active" 
                                                                    ? "نشط" 
                                                                    : client.clients_status === "inactive" 
                                                                        ? "غير نشط" 
                                                                        : client.clients_status || "غير محدد"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {formatDate(client.date_created)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    title="عرض بيانات العميل"
                                                                    onClick={() => navigateToClientDetails(client.id)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    title="تعديل بيانات العميل"
                                                                    onClick={() => navigateToEditClient(client.id)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    title="حذف العميل"
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
                                {isLoading || loading ? (
                                    <div className="text-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                                        <p className="text-muted-foreground">جاري تحميل بيانات العملاء المحذوفين...</p>
                                    </div>
                                ) : deletedClients.length === 0 ? (
                                    <div className="text-center py-12 border rounded-md">
                                        <h3 className="text-lg font-medium mb-1">لا يوجد عملاء محذوفين</h3>
                                        <p className="text-muted-foreground">لم يتم العثور على أي عملاء محذوفين.</p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border overflow-hidden">
                                        <Table dir="rtl">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>الاسم</TableHead>
                                                    <TableHead>رقم الهاتف</TableHead>
                                                    <TableHead>البريد الإلكتروني</TableHead>
                                                    <TableHead className="hidden md:table-cell">المدينة</TableHead>
                                                    <TableHead className="hidden md:table-cell">تاريخ الحذف</TableHead>
                                                    <TableHead>الإجراءات</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {deletedClients.map((client) => (
                                                    <TableRow key={client.id}>
                                                        <TableCell className="font-medium">
                                                            {client.clients_name || "غير محدد"}
                                                        </TableCell>
                                                        <TableCell dir="ltr" className="text-right">{client.clients_tel || "غير محدد"}</TableCell>
                                                        <TableCell className="hidden sm:table-cell">{client.clients_email || "غير محدد"}</TableCell>
                                                        <TableCell className="hidden md:table-cell">{client.clients_city || "غير محدد"}</TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {formatDate(client.date_deleted)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    title="عرض بيانات العميل"
                                                                    onClick={() => navigateToClientDetails(client.id)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    title="استعادة العميل"
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
            </div>

            {/* Soft Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="text-right" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تأكيد حذف العميل</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في حذف هذا العميل؟ يمكنك استعادته لاحقاً من قائمة العملاء المحذوفين.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
                            إلغاء
                        </Button>
                        <Button variant="destructive" onClick={confirmSoftDelete} disabled={isLoading}>
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
                        <DialogTitle>تأكيد استعادة العميل</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في استعادة هذا العميل إلى قائمة العملاء النشطين؟
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
    )
} 