/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Trash, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, easeOut, easeInOut } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import ClipLoader from "react-spinners/ClipLoader";
export default function AllBrands() {
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    data: demoBrands,
    isLoading,
   
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/brands");
        return response.data;
      } catch (error) {
        console.error("Error fetching certificates:", error);
        throw error;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (brandId) => {
      try {
        await axiosInstance.delete(`/brands/${brandId}`);
        return brandId;
      } catch (error) {
        console.error("Error deleting brand:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch certificates query
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: () => {
      toast.error("Failed to delete brand", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const handleDelete = (id) => {
    setSelectedBrandId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBrandId) {
      deleteMutation.mutate(selectedBrandId);
    }
  };
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center min-h-[120px]">
        <ClipLoader color={"#068DF1"} size={48} speedMultiplier={1.2} />
        <span className="text-[#068DF1] font-bold text-lg mt-3">
          جاري التحميل...
        </span>
      </div>
    );
  }
  const renderBrand = (Brand) => {
    if (!Brand) return null;

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        key={Brand.id}
        className="relative group "
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#CE8B39] border-dashed aspect-square bg-white">
          <div className="absolute inset-0 bg-gradient-to-br  from-black/20 to-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img
            src={Brand.image}
            alt={`Brand ${Brand.id}`}
            className="w-full h-full object-fill transform group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center  duration-500">
            <motion.button
              onClick={() => handleDelete(Brand.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-white/10 backdrop-blur-lg border-2 border-[#CE8B39] border-dashed text-black hover:bg-white/20 transition-all duration-300"
            >
              <Trash size={20}  />
            </motion.button>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this brand? This action cannot be undone."
      />
      {/* Luxurious Header */}
      <div className="relative overflow-hidden bg-[#068DF1]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(191,148,93,0.4),rgba(135,206,235,0.2))]"></div>
        </div>

        <div className="relative py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col gap-8"
              >
                <div className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    className="p-4 bg-[#1FA0FF]/10 rounded-2xl backdrop-blur-xl border border-[#1FA0FF]/20"
                  >
                    <Sparkles className="h-8 w-8 text-[#1FA0FF]" />
                  </motion.div>
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                      className="text-6xl font-bold py-2 text-[#1FA0FF]"
                    >
                      Brands
                    </motion.h1>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "8rem" }}
                      transition={{
                        delay: 0.5,
                        duration: 1,
                        ease: "easeInOut",
                      }}
                      className="h-1 bg-[#068DF1] rounded-full mt-3"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Link to="/brands/add">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group/btn overflow-hidden rounded-2xl bg-[#068DF1] px-8 py-4 text-white shadow-lg shadow-[#068DF1]/20"
                  >
                    <span className="absolute inset-0 bg-[#1FA0FF] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></span>
                    <div className="relative z-10 flex items-center gap-3">
                      <Plus className="h-6 w-6 transition-all duration-500 group-hover/btn:rotate-180" />
                      <span className="font-semibold text-lg">Add Brand</span>
                    </div>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxurious Brands Grid */}
      <div className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          {demoBrands?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center py-20 bg-[#068DF1] backdrop-blur-lg rounded-3xl border border-[#068DF1]/10"
            >
              <h3 className="text-2xl font-bold text-[#1FA0FF] mb-3">
                No Brands Found
              </h3>
              <p className="text-white">
                Add your first Brand to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {demoBrands?.map(renderBrand)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
