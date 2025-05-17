"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useClientStore from "@/store/clientStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    MoreHorizontal,
    Plus,
    Search,
    UserRound,
    Mail,
    Phone,
    Calendar,
    Trash2,
    Eye,
    Edit2
} from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function Clients() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const { clients, loading, error, fetchClients, searchClients, deleteClient } = useClientStore()

    // Fetch clients on mount
    useEffect(() => {
        fetchClients(10, true)
    }, [fetchClients])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Handle search
    useEffect(() => {
        if (debouncedSearch) {
            searchClients(debouncedSearch)
        } else {
            fetchClients(10, true)
        }
    }, [debouncedSearch, searchClients, fetchClients])

    // Handle load more
    const handleLoadMore = () => {
        fetchClients(10)
    }

    // Handle delete
    const handleDelete = async (clientId) => {
        if (window.confirm("هل أنت متأكد من حذف هذا العميل؟")) {
            const result = await deleteClient(clientId)
            if (result.success) {
                console.log("تم حذف العميل بنجاح")
            } else {
                console.error("فشل في حذف العميل:", result.error)
            }
        }
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="container mx-auto py-6 space-y-6 rtl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <h1 className="text-2xl font-bold">العملاء</h1>
                <Button
                    onClick={() => navigate("/clients/add")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة عميل
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
            >
                <div className="relative flex-1">
                    <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="البحث عن عملاء..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-8"
                    />
                </div>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-destructive/15 text-destructive p-3 rounded-md text-right"
                >
                    {error}
                </motion.div>
            )}

            <Card className="border rounded-lg overflow-hidden shadow-sm">
                <CardContent className="p-0">
                    {loading && clients.length === 0 ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <UserRound className="h-16 w-16 text-muted-foreground/60 mb-4" />
                            <h3 className="text-xl font-medium text-center mb-2">لا يوجد عملاء</h3>
                            <p className="text-muted-foreground text-center max-w-sm">
                                لا يوجد عملاء متاحين حالياً. انقر على "إضافة عميل" لإنشاء عميل جديد.
                            </p>
                            <Button
                                onClick={() => navigate("/clients/add")}
                                className="mt-4"
                                variant="outline"
                            >
                                <Plus className="ml-2 h-4 w-4" />
                                إضافة عميل
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-background/40">
                            <Table dir="rtl">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">الاسم</TableHead>
                                        <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                        <TableHead className="text-right">الهاتف</TableHead>
                                        <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                        className="contents"
                                    >
                                        {clients.map((client) => (
                                            <motion.tr
                                                key={client.id}
                                                variants={itemVariants}
                                                className="group hover:bg-muted/50 cursor-pointer"
                                                onClick={() => navigate(`/clients/${client.id}`)}
                                            >
                                                <TableCell className="font-medium flex items-center space-x-2 rtl:space-x-reverse py-4">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                        <UserRound className="h-4 w-4" />
                                                    </div>
                                                    <span>{client.name}</span>
                                                </TableCell>
                                                <TableCell className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span>{client.email}</span>
                                                </TableCell>
                                                <TableCell className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span dir="ltr">{client.phone}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="flex items-center space-x-1 rtl:space-x-reverse">
                                                        <Calendar className="h-3 w-3" />
                                                        <span dir="ltr">{new Date(client.createdAt).toLocaleDateString('ar-SA')}</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/clients/${client.id}`);
                                                                }}
                                                                className="flex items-center rtl:space-x-reverse"
                                                            >
                                                                <Eye className="h-4 w-4 ml-2" />
                                                                <span>عرض التفاصيل</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/clients/edit/${client.id}`);
                                                                }}
                                                                className="flex items-center rtl:space-x-reverse"
                                                            >
                                                                <Edit2 className="h-4 w-4 ml-2" />
                                                                <span>تعديل</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive flex items-center rtl:space-x-reverse"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(client.id);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 ml-2" />
                                                                <span>حذف</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </motion.div>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {clients.length > 0 && !loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                >
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="min-w-[150px]"
                    >
                        {loading ? "جاري التحميل..." : "تحميل المزيد"}
                    </Button>
                </motion.div>
            )}
        </div>
    )
} 