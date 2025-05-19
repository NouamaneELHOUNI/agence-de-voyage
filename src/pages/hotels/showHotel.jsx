import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useHotelStore from "../../store/hotelStore";

export default function ShowHotel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchHotel, loading, error, currentHotel } = useHotelStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHotel = async () => {
            setIsLoading(true);
            const result = await fetchHotel(id);
            setIsLoading(false);

            if (!result.success) {
                navigate("/hotels");
            }
        };

        loadHotel();
    }, [id, fetchHotel, navigate]);

    const handleBack = () => {
        navigate("/dashboard/hotels");
    };

    const handleEdit = () => {
        navigate(`/dashboard/hotels/edit/${id}`);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الفندق...
            </div>
        );
    }

    if (!currentHotel) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                لم يتم العثور على الفندق
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تفاصيل الفندق</h1>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                            onClick={handleEdit}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mx-2"
                        >
                            تعديل
                        </button>
                        <button
                            onClick={handleBack}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mx-2"
                        >
                            العودة
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                        {currentHotel.hotel_logo ? (
                            <div className="mb-6 p-2 border border-gray-200 rounded-md">
                                <img
                                    src={currentHotel.hotel_logo}
                                    alt={currentHotel.hotel_name}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        ) : (
                            <div className="mb-6 p-12 bg-gray-100 rounded-md flex items-center justify-center">
                                <span className="text-gray-400">لا يوجد شعار متاح</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-2/3 md:pl-6 rtl:md:pr-6 rtl:md:pl-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-bold mb-4">{currentHotel.hotel_name}</h2>

                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">الموقع</div>
                                    <div className="flex">
                                        <div className="mr-1">{currentHotel.hotel_city},</div>
                                        <div>{currentHotel.hotel_country}</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">رقم الهاتف</div>
                                    <div>
                                        <a href={`tel:${currentHotel.hotel_tel}`} className="text-blue-600 hover:underline">
                                            {currentHotel.hotel_tel}
                                        </a>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">البريد الإلكتروني</div>
                                    <div>
                                        <a href={`mailto:${currentHotel.hotel_email}`} className="text-blue-600 hover:underline">
                                            {currentHotel.hotel_email}
                                        </a>
                                    </div>
                                </div>

                                {currentHotel.hotel_contact && (
                                    <div className="mb-4">
                                        <div className="text-gray-500 text-sm mb-1">معلومات الاتصال</div>
                                        <div>{currentHotel.hotel_contact}</div>
                                    </div>
                                )}
                            </div>

                            {currentHotel.hotel_map && (
                                <div className="md:col-span-2 mt-4">
                                    <div className="text-gray-500 text-sm mb-2">موقع الفندق على الخريطة</div>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <iframe
                                            src={currentHotel.hotel_map}
                                            width="100%"
                                            height="300"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`موقع ${currentHotel.hotel_name}`}
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    {currentHotel.created_by && (
                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-2">تم الإنشاء بواسطة</div>
                            <div className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {currentHotel.created_by.displayName}
                                </span>
                                <span className="text-sm text-gray-500 ml-2 mr-2">
                                    ({currentHotel.created_by.email})
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="text-gray-500 text-sm mb-2">تاريخ الإنشاء</div>
                    <div className="text-sm">
                        {new Date(currentHotel.createdAt).toLocaleString()}
                    </div>

                    <div className="text-gray-500 text-sm mt-4 mb-2">تاريخ آخر تحديث</div>
                    <div className="text-sm">
                        {new Date(currentHotel.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
} 