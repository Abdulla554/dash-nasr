/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Upload, X, Plus } from "lucide-react";
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
        toast.error("Image size should be less than 5MB", {
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
        toast.error("Error processing image. Please try again.", {
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
    console.log("Brand Image updated:", brandImage);
    console.log(typeof brandImage);
  }, [brandImage]);

  const handleDeleteImage = () => {
    setBrandImage(null);
    setImagePreview(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم الماركة");
      return;
    }

    if (isCompressing) {
      toast.info("يرجى الانتظار حتى انتهاء معالجة الصورة...");
      return;
    }

    try {
      let logoUrl = "";

      // رفع الصورة إلى Cloudflare إذا كانت موجودة
      if (brandImage) {
        toast.info("جاري رفع الصورة إلى Cloudflare...", {
          position: "top-center",
          rtl: true,
          theme: "colored",
          autoClose: 2000,
        });

        const uploadedImage = await uploadBrandImage(brandImage);
        logoUrl = uploadedImage.url || uploadedImage;
        console.log("Uploaded brand logo:", uploadedImage);
      }

      const brandData = {
        name: formData.name,
        description: formData.description || "",
        logo: logoUrl // URL من Cloudflare
      };

      console.log("Creating brand:", brandData);

      await createBrandMutation.mutateAsync(brandData);

      toast.success("تم إضافة الماركة بنجاح!");

      // Reset form
      setFormData({ name: "", description: "" });
      setImagePreview(null);
      setBrandImage(null);

      // Navigate back
      navigate("/brands");

    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error("حدث خطأ أثناء إضافة الماركة");
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
                Basic Information
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
                    Brand Image
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
                          <Plus className="mx-auto h-12 w-12 text-[#2C6D90]" />
                          <div className="mt-4 flex text-sm text-[#2C6D90]">
                            <span className="text-[#2C6D90] hover:text-[#ECB774]">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-[#2C6D90]/70 mt-2">
                            PNG, JPG, GIF up to 10MB
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

            {/* Submit Button */}
            <div className="flex justify-center md:justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#2C6D90] to-[#2C6D90] text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-[#2C6D90]/25 transition-all duration-300 hover:scale-105"
              >
                إضافة الماركة
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
