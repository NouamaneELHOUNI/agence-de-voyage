import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFlightStore from "../../store/flightStore";

export default function ShowFlight() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchFlight, loading, error, currentFlight } = useFlightStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFlight = async () => {
            setIsLoading(true);
            const result = await fetchFlight(id);
            setIsLoading(false);

            if (!result.success) {
                navigate("/dashboard/flights");
            }
        };

        loadFlight();
    }, [id, fetchFlight, navigate]);

    const handleBack = () => {
        navigate("/dashboard/flights");
    };

    const handleEdit = () => {
        navigate(`/dashboard/flights/edit/${id}`);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الرحلة...
            </div>
        );
    }

    if (!currentFlight) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                لم يتم العثور على الرحلة
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تفاصيل الرحلة</h1>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="mb-6">
                            <div className="text-gray-500 text-sm mb-1">اسم الرحلة</div>
                            <div className="text-lg">{currentFlight.vols_name}</div>
                        </div>

                        <div className="mb-6">
                            <div className="text-gray-500 text-sm mb-1">شركة الطيران</div>
                            <div className="text-lg">{currentFlight.vols_company}</div>
                        </div>

                        <div className="mb-6">
                            <div className="text-gray-500 text-sm mb-1">سعر الباقة</div>
                            <div className="text-lg">{currentFlight.vols_price_package}</div>
                        </div>

                        <div className="mb-6">
                            <div className="text-gray-500 text-sm mb-1">سعر الفرد</div>
                            <div className="text-lg">{currentFlight.vols_price_alone}</div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-6">
                            <div className="text-gray-500 text-sm mb-1">الحالة</div>
                            <div className="text-lg">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${currentFlight.vols_staus === "available"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {currentFlight.vols_staus === "available" ? "متاح" : "غير متاح"}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-gray-500 text-sm mb-1">عدد المقاعد المتاحة</div>
                            <div className="text-lg">{currentFlight.vols_seats_package}</div>
                        </div>

                        {currentFlight.vols_logo && (
                            <div className="mb-6">
                                <div className="text-gray-500 text-sm mb-1">شعار شركة الطيران</div>
                                <div className="mt-2">
                                    <div className="w-32 h-32 relative">
                                        <img
                                            src={currentFlight.vols_logo}
                                            alt={currentFlight.vols_company}
                                            className="object-contain w-full h-full border border-gray-200 rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    {currentFlight.createdBy && (
                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-2">تم الإنشاء بواسطة</div>
                            <div className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {currentFlight.createdBy.displayName}
                                </span>
                                <span className="text-sm text-gray-500 ml-2 mr-2">
                                    ({currentFlight.createdBy.email})
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="text-gray-500 text-sm mb-2">تاريخ الإنشاء</div>
                    <div className="text-sm">
                        {new Date(currentFlight.createdAt).toLocaleString()}
                    </div>

                    <div className="text-gray-500 text-sm mt-4 mb-2">تاريخ آخر تحديث</div>
                    <div className="text-sm">
                        {new Date(currentFlight.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
} 