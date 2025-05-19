import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAgencyStore from "../../store/agencyStore";

export default function ShowAgency() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchAgency, loading, error, currentAgency } = useAgencyStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAgency = async () => {
            setIsLoading(true);
            const result = await fetchAgency(id);
            setIsLoading(false);

            if (!result.success) {
                navigate("/dashboard/agencies");
            }
        };

        loadAgency();
    }, [id, fetchAgency, navigate]);

    const handleBack = () => {
        navigate("/dashboard/agencies");
    };

    const handleEdit = () => {
        navigate(`/dashboard/agencies/edit/${id}`);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الوكالة...
            </div>
        );
    }

    if (!currentAgency) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                لم يتم العثور على الوكالة
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تفاصيل الوكالة</h1>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4">{currentAgency.agency_name}</h2>

                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-1">العنوان</div>
                            <div className="text-lg">{currentAgency.agency_adresse}</div>
                        </div>

                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-1">رقم الهاتف</div>
                            <div>
                                <a href={`tel:${currentAgency.agency_tel}`} className="text-blue-600 hover:underline">
                                    {currentAgency.agency_tel}
                                </a>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-1">البريد الإلكتروني</div>
                            <div>
                                <a href={`mailto:${currentAgency.agency_email}`} className="text-blue-600 hover:underline">
                                    {currentAgency.agency_email}
                                </a>
                            </div>
                        </div>

                        {currentAgency.agency_responsible && (
                            <div className="mb-4">
                                <div className="text-gray-500 text-sm mb-1">المسؤول</div>
                                <div>{currentAgency.agency_responsible}</div>
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-1">الحالة</div>
                            <div>
                                <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs ${currentAgency.agency_status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {currentAgency.agency_status === "active" ? "نشط" : "غير نشط"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    {currentAgency.created_by && (
                        <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-2">تم الإنشاء بواسطة</div>
                            <div className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {currentAgency.created_by.displayName}
                                </span>
                                <span className="text-sm text-gray-500 ml-2 mr-2">
                                    ({currentAgency.created_by.email})
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="text-gray-500 text-sm mb-2">تاريخ الإنشاء</div>
                    <div className="text-sm">
                        {new Date(currentAgency.createdAt).toLocaleString()}
                    </div>

                    <div className="text-gray-500 text-sm mt-4 mb-2">تاريخ آخر تحديث</div>
                    <div className="text-sm">
                        {new Date(currentAgency.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
} 