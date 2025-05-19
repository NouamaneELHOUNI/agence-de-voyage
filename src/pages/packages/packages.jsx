import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePackageStore from "../../store/packageStore";
import useAuthStore from "../../store/authStore";

export default function Packages() {
    const { packages, loading, error, fetchPackages, deletePackage } = usePackageStore();
    const { user } = useAuthStore();
    const [deletingId, setDeletingId] = useState(null);
    const [filterByUser, setFilterByUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (filterByUser && user) {
            usePackageStore.getState().fetchUserPackages(user.uid, 10, true);
        } else {
            fetchPackages(10, true);
        }
    }, [fetchPackages, filterByUser, user]);

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الباقة؟")) {
            setDeletingId(id);
            await deletePackage(id);
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        navigate("/dashboard/packages/add");
    };

    const handleEdit = (packageId) => {
        navigate(`/dashboard/packages/edit/${packageId}`);
    };

    const handleView = (packageId) => {
        navigate(`/dashboard/packages/show/${packageId}`);
    };

    const toggleFilter = () => {
        setFilterByUser(!filterByUser);
    };

    if (loading && packages.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الباقات</h1>
                <div className="flex space-x-2 rtl:space-x-reverse">
                    {user && (
                        <button
                            onClick={toggleFilter}
                            className={`px-4 py-2 mr-2 rounded-md border ${filterByUser
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-gray-100 border-gray-300 text-gray-800"
                                }`}
                        >
                            {filterByUser ? "عرض جميع الباقات" : "عرض باقاتي فقط"}
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        إضافة باقة جديدة
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {packages.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">لا توجد باقات متاحة</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-right">اسم الباقة</th>
                                <th className="py-3 px-4 text-right">الصورة</th>
                                <th className="py-3 px-4 text-right">السعر</th>
                                <th className="py-3 px-4 text-right">الخصم</th>
                                <th className="py-3 px-4 text-right">نوع الخصم</th>
                                <th className="py-3 px-4 text-right">الحالة</th>
                                <th className="py-3 px-4 text-right">تاريخ الانتهاء</th>
                                <th className="py-3 px-4 text-right">تم الإنشاء بواسطة</th>
                                <th className="py-3 px-4 text-right">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {packages.map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{pkg.package_name}</td>
                                    <td className="py-3 px-4">
                                        {pkg.package_photo && (
                                            <div className="w-10 h-10 relative">
                                                <img
                                                    src={pkg.package_photo}
                                                    alt={pkg.package_name}
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">{pkg.package_price}</td>
                                    <td className="py-3 px-4">{pkg.package_discount || "-"}</td>
                                    <td className="py-3 px-4">{pkg.package_discount_type || "-"}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${pkg.package_status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {pkg.package_status === "active" ? "نشط" : "غير نشط"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{pkg.package_end || "-"}</td>
                                    <td className="py-3 px-4">
                                        {pkg.created_by ? (
                                            <span className="text-sm text-gray-700">
                                                {pkg.created_by.displayName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">غير معروف</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2 rtl:space-x-reverse">
                                            <button
                                                onClick={() => handleView(pkg.id)}
                                                className="text-green-500 hover:text-green-700 mx-1"
                                            >
                                                عرض
                                            </button>
                                            <button
                                                onClick={() => handleEdit(pkg.id)}
                                                className="text-blue-500 hover:text-blue-700 mx-1"
                                            >
                                                تعديل
                                            </button>
                                            {(!pkg.created_by || (user && pkg.created_by.uid === user.uid)) && (
                                                <button
                                                    onClick={() => handleDelete(pkg.id)}
                                                    className="text-red-500 hover:text-red-700 mx-1"
                                                    disabled={deletingId === pkg.id}
                                                >
                                                    {deletingId === pkg.id ? "جاري الحذف..." : "حذف"}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 