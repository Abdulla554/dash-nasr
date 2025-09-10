import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import imageCompression from "browser-image-compression";

export default function AddCategorie() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [categorieImage, setCategorieImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      initialQuality: 0.7,
    };

    try {
      setIsCompressing(true);
      const compressedFile = await imageCompression(file, options);
      console.log("Original file size:", file.size / 1024 / 1024, "MB");
      console.log(
        "Compressed file size:",
        compressedFile.size / 1024 / 1024,
        "MB"
      );
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
      try {
        const compressedFile = await compressImage(file);
        setCategorieImage(compressedFile);

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
  useEffect(() => {
    console.log("Categorie Image updated:", categorieImage);
    console.log(typeof categorieImage);
  }, [categorieImage]);

  const handleDeleteImage = () => {
    setCategorieImage(null);
    setImagePreview(null);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const mutation = useMutation({
    mutationKey: ["addCategories"],
    mutationFn: async (requestData) => {
      try {
        const response = await axiosInstance.post("/categories", requestData, {
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
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("categories added successfully", {
        position: "top-center",
        rtl: true,
        theme: "colored",
        autoClose: 2000,
      });
      console.log("categories added successfully");
      setTimeout(() => {
        navigate("/categories");
      }, 2000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add categories";
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

    if (!imagePreview) {
      toast.error("Please select an image first");
      return;
    }

    if (isCompressing) {
      toast.info("Please wait while the image is being processed...");
      return;
    }

    // Create a simple object with the image string
    const requestData = {
      title: formData.title,
      description: formData.description,
      image: imagePreview,
    };

    try {
      mutation.mutate(requestData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-gradient-to-br from-[#1e4b6b]/5 via-[#8B6B43]/5 to-[#634927]/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 flex pt-10 justify-between items-center">
          <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] bg-clip-text text-transparent">
            Add New Categorie
          </h1>
          <div className="hover:scale-105 active:scale-95 transition-transform">
            <Link to="/Categories">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 border-2 border-[#ECB774] text-[#1e4b6b] hover:bg-[#1e4b6b]/5 transition-all duration-300 shadow-sm hover:shadow-md group">
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
                Back to Categories
              </button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 mt-5 mb-14 border border-[#ECB774]/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] bg-clip-text text-transparent mb-6">
                Basic Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[#1e4b6b] mb-3"
                  >
                    Categorie Name
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    name="title"
                    className="w-full px-4 py-2 border-2 border-[#ECB774]/20 rounded-lg focus:ring-2 focus:ring-[#8B6B43] focus:border-transparent transition-all duration-300 bg-white/50"
                    placeholder="Enter Categorie name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#1e4b6b] mb-3"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-6 border-2 border-[#ECB774]/20 rounded-lg focus:ring-2 focus:ring-[#8B6B43] focus:border-transparent transition-all duration-300 bg-white/50"
                    placeholder="Enter Categorie description"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#1e4b6b] mb-3">
                    Categorie Image
                  </label>
                  <div>
                    {!imagePreview ? (
                      <div className="relative border-2 border-dashed rounded-lg py-16 px-6 border-[#ECB774]/40 hover:border-[#8B6B43] transition-all duration-300 flex items-center justify-center cursor-pointer bg-white/50">
                        <input
                          type="file"
                          id="Categorie-image"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="Categorie-image"
                          className="cursor-pointer"
                        >
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
                          alt="Categorie preview"
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
            </div>

            {/* Submit Button */}
            <div className="flex justify-center md:justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-[#8B6B43]/25 transition-all duration-300 hover:scale-105"
              >
                Add Categorie
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
