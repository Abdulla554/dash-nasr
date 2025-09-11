/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Trash, Plus, Sparkles, Download, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import ClipLoader from "react-spinners/ClipLoader";
export default function AllProduct() {
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategorieId, setSelectedCategorieId] = useState(null);
  const location = useLocation();



  const {
    data: demoProducts,
    isLoading, 
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/products");
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    refetch();
  }, [location, refetch]);

  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        return productId;
      } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch certificates query
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: () => {
      toast.error("Failed to delete product", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center min-h-[120px] bg-nsr-dark">
        <ClipLoader color={"#1A73E8"} size={48} speedMultiplier={1.2} />
        <span className="text-nsr-primary font-bold text-lg mt-3">
          جاري التحميل...
        </span>
      </div>
    );
  }
  const handleDelete = (id) => {
    setSelectedCategorieId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategorieId) {
      deleteMutation.mutate(selectedCategorieId);
    }
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const renderProduct = (product) => {
    if (!product) return null;

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        key={product.id}
        className="card-nsr bg-nsr-secondary/80 rounded-3xl p-4 w-full backdrop-blur-lg border-2 border-nsr-primary border-dashed shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_40px_rgb(26,115,232,0.15)] group"
      >
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6">
          <img
            src={product.image}
            alt={product.title || "Product"}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-nsr-primary group-hover:text-nsr-accent transition-all duration-300">
            {product.title || "Untitled Product"}
          </h2>
          <p className="text-nsr-neutral line-clamp-2 font-light">
            {product.description || "No description available"}
          </p>

          <div className="pt-4 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete(product.id)}
              className="px-5 py-2.5 rounded-xl bg-red-50 border border-red-500 hover:border-red-600 border-dashed text-red-600 flex items-center gap-2 hover:bg-red-100 transition-all duration-300 group/btn"
            >
              <span className="font-medium">Delete</span>
              <Trash
                size={18}
                className="group-hover/btn:rotate-12 transition-transform duration-300"
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-nsr-dark">
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this categorie? This action cannot be undone."
      />
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-nsr-primary to-nsr-secondary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15"></div>
          <div className="absolute inset-0 bg-nsr-accent/20"></div>
        </div>

        <div className="relative py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-8"
              >
                <div className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    className="p-4 bg-nsr-accent/10 rounded-2xl backdrop-blur-xl border border-nsr-accent/20 neon-glow"
                  >
                    <Sparkles className="h-8 w-8 text-nsr-accent" />
                  </motion.div>
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="text-5xl py-2 font-bold text-nsr-accent"
                    >
                      Products
                    </motion.h1>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "6rem" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-1.5 bg-nsr-accent rounded-full mt-3"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Link to="/products/add">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-white shadow-lg shadow-nsr-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-nsr-accent/40 group"
                  >
                    <span className="absolute inset-0 bg-nsr-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                    <Plus className="h-6 w-6 transition-all duration-500 group-hover:rotate-180 relative z-10" />
                    <span className="font-semibold relative z-10 text-lg">
                      Add Product
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="py-6 px-6">
        <div className="mx-auto max-w-7xl">
          {demoProducts?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center py-20 bg-[#068DF1] rounded-3xl "
            >
              <h3 className="text-2xl font-bold text-white mb-3">
                No Products Found
              </h3>
              <p className="text-white">
                Add your first Product to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {demoProducts?.map(renderProduct)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
