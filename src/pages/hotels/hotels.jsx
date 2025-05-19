import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHotelStore from "../../store/hotelStore";
import useAuthStore from "../../store/authStore";

export default function Hotels() {
    const { hotels, loading, error, fetchHotels, deleteHotel } = useHotelStore();
    const { user } = useAuthStore();
    const [deletingId, setDeletingId] = useState(null);
    const [filterByUser, setFilterByUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (filterByUser && user) {
            useHotelStore.getState().fetchUserHotels(user.uid, 10, true);
        } else {
            fetchHotels(10, true);
        }
    }, [fetchHotels, filterByUser, user]);

    const handleDelete = async (id) => {
        if (confirm("هل أنت متأكد من حذف هذا الفندق؟")) {
            setDeletingId(id);
            await deleteHotel(id);
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        navigate("/dashboard/hotels/add");
    };

    const handleEdit = (hotelId) => {
        navigate(`/dashboard/hotels/edit/${hotelId}`);
    };

    const handleView = (hotelId) => {
        navigate(`/dashboard/hotels/show/${hotelId}`);
    };

    const toggleFilter = () => {
        setFilterByUser(!filterByUser);
    };

    if (loading && hotels.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الفنادق</h1>
                <div className="flex space-x-2 rtl:space-x-reverse">
                    {user && (
                        <button
                            onClick={toggleFilter}
                            className={`px-4 py-2 mr-2 rounded-md border ${filterByUser
                                    ? "bg-blue-100 border-blue-300 text-blue-800"
                                    : "bg-gray-100 border-gray-300 text-gray-800"
                                }`}
                        >
                            {filterByUser ? "عرض جميع الفنادق" : "عرض فنادقي فقط"}
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        إضافة فندق جديد
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {hotels.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">لا توجد فنادق متاحة</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-right">اسم الفندق</th>
                                <th className="py-3 px-4 text-right">المدينة</th>
                                <th className="py-3 px-4 text-right">الدولة</th>
                                <th className="py-3 px-4 text-right">رقم الهاتف</th>
                                <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
                                <th className="py-3 px-4 text-right">الشعار</th>
                                <th className="py-3 px-4 text-right">تم الإنشاء بواسطة</th>
                                <th className="py-3 px-4 text-right">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {hotels.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{hotel.hotel_name}</td>
                                    <td className="py-3 px-4">{hotel.hotel_city}</td>
                                    <td className="py-3 px-4">{hotel.hotel_country}</td>
                                    <td className="py-3 px-4">{hotel.hotel_tel}</td>
                                    <td className="py-3 px-4">{hotel.hotel_email}</td>
                                    <td className="py-3 px-4">
                                        {hotel.hotel_logo && (
                                            <div className="w-10 h-10 relative">
                                                <img
                                                    src={hotel.hotel_logo}
                                                    alt={hotel.hotel_name}
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {hotel.created_by ? (
                                            <span className="text-sm text-gray-700">
                                                {hotel.created_by.displayName}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">غير معروف</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2 rtl:space-x-reverse">
                                            <button
                                                onClick={() => handleView(hotel.id)}
                                                className="text-green-500 hover:text-green-700 mx-1"
                                            >
                                                عرض
                                            </button>
                                            <button
                                                onClick={() => handleEdit(hotel.id)}
                                                className="text-blue-500 hover:text-blue-700 mx-1"
                                            >
                                                تعديل
                                            </button>
                                            {(!hotel.created_by || (user && hotel.created_by.uid === user.uid)) && (
                                                <button
                                                    onClick={() => handleDelete(hotel.id)}
                                                    className="text-red-500 hover:text-red-700 mx-1"
                                                    disabled={deletingId === hotel.id}
                                                >
                                                    {deletingId === hotel.id ? "جاري الحذف..." : "حذف"}
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