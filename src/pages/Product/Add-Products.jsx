import React, { useEffect, useState } from "react";
import { Upload, X, Plus, Trash, ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useCurrency } from "../../contexts/CurrencyContext.jsx";
import { useCategories } from "../../hooks/useCategoriesQuery";
import { useBrands } from "../../hooks/useBrandsQuery";
import { useUpload } from "../../hooks/useUpload";
import { api } from "../../lib/axios";
 
export default function AddProduct() {
  const navigate = useNavigate();
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
    specifications: {},
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
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [selectedCategorySpecs, setSelectedCategorySpecs] = useState({});

  // قاعدة بيانات المواصفات حسب الفئة
  const categorySpecifications = {
    "حاسبات": {
      "المعالج": "",
      "الذاكرة": "",
      "التخزين": "",
      "كرت الشاشة": "",
      "الشاشة": "",
      "الوزن": "",
      "البطارية": "",
      "نظام التشغيل": ""
    },
    "شاشات": {
      "الحجم": "",
      "الدقة": "",
      "معدل التحديث": "",
      "نوع اللوحة": "",
      "المنحنى": "",
      "زمن الاستجابة": "",
      "السطوع": "",
      "المنافذ": "",
      "الضمان": "",
      "البلد": "",
      "الأبعاد": "",
      "الوزن": ""
    },
    "كيبوردات": {
      "النوع": "",
      "التوصيل": "",
      "المفاتيح": "",
      "البطارية": "",
      "الوزن": "",
      "الأبعاد": "",
      "التوافق": "",
      "الضمان": "",
      "البلد": "",
      "الإضاءة الخلفية": "",
      "عدد المفاتيح": ""
    },
    "سماعات": {
      "النوع": "",
      "التوصيل": "",
      "البطارية": "",
      "الوزن": "",
      "حجم السماعة": "",
      "التردد": "",
      "المقاومة": "",
      "إلغاء الضوضاء": "",
      "الضمان": "",
      "البلد": "",
      "الشحن": "",
      "الشحن السريع": ""
    },
    "فأرات": {
      "النوع": "",
      "التوصيل": "",
      "المستشعر": "",
      "الدقة": "",
      "الوزن": "",
      "الأزرار": "",
      "الضمان": "",
      "البلد": "",
      "الكابل": "",
      "الأقدام": ""
    },
    "كراسي": {
      "المادة": "",
      "اللون": "",
      "الوزن": "",
      "الأبعاد": "",
      "الوزن الأقصى": "",
      "الارتفاع": "",
      "الضمان": "",
      "المميزات": "",
      "البلد": "",
      "الانحناء": ""
    },
    "هواتف": {
      "الشاشة": "",
      "المعالج": "",
      "التخزين": "",
      "الذاكرة": "",
      "الكاميرا": "",
      "البطارية": "",
      "الوزن": "",
      "الأبعاد": "",
      "الضمان": "",
      "البلد": "",
      "الألوان": "",
      "التوصيل": ""
    }
  };

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

  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // إذا تم تغيير الفئة، قم بتحديث المواصفات
    if (name === 'categoryId') {
      const selectedCategory = categories.find(cat => cat.id === value);
      if (selectedCategory && categorySpecifications[selectedCategory.name]) {
        setSelectedCategorySpecs(categorySpecifications[selectedCategory.name]);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          specifications: categorySpecifications[selectedCategory.name]
        }));
      } else {
        setSelectedCategorySpecs({});
        setFormData(prev => ({
          ...prev,
          [name]: value,
          specifications: {}
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSpecificationChange = (specKey, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey]: value
      }
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
      // الصورة الأولى (index 0) هي الصورة الأساسية دائماً
      const newProduct = {
        name: formData.title,  // مطلوب
        title: formData.title, // اختياري
        description: formData.description,
        price: parseFloat(formData.price), // مطلوب
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        image: imageUrls[0] || '', // الصورة الأولى هي الأساسية دائماً
        images: imageUrls, // جميع URLs من Cloudflare
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
      const response = await api.createProduct(newProduct);

      if (!response.data.success) {
        console.error("API Error Response:", response.data);
        throw new Error(`HTTP error! status: ${response.status} - ${response.data.message || 'Unknown error'}`);
      }

      const result = response.data;
      console.log("Product created successfully:", result);

      toast.success("تم إضافة المنتج بنجاح!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        categoryId: "",
        brandId: "",
        specifications: {},
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
      setProductImages([]);
      setImagePreviews([]);
      setNewSpecKey("");
      setNewSpecValue("");
      setSelectedCategorySpecs({});

      // Navigate to products list after a short delay
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("حدث خطأ في إضافة المنتج", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="min-h-screen !bg-[#0A0A0A]" dir="rtl">
      {/* Header */}
      <div className="relative backdrop-blur-sm border-b bg-[#1A1A2E]/30 border-[#2C6D90]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#2C6D90]/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#2C6D90] rounded-xl sm:rounded-2xl">
                <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">إضافة منتج جديد</h1>
                <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">أضف منتج جديد إلى المخزن</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/products'}
                className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 hover:scale-105 w-full lg:w-auto"
              >
                <span className="font-semibold text-sm sm:text-base lg:text-lg">العودة للمنتجات</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="px-8 py-8 bg-gradient-to-r from-[#0C0C0E] via-[#0F1B24] to-[#11212D]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#F9F3EF]/5 backdrop-blur-sm border border-[#2C6D90]/20 rounded-3xl overflow-hidden shadow-2xl">
            {/* Form Container */}
            <div className="p-8 space-y-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Basic Information Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 pb-4 border-b border-[#2C6D90]/20">
                    <div className="p-3 bg-[#2C6D90]/20 rounded-2xl border border-[#2C6D90]/30">
                      <Save className="h-6 w-6 text-[#2C6D90]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#F9F3EF]">المعلومات الأساسية</h2>
                      <p className="text-[#F9F3EF]/70 mt-1">أدخل تفاصيل المنتج الأساسية</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="title" className="text-lg font-semibold text-[#F9F3EF] flex items-center gap-2 mb-3">
                        اسم المنتج
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        name="title"
                        className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                        placeholder="أدخل اسم المنتج"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="brand" className="text-lg font-semibold text-[#F9F3EF] flex items-center gap-2 mb-3">
                        الماركة
                        <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="brandId"
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                        required
                      >
                        <option value="">اختر الماركة</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="category" className="text-lg font-semibold text-[#F9F3EF] flex items-center gap-2 mb-3">
                        الفئة
                        <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                        required
                      >
                        <option value="">اختر الفئة</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="price" className="text-lg font-semibold text-[#F9F3EF] flex items-center gap-2 mb-3">
                        السعر ({getCurrencySymbol()})
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        name="price"
                        className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                        placeholder="أدخل السعر"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="originalPrice" className="text-lg font-semibold text-[#F9F3EF] flex items-center gap-2 mb-3">
                        السعر الأصلي ({getCurrencySymbol()})
                      </label>
                      <input
                        type="number"
                        id="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        name="originalPrice"
                        className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                        placeholder="أدخل السعر الأصلي (اختياري)"
                      />
                    </div>

                    <div>
                      <label htmlFor="stock" className="text-lg font-semibold text-[#F9F3EF] flex items-center gap-2 mb-3">
                        الكمية في المخزن
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        id="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        name="stock"
                        className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                        placeholder="أدخل الكمية"
                        required
                      />
                    </div>

                  </div>

                  <div className="mt-6">
                    <label htmlFor="description" className="text-lg font-semibold text-[#F9F3EF] flex items-center gap-2 mb-3">
                      الوصف
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl resize-none"
                      placeholder="أدخل وصف المنتج"
                      required
                    />
                  </div>

                  {/* Product Features */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-[#F9F3EF] mb-6">
                      خصائص المنتج
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <label className="flex items-center space-x-3 space-x-reverse p-4 bg-[#F9F3EF]/5 rounded-2xl border border-[#2C6D90]/20 hover:bg-[#F9F3EF]/10 transition-all duration-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="w-6 h-6 text-[#2C6D90] bg-transparent border-[#2C6D90]/40 rounded focus:ring-[#2C6D90] focus:ring-2"
                        />
                        <span className="text-lg font-medium text-[#F9F3EF]">
                          منتج جديد
                        </span>
                      </label>

                      <label className="flex items-center space-x-3 space-x-reverse p-4 bg-[#F9F3EF]/5 rounded-2xl border border-[#2C6D90]/20 hover:bg-[#F9F3EF]/10 transition-all duration-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isBestSeller"
                          checked={formData.isBestSeller}
                          onChange={handleInputChange}
                          className="w-6 h-6 text-[#2C6D90] bg-transparent border-[#2C6D90]/40 rounded focus:ring-[#2C6D90] focus:ring-2"
                        />
                        <span className="text-lg font-medium text-[#F9F3EF]">
                          الأكثر مبيعاً
                        </span>
                      </label>

                      <label className="flex items-center space-x-3 space-x-reverse p-4 bg-[#F9F3EF]/5 rounded-2xl border border-[#2C6D90]/20 hover:bg-[#F9F3EF]/10 transition-all duration-300 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="w-6 h-6 text-[#2C6D90] bg-transparent border-[#2C6D90]/40 rounded focus:ring-[#2C6D90] focus:ring-2"
                        />
                        <span className="text-lg font-medium text-[#F9F3EF]">
                          منتج مميز
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Specifications Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 pb-4 border-b border-[#2C6D90]/20">
                    <div className="p-3 bg-[#2C6D90]/20 rounded-2xl border border-[#2C6D90]/30">
                      <Save className="h-6 w-6 text-[#2C6D90]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#F9F3EF]">المواصفات التقنية</h2>
                      <p className="text-[#F9F3EF]/70 mt-1">
                        {Object.keys(selectedCategorySpecs).length > 0
                          ? `مواصفات مخصصة لـ ${categories.find(cat => cat.id === formData.categoryId)?.name || 'الفئة المختارة'}`
                          : 'اختر فئة أولاً لعرض المواصفات المناسبة'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Display Category-Specific Specifications */}
                  {Object.keys(selectedCategorySpecs).length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.keys(selectedCategorySpecs).map((specKey) => (
                          <div key={specKey}>
                            <label className="text-lg font-semibold text-[#F9F3EF]/70 mb-3">
                              {specKey}
                            </label>
                            <input
                              type="text"
                              value={formData.specifications[specKey] || ''}
                              onChange={(e) => handleSpecificationChange(specKey, e.target.value)}
                              className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                              placeholder={`أدخل ${specKey.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-6 bg-[#F9F3EF]/5 rounded-3xl border border-[#2C6D90]/20">
                        <div className="w-16 h-16 bg-[#2C6D90]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Save className="h-8 w-8 text-[#2C6D90]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#F9F3EF] mb-2">اختر فئة أولاً</h3>
                        <p className="text-[#F9F3EF]/70">
                          بعد اختيار الفئة، ستظهر المواصفات المناسبة لتلك الفئة
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Add Custom Specifications */}
                  {Object.keys(selectedCategorySpecs).length > 0 && (
                    <div className="space-y-6 border-t border-[#2C6D90]/20 pt-8">
                      <h3 className="text-xl font-bold text-[#F9F3EF]">إضافة مواصفات إضافية</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-lg font-semibold text-[#F9F3EF]/70 mb-3">
                            اسم المواصفة الإضافية
                          </label>
                          <input
                            type="text"
                            value={newSpecKey}
                            onChange={(e) => setNewSpecKey(e.target.value)}
                            className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                            placeholder="مثال: الضمان، الشحن، إلخ"
                          />
                        </div>
                        <div>
                          <label className="text-lg font-semibold text-[#F9F3EF]/70 mb-3">
                            القيمة
                          </label>
                          <input
                            type="text"
                            value={newSpecValue}
                            onChange={(e) => setNewSpecValue(e.target.value)}
                            className="w-full px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                            placeholder="مثال: 3 سنوات، مجاني، إلخ"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSpecification}
                        className="px-8 py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] rounded-2xl hover:shadow-lg hover:shadow-[#2C6D90]/25 transition-all duration-300 font-semibold text-lg hover:scale-105"
                      >
                        إضافة المواصفة الإضافية
                      </button>
                    </div>
                  )}
                </div>

                {/* Tags Section */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 pb-4 border-b border-[#2C6D90]/20">
                    <div className="p-3 bg-[#2C6D90]/20 rounded-2xl border border-[#2C6D90]/30">
                      <Save className="h-6 w-6 text-[#2C6D90]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#F9F3EF]">العلامات (Tags)</h2>
                      <p className="text-[#F9F3EF]/70 mt-1">أضف علامات لتصنيف المنتج</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-6 py-5 bg-[#F9F3EF]/5 border border-[#2C6D90]/30 rounded-2xl text-[#F9F3EF] placeholder-[#F9F3EF]/40 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-xl"
                        placeholder="أدخل علامة جديدة واضغط Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-8 py-5 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] rounded-2xl hover:shadow-lg hover:shadow-[#2C6D90]/25 transition-all duration-300 font-semibold text-lg hover:scale-105"
                      >
                        إضافة
                      </button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-3 px-4 py-3 bg-[#F9F3EF]/5 text-[#F9F3EF] border border-[#2C6D90]/30 rounded-2xl text-lg font-medium hover:bg-[#F9F3EF]/10 transition-all duration-300"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(index)}
                              className="text-red-400 hover:text-red-300 transition-colors hover:scale-110"
                            >
                              <X size={18} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Images Upload */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 pb-4 border-b border-nsr-primary/20">
                    <div className="p-3 bg-[#2C6D90]/20 rounded-2xl border border-[#2C6D90]/30">
                      <Upload className="h-6 w-6 text-[#2C6D90]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#F9F3EF]">صور المنتج (حتى 5 صور)</h2>
                      <p className="text-[#F9F3EF]/70 mt-1">
                        ارفع صور عالية الجودة للمنتج
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>الصورة الأولى ستكون الأساسية وتظهر في قائمة المنتجات</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {imagePreviews.length === 0 ? (
                      <div className="relative border-2 border-dashed rounded-3xl py-20 px-6 transition-all duration-300 bg-[#F9F3EF]/5 hover:bg-[#F9F3EF]/10 cursor-pointer group border-[#2C6D90]/30 hover:border-[#2C6D90]/50">
                        <input
                          type="file"
                          id="product-images"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                        <label htmlFor="product-images" className="cursor-pointer w-full">
                          <div className="text-center space-y-6">
                            <div className="mx-auto w-24 h-24 bg-[#2C6D90]/20 rounded-3xl flex items-center justify-center group-hover:bg-[#2C6D90]/30 transition-all duration-300 group-hover:scale-110 border border-[#2C6D90]/20">
                              <Upload className="h-12 w-12 text-[#2C6D90] group-hover:text-[#2C6D90] transition-colors" />
                            </div>
                            <div className="space-y-3">
                              <p className="text-2xl font-bold text-[#F9F3EF]">
                                انقر لرفع الصور أو اسحبها هنا
                              </p>
                              <p className="text-[#F9F3EF]/70 text-lg">
                                PNG, JPG, GIF حتى 10 ميجابايت
                              </p>
                              <p className="text-[#F9F3EF]/50 text-sm">
                                الحد الأقصى: 5 صور
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className={`relative overflow-hidden rounded-3xl border-2 shadow-2xl transition-all duration-300 ${index === 0
                              ? 'border-yellow-500/50 shadow-yellow-500/20 ring-2 ring-yellow-500/30'
                              : 'border-[#2C6D90]/30 shadow-[#2C6D90]/10'
                              }`}>
                              <img
                                src={preview}
                                alt={`Product ${index + 1}`}
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                              {/* Cover Image Badge */}
                              {index === 0 && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                  الصورة الأساسية
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(index)}
                                className="p-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {imagePreviews.length < 5 && (
                          <div className="border-2 border-dashed rounded-3xl h-40 flex items-center justify-center cursor-pointer transition-all duration-300 bg-[#F9F3EF]/5 hover:bg-[#F9F3EF]/10 border-[#2C6D90]/30 hover:border-[#2C6D90]/50">
                            <input
                              type="file"
                              id="add-more-images"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                            />
                            <label htmlFor="add-more-images" className="cursor-pointer text-center">
                              <Plus className="mx-auto h-10 w-10 text-[#2C6D90]" />
                              <p className="text-sm mt-2 text-slate-400">
                                إضافة المزيد
                              </p>
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-end pt-8 border-t border-[#2C6D90]/20">
                  <button
                    type="button"
                    className="px-8 py-4 border-2 border-[#2C6D90]/40 text-[#F9F3EF]/80 rounded-2xl hover:bg-[#F9F3EF]/5 hover:border-[#2C6D90]/60 transition-all duration-300 font-semibold text-lg hover:scale-105"
                  >
                    إلغاء
                  </button>

                  <motion.button
                    type="submit"
                    disabled={uploading}
                    whileHover={{ scale: uploading ? 1 : 1.05 }}
                    whileTap={{ scale: uploading ? 1 : 0.95 }}
                    className={`relative px-10 py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] rounded-2xl transition-all duration-300 font-semibold shadow-lg shadow-[#2C6D90]/25 hover:shadow-xl hover:shadow-[#2C6D90]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 hover:scale-105 text-lg ${uploading ? 'cursor-not-allowed' : ''}`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري رفع الصور...
                      </>
                    ) : (
                      <>
                        <Save className="h-6 w-6" />
                        إضافة المنتج الجديد
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-6">
        <div className="text-center">
          <p className="text-[#F9F3EF]/50 text-sm">© 2025 نظام إدارة المنتجات المتطور - تم التصميم بعناية فائقة</p>
        </div>
      </div>
    </div>
  );
}
