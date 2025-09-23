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
        whileHover={{ scale: 1.05 }}
        key={Banner.id}
        className="relative group "
      >
        <div className="card-nsr relative overflow-hidden rounded-2xl border-2 border-nsr-primary border-dashed aspect-square bg-nsr-secondary">
          <div className="absolute inset-0 bg-gradient-to-br  from-black/20 to-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img
            src={Banner.image}
            alt={`Banner ${Banner.id}`}
            className="w-full h-full object-fill transform group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center  duration-500">
            <motion.button
              onClick={() => handleDelete(Banner.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-nsr-accent/10 backdrop-blur-lg border-2 border-nsr-accent border-dashed text-nsr-accent hover:bg-nsr-accent/20 transition-all duration-300"
            >
              <Trash size={20} />
            </motion.button>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
        message="Are you sure you want to delete this banner? This action cannot be undone."
      />
      {/* Modern Header */}
      <div
        style={{
          backgroundImage: "url('/1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        className="w-full  px-8 py-16 flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent animate-pulse"
          style={{ animationDuration: '3s' }} />

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-spin"
          style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-nsr-accent/30 rounded-full animate-bounce"
          style={{ animationDuration: '4s' }} />

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping"
          style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-nsr-accent/50 rounded-full animate-ping"
          style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/60 rounded-full animate-ping"
          style={{ animationDelay: '0.5s' }} />

        {/* Main Content Container */}
        <div className="relative z-20  flex items-center justify-between w-full">

          {/* Animated Title with Glow Effect */}
          <div className="mb-8 relative">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 relative z-10 
                     bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent
                     drop-shadow-2xl animate-fadeInUp">
              Banner List
            </h2>

            {/* Glowing underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 
                      bg-gradient-to-r from-transparent via-nsr-accent to-transparent 
                      rounded-full animate-glow" />

            {/* Subtitle */}
            <p className="text-white/80 text-lg mt-6 font-light tracking-wide animate-fadeInUp"
              style={{ animationDelay: '0.3s' }}>
              Discover and manage your business Banner
            </p>
          </div>


          {/* Premium Action Button */}
          <Link to="/banner/add">
            <button className="group relative px-12 py-5 bg-nsr-primary backdrop-blur-lg
                         text-white hover:text-nsr-primary font-bold text-xl rounded-none border-2 border-white/40
                         transform transition-all duration-700 hover:scale-105 hover:-rotate-1
                         animate-slideUp shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                         hover:shadow-[0_16px_64px_rgba(26,115,232,0.4)]
                         hover:bg-white/20 hover:border-nsr-primary"
              style={{ animationDelay: '0.8s', clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}>

              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1000" />

              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-4">
                {/* Premium Icon */}
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 transform transition-all duration-500 group-hover:rotate-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>

                  {/* Icon Aura */}
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-lg scale-150 opacity-0 
                            group-hover:opacity-100 transition-all duration-500" />
                </div>

                {/* Button Text */}
                <span className="tracking-wide relative">
                  Add New Banner
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/80 
                            group-hover:w-full transition-all duration-500" />
                </span>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white/60 
                        transform -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0
                        transition-transform duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white/60 
                        transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0
                        transition-transform duration-300" />
            </button>
          </Link>

        </div>
      </div>

      {/* Luxurious Banner Grid */}
      <div className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          {banners?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center py-20 bg-[#068DF1] backdrop-blur-lg rounded-3xl border border-[#068DF1]/10"
            >
              <h3 className="text-2xl font-bold text-[#1FA0FF] mb-3">
                No Banner Found
              </h3>
              <p className="text-white">
                Add your first Banner to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {banners?.map(renderBanner)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
