import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePackageStore from "../../store/packageStore";

export default function EditPackage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchPackage, updatePackage, loading, error, currentPackage } = usePackageStore();

    const [formData, setFormData] = useState({
        package_name: "",
        package_photo: "",
        package_description: "",
        package_price: "",
        package_status: "active",
        package_discount: "",
        package_availability: "",
        package_end: "",
        package_discount_type: "percentage",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPackage = async () => {
            setIsLoading(true);
            const result = await fetchPackage(id);
            setIsLoading(false);

            if (!result.success) {
                navigate("/dashboard/packages");
            }
        };

        loadPackage();
    }, [id, fetchPackage, navigate]);

    useEffect(() => {
        if (currentPackage) {
            setFormData({
                package_name: currentPackage.package_name || "",
                package_photo: currentPackage.package_photo || "",
                package_description: currentPackage.package_description || "",
                package_price: currentPackage.package_price?.toString() || "",
                package_status: currentPackage.package_status || "active",
                package_discount: currentPackage.package_discount?.toString() || "",
                package_availability: currentPackage.package_availability || "",
                package_end: currentPackage.package_end || "",
                package_discount_type: currentPackage.package_discount_type || "percentage",
            });
        }
    }, [currentPackage]);

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
        if (!formData.package_name) newErrors.package_name = "اسم الباقة مطلوب";
        if (!formData.package_description) newErrors.package_description = "وصف الباقة مطلوب";
        if (!formData.package_price) newErrors.package_price = "سعر الباقة مطلوب";
        if (formData.package_price && isNaN(formData.package_price)) {
            newErrors.package_price = "يرجى إدخال سعر صحيح";
        }
        if (formData.package_discount && isNaN(formData.package_discount)) {
            newErrors.package_discount = "يرجى إدخال قيمة خصم صحيحة";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Format the price and discount as numbers
        const packageData = {
            ...formData,
            package_price: formData.package_price ? parseFloat(formData.package_price) : 0,
            package_discount: formData.package_discount ? parseFloat(formData.package_discount) : 0,
        };

        const result = await updatePackage(id, packageData);

        if (result.success) {
            navigate("/dashboard/packages");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/packages");
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الباقة...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تعديل بيانات الباقة</h1>
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
                                اسم الباقة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="package_name"
                                value={formData.package_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.package_name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.package_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.package_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                صورة الباقة
                            </label>
                            <input
                                type="text"
                                name="package_photo"
                                value={formData.package_photo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                أدخل رابط صورة الباقة
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                وصف الباقة <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="package_description"
                                value={formData.package_description}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.package_description ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.package_description && (
                                <p className="text-red-500 text-xs mt-1">{errors.package_description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                سعر الباقة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="package_price"
                                value={formData.package_price}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.package_price ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.package_price && (
                                <p className="text-red-500 text-xs mt-1">{errors.package_price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                قيمة الخصم
                            </label>
                            <input
                                type="text"
                                name="package_discount"
                                value={formData.package_discount}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.package_discount ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.package_discount && (
                                <p className="text-red-500 text-xs mt-1">{errors.package_discount}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نوع الخصم
                            </label>
                            <select
                                name="package_discount_type"
                                value={formData.package_discount_type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="percentage">نسبة مئوية (%)</option>
                                <option value="fixed">قيمة ثابتة</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الحالة
                            </label>
                            <select
                                name="package_status"
                                value={formData.package_status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                تاريخ الإتاحة
                            </label>
                            <input
                                type="date"
                                name="package_availability"
                                value={formData.package_availability}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                تاريخ الانتهاء
                            </label>
                            <input
                                type="date"
                                name="package_end"
                                value={formData.package_end}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
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