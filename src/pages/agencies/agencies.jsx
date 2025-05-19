import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAgencyStore from "../../store/agencyStore";
import useAuthStore from "../../store/authStore";

export default function Agencies() {
    const { agencies, loading, error, fetchAgencies, deleteAgency } = useAgencyStore();
    const { user } = useAuthStore();
    const [deletingId, setDeletingId] = useState(null);
    const [filterByUser, setFilterByUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (filterByUser && user) {
            useAgencyStore.getState().fetchUserAgencies(user.uid, 10, true);
        } else {
            fetchAgencies(10, true);
        }
    }, [fetchAgencies, filterByUser, user]);

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الوكالة؟")) {
            setDeletingId(id);
            await deleteAgency(id);
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        navigate("/dashboard/agencies/add");
    };

    const handleEdit = (agencyId) => {
        navigate(`/dashboard/agencies/edit/${agencyId}`);
    };

    const handleView = (agencyId) => {
        navigate(`/dashboard/agencies/show/${agencyId}`);
    };

    const toggleFilter = () => {
        setFilterByUser(!filterByUser);
    };

    if (loading && agencies.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الوكالات</h1>
                <div className="flex space-x-2 rtl:space-x-reverse">
                    {user && (
                        <button
                            onClick={toggleFilter}
                            className={`px-4 py-2 mr-2 rounded-md border ${filterByUser
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-gray-100 border-gray-300 text-gray-800"
                                }`}
                        >
                            {filterByUser ? "عرض جميع الوكالات" : "عرض وكالاتي فقط"}
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        إضافة وكالة جديدة
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {agencies.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">لا توجد وكالات متاحة</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-right">اسم الوكالة</th>
                                <th className="py-3 px-4 text-right">العنوان</th>
                                <th className="py-3 px-4 text-right">رقم الهاتف</th>
                                <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
                                <th className="py-3 px-4 text-right">المسؤول</th>
                                <th className="py-3 px-4 text-right">الحالة</th>
                                <th className="py-3 px-4 text-right">تم الإنشاء بواسطة</th>
                                <th className="py-3 px-4 text-right">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {agencies.map((agency) => (
                                <tr key={agency.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{agency.agency_name}</td>
                                    <td className="py-3 px-4">{agency.agency_adresse}</td>
                                    <td className="py-3 px-4">{agency.agency_tel}</td>
                                    <td className="py-3 px-4">{agency.agency_email}</td>
                                    <td className="py-3 px-4">{agency.agency_responsible}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${agency.agency_status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {agency.agency_status === "active" ? "نشط" : "غير نشط"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {agency.created_by ? (
                                            <span className="text-sm text-gray-700">
                                                {agency.created_by.displayName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">غير معروف</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2 rtl:space-x-reverse">
                                            <button
                                                onClick={() => handleView(agency.id)}
                                                className="text-green-500 hover:text-green-700 mx-1"
                                            >
                                                عرض
                                            </button>
                                            <button
                                                onClick={() => handleEdit(agency.id)}
                                                className="text-blue-500 hover:text-blue-700 mx-1"
                                            >
                                                تعديل
                                            </button>
                                            {(!agency.created_by || (user && agency.created_by.uid === user.uid)) && (
                                                <button
                                                    onClick={() => handleDelete(agency.id)}
                                                    className="text-red-500 hover:text-red-700 mx-1"
                                                    disabled={deletingId === agency.id}
                                                >
                                                    {deletingId === agency.id ? "جاري الحذف..." : "حذف"}
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