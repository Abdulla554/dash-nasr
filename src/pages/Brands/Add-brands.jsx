import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
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
    <div className="min-h-screen pb-10 bg-nsr-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 flex pt-10 justify-between items-center">
          <h1 className="text-3xl font-bold font-serif text-white">
            Add New Brand
          </h1>
          <div className="hover:scale-105 active:scale-95 transition-transform">
            <Link to="/brands">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nsr-secondary/80 border-2 border-nsr-accent text-nsr-primary hover:bg-nsr-primary/5 transition-all duration-300 shadow-sm hover:shadow-md group">
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
                Back to Brands
              </button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="card-nsr bg-nsr-secondary/80 backdrop-blur-lg rounded-xl shadow-lg p-8 mt-5 mb-14 border border-nsr-accent/20">
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
                    className="w-full px-4 py-3 bg-nsr-secondary/50 border border-nsr-accent/30 rounded-lg text-nsr-light placeholder-nsr-light/50 focus:outline-none focus:border-nsr-primary focus:ring-2 focus:ring-nsr-primary/20 transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-nsr-secondary/50 border border-nsr-accent/30 rounded-lg text-nsr-light placeholder-nsr-light/50 focus:outline-none focus:border-nsr-primary focus:ring-2 focus:ring-nsr-primary/20 transition-all duration-300 resize-none"
                    placeholder="أدخل وصفاً مختصراً للماركة..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-nsr-primary mb-3">
                    Brand Image
                  </label>
                  {!imagePreview ? (
                    <div className="relative border-2 border-dashed rounded-lg py-16 px-6 border-nsr-accent/40 hover:border-nsr-primary transition-all duration-300 flex items-center justify-center cursor-pointer bg-nsr-secondary/50">
                      <input
                        type="file"
                        id="Brand-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="Brand-image" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-[#8B6B43]" />
                          <div className="mt-4 flex text-sm text-[#1e4b6b]">
                            <span className="text-[#8B6B43] hover:text-[#ECB774]">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-[#1e4b6b]/70 mt-2">
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
                        className="w-full h-64 object-contain rounded-lg border-2 border-[#ECB774]/40"
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
                className="bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-[#8B6B43]/25 transition-all duration-300 hover:scale-105"
              >
                Add Brand
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
