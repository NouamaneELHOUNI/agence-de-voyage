import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useServiceStore from "../../store/serviceStore";

export default function AddService() {
    const { createService, loading, error } = useServiceStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        service_name: "",
        service_description: "",
        service_price_alone: "",
        service_price_package: "",
        service_photo: "",
        service_status: "active",
    });

    const [errors, setErrors] = useState({});

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
        if (!formData.service_name) newErrors.service_name = "اسم الخدمة مطلوب";
        if (!formData.service_description) newErrors.service_description = "وصف الخدمة مطلوب";
        if (!formData.service_price_alone) newErrors.service_price_alone = "سعر الخدمة المنفرد مطلوب";
        if (formData.service_price_alone && isNaN(formData.service_price_alone)) {
            newErrors.service_price_alone = "يرجى إدخال سعر صحيح";
        }
        if (formData.service_price_package && isNaN(formData.service_price_package)) {
            newErrors.service_price_package = "يرجى إدخال سعر صحيح";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Format the prices as numbers
        const serviceData = {
            ...formData,
            service_price_alone: formData.service_price_alone ? parseFloat(formData.service_price_alone) : 0,
            service_price_package: formData.service_price_package ? parseFloat(formData.service_price_package) : 0,
        };

        const result = await createService(serviceData);

        if (result.success) {
            navigate("/dashboard/services");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/services");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">إضافة خدمة جديدة</h1>
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
                                اسم الخدمة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="service_name"
                                value={formData.service_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.service_name ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.service_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.service_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                صورة الخدمة
                            </label>
                            <input
                                type="text"
                                name="service_photo"
                                value={formData.service_photo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                أدخل رابط صورة الخدمة
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                وصف الخدمة <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="service_description"
                                value={formData.service_description}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md ${errors.service_description ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.service_description && (
                                <p className="text-red-500 text-xs mt-1">{errors.service_description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سعر الخدمة المنفرد <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="service_price_alone"
                                value={formData.service_price_alone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.service_price_alone ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.service_price_alone && (
                                <p className="text-red-500 text-xs mt-1">{errors.service_price_alone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سعر الخدمة ضمن الباقة
                            </label>
                            <input
                                type="text"
                                name="service_price_package"
                                value={formData.service_price_package}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.service_price_package ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.service_price_package && (
                                <p className="text-red-500 text-xs mt-1">{errors.service_price_package}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الحالة
                            </label>
                            <select
                                name="service_status"
                                value={formData.service_status}
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
                            {loading ? "جاري الحفظ..." : "إضافة"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 