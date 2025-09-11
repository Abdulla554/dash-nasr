/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Trash, Plus, Sparkles, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, easeOut, easeInOut } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import ClipLoader from "react-spinners/ClipLoader";
export default function AllCategories() {
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategorieId, setSelectedCategorieId] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    data: demoCategories,
    isLoading,

  } = useQuery({
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

  const deleteMutation = useMutation({
    mutationFn: async (categorieId) => {
      try {
        await axiosInstance.delete(`/categories/${categorieId}`);
        return categorieId;
      } catch (error) {
        console.error("Error deleting categorie:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch certificates query
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categorie deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: () => {
      toast.error("Failed to delete categorie", {
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
  // Demo Categories data

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

  const renderCategorie = (Categorie) => {
    if (!Categorie) return null;

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        key={Categorie.id}
        className="card-nsr relative border-2 border-nsr-primary border-dashed  rounded-3xl p-5 w-full backdrop-blur-lg  shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:shadow-[0_15px_40px_rgb(26,115,232,0.2)] group overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-nsr-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Glowing orb effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-nsr-accent rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 border border-nsr-accent/10">
            <div className="absolute inset-0 bg-gradient-to-t from-nsr-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <img
              src={Categorie.image}
              alt={Categorie.title || "Categorie"}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          <div className="space-y-4 relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-nsr-primary via-nsr-accent to-nsr-secondary bg-clip-text text-transparent group-hover:from-nsr-accent group-hover:via-nsr-primary group-hover:to-nsr-secondary transition-all duration-500">
              {Categorie.title || "Untitled Categorie"}
            </h2>
            <p className="text-nsr-neutral line-clamp-2 font-light group-hover:text-nsr-accent/90 transition-colors duration-300">
              {Categorie.description || "No description available"}
            </p>

            <div className="pt-4 flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(Categorie.id)}
                className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/50 hover:border-red-600 text-red-600 flex items-center gap-2 hover:bg-red-100/20 transition-all duration-300 group/btn overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                <span className="font-medium relative z-10">Delete</span>
                <Trash
                  size={18}
                  className="relative z-10 group-hover/btn:rotate-12 transition-transform duration-300"
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#068DF1]/5">
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
                      Categorie
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
                <Link to="/categories/add">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-white shadow-lg shadow-nsr-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-nsr-accent/40 group"
                  >
                    <span className="absolute inset-0 bg-nsr-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                    <Plus className="h-6 w-6 transition-all duration-500 group-hover:rotate-180 relative z-10" />
                    <span className="font-semibold relative z-10 text-lg">
                      Add Categorie 
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
          {demoCategories?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center py-20 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] backdrop-blur-lg rounded-3xl border border-[#ECB774]/10"
            >
              <h3 className="text-2xl font-bold text-[#1FA0FF] mb-3">
                No Categories Found
              </h3>
              <p className="text-[#87CEEB]">
                Add your first Categorie to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {demoCategories?.map(renderCategorie)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
