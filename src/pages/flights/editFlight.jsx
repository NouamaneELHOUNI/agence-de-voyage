import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFlightStore from "../../store/flightStore";

export default function EditFlight() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchFlight, updateFlight, loading, error, currentFlight } = useFlightStore();

    const [formData, setFormData] = useState({
        vols_name: "",
        vols_company: "",
        vols_price_package: "",
        vols_price_alone: "",
        vols_staus: "available",
        vols_seats_package: "",
        vols_logo: "",
    });

    const [errors, setErrors] = useState({});
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

    useEffect(() => {
        if (currentFlight) {
            setFormData({
                vols_name: currentFlight.vols_name || "",
                vols_company: currentFlight.vols_company || "",
                vols_price_package: currentFlight.vols_price_package || "",
                vols_price_alone: currentFlight.vols_price_alone || "",
                vols_staus: currentFlight.vols_staus || "available",
                vols_seats_package: currentFlight.vols_seats_package || "",
                vols_logo: currentFlight.vols_logo || "",
            });
        }
    }, [currentFlight]);

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
        if (!formData.vols_name) newErrors.vols_name = "اسم الرحلة مطلوب";
        if (!formData.vols_company) newErrors.vols_company = "شركة الطيران مطلوبة";
        if (!formData.vols_price_package) newErrors.vols_price_package = "سعر الباقة مطلوب";
        if (!formData.vols_price_alone) newErrors.vols_price_alone = "سعر الفرد مطلوب";
        if (!formData.vols_seats_package) newErrors.vols_seats_package = "عدد المقاعد مطلوب";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const result = await updateFlight(id, formData);

        if (result.success) {
            navigate("/dashboard/flights");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/flights");
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الرحلة...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تعديل رحلة</h1>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                اسم الرحلة
                            </label>
                            <input
                                type="text"
                                name="vols_name"
                                value={formData.vols_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.vols_name ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.vols_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.vols_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                شركة الطيران
                            </label>
                            <input
                                type="text"
                                name="vols_company"
                                value={formData.vols_company}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.vols_company ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.vols_company && (
                                <p className="text-red-500 text-xs mt-1">{errors.vols_company}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سعر الباقة
                            </label>
                            <input
                                type="number"
                                name="vols_price_package"
                                value={formData.vols_price_package}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.vols_price_package ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.vols_price_package && (
                                <p className="text-red-500 text-xs mt-1">{errors.vols_price_package}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سعر الفرد
                            </label>
                            <input
                                type="number"
                                name="vols_price_alone"
                                value={formData.vols_price_alone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.vols_price_alone ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.vols_price_alone && (
                                <p className="text-red-500 text-xs mt-1">{errors.vols_price_alone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                عدد المقاعد
                            </label>
                            <input
                                type="number"
                                name="vols_seats_package"
                                value={formData.vols_seats_package}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.vols_seats_package ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.vols_seats_package && (
                                <p className="text-red-500 text-xs mt-1">{errors.vols_seats_package}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الحالة
                            </label>
                            <select
                                name="vols_staus"
                                value={formData.vols_staus}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="available">متاح</option>
                                <option value="unavailable">غير متاح</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رابط الشعار
                            </label>
                            <input
                                type="text"
                                name="vols_logo"
                                value={formData.vols_logo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="https://example.com/logo.png"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                أدخل رابط الصورة لشعار شركة الطيران
                            </p>
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