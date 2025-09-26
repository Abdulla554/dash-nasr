import React, { useEffect, useState } from "react";
import { Upload, X, Plus, Trash, ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion as _motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useCurrency } from "../../contexts/CurrencyContext.jsx";
import { useCategories } from "../../hooks/useCategoriesQuery";
import { useBrands } from "../../hooks/useBrandsQuery";
import { useUpload } from "../../hooks/useUpload";

export default function AddProduct() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { getCurrencySymbol } = useCurrency();

  // Get categories and brands
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { uploadProductImages, uploading } = useUpload();

  const categories = categoriesData || [];
  const brands = brandsData || [];

  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    brandId: "",
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
    isFeatured: false,
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
      console.log("Processing file:", file.name, file.type, file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
        setProductImages(prev => {
          const newImages = [...prev, file];
          console.log("Updated productImages:", newImages);
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };
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

    if (imagePreviews.length === 0 || productImages.length === 0) {
      toast.error("يرجى رفع صورة واحدة على الأقل", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.price || !formData.categoryId || !formData.brandId) {
      toast.error("يرجى ملء جميع الحقول المطلوبة", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // 1. رفع جميع الصور إلى Cloudflare أولاً
      toast.info("جاري رفع الصور إلى Cloudflare...", {
        position: "top-right",
        autoClose: 2000,
      });

      console.log("Product images to upload:", productImages);
      const uploadedImages = await uploadProductImages(productImages);
      console.log("Uploaded images response:", uploadedImages);

      // استخراج URLs من الاستجابة
      const imageUrls = uploadedImages.map(img => {
        console.log("Processing image:", img);
        return img.url || img;
      });
      console.log("Final image URLs:", imageUrls);

      // 2. Clean up the data before sending
      const cleanSpecifications = {};
      Object.keys(formData.specifications).forEach(key => {
        if (formData.specifications[key] && formData.specifications[key].trim() !== '') {
          cleanSpecifications[key] = formData.specifications[key];
        }
      });

      // 3. إنشاء المنتج مع URLs من Cloudflare
      // الصورة الأولى هي الرئيسية، والباقي صور إضافية
      const newProduct = {
        name: formData.title,  // مطلوب
        title: formData.title, // اختياري
        description: formData.description,
        price: parseFloat(formData.price), // مطلوب
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        image: imageUrls[0] || '', // URL من Cloudflare
        images: imageUrls, // URLs من Cloudflare
        stock: parseInt(formData.stock) || 0,
        isActive: true,
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        isFeatured: formData.isFeatured,
        specifications: cleanSpecifications,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        categoryId: formData.categoryId, // Use real category ID
        brandId: formData.brandId         // Use real brand ID
      };

      console.log("Creating product with Cloudflare URLs:", newProduct);

      // 4. API call to create product
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log("Product created successfully:", result);

      toast.success("تم إضافة المنتج بنجاح!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate to products list
      navigate('/products');
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("حدث خطأ في إضافة المنتج", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
                  <select
                    id="brandId"
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    required
                  >
                    <option value="">اختر الماركة</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                    الفئة *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    required
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
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

              {/* Product Features */}
              <div className="mt-6">
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-gray-900'}`}>
                  خصائص المنتج
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="checkbox"
                      name="isNew"
                      checked={formData.isNew}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-nsr-accent bg-gray-100 border-gray-300 rounded focus:ring-nsr-accent focus:ring-2"
                    />
                    <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                      منتج جديد
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-nsr-accent bg-gray-100 border-gray-300 rounded focus:ring-nsr-accent focus:ring-2"
                    />
                    <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                      الأكثر مبيعاً
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-nsr-accent bg-gray-100 border-gray-300 rounded focus:ring-nsr-accent focus:ring-2"
                    />
                    <span className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-gray-700'}`}>
                      منتج مميز
                    </span>
                  </label>
                </div>
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

            {/* Tags Section */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-gray-900'}`}>
                العلامات (Tags)
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                    placeholder="أدخل علامة جديدة واضغط Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 bg-gradient-to-r from-nsr-accent to-nsr-primary text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    إضافة
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-nsr-accent/20 to-nsr-primary/20 text-nsr-primary border border-nsr-accent/30 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                disabled={uploading}
                whileHover={{ scale: uploading ? 1 : 1.05 }}
                whileTap={{ scale: uploading ? 1 : 0.95 }}
                className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-white shadow-lg transition-all duration-500 ${uploading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-nsr-accent to-nsr-primary shadow-nsr-accent/25 hover:shadow-xl hover:shadow-nsr-accent/40'
                  }`}
              >
                {uploading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold text-lg">جاري رفع الصور...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6 transition-all duration-500 group-hover:rotate-12" />
                    <span className="font-semibold text-lg">إضافة المنتج</span>
                  </>
                )}
              </_motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
