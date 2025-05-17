"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import UsersTable from "@/components/users/UsersTable"
import useUserStore from "@/store/userStore"
import { useToast } from "@/components/ui/use-toast"

export default function UsersPage() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    
    const {
        users,
        deletedUsers,
        loading,
        error,
        fetchUsers,
        fetchDeletedUsers,
        softDeleteUser,
        restoreUser,
        searchUsers
    } = useUserStore()

    // Set document title
    useEffect(() => {
        document.title = "إدارة المستخدمين | وكالة السفر";
    }, []);

    // Load users on component mount
    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true)
            await fetchUsers(20, true)
            await fetchDeletedUsers(20, true)
            setIsLoading(false)
        }
        
        loadUsers()
    }, [fetchUsers, fetchDeletedUsers])

    // Handle search
    const handleSearch = async (query) => {
        setIsLoading(true)
        
        if (query.trim() === "") {
            await fetchUsers(20, true)
            await fetchDeletedUsers(20, true)
        } else {
            await searchUsers(query, true)
        }
        
        setIsLoading(false)
    }

    // Handle clear search
    const handleClearSearch = async () => {
        setSearchQuery("")
        setIsLoading(true)
        await fetchUsers(20, true)
        await fetchDeletedUsers(20, true)
        setIsLoading(false)
    }

    // Handle soft delete
    const handleSoftDelete = async (userId) => {
        setIsLoading(true)
        try {
            const result = await softDeleteUser(userId)
            
            if (result.success) {
                toast({
                    title: "تم حذف المستخدم",
                    description: "تم حذف المستخدم بنجاح",
                    variant: "success",
                })
            } else {
                toast({
                    title: "حدث خطأ",
                    description: result.error || "حدث خطأ أثناء حذف المستخدم",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error deleting user:", error)
            toast({
                title: "حدث خطأ",
                description: "حدث خطأ غير متوقع أثناء حذف المستخدم",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle restore
    const handleRestore = async (userId) => {
        setIsLoading(true)
        try {
            const result = await restoreUser(userId)
            
            if (result.success) {
                toast({
                    title: "تم استعادة المستخدم",
                    description: "تم استعادة المستخدم بنجاح",
                    variant: "success",
                })
            } else {
                toast({
                    title: "حدث خطأ",
                    description: result.error || "حدث خطأ أثناء استعادة المستخدم",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error restoring user:", error)
            toast({
                title: "حدث خطأ",
                description: "حدث خطأ غير متوقع أثناء استعادة المستخدم",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="w-full space-y-4" dir="rtl">
                <PageHeader 
                    title="إدارة المستخدمين"
                    description="قائمة بجميع مستخدمي النظام ومستوياتهم"
                />
                
                <Card>
                    <CardContent className="pt-6">
                        <UsersTable 
                            users={users}
                            deletedUsers={deletedUsers}
                            isLoading={isLoading || loading}
                            onView={(userId) => navigate(`/users/show/${userId}`)}
                            onEdit={(userId) => navigate(`/users/edit/${userId}`)}
                            onDelete={handleSoftDelete}
                            onRestore={handleRestore}
                            onSearch={handleSearch}
                            onClearSearch={handleClearSearch}
                            onAddUser={() => navigate('/users/add')}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
} 