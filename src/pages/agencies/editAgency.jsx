import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAgencyStore from "../../store/agencyStore";

export default function EditAgency() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchAgency, updateAgency, loading, error, currentAgency } = useAgencyStore();

    const [formData, setFormData] = useState({
        agency_name: "",
        agency_adresse: "",
        agency_tel: "",
        agency_email: "",
        agency_responsible: "",
        agency_status: "active",
    });

    const [errors, setErrors] = useState({});
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

    useEffect(() => {
        if (currentAgency) {
            setFormData({
                agency_name: currentAgency.agency_name || "",
                agency_adresse: currentAgency.agency_adresse || "",
                agency_tel: currentAgency.agency_tel || "",
                agency_email: currentAgency.agency_email || "",
                agency_responsible: currentAgency.agency_responsible || "",
                agency_status: currentAgency.agency_status || "active",
            });
        }
    }, [currentAgency]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when field is being edited
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.agency_name) newErrors.agency_name = "اسم الوكالة مطلوب";
        if (!formData.agency_adresse) newErrors.agency_adresse = "عنوان الوكالة مطلوب";
        if (!formData.agency_tel) newErrors.agency_tel = "رقم الهاتف مطلوب";
        if (!formData.agency_email) newErrors.agency_email = "البريد الإلكتروني مطلوب";
        // Email validation
        if (formData.agency_email && !/\S+@\S+\.\S+/.test(formData.agency_email)) {
            newErrors.agency_email = "يرجى إدخال بريد إلكتروني صحيح";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const result = await updateAgency(id, formData);

        if (result.success) {
            navigate("/dashboard/agencies");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/agencies");
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الوكالة...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تعديل بيانات الوكالة</h1>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        العودة للقائمة
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                اسم الوكالة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="agency_name"
                                value={formData.agency_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.agency_name ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.agency_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.agency_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                المسؤول
                            </label>
                            <input
                                type="text"
                                name="agency_responsible"
                                value={formData.agency_responsible}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                العنوان <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="agency_adresse"
                                value={formData.agency_adresse}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.agency_adresse ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.agency_adresse && (
                                <p className="text-red-500 text-xs mt-1">{errors.agency_adresse}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رقم الهاتف <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="agency_tel"
                                value={formData.agency_tel}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.agency_tel ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.agency_tel && (
                                <p className="text-red-500 text-xs mt-1">{errors.agency_tel}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                البريد الإلكتروني <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="agency_email"
                                value={formData.agency_email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.agency_email ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.agency_email && (
                                <p className="text-red-500 text-xs mt-1">{errors.agency_email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الحالة
                            </label>
                            <select
                                name="agency_status"
                                value={formData.agency_status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "جاري الحفظ..." : "تحديث"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 