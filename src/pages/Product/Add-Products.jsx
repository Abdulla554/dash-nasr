import React, { useEffect, useState } from "react";
import { Upload, X, Plus, Trash, ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion as _motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useCurrency } from "../../contexts/CurrencyContext.jsx";

export default function AddProduct() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { getCurrencySymbol } = useCurrency();

  const [, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "laptops",
    brand: "",
    specifications: {
      processor: "",
      ram: "",
      storage: "",
      graphics: "",
      display: "",
      weight: "",
      battery: "",
      os: ""
    },
    rating: 4.5,
    reviews: 0,
    stock: 0,
    isNew: true,
    isBestSeller: false,
    tags: [],
    warranty: "",
    shipping: ""
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.error("يمكنك رفع 5 صور كحد أقصى", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
        setProductImages(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  // const handleAddTag = () => {
  //   const newTag = prompt("أدخل العلامة الجديدة:");
  //   if (newTag && newTag.trim()) {
  //     setFormData(prev => ({
  //       ...prev,
  //       tags: [...prev.tags, newTag.trim()]
  //     }));
  //   }
  // };

  // const handleRemoveTag = (index) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     tags: prev.tags.filter((_, i) => i !== index)
  //   }));
  // };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imagePreviews.length === 0) {
      toast.error("يرجى رفع صورة واحدة على الأقل", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // في التطبيق الحقيقي، هنا ستكون API call
    const newProduct = {
      id: Date.now(), // ID مؤقت
      ...formData,
      images: imagePreviews,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock),
      reviews: parseInt(formData.reviews),
      rating: parseFloat(formData.rating)
    };

    console.log("New Product:", newProduct);

    toast.success("تم إضافة المنتج بنجاح!", {
      position: "top-right",
      autoClose: 3000,
    });

    setTimeout(() => {
      navigate("/products");
    }, 2000);
  };
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-nsr-dark' : 'bg-gray-50'}`} dir="rtl">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className={`relative backdrop-blur-sm border-b transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/20' : 'bg-white/80 border-gray-200 shadow-sm'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-nsr-accent/10 to-transparent"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-r from-nsr-accent to-nsr-primary rounded-2xl">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-black'}`}>
                    إضافة منتج جديد
                  </h1>
                  <p className={`mt-2 text-lg transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-600'}`}>أضف منتج جديد إلى المخزن</p>
                </div>
              </div>

              <Link to="/products">
                <_motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)'
                  }}
                >
                  <ArrowLeft className={`w-5 h-5 transition-colors duration-300 ${isDark ? 'text-nsr-accent group-hover:text-nsr-primary' : 'text-black group-hover:text-gray-800'}`} />
                  <span className={`font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-accent group-hover:text-nsr-light' : 'text-black group-hover:text-gray-800'}`}>
                    العودة للمنتجات
                  </span>
                </_motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={`backdrop-blur-sm border rounded-2xl p-8 mt-8 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30 border-nsr-primary/20' : 'bg-white/70 border-gray-200 shadow-sm'}`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-gray-900'}`}>
                المعلومات الأساسية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    name="title"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل اسم المنتج"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="brand" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    الماركة *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    name="brand"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل الماركة"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    الفئة *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    required
                  >
                    <option value="laptops">لابتوبات</option>
                    <option value="accessories">إكسسوارات</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    السعر ({getCurrencySymbol()}) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    name="price"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل السعر"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="originalPrice" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    السعر الأصلي ({getCurrencySymbol()})
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    name="originalPrice"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل السعر الأصلي (اختياري)"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    الكمية في المخزن *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    name="stock"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل الكمية"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                  الوصف *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                  placeholder="أدخل وصف المنتج"
                  required
                />
              </div>
            </div>

            {/* Specifications Section */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-gray-900'}`}>
                المواصفات التقنية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="processor" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    المعالج
                  </label>
                  <input
                    type="text"
                    id="processor"
                    value={formData.specifications.processor}
                    onChange={handleSpecificationChange}
                    name="processor"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل نوع المعالج"
                  />
                </div>

                <div>
                  <label htmlFor="ram" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    الذاكرة
                  </label>
                  <input
                    type="text"
                    id="ram"
                    value={formData.specifications.ram}
                    onChange={handleSpecificationChange}
                    name="ram"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل حجم الذاكرة"
                  />
                </div>

                <div>
                  <label htmlFor="storage" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    التخزين
                  </label>
                  <input
                    type="text"
                    id="storage"
                    value={formData.specifications.storage}
                    onChange={handleSpecificationChange}
                    name="storage"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل مساحة التخزين"
                  />
                </div>

                <div>
                  <label htmlFor="graphics" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    كرت الشاشة
                  </label>
                  <input
                    type="text"
                    id="graphics"
                    value={formData.specifications.graphics}
                    onChange={handleSpecificationChange}
                    name="graphics"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل نوع كرت الشاشة"
                  />
                </div>
              </div>
            </div>

            {/* Images Upload */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-gray-900'}`}>
                صور المنتج (حتى 5 صور)
              </h2>
              <div>
                {imagePreviews.length === 0 ? (
                  <div className={`relative border-2 border-dashed rounded-xl py-16 px-6 transition-all duration-300 flex items-center justify-center cursor-pointer ${isDark ? 'border-nsr-primary/40 hover:border-nsr-accent bg-nsr-secondary/20' : 'border-gray-300 hover:border-nsr-accent bg-gray-50'}`}>
                    <input
                      type="file"
                      id="product-images"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <label htmlFor="product-images" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className={`mx-auto h-12 w-12 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-500'}`} />
                        <div className={`mt-4 text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-600'}`}>
                          <span className="hover:underline">اضغط لرفع الصور</span>
                          <p className="mt-1">أو اسحب وأفلت الصور هنا</p>
                        </div>
                        <p className={`text-xs mt-2 transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-500'}`}>
                          PNG, JPG, GIF حتى 10MB لكل صورة
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 5 && (
                      <div className={`border-2 border-dashed rounded-xl h-32 flex items-center justify-center cursor-pointer transition-all duration-300 ${isDark ? 'border-nsr-primary/40 hover:border-nsr-accent bg-nsr-secondary/20' : 'border-gray-300 hover:border-nsr-accent bg-gray-50'}`}>
                        <input
                          type="file"
                          id="add-more-images"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                        <label htmlFor="add-more-images" className="cursor-pointer text-center">
                          <Plus className={`mx-auto h-8 w-8 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-500'}`} />
                          <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-500'}`}>
                            إضافة المزيد
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center md:justify-end pt-6">
              <_motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-nsr-accent to-nsr-primary text-white shadow-lg shadow-nsr-accent/25 transition-all duration-500 hover:shadow-xl hover:shadow-nsr-accent/40"
              >
                <Save className="h-6 w-6 transition-all duration-500 group-hover:rotate-12" />
                <span className="font-semibold text-lg">إضافة المنتج</span>
              </_motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
