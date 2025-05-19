import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlightStore from "../../store/flightStore";
import useAuthStore from "../../store/authStore";

export default function Flights() {
    const { flights, loading, error, fetchFlights, deleteFlight } = useFlightStore();
    const { user } = useAuthStore();
    const [deletingId, setDeletingId] = useState(null);
    const [filterByUser, setFilterByUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (filterByUser && user) {
            useFlightStore.getState().fetchUserFlights(user.uid, 10, true);
        } else {
            fetchFlights(10, true);
        }
    }, [fetchFlights, filterByUser, user]);

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذه الرحلة؟")) {
            setDeletingId(id);
            await deleteFlight(id);
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        navigate("/dashboard/flights/add");
    };

    const handleEdit = (flightId) => {
        navigate(`/dashboard/flights/edit/${flightId}`);
    };

    const handleView = (flightId) => {
        navigate(`/dashboard/flights/show/${flightId}`);
    };

    const toggleFilter = () => {
        setFilterByUser(!filterByUser);
    };

    if (loading && flights.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الرحلات</h1>
                <div className="flex space-x-2 rtl:space-x-reverse">
                    {user && (
                        <button
                            onClick={toggleFilter}
                            className={`px-4 py-2 mr-2 rounded-md border ${filterByUser
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-gray-100 border-gray-300 text-gray-800"
                                }`}
                        >
                            {filterByUser ? "عرض جميع الرحلات" : "عرض رحلاتي فقط"}
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        إضافة رحلة جديدة
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {flights.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">لا توجد رحلات متاحة</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-right">اسم الرحلة</th>
                                <th className="py-3 px-4 text-right">شركة الطيران</th>
                                <th className="py-3 px-4 text-right">سعر الباقة</th>
                                <th className="py-3 px-4 text-right">سعر الفرد</th>
                                <th className="py-3 px-4 text-right">الحالة</th>
                                <th className="py-3 px-4 text-right">عدد المقاعد المتاحة</th>
                                <th className="py-3 px-4 text-right">الشعار</th>
                                <th className="py-3 px-4 text-right">تم الإنشاء بواسطة</th>
                                <th className="py-3 px-4 text-right">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {flights.map((flight) => (
                                <tr key={flight.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{flight.vols_name}</td>
                                    <td className="py-3 px-4">{flight.vols_company}</td>
                                    <td className="py-3 px-4">{flight.vols_price_package}</td>
                                    <td className="py-3 px-4">{flight.vols_price_alone}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${flight.vols_staus === "available"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {flight.vols_staus === "available" ? "متاح" : "غير متاح"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{flight.vols_seats_package}</td>
                                    <td className="py-3 px-4">
                                        {flight.vols_logo && (
                                            <div className="w-10 h-10 relative">
                                                <img
                                                    src={flight.vols_logo}
                                                    alt={flight.vols_company}
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {flight.createdBy ? (
                                            <span className="text-sm text-gray-700">
                                                {flight.createdBy.displayName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">غير معروف</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2 rtl:space-x-reverse">
                                            <button
                                                onClick={() => handleView(flight.id)}
                                                className="text-green-500 hover:text-green-700 mx-1"
                                            >
                                                عرض
                                            </button>
                                            <button
                                                onClick={() => handleEdit(flight.id)}
                                                className="text-blue-500 hover:text-blue-700 mx-1"
                                            >
                                                تعديل
                                            </button>
                                            {(!flight.createdBy || (user && flight.createdBy.uid === user.uid)) && (
                                                <button
                                                    onClick={() => handleDelete(flight.id)}
                                                    className="text-red-500 hover:text-red-700 mx-1"
                                                    disabled={deletingId === flight.id}
                                                >
                                                    {deletingId === flight.id ? "جاري الحذف..." : "حذف"}
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