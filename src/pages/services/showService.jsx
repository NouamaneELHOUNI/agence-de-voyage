import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useServiceStore from "../../store/serviceStore";

export default function ShowService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchService, loading, error, currentService } = useServiceStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadService = async () => {
            setIsLoading(true);
            const result = await fetchService(id);
            setIsLoading(false);

            if (!result.success) {
                navigate("/dashboard/services");
            }
        };

        loadService();
    }, [id, fetchService, navigate]);

    const handleBack = () => {
        navigate("/dashboard/services");
    };

    const handleEdit = () => {
        navigate(`/dashboard/services/edit/${id}`);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الخدمة...
            </div>
        );
    }

    if (!currentService) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                لم يتم العثور على الخدمة
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تفاصيل الخدمة</h1>
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
                        {currentService.service_photo ? (
                            <div className="mb-6 p-2 border border-gray-200 rounded-md">
                                <img
                                    src={currentService.service_photo}
                                    alt={currentService.service_name}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        ) : (
                            <div className="mb-6 p-12 bg-gray-100 rounded-md flex items-center justify-center">
                                <span className="text-gray-400">لا توجد صورة متاحة</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-2/3 md:pl-6 rtl:md:pr-6 rtl:md:pl-0">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <h2 className="text-xl font-bold mb-4">{currentService.service_name}</h2>

                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">سعر الخدمة المنفرد</div>
                                    <div className="text-lg font-semibold">{currentService.service_price_alone}</div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">سعر الخدمة ضمن الباقة</div>
                                    <div className="text-lg font-semibold">
                                        {currentService.service_price_package || "غير محدد"}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">الحالة</div>
                                    <div>
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs ${currentService.service_status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {currentService.service_status === "active" ? "نشط" : "غير نشط"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-gray-500 text-sm mb-1">وصف الخدمة</div>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    {currentService.service_description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    {currentService.created_by && (
                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-2">تم الإنشاء بواسطة</div>
                            <div className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {currentService.created_by.displayName}
                                </span>
                                <span className="text-sm text-gray-500 ml-2 mr-2">
                                    ({currentService.created_by.email})
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="text-gray-500 text-sm mb-2">تاريخ الإنشاء</div>
                    <div className="text-sm">
                        {new Date(currentService.createdAt).toLocaleString()}
                    </div>

                    <div className="text-gray-500 text-sm mt-4 mb-2">تاريخ آخر تحديث</div>
                    <div className="text-sm">
                        {new Date(currentService.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
} 