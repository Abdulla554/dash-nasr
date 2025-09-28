import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
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
        setBannerImage(compressedFile);
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
      toast.success("Banner added successfully", {
        position: "top-center",
        rtl: true,
        theme: "colored",
        autoClose: 2000,
      });
      console.log("Banner added successfully");
      setTimeout(() => {
        navigate("/banner");
      }, 2000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add Banner";
      toast.error(errorMessage, {
        position: "top-center",
        rtl: true,
        theme: "colored",
        autoClose: 2000,
      });
      console.error("Error details:", error.response?.data);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!BannerImage) {
      toast.error("Please select an image first");
      return;
    }

    if (isCompressing) {
      toast.info("Please wait while the image is being processed...");
      return;
    }

    try {
      // 1. رفع الصورة إلى Cloudflare أولاً
      toast.info("Uploading image to Cloudflare...", {
        position: "top-center",
        rtl: true,
        theme: "colored",
        autoClose: 2000,
      });

      const uploadedImage = await uploadBannerImage(BannerImage);
      console.log("Uploaded image:", uploadedImage);

      // 2. إنشاء البانر مع URL من Cloudflare
      const requestData = {
        isActive: formData.isActive,
        image: uploadedImage, // URL من Cloudflare
      };

      console.log("Creating banner with data:", requestData);

      mutation.mutate(requestData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-nsr-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative backdrop-blur-sm border-b bg-[#F9F3EF]/5 border-[#749BC2]/20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#749BC2]/10"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] rounded-xl sm:rounded-2xl">
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">إضافة بانر جديد</h1>
                  <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">إنشاء بانرات مذهلة لعملك</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/banner'}
                  className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] text-white shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 hover:scale-105 w-full lg:w-auto"
                >
                  <span className="font-semibold text-sm sm:text-base lg:text-lg">العودة للبانرات</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="card-nsr bg-nsr-secondary/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 mt-6 sm:mt-8 mb-10 sm:mb-14 border border-nsr-accent/20">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Active Status */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-nsr-secondary/20 rounded-xl border border-nsr-accent/20">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-5 h-5 text-nsr-primary bg-nsr-secondary border-nsr-accent rounded focus:ring-nsr-primary focus:ring-2 transition-all duration-300"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-nsr-primary cursor-pointer">
                Active Banner
              </label>
            </div>

            {/* Image Upload Section */}
            <div className="bg-nsr-secondary/30 rounded-xl p-4 sm:p-6 border border-nsr-accent/10">
              <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-nsr-primary to-nsr-accent bg-clip-text text-transparent mb-6 sm:mb-8 flex items-center gap-3">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-nsr-primary to-nsr-accent rounded-full"></div>
                Banner Image
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Upload Area */}
                <div>
                  <label className="flex text-sm font-semibold text-nsr-primary mb-3 sm:mb-4 items-center gap-2">
                    <div className="w-2 h-2 bg-nsr-accent rounded-full"></div>
                    Upload Image
                  </label>
                  {!imagePreview ? (
                    <div className="relative border-2 border-dashed rounded-xl sm:rounded-2xl py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-nsr-accent/40 hover:border-nsr-primary transition-all duration-300 flex items-center justify-center cursor-pointer bg-nsr-secondary/30 hover:bg-nsr-secondary/50 group">
                      <input
                        type="file"
                        id="Banner-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="Banner-image" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-nsr-accent group-hover:text-nsr-primary transition-colors duration-300" />
                          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row text-sm text-nsr-primary justify-center items-center gap-1">
                            <span className="text-nsr-accent hover:text-nsr-primary font-semibold">
                              Upload a file
                            </span>
                            <p className="text-nsr-primary/70">or drag and drop</p>
                          </div>
                          <p className="text-xs text-nsr-primary/60 mt-2 sm:mt-3">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          {isCompressing && (
                            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-nsr-accent">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nsr-accent"></div>
                              <span className="text-sm">Compressing...</span>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Banner preview"
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl sm:rounded-2xl border-2 border-nsr-accent/40 hover:border-nsr-primary transition-all duration-300"
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
                  <label className="flex text-sm font-semibold text-nsr-primary mb-3 sm:mb-4 items-center gap-2">
                    <div className="w-2 h-2 bg-nsr-accent rounded-full"></div>
                    Banner Preview
                  </label>
                  <div className="bg-nsr-secondary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-nsr-accent/20 min-h-[150px] sm:min-h-[200px] flex items-center justify-center">
                    {imagePreview ? (
                      <div className="text-center">
                        <div className="w-full h-24 sm:h-32 bg-nsr-secondary/50 rounded-lg sm:rounded-xl border border-nsr-accent/30 flex items-center justify-center mb-3 sm:mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-nsr-primary/70">Preview your banner</p>
                      </div>
                    ) : (
                      <div className="text-center text-nsr-primary/50">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-nsr-secondary/50 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <p className="text-xs sm:text-sm">Upload an image to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={mutation.isPending || isCompressing}
                className="group relative px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-nsr-primary to-nsr-accent text-white font-semibold rounded-xl sm:rounded-2xl hover:shadow-2xl hover:shadow-nsr-accent/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden w-full sm:w-auto"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Button Content */}
                <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  {mutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="text-sm sm:text-base">Creating Banner...</span>
                    </>
                  ) : isCompressing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="text-sm sm:text-base">Processing Image...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 transform transition-transform group-hover:rotate-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm sm:text-base">Create Banner</span>
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
