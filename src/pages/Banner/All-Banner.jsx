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
export default function AllBanner() {
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    data: banners,
    isLoading,
    error
  } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/banners");
        return response.data;
      } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (bannerId) => {
      try {
        await axiosInstance.delete(`/banners/${bannerId}`);
        return bannerId;
      } catch (error) {
        console.error("Error deleting banner:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch banners query
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: () => {
      toast.error("Failed to delete banner", {
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
    setSelectedBannerId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBannerId) {
      deleteMutation.mutate(selectedBannerId);
    }
  };
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
  const renderBanner = (Banner) => {
    if (!Banner) return null;

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        key={Banner.id}
        className="relative group"
      >
        <div className="card-nsr relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-nsr-primary border-dashed aspect-square bg-nsr-secondary">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img
            src={Banner.image}
            alt={`Banner ${Banner.id}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center duration-500">
            <motion.button
              onClick={() => handleDelete(Banner.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 sm:p-3 rounded-full bg-nsr-accent/10 backdrop-blur-lg border-2 border-nsr-accent border-dashed text-nsr-accent hover:bg-nsr-accent/20 transition-all duration-300"
            >
              <Trash size={16} className="sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this banner? This action cannot be undone."
      />
      {/* Header */}
      <div className="relative backdrop-blur-sm border-b bg-[#1A1A2E]/30 border-[#2C6D90]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#2C6D90]/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#2C6D90] rounded-xl sm:rounded-2xl">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">إدارة البانرات</h1>
                <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">إدارة شاملة لجميع البانرات المعروضة في الموقع</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/banner/add'}
                className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 hover:scale-105 w-full lg:w-auto"
              >
                <span className="font-semibold text-sm sm:text-base lg:text-lg">إضافة بانر جديد</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Luxurious Banner Grid */}
      <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {banners?.length === 0 ? (
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center py-12 sm:py-16 lg:py-20 bg-[#F9F3EF]/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-[#2C6D90]/20"
            >
            <h3 className="text-xl sm:text-2xl font-bold text-[#F9F3EF] mb-2 sm:mb-3">
                No Banner Found
              </h3>
            <p className="text-[#F9F3EF]/70 text-sm sm:text-base">
                Add your first Banner to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {banners?.map(renderBanner)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
