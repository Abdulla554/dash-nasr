import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
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
    description: "",
    link: "",
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
        title: formData.title,
        description: formData.description,
        link: formData.link || null,
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
        {/* Enhanced Header */}
        <div className="py-12 flex pt-10 justify-between items-center">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Add New Banner
            </h1>
            <p className="text-white/70 text-lg font-light">
              Create stunning banners for your business
            </p>
          </div>
          <div className="hover:scale-105 active:scale-95 transition-transform">
            <Link to="/banner">
              <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-nsr-secondary/80 border-2 border-nsr-accent text-nsr-primary hover:bg-nsr-primary/5 transition-all duration-300 shadow-lg hover:shadow-xl group backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Back to Banners
              </button>
            </Link>
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="card-nsr bg-nsr-secondary/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mt-8 mb-14 border border-nsr-accent/20">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information Section */}
            <div className="bg-nsr-secondary/30 rounded-xl p-6 border border-nsr-accent/10">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-nsr-primary to-nsr-accent bg-clip-text text-transparent mb-8 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-nsr-primary to-nsr-accent rounded-full"></div>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Title Field */}
                <div className="space-y-2">
                  <label htmlFor="title" className="flex text-sm font-semibold text-nsr-primary mb-3 items-center gap-2">
                    <div className="w-2 h-2 bg-nsr-accent rounded-full"></div>
                    Banner Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-4 rounded-xl border border-nsr-accent/40 bg-nsr-secondary/50 text-nsr-primary placeholder-nsr-primary/60 focus:border-nsr-primary focus:ring-2 focus:ring-nsr-primary/20 transition-all duration-300 hover:border-nsr-accent/60"
                    placeholder="Enter banner title"
                    required
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label htmlFor="description" className="flex text-sm font-semibold text-nsr-primary mb-3 items-center gap-2">
                    <div className="w-2 h-2 bg-nsr-accent rounded-full"></div>
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-4 rounded-xl border border-nsr-accent/40 bg-nsr-secondary/50 text-nsr-primary placeholder-nsr-primary/60 focus:border-nsr-primary focus:ring-2 focus:ring-nsr-primary/20 transition-all duration-300 hover:border-nsr-accent/60 resize-none"
                    placeholder="Enter banner description"
                  />
                </div>

                {/* Link Field */}
                <div className="space-y-2">
                  <label htmlFor="link" className="flex text-sm font-semibold text-nsr-primary mb-3 items-center gap-2">
                    <div className="w-2 h-2 bg-nsr-accent rounded-full"></div>
                    Banner Link (Optional)
                  </label>
                  <input
                    type="url"
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-4 rounded-xl border border-nsr-accent/40 bg-nsr-secondary/50 text-nsr-primary placeholder-nsr-primary/60 focus:border-nsr-primary focus:ring-2 focus:ring-nsr-primary/20 transition-all duration-300 hover:border-nsr-accent/60"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-4 p-4 bg-nsr-secondary/20 rounded-xl border border-nsr-accent/20">
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

              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-nsr-secondary/30 rounded-xl p-6 border border-nsr-accent/10">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-nsr-primary to-nsr-accent bg-clip-text text-transparent mb-8 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-nsr-primary to-nsr-accent rounded-full"></div>
                Banner Image
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div>
                  <label className="flex text-sm font-semibold text-nsr-primary mb-4 items-center gap-2">
                    <div className="w-2 h-2 bg-nsr-accent rounded-full"></div>
                    Upload Image
                  </label>
                  {!imagePreview ? (
                    <div className="relative border-2 border-dashed rounded-2xl py-20 px-8 border-nsr-accent/40 hover:border-nsr-primary transition-all duration-300 flex items-center justify-center cursor-pointer bg-nsr-secondary/30 hover:bg-nsr-secondary/50 group">
                      <input
                        type="file"
                        id="Banner-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="Banner-image" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="mx-auto h-16 w-16 text-nsr-accent group-hover:text-nsr-primary transition-colors duration-300" />
                          <div className="mt-6 flex text-sm text-nsr-primary justify-center">
                            <span className="text-nsr-accent hover:text-nsr-primary font-semibold">
                              Upload a file
                            </span>
                            <p className="pl-1 text-nsr-primary/70">or drag and drop</p>
                          </div>
                          <p className="text-xs text-nsr-primary/60 mt-3">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          {isCompressing && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-nsr-accent">
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
                        className="w-full h-64 object-cover rounded-2xl border-2 border-nsr-accent/40 hover:border-nsr-primary transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="absolute top-3 right-3 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Banner Preview */}
                <div>
                  <label className="flex text-sm font-semibold text-nsr-primary mb-4 items-center gap-2">
                    <div className="w-2 h-2 bg-nsr-accent rounded-full"></div>
                    Banner Preview
                  </label>
                  <div className="bg-nsr-secondary/20 rounded-2xl p-6 border border-nsr-accent/20 min-h-[200px] flex items-center justify-center">
                    {imagePreview ? (
                      <div className="text-center">
                        <div className="w-full h-32 bg-nsr-secondary/50 rounded-xl border border-nsr-accent/30 flex items-center justify-center mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-nsr-primary/70">Preview your banner</p>
                      </div>
                    ) : (
                      <div className="text-center text-nsr-primary/50">
                        <div className="w-16 h-16 mx-auto mb-4 bg-nsr-secondary/50 rounded-xl flex items-center justify-center">
                          <Upload className="h-8 w-8" />
                        </div>
                        <p className="text-sm">Upload an image to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="flex justify-center md:justify-end pt-6">
              <button
                type="submit"
                disabled={mutation.isPending || isCompressing}
                className="group relative px-12 py-4 bg-gradient-to-r from-nsr-primary to-nsr-accent text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-nsr-accent/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Button Content */}
                <div className="relative z-10 flex items-center gap-3">
                  {mutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Banner...</span>
                    </>
                  ) : isCompressing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Image...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transform transition-transform group-hover:rotate-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Banner</span>
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
