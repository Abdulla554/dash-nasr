import React, { useState, useEffect } from "react";
import { Plus, Save, Upload, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUpload } from "../../hooks/useUpload";
// هاي المكتبه لتحميل الصور بدون حدود
import imageCompression from "browser-image-compression";

export default function AddBanner() {
  const queryClient = useQueryClient();
  const [BannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    isActive: true
  });
  const { uploadBannerImage } = useUpload();

  const navigate = useNavigate();

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
      console.error("Error compressing image:", error);
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
        toast.error("يجب أن يكون حجم الصورة أقل من 5 ميجابايت", {
          position: "top-center",
          rtl: true,
          theme: "colored",
          autoClose: 3000,
        });
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        setBannerImage(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch {
        toast.error("خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.", {
          position: "top-center",
          rtl: true,
          theme: "colored",
          autoClose: 3000,
        });
      }
    }
  };

  // Add useEffect to monitor BannerImage changes
  useEffect(() => {
    console.log("Banner Image updated:", BannerImage);
    console.log(typeof BannerImage);
  }, [BannerImage]);

  const handleDeleteImage = () => {
    setBannerImage(null);
    setImagePreview(null);
  };

  const mutation = useMutation({
    mutationKey: ["addBanner"],
    mutationFn: async (requestData) => {
      try {
        const response = await axiosInstance.post("/banners", requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data;
      } catch (error) {
        console.error("API Error:", error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Banners"] });
       
      console.log("تم إضافة البانر بنجاح");
      setTimeout(() => {
        navigate("/banner");
      }, 2000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "فشل في إضافة البانر...";
    
      console.error("تفاصيل الخطأ:", error.response?.data);
    },
  });

  const isSubmitting = mutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("يرجى إدخال عنوان البانر...");
      return;
    }

    if (!BannerImage) {
      toast.error("يرجى اختيار صورة أولاً...");
      return;
    }

    if (isCompressing) {
      toast.info("يرجى الانتظار أثناء معالجة الصورة أولاً...");
      return;
    }

    try {
      

      const uploadedImage = await uploadBannerImage(BannerImage);
      console.log("تم رفع الصورة:", uploadedImage);

      // 2. إنشاء البانر مع URL من Cloudflare
      const requestData = {
        title: formData.title,
        isActive: formData.isActive,
        image: uploadedImage, // URL من Cloudflare
      };

      console.log("إنشاء البانر بالبيانات:", requestData);

      mutation.mutate(requestData);
    } catch (error) {
      console.error("خطأ في التسليم:", error);
     
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-[#0A0A0A]" dir="rtl">
      <div className="  px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative  backdrop-blur-sm border-b bg-[#1A1A2E]/30 border-[#2C6D90]/20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#2C6D90]/10"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col gap-4 lg:flex-row md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#2C6D90] rounded-xl sm:rounded-2xl">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">إضافة بانر جديد</h1>
                  <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">إنشاء بانرات مذهلة لعملك</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/banner'}
                  className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 hover:scale-105 w-full lg:w-auto"
                >
                  <span className="font-semibold text-sm sm:text-base lg:text-lg">العودة للبانرات</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="rounded-2xl shadow-2xl p-6 sm:p-8 mt-6 sm:mt-8 mb-10 sm:mb-14 backdrop-blur-lg bg-[#F9F3EF]/5 border border-[#2C6D90]/20">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Banner Title */}
            <div className="bg-[#F9F3EF]/5 rounded-xl p-4 sm:p-6 border border-[#2C6D90]/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#F9F3EF] mb-4 sm:mb-6 flex items-center gap-3">
                <div className="w-1 h-6 sm:h-8 bg-[#2C6D90] rounded-full"></div>
                تفاصيل البانر
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="flex text-sm font-semibold text-[#F9F3EF] mb-3 sm:mb-4 items-center gap-2">
                    <div className="w-2 h-2 bg-[#2C6D90] rounded-full"></div>
                    عنوان البانر
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان البانر..."
                    className="w-full px-4 py-3 bg-[#F9F3EF]/10 border border-[#2C6D90]/30 rounded-xl focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent transition-all duration-300 text-[#F9F3EF] placeholder-[#F9F3EF]/50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-center gap-4 p-4 bg-[#F9F3EF]/5 rounded-xl border border-[#2C6D90]/20">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-5 h-5 text-[#2C6D90] bg-transparent border-[#2C6D90]/40 rounded focus:ring-[#2C6D90] focus:ring-2 transition-all duration-300"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-[#F9F3EF] cursor-pointer">
                بانر نشط
              </label>
            </div>

            {/* Image Upload Section */}
            <div className="bg-[#F9F3EF]/5 rounded-xl p-4 sm:p-6 border border-[#2C6D90]/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#F9F3EF] mb-6 sm:mb-8 flex items-center gap-3">
                <div className="w-1 h-6 sm:h-8 bg-[#2C6D90] rounded-full"></div>
                صورة البانر
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Upload Area */}
                <div>
                  <label className="flex text-sm font-semibold text-[#F9F3EF] mb-3 sm:mb-4 items-center gap-2">
                    <div className="w-2 h-2 bg-[#2C6D90] rounded-full"></div>
                    رفع صورة
                  </label>
                  {!imagePreview ? (
                    <div className="relative border-2 border-dashed rounded-xl sm:rounded-2xl py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-[#2C6D90]/30 hover:border-[#2C6D90]/50 transition-all duration-300 flex items-center justify-center cursor-pointer bg-[#F9F3EF]/5 hover:bg-[#F9F3EF]/10 group">
                      <input
                        type="file"
                        id="Banner-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="Banner-image" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-white transition-colors duration-300" />
                          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row text-sm text-[#F9F3EF] justify-center items-center gap-1">
                            <span className="text-[#2C6D90] font-semibold">
                              رفع ملف
                            </span>
                            <p className="text-[#F9F3EF]/70">أو اسحب وأفلت</p>
                          </div>
                          <p className="text-xs text-[#F9F3EF]/60 mt-2 sm:mt-3">
                            PNG, JPG, GIF حتى 5 ميجابايت
                          </p>
                          {isCompressing && (
                            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-[#2C6D90]">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2C6D90]"></div>
                              <span className="text-sm">جاري الضغط...</span>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="معاينة البانر"
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl sm:rounded-2xl border-2 border-[#2C6D90]/30 hover:border-[#2C6D90]/50 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Banner Preview */}
                <div>
                  <label className="flex text-sm font-semibold text-[#F9F3EF] mb-3 sm:mb-4 items-center gap-2">
                    <div className="w-2 h-2 bg-[#2C6D90] rounded-full"></div>
                    معاينة البانر
                  </label>
                  <div className="bg-[#F9F3EF]/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#2C6D90]/20 min-h-[150px] sm:min-h-[200px] flex items-center justify-center">
                    {imagePreview ? (
                      <div className="text-center">
                        <div className="w-full h-24 sm:h-32 bg-[#F9F3EF]/10 rounded-lg sm:rounded-xl border border-[#2C6D90]/30 flex items-center justify-center mb-3 sm:mb-4">
                          <img
                            src={imagePreview}
                            alt="معاينة"
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-[#F9F3EF]/70">معاينة البانر الخاص بك</p>
                      </div>
                    ) : (
                      <div className="text-center text-[#F9F3EF]/60">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-[#F9F3EF]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <p className="text-xs sm:text-sm">ارفع صورة لرؤية المعاينة</p>
                      </div>
                    )}
                  </div>
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
                      <span>جاري إنشاء البانر...</span>
                    </>
                  ) : isCompressing ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري معالجة الصورة...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6 text-white transform transition-transform group-hover:rotate-12" />
                      <span>إضافة بنر الجديد</span>
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
