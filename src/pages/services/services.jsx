import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useServiceStore from "../../store/serviceStore";
import useAuthStore from "../../store/authStore";

export default function Services() {
    const { services, loading, error, fetchServices, deleteService } = useServiceStore();
    const { user } = useAuthStore();
    const [deletingId, setDeletingId] = useState(null);
    const [filterByUser, setFilterByUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (filterByUser && user) {
            useServiceStore.getState().fetchUserServices(user.uid, 10, true);
        } else {
            fetchServices(10, true);
        }
    }, [fetchServices, filterByUser, user]);

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
            setDeletingId(id);
            await deleteService(id);
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        navigate("/dashboard/services/add");
    };

    const handleEdit = (serviceId) => {
        navigate(`/dashboard/services/edit/${serviceId}`);
    };

    const handleView = (serviceId) => {
        navigate(`/dashboard/services/show/${serviceId}`);
    };

    const toggleFilter = () => {
        setFilterByUser(!filterByUser);
    };

    if (loading && services.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
                <div className="flex space-x-2 rtl:space-x-reverse">
                    {user && (
                        <button
                            onClick={toggleFilter}
                            className={`px-4 py-2 mr-2 rounded-md border ${filterByUser
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-gray-100 border-gray-300 text-gray-800"
                                }`}
                        >
                            {filterByUser ? "عرض جميع الخدمات" : "عرض خدماتي فقط"}
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        إضافة خدمة جديدة
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {services.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">لا توجد خدمات متاحة</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-right">اسم الخدمة</th>
                                <th className="py-3 px-4 text-right">الصورة</th>
                                <th className="py-3 px-4 text-right">السعر المنفرد</th>
                                <th className="py-3 px-4 text-right">سعر الباقة</th>
                                <th className="py-3 px-4 text-right">الحالة</th>
                                <th className="py-3 px-4 text-right">تم الإنشاء بواسطة</th>
                                <th className="py-3 px-4 text-right">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{service.service_name}</td>
                                    <td className="py-3 px-4">
                                        {service.service_photo && (
                                            <div className="w-10 h-10 relative">
                                                <img
                                                    src={service.service_photo}
                                                    alt={service.service_name}
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">{service.service_price_alone}</td>
                                    <td className="py-3 px-4">{service.service_price_package}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${service.service_status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {service.service_status === "active" ? "نشط" : "غير نشط"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {service.created_by ? (
                                            <span className="text-sm text-gray-700">
                                                {service.created_by.displayName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">غير معروف</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2 rtl:space-x-reverse">
                                            <button
                                                onClick={() => handleView(service.id)}
                                                className="text-green-500 hover:text-green-700 mx-1"
                                            >
                                                عرض
                                            </button>
                                            <button
                                                onClick={() => handleEdit(service.id)}
                                                className="text-blue-500 hover:text-blue-700 mx-1"
                                            >
                                                تعديل
                                            </button>
                                            {(!service.created_by || (user && service.created_by.uid === user.uid)) && (
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="text-red-500 hover:text-red-700 mx-1"
                                                    disabled={deletingId === service.id}
                                                >
                                                    {deletingId === service.id ? "جاري الحذف..." : "حذف"}
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