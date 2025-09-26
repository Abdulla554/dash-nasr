import React, { useState } from "react";
import {
  Upload,
  X,
  ArrowRight,
  Save,
  Image,
  CheckCircle,

  Plus,
  AlertCircle,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCreateCategory } from "../../hooks/useCategoriesQuery";
import { useUpload } from "../../hooks/useUpload";
import { toast } from "react-toastify";

export default function LuxuryAddCategoryPage() {
  const [, setCategorieImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", // Changed from title to name
    description: "",
  });

  // Add the create category mutation
  const createCategoryMutation = useCreateCategory();
  const { uploadCategoryImage } = useUpload();

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم الفئة مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear image error when user selects an image
      setErrors(prev => ({ ...prev, image: null }));

      setIsCompressing(true);

      // Simulate compression delay
      setTimeout(() => {
        setCategorieImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setIsCompressing(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  const handleDeleteImage = () => {
    setCategorieImage(null);
    setImagePreview(null);
    setErrors(prev => ({ ...prev, image: "صورة الفئة مطلوبة" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";

      // رفع الصورة إلى Cloudflare إذا كانت موجودة
      if (imagePreview) {
        toast.info("جاري رفع الصورة إلى Cloudflare...", {
          position: "top-center",
          rtl: true,
          theme: "colored",
          autoClose: 2000,
        });

        // تحويل base64 إلى File object للرفع
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const file = new File([blob], 'category-image.jpg', { type: blob.type });

        const uploadedImage = await uploadCategoryImage(file);
        imageUrl = uploadedImage.url || uploadedImage;
        console.log("Uploaded category image:", uploadedImage);
      }

      const categoryData = {
        name: formData.name,
        description: formData.description || "",
        image: imageUrl // URL من Cloudflare
      };

      console.log("Creating category:", categoryData);

      await createCategoryMutation.mutateAsync(categoryData);

      toast.success("تم إضافة الفئة بنجاح!");

      // Reset form
      setFormData({ name: "", description: "" });
      setImagePreview(null);
      setCategorieImage(null);

    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("حدث خطأ أثناء إضافة الفئة");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-nsr-dark" dir="rtl">
      {/* Header */}
      <div className="relative bg-nsr-secondary/50 backdrop-blur-sm border-b border-nsr-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-nsr-accent/10 to-nsr-secondary/10"></div>
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-nsr-elegant rounded-2xl shadow-lg shadow-nsr-accent/25">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-nsr-light">
                  إضافة فئة جديدة
                </h1>
                <p className="text-nsr-light-200 mt-2 text-lg">أضف اسم الفئة وصورة جذابة</p>
                <div className="w-24 h-1 bg-gradient-nsr-elegant rounded-full mt-3"></div>
              </div>
            </div>

            <div className="flex items-center gap-4">


              {/* Back Button */}
              <Link
                to="/categories"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 bg-nsr-primary/10 backdrop-blur-sm border border-nsr-primary/20 text-nsr-light hover:border-nsr-accent/30 transition-all duration-500 hover:bg-nsr-primary/20 hover:scale-105"
              >
                <ArrowRight className="h-6 w-6 transition-all duration-300 group-hover:-translate-x-1" />
                <span className="font-semibold text-lg">العودة للفئات</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-nsr-secondary/30 backdrop-blur-sm border border-nsr-primary/20 rounded-3xl overflow-hidden shadow-2xl">

            {/* Form Container */}
            <div className="p-8 space-y-10">

              {/* Basic Information Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-nsr-primary/20">
                  <div className="p-3 bg-gradient-nsr-elegant/20 rounded-2xl border border-nsr-accent/30">
                    <Save className="h-6 w-6 text-nsr-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-nsr-light">اسم الفئة</h2>
                    <p className="text-nsr-light-200 mt-1">أدخل اسم الفئة الجديدة</p>
                  </div>
                </div>

                {/* Category Name */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-nsr-light-200 flex items-center gap-2">
                    اسم الفئة
                    <Star className="w-4 h-4 text-red-400" />
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-5 bg-nsr-primary/20 border rounded-2xl text-nsr-light placeholder-nsr-light-200 focus:outline-none transition-all duration-300 text-xl ${errors.name
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-nsr-primary/30 focus:border-nsr-accent focus:ring-2 focus:ring-nsr-accent/20'
                      }`}
                    placeholder="مثال: أجهزة الكمبيوتر المكتبية"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Category Description */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-nsr-light-200 flex items-center gap-2">
                    وصف الفئة (اختياري)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-6 py-5 bg-nsr-primary/20 border border-nsr-primary/30 rounded-2xl text-nsr-light placeholder-nsr-light-200 focus:outline-none focus:border-nsr-accent focus:ring-2 focus:ring-nsr-accent/20 transition-all duration-300 text-xl resize-none"
                    placeholder="أدخل وصفاً مختصراً للفئة..."
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                  <div className="p-3 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl border border-pink-500/30">
                    <Image className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">صورة الفئة</h2>
                    <p className="text-slate-400 mt-1">ارفع صورة جذابة وعالية الجودة</p>
                  </div>
                </div>

                <div>
                  {!imagePreview ? (
                    <div className={`relative border-2 border-dashed rounded-3xl py-20 px-6 transition-all duration-300 bg-slate-800/20 hover:bg-slate-800/40 cursor-pointer group ${errors.image
                      ? 'border-red-500/50'
                      : 'border-slate-700/50 hover:border-indigo-500/50'
                      }`}>
                      <input
                        type="file"
                        id="category-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="category-image" className="cursor-pointer w-full">
                        <div className="text-center space-y-6">
                          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110 border border-indigo-500/20">
                            <Upload className="h-12 w-12 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                              انقر لرفع صورة أو اسحبها هنا
                            </p>
                            <p className="text-slate-400 text-lg">
                              PNG, JPG, GIF حتى 10 ميجابايت
                            </p>
                            <p className="text-slate-500 text-sm">
                              الحد الأدنى للدقة: 800x600 بكسل
                            </p>
                          </div>
                        </div>
                      </label>

                      {errors.image && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                            <AlertCircle className="w-4 h-4" />
                            {errors.image}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
                        <img
                          src={imagePreview}
                          alt="معاينة صورة الفئة"
                          className="w-full h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Success Badge */}
                        <div className="absolute bottom-6 right-6 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">تم رفع الصورة بنجاح</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="absolute top-6 left-6 p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
                      >
                        <X size={22} />
                      </button>

                      {isCompressing && (
                        <div className="absolute inset-0 bg-black/80 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center gap-6 border border-white/20 shadow-2xl">
                            <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-center space-y-2">
                              <p className="text-white font-bold text-xl">جاري معالجة الصورة</p>
                              <p className="text-slate-300">يرجى الانتظار لحظات...</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-end pt-8 border-t border-slate-700/50">
                <button
                  type="button"
                  className="px-8 py-4 border-2 border-slate-600 text-slate-300 rounded-2xl hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 font-semibold text-lg hover:scale-105"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  onClick={handleSubmit}
                  className="relative px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 hover:scale-105 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري إنشاء الفئة...
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      إضافة الفئة الجديدة
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-6">
        <div className="text-center">
          <p className="text-slate-500 text-sm">© 2025 نظام إدارة الفئات المتطور - تم التصميم بعناية فائقة</p>
        </div>
      </div>
    </div>
  );
}