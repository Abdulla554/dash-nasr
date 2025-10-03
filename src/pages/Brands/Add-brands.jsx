/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Upload, X, Plus, Save } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCreateBrand } from "../../hooks/useBrandsQuery";
import { useUpload } from "../../hooks/useUpload";
// هاي المكتبه لتحميل الصور بدون حدود
import imageCompression from "browser-image-compression";

export default function AddBrand() {
  const [brandImage, setBrandImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();
  const createBrandMutation = useCreateBrand();
  const { uploadBrandImage } = useUpload();
  const isSubmitting = createBrandMutation.isPending;
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      setIsCompressing(true);
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("خطأ في معالجة الصورة:", error);
      throw error;
    } finally {
      setIsCompressing(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت...", {
          position: "top-center",
          rtl: true,
          theme: "colored",
          autoClose: 3000,
        });
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        setBrandImage(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch {
        toast.error("خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى...", {
          position: "top-center",
          rtl: true,
          theme: "colored",
          autoClose: 3000,
        });
      }
    }
  };
  

  // Add useEffect to monitor brandImage changes
  useEffect(() => {
    console.log("تم تحديث صورة الماركة:", brandImage);
    console.log(typeof brandImage);
    window.scrollTo(0, 0);
  }, [brandImage]);

  const handleDeleteImage = () => {
    setBrandImage(null);
    setImagePreview(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم الماركة...", {
        position: "top-center",
        rtl: true,
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }

    if (isCompressing) {
      toast.info("يرجى الانتظار حتى انتهاء معالجة الصورة أولاً...", {
        position: "top-center",
        rtl: true,
        theme: "colored",
        autoClose: 3000,
      });
      return;
    }

    try {
      let logoUrl = "";

      // رفع الصورة إلى Cloudflare إذا كانت موجودة
      if (brandImage) {
       

        const uploadedImage = await uploadBrandImage(brandImage);
        logoUrl = uploadedImage.url || uploadedImage;
          console.log("تم رفع صورة الماركة بنجاح:", uploadedImage);
         
      }

      const brandData = {
        name: formData.name,
        description: formData.description || "",
        logo: logoUrl // URL من Cloudflare
      };

      console.log("إنشاء الماركة:", brandData);

      await createBrandMutation.mutateAsync(brandData);

     

      // Reset form
      setFormData({ name: "", description: "" });
      setImagePreview(null);
      setBrandImage(null);

      // Navigate back
      navigate("/brands");

    } catch (error) {
      console.error("تفاصيل الخطأ:", error);
      
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-[#0A0A0A]" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative backdrop-blur-sm border-b bg-[#1A1A2E]/30 border-[#2C6D90]/20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#2C6D90]/10"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col gap-4 lg:flex-row md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#2C6D90] rounded-xl sm:rounded-2xl">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">إضافة ماركة جديدة</h1>
                  <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">أضف ماركة جديدة إلى متجرك</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/brands'}
                  className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 hover:scale-105 w-full lg:w-auto"
                >
                  <span className="font-semibold text-sm sm:text-base lg:text-lg">العودة للماركات</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl shadow-lg p-8 mt-5 mb-14 backdrop-blur-lg bg-[#F9F3EF]/5 border border-[#2C6D90]/90">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-nsr-primary to-nsr-accent bg-clip-text text-transparent mb-6">
                المعلومات الأساسية
              </h2>
              <div className="space-y-6">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-nsr-primary mb-3">
                    اسم الماركة *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-nsr-secondary/20 border border-[#2C6D90]/90 rounded-lg text-nsr-light placeholder-nsr-light/50 focus:outline-none focus:border-nsr-primary focus:ring-2 focus:ring-nsr-primary/20 transition-all duration-300"
                    placeholder="أدخل اسم الماركة"
                    required
                  />
                </div>

                {/* Brand Description */}
                <div>
                  <label className="block text-sm font-medium text-nsr-primary mb-3">
                    وصف الماركة
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-nsr-secondary/20 border border-[#2C6D90]/90 rounded-lg text-nsr-light placeholder-nsr-light/50 focus:outline-none focus:border-nsr-primary focus:ring-2 focus:ring-nsr-primary/20 transition-all duration-300 resize-none"
                    placeholder="أدخل وصفاً مختصراً للماركة..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-nsr-primary mb-3">
                    صورة الماركة
                  </label>
                  {!imagePreview ? (
                    <div className="relative border-2 border-dashed rounded-lg py-16 px-6 border-[#2C6D90]/40 hover:border-nsr-primary transition-all duration-300 flex items-center justify-center cursor-pointer bg-nsr-secondary/20">
                      <input
                        type="file"
                        id="Brand-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="Brand-image" className="cursor-pointer">
                        <div className="text-center">
                          <Plus className="mx-auto h-12 w-12 text-white" />
                          <div className="mt-4 flex text-sm text-white">
                            <span className="text-[#2C6D90] hover:text-white">
                              رفع ملف
                            </span>
                            <p className="pl-1">أو اسحب وأفلت</p>
                          </div>
                          <p className="text-xs text-white mt-2">
                            PNG, JPG, GIF حتى 10 ميجابايت
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Brand preview"
                        className="w-full h-64 object-contain rounded-lg border-2 border-[#2C6D90]/90"
                      />
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
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

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isCompressing}
                onClick={handleSubmit}
                className="group relative px-10 py-4 bg-gradient-to-r from-[#2C6D90] to-[#3b82f6] text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg shadow-[#2C6D90]/25 hover:shadow-xl hover:shadow-[#2C6D90]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 hover:scale-105 text-lg overflow-hidden"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transform transition-transform duration-1000"></div>

                {/* Button Content */}
                <div className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري إنشاء الماركة...</span>
                    </>
                  ) : isCompressing ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري معالجة الصورة...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6 text-white transform transition-transform group-hover:rotate-12" />
                      <span>إضافة الماركة الجديدة</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
