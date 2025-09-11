import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import imageCompression from "browser-image-compression";

export default function AddProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [categorieid, setCategorieid] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Product Image updated:", productImage);
  }, [productImage]);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/categories");
        return response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 600,
      useWebWorker: true,
      initialQuality: 0.5,
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
      if (compressedFile.size > 200 * 1024) {
        // 200 KB
        toast.error(
          "Image is still too large after compression. Please choose a smaller image."
        );
        return;
      }
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
        setProductImage(compressedFile);

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

  const handleDeleteImage = () => {
    setProductImage(null);
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
    mutationKey: ["addProducts"],
    mutationFn: async (requestData) => {
      try {
        const response = await axiosInstance.post("/products", requestData);
        return response.data;
      } catch (error) {
        console.error("API Error:", error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("products add successfully", {
        position: "top-center",
        rtl: true,
        theme: "colored",
        autoClose: 2000,
      });
      console.log("products added successfully");
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add products";
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

    const requestData = {
      title: formData.title,
      description: formData.description,
      image: imagePreview,
      categoryId: categorieid,
    };
    // console.log(requestData);
    // console.log(typeof requestData.image);
    // console.log(typeof requestData.description);
    // console.log(typeof requestData.title);
    // console.log(typeof requestData.categoryId);
    // const requestData = new FormData();
    // requestData.append("title", formData.title);
    // requestData.append("description", formData.description);
    // requestData.append("image", imagePreview);
    // requestData.append("categoryId", categorieid);
    try {
      mutation.mutate(requestData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }

  };
  return (
    <div className="min-h-screen pb-10 bg-nsr-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 flex pt-10 justify-between items-center">
          <h1 className="text-3xl font-bold font-serif text-white">
            Add New Product
          </h1>
          <div className="hover:scale-105 active:scale-95 transition-transform">
            <Link to="/products">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nsr-secondary/80 border-2 border-nsr-primary text-nsr-primary hover:bg-nsr-primary/5 transition-all duration-300 shadow-sm hover:shadow-md group">
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
                Back to Products
              </button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 mt-5 mb-14 border border-[#068DF1]/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-[#068DF1] mb-6">
                Basic Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[#068DF1] mb-3"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    name="title"
                    className="w-full px-4 py-2 border border-[#068DF1]/20 rounded-lg focus:ring-2 focus:ring-[#068DF1] focus:border-transparent transition-all duration-300 bg-white/50"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-[#068DF1] mb-3"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={categorieid}
                    onChange={(e) => setCategorieid(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-[#068DF1]/20 rounded-lg focus:ring-2 focus:ring-[#068DF1] focus:border-transparent transition-all duration-300 bg-white/50"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#068DF1] mb-3"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-6 border border-[#068DF1]/20 rounded-lg focus:ring-2 focus:ring-[#068DF1] focus:border-transparent transition-all duration-300 bg-white/50"
                    placeholder="Enter product description"
                  />
                </div>

                {/* <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-[#068DF1] mb-3"
                  >
                    Price
                  </label>
                  <textarea
                    id="price"
                    name="price"
                    value={price}
                    onChange={(e) =>
                      setPrice(parseInt(e.target.value))
                    }
                    rows={1}
                    className="w-full px-4 py-6 border border-[#068DF1]/20 rounded-lg focus:ring-2 focus:ring-[#068DF1] focus:border-transparent transition-all duration-300 bg-white/50"
                    placeholder="Enter product price"
                  />
                </div> */}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#1e4b6b] mb-3">
                    Categorie Image
                  </label>
                  <div>
                    {!imagePreview ? (
                      <div className="relative border-2 border-dashed rounded-lg py-16 px-6 border-[#068DF1]/40 hover:border-[#1FA0FF] transition-all duration-300 flex items-center justify-center cursor-pointer bg-white/50">
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
                            <Upload className="mx-auto h-12 w-12 text-[#068DF1]" />
                            <div className="mt-4 flex text-sm text-[#068DF1]">
                              <span className="text-[#068DF1] hover:text-[#1FA0FF]">
                                Upload a file
                              </span>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-[#068DF1]/70 mt-2">
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
                          className="w-full h-64 object-contain rounded-lg border-2 border-[#068DF1]/40"
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
                className="bg-[#068DF1] text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-[#068DF1]/25 transition-all duration-300 hover:scale-105"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
