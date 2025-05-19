import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useHotelStore from "../../store/hotelStore";

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchHotel, updateHotel, loading, error, currentHotel } = useHotelStore();

    const [formData, setFormData] = useState({
        hotel_name: "",
        hotel_city: "",
        hotel_country: "",
        hotel_tel: "",
        hotel_email: "",
        hotel_logo: "",
        hotel_map: "",
        hotel_contact: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHotel = async () => {
            setIsLoading(true);
            const result = await fetchHotel(id);
            setIsLoading(false);

            if (!result.success) {
                navigate("/dashboard/hotels");
            }
        };

        loadHotel();
    }, [id, fetchHotel, navigate]);

    useEffect(() => {
        if (currentHotel) {
            setFormData({
                hotel_name: currentHotel.hotel_name || "",
                hotel_city: currentHotel.hotel_city || "",
                hotel_country: currentHotel.hotel_country || "",
                hotel_tel: currentHotel.hotel_tel || "",
                hotel_email: currentHotel.hotel_email || "",
                hotel_logo: currentHotel.hotel_logo || "",
                hotel_map: currentHotel.hotel_map || "",
                hotel_contact: currentHotel.hotel_contact || "",
            });
        }
    }, [currentHotel]);

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
        if (!formData.hotel_name) newErrors.hotel_name = "اسم الفندق مطلوب";
        if (!formData.hotel_city) newErrors.hotel_city = "المدينة مطلوبة";
        if (!formData.hotel_country) newErrors.hotel_country = "الدولة مطلوبة";
        if (!formData.hotel_tel) newErrors.hotel_tel = "رقم الهاتف مطلوب";
        if (!formData.hotel_email) newErrors.hotel_email = "البريد الإلكتروني مطلوب";
        // Email validation
        if (formData.hotel_email && !/\S+@\S+\.\S+/.test(formData.hotel_email)) {
            newErrors.hotel_email = "يرجى إدخال بريد إلكتروني صحيح";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const result = await updateHotel(id, formData);

        if (result.success) {
            navigate("/dashboard/hotels");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/hotels");
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                جاري تحميل بيانات الفندق...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">تعديل بيانات الفندق</h1>
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
                                اسم الفندق <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="hotel_name"
                                value={formData.hotel_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.hotel_name ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.hotel_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.hotel_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                المدينة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="hotel_city"
                                value={formData.hotel_city}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.hotel_city ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.hotel_city && (
                                <p className="text-red-500 text-xs mt-1">{errors.hotel_city}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الدولة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="hotel_country"
                                value={formData.hotel_country}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.hotel_country ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.hotel_country && (
                                <p className="text-red-500 text-xs mt-1">{errors.hotel_country}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رقم الهاتف <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="hotel_tel"
                                value={formData.hotel_tel}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.hotel_tel ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.hotel_tel && (
                                <p className="text-red-500 text-xs mt-1">{errors.hotel_tel}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                البريد الإلكتروني <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="hotel_email"
                                value={formData.hotel_email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.hotel_email ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.hotel_email && (
                                <p className="text-red-500 text-xs mt-1">{errors.hotel_email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                معلومات الاتصال
                            </label>
                            <input
                                type="text"
                                name="hotel_contact"
                                value={formData.hotel_contact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="اسم الشخص المسؤول أو معلومات اتصال إضافية"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رابط الشعار
                            </label>
                            <input
                                type="text"
                                name="hotel_logo"
                                value={formData.hotel_logo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="https://example.com/logo.png"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                أدخل رابط صورة شعار الفندق
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رابط الخريطة
                            </label>
                            <input
                                type="text"
                                name="hotel_map"
                                value={formData.hotel_map}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="https://maps.google.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                أدخل رابط موقع الفندق على الخريطة (Google Maps مثلا)
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